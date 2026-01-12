import axios from 'axios';
import authClient from './authClient.js';
import logger from '../../utils/logger.js';
import { captureException } from '../../utils/sentry.js';

/**
 * Exponential backoff retry utility
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const exponentialBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on 4xx errors (except 429 rate limit)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        if (error.response.status !== 429) {
          throw error;
        }
      }

      const delay = baseDelay * Math.pow(2, attempt);
      logger.warn(`Request failed (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`, {
        error: error.message,
        status: error.response?.status
      });

      await sleep(delay);
    }
  }

  throw lastError;
};

class ExtensivAPIClient {
  constructor() {
    this.baseURL = process.env.EXTENSIV_BASE_URL || 'https://api.extensiv.com';
    this.customerId = process.env.EXTENSIV_CUSTOMER_ID || null;
  }

  /**
   * Make authenticated request to Extensiv API
   */
  async request(method, endpoint, data = null, options = {}) {
    try {
      // Get valid access token
      const accessToken = await authClient.getAccessToken();

      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        timeout: options.timeout || 30000, // 30 second default timeout
        ...options
      };

      if (data) {
        if (method === 'GET') {
          config.params = data;
        } else {
          config.data = data;
        }
      }

      const response = await exponentialBackoff(
        async () => {
          const res = await axios(config);
          return res;
        },
        options.maxRetries || 3,
        options.baseDelay || 1000
      );

      logger.debug(`Extensiv API ${method} ${endpoint}:`, {
        status: response.status,
        dataLength: response.data?.length || 'N/A'
      });

      return response.data;
    } catch (error) {
      this.handleError(error, method, endpoint);
    }
  }

  /**
   * Handle API errors with appropriate logging and error transformation
   */
  handleError(error, method, endpoint) {
    const context = {
      method,
      endpoint,
      status: error.response?.status,
      data: error.response?.data
    };

    if (error.response) {
      const { status, data } = error.response;

      logger.error(`Extensiv API error [${status}] ${method} ${endpoint}:`, data);

      // Specific error handling
      switch (status) {
        case 401:
          captureException(new Error('Extensiv API 401 Unauthorized'), context);
          // Try to refresh token
          authClient.clearToken();
          throw new Error('Unauthorized: Token expired or invalid. Token cleared, will retry on next request.');

        case 429:
          logger.warn('Rate limit exceeded for Extensiv API');
          throw new Error('Rate limit exceeded. Please try again later.');

        case 400:
          logger.error('Bad request to Extensiv API:', data);
          captureException(new Error('Extensiv API 400 Bad Request'), context);
          throw new Error(`Bad request: ${data.message || 'Invalid parameters'}`);

        case 404:
          throw new Error('Resource not found');

        case 500:
        case 502:
        case 503:
        case 504:
          logger.error('Extensiv API server error:', { status, data });
          captureException(new Error(`Extensiv API ${status} Server Error`), context);
          throw new Error('Extensiv API is currently unavailable. Please try again later.');

        default:
          captureException(error, context);
          throw new Error(`Extensiv API error: ${data.message || error.message}`);
      }
    } else if (error.request) {
      // Request made but no response received
      logger.error('No response from Extensiv API:', error.message);
      captureException(error, context);
      throw new Error('Unable to reach Extensiv API. Please check your network connection.');
    } else {
      // Something else happened
      logger.error('Extensiv API request error:', error.message);
      captureException(error, context);
      throw error;
    }
  }

  /**
   * Convenience methods for different HTTP verbs
   */
  async get(endpoint, params = null, options = {}) {
    return this.request('GET', endpoint, params, options);
  }

  async post(endpoint, data = null, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  async put(endpoint, data = null, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  async patch(endpoint, data = null, options = {}) {
    return this.request('PATCH', endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }
}

// Export singleton instance
export default new ExtensivAPIClient();
