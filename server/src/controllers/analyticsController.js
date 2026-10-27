/**
 * Analytics and Data Warehouse Controller.
 * Handles HTTP requests for analytics KPIs, OLAP, and ETL data operations.
 */
import warehouseRepo from '../services/dwh/warehouseRepository.js'
import overviewService from '../services/dwh/warehouseOverviewService.js'
import { stageCsvUpload, confirmBatchImport, rollbackBatchImport } from '../services/dwh/csvIngestionService.js'
import { getQuery, getBody, getParams } from '../middleware/validate.js'
import { unprocessable, notFound } from '../utils/errors.js'

export async function getOverview(req, res, next) {
  try {
    const query = getQuery(req)
    const data = await warehouseRepo.getWarehouseOverview(query)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getCareer(req, res, next) {
  try {
    const query = getQuery(req)
    const data = await warehouseRepo.getCareerAnalytics(query)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getSkills(req, res, next) {
  try {
    const query = getQuery(req)
    const data = await warehouseRepo.getSkillsAnalytics(query)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getAlumni(req, res, next) {
  try {
    const query = getQuery(req)
    const data = await warehouseRepo.getAlumniAnalytics(query)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getOlap(req, res, next) {
  try {
    const query = getQuery(req)
    const data = await warehouseRepo.getOlapData(query)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getDatasets(_req, res, next) {
  try {
    const data = await warehouseRepo.getDatasetsMetadata()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getDataQuality(_req, res, next) {
  try {
    const data = await warehouseRepo.getDataQualityReport()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getEtlHistory(req, res, next) {
  try {
    const query = getQuery(req)
    const limit = query?.limit ? Number(query.limit) : 20
    const offset = query?.offset ? Number(query.offset) : 0
    const data = await warehouseRepo.getEtlHistory({ limit, offset })
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getEtlBatchErrors(req, res, next) {
  try {
    const { batchId } = getParams(req)
    const data = await warehouseRepo.getEtlBatchErrors(batchId)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getWarehouseSummary(_req, res, next) {
  try {
    const data = await overviewService.getWarehouseSummary()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getWarehouseSchema(_req, res, next) {
  try {
    const data = await overviewService.getWarehouseSchema()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getWarehouseTableDetails(req, res, next) {
  try {
    const { tableName } = getParams(req)
    const query = getQuery(req)
    const page = query?.page ? Number(query.page) : 1
    const pageSize = query?.pageSize ? Number(query.pageSize) : 10
    const search = query?.search || ''

    if (!overviewService.WAREHOUSE_TABLES.includes(tableName)) {
      throw notFound(`Warehouse table "${tableName}" not found`)
    }

    const data = await overviewService.getWarehouseTableDetails(tableName, { page, pageSize, search })
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getWarehouseDataQuality(_req, res, next) {
  try {
    const data = await overviewService.getWarehouseDataQuality()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getWarehouseDatasets(_req, res, next) {
  try {
    const data = await overviewService.getWarehouseDatasetsInventory()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getWarehouseAuditLedger(req, res, next) {
  try {
    const query = getQuery(req)
    const limit = query?.limit ? Number(query.limit) : 20
    const offset = query?.offset ? Number(query.offset) : 0
    const data = await overviewService.getWarehouseAuditLedger({ limit, offset })
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function uploadCsv(req, res, next) {
  try {
    if (!req.file) {
      throw unprocessable('No CSV file uploaded')
    }

    const fileName = req.file.originalname || 'dataset.csv'
    if (!fileName.toLowerCase().endsWith('.csv') && req.file.mimetype !== 'text/csv' && req.file.mimetype !== 'application/vnd.ms-excel') {
      throw unprocessable('Uploaded file must be a valid .csv file')
    }

    const csvContent = req.file.buffer.toString('utf-8')
    const requestedType = req.body?.datasetType || null
    const dryRun = req.body?.dryRun === 'true' || req.body?.dryRun === true || req.query?.dryRun === 'true'

    const staged = await stageCsvUpload({ fileName, csvContent, requestedType, dryRun })
    res.status(202).json({
      success: true,
      message: dryRun
        ? 'CSV dry-run validation preview completed.'
        : 'CSV validated and staged successfully. Confirm import to write to warehouse.',
      ...staged,
    })
  } catch (err) {
    next(err)
  }
}

export async function confirmImport(req, res, next) {
  try {
    const body = getBody(req)
    const batchId = body?.batchId
    if (!batchId) {
      throw unprocessable('batchId is required to confirm import')
    }

    const result = await confirmBatchImport(batchId)
    res.json({
      success: true,
      message: `Batch ${batchId} imported successfully into warehouse.`,
      ...result,
    })
  } catch (err) {
    next(err)
  }
}

export async function rollbackImport(req, res, next) {
  try {
    const body = getBody(req)
    const batchId = body?.batchId
    if (!batchId) {
      throw unprocessable('batchId is required to rollback import')
    }

    const result = await rollbackBatchImport(batchId)
    res.json({
      success: true,
      message: `Batch ${batchId} rolled back successfully.`,
      ...result,
    })
  } catch (err) {
    next(err)
  }
}

export default {
  getOverview,
  getCareer,
  getSkills,
  getAlumni,
  getOlap,
  getDatasets,
  getDataQuality,
  getEtlHistory,
  getEtlBatchErrors,
  getWarehouseSummary,
  getWarehouseSchema,
  getWarehouseTableDetails,
  getWarehouseDataQuality,
  getWarehouseDatasets,
  getWarehouseAuditLedger,
  uploadCsv,
  confirmImport,
  rollbackImport,
}
