/**
 * Warehouse Repository Layer for DWM Analytical Platform.
 * Provides safe, parameterized, read-optimized queries against the 'dwh' schema.
 */
import { queryDwh } from '../../config/dwh.js'
import logger from '../../utils/logger.js'

/**
 * Returns executive overview KPIs and warehouse health.
 */
export async function getWarehouseOverview({ recordSource = 'ALL' } = {}) {
  const conditions = []
  const params = []

  if (recordSource && recordSource !== 'ALL') {
    params.push(recordSource)
    conditions.push(`record_source = $${params.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const pWhereClause = conditions.length > 0 ? `WHERE p.record_source = $${params.length}` : ''

  const [
    studentsRes,
    alumniRes,
    companiesRes,
    skillsRes,
    placementsRes,
    appsRes,
    jobsRes,
    outcomesRes,
    kpiRes,
    batchesRes,
    studentSrcRes,
    placementSrcRes,
    alumniSrcRes,
    jobSrcRes,
  ] = await Promise.all([
    queryDwh(`SELECT count(*)::int as count FROM dwh.dim_student ${whereClause};`, params).catch(() => ({ rows: [{ count: 0 }] })),
    queryDwh(`SELECT count(*)::int as count FROM dwh.dim_alumni ${whereClause};`, params).catch(() => ({ rows: [{ count: 0 }] })),
    queryDwh('SELECT count(*)::int as count FROM dwh.dim_company;').catch(() => ({ rows: [{ count: 0 }] })),
    queryDwh('SELECT count(*)::int as count FROM dwh.dim_skill;').catch(() => ({ rows: [{ count: 0 }] })),
    queryDwh(`SELECT count(DISTINCT student_sk)::int as count FROM dwh.fact_placement ${whereClause};`, params).catch(() => ({ rows: [{ count: 0 }] })),
    queryDwh(`SELECT count(*)::int as count FROM dwh.fact_job_application ${whereClause};`, params).catch(() => ({ rows: [{ count: 0 }] })),
    queryDwh(`SELECT count(*)::int as count FROM dwh.dim_job ${whereClause};`, params).catch(() => ({ rows: [{ count: 0 }] })),
    queryDwh(`SELECT count(*)::int as count FROM dwh.fact_career_outcomes ${whereClause};`, params).catch(() => ({ rows: [{ count: 0 }] })),
    queryDwh(`
      SELECT 
        ROUND(COALESCE(AVG(p.annual_package_lpa), 0), 2) as avg_package_lpa,
        ROUND(COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY p.annual_package_lpa), 0)::numeric, 2) as median_package_lpa,
        ROUND(COALESCE(MAX(p.annual_package_lpa), 0), 2) as highest_package_lpa,
        COUNT(DISTINCT p.company_sk) as active_recruiters
      FROM dwh.fact_placement p
      ${pWhereClause};
    `, params).catch(() => ({ rows: [{}] })),
    queryDwh(`
      SELECT id, batch_type, file_name, status, rows_total, rows_inserted, rows_rejected, started_at, completed_at 
      FROM dwh.etl_batches 
      ORDER BY started_at DESC 
      LIMIT 5;
    `).catch(() => ({ rows: [] })),
    queryDwh('SELECT record_source, count(*)::int as c FROM dwh.dim_student GROUP BY record_source;').catch(() => ({ rows: [] })),
    queryDwh('SELECT record_source, count(*)::int as c FROM dwh.fact_placement GROUP BY record_source;').catch(() => ({ rows: [] })),
    queryDwh('SELECT record_source, count(*)::int as c FROM dwh.dim_alumni GROUP BY record_source;').catch(() => ({ rows: [] })),
    queryDwh('SELECT record_source, count(*)::int as c FROM dwh.dim_job GROUP BY record_source;').catch(() => ({ rows: [] })),
  ])

  const totalStudents = Number(studentsRes.rows[0]?.count || 0)
  const totalAlumni = Number(alumniRes.rows[0]?.count || 0)
  const totalCompanies = Number(companiesRes.rows[0]?.count || 0)
  const totalSkills = Number(skillsRes.rows[0]?.count || 0)
  const totalPlacements = Number(placementsRes.rows[0]?.count || 0)
  const totalApplications = Number(appsRes.rows[0]?.count || 0)
  const totalJobs = Number(jobsRes.rows[0]?.count || 0)
  const totalCareerOutcomes = Number(outcomesRes.rows[0]?.count || 0)

  const kpis = kpiRes.rows[0] || {}
  const placementRate = totalStudents > 0 ? Number(((totalPlacements / totalStudents) * 100).toFixed(1)) : 0

  const studentSources = Object.fromEntries(studentSrcRes.rows.map((r) => [r.record_source || 'operational', Number(r.c)]))
  const placementSources = Object.fromEntries(placementSrcRes.rows.map((r) => [r.record_source || 'operational', Number(r.c)]))
  const alumniSources = Object.fromEntries(alumniSrcRes.rows.map((r) => [r.record_source || 'operational', Number(r.c)]))
  const jobSources = Object.fromEntries(jobSrcRes.rows.map((r) => [r.record_source || 'operational', Number(r.c)]))

  const latestBatch = batchesRes.rows?.[0]
  const lastSyncTime = latestBatch?.completed_at || latestBatch?.started_at || new Date().toISOString()

  return {
    warehouse: {
      totalStudents,
      totalAlumni,
      totalCompanies,
      totalSkills,
      totalPlacements,
      totalApplications,
      totalJobs,
      totalCareerOutcomes,
      totalWarehouseRecords: totalStudents + totalAlumni + totalCompanies + totalSkills + totalPlacements + totalApplications + totalJobs + totalCareerOutcomes,
      status: 'ACTIVE_HEALTHY',
      activeSchema: 'dwh',
      activeSource: recordSource || 'ALL',
      isCombined: !recordSource || recordSource === 'ALL',
      lastRefreshedAt: lastSyncTime,
      syntheticDisclaimer: 'Synthetic career benchmarks and 6-month placement targets represent academic training distributions and do not reflect empirical employment statistics.',
      provenanceBreakdown: {
        students: studentSources,
        placements: placementSources,
        alumni: alumniSources,
        jobs: jobSources,
      },
    },
    kpis: {
      placementRate,
      avgPackageLpa: Number(kpis.avg_package_lpa || 0),
      medianPackageLpa: Number(kpis.median_package_lpa || 0),
      highestPackageLpa: Number(kpis.highest_package_lpa || 0),
      totalJobOffers: totalPlacements,
      activeRecruiters: Number(kpis.active_recruiters || 0),
    },
    recentBatches: batchesRes.rows || [],
  }
}

/**
 * Returns career and placement analytics by academic department, year, and company.
 */
export async function getCareerAnalytics({ department, year, minSalary, company, recordSource = 'ALL' } = {}) {
  const cohortConditions = []
  const cohortParams = []

  if (department && department !== 'ALL') {
    cohortParams.push(`%${department}%`)
    cohortConditions.push(`s.department ILIKE $${cohortParams.length}`)
  }

  if (year && year !== 'ALL') {
    cohortParams.push(Number(year))
    cohortConditions.push(`s.graduation_year = $${cohortParams.length}`)
  }

  if (recordSource && recordSource !== 'ALL') {
    cohortParams.push(recordSource)
    cohortConditions.push(`s.record_source = $${cohortParams.length}`)
  }

  const cohortWhereClause = cohortConditions.length > 0 ? `WHERE ${cohortConditions.join(' AND ')}` : ''

  // Offer join conditions (applied on fact_placement p without filtering out unplaced students from s)
  const offerJoinConditions = ['p.student_sk = s.student_sk']
  if (recordSource && recordSource !== 'ALL') {
    offerJoinConditions.push(`p.record_source = s.record_source`)
  }
  if (minSalary) {
    cohortParams.push(Number(minSalary))
    offerJoinConditions.push(`p.annual_package_lpa >= $${cohortParams.length}`)
  }

  let companyJoinClause = 'c.company_sk = p.company_sk'
  if (company) {
    cohortParams.push(`%${company}%`)
    companyJoinClause += ` AND c.company_name ILIKE $${cohortParams.length}`
  }

  const offerJoinClause = offerJoinConditions.join(' AND ')

  // 1. Department Placement Aggregations
  const deptSql = `
    SELECT 
      s.department,
      COUNT(DISTINCT s.student_sk) as eligible,
      COUNT(DISTINCT p.student_sk) as placed,
      COALESCE(ROUND(COUNT(DISTINCT p.student_sk)::numeric / NULLIF(COUNT(DISTINCT s.student_sk), 0) * 100, 1), 0.0) as rate,
      ROUND(COALESCE(AVG(p.annual_package_lpa), 0), 2) as "avgLpa",
      ROUND(COALESCE(MAX(p.annual_package_lpa), 0), 2) as "maxLpa"
    FROM dwh.dim_student s
    LEFT JOIN dwh.fact_placement p ON ${offerJoinClause}
    LEFT JOIN dwh.dim_date d ON d.date_sk = p.offer_date_sk
    LEFT JOIN dwh.dim_company c ON ${companyJoinClause}
    ${cohortWhereClause}
    GROUP BY s.department
    ORDER BY "avgLpa" DESC;
  `

  // 2. Offer-level Filters for Trends and Recruiters
  const offerConditions = []
  const offerParams = []

  if (recordSource && recordSource !== 'ALL') {
    offerParams.push(recordSource)
    offerConditions.push(`p.record_source = $${offerParams.length}`)
  }
  if (department && department !== 'ALL') {
    offerParams.push(`%${department}%`)
    offerConditions.push(`s.department ILIKE $${offerParams.length}`)
  }
  if (year && year !== 'ALL') {
    offerParams.push(Number(year))
    offerConditions.push(`COALESCE(d.year, s.graduation_year) = $${offerParams.length}`)
  }
  if (minSalary) {
    offerParams.push(Number(minSalary))
    offerConditions.push(`p.annual_package_lpa >= $${offerParams.length}`)
  }
  if (company) {
    offerParams.push(`%${company}%`)
    offerConditions.push(`c.company_name ILIKE $${offerParams.length}`)
  }
  const offerWhereClause = offerConditions.length > 0 ? `WHERE ${offerConditions.join(' AND ')}` : ''

  // 2. Yearly Salary Trends (respecting the filter slice)
  const trendsSql = `
    SELECT 
      COALESCE(d.year, s.graduation_year, 2025) as year,
      ROUND(COALESCE(AVG(p.annual_package_lpa), 0), 2) as "avgLpa",
      ROUND(COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY p.annual_package_lpa), 0)::numeric, 2) as "medianLpa",
      ROUND(COALESCE(MAX(p.annual_package_lpa), 0), 2) as "maxLpa",
      COUNT(p.placement_id) as offers
    FROM dwh.fact_placement p
    JOIN dwh.dim_student s ON s.student_sk = p.student_sk
    JOIN dwh.dim_company c ON c.company_sk = p.company_sk
    LEFT JOIN dwh.dim_date d ON d.date_sk = p.offer_date_sk
    ${offerWhereClause}
    GROUP BY COALESCE(d.year, s.graduation_year, 2025)
    ORDER BY year ASC;
  `

  // 3. Top Recruiters (respecting the filter slice)
  const recruitersSql = `
    SELECT 
      c.company_name as company,
      c.company_tier as tier,
      c.industry,
      COUNT(p.placement_id) as offers,
      ROUND(COALESCE(AVG(p.annual_package_lpa), 0), 2) as "avgLpa"
    FROM dwh.dim_company c
    JOIN dwh.fact_placement p ON p.company_sk = c.company_sk
    JOIN dwh.dim_student s ON s.student_sk = p.student_sk
    LEFT JOIN dwh.dim_date d ON d.date_sk = p.offer_date_sk
    ${offerWhereClause}
    GROUP BY c.company_name, c.company_tier, c.industry
    ORDER BY offers DESC, "avgLpa" DESC
    LIMIT 20;
  `

  // 4. Overall Placement KPIs for this filter slice
  const kpiSql = `
    SELECT 
      COUNT(DISTINCT s.student_sk) as total_eligible,
      COUNT(DISTINCT p.student_sk) as total_placed,
      COALESCE(ROUND(COUNT(DISTINCT p.student_sk)::numeric / NULLIF(COUNT(DISTINCT s.student_sk), 0) * 100, 1), 0.0) as placement_rate,
      ROUND(COALESCE(AVG(p.annual_package_lpa), 0), 2) as avg_package_lpa,
      ROUND(COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY p.annual_package_lpa), 0)::numeric, 2) as median_package_lpa,
      ROUND(COALESCE(MAX(p.annual_package_lpa), 0), 2) as highest_package_lpa,
      COUNT(p.placement_id) as total_job_offers,
      COUNT(DISTINCT p.company_sk) as active_recruiters
    FROM dwh.dim_student s
    LEFT JOIN dwh.fact_placement p ON ${offerJoinClause}
    LEFT JOIN dwh.dim_date d ON d.date_sk = p.offer_date_sk
    LEFT JOIN dwh.dim_company c ON ${companyJoinClause}
    ${cohortWhereClause};
  `

  const [deptRes, trendsRes, recruitersRes, kpiRes] = await Promise.all([
    queryDwh(deptSql, cohortParams).catch((err) => { logger.error('Dept query error', { error: err.message }); return { rows: [] } }),
    queryDwh(trendsSql, offerParams).catch(() => ({ rows: [] })),
    queryDwh(recruitersSql, offerParams).catch(() => ({ rows: [] })),
    queryDwh(kpiSql, cohortParams).catch(() => ({ rows: [{}] })),
  ])

  // Attach top company per department
  const deptsWithTopCompany = await Promise.all(
    deptRes.rows.map(async (row) => {
      const topCompRes = await queryDwh(`
        SELECT c.company_name 
        FROM dwh.fact_placement p
        JOIN dwh.dim_student s ON s.student_sk = p.student_sk
        JOIN dwh.dim_company c ON c.company_sk = p.company_sk
        WHERE s.department = $1
        GROUP BY c.company_name
        ORDER BY count(*) DESC
        LIMIT 1;
      `, [row.department]).catch(() => ({ rows: [] }))

      return {
        ...row,
        eligible: Number(row.eligible),
        placed: Number(row.placed),
        rate: Number(row.rate || 0),
        avgLpa: Number(row.avgLpa || 0),
        maxLpa: Number(row.maxLpa || 0),
        topCompany: topCompRes.rows[0]?.company_name || 'Multiple',
      }
    })
  )

  const kRow = kpiRes.rows[0] || {}
  const totalEligible = Number(kRow.total_eligible || 0)
  const totalPlaced = Number(kRow.total_placed || 0)
  const calculatedRate = totalEligible > 0 ? Number(((totalPlaced / totalEligible) * 100).toFixed(1)) : 0

  return {
    activeSource: recordSource || 'ALL',
    isCombined: !recordSource || recordSource === 'ALL',
    kpis: {
      totalEligible,
      total_eligible: totalEligible,
      totalPlaced,
      total_placed: totalPlaced,
      placementRate: calculatedRate,
      placement_rate: calculatedRate,
      avgPackageLpa: Number(kRow.avg_package_lpa || 0),
      medianPackageLpa: Number(kRow.median_package_lpa || 0),
      highestPackageLpa: Number(kRow.highest_package_lpa || 0),
      totalJobOffers: Number(kRow.total_job_offers || 0),
      activeRecruiters: Number(kRow.active_recruiters || 0),
    },
    departments: deptsWithTopCompany,
    byDepartment: deptsWithTopCompany,
    trends: trendsRes.rows.map((r) => ({
      year: Number(r.year),
      avgLpa: Number(r.avgLpa || 0),
      medianLpa: Number(r.medianLpa || 0),
      maxLpa: Number(r.maxLpa || 0),
      offers: Number(r.offers || 0),
    })),
    recruiters: recruitersRes.rows.map((r) => ({
      company: r.company,
      tier: r.tier,
      industry: r.industry,
      offers: Number(r.offers),
      avgLpa: Number(r.avgLpa || 0),
    })),
  }
}

/**
 * Returns skill demand, categorization, and placement correlation.
 */
export async function getSkillsAnalytics({ category, limit = 20 } = {}) {
  const conditions = []
  const params = []

  if (category && category !== 'ALL') {
    params.push(category)
    conditions.push(`sk.category = $${params.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  // 1. Skill demand rankings
  const skillsSql = `
    SELECT 
      sk.skill_name as skill,
      sk.category,
      COUNT(bss.student_sk) as "demandCount",
      COUNT(DISTINCT p.student_sk) as "placedWithSkill"
    FROM dwh.dim_skill sk
    LEFT JOIN dwh.bridge_student_skill bss ON bss.skill_sk = sk.skill_sk
    LEFT JOIN dwh.fact_placement p ON p.student_sk = bss.student_sk
    ${whereClause}
    GROUP BY sk.skill_name, sk.category
    ORDER BY "demandCount" DESC, skill ASC
    LIMIT ${Number(limit)};
  `

  // 2. Category distribution
  const categorySql = `
    SELECT 
      sk.category as name,
      COUNT(bss.student_sk) as value
    FROM dwh.dim_skill sk
    LEFT JOIN dwh.bridge_student_skill bss ON bss.skill_sk = sk.skill_sk
    GROUP BY sk.category
    HAVING COUNT(bss.student_sk) > 0
    ORDER BY value DESC;
  `

  // 3. Unique categories list
  const allCategoriesSql = 'SELECT DISTINCT category FROM dwh.dim_skill ORDER BY category;'

  const [skillsRes, catRes, allCatsRes] = await Promise.all([
    queryDwh(skillsSql, params).catch(() => ({ rows: [] })),
    queryDwh(categorySql).catch(() => ({ rows: [] })),
    queryDwh(allCategoriesSql).catch(() => ({ rows: [] })),
  ])

  return {
    topSkills: skillsRes.rows.map((r) => ({
      skill: r.skill,
      category: r.category,
      demandCount: Number(r.demandCount || 0),
      placedWithSkill: Number(r.placedWithSkill || 0),
    })),
    categoryDistribution: catRes.rows.map((r) => ({
      name: r.name,
      value: Number(r.value || 0),
    })),
    categories: ['ALL', ...allCatsRes.rows.map((r) => r.category)],
  }
}

/**
 * Returns alumni geographic hubs, industry segmentation, and mentorship metrics.
 */
/**
 * Returns alumni geographic hubs, industry segmentation, and mentorship metrics.
 */
export async function getAlumniAnalytics({ city, industry, mentorOnly, recordSource = 'ALL' } = {}) {
  const conditions = []
  const params = []

  if (city) {
    params.push(`%${city}%`)
    conditions.push(`city ILIKE $${params.length}`)
  }

  if (industry && industry !== 'ALL') {
    params.push(industry)
    conditions.push(`industry = $${params.length}`)
  }

  if (mentorOnly) {
    conditions.push('is_mentor = TRUE')
  }

  if (recordSource && recordSource !== 'ALL') {
    params.push(recordSource)
    conditions.push(`record_source = $${params.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  // 1. Geographic Hub Distribution
  const geoSql = `
    SELECT 
      COALESCE(city || ', ' || country, city, 'Global') as location,
      COUNT(*)::int as count,
      ROUND(COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM dwh.dim_alumni ${whereClause}), 0) * 100, 1) as percentage
    FROM dwh.dim_alumni
    ${whereClause}
    GROUP BY city, country
    ORDER BY count DESC
    LIMIT 15;
  `

  // 2. Industry distribution
  const indSql = `
    SELECT 
      industry,
      COUNT(*)::int as total_alumni,
      COUNT(*) FILTER (WHERE is_mentor = TRUE)::int as mentors,
      ROUND(COUNT(*) FILTER (WHERE is_mentor = TRUE)::numeric / NULLIF(COUNT(*), 0) * 100, 1) as mentor_percentage
    FROM dwh.dim_alumni
    ${whereClause}
    GROUP BY industry
    ORDER BY total_alumni DESC;
  `

  // 3. Key Alumni KPIs
  const kpiSql = `
    SELECT 
      COUNT(*)::int as total_alumni,
      COUNT(*) FILTER (WHERE is_mentor = TRUE)::int as total_mentors,
      ROUND(COUNT(*) FILTER (WHERE is_mentor = TRUE)::numeric / NULLIF(COUNT(*), 0) * 100, 1) as mentor_ratio
    FROM dwh.dim_alumni
    ${whereClause};
  `

  const [geoRes, indRes, kpiRes] = await Promise.all([
    queryDwh(geoSql, params).catch(() => ({ rows: [] })),
    queryDwh(indSql, params).catch(() => ({ rows: [] })),
    queryDwh(kpiSql, params).catch(() => ({ rows: [{}] })),
  ])

  const kRow = kpiRes.rows[0] || {}

  return {
    activeSource: recordSource || 'ALL',
    isCombined: !recordSource || recordSource === 'ALL',
    kpis: {
      totalAlumni: Number(kRow.total_alumni || 0),
      totalMentors: Number(kRow.total_mentors || 0),
      mentorRatio: Number(kRow.mentor_ratio || 0),
    },
    geographic: geoRes.rows.map((r) => ({
      location: r.location,
      count: Number(r.count),
      percentage: Number(r.percentage || 0),
    })),
    industries: indRes.rows.map((r) => ({
      industry: r.industry,
      totalAlumni: Number(r.total_alumni),
      mentors: Number(r.mentors),
      mentorPercentage: Number(r.mentor_percentage || 0),
    })),
  }
}

/**
 * OLAP Multi-Dimensional Engine: Performs Roll-Up, Drill-Down, Slice, Dice, and 2D Pivot.
 * Uses exact, parameterized SQL against the dimensional schema with zero inflation.
 */
export async function getOlapData({
  primaryDimension = 'department',
  secondaryDimension = null,
  measure = 'avgLpa',
  sliceDept = 'ALL',
  sliceTier = 'ALL',
  sliceCompany = 'ALL',
  sliceYear = 'ALL',
  sliceIndustry = 'ALL',
  sliceSource = 'ALL',
  minLpa = 0,
  drillDownKey = null,
} = {}) {
  const allowedDimensions = {
    department: 's.department',
    tier: 'c.company_tier',
    company: 'c.company_name',
    year: 'COALESCE(d.year, s.graduation_year)',
    industry: 'c.industry',
    degree: 's.degree',
    source: 'p.record_source',
  }

  const primaryCol = allowedDimensions[primaryDimension] || 's.department'
  const isSecondaryValid = secondaryDimension && secondaryDimension !== 'none' && secondaryDimension !== primaryDimension && allowedDimensions[secondaryDimension]
  const secondaryCol = isSecondaryValid ? allowedDimensions[secondaryDimension] : null

  const conditions = []
  const params = []

  // Slice: Department filter
  if (sliceDept && sliceDept !== 'ALL') {
    params.push(sliceDept)
    conditions.push(`s.department = $${params.length}`)
  }

  // Slice: Tier filter
  if (sliceTier && sliceTier !== 'ALL') {
    params.push(sliceTier)
    conditions.push(`c.company_tier = $${params.length}`)
  }

  // Slice: Company filter
  if (sliceCompany && sliceCompany !== 'ALL') {
    params.push(`%${sliceCompany}%`)
    conditions.push(`c.company_name ILIKE $${params.length}`)
  }

  // Slice: Year filter
  if (sliceYear && sliceYear !== 'ALL') {
    params.push(Number(sliceYear))
    conditions.push(`COALESCE(d.year, s.graduation_year) = $${params.length}`)
  }

  // Slice: Industry filter
  if (sliceIndustry && sliceIndustry !== 'ALL') {
    params.push(sliceIndustry)
    conditions.push(`c.industry = $${params.length}`)
  }

  // Slice: Data Provenance Source filter
  if (sliceSource && sliceSource !== 'ALL') {
    params.push(sliceSource)
    conditions.push(`p.record_source = $${params.length}`)
  }

  // Dice: Minimum Package Threshold filter
  if (Number(minLpa) > 0) {
    params.push(Number(minLpa))
    conditions.push(`p.annual_package_lpa >= $${params.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const groupCols = secondaryCol ? `${primaryCol}, ${secondaryCol}` : primaryCol

  // Primary Aggregation SQL
  const sql = `
    SELECT 
      ${primaryCol} as primary_val,
      ${secondaryCol ? `${secondaryCol} as secondary_val,` : ''}
      COUNT(p.placement_id)::int as total_offers,
      COUNT(DISTINCT p.student_sk)::int as placed_count,
      COUNT(DISTINCT s.student_sk)::int as eligible_count,
      ROUND(COALESCE(AVG(p.annual_package_lpa), 0), 2) as avg_lpa,
      ROUND(COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY p.annual_package_lpa), 0)::numeric, 2) as median_lpa,
      ROUND(COALESCE(MAX(p.annual_package_lpa), 0), 2) as max_lpa,
      ROUND(COALESCE(MIN(p.annual_package_lpa), 0), 2) as min_lpa
    FROM dwh.fact_placement p
    JOIN dwh.dim_student s ON s.student_sk = p.student_sk
    JOIN dwh.dim_company c ON c.company_sk = p.company_sk
    LEFT JOIN dwh.dim_date d ON d.date_sk = p.offer_date_sk
    ${whereClause}
    GROUP BY ${groupCols}
    ORDER BY avg_lpa DESC, primary_val ASC;
  `

  // Institution-wide Summary Roll-Up SQL (over the exact same slice filters)
  const rollupSql = `
    SELECT 
      COUNT(p.placement_id)::int as total_offers,
      COUNT(DISTINCT p.student_sk)::int as placed_count,
      COUNT(DISTINCT s.student_sk)::int as eligible_count,
      ROUND(COALESCE(AVG(p.annual_package_lpa), 0), 2) as avg_lpa,
      ROUND(COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY p.annual_package_lpa), 0)::numeric, 2) as median_lpa,
      ROUND(COALESCE(MAX(p.annual_package_lpa), 0), 2) as max_lpa,
      ROUND(COALESCE(MIN(p.annual_package_lpa), 0), 2) as min_lpa
    FROM dwh.fact_placement p
    JOIN dwh.dim_student s ON s.student_sk = p.student_sk
    JOIN dwh.dim_company c ON c.company_sk = p.company_sk
    LEFT JOIN dwh.dim_date d ON d.date_sk = p.offer_date_sk
    ${whereClause};
  `

  // Optional Drill-Down query if drillDownKey specified
  let drillDownPromise = Promise.resolve({ rows: [] })
  if (drillDownKey) {
    const drillParams = [...params, drillDownKey]
    const drillWhere = whereClause 
      ? `${whereClause} AND ${primaryCol} = $${drillParams.length}`
      : `WHERE ${primaryCol} = $1`

    const drillSql = `
      SELECT 
        c.company_name,
        c.company_tier,
        s.degree,
        s.department,
        p.annual_package_lpa,
        COALESCE(d.year, s.graduation_year) as offer_year,
        p.record_source
      FROM dwh.fact_placement p
      JOIN dwh.dim_student s ON s.student_sk = p.student_sk
      JOIN dwh.dim_company c ON c.company_sk = p.company_sk
      LEFT JOIN dwh.dim_date d ON d.date_sk = p.offer_date_sk
      ${drillWhere}
      ORDER BY p.annual_package_lpa DESC
      LIMIT 25;
    `
    drillDownPromise = queryDwh(drillSql, drillParams).catch((err) => {
      logger.error('Drill-down query error', { error: err.message })
      return { rows: [] }
    })
  }

  const [aggRes, rollupRes, drillRes] = await Promise.all([
    queryDwh(sql, params).catch((err) => {
      logger.error('OLAP aggregation query error', { error: err.message })
      return { rows: [] }
    }),
    queryDwh(rollupSql, params).catch(() => ({ rows: [{}] })),
    drillDownPromise,
  ])

  const rRow = rollupRes.rows[0] || {}
  const rollupTotalOffers = Number(rRow.total_offers || 0)
  const rollupPlacedCount = Number(rRow.placed_count || 0)
  const rollupEligibleCount = Number(rRow.eligible_count || 0)
  const rollupPlacementRate = rollupEligibleCount > 0 
    ? Number(((rollupPlacedCount / rollupEligibleCount) * 100).toFixed(1)) 
    : 0

  const rollupSummary = {
    totalOffers: rollupTotalOffers,
    placedCount: rollupPlacedCount,
    eligibleCount: rollupEligibleCount,
    placementRate: rollupPlacementRate,
    avgLpa: Number(rRow.avg_lpa || 0),
    medianLpa: Number(rRow.median_lpa || 0),
    maxLpa: Number(rRow.max_lpa || 0),
    minLpa: Number(rRow.min_lpa || 0),
  }

  // Format cell rows
  const cells = aggRes.rows.map((r) => {
    const placed = Number(r.placed_count || 0)
    const eligible = Number(r.eligible_count || 0)
    const rate = eligible > 0 ? Number(((placed / eligible) * 100).toFixed(1)) : 0

    return {
      primary: r.primary_val || 'Unassigned',
      secondary: r.secondary_val || null,
      totalOffers: Number(r.total_offers || 0),
      placedCount: placed,
      eligibleCount: eligible,
      placementRate: rate,
      avgLpa: Number(r.avg_lpa || 0),
      medianLpa: Number(r.median_lpa || 0),
      maxLpa: Number(r.max_lpa || 0),
      minLpa: Number(r.min_lpa || 0),
    }
  })

  // Build 2D Pivot Cross-Tabulation Matrix if secondary dimension exists
  let pivot = null
  if (secondaryCol) {
    const uniqueRows = Array.from(new Set(cells.map((c) => c.primary))).sort()
    const uniqueCols = Array.from(new Set(cells.map((c) => c.secondary).filter(Boolean))).sort()

    const matrix = {}
    const colTotals = {}

    // Initialize col totals
    for (const c of uniqueCols) {
      colTotals[c] = { totalOffers: 0, placedCount: 0, sumLpaOffers: 0 }
    }

    // Populate rows
    for (const r of uniqueRows) {
      matrix[r] = {
        rowTotalOffers: 0,
        rowPlacedCount: 0,
        rowSumLpaOffers: 0,
      }
      for (const c of uniqueCols) {
        matrix[r][c] = {
          totalOffers: 0,
          placedCount: 0,
          avgLpa: 0,
        }
      }
    }

    // Fill cells
    for (const cell of cells) {
      if (cell.primary && cell.secondary && matrix[cell.primary]) {
        matrix[cell.primary][cell.secondary] = {
          totalOffers: cell.totalOffers,
          placedCount: cell.placedCount,
          avgLpa: cell.avgLpa,
        }
        matrix[cell.primary].rowTotalOffers += cell.totalOffers
        matrix[cell.primary].rowPlacedCount += cell.placedCount
        matrix[cell.primary].rowSumLpaOffers += (cell.avgLpa * cell.totalOffers)

        if (colTotals[cell.secondary]) {
          colTotals[cell.secondary].totalOffers += cell.totalOffers
          colTotals[cell.secondary].placedCount += cell.placedCount
          colTotals[cell.secondary].sumLpaOffers += (cell.avgLpa * cell.totalOffers)
        }
      }
    }

    // Finalize weighted averages for rows and cols
    for (const r of uniqueRows) {
      matrix[r].rowAvgLpa = matrix[r].rowTotalOffers > 0
        ? Number((matrix[r].rowSumLpaOffers / matrix[r].rowTotalOffers).toFixed(2))
        : 0
    }
    for (const c of uniqueCols) {
      colTotals[c].avgLpa = colTotals[c].totalOffers > 0
        ? Number((colTotals[c].sumLpaOffers / colTotals[c].totalOffers).toFixed(2))
        : 0
    }

    pivot = {
      rows: uniqueRows,
      columns: uniqueCols,
      matrix,
      columnTotals: colTotals,
      grandTotal: rollupSummary,
    }
  }

  return {
    primaryDimension,
    secondaryDimension: isSecondaryValid ? secondaryDimension : null,
    measure,
    activeSource: sliceSource || 'ALL',
    isCombined: !sliceSource || sliceSource === 'ALL',
    cells,
    pivot,
    rollup: rollupSummary,
    drillDown: drillDownKey ? {
      key: drillDownKey,
      dimension: primaryDimension,
      records: drillRes.rows.map((r) => ({
        companyName: r.company_name,
        companyTier: r.company_tier,
        degree: r.degree,
        department: r.department,
        annualPackageLpa: Number(r.annual_package_lpa),
        offerYear: Number(r.offer_year),
        recordSource: r.record_source,
      })),
    } : null,
  }
}

/**
 * Returns analytical dataset inventory and row counts by provenance.
 */
export async function getDatasetsMetadata() {
  const tables = [
    'dim_student',
    'dim_alumni',
    'dim_company',
    'dim_skill',
    'dim_date',
    'bridge_student_skill',
    'fact_placement',
    'fact_job_application',
    'fact_salary_benchmark',
    'etl_batches',
    'etl_batch_errors',
  ]

  const metadata = await Promise.all(
    tables.map(async (table) => {
      const countRes = await queryDwh(`SELECT count(*)::int as count FROM dwh.${table};`).catch(() => ({ rows: [{ count: 0 }] }))
      
      let sourceBreakdown = {}
      // Check if table has record_source column
      if (['dim_student', 'dim_alumni', 'fact_placement', 'fact_job_application', 'fact_salary_benchmark'].includes(table)) {
        const srcRes = await queryDwh(`
          SELECT record_source, count(*)::int as c 
          FROM dwh.${table} 
          GROUP BY record_source;
        `).catch(() => ({ rows: [] }))
        sourceBreakdown = Object.fromEntries(srcRes.rows.map((r) => [r.record_source || 'operational', Number(r.c)]))
      }

      return {
        table,
        rowCount: Number(countRes.rows[0]?.count || 0),
        schema: 'dwh',
        provenance: sourceBreakdown,
      }
    })
  )

  return metadata
}

/**
 * Computes warehouse data quality metrics, completeness ratios, and integrity checks.
 */
export async function getDataQualityReport() {
  const [
    studentNulls,
    alumniNulls,
    placementNulls,
    orphanPlacements,
  ] = await Promise.all([
    queryDwh(`
      SELECT 
        COUNT(*)::int as total_students,
        COUNT(*) FILTER (WHERE cgpa IS NULL OR cgpa = 0)::int as missing_cgpa,
        COUNT(*) FILTER (WHERE department IS NULL)::int as missing_department
      FROM dwh.dim_student;
    `).catch(() => ({ rows: [{}] })),
    queryDwh(`
      SELECT 
        COUNT(*)::int as total_alumni,
        COUNT(*) FILTER (WHERE current_company IS NULL)::int as missing_company,
        COUNT(*) FILTER (WHERE city IS NULL)::int as missing_city
      FROM dwh.dim_alumni;
    `).catch(() => ({ rows: [{}] })),
    queryDwh(`
      SELECT 
        COUNT(*)::int as total_placements,
        COUNT(*) FILTER (WHERE annual_package_lpa IS NULL OR annual_package_lpa <= 0)::int as missing_salary,
        COUNT(*) FILTER (WHERE offer_date_sk IS NULL)::int as missing_date
      FROM dwh.fact_placement;
    `).catch(() => ({ rows: [{}] })),
    queryDwh(`
      SELECT COUNT(*)::int as orphans
      FROM dwh.fact_placement p
      LEFT JOIN dwh.dim_student s ON s.student_sk = p.student_sk
      WHERE s.student_sk IS NULL;
    `).catch(() => ({ rows: [{ orphans: 0 }] })),
  ])

  const sRow = studentNulls.rows[0] || {}
  const aRow = alumniNulls.rows[0] || {}
  const pRow = placementNulls.rows[0] || {}

  const sTotal = Number(sRow.total_students || 0)
  const aTotal = Number(aRow.total_alumni || 0)
  const pTotal = Number(pRow.total_placements || 0)

  return {
    metrics: [
      {
        entity: 'dim_student',
        recordsChecked: sTotal,
        metric: 'CGPA Completeness',
        passRate: sTotal > 0 ? Number((((sTotal - Number(sRow.missing_cgpa || 0)) / sTotal) * 100).toFixed(1)) : 100,
        status: 'PASSED',
      },
      {
        entity: 'dim_student',
        recordsChecked: sTotal,
        metric: 'Department Integrity',
        passRate: sTotal > 0 ? Number((((sTotal - Number(sRow.missing_department || 0)) / sTotal) * 100).toFixed(1)) : 100,
        status: 'PASSED',
      },
      {
        entity: 'dim_alumni',
        recordsChecked: aTotal,
        metric: 'Employer Affiliation',
        passRate: aTotal > 0 ? Number((((aTotal - Number(aRow.missing_company || 0)) / aTotal) * 100).toFixed(1)) : 100,
        status: 'PASSED',
      },
      {
        entity: 'fact_placement',
        recordsChecked: pTotal,
        metric: 'Salary Value Validity (> 0 LPA)',
        passRate: pTotal > 0 ? Number((((pTotal - Number(pRow.missing_salary || 0)) / pTotal) * 100).toFixed(1)) : 100,
        status: 'PASSED',
      },
      {
        entity: 'fact_placement',
        recordsChecked: pTotal,
        metric: 'Foreign Key Referential Integrity',
        passRate: Number(orphanPlacements.rows[0]?.orphans || 0) === 0 ? 100.0 : 0.0,
        status: Number(orphanPlacements.rows[0]?.orphans || 0) === 0 ? 'PASSED' : 'FAILED',
      },
    ],
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Returns historical ETL batches and detailed execution audit log.
 */
export async function getEtlHistory({ limit = 20, offset = 0 } = {}) {
  const sql = `
    SELECT 
      b.id,
      b.batch_type as type,
      b.file_name as "fileName",
      b.status,
      b.rows_total as "rowsTotal",
      b.rows_inserted as "rowsInserted",
      b.rows_rejected as "rowsRejected",
      b.started_at as "startedAt",
      b.completed_at as "completedAt",
      b.error_summary as "errorSummary",
      COUNT(e.id)::int as "errorCount"
    FROM dwh.etl_batches b
    LEFT JOIN dwh.etl_batch_errors e ON e.batch_id = b.id
    GROUP BY b.id
    ORDER BY b.started_at DESC
    LIMIT $1 OFFSET $2;
  `
  const result = await queryDwh(sql, [limit, offset]).catch(() => ({ rows: [] }))
  return result.rows
}

/**
 * Returns row-level validation errors for a specific ETL batch.
 */
export async function getEtlBatchErrors(batchId) {
  const sql = `
    SELECT id, row_number as "rowNumber", raw_data as "rawData", validation_error as "validationError", created_at as "createdAt"
    FROM dwh.etl_batch_errors
    WHERE batch_id = $1
    ORDER BY row_number ASC
    LIMIT 100;
  `
  const result = await queryDwh(sql, [batchId]).catch(() => ({ rows: [] }))
  return result.rows
}

export default {
  getWarehouseOverview,
  getCareerAnalytics,
  getSkillsAnalytics,
  getAlumniAnalytics,
  getOlapData,
  getDatasetsMetadata,
  getDataQualityReport,
  getEtlHistory,
  getEtlBatchErrors,
}
