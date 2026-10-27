import crypto from 'node:crypto'
import logger from '../utils/logger.js'

export function attachRequestId(req, res, next) {
  req.id = req.headers['x-request-id'] || crypto.randomUUID()
  res.setHeader('x-request-id', req.id)
  next()
}

export function setSecurityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  next()
}

export function requestLogger(req, res, next) {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`)
  })
  next()
}
