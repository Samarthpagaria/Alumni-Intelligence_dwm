/**
 * Analytics Platform API Routes.
 * Mounts analytical endpoints, OLAP operations, and CSV/ETL ingestion pipeline.
 */
import { Router } from 'express'
import { z } from 'zod'
import * as controller from '../controllers/analyticsController.js'
import dataminingRoutes from './dataminingRoutes.js'
import { validate } from '../middleware/validate.js'
import { uploadCsv, wrapUpload } from '../middleware/upload.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Query Validation Schemas
const overviewQuerySchema = z.object({
  recordSource: z.string().optional(),
})

const careerQuerySchema = z.object({
  department: z.string().optional(),
  year: z.string().optional(),
  minSalary: z.string().regex(/^\d+(\.\d+)?$/, 'minSalary must be a positive number').optional(),
  company: z.string().optional(),
  recordSource: z.string().optional(),
})

const skillsQuerySchema = z.object({
  category: z.string().optional(),
  limit: z.string().regex(/^\d+$/, 'limit must be an integer').optional(),
})

const alumniQuerySchema = z.object({
  city: z.string().optional(),
  industry: z.string().optional(),
  mentorOnly: z.string().optional(),
  recordSource: z.string().optional(),
})

const olapQuerySchema = z.object({
  primaryDimension: z.enum(['department', 'tier', 'company', 'year', 'industry', 'degree', 'source']).optional(),
  secondaryDimension: z.enum(['department', 'tier', 'company', 'year', 'industry', 'degree', 'source', 'none']).optional(),
  measure: z.enum(['avgLpa', 'medianLpa', 'placedCount', 'totalOffers', 'maxLpa', 'minLpa', 'placementRate']).optional(),
  sliceDept: z.string().optional(),
  sliceTier: z.string().optional(),
  sliceCompany: z.string().optional(),
  sliceYear: z.string().optional(),
  sliceIndustry: z.string().optional(),
  sliceSource: z.string().optional(),
  minLpa: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  drillDownKey: z.string().optional(),
  rollup: z.string().optional(),
})

const batchIdParamSchema = z.object({
  batchId: z.string().uuid('Invalid batch UUID'),
})

const confirmImportBodySchema = z.object({
  batchId: z.string().uuid('batchId must be a valid UUID'),
})

const tableNameParamSchema = z.object({
  tableName: z.string().regex(/^[a-zA-Z0-9_]+$/, 'Invalid table identifier'),
})

// 1. Read / Analytics Endpoints
router.get('/overview', validate({ query: overviewQuerySchema }), controller.getOverview)
router.get('/career', validate({ query: careerQuerySchema }), controller.getCareer)
router.get('/placements', validate({ query: careerQuerySchema }), controller.getCareer) // Alias for backwards compatibility
router.get('/skills', validate({ query: skillsQuerySchema }), controller.getSkills)
router.get('/alumni', validate({ query: alumniQuerySchema }), controller.getAlumni)
router.get('/olap', validate({ query: olapQuerySchema }), controller.getOlap)
router.get('/datasets', controller.getDatasets)
router.get('/data-quality', controller.getDataQuality)

// 2. Comprehensive Warehouse Architecture & Schema Overview Endpoints
router.get('/warehouse/summary', controller.getWarehouseSummary)
router.get('/warehouse/schema', controller.getWarehouseSchema)
router.get('/warehouse/table/:tableName', validate({ params: tableNameParamSchema }), controller.getWarehouseTableDetails)
router.get('/warehouse/quality', controller.getWarehouseDataQuality)
router.get('/warehouse/datasets', controller.getWarehouseDatasets)
router.get('/warehouse/audit', controller.getWarehouseAuditLedger)

// 3. Independent ETL & Ingestion Management
router.get('/etl/history', controller.getEtlHistory)
router.get('/etl/history/:batchId/errors', validate({ params: batchIdParamSchema }), controller.getEtlBatchErrors)

// 4. Ingestion Mutations (Protected by Authentication & RBAC; Operational sync removed)
router.post('/etl/upload', requireAuth, wrapUpload(uploadCsv), controller.uploadCsv)
router.post('/etl/confirm-import', requireAuth, validate({ body: confirmImportBodySchema }), controller.confirmImport)
router.post('/etl/rollback-import', requireAuth, validate({ body: confirmImportBodySchema }), controller.rollbackImport)

// 5. Data Mining Engine Routes
router.use('/datamining', dataminingRoutes)
router.use('/mining', dataminingRoutes) // Alias

export default router
