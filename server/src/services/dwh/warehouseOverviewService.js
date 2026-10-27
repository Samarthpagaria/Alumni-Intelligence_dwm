/**
 * Warehouse Overview & Metadata Inspection Service for DWM Platform.
 * Provides read-only introspection of the analytical DWH schema, catalog metadata,
 * schema topology/relationships, data quality diagnostics, CSV dataset inventory,
 * and ETL batch audit ledger.
 *
 * Strictly decoupled from the operational (public.*) schema.
 */
import fs from 'node:fs'
import path from 'node:path'
import { queryDwh } from '../../config/dwh.js'
import logger from '../../utils/logger.js'

// Strict allowlist of known warehouse tables
export const WAREHOUSE_TABLES = [
  'dim_student',
  'dim_alumni',
  'dim_company',
  'dim_skill',
  'dim_date',
  'dim_job',
  'bridge_student_skill',
  'bridge_alumni_skill',
  'bridge_job_skill',
  'fact_placement',
  'fact_job_application',
  'fact_salary_benchmark',
  'fact_career_outcomes',
  'etl_batches',
  'etl_batch_errors',
]

export const TABLE_METADATA = {
  dim_student: {
    category: 'dimension',
    displayName: 'Student Dimension',
    description: 'Academic student profiles, departments, graduation cohorts, and CGPA metrics.',
    primaryKey: ['student_sk'],
  },
  dim_alumni: {
    category: 'dimension',
    displayName: 'Alumni Dimension',
    description: 'Graduated alumni directory with career trajectories, industry sectors, and experience years.',
    primaryKey: ['alumni_sk'],
  },
  dim_company: {
    category: 'dimension',
    displayName: 'Company Dimension',
    description: 'Recruiting organizations, industry verticals, and institutional recruitment tiers.',
    primaryKey: ['company_sk'],
  },
  dim_skill: {
    category: 'dimension',
    displayName: 'Skill Dimension',
    description: 'Standardized technology stack taxonomy, technical disciplines, and skill categories.',
    primaryKey: ['skill_sk'],
  },
  dim_date: {
    category: 'dimension',
    displayName: 'Calendar Date Dimension',
    description: 'Pre-computed temporal dimension covering academic years, semesters, quarters, and calendar dates.',
    primaryKey: ['date_sk'],
  },
  dim_job: {
    category: 'dimension',
    displayName: 'Job Requisitions Dimension',
    description: 'Job postings, requisition titles, hiring company mappings, and seniority levels.',
    primaryKey: ['job_sk'],
  },
  bridge_student_skill: {
    category: 'bridge',
    displayName: 'Student-Skill Bridge',
    description: 'Many-to-many associative junction linking enrolled students to acquired competencies.',
    primaryKey: ['student_sk', 'skill_sk'],
  },
  bridge_alumni_skill: {
    category: 'bridge',
    displayName: 'Alumni-Skill Bridge',
    description: 'Many-to-many associative junction linking alumni to verified skills and years of proficiency.',
    primaryKey: ['alumni_sk', 'skill_sk'],
  },
  bridge_job_skill: {
    category: 'bridge',
    displayName: 'Job-Skill Bridge',
    description: 'Many-to-many associative junction linking job requisitions to required candidate skills.',
    primaryKey: ['job_sk', 'skill_sk'],
  },
  fact_placement: {
    category: 'fact',
    displayName: 'Placement Outcomes Fact',
    description: 'Verified campus placement transactions, CTC compensation packages (LPA), and interview evaluations.',
    primaryKey: ['placement_id'],
  },
  fact_job_application: {
    category: 'fact',
    displayName: 'Job Applications Fact',
    description: 'Job application lifecycle events, applicant screenings, days to decision, and outcomes.',
    primaryKey: ['application_id'],
  },
  fact_salary_benchmark: {
    category: 'fact',
    displayName: 'Salary Benchmark Fact',
    description: 'Historical salary compensation bands, industry market rates, and experience-based compensation levels.',
    primaryKey: ['salary_id'],
  },
  fact_career_outcomes: {
    category: 'fact',
    displayName: 'Career Outcomes Fact',
    description: 'Post-graduation employment targets at 6-month observation windows for supervised predictive mining.',
    primaryKey: ['outcome_id'],
  },
  etl_batches: {
    category: 'audit',
    displayName: 'ETL Batch Ledger',
    description: 'Audit log of ingestion batch executions, status transitions, row counts, and duration timestamps.',
    primaryKey: ['id'],
  },
  etl_batch_errors: {
    category: 'audit',
    displayName: 'ETL Batch Error Ledger',
    description: 'Row-level data validation failures and rejected record telemetry recorded during ETL pipeline processing.',
    primaryKey: ['id'],
  },
}

/**
 * A. Returns comprehensive executive warehouse summary metrics.
 */
export async function getWarehouseSummary() {
  const startTime = Date.now()

  // 1. Connection check
  let isConnected = true
  try {
    await queryDwh('SELECT 1;')
  } catch (err) {
    isConnected = false
  }

  // 2. Discover tables from information_schema
  const tablesRes = await queryDwh(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'dwh' 
    ORDER BY table_name;
  `).catch(() => ({ rows: [] }))
  const existingTableNames = tablesRes.rows.map((r) => r.table_name)

  // 3. Row count per table
  const rowCountPromises = existingTableNames.map(async (table) => {
    try {
      const res = await queryDwh(`SELECT count(*)::int as count FROM dwh."${table}";`)
      return { table, count: Number(res.rows[0]?.count || 0) }
    } catch {
      return { table, count: 0 }
    }
  })
  const rowCounts = await Promise.all(rowCountPromises)
  const rowCountMap = Object.fromEntries(rowCounts.map((r) => [r.table, r.count]))
  const totalWarehouseRecords = rowCounts.reduce((acc, r) => acc + r.count, 0)

  // 4. Columns count
  const colsRes = await queryDwh(`
    SELECT count(*)::int as total_columns
    FROM information_schema.columns
    WHERE table_schema = 'dwh';
  `).catch(() => ({ rows: [{ total_columns: 0 }] }))
  const totalColumns = Number(colsRes.rows[0]?.total_columns || 0)

  // 5. Foreign keys count
  const fkRes = await queryDwh(`
    SELECT count(*)::int as total_fks
    FROM information_schema.table_constraints
    WHERE table_schema = 'dwh' AND constraint_type = 'FOREIGN KEY';
  `).catch(() => ({ rows: [{ total_fks: 0 }] }))
  const totalForeignKeys = Number(fkRes.rows[0]?.total_fks || 0)

  // 6. Ingestion batches & last refreshed timestamp
  const batchRes = await queryDwh(`
    SELECT 
      count(*)::int as total_batches,
      count(*) FILTER (WHERE status = 'completed')::int as successful_batches,
      count(*) FILTER (WHERE status = 'failed')::int as failed_batches,
      MAX(completed_at) as last_completed_at,
      MAX(started_at) as last_started_at
    FROM dwh.etl_batches;
  `).catch(() => ({ rows: [{}] }))
  const batchRow = batchRes.rows[0] || {}

  // 7. Distinct business entities
  const [studentsRes, alumniRes, companiesRes, skillsRes, jobsRes] = await Promise.all([
    queryDwh('SELECT count(DISTINCT student_sk)::int as c FROM dwh.dim_student;').catch(() => ({ rows: [{ c: 0 }] })),
    queryDwh('SELECT count(DISTINCT alumni_sk)::int as c FROM dwh.dim_alumni;').catch(() => ({ rows: [{ c: 0 }] })),
    queryDwh('SELECT count(DISTINCT company_sk)::int as c FROM dwh.dim_company;').catch(() => ({ rows: [{ c: 0 }] })),
    queryDwh('SELECT count(DISTINCT skill_sk)::int as c FROM dwh.dim_skill;').catch(() => ({ rows: [{ c: 0 }] })),
    queryDwh('SELECT count(DISTINCT job_sk)::int as c FROM dwh.dim_job;').catch(() => ({ rows: [{ c: 0 }] })),
  ])

  // Categorize tables
  let dimensionCount = 0
  let factCount = 0
  let bridgeCount = 0
  let auditCount = 0

  for (const t of existingTableNames) {
    const meta = TABLE_METADATA[t] || {}
    if (meta.category === 'dimension' || t.startsWith('dim_')) dimensionCount++
    else if (meta.category === 'fact' || t.startsWith('fact_')) factCount++
    else if (meta.category === 'bridge' || t.startsWith('bridge_')) bridgeCount++
    else auditCount++
  }

  // 8. Provenance breakdown across warehouse
  const provRes = await queryDwh(`
    SELECT record_source, count(*)::int as c FROM (
      SELECT record_source FROM dwh.dim_student WHERE record_source IS NOT NULL
      UNION ALL
      SELECT record_source FROM dwh.dim_alumni WHERE record_source IS NOT NULL
      UNION ALL
      SELECT record_source FROM dwh.dim_job WHERE record_source IS NOT NULL
      UNION ALL
      SELECT record_source FROM dwh.fact_placement WHERE record_source IS NOT NULL
      UNION ALL
      SELECT record_source FROM dwh.fact_job_application WHERE record_source IS NOT NULL
      UNION ALL
      SELECT record_source FROM dwh.fact_career_outcomes WHERE record_source IS NOT NULL
    ) all_records
    GROUP BY record_source;
  `).catch(() => ({ rows: [] }))
  const provenanceBreakdown = Object.fromEntries(provRes.rows.map((r) => [r.record_source, Number(r.c)]))

  return {
    database: {
      status: isConnected ? 'CONNECTED' : 'DISCONNECTED',
      schema: 'dwh',
      engine: 'PostgreSQL / PGlite (Dedicated Analytical Warehouse)',
      isolationStatus: 'Fully Decoupled from Operational public.* Schema',
    },
    counts: {
      totalTables: existingTableNames.length,
      totalRows: totalWarehouseRecords,
      dimensionTables: dimensionCount,
      factTables: factCount,
      bridgeTables: bridgeCount,
      auditTables: auditCount,
      totalColumns,
      totalForeignKeys,
      datasetsCount: 7, // 7 benchmark files + external uploads
      totalBatches: Number(batchRow.total_batches || 0),
      successfulBatches: Number(batchRow.successful_batches || 0),
      failedBatches: Number(batchRow.failed_batches || 0),
      lastIngestionTimestamp: batchRow.last_completed_at || batchRow.last_started_at || null,
    },
    businessEntities: {
      distinctStudents: Number(studentsRes.rows[0]?.c || 0),
      distinctAlumni: Number(alumniRes.rows[0]?.c || 0),
      distinctCompanies: Number(companiesRes.rows[0]?.c || 0),
      distinctSkills: Number(skillsRes.rows[0]?.c || 0),
      distinctJobs: Number(jobsRes.rows[0]?.c || 0),
    },
    tableRowCounts: rowCountMap,
    provenanceBreakdown,
    measurementDistinction: {
      warehouseTableRows: totalWarehouseRecords,
      sourceCsvFileRecords: 50150, // 7 benchmark CSV files exact record lines
      ingestionBatchesCount: Number(batchRow.total_batches || 0),
      explanation: 'Warehouse Table Rows reflect dimensionally transformed records and associative bridge entries; Source CSV Records reflect raw CSV file lines; Ingestion Batches reflect ETL pipeline transactions.',
    },
    executionTimeMs: Date.now() - startTime,
  }
}

/**
 * B. Returns complete schema metadata and relational graph for the interactive ERD.
 */
export async function getWarehouseSchema() {
  // 1. Fetch all columns
  const colsRes = await queryDwh(`
    SELECT 
      table_name,
      column_name,
      data_type,
      is_nullable,
      column_default,
      ordinal_position
    FROM information_schema.columns
    WHERE table_schema = 'dwh'
    ORDER BY table_name, ordinal_position;
  `)

  // 2. Fetch PKs
  const pkRes = await queryDwh(`
    SELECT
      tc.table_name,
      kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.table_schema = 'dwh' AND tc.constraint_type = 'PRIMARY KEY';
  `)
  const pkMap = {}
  for (const row of pkRes.rows) {
    if (!pkMap[row.table_name]) pkMap[row.table_name] = []
    pkMap[row.table_name].push(row.column_name)
  }

  // 3. Fetch Foreign Keys with referenced table and column
  const fkRes = await queryDwh(`
    SELECT
      tc.table_name as source_table, 
      kcu.column_name as source_column, 
      ccu.table_name AS target_table,
      ccu.column_name AS target_column 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'dwh';
  `)

  // 4. Fetch table row counts
  const rowCountPromises = WAREHOUSE_TABLES.map(async (table) => {
    try {
      const res = await queryDwh(`SELECT count(*)::int as c FROM dwh."${table}";`)
      return [table, Number(res.rows[0]?.c || 0)]
    } catch {
      return [table, 0]
    }
  })
  const rowCounts = Object.fromEntries(await Promise.all(rowCountPromises))

  // Group columns by table
  const tableColumns = {}
  for (const col of colsRes.rows) {
    if (!tableColumns[col.table_name]) tableColumns[col.table_name] = []
    const isPk = (pkMap[col.table_name] || []).includes(col.column_name)
    const fkMatch = fkRes.rows.find(
      (fk) => fk.source_table === col.table_name && fk.source_column === col.column_name
    )

    tableColumns[col.table_name].push({
      name: col.column_name,
      dataType: col.data_type,
      nullable: col.is_nullable === 'YES',
      defaultValue: col.column_default,
      isPk,
      isFk: Boolean(fkMatch),
      references: fkMatch
        ? { table: fkMatch.target_table, column: fkMatch.target_column }
        : null,
    })
  }

  // Build table descriptors
  const tables = Object.keys(tableColumns).map((tableName) => {
    const meta = TABLE_METADATA[tableName] || {
      category: tableName.startsWith('dim_')
        ? 'dimension'
        : tableName.startsWith('fact_')
          ? 'fact'
          : tableName.startsWith('bridge_')
            ? 'bridge'
            : 'audit',
      displayName: tableName,
      description: 'DWM warehouse relation.',
      primaryKey: pkMap[tableName] || [],
    }

    const outgoingFks = fkRes.rows
      .filter((fk) => fk.source_table === tableName)
      .map((fk) => ({
        column: fk.source_column,
        targetTable: fk.target_table,
        targetColumn: fk.target_column,
      }))

    const incomingFks = fkRes.rows
      .filter((fk) => fk.target_table === tableName)
      .map((fk) => ({
        sourceTable: fk.source_table,
        sourceColumn: fk.source_column,
        column: fk.target_column,
      }))

    return {
      name: tableName,
      schema: 'dwh',
      category: meta.category,
      displayName: meta.displayName,
      description: meta.description,
      rowCount: rowCounts[tableName] || 0,
      columnCount: tableColumns[tableName].length,
      primaryKey: pkMap[tableName] || meta.primaryKey || [],
      columns: tableColumns[tableName],
      foreignKeys: outgoingFks,
      referencedBy: incomingFks,
    }
  })

  // Build relationships (edges) for ERD
  const relationships = fkRes.rows.map((fk, idx) => ({
    id: `rel-${idx}-${fk.source_table}-${fk.target_table}`,
    sourceTable: fk.source_table,
    sourceColumn: fk.source_column,
    targetTable: fk.target_table,
    targetColumn: fk.target_column,
    cardinality: fk.source_table.startsWith('bridge_') ? 'many-to-many' : 'many-to-one',
  }))

  return {
    schema: 'dwh',
    tables,
    relationships,
    totalTables: tables.length,
    totalRelationships: relationships.length,
  }
}

/**
 * C & D. Returns detailed table statistics, column profiles, relationships, and safe sample records.
 */
export async function getWarehouseTableDetails(tableName, { page = 1, pageSize = 10, search = '' } = {}) {
  // Strict allowlist validation
  if (!WAREHOUSE_TABLES.includes(tableName)) {
    throw new Error(`Invalid or unpermitted table identifier: "${tableName}"`)
  }

  // 1. Column definitions
  const colsRes = await queryDwh(
    `
    SELECT 
      column_name,
      data_type,
      is_nullable,
      column_default,
      ordinal_position
    FROM information_schema.columns
    WHERE table_schema = 'dwh' AND table_name = $1
    ORDER BY ordinal_position;
  `,
    [tableName]
  )
  const columns = colsRes.rows

  // 2. PK & FK metadata
  const pkRes = await queryDwh(
    `
    SELECT kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.table_schema = 'dwh' AND tc.table_name = $1 AND tc.constraint_type = 'PRIMARY KEY';
  `,
    [tableName]
  )
  const primaryKeys = pkRes.rows.map((r) => r.column_name)

  const fkRes = await queryDwh(
    `
    SELECT
      kcu.column_name as source_column, 
      ccu.table_name AS target_table,
      ccu.column_name AS target_column 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'dwh' AND tc.table_name = $1;
  `,
    [tableName]
  )

  const referencedByRes = await queryDwh(
    `
    SELECT
      tc.table_name as referencing_table,
      kcu.column_name as referencing_column, 
      ccu.column_name AS target_column 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'dwh' AND ccu.table_name = $1;
  `,
    [tableName]
  )

  // 3. Row count
  const countRes = await queryDwh(`SELECT count(*)::int as count FROM dwh."${tableName}";`)
  const totalRows = Number(countRes.rows[0]?.count || 0)

  // 4. Column statistics (null counts, distinct counts, min/max)
  const columnStats = {}
  for (const col of columns) {
    const colName = col.column_name
    try {
      const isNumericOrDate = [
        'integer',
        'numeric',
        'real',
        'double precision',
        'date',
        'timestamp without time zone',
        'timestamp with time zone',
      ].includes(col.data_type.toLowerCase())

      const statsQuery = isNumericOrDate
        ? `SELECT 
             COUNT(*) FILTER (WHERE "${colName}" IS NULL)::int as null_count,
             COUNT(DISTINCT "${colName}")::int as distinct_count,
             MIN("${colName}")::text as min_val,
             MAX("${colName}")::text as max_val
           FROM dwh."${tableName}";`
        : `SELECT 
             COUNT(*) FILTER (WHERE "${colName}" IS NULL)::int as null_count,
             COUNT(DISTINCT "${colName}")::int as distinct_count
           FROM dwh."${tableName}";`

      const statRes = await queryDwh(statsQuery)
      const row = statRes.rows[0] || {}
      const nullCount = Number(row.null_count || 0)
      const nullPercentage = totalRows > 0 ? Number(((nullCount / totalRows) * 100).toFixed(1)) : 0

      columnStats[colName] = {
        nullCount,
        nullPercentage,
        distinctCount: Number(row.distinct_count || 0),
        min: row.min_val || null,
        max: row.max_val || null,
      }
    } catch {
      columnStats[colName] = {
        nullCount: 0,
        nullPercentage: 0,
        distinctCount: 0,
        min: null,
        max: null,
      }
    }
  }

  // 5. Duplicate primary key check
  let duplicateKeyCount = 0
  if (primaryKeys.length > 0) {
    try {
      const pkCols = primaryKeys.map((k) => `"${k}"`).join(', ')
      const dupRes = await queryDwh(`
        SELECT count(*)::int as dups FROM (
          SELECT ${pkCols}, count(*) 
          FROM dwh."${tableName}"
          GROUP BY ${pkCols}
          HAVING count(*) > 1
        ) sub;
      `)
      duplicateKeyCount = Number(dupRes.rows[0]?.dups || 0)
    } catch {
      duplicateKeyCount = 0
    }
  }

  // 6. Safe paginated sample records
  const validPage = Math.max(1, parseInt(page, 10) || 1)
  const validPageSize = Math.min(50, Math.max(1, parseInt(pageSize, 10) || 10))
  const offset = (validPage - 1) * validPageSize

  const orderClause = primaryKeys.length > 0
    ? `ORDER BY ${primaryKeys.map((k) => `"${k}" ASC`).join(', ')}`
    : ''

  const sampleRes = await queryDwh(
    `SELECT * FROM dwh."${tableName}" ${orderClause} LIMIT $1 OFFSET $2;`,
    [validPageSize, offset]
  )

  const meta = TABLE_METADATA[tableName] || {}

  return {
    tableName,
    schema: 'dwh',
    category: meta.category,
    displayName: meta.displayName,
    description: meta.description,
    totalRows,
    primaryKeys,
    foreignKeys: fkRes.rows.map((r) => ({
      column: r.source_column,
      targetTable: r.target_table,
      targetColumn: r.target_column,
    })),
    referencedBy: referencedByRes.rows.map((r) => ({
      referencingTable: r.referencing_table,
      referencingColumn: r.referencing_column,
      column: r.target_column,
    })),
    duplicateKeyCount,
    columns: columns.map((col) => {
      const fk = fkRes.rows.find((f) => f.source_column === col.column_name)
      return {
        name: col.column_name,
        dataType: col.data_type,
        nullable: col.is_nullable === 'YES',
        defaultValue: col.column_default,
        isPk: primaryKeys.includes(col.column_name),
        isFk: Boolean(fk),
        references: fk ? { table: fk.target_table, column: fk.target_column } : null,
        stats: columnStats[col.column_name] || {},
      }
    }),
    sampleRecords: {
      page: validPage,
      pageSize: validPageSize,
      totalPages: Math.ceil(totalRows / validPageSize) || 1,
      totalRows,
      records: sampleRes.rows,
    },
  }
}

/**
 * E. Systematic, comprehensive read-only data quality audit across the warehouse.
 */
export async function getWarehouseDataQuality() {
  const startTime = Date.now()
  const checks = []

  // Check 1: Duplicate PKs across tables
  for (const table of WAREHOUSE_TABLES) {
    const meta = TABLE_METADATA[table]
    if (meta && meta.primaryKey && meta.primaryKey.length > 0) {
      try {
        const pkCols = meta.primaryKey.map((k) => `"${k}"`).join(', ')
        const res = await queryDwh(`
          SELECT count(*)::int as dup_count FROM (
            SELECT ${pkCols}, count(*) 
            FROM dwh."${table}"
            GROUP BY ${pkCols}
            HAVING count(*) > 1
          ) sub;
        `)
        const dupCount = Number(res.rows[0]?.dup_count || 0)
        checks.push({
          category: 'Duplicate Primary Key Check',
          table,
          column: meta.primaryKey.join(', '),
          expected: '0 duplicates',
          actual: `${dupCount} duplicate keys`,
          status: dupCount === 0 ? 'PASSED' : 'FAILED',
          severity: 'CRITICAL',
        })
      } catch (err) {
        checks.push({
          category: 'Duplicate Primary Key Check',
          table,
          column: meta.primaryKey.join(', '),
          expected: '0 duplicates',
          actual: `Query error: ${err.message}`,
          status: 'UNAVAILABLE',
          severity: 'CRITICAL',
        })
      }
    }
  }

  // Check 2: Orphaned Foreign Keys (Referential Integrity)
  const foreignKeyChecks = [
    {
      table: 'fact_placement',
      fk: 'student_sk',
      parentTable: 'dim_student',
      pk: 'student_sk',
    },
    {
      table: 'fact_placement',
      fk: 'company_sk',
      parentTable: 'dim_company',
      pk: 'company_sk',
    },
    {
      table: 'fact_placement',
      fk: 'offer_date_sk',
      parentTable: 'dim_date',
      pk: 'date_sk',
    },
    {
      table: 'fact_job_application',
      fk: 'student_sk',
      parentTable: 'dim_student',
      pk: 'student_sk',
      allowNull: true,
    },
    {
      table: 'fact_job_application',
      fk: 'alumni_sk',
      parentTable: 'dim_alumni',
      pk: 'alumni_sk',
      allowNull: true,
    },
    {
      table: 'fact_job_application',
      fk: 'company_sk',
      parentTable: 'dim_company',
      pk: 'company_sk',
    },
    {
      table: 'fact_job_application',
      fk: 'job_sk',
      parentTable: 'dim_job',
      pk: 'job_sk',
      allowNull: true,
    },
    {
      table: 'fact_career_outcomes',
      fk: 'alumni_sk',
      parentTable: 'dim_alumni',
      pk: 'alumni_sk',
    },
    {
      table: 'bridge_alumni_skill',
      fk: 'alumni_sk',
      parentTable: 'dim_alumni',
      pk: 'alumni_sk',
    },
    {
      table: 'bridge_alumni_skill',
      fk: 'skill_sk',
      parentTable: 'dim_skill',
      pk: 'skill_sk',
    },
    {
      table: 'bridge_job_skill',
      fk: 'job_sk',
      parentTable: 'dim_job',
      pk: 'job_sk',
    },
    {
      table: 'bridge_job_skill',
      fk: 'skill_sk',
      parentTable: 'dim_skill',
      pk: 'skill_sk',
    },
    {
      table: 'bridge_student_skill',
      fk: 'student_sk',
      parentTable: 'dim_student',
      pk: 'student_sk',
    },
    {
      table: 'bridge_student_skill',
      fk: 'skill_sk',
      parentTable: 'dim_skill',
      pk: 'skill_sk',
    },
  ]

  for (const fk of foreignKeyChecks) {
    try {
      const nullCondition = fk.allowNull ? `WHERE c."${fk.fk}" IS NOT NULL` : ''
      const res = await queryDwh(`
        SELECT count(*)::int as orphans
        FROM dwh."${fk.table}" c
        LEFT JOIN dwh."${fk.parentTable}" p ON p."${fk.pk}" = c."${fk.fk}"
        ${nullCondition} ${nullCondition ? 'AND' : 'WHERE'} p."${fk.pk}" IS NULL;
      `)
      const orphans = Number(res.rows[0]?.orphans || 0)
      checks.push({
        category: 'Referential Integrity Check',
        table: fk.table,
        column: `${fk.fk} -> ${fk.parentTable}.${fk.pk}`,
        expected: '0 orphaned foreign keys',
        actual: `${orphans} orphans`,
        status: orphans === 0 ? 'PASSED' : 'FAILED',
        severity: 'HIGH',
      })
    } catch (err) {
      checks.push({
        category: 'Referential Integrity Check',
        table: fk.table,
        column: `${fk.fk} -> ${fk.parentTable}.${fk.pk}`,
        expected: '0 orphaned foreign keys',
        actual: `Query error: ${err.message}`,
        status: 'UNAVAILABLE',
        severity: 'HIGH',
      })
    }
  }

  // Check 3: Required Field & Null Integrity
  const requiredFieldChecks = [
    { table: 'dim_student', column: 'department', checkSql: 'department IS NULL OR TRIM(department) = \'\'' },
    { table: 'dim_student', column: 'cgpa', checkSql: 'cgpa IS NULL OR cgpa < 0 OR cgpa > 10' },
    { table: 'dim_alumni', column: 'graduation_year', checkSql: 'graduation_year IS NULL OR graduation_year < 1980' },
    { table: 'dim_company', column: 'company_name', checkSql: 'company_name IS NULL OR TRIM(company_name) = \'\'' },
    { table: 'dim_skill', column: 'skill_name', checkSql: 'skill_name IS NULL OR TRIM(skill_name) = \'\'' },
    { table: 'dim_job', column: 'job_title', checkSql: 'job_title IS NULL OR TRIM(job_title) = \'\'' },
    { table: 'fact_placement', column: 'annual_package_lpa', checkSql: 'annual_package_lpa IS NULL OR annual_package_lpa <= 0' },
    { table: 'fact_career_outcomes', column: 'employed_within_6_months', checkSql: 'employed_within_6_months NOT IN (0, 1)' },
  ]

  for (const req of requiredFieldChecks) {
    try {
      const res = await queryDwh(`
        SELECT count(*)::int as invalid_count
        FROM dwh."${req.table}"
        WHERE ${req.checkSql};
      `)
      const invalidCount = Number(res.rows[0]?.invalid_count || 0)
      checks.push({
        category: 'Domain & Range Validity Check',
        table: req.table,
        column: req.column,
        expected: '0 invalid or out-of-range values',
        actual: `${invalidCount} violations`,
        status: invalidCount === 0 ? 'PASSED' : 'FAILED',
        severity: 'MEDIUM',
      })
    } catch (err) {
      checks.push({
        category: 'Domain & Range Validity Check',
        table: req.table,
        column: req.column,
        expected: '0 invalid or out-of-range values',
        actual: `Query error: ${err.message}`,
        status: 'UNAVAILABLE',
        severity: 'MEDIUM',
      })
    }
  }

  // Check 4: Ingestion error log
  const errorRes = await queryDwh(`
    SELECT count(*)::int as err_count FROM dwh.etl_batch_errors;
  `).catch(() => ({ rows: [{ err_count: 0 }] }))
  const totalIngestionErrors = Number(errorRes.rows[0]?.err_count || 0)

  checks.push({
    category: 'Ingestion Error Log Check',
    table: 'etl_batch_errors',
    column: 'validation_error',
    expected: '0 unhandled batch rejections',
    actual: `${totalIngestionErrors} logged error rows in ledger`,
    status: totalIngestionErrors === 0 ? 'PASSED' : 'WARNING',
    severity: 'LOW',
  })

  const passedCount = checks.filter((c) => c.status === 'PASSED').length
  const failedCount = checks.filter((c) => c.status === 'FAILED').length
  const warningCount = checks.filter((c) => c.status === 'WARNING').length
  const unavailableCount = checks.filter((c) => c.status === 'UNAVAILABLE').length
  const totalExecuted = checks.filter((c) => c.status !== 'UNAVAILABLE').length
  const passRate = totalExecuted > 0 ? Number(((passedCount / totalExecuted) * 100).toFixed(1)) : 100

  return {
    summary: {
      totalChecks: checks.length,
      executedChecks: totalExecuted,
      passed: passedCount,
      failed: failedCount,
      warnings: warningCount,
      unavailable: unavailableCount,
      passRatePercent: passRate,
      healthStatus: failedCount === 0 ? 'HEALTHY' : 'DEGRADED',
    },
    checks,
    executionTimeMs: Date.now() - startTime,
  }
}

/**
 * F. Inspects the seven CSV datasets in datasets/ without modifying them.
 */
export async function getWarehouseDatasetsInventory() {
  const startTime = Date.now()
  const candidateDirs = [
    path.resolve(process.cwd(), 'datasets'),
    path.resolve(process.cwd(), '../datasets'),
    path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '../../../../datasets'),
    path.resolve(process.cwd(), '../dwm-synthetic-datasets'),
  ]
  const datasetsDir = candidateDirs.find((d) => fs.existsSync(d)) || candidateDirs[0]

  const expectedDatasets = [
    {
      fileName: 'skills.csv',
      targetTable: 'dim_skill',
      description: 'Standardized skill catalog taxonomy with 150 technical disciplines.',
      expectedRows: 150,
    },
    {
      fileName: 'alumni.csv',
      targetTable: 'dim_alumni',
      description: '2,000 alumni profiles with graduation years, departments, roles, and experience.',
      expectedRows: 2000,
    },
    {
      fileName: 'jobs.csv',
      targetTable: 'dim_job',
      description: '5,000 job postings with company mappings, employment types, and requirements.',
      expectedRows: 5000,
    },
    {
      fileName: 'alumni_skills.csv',
      targetTable: 'bridge_alumni_skill',
      description: '20,000 associative relationships linking alumni to acquired skill competencies.',
      expectedRows: 20000,
    },
    {
      fileName: 'job_skills.csv',
      targetTable: 'bridge_job_skill',
      description: '15,000 associative relationships linking job postings to required skill competencies.',
      expectedRows: 15000,
    },
    {
      fileName: 'applications.csv',
      targetTable: 'fact_job_application',
      description: '6,000 job applications submitted by alumni across posted job requisitions.',
      expectedRows: 6000,
    },
    {
      fileName: 'career_outcomes.csv',
      targetTable: 'fact_career_outcomes',
      description: '2,000 6-month career placement observation outcomes for supervised machine learning.',
      expectedRows: 2000,
    },
  ]

  const inventory = []

  for (const item of expectedDatasets) {
    const filePath = path.join(datasetsDir, item.fileName)
    let fileExists = false
    let fileSize = 0
    let actualRows = 0
    let columns = []

    try {
      if (fs.existsSync(filePath)) {
        fileExists = true
        const stat = fs.statSync(filePath)
        fileSize = stat.size

        // Read first chunk to extract headers safely
        const content = fs.readFileSync(filePath, 'utf8')
        const lines = content.trim().split('\n')
        actualRows = Math.max(0, lines.length - 1)

        if (lines.length > 0) {
          const headerLine = lines[0].trim()
          columns = headerLine.split(',').map((c) => c.trim().replace(/^"|"$/g, ''))
        }
      }
    } catch (err) {
      logger.warn(`Failed to inspect dataset file ${item.fileName}`, { error: err.message })
    }

    // Query current warehouse table row count for comparison
    let currentWarehouseRows = 0
    try {
      const res = await queryDwh(`SELECT count(*)::int as c FROM dwh."${item.targetTable}";`)
      currentWarehouseRows = Number(res.rows[0]?.c || 0)
    } catch {
      currentWarehouseRows = 0
    }

    inventory.push({
      fileName: item.fileName,
      filePath: `datasets/${item.fileName}`,
      targetTable: item.targetTable,
      description: item.description,
      sourceCategory: 'Academic Benchmark',
      exists: fileExists,
      fileSizeBytes: fileSize,
      fileSizeFormatted: `${(fileSize / 1024).toFixed(1)} KB`,
      sourceRecordCount: actualRows,
      expectedRows: item.expectedRows,
      columnCount: columns.length,
      columns,
      currentWarehouseRows,
      deltaRows: currentWarehouseRows - actualRows,
      validationStatus: fileExists && actualRows === item.expectedRows ? 'VERIFIED' : 'DESYNCHRONIZED',
    })
  }

  const totalSourceRecords = inventory.reduce((acc, i) => acc + i.sourceRecordCount, 0)

  return {
    datasets: inventory,
    totalDatasets: inventory.length,
    totalSourceRecords,
    provenance: 'indian_academic_benchmark',
    notice: 'CSV record counts reflect the physical CSV source files. Current warehouse table rows may include pre-existing operational dimensions and bridge junction mappings.',
    executionTimeMs: Date.now() - startTime,
  }
}

/**
 * G. Returns integrated ETL batch audit ledger records from dwh.etl_batches.
 */
export async function getWarehouseAuditLedger({ limit = 20, offset = 0 } = {}) {
  const startTime = Date.now()
  const validLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
  const validOffset = Math.max(0, parseInt(offset, 10) || 0)

  const [summaryRes, batchesRes] = await Promise.all([
    queryDwh(`
      SELECT 
        count(*)::int as total_batches,
        count(*) FILTER (WHERE status = 'completed')::int as completed_batches,
        count(*) FILTER (WHERE status = 'failed')::int as failed_batches,
        count(*) FILTER (WHERE status = 'processing')::int as processing_batches,
        COALESCE(SUM(rows_total), 0)::int as sum_rows_total,
        COALESCE(SUM(rows_inserted), 0)::int as sum_rows_inserted,
        COALESCE(SUM(rows_rejected), 0)::int as sum_rows_rejected
      FROM dwh.etl_batches;
    `),
    queryDwh(
      `
      SELECT 
        b.id,
        b.batch_type,
        b.file_name,
        b.status,
        b.rows_total,
        b.rows_inserted,
        b.rows_rejected,
        b.started_at,
        b.completed_at,
        b.error_summary,
        COUNT(e.id)::int as error_count
      FROM dwh.etl_batches b
      LEFT JOIN dwh.etl_batch_errors e ON e.batch_id = b.id
      GROUP BY b.id
      ORDER BY b.started_at DESC
      LIMIT $1 OFFSET $2;
    `,
      [validLimit, validOffset]
    ),
  ])

  const summary = summaryRes.rows[0] || {}

  const batches = batchesRes.rows.map((b) => {
    const started = b.started_at ? new Date(b.started_at).getTime() : null
    const completed = b.completed_at ? new Date(b.completed_at).getTime() : null
    const durationMs = started && completed ? completed - started : null

    return {
      id: b.id,
      batchType: b.batch_type,
      fileName: b.file_name,
      status: b.status,
      rowsTotal: Number(b.rows_total || 0),
      rowsInserted: Number(b.rows_inserted || 0),
      rowsRejected: Number(b.rows_rejected || 0),
      startedAt: b.started_at,
      completedAt: b.completed_at,
      durationMs,
      errorSummary: b.error_summary,
      errorCount: Number(b.error_count || 0),
    }
  })

  return {
    summary: {
      totalBatches: Number(summary.total_batches || 0),
      completedBatches: Number(summary.completed_batches || 0),
      failedBatches: Number(summary.failed_batches || 0),
      processingBatches: Number(summary.processing_batches || 0),
      totalRowsInserted: Number(summary.sum_rows_inserted || 0),
      totalRowsRejected: Number(summary.sum_rows_rejected || 0),
    },
    batches,
    pagination: {
      limit: validLimit,
      offset: validOffset,
      total: Number(summary.total_batches || 0),
    },
    executionTimeMs: Date.now() - startTime,
  }
}

export default {
  WAREHOUSE_TABLES,
  TABLE_METADATA,
  getWarehouseSummary,
  getWarehouseSchema,
  getWarehouseTableDetails,
  getWarehouseDataQuality,
  getWarehouseDatasetsInventory,
  getWarehouseAuditLedger,
}
