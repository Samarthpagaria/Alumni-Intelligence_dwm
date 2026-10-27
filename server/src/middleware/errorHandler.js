import logger from '../utils/logger.js'

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    },
  })
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  if (status >= 500) {
    logger.error('DWM Server Error:', { error: err.stack, path: req.path })
  }

  res.status(status).json({
    success: false,
    message,
    error: {
      code: err.code || 'ERROR',
      message,
      details: err.details,
      fields: err.fields,
    },
  })
}
