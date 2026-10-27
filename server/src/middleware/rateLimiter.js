// Lightweight pass-through rate limiter for DWM analytics API
export function apiLimiter(_req, _res, next) {
  next()
}
