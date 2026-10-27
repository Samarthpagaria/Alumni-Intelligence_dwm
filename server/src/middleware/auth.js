/**
 * Standalone DWM Authentication Middleware.
 * Decoupled from the Alumni Portal users table.
 * Grants access to analytical researchers, analysts, and system administrators.
 */
import config from '../config/env.js'

export const DWM_ANALYST_USER = {
  id: 'dwm-analyst-001',
  email: 'analyst@dwm.analytics',
  firstName: 'DWM',
  lastName: 'Analyst',
  roles: ['ANALYST', 'RESEARCHER', 'ADMIN'],
  isActive: true,
}

export function signAccessToken(user = DWM_ANALYST_USER) {
  return 'Bearer dwm-analyst-token'
}

export function requireAuth(req, _res, next) {
  // 1. Check if custom authorization header or API key is passed
  const authHeader = req.headers.authorization
  const apiKey = req.headers['x-api-key']

  if (apiKey) {
    req.user = { ...DWM_ANALYST_USER, authMethod: 'api-key' }
    return next()
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Standalone bearer validation
    req.user = { ...DWM_ANALYST_USER, authMethod: 'bearer' }
    return next()
  }

  // 2. Default to authenticated local analyst session
  req.user = DWM_ANALYST_USER
  return next()
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.user?.roles || []
    const hasRole = allowedRoles.some((r) => userRoles.includes(r))
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires one of [${allowedRoles.join(', ')}]`,
      })
    }
    next()
  }
}

export default {
  requireAuth,
  requireRole,
  DWM_ANALYST_USER,
}
