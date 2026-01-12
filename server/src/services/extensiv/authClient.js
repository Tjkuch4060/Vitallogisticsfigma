import axios from 'axios';
import { cacheGet, cacheSet } from '../../config/redis.js';
import logger from '../../utils/logger.js';
import { captureException } from '../../utils/sentry.js';

const TOKEN_CACHE_KEY = 'extensiv:access_token';
const TOKEN_EXPIRY = parseInt(process.env.EXTENSIV_TOKEN_EXPIRY || '3600', 10);

class ExtensivAuthClient {
  constructor() {
    this.baseURL = process.env.EXTENSIV_BASE_URL || 'https://api.extensiv.com';
    this.clientId = process.env.EXTENSIV_CLIENT_ID;
    this.clientSecret = process.env.EXTENSIV_CLIENT_SECRET;
    this.customerId = process.env.EXTENSIV_CUSTOMER_ID || null;

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Extensiv credentials not configured. Please set EXTENSIV_CLIENT_ID and EXTENSIV_CLIENT_SECRET');
    }

    this.tokenExpiresAt = null;
  }

  /**
   * Get valid access token (from cache or fetch new one)
   */
  async getAccessToken() {
    try {
      // Check cache first
      const cachedToken = await cacheGet(TOKEN_CACHE_KEY);

      if (cachedToken && cachedToken.expiresAt > Date.now()) {
        logger.debug('Using cached Extensiv access token');
        return cachedToken.token;
      }

      // Token expired or not cached, fetch new one
      logger.info('Fetching new Extensiv access token');
      return await this.fetchNewToken();
    } catch (error) {
      logger.error('Error getting access token:', error);
      captureException(error, { context: 'ExtensivAuthClient.getAccessToken' });
      throw error;
    }
  }

  /**
   * Fetch new access token from Extensiv OAuth endpoint
   */
  async fetchNewToken() {
    try {
      const response = await axios.post(
        `${this.baseURL}/oauth/token`,
        {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      const { access_token, expires_in } = response.data;

      if (!access_token) {
        throw new Error('No access token received from Extensiv');
      }

      // Calculate expiration time (subtract 60 seconds buffer)
      const expiresAt = Date.now() + ((expires_in || TOKEN_EXPIRY) - 60) * 1000;

      // Cache the token
      await cacheSet(
        TOKEN_CACHE_KEY,
        { token: access_token, expiresAt },
        expires_in || TOKEN_EXPIRY
      );

      this.tokenExpiresAt = expiresAt;

      logger.info(`New Extensiv access token obtained, expires in ${expires_in || TOKEN_EXPIRY}s`);

      return access_token;
    } catch (error) {
      if (error.response) {
        logger.error('Extensiv OAuth error:', {
          status: error.response.status,
          data: error.response.data
        });

        if (error.response.status === 401) {
          throw new Error('Invalid Extensiv credentials. Please check EXTENSIV_CLIENT_ID and EXTENSIV_CLIENT_SECRET');
        }
      }

      throw new Error(`Failed to obtain Extensiv access token: ${error.message}`);
    }
  }

  /**
   * Refresh token manually (useful for testing or forced refresh)
   */
  async refreshToken() {
    logger.info('Manually refreshing Extensiv access token');
    return await this.fetchNewToken();
  }

  /**
   * Clear cached token (useful for testing or logout)
   */
  async clearToken() {
    await cacheSet(TOKEN_CACHE_KEY, null);
    this.tokenExpiresAt = null;
    logger.info('Extensiv access token cleared from cache');
  }
}

// Export singleton instance
export default new ExtensivAuthClient();
