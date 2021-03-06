import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import winston from 'winston';
import routes from '../../api/routes';
import { env, apiRoot, apiKey } from '../../config';
import APIError from '../../api/helpers/APIError';

const winstonInstance = new winston.Logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
});

const app = express();

if (env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable detailed API logging in dev env
if (env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true, // optional: log meta data about request (defaults to true)
      msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    })
  );
}

app.use('/health', (_, res) => res.send('OK'));

// Validate API Key and protect all routes
if (env !== 'test') {
  app.use((req, _, next) => {
    const requestKey =
      req.headers.api_key ||
      req.headers.apiKey ||
      req.headers['x-api-key'] ||
      req.query.apiKey ||
      req.query.api_key
    ;
    if (!requestKey) {
      return next(new APIError('Missing Api Key', httpStatus.UNAUTHORIZED, true));
    } else if (requestKey !== apiKey) {
      return next(new APIError('Invalid Api Key', httpStatus.UNAUTHORIZED, true));
    }
    return next();
  });
}

// Get API Version from .env (or else assume 1.0)
const baseUrl = `${apiRoot}`;

// mount all routes on /api path
app.use(`${baseUrl}`, routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (env !== 'test') {
  app.use(
    expressWinston.errorLogger({
      winstonInstance,
    })
  );
}

// error handler, send stacktrace only during development
app.use((
  err,
  req,
  res,
  next // eslint-disable-line no-unused-vars
) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: env === 'development' ? err.stack : {},
  })
);

export default app;
