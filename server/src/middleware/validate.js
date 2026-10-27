import { ZodError } from 'zod'
import { unprocessable } from '../utils/errors.js'

function formatIssues(error) {
  return error.issues.map((issue) => {
    const fieldName = issue.path.join('.') || '_root'
    return {
      field: fieldName,
      path: fieldName,
      param: fieldName,
      message: issue.message,
      msg: issue.message,
      code: issue.code,
    }
  })
}

export function validate({ body, query, params }) {
  return (req, _res, next) => {
    try {
      if (params) {
        req.params = params.parse(req.params)
      }
      if (query) {
        req.validatedQuery = query.parse(req.query)
      }
      if (body) {
        req.body = body.parse(req.body ?? {})
      }
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return next(unprocessable('Validation failed', formatIssues(error)))
      }
      return next(error)
    }
  }
}

export function getQuery(req) {
  return req.validatedQuery ?? req.query
}

export function getParams(req) {
  return req.params
}

export function getBody(req) {
  return req.body
}
