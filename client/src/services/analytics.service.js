/**
 * Analytics Platform Client Service.
 * Connects directly to backend /api/analytics endpoints.
 * Returns genuine database-derived warehouse metrics without fabricated fallback numbers.
 */
import { api } from './http.js'

/**
 * Unwraps API response: handles both { data: ... } wrapped responses and direct payload objects/arrays.
 */
function unwrap(res, fallback) {
  if (res === null || res === undefined) return fallback
  if (typeof res === 'object' && res.data !== undefined && !Array.isArray(res)) {
    return res.data
  }
  return res
}

/**
 * Fetch warehouse overview statistics and executive KPIs.
 */
export async function fetchWarehouseOverview(params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== 'ALL')
  )
  const queryStr = new URLSearchParams(cleanParams).toString()
  const res = await api.get(`/analytics/overview${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res, {
    warehouse: { totalStudents: 0, totalAlumni: 0, totalCompanies: 0, totalSkills: 0, totalPlacements: 0, totalWarehouseRecords: 0 },
    kpis: { placementRate: 0, avgPackageLpa: 0, medianPackageLpa: 0, highestPackageLpa: 0, totalJobOffers: 0, activeRecruiters: 0 },
    recentBatches: [],
  })
}

/**
 * Fetch career and placement analytics by department and cohort.
 */
export async function fetchPlacementsData(filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '' && v !== 'ALL')
  )
  const queryStr = new URLSearchParams(cleanFilters).toString()
  const res = await api.get(`/analytics/career${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res, {
    kpis: { placementRate: 0, avgPackageLpa: 0, medianPackageLpa: 0, highestPackageLpa: 0, totalJobOffers: 0, activeRecruiters: 0 },
    departments: [],
    trends: [],
    recruiters: [],
  })
}

/**
 * Fetch technical skill competency and demand distribution.
 */
export async function fetchSkillsAnalytics(filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '' && v !== 'ALL')
  )
  const queryStr = new URLSearchParams(cleanFilters).toString()
  const res = await api.get(`/analytics/skills${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res, {
    topSkills: [],
    categoryDistribution: [],
    categories: ['ALL'],
  })
}

/**
 * Fetch verified alumni geographic distribution and industry metrics.
 */
export async function fetchAlumniInsights(filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '' && v !== 'ALL')
  )
  const queryStr = new URLSearchParams(cleanFilters).toString()
  const res = await api.get(`/analytics/alumni${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res, {
    kpis: { totalAlumni: 0, totalMentors: 0, mentorRatio: 0 },
    geographic: [],
    industries: [],
  })
}

/**
 * Fetch multidimensional OLAP cells from the warehouse cube.
 */
export async function fetchOlapData(params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== 'ALL')
  )
  const queryStr = new URLSearchParams(cleanParams).toString()
  const res = await api.get(`/analytics/olap${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res, {
    primaryDimension: 'department',
    measure: 'avgLpa',
    cells: [],
  })
}

/**
 * Fetch analytical dataset metadata and row counts.
 */
export async function fetchDatasetsMetadata() {
  const res = await api.get('/analytics/datasets')
  return unwrap(res, [])
}

/**
 * Fetch data quality completeness and integrity metrics.
 */
export async function fetchDataQuality() {
  const res = await api.get('/analytics/data-quality')
  return unwrap(res, { metrics: [], generatedAt: new Date().toISOString() })
}

/**
 * Fetch historical ETL batches and execution audit log.
 */
export async function fetchEtlHistory(params = {}) {
  const queryStr = new URLSearchParams(params).toString()
  const res = await api.get(`/analytics/etl/history${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res, [])
}

/**
 * Fetch row-level validation errors for a specific ETL batch.
 */
export async function fetchBatchErrors(batchId) {
  const res = await api.get(`/analytics/etl/history/${batchId}/errors`)
  return unwrap(res, [])
}


/**
 * Upload and stage CSV file for validation and preview.
 */
export async function uploadAndStageCsv(file, datasetType = null) {
  const formData = new FormData()
  formData.append('file', file)
  if (datasetType) {
    formData.append('datasetType', datasetType)
  }

  const res = await api.post('/analytics/etl/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return unwrap(res, null)
}

/**
 * Confirm staged batch import and atomically commit into warehouse.
 */
export async function confirmStagedImport(batchId) {
  const res = await api.post('/analytics/etl/confirm-import', { batchId })
  return unwrap(res, null)
}

/**
 * Fetch comprehensive warehouse summary metrics & catalog counts.
 */
export async function fetchWarehouseSummary() {
  const res = await api.get('/analytics/warehouse/summary')
  return unwrap(res, null)
}

/**
 * Fetch full warehouse schema graph and relationships for ERD visualization.
 */
export async function fetchWarehouseSchema() {
  const res = await api.get('/analytics/warehouse/schema')
  return unwrap(res, null)
}

/**
 * Fetch detailed column profiles, statistics, and sample rows for a specific warehouse table.
 */
export async function fetchWarehouseTableDetails(tableName, params = {}) {
  const queryStr = new URLSearchParams(params).toString()
  const res = await api.get(`/analytics/warehouse/table/${tableName}${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res, null)
}

/**
 * Fetch warehouse data quality diagnostics and integrity test results.
 */
export async function fetchWarehouseQuality() {
  const res = await api.get('/analytics/warehouse/quality')
  return unwrap(res, null)
}

/**
 * Fetch physical CSV dataset inventory and row comparisons.
 */
export async function fetchWarehouseDatasets() {
  const res = await api.get('/analytics/warehouse/datasets')
  return unwrap(res, null)
}

/**
 * Fetch warehouse ETL batch audit ledger records.
 */
export async function fetchWarehouseAuditLedger(params = {}) {
  const queryStr = new URLSearchParams(params).toString()
  const res = await api.get(`/analytics/warehouse/audit${queryStr ? `?${queryStr}` : ''}`)
  return unwrap(res, null)
}

export default {
  fetchWarehouseOverview,
  fetchPlacementsData,
  fetchSkillsAnalytics,
  fetchAlumniInsights,
  fetchOlapData,
  fetchDatasetsMetadata,
  fetchDataQuality,
  fetchEtlHistory,
  fetchBatchErrors,
  uploadAndStageCsv,
  confirmStagedImport,
  fetchWarehouseSummary,
  fetchWarehouseSchema,
  fetchWarehouseTableDetails,
  fetchWarehouseQuality,
  fetchWarehouseDatasets,
  fetchWarehouseAuditLedger,
}
