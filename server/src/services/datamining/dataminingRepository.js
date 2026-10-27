/**
 * Data Mining Repository Layer.
 * Provides read-optimized, parameterized data extractions from the 'dwh' schema
 * for Clustering, Association Rule Mining, and Classification.
 */
import { queryDwh } from '../../config/dwh.js'
import logger from '../../utils/logger.js'

/**
 * Extracts alumni profiles with their associated skills for Clustering and Classification.
 * Returns one row per unique alumnus with aggregated skills.
 *
 * @param {Object} options
 * @param {string} options.recordSource - 'indian_academic_benchmark' | 'operational' | 'ALL'
 * @param {number} options.limit - Max records to fetch
 */
export async function getAlumniSkillDataset({ recordSource = 'indian_academic_benchmark', limit = 5000 } = {}) {
  const params = []
  const conditions = []

  if (recordSource && recordSource !== 'ALL') {
    params.push(recordSource)
    conditions.push(`da.record_source = $${params.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  params.push(limit)
  const limitClause = `LIMIT $${params.length}`

  const sql = `
    SELECT 
      da.alumni_sk,
      da.natural_alumni_id,
      da.graduation_year,
      da.department,
      da.degree,
      da.career_level,
      da.experience_years,
      da.city,
      da.industry,
      da.record_source,
      COALESCE(
        json_agg(
          json_build_object(
            'skill_sk', ds.skill_sk,
            'skill_name', ds.skill_name,
            'category', ds.category,
            'proficiency_level', bas.proficiency_level,
            'years_used', bas.years_used
          )
        ) FILTER (WHERE ds.skill_sk IS NOT NULL),
        '[]'
      ) as skills
    FROM dwh.dim_alumni da
    LEFT JOIN dwh.bridge_alumni_skill bas ON bas.alumni_sk = da.alumni_sk
    LEFT JOIN dwh.dim_skill ds ON ds.skill_sk = bas.skill_sk
    ${whereClause}
    GROUP BY 
      da.alumni_sk, da.natural_alumni_id, da.graduation_year,
      da.department, da.degree, da.career_level, da.experience_years,
      da.city, da.industry, da.record_source
    ORDER BY da.alumni_sk ASC
    ${limitClause};
  `

  try {
    const res = await queryDwh(sql, params)
    return res.rows
  } catch (err) {
    logger.error('Failed to extract alumni skill dataset for data mining', { error: err.message })
    throw err
  }
}

/**
 * Extracts transaction baskets of skills for Apriori Association Rule Mining.
 *
 * @param {Object} options
 * @param {string} options.mode - 'alumni_skills' | 'job_skills' | 'career_outcomes'
 * @param {string} options.recordSource - 'indian_academic_benchmark' | 'operational' | 'ALL'
 * @param {number} options.limit
 */
export async function getSkillTransactionBaskets({ mode = 'alumni_skills', recordSource = 'indian_academic_benchmark', limit = 10000 } = {}) {
  const params = []

  if (mode === 'job_skills') {
    const conditions = []
    if (recordSource && recordSource !== 'ALL') {
      params.push(recordSource)
      conditions.push(`dj.record_source = $${params.length}`)
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    params.push(limit)

    const sql = `
      SELECT 
        dj.job_sk as transaction_id,
        dj.natural_job_id,
        dj.job_title,
        dj.industry,
        ARRAY_AGG(DISTINCT ds.skill_name ORDER BY ds.skill_name) as items
      FROM dwh.dim_job dj
      JOIN dwh.bridge_job_skill bjs ON bjs.job_sk = dj.job_sk
      JOIN dwh.dim_skill ds ON ds.skill_sk = bjs.skill_sk
      ${whereClause}
      GROUP BY dj.job_sk, dj.natural_job_id, dj.job_title, dj.industry
      HAVING count(ds.skill_sk) >= 2
      ORDER BY dj.job_sk ASC
      LIMIT $${params.length};
    `
    const res = await queryDwh(sql, params)
    return res.rows
  }

  if (mode === 'career_outcomes') {
    const conditions = []
    if (recordSource && recordSource !== 'ALL') {
      params.push(recordSource)
      conditions.push(`fco.record_source = $${params.length}`)
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    params.push(limit)

    const sql = `
      SELECT 
        fco.outcome_id as transaction_id,
        fco.natural_outcome_id,
        fco.employed_within_6_months,
        ARRAY_APPEND(
          ARRAY_AGG(DISTINCT ds.skill_name ORDER BY ds.skill_name),
          CASE 
            WHEN fco.employed_within_6_months = 1 THEN 'Target:Placed_6M'
            ELSE 'Target:Not_Placed_6M'
          END
        ) as items
      FROM dwh.fact_career_outcomes fco
      JOIN dwh.dim_alumni da ON da.alumni_sk = fco.alumni_sk
      JOIN dwh.bridge_alumni_skill bas ON bas.alumni_sk = da.alumni_sk
      JOIN dwh.dim_skill ds ON ds.skill_sk = bas.skill_sk
      ${whereClause}
      GROUP BY fco.outcome_id, fco.natural_outcome_id, fco.employed_within_6_months
      HAVING count(ds.skill_sk) >= 1
      ORDER BY fco.outcome_id ASC
      LIMIT $${params.length};
    `
    const res = await queryDwh(sql, params)
    return res.rows
  }

  // Default: alumni_skills
  const conditions = []
  if (recordSource && recordSource !== 'ALL') {
    params.push(recordSource)
    conditions.push(`da.record_source = $${params.length}`)
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  params.push(limit)

  const sql = `
    SELECT 
      da.alumni_sk as transaction_id,
      da.natural_alumni_id,
      da.department,
      da.industry,
      ARRAY_AGG(DISTINCT ds.skill_name ORDER BY ds.skill_name) as items
    FROM dwh.dim_alumni da
    JOIN dwh.bridge_alumni_skill bas ON bas.alumni_sk = da.alumni_sk
    JOIN dwh.dim_skill ds ON ds.skill_sk = bas.skill_sk
    ${whereClause}
    GROUP BY da.alumni_sk, da.natural_alumni_id, da.department, da.industry
    HAVING count(ds.skill_sk) >= 2
    ORDER BY da.alumni_sk ASC
    LIMIT $${params.length};
  `
  const res = await queryDwh(sql, params)
  return res.rows
}

/**
 * Extracts labeled career outcome dataset for supervised classification.
 * Joins dwh.fact_career_outcomes with alumni pre-outcome attributes and skills.
 *
 * @param {Object} options
 * @param {string} options.recordSource
 * @param {number} options.limit
 */
export async function getClassificationTrainingDataset({ recordSource = 'indian_academic_benchmark', limit = 5000 } = {}) {
  const params = []
  const conditions = []

  if (recordSource && recordSource !== 'ALL') {
    params.push(recordSource)
    conditions.push(`fco.record_source = $${params.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  params.push(limit)

  const sql = `
    SELECT 
      fco.outcome_id,
      fco.natural_outcome_id,
      fco.employed_within_6_months as target,
      fco.observation_period_months,
      fco.record_source,
      fco.is_synthetic_educational_target,
      da.alumni_sk,
      da.graduation_year,
      da.department,
      da.degree,
      da.career_level,
      da.experience_years as experience_years_profile,
      fco.experience_years_at_observation,
      fco.industry,
      COALESCE(
        json_agg(
          json_build_object(
            'skill_name', ds.skill_name,
            'proficiency_level', bas.proficiency_level,
            'years_used', bas.years_used
          )
        ) FILTER (WHERE ds.skill_sk IS NOT NULL),
        '[]'
      ) as skills
    FROM dwh.fact_career_outcomes fco
    JOIN dwh.dim_alumni da ON da.alumni_sk = fco.alumni_sk
    LEFT JOIN dwh.bridge_alumni_skill bas ON bas.alumni_sk = da.alumni_sk
    LEFT JOIN dwh.dim_skill ds ON ds.skill_sk = bas.skill_sk
    ${whereClause}
    GROUP BY 
      fco.outcome_id, fco.natural_outcome_id, fco.employed_within_6_months,
      fco.observation_period_months, fco.record_source, fco.is_synthetic_educational_target,
      da.alumni_sk, da.graduation_year, da.department, da.degree, da.career_level,
      da.experience_years, fco.experience_years_at_observation, fco.industry
    ORDER BY fco.outcome_id ASC
    LIMIT $${params.length};
  `

  try {
    const res = await queryDwh(sql, params)
    return res.rows
  } catch (err) {
    logger.error('Failed to extract classification dataset', { error: err.message })
    throw err
  }
}

/**
 * Returns summary metadata and counts for the data mining cockpit.
 */
export async function getDataMiningSummary({ recordSource = 'indian_academic_benchmark' } = {}) {
  const params = []
  const conditions = []
  if (recordSource && recordSource !== 'ALL') {
    params.push(recordSource)
    conditions.push(`record_source = $${params.length}`)
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const [alumniRes, jobRes, outcomeRes, skillsRes, bridgeAlumniRes, bridgeJobRes] = await Promise.all([
    queryDwh(`SELECT count(*)::int as c FROM dwh.dim_alumni ${whereClause};`, params).catch(() => ({ rows: [{ c: 0 }] })),
    queryDwh(`SELECT count(*)::int as c FROM dwh.dim_job ${whereClause};`, params).catch(() => ({ rows: [{ c: 0 }] })),
    queryDwh(`SELECT count(*)::int as c FROM dwh.fact_career_outcomes ${whereClause};`, params).catch(() => ({ rows: [{ c: 0 }] })),
    queryDwh(`SELECT count(*)::int as c FROM dwh.dim_skill;`).catch(() => ({ rows: [{ c: 0 }] })),
    queryDwh(`SELECT count(*)::int as c FROM dwh.bridge_alumni_skill ${whereClause};`, params).catch(() => ({ rows: [{ c: 0 }] })),
    queryDwh(`SELECT count(*)::int as c FROM dwh.bridge_job_skill ${whereClause};`, params).catch(() => ({ rows: [{ c: 0 }] })),
  ])

  return {
    recordSource,
    counts: {
      alumniProfiles: alumniRes.rows[0].c,
      jobPostings: jobRes.rows[0].c,
      careerOutcomes: outcomeRes.rows[0].c,
      catalogSkills: skillsRes.rows[0].c,
      alumniSkillBridges: bridgeAlumniRes.rows[0].c,
      jobSkillBridges: bridgeJobRes.rows[0].c,
    },
    educationalNotice: 'Data mining models and evaluations are computed from academic benchmark datasets for curriculum demonstration. Predicted outcomes do not constitute commercial hiring guarantees.',
  }
}
