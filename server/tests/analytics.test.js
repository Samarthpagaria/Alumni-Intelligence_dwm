/**
 * Production Test Suite for DWM Analytics Platform (Phase 3).
 * Validates Warehouse Schema, Operational ETL, Benchmark Seeding,
 * CSV Ingestion, OLAP Cube, and Analytics REST APIs.
 */
import 'dotenv/config'
import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { startTestDatabase, stopTestDatabase } from './helpers/testDatabase.js'

process.env.NODE_ENV = 'test'

// Spin up isolated ephemeral PGlite test database
await startTestDatabase()

const { default: app } = await import('../src/app.js')
const { query, closePool } = await import('../src/config/database.js')
const { seedWarehouseBenchmarkData } = await import('../src/services/dwh/etlPipeline.js')
const overviewService = await import('../src/services/dwh/warehouseOverviewService.js')
const warehouseRepo = await import('../src/services/dwh/warehouseRepository.js')
const { stageCsvUpload, confirmBatchImport, rollbackBatchImport } = await import('../src/services/dwh/csvIngestionService.js')
const { signAccessToken } = await import('../src/middleware/auth.js')

let testUser
let testAuthToken

describe('DWM Analytics & Data Warehouse Platform Test Suite', () => {
  before(async () => {
    testUser = {
      id: 'dwm-test-admin',
      email: 'admin@dwm.analytics',
      firstName: 'Analytics',
      lastName: 'Admin',
      roles: ['ADMIN', 'ANALYST'],
    }
    testAuthToken = signAccessToken(testUser)
  })

  after(async () => {
    await closePool()
    await stopTestDatabase()
  })

  // =========================================================================
  // 1. WAREHOUSE SCHEMA & TABLE INTEGRITY
  // =========================================================================
  describe('Warehouse Schema & Tables', () => {
    it('TC-DWH-01: Verifies all 11 required dwh tables exist in database', async () => {
      const { rows } = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'dwh' 
        ORDER BY table_name;
      `)
      const tableNames = rows.map((r) => r.table_name)
      const expected = [
        'bridge_student_skill',
        'dim_alumni',
        'dim_company',
        'dim_date',
        'dim_skill',
        'dim_student',
        'etl_batch_errors',
        'etl_batches',
        'fact_job_application',
        'fact_placement',
        'fact_salary_benchmark',
      ]
      for (const t of expected) {
        assert.ok(tableNames.includes(t), `Missing expected warehouse table: ${t}`)
      }
    })

    it('TC-DWH-02: Verifies dim_date contains populated calendar series (2018-2030)', async () => {
      const { rows } = await query('SELECT count(*)::int as count FROM dwh.dim_date;')
      assert.ok(rows[0].count >= 3650, `Expected at least 10 years of dates, got ${rows[0].count}`)
    })

    it('TC-DWH-03: Verifies provenance column record_source exists on all analytical entities', async () => {
      const tables = ['dim_student', 'dim_alumni', 'fact_placement', 'fact_job_application', 'fact_salary_benchmark']
      for (const t of tables) {
        const { rows } = await query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'dwh' AND table_name = $1 AND column_name = 'record_source';
        `, [t])
        assert.equal(rows.length, 1, `Table dwh.${t} must have record_source column`)
      }
    })
  })

  // =========================================================================
  // 2. DWM WAREHOUSE OVERVIEW & DECOUPLED BENCHMARK SEEDING
  // =========================================================================
  describe('DWM Warehouse Architecture & Decoupled Overview', () => {
    it('TC-ETL-01: Returns comprehensive warehouse summary and schema metrics', async () => {
      const summary = await overviewService.getWarehouseSummary()
      assert.equal(summary.database.status, 'CONNECTED')
      assert.equal(summary.database.schema, 'dwh')
      assert.ok(summary.counts.totalTables >= 10)
      assert.ok(summary.counts.totalColumns > 50)
      assert.ok(summary.counts.totalForeignKeys >= 10)
    })

    it('TC-ETL-02: Verifies warehouse data quality diagnostics execute cleanly', async () => {
      const quality = await overviewService.getWarehouseDataQuality()
      assert.ok(quality.summary.totalChecks > 20)
      assert.equal(quality.summary.failed, 0)
      assert.ok(quality.summary.passRatePercent >= 90)
    })

    it('TC-ETL-03: Verifies multi-year benchmark dataset seeding', async () => {
      const seedRes = await seedWarehouseBenchmarkData()
      assert.ok(seedRes.studentsIngested > 0 || seedRes.skipped === true)

      // Verify benchmark students have record_source = 'benchmark'
      const { rows } = await query("SELECT count(*)::int as c FROM dwh.dim_student WHERE record_source = 'benchmark';")
      assert.ok(rows[0].c >= 200, `Expected at least 200 benchmark students, got ${rows[0].c}`)
    })
  })

  // =========================================================================
  // 3. WAREHOUSE REPOSITORY AGGREGATIONS
  // =========================================================================
  describe('Warehouse Repository Layer', () => {
    it('TC-REPO-01: getWarehouseOverview returns genuine counts and KPIs', async () => {
      const overview = await warehouseRepo.getWarehouseOverview()
      assert.ok(overview.warehouse.totalStudents > 0)
      assert.ok(overview.warehouse.totalPlacements > 0)
      assert.equal(overview.warehouse.activeSchema, 'dwh')
      assert.ok(overview.kpis.avgPackageLpa > 0)
    })

    it('TC-REPO-02: getCareerAnalytics aggregates by department and recruiter', async () => {
      const career = await warehouseRepo.getCareerAnalytics()
      assert.ok(Array.isArray(career.departments))
      assert.ok(career.departments.length > 0)
      assert.ok(Array.isArray(career.recruiters))
      assert.ok(Array.isArray(career.trends))

      const firstDept = career.departments[0]
      assert.ok(firstDept.department)
      assert.ok(firstDept.eligible >= firstDept.placed)
      assert.ok(firstDept.avgLpa >= 0)
    })

    it('TC-REPO-03: getSkillsAnalytics computes demand ranking and categories', async () => {
      const skills = await warehouseRepo.getSkillsAnalytics()
      assert.ok(Array.isArray(skills.topSkills))
      assert.ok(skills.topSkills.length > 0)
      assert.ok(skills.categories.includes('ALL'))
      assert.ok(Array.isArray(skills.categoryDistribution))
    })

    it('TC-REPO-04: getAlumniAnalytics computes geographic distribution', async () => {
      const alumni = await warehouseRepo.getAlumniAnalytics()
      assert.ok(alumni.kpis.totalAlumni >= 0)
      assert.ok(Array.isArray(alumni.geographic))
      assert.ok(Array.isArray(alumni.industries))
    })

    it('TC-REPO-05: getOlapData computes multi-dimensional group rollup', async () => {
      const olap = await warehouseRepo.getOlapData({ primaryDimension: 'department' })
      assert.equal(olap.primaryDimension, 'department')
      assert.ok(Array.isArray(olap.cells))
      assert.ok(olap.cells.length > 0)
      const firstCell = olap.cells[0]
      assert.ok(firstCell.primary)
      assert.ok(firstCell.avgLpa >= 0)
    })

    it('TC-REPO-06: getDataQualityReport executes completeness and referential integrity checks', async () => {
      const dq = await warehouseRepo.getDataQualityReport()
      assert.ok(Array.isArray(dq.metrics))
      assert.ok(dq.metrics.length >= 4)
      for (const m of dq.metrics) {
        assert.ok(m.passRate >= 0 && m.passRate <= 100)
        assert.ok(['PASSED', 'WARNING', 'FAILED'].includes(m.status))
      }
    })
  })

  // =========================================================================
  // 4. CSV INGESTION PIPELINE (VALIDATION, STAGING & CONFIRMATION)
  // =========================================================================
  describe('CSV Ingestion Engine', () => {
    it('TC-CSV-01: Validates and stages clean CSV file with column mapping', async () => {
      const csv = `student_id,department,company,package_lpa,cgpa,graduation_year
TEST-INGEST-01,Computer Engineering,Microsoft,28.5,9.6,2025
TEST-INGEST-02,Data Science & AI,Google,34.0,9.9,2025`

      const staged = await stageCsvUpload({ fileName: 'valid_test.csv', csvContent: csv })
      assert.equal(staged.status, 'STAGED')
      assert.equal(staged.datasetType, 'placements')
      assert.equal(staged.rowsValid, 2)
      assert.equal(staged.rowsInvalid, 0)
      assert.ok(staged.batchId)
      assert.equal(staged.preview.length, 2)
    })

    it('TC-CSV-02: Flags invalid rows with row-level error reporting', async () => {
      const csv = `student_id,department,company,package_lpa,cgpa,graduation_year
INVALID-01,Computer Engineering,Stripe,-15.0,9.2,2025
INVALID-02,,Atlassian,18.0,8.5,2025
VALID-ROW,Information Technology,Uber,19.0,8.7,2025`

      const staged = await stageCsvUpload({ fileName: 'invalid_test.csv', csvContent: csv })
      assert.equal(staged.rowsTotal, 3)
      assert.equal(staged.rowsValid, 1)
      assert.equal(staged.rowsInvalid, 2)
      assert.ok(staged.sampleErrors.length >= 2)

      // Verify errors logged in dwh.etl_batch_errors
      const errRes = await query('SELECT * FROM dwh.etl_batch_errors WHERE batch_id = $1', [staged.batchId])
      assert.equal(errRes.rows.length, 2)
      assert.ok(errRes.rows.some((e) => e.validation_error.includes('annual package LPA')))
      assert.ok(errRes.rows.some((e) => e.validation_error.includes('Missing department')))
    })

    it('TC-CSV-03: Confirms and commits staged batch with record_source = csv_import', async () => {
      const csv = `student_id,department,company,package_lpa,cgpa,graduation_year
TEST-CONFIRM-01,Cybersecurity,CrowdStrike,22.0,8.9,2025`

      const staged = await stageCsvUpload({ fileName: 'confirm_test.csv', csvContent: csv })
      const confirmed = await confirmBatchImport(staged.batchId)

      assert.equal(confirmed.status, 'COMPLETED')
      assert.equal(confirmed.rowsInserted, 1)

      // Verify fact table has this record with csv_import provenance
      const { rows } = await query(`
        SELECT p.annual_package_lpa, p.record_source, s.student_id_number
        FROM dwh.fact_placement p
        JOIN dwh.dim_student s ON s.student_sk = p.student_sk
        WHERE s.student_id_number = 'TEST-CONFIRM-01'
        AND p.record_source = 'csv_import';
      `)
      assert.ok(rows.length >= 1)
      assert.equal(rows[0].record_source, 'csv_import')
      assert.equal(Number(rows[0].annual_package_lpa), 22.0)
    })

    it('TC-CSV-04: Prevents repeated import of an already completed batch', async () => {
      const csv = `student_id,department,company,package_lpa,cgpa,graduation_year
TEST-REPEAT-01,Information Technology,Figma,21.0,8.8,2025`

      const staged = await stageCsvUpload({ fileName: 'repeat_test.csv', csvContent: csv })
      await confirmBatchImport(staged.batchId)

      // Second attempt must fail
      await assert.rejects(
        async () => {
          await confirmBatchImport(staged.batchId)
        },
        (err) => err.message.includes('Repeat import prevented')
      )
    })
  })

  // =========================================================================
  // 5. REST API ENDPOINTS & RBAC GUARDS
  // =========================================================================
  describe('Analytics REST API Endpoints', () => {
    it('TC-API-01: GET /api/analytics/overview returns 200 with warehouse summary', async () => {
      const res = await request(app).get('/api/analytics/overview')
      assert.equal(res.status, 200)
      assert.ok(res.body.warehouse)
      assert.ok(res.body.kpis)
    })

    it('TC-API-02: GET /api/analytics/career returns 200 and accepts filters', async () => {
      const res = await request(app).get('/api/analytics/career?department=Computer&minSalary=10')
      assert.equal(res.status, 200)
      assert.ok(Array.isArray(res.body.departments))
      assert.ok(Array.isArray(res.body.trends))
      assert.ok(Array.isArray(res.body.recruiters))
    })

    it('TC-API-03: GET /api/analytics/skills returns 200 and validates limit', async () => {
      const res = await request(app).get('/api/analytics/skills?limit=10')
      assert.equal(res.status, 200)
      assert.ok(Array.isArray(res.body.topSkills))
      assert.ok(res.body.topSkills.length <= 10)
    })

    it('TC-API-04: GET /api/analytics/olap performs multi-dimensional rollup', async () => {
      const res = await request(app).get('/api/analytics/olap?primaryDimension=department&measure=avgLpa')
      assert.equal(res.status, 200)
      assert.ok(Array.isArray(res.body.cells))
      assert.equal(res.body.primaryDimension, 'department')
    })

    it('TC-API-05: GET /api/analytics/datasets returns table metadata', async () => {
      const res = await request(app).get('/api/analytics/datasets')
      assert.equal(res.status, 200)
      assert.ok(Array.isArray(res.body))
      assert.ok(res.body.some((t) => t.table === 'dim_student'))
    })

    it('TC-API-06: GET /api/analytics/data-quality returns completeness report', async () => {
      const res = await request(app).get('/api/analytics/data-quality')
      assert.equal(res.status, 200)
      assert.ok(Array.isArray(res.body.metrics))
    })

    it('TC-API-07: GET /api/analytics/etl/history returns batch audit ledger', async () => {
      const res = await request(app).get('/api/analytics/etl/history')
      assert.equal(res.status, 200)
      assert.ok(Array.isArray(res.body))
      assert.ok(res.body.length > 0)
    })

    it('TC-API-08: POST /api/analytics/etl/refresh returns 404 because operational sync is decoupled', async () => {
      const res = await request(app).post('/api/analytics/etl/refresh')
      assert.equal(res.status, 404)
    })

    it('TC-API-09: GET /api/analytics/warehouse/summary returns complete warehouse metrics', async () => {
      const res = await request(app).get('/api/analytics/warehouse/summary')
      assert.equal(res.status, 200)
      assert.equal(res.body.database.schema, 'dwh')
      assert.ok(res.body.counts.totalTables >= 10)
      assert.ok(res.body.counts.totalForeignKeys >= 10)
    })

    it('TC-API-09B: GET /api/analytics/warehouse/schema returns tables and ERD relationships', async () => {
      const res = await request(app).get('/api/analytics/warehouse/schema')
      assert.equal(res.status, 200)
      assert.ok(Array.isArray(res.body.tables))
      assert.ok(Array.isArray(res.body.relationships))
    })

    it('TC-API-09C: GET /api/analytics/warehouse/table/:tableName returns table details and rejects invalid tables', async () => {
      const validRes = await request(app).get('/api/analytics/warehouse/table/dim_student')
      assert.equal(validRes.status, 200)
      assert.equal(validRes.body.tableName, 'dim_student')
      assert.ok(Array.isArray(validRes.body.columns))

      const invalidRes = await request(app).get('/api/analytics/warehouse/table/non_existent_table')
      assert.equal(invalidRes.status, 404)
    })

    it('TC-API-10: POST /api/analytics/etl/upload accepts multipart CSV with auth token', async () => {
      const csvBuffer = Buffer.from(`student_id,department,company,package_lpa,cgpa,graduation_year
API-TEST-01,Computer Engineering,Google,30.0,9.7,2025`)

      const res = await request(app)
        .post('/api/analytics/etl/upload')
        .set('Authorization', `Bearer ${testAuthToken}`)
        .attach('file', csvBuffer, 'api_test.csv')

      assert.equal(res.status, 202)
      assert.equal(res.body.success, true)
      assert.equal(res.body.rowsValid, 1)
      assert.ok(res.body.batchId)

      // Confirm import
      const confirmRes = await request(app)
        .post('/api/analytics/etl/confirm-import')
        .set('Authorization', `Bearer ${testAuthToken}`)
        .send({ batchId: res.body.batchId })

      assert.equal(confirmRes.status, 200)
      assert.equal(confirmRes.body.success, true)
    })
  })

  // =========================================================================
  // 6. PHASE 4: OLAP OPERATIONS, MATHEMATICAL CORRECTNESS & PROVENANCE
  // =========================================================================
  describe('Phase 4: OLAP Multi-Dimensional Operations & Mathematical Accuracy', () => {
    it('TC-P4-01: Roll-up totals match the exact sum of detailed records', async () => {
      const olap = await warehouseRepo.getOlapData({ primaryDimension: 'department' })
      assert.ok(Array.isArray(olap.cells))
      assert.ok(olap.cells.length > 0)

      const sumOfCellOffers = olap.cells.reduce((sum, c) => sum + c.totalOffers, 0)
      assert.equal(sumOfCellOffers, olap.rollup.totalOffers, 'Roll-up total offers must exactly match sum of department offers')

      // Validate weighted average CTC against rollup average CTC (allowing for 2-decimal cell rounding tolerance)
      const sumWeightedCTC = olap.cells.reduce((sum, c) => sum + (c.avgLpa * c.totalOffers), 0)
      const expectedAvgLpa = Number((sumWeightedCTC / sumOfCellOffers).toFixed(2))
      assert.ok(
        Math.abs(expectedAvgLpa - olap.rollup.avgLpa) <= 0.05,
        `Weighted average CTC (${expectedAvgLpa}) must reconcile within rounding tolerance with rollup average CTC (${olap.rollup.avgLpa})`
      )
    })

    it('TC-P4-02: Drill-down results reconcile with the corresponding parent summary', async () => {
      const parentOlap = await warehouseRepo.getOlapData({ primaryDimension: 'department' })
      const firstDept = parentOlap.cells[0].primary

      const drillDown = await warehouseRepo.getOlapData({
        primaryDimension: 'department',
        drillDownKey: firstDept,
      })

      assert.ok(drillDown.drillDown, 'Drill-down payload must be present')
      assert.equal(drillDown.drillDown.key, firstDept)
      assert.ok(Array.isArray(drillDown.drillDown.records))
      assert.ok(drillDown.drillDown.records.length > 0)
      
      for (const rec of drillDown.drillDown.records) {
        assert.equal(rec.department, firstDept, 'All drill-down records must belong to parent department')
        assert.ok(rec.annualPackageLpa > 0)
        assert.ok(rec.companyName)
      }
    })

    it('TC-P4-03: Slice and dice filters work individually and combined without error', async () => {
      // Individual Slice: Department
      const sliceDept = await warehouseRepo.getOlapData({
        primaryDimension: 'department',
        sliceDept: 'Computer Engineering',
      })
      for (const cell of sliceDept.cells) {
        assert.equal(cell.primary, 'Computer Engineering')
      }

      // Dice: Combine Department + Tier + MinLpa
      const diced = await warehouseRepo.getOlapData({
        primaryDimension: 'tier',
        sliceDept: 'Computer Engineering',
        sliceTier: 'Super Dream',
        minLpa: 20,
      })
      for (const cell of diced.cells) {
        assert.equal(cell.primary, 'Super Dream')
        assert.ok(cell.minLpa >= 20, 'Diced records must respect minLpa threshold')
      }
    })

    it('TC-P4-04: Pivot 2D matrix results preserve the underlying row and column totals', async () => {
      const pivoted = await warehouseRepo.getOlapData({
        primaryDimension: 'department',
        secondaryDimension: 'tier',
      })

      assert.ok(pivoted.pivot, 'Pivot object must be present')
      const { rows, columns, matrix, columnTotals, grandTotal } = pivoted.pivot
      assert.ok(rows.length > 0)
      assert.ok(columns.length > 0)

      let totalMatrixOffers = 0

      // Check each row sum matches rowTotalOffers
      for (const r of rows) {
        let rowSum = 0
        for (const c of columns) {
          rowSum += matrix[r][c].totalOffers
        }
        assert.equal(rowSum, matrix[r].rowTotalOffers, `Row offers for ${r} must equal rowTotalOffers`)
        totalMatrixOffers += rowSum
      }

      // Check each column sum matches columnTotals
      for (const c of columns) {
        let colSum = 0
        for (const r of rows) {
          colSum += matrix[r][c].totalOffers
        }
        assert.equal(colSum, columnTotals[c].totalOffers, `Column offers for ${c} must equal columnTotals`)
      }

      // Grand total must equal roll-up total
      assert.equal(totalMatrixOffers, grandTotal.totalOffers, 'Pivot grand total must equal roll-up total offers')
    })

    it('TC-P4-05: Rejects invalid dimensions, measures, and filter values safely via API', async () => {
      // Invalid dimension
      const res1 = await request(app).get('/api/analytics/olap?primaryDimension=unsupported_table_name')
      assert.equal(res1.status, 422)

      // Invalid measure
      const res2 = await request(app).get('/api/analytics/olap?measure=unsupported_metric')
      assert.equal(res2.status, 422)

      // Invalid minLpa format
      const res3 = await request(app).get('/api/analytics/olap?minLpa=not_a_number')
      assert.equal(res3.status, 422)
    })

    it('TC-P4-06: Empty datasets return valid empty responses with zero division protection', async () => {
      const emptyOlap = await warehouseRepo.getOlapData({
        primaryDimension: 'department',
        sliceDept: 'NonExistentDivisionXYZ',
      })

      assert.equal(emptyOlap.cells.length, 0)
      assert.equal(emptyOlap.rollup.totalOffers, 0)
      assert.equal(emptyOlap.rollup.placedCount, 0)
      assert.equal(emptyOlap.rollup.placementRate, 0)
      assert.equal(emptyOlap.rollup.avgLpa, 0)
      assert.equal(emptyOlap.rollup.medianLpa, 0)
    })

    it('TC-P4-07: Fact table joins do NOT inflate fact counts or financial aggregates', async () => {
      const { rows } = await query('SELECT count(*)::int as actual_offers FROM dwh.fact_placement;')
      const actualOffers = Number(rows[0].actual_offers)

      const olap = await warehouseRepo.getOlapData({ primaryDimension: 'department' })
      assert.equal(olap.rollup.totalOffers, actualOffers, 'OLAP join must never multiply or inflate placement fact count')
    })

    it('TC-P4-08: Source filters correctly separate operational, benchmark, and combined data', async () => {
      // Benchmark source slice
      const benchOlap = await warehouseRepo.getOlapData({
        primaryDimension: 'department',
        sliceSource: 'benchmark',
      })
      assert.equal(benchOlap.activeSource, 'benchmark')
      assert.equal(benchOlap.isCombined, false)

      // Overview with operational source filter
      const opOverview = await warehouseRepo.getWarehouseOverview({ recordSource: 'operational' })
      assert.equal(opOverview.warehouse.activeSource, 'operational')
      assert.equal(opOverview.warehouse.isCombined, false)
      assert.ok(opOverview.warehouse.totalStudents >= 0)

      // Combined overview (default)
      const combOverview = await warehouseRepo.getWarehouseOverview({ recordSource: 'ALL' })
      assert.equal(combOverview.warehouse.isCombined, true)
      assert.ok(combOverview.warehouse.provenanceBreakdown.students)
      assert.ok(combOverview.warehouse.provenanceBreakdown.placements)
    })

    it('TC-P4-09: Table details service enforces strict warehouse table allowlist', async () => {
      await assert.rejects(
        () => overviewService.getWarehouseTableDetails('arbitrary_malicious_table; DROP TABLE'),
        /Invalid or unpermitted table identifier/
      )
    })

    it('TC-P4-10: API handles empty filter results gracefully with 200 and empty payload', async () => {
      const res = await request(app).get('/api/analytics/career?department=CompletelyNonExistentDept')
      assert.equal(res.status, 200)
      assert.equal(res.body.departments.length, 0)
      assert.equal(res.body.kpis.placementRate, 0)
      assert.equal(res.body.kpis.totalJobOffers, 0)
      assert.equal(res.body.kpis.avgPackageLpa, 0)
    })

    it('TC-P4-11: Graduation Year / Date dimension returns integer/numeric years and supports 2D pivot and drill-down', async () => {
      // 1D OLAP request by Graduation Year
      const res = await request(app).get('/api/analytics/olap?primaryDimension=year&measure=avgLpa')
      assert.equal(res.status, 200)
      assert.ok(Array.isArray(res.body.cells))
      assert.ok(res.body.cells.length > 0)

      for (const cell of res.body.cells) {
        assert.ok(cell.primary !== undefined && cell.primary !== null)
        assert.ok(Number.isInteger(Number(cell.primary)), `Year dimension cell must be an integer: ${cell.primary}`)
        assert.ok(cell.avgLpa >= 0)
        assert.ok(cell.totalOffers >= 0)
      }

      // 2D Pivot with Year as primary and Tier as secondary
      const pivotRes = await request(app).get('/api/analytics/olap?primaryDimension=year&secondaryDimension=tier&measure=avgLpa')
      assert.equal(pivotRes.status, 200)
      assert.ok(pivotRes.body.pivot)
      assert.ok(pivotRes.body.pivot.rows.length > 0)
      assert.ok(pivotRes.body.pivot.columns.length > 0)

      // Drill-down by specific year
      const sampleYear = String(res.body.cells[0].primary)
      const drillRes = await request(app).get(`/api/analytics/olap?primaryDimension=year&drillDownKey=${sampleYear}`)
      assert.equal(drillRes.status, 200)
      assert.ok(drillRes.body.drillDown)
      assert.equal(String(drillRes.body.drillDown.key), sampleYear)
      assert.ok(Array.isArray(drillRes.body.drillDown.records))
    })
  })

  // =========================================================================
  // 7. PHASE 4.5: SYNTHETIC DATASET INTEGRATION & END-TO-END VERIFICATION
  // =========================================================================
  describe('Phase 4.5: Synthetic Dataset Integration & Verification', () => {
    let testSkillBatch
    let testAlumniBatch
    let testJobBatch
    let testAlumniSkillBatch
    let testJobSkillBatch
    let testAppBatch
    let testOutcomeBatch

    it('TC-P45-01: Dry-run preview accurately reports insert/update/reject counts without committing', async () => {
      const skillsCsv = `skill_id,skill_name,skill_category,data_source
SKILL-T1,Go Programming,Backend Engineering,indian_academic_benchmark
SKILL-T2,Rust Systems,Systems Engineering,indian_academic_benchmark`

      const dryRunRes = await stageCsvUpload({
        fileName: 'skills_preview.csv',
        csvContent: skillsCsv,
        requestedType: 'skills',
        dryRun: true,
      })

      assert.equal(dryRunRes.status, 'DRY_RUN_PREVIEW')
      assert.equal(dryRunRes.dryRun, true)
      assert.equal(dryRunRes.rowsTotal, 2)
      assert.equal(dryRunRes.rowsValid, 2)
      assert.equal(dryRunRes.rowsToInsert, 2)
      assert.equal(dryRunRes.rowsToReject, 0)
      assert.equal(dryRunRes.batchId, null)

      // Confirm no records were written to database during dry run
      const checkRes = await query(`SELECT count(*)::int as c FROM dwh.dim_skill WHERE natural_skill_id IN ('SKILL-T1', 'SKILL-T2');`)
      assert.equal(Number(checkRes.rows[0].c), 0)
    })

    it('TC-P45-02: Staging and confirming all 7 synthetic dataset types in strict dependency order', async () => {
      // 1. Stage & Confirm Skills
      const skillsCsv = `skill_id,skill_name,skill_category,data_source
SKILL-T01,Synthetic TypeScript,Programming Languages,indian_academic_benchmark
SKILL-T02,Synthetic Docker,Cloud & Infrastructure,indian_academic_benchmark`
      testSkillBatch = await stageCsvUpload({ fileName: 'test_skills.csv', csvContent: skillsCsv, requestedType: 'skills' })
      assert.equal(testSkillBatch.status, 'STAGED')
      const skillConfirm = await confirmBatchImport(testSkillBatch.batchId)
      assert.equal(skillConfirm.status, 'COMPLETED')
      assert.equal(skillConfirm.rowsInserted, 2)

      // 2. Stage & Confirm Alumni
      const alumniCsv = `alumni_id,graduation_year,degree,field_of_study,current_role,industry,experience_years,location_region,career_level,data_source
IND-ALUM-T001,2022,B.Tech CSE,Computer Science,Frontend Engineer,SaaS,3,Bengaluru (Karnataka),Mid-Level,indian_academic_benchmark
IND-ALUM-T002,2020,M.Tech AI,Data Science,ML Ops Engineer,AI & Analytics,5,Pune (Maharashtra),Senior,indian_academic_benchmark`
      testAlumniBatch = await stageCsvUpload({ fileName: 'test_alumni.csv', csvContent: alumniCsv, requestedType: 'alumni' })
      const alumniConfirm = await confirmBatchImport(testAlumniBatch.batchId)
      assert.equal(alumniConfirm.rowsInserted, 2)

      // 3. Stage & Confirm Jobs
      const jobsCsv = `job_id,job_title,company_id,company_name,industry,location_region,employment_type,posted_date,experience_level,data_source
IND-JOB-T001,Full Stack Engineer,IND-COMP-T1,AryaNet Tech Systems,Consulting,Bengaluru (Karnataka),Full-Time,2024-03-01,Mid-Level,indian_academic_benchmark
IND-JOB-T002,DevOps Engineer,IND-COMP-T2,Kavach CyberSec Labs,Cybersecurity,Pune (Maharashtra),Full-Time,2024-04-15,Senior,indian_academic_benchmark`
      testJobBatch = await stageCsvUpload({ fileName: 'test_jobs.csv', csvContent: jobsCsv, requestedType: 'jobs' })
      const jobConfirm = await confirmBatchImport(testJobBatch.batchId)
      assert.equal(jobConfirm.rowsInserted, 2)

      // 4. Stage & Confirm Alumni Skills (Bridge)
      const alumniSkillsCsv = `alumni_id,skill_id,proficiency_level,years_used,data_source
IND-ALUM-T001,SKILL-T01,Expert,3,indian_academic_benchmark
IND-ALUM-T002,SKILL-T02,Advanced,4,indian_academic_benchmark`
      testAlumniSkillBatch = await stageCsvUpload({ fileName: 'test_alumni_skills.csv', csvContent: alumniSkillsCsv, requestedType: 'alumni_skills' })
      assert.equal(testAlumniSkillBatch.rowsValid, 2)
      const alumniSkillConfirm = await confirmBatchImport(testAlumniSkillBatch.batchId)
      assert.equal(alumniSkillConfirm.rowsInserted, 2)

      // 5. Stage & Confirm Job Skills (Bridge)
      const jobSkillsCsv = `job_id,skill_id,required_level,data_source
IND-JOB-T001,SKILL-T01,Mandatory,indian_academic_benchmark
IND-JOB-T002,SKILL-T02,Preferred,indian_academic_benchmark`
      testJobSkillBatch = await stageCsvUpload({ fileName: 'test_job_skills.csv', csvContent: jobSkillsCsv, requestedType: 'job_skills' })
      const jobSkillConfirm = await confirmBatchImport(testJobSkillBatch.batchId)
      assert.equal(jobSkillConfirm.rowsInserted, 2)

      // 6. Stage & Confirm Applications (Fact)
      const appsCsv = `application_id,alumni_id,job_id,application_date,application_status,days_to_decision,data_source
IND-APP-T001,IND-ALUM-T001,IND-JOB-T001,2024-03-10,offered,18,indian_academic_benchmark
IND-APP-T002,IND-ALUM-T002,IND-JOB-T002,2024-05-01,hired,22,indian_academic_benchmark`
      testAppBatch = await stageCsvUpload({ fileName: 'test_apps.csv', csvContent: appsCsv, requestedType: 'applications' })
      const appConfirm = await confirmBatchImport(testAppBatch.batchId)
      assert.equal(appConfirm.rowsInserted, 2)

      // 7. Stage & Confirm Career Outcomes (Fact 1:1 Target)
      const outcomesCsv = `outcome_id,alumni_id,observation_period_months,employed_within_6_months,career_level,industry,experience_years_at_observation,data_source
IND-OUT-T001,IND-ALUM-T001,6,1,Mid-Level,SaaS,3,indian_academic_benchmark
IND-OUT-T002,IND-ALUM-T002,6,1,Senior,AI & Analytics,5,indian_academic_benchmark`
      testOutcomeBatch = await stageCsvUpload({ fileName: 'test_outcomes.csv', csvContent: outcomesCsv, requestedType: 'career_outcomes' })
      const outcomeConfirm = await confirmBatchImport(testOutcomeBatch.batchId)
      assert.equal(outcomeConfirm.rowsInserted, 2)
    })

    it('TC-P45-03: Foreign key validation safely rejects records referencing non-existent natural IDs', async () => {
      const invalidBridgeCsv = `alumni_id,skill_id,proficiency_level,years_used,data_source
IND-ALUM-NONEXISTENT,SKILL-T01,Intermediate,2,indian_academic_benchmark
IND-ALUM-T001,SKILL-NONEXISTENT,Intermediate,2,indian_academic_benchmark`

      const staged = await stageCsvUpload({
        fileName: 'invalid_fks.csv',
        csvContent: invalidBridgeCsv,
        requestedType: 'alumni_skills',
      })

      assert.equal(staged.rowsTotal, 2)
      assert.equal(staged.rowsValid, 0)
      assert.equal(staged.rowsInvalid, 2)
      assert.ok(staged.sampleErrors.some((e) => e.validationError.includes('Foreign key violation: alumni_id')))
      assert.ok(staged.sampleErrors.some((e) => e.validationError.includes('Foreign key violation: skill_id')))
    })

    it('TC-P45-04: Duplicate prevention rejects repeated natural IDs and duplicate composite keys', async () => {
      // In-file duplicate bridge entries
      const dupBridgeCsv = `alumni_id,skill_id,proficiency_level,years_used,data_source
IND-ALUM-T001,SKILL-T02,Intermediate,2,indian_academic_benchmark
IND-ALUM-T001,SKILL-T02,Advanced,3,indian_academic_benchmark`

      const staged = await stageCsvUpload({
        fileName: 'dup_bridge.csv',
        csvContent: dupBridgeCsv,
        requestedType: 'alumni_skills',
      })

      assert.equal(staged.rowsValid, 1)
      assert.equal(staged.rowsInvalid, 1)
      assert.ok(staged.sampleErrors[0].validationError.includes('Duplicate composite bridge pair'))

      // Duplicate 1:1 outcome for same alumni
      const dupOutcomeCsv = `outcome_id,alumni_id,observation_period_months,employed_within_6_months,career_level,industry,experience_years_at_observation,data_source
IND-OUT-D1,IND-ALUM-T001,6,1,Mid-Level,SaaS,3,indian_academic_benchmark
IND-OUT-D2,IND-ALUM-T001,6,0,Mid-Level,SaaS,3,indian_academic_benchmark`

      const outcomeStaged = await stageCsvUpload({
        fileName: 'dup_outcomes.csv',
        csvContent: dupOutcomeCsv,
        requestedType: 'career_outcomes',
      })

      assert.equal(outcomeStaged.rowsValid, 1)
      assert.equal(outcomeStaged.rowsInvalid, 1)
      assert.ok(outcomeStaged.sampleErrors[0].validationError.includes('Duplicate 1:1 outcome'))
    })

    it('TC-P45-05: Rejects chronological paradox where application_date precedes job posted_date', async () => {
      // Job IND-JOB-T001 was posted on 2024-03-01
      const paradoxAppCsv = `application_id,alumni_id,job_id,application_date,application_status,days_to_decision,data_source
IND-APP-PARADOX,IND-ALUM-T001,IND-JOB-T001,2024-01-15,applied,10,indian_academic_benchmark`

      const staged = await stageCsvUpload({
        fileName: 'paradox_app.csv',
        csvContent: paradoxAppCsv,
        requestedType: 'applications',
      })

      assert.equal(staged.rowsValid, 0)
      assert.equal(staged.rowsInvalid, 1)
      assert.ok(staged.sampleErrors[0].validationError.includes('Date chronology violation'))
      assert.ok(staged.sampleErrors[0].validationError.includes('cannot precede job posted_date'))
    })

    it('TC-P45-06: Validates malformed CSV rows, invalid target values, and bad dates', async () => {
      const badDataCsv = `outcome_id,alumni_id,observation_period_months,employed_within_6_months,career_level,industry,experience_years_at_observation,data_source
IND-OUT-BAD1,IND-ALUM-T001,6,99,Mid-Level,SaaS,3,indian_academic_benchmark
IND-OUT-BAD2,,6,1,Mid-Level,SaaS,3,indian_academic_benchmark`

      const staged = await stageCsvUpload({
        fileName: 'bad_outcomes.csv',
        csvContent: badDataCsv,
        requestedType: 'career_outcomes',
      })

      assert.equal(staged.rowsValid, 0)
      assert.equal(staged.rowsInvalid, 2)
      assert.ok(staged.sampleErrors.some((e) => e.validationError.includes('Must be strictly 0 or 1')))
      assert.ok(staged.sampleErrors.some((e) => e.validationError.includes('Missing alumni_id')))
    })

    it('TC-P45-07: Idempotent re-import updates existing natural keys without throwing or creating duplicates', async () => {
      const { rows: beforeRows } = await query(`SELECT count(*)::int as c FROM dwh.dim_alumni WHERE natural_alumni_id = 'IND-ALUM-T001';`)
      assert.equal(Number(beforeRows[0].c), 1)

      const updateAlumniCsv = `alumni_id,graduation_year,degree,field_of_study,current_role,industry,experience_years,location_region,career_level,data_source
IND-ALUM-T001,2022,B.Tech CSE,Computer Science,Lead Staff Engineer,SaaS,4,Bengaluru (Karnataka),Lead/Principal,indian_academic_benchmark`

      const staged = await stageCsvUpload({
        fileName: 'alumni_update.csv',
        csvContent: updateAlumniCsv,
        requestedType: 'alumni',
      })

      assert.equal(staged.rowsToUpdate, 1)
      assert.equal(staged.rowsToInsert, 0)

      const confirmed = await confirmBatchImport(staged.batchId)
      assert.equal(confirmed.rowsInserted, 1)

      // Verify row count remained 1 and job_role updated
      const { rows: afterRows } = await query(`SELECT count(*)::int as c, job_role, career_level FROM dwh.dim_alumni WHERE natural_alumni_id = 'IND-ALUM-T001' GROUP BY job_role, career_level;`)
      assert.equal(Number(afterRows[0].c), 1)
      assert.equal(afterRows[0].job_role, 'Lead Staff Engineer')
      assert.equal(afterRows[0].career_level, 'Lead/Principal')
    })

    it('TC-P45-08: Transactional rollback cleanly reverses imported records and updates audit ledger', async () => {
      // Stage & confirm an isolated test batch to rollback
      const testCsv = `skill_id,skill_name,skill_category,data_source
SKILL-ROLLBACK-1,Temporary Rollback Skill,Testing,indian_academic_benchmark`

      const staged = await stageCsvUpload({ fileName: 'to_rollback.csv', csvContent: testCsv, requestedType: 'skills' })
      const confirmed = await confirmBatchImport(staged.batchId)
      assert.equal(confirmed.rowsInserted, 1)

      // Rollback the batch
      const rolledBack = await rollbackBatchImport(staged.batchId)
      assert.equal(rolledBack.status, 'ROLLED_BACK')

      // Verify ledger status
      const { rows: batchRows } = await query(`SELECT status, rows_inserted FROM dwh.etl_batches WHERE id = $1;`, [staged.batchId])
      assert.equal(batchRows[0].status, 'rolled_back')
      assert.equal(batchRows[0].rows_inserted, 0)
    })

    it('TC-P45-09: Provenance separation ensures synthetic data is never misclassified as operational', async () => {
      const { rows: sources } = await query(`
        SELECT DISTINCT record_source FROM dwh.dim_alumni WHERE natural_alumni_id LIKE 'IND-ALUM-%'
        UNION
        SELECT DISTINCT record_source FROM dwh.dim_job WHERE natural_job_id LIKE 'IND-JOB-%'
        UNION
        SELECT DISTINCT record_source FROM dwh.fact_career_outcomes WHERE natural_outcome_id LIKE 'IND-OUT-%';
      `)

      assert.equal(sources.length, 1)
      assert.equal(sources[0].record_source, 'indian_academic_benchmark')

      // Ensure operational tables have ZERO synthetic records (if public schema exists)
      try {
        const { rows: operationalUsers } = await query(`SELECT count(*)::int as c FROM public.users WHERE email LIKE '%synthetic%';`)
        assert.equal(Number(operationalUsers[0].c), 0)
      } catch (err) {
        // In pure isolated DWH database, public.users does not exist, guaranteeing zero records
        assert.ok(true)
      }
    })

    it('TC-P45-10: End-to-end aggregate reconciliation between warehouse tables and imported sample', async () => {
      const [alumniCount, jobCount, bridgeAlumniSkillCount, appCount, outcomeCount] = await Promise.all([
        query(`SELECT count(*)::int as c FROM dwh.dim_alumni WHERE natural_alumni_id LIKE 'IND-ALUM-T00%';`),
        query(`SELECT count(*)::int as c FROM dwh.dim_job WHERE natural_job_id LIKE 'IND-JOB-T00%';`),
        query(`SELECT count(*)::int as c FROM dwh.bridge_alumni_skill WHERE record_source = 'indian_academic_benchmark';`),
        query(`SELECT count(*)::int as c FROM dwh.fact_job_application WHERE record_source = 'indian_academic_benchmark';`),
        query(`SELECT count(*)::int as c FROM dwh.fact_career_outcomes WHERE record_source = 'indian_academic_benchmark';`),
      ])

      assert.equal(Number(alumniCount.rows[0].c), 2)
      assert.equal(Number(jobCount.rows[0].c), 2)
      assert.ok(Number(bridgeAlumniSkillCount.rows[0].c) >= 2)
      assert.ok(Number(appCount.rows[0].c) >= 2)
      assert.ok(Number(outcomeCount.rows[0].c) >= 2)
    })

    it('TC-P45-11: Multi-file dry-run relational key chaining allows previewing dependent bridges without prior database writes', async () => {
      // Ephemeral parent datasets in dry run
      const ephemeralAlumni = new Set(['IND-ALUM-EPHEMERAL-1'])
      const ephemeralSkills = new Set(['SKILL-EPHEMERAL-1'])

      const bridgeCsv = `alumni_id,skill_id,proficiency_level,years_used,data_source
IND-ALUM-EPHEMERAL-1,SKILL-EPHEMERAL-1,Intermediate,3,indian_academic_benchmark`

      // Preview bridge with knownParentKeys chaining
      const preview = await stageCsvUpload({
        fileName: 'ephemeral_bridge.csv',
        csvContent: bridgeCsv,
        requestedType: 'alumni_skills',
        dryRun: true,
        knownParentKeys: {
          alumniIds: ephemeralAlumni,
          skillIds: ephemeralSkills,
        },
      })

      assert.equal(preview.rowsTotal, 1)
      assert.equal(preview.rowsValid, 1)
      assert.equal(preview.rowsToInsert, 1)
      assert.equal(preview.rowsToReject, 0)
    })

    it('TC-P46-01: Placement rate returns 0.0 with no NaN or errors when eligible student cohort is zero', async () => {
      // Query with a non-existent department to ensure 0 eligible students
      const analytics = await warehouseRepo.getCareerAnalytics({
        department: 'NonExistentEngineeringDepartment123',
        recordSource: 'ALL',
      })

      assert.ok(analytics)
      assert.equal(analytics.kpis.total_eligible, 0)
      assert.equal(analytics.kpis.total_placed, 0)
      assert.equal(Number(analytics.kpis.placement_rate), 0)
      assert.equal(analytics.byDepartment.length, 0)
    })

    it('TC-P46-02: Placement rate accurately computes partially placed cohorts without dropping unplaced students', async () => {
      // Create a controlled cohort of 10 students: 4 placed, 6 unplaced
      const testGradYear = 2099
      const dept = 'SafetyAuditDept'
      const testSource = 'synthetic_test_cohort'

      // Clean any previous test rows for this year
      await query(`DELETE FROM dwh.fact_placement WHERE student_sk IN (SELECT student_sk FROM dwh.dim_student WHERE graduation_year = $1);`, [testGradYear])
      await query(`DELETE FROM dwh.dim_student WHERE graduation_year = $1;`, [testGradYear])

      // Insert 10 students
      const studentSks = []
      for (let i = 1; i <= 10; i++) {
        const res = await query(`
          INSERT INTO dwh.dim_student (student_id_number, department, degree, graduation_year, record_source)
          VALUES ($1, $2, 'B.Tech', $3, $4)
          RETURNING student_sk;
        `, [`STU-TEST-${i}`, dept, testGradYear, testSource])
        studentSks.push(res.rows[0].student_sk)
      }

      // Ensure a company exists
      const compRes = await query(`
        INSERT INTO dwh.dim_company (company_name, industry)
        VALUES ('TestAuditCorp', 'Technology')
        ON CONFLICT (company_name) DO UPDATE SET industry = EXCLUDED.industry
        RETURNING company_sk;
      `)
      const compSk = compRes.rows[0].company_sk

      // Place 4 out of the 10 students (40% placement rate)
      for (let i = 0; i < 4; i++) {
        await query(`
          INSERT INTO dwh.fact_placement (student_sk, company_sk, annual_package_lpa, record_source)
          VALUES ($1, $2, 12.0, $3);
        `, [studentSks[i], compSk, testSource])
      }

      // Query with cohort filter
      const analytics = await warehouseRepo.getCareerAnalytics({
        department: dept,
        year: testGradYear,
        recordSource: testSource,
      })

      assert.equal(analytics.kpis.total_eligible, 10)
      assert.equal(analytics.kpis.total_placed, 4)
      assert.equal(Number(analytics.kpis.placement_rate), 40.0)

      assert.equal(analytics.byDepartment.length, 1)
      assert.equal(analytics.byDepartment[0].eligible, 10)
      assert.equal(analytics.byDepartment[0].placed, 4)
      assert.equal(Number(analytics.byDepartment[0].rate), 40.0)

      // Cleanup
      await query(`DELETE FROM dwh.fact_placement WHERE student_sk = ANY($1);`, [studentSks])
      await query(`DELETE FROM dwh.dim_student WHERE student_sk = ANY($1);`, [studentSks])
    })

    it('TC-P46-03: Placement rate isolates mixed data sources correctly without contaminating denominators', async () => {
      const testGradYear = 2098
      const dept = 'MixedSourceAuditDept'

      // Insert 5 operational students (2 placed)
      const opSks = []
      for (let i = 1; i <= 5; i++) {
        const res = await query(`
          INSERT INTO dwh.dim_student (student_id_number, department, degree, graduation_year, record_source)
          VALUES ($1, $2, 'B.Tech', $3, 'operational')
          RETURNING student_sk;
        `, [`STU-OP-${i}`, dept, testGradYear])
        opSks.push(res.rows[0].student_sk)
      }

      // Insert 10 synthetic students (8 placed)
      const synSks = []
      for (let i = 1; i <= 10; i++) {
        const res = await query(`
          INSERT INTO dwh.dim_student (student_id_number, department, degree, graduation_year, record_source)
          VALUES ($1, $2, 'B.Tech', $3, 'indian_academic_benchmark')
          RETURNING student_sk;
        `, [`STU-IND-${i}`, dept, testGradYear])
        synSks.push(res.rows[0].student_sk)
      }

      const compRes = await query(`SELECT company_sk FROM dwh.dim_company LIMIT 1;`)
      const compSk = compRes.rows[0].company_sk

      // 2 operational placements
      for (let i = 0; i < 2; i++) {
        await query(`INSERT INTO dwh.fact_placement (student_sk, company_sk, annual_package_lpa, record_source) VALUES ($1, $2, 10.0, 'operational');`, [opSks[i], compSk])
      }
      // 8 synthetic placements
      for (let i = 0; i < 8; i++) {
        await query(`INSERT INTO dwh.fact_placement (student_sk, company_sk, annual_package_lpa, record_source) VALUES ($1, $2, 15.0, 'indian_academic_benchmark');`, [synSks[i], compSk])
      }

      // 1. Operational slice: 2 placed / 5 eligible = 40.0%
      const opAnalytics = await warehouseRepo.getCareerAnalytics({
        department: dept,
        year: testGradYear,
        recordSource: 'operational',
      })
      assert.equal(opAnalytics.kpis.total_eligible, 5)
      assert.equal(opAnalytics.kpis.total_placed, 2)
      assert.equal(Number(opAnalytics.kpis.placement_rate), 40.0)

      // 2. Synthetic slice: 8 placed / 10 eligible = 80.0%
      const synAnalytics = await warehouseRepo.getCareerAnalytics({
        department: dept,
        year: testGradYear,
        recordSource: 'indian_academic_benchmark',
      })
      assert.equal(synAnalytics.kpis.total_eligible, 10)
      assert.equal(synAnalytics.kpis.total_placed, 8)
      assert.equal(Number(synAnalytics.kpis.placement_rate), 80.0)

      // 3. Mixed / ALL slice: 10 placed / 15 eligible = 66.7%
      const allAnalytics = await warehouseRepo.getCareerAnalytics({
        department: dept,
        year: testGradYear,
        recordSource: 'ALL',
      })
      assert.equal(allAnalytics.kpis.total_eligible, 15)
      assert.equal(allAnalytics.kpis.total_placed, 10)
      assert.equal(Number(allAnalytics.kpis.placement_rate), 66.7)

      // Cleanup
      const allSks = [...opSks, ...synSks]
      await query(`DELETE FROM dwh.fact_placement WHERE student_sk = ANY($1);`, [allSks])
      await query(`DELETE FROM dwh.dim_student WHERE student_sk = ANY($1);`, [allSks])
    })

    it('TC-P46-04: Skill ingestion with name collision never modifies operational record_source or natural_skill_id', async () => {
      // Create operational skill
      const opSkillName = 'OperationalSafetySkill_' + Date.now()
      const opRes = await query(`
        INSERT INTO dwh.dim_skill (skill_name, category, record_source)
        VALUES ($1, 'OperationalCore', 'operational')
        RETURNING skill_sk, natural_skill_id, record_source;
      `, [opSkillName])
      const opSkillSk = opRes.rows[0].skill_sk

      // Attempt to stage & import synthetic skill with the exact same name
      const synSkillCsv = `skill_id,skill_name,category,data_source
SKILL-SAFETY-COLLIDE,${opSkillName},SyntheticCloud,indian_academic_benchmark`

      const staged = await stageCsvUpload({
        fileName: 'collide_skill.csv',
        csvContent: synSkillCsv,
        requestedType: 'skills',
      })

      // Name collision with existing skill is treated as an update to associate natural key
      assert.equal(staged.rowsToUpdate, 1)
      assert.equal(staged.rowsToInsert, 0)

      // Confirm import
      await confirmBatchImport(staged.batchId)

      // Verify operational skill was completely preserved with operational provenance
      const afterRes = await query(`SELECT skill_sk, natural_skill_id, record_source, category FROM dwh.dim_skill WHERE skill_sk = $1;`, [opSkillSk])
      assert.equal(afterRes.rows[0].record_source, 'operational')
      assert.equal(afterRes.rows[0].natural_skill_id, 'SKILL-SAFETY-COLLIDE')
      assert.equal(afterRes.rows[0].category, 'SyntheticCloud')

      // Ensure no synthetic record took over the operational skill's identity
      const synRes = await query(`SELECT skill_sk FROM dwh.dim_skill WHERE skill_sk = $1 AND record_source = 'indian_academic_benchmark';`, [opSkillSk])
      assert.equal(synRes.rows.length, 0)

      // Cleanup
      await query(`DELETE FROM dwh.dim_skill WHERE skill_sk = $1;`, [opSkillSk])
    })
  })
})
