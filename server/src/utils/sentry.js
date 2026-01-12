import * as Sentry from '@sentry/node';
import logger from './logger.js';

export const initializeSentry = (app) => {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    logger.warn('Sentry DSN not configured, error tracking disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app })
    ]
  });

  // RequestHandler creates a separate execution context using domains
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  logger.info('✅ Sentry initialized');
};

export const captureException = (error, context = {}) => {
  logger.error('Exception captured:', { error, context });

  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
};

export const captureMessage = (message, level = 'info', context = {}) => {
  logger[level](message, context);

  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level,
      extra: context
    });
  }
};

export { Sentry };
