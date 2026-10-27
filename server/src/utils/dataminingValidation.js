/**
 * Validation utilities for Data Mining API endpoints.
 */
import { badRequest } from './errors.js'

const ALLOWED_RECORD_SOURCES = ['indian_academic_benchmark', 'synthetic_indian_academic_demo', 'operational', 'ALL']
const ALLOWED_APRIORI_MODES = ['alumni_skills', 'job_skills', 'career_outcomes']

export function validateRecordSource(source = 'indian_academic_benchmark') {
  if (!ALLOWED_RECORD_SOURCES.includes(source)) {
    throw badRequest(`Invalid recordSource '${source}'. Must be one of: ${ALLOWED_RECORD_SOURCES.join(', ')}`)
  }
  return source
}

export function validateClusteringParams(query = {}) {
  const recordSource = validateRecordSource(query.recordSource || 'indian_academic_benchmark')
  
  let k = query.k !== undefined ? parseInt(query.k, 10) : 4
  if (isNaN(k) || k < 2 || k > 10) {
    throw badRequest('Parameter k must be an integer between 2 and 10')
  }

  let randomSeed = query.randomSeed !== undefined ? parseInt(query.randomSeed, 10) : 2026
  if (isNaN(randomSeed)) {
    randomSeed = 2026
  }

  let topSkillsCount = query.topSkillsCount !== undefined ? parseInt(query.topSkillsCount, 10) : 35
  if (isNaN(topSkillsCount) || topSkillsCount < 5 || topSkillsCount > 100) {
    throw badRequest('Parameter topSkillsCount must be between 5 and 100')
  }

  const computeProjection = query.computeProjection !== 'false'

  return { k, randomSeed, recordSource, topSkillsCount, computeProjection }
}

export function validateEvaluationParams(query = {}) {
  const recordSource = validateRecordSource(query.recordSource || 'indian_academic_benchmark')
  
  let minK = query.minK !== undefined ? parseInt(query.minK, 10) : 2
  let maxK = query.maxK !== undefined ? parseInt(query.maxK, 10) : 8
  
  if (isNaN(minK) || minK < 2 || minK > 6) {
    throw badRequest('Parameter minK must be an integer between 2 and 6')
  }
  if (isNaN(maxK) || maxK <= minK || maxK > 12) {
    throw badRequest('Parameter maxK must be greater than minK and at most 12')
  }

  let randomSeed = query.randomSeed !== undefined ? parseInt(query.randomSeed, 10) : 2026

  return { minK, maxK, recordSource, randomSeed }
}

export function validateAprioriParams(query = {}) {
  const recordSource = validateRecordSource(query.recordSource || 'indian_academic_benchmark')
  
  const mode = query.mode || 'alumni_skills'
  if (!ALLOWED_APRIORI_MODES.includes(mode)) {
    throw badRequest(`Invalid mode '${mode}'. Must be one of: ${ALLOWED_APRIORI_MODES.join(', ')}`)
  }

  let minSupport = query.minSupport !== undefined ? parseFloat(query.minSupport) : 0.05
  if (isNaN(minSupport) || minSupport <= 0 || minSupport > 0.8) {
    throw badRequest('Parameter minSupport must be a number between 0.01 and 0.80')
  }

  let minConfidence = query.minConfidence !== undefined ? parseFloat(query.minConfidence) : 0.50
  if (isNaN(minConfidence) || minConfidence <= 0 || minConfidence > 1.0) {
    throw badRequest('Parameter minConfidence must be a number between 0.01 and 1.00')
  }

  let minLift = query.minLift !== undefined ? parseFloat(query.minLift) : 1.10
  if (isNaN(minLift) || minLift < 0) {
    throw badRequest('Parameter minLift must be a non-negative number')
  }

  let maxItemsetLength = query.maxItemsetLength !== undefined ? parseInt(query.maxItemsetLength, 10) : 3
  if (isNaN(maxItemsetLength) || maxItemsetLength < 2 || maxItemsetLength > 5) {
    throw badRequest('Parameter maxItemsetLength must be between 2 and 5')
  }

  let limit = query.limit !== undefined ? parseInt(query.limit, 10) : 50
  if (isNaN(limit) || limit < 1 || limit > 200) {
    throw badRequest('Parameter limit must be between 1 and 200')
  }

  return { mode, minSupport, minConfidence, minLift, maxItemsetLength, limit, recordSource }
}

export function validateTrainParams(body = {}) {
  const recordSource = validateRecordSource(body.recordSource || 'indian_academic_benchmark')

  let testRatio = body.testRatio !== undefined ? parseFloat(body.testRatio) : 0.20
  if (isNaN(testRatio) || testRatio < 0.10 || testRatio > 0.40) {
    throw badRequest('Parameter testRatio must be between 0.10 and 0.40')
  }

  let randomSeed = body.randomSeed !== undefined ? parseInt(body.randomSeed, 10) : 2026
  let topSkillsCount = body.topSkillsCount !== undefined ? parseInt(body.topSkillsCount, 10) : 30

  return { recordSource, testRatio, randomSeed, topSkillsCount }
}

export function validatePredictParams(body = {}) {
  if (!body || typeof body !== 'object') {
    throw badRequest('Request body must be a JSON object')
  }

  if (!Array.isArray(body.skills)) {
    throw badRequest('Field "skills" must be an array of skill names')
  }

  const cleanedSkills = body.skills
    .filter((s) => typeof s === 'string' && s.trim().length > 0)
    .map((s) => s.trim())

  if (cleanedSkills.length === 0) {
    throw badRequest('Field "skills" must contain at least one valid skill name')
  }

  const experienceYears = Number(body.experience_years) || 0
  if (experienceYears < 0 || experienceYears > 50) {
    throw badRequest('Field "experience_years" must be between 0 and 50')
  }

  return {
    skills: cleanedSkills,
    experience_years: experienceYears,
  }
}
