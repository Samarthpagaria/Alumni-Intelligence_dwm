/**
 * Data Mining Client Service.
 * Connects directly to backend /api/analytics/datamining endpoints.
 * Provides actual computed algorithms: K-Means Clustering, Apriori Association Rules,
 * and Supervised Classification.
 */
import { api } from './http.js'

/**
 * Clean filter parameters by removing empty/undefined keys.
 */
function cleanParams(params = {}) {
  const cleaned = {}
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      cleaned[key] = val
    }
  }
  return cleaned
}

/**
 * Unwraps API envelope if nested under .data or returns response directly.
 */
function unwrap(res) {
  if (res && typeof res === 'object' && res.data !== undefined) {
    return res.data
  }
  return res || {}
}

/**
 * Fetch warehouse mining inventory counts and educational disclaimers.
 */
export async function fetchDataMiningSummary(params = {}) {
  const queryStr = new URLSearchParams(cleanParams(params)).toString()
  const res = await api.get(`/analytics/datamining/summary${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res)
}

/**
 * Run K-Means Clustering on alumni profiles.
 */
export async function fetchClustering(params = {}) {
  const queryStr = new URLSearchParams(cleanParams(params)).toString()
  const res = await api.get(`/analytics/datamining/clustering${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res)
}

/**
 * Run multi-k evaluation for Elbow method and Silhouette score.
 */
export async function fetchClusteringEvaluation(params = {}) {
  const queryStr = new URLSearchParams(cleanParams(params)).toString()
  const res = await api.get(`/analytics/datamining/clustering/evaluation${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res)
}

/**
 * Run Apriori Association Rule Mining on transaction baskets.
 */
export async function fetchAssociationRules(params = {}) {
  const queryStr = new URLSearchParams(cleanParams(params)).toString()
  const res = await api.get(`/analytics/datamining/association-rules${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res)
}

/**
 * Fetch classification target metadata and current model status.
 */
export async function fetchClassificationMetadata(params = {}) {
  const queryStr = new URLSearchParams(cleanParams(params)).toString()
  const res = await api.get(`/analytics/datamining/classification/metadata${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res)
}

/**
 * Trigger training of career outcome classification model.
 */
export async function trainClassificationModel(body = {}) {
  const res = await api.post('/analytics/datamining/classification/train', body)
  return unwrap(res)
}

/**
 * Run inference prediction on candidate profile.
 */
export async function predictCareerOutcome(body = {}) {
  const res = await api.post('/analytics/datamining/classification/predict', body)
  return unwrap(res)
}

export default {
  fetchDataMiningSummary,
  fetchClustering,
  fetchClusteringEvaluation,
  fetchAssociationRules,
  fetchClassificationMetadata,
  trainClassificationModel,
  predictCareerOutcome,
}
