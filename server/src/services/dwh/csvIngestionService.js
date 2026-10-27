/**
 * Production CSV Ingestion Service for DWM Platform.
 * Supports schema detection, column mapping, row-level validation,
 * foreign key resolution, duplicate prevention, chronological consistency,
 * dry-run preview, audit ledger logging, transactional commit, and rollback.
 */
import { withTransaction, query } from '../../config/database.js'
import logger from '../../utils/logger.js'

// Supported dataset types and canonical field aliases
export const DATASET_SCHEMAS = {
  placements: {
    required: ['student_id', 'department', 'company', 'package_lpa'],
    aliases: {
      student_id: ['student_id', 'student_id_number', 'roll_no', 'roll_number', 'studentid', 'id'],
      department: ['department', 'dept', 'branch', 'major', 'stream'],
      company: ['company', 'company_name', 'recruiter', 'employer', 'organization'],
      package_lpa: ['package_lpa', 'annual_package_lpa', 'ctc_lpa', 'salary_lpa', 'ctc', 'lpa'],
      graduation_year: ['graduation_year', 'grad_year', 'batch', 'year', 'passout_year'],
      cgpa: ['cgpa', 'gpa', 'score'],
      degree: ['degree', 'program', 'course'],
      offer_date: ['offer_date', 'date', 'placed_date'],
    },
  },
  alumni_salaries: {
    required: ['company', 'job_role', 'salary_inr'],
    aliases: {
      company: ['company', 'company_name', 'employer', 'organization'],
      job_role: ['job_role', 'role', 'designation', 'title', 'position'],
      salary_inr: ['salary_inr', 'total_annual_comp_inr', 'annual_salary_inr', 'ctc_inr', 'salary'],
      experience_years: ['experience_years', 'experience', 'exp', 'years_of_experience'],
      industry: ['industry', 'sector', 'domain'],
      effective_date: ['effective_date', 'date', 'year'],
    },
  },
  skills: {
    required: ['skill_name'],
    aliases: {
      skill_id: ['skill_id', 'natural_skill_id', 'id'],
      skill_name: ['skill_name', 'skill', 'name', 'competency'],
      category: ['category', 'skill_category', 'domain', 'type'],
      data_source: ['data_source', 'record_source', 'source'],
    },
  },
  alumni_profiles: {
    required: ['graduation_year', 'department', 'current_company', 'job_role'],
    aliases: {
      graduation_year: ['graduation_year', 'grad_year', 'batch', 'year'],
      department: ['department', 'dept', 'branch', 'major'],
      current_company: ['current_company', 'company', 'employer', 'organization'],
      job_role: ['job_role', 'role', 'designation', 'current_position'],
      industry: ['industry', 'domain', 'sector'],
      city: ['city', 'location', 'metro'],
      country: ['country', 'nation'],
      is_mentor: ['is_mentor', 'open_to_mentor', 'mentor'],
      experience_years: ['experience_years', 'experience', 'exp'],
      data_source: ['data_source', 'record_source', 'source'],
    },
  },
  alumni: {
    required: ['alumni_id', 'graduation_year', 'degree', 'field_of_study', 'current_role'],
    aliases: {
      alumni_id: ['alumni_id', 'natural_alumni_id', 'id'],
      graduation_year: ['graduation_year', 'grad_year', 'batch', 'year'],
      degree: ['degree', 'qualification', 'program'],
      field_of_study: ['field_of_study', 'department', 'dept', 'branch', 'major'],
      current_role: ['current_role', 'job_role', 'role', 'designation', 'current_position'],
      industry: ['industry', 'domain', 'sector'],
      experience_years: ['experience_years', 'experience', 'exp'],
      location_region: ['location_region', 'city', 'location', 'region'],
      career_level: ['career_level', 'level', 'seniority'],
      data_source: ['data_source', 'record_source', 'source'],
    },
  },
  jobs: {
    required: ['job_id', 'job_title', 'company_name', 'posted_date'],
    aliases: {
      job_id: ['job_id', 'natural_job_id', 'id', 'requisition_id'],
      job_title: ['job_title', 'title', 'role', 'position'],
      company_id: ['company_id', 'natural_company_id'],
      company_name: ['company_name', 'company', 'employer', 'organization'],
      industry: ['industry', 'domain', 'sector'],
      location_region: ['location_region', 'location', 'city', 'region'],
      employment_type: ['employment_type', 'type'],
      posted_date: ['posted_date', 'date', 'posted_at'],
      experience_level: ['experience_level', 'required_level', 'level'],
      data_source: ['data_source', 'record_source', 'source'],
    },
  },
  alumni_skills: {
    required: ['alumni_id', 'skill_id'],
    aliases: {
      alumni_id: ['alumni_id', 'natural_alumni_id', 'student_id'],
      skill_id: ['skill_id', 'natural_skill_id'],
      proficiency_level: ['proficiency_level', 'proficiency', 'level'],
      years_used: ['years_used', 'years_experience', 'years'],
      data_source: ['data_source', 'record_source', 'source'],
    },
  },
  job_skills: {
    required: ['job_id', 'skill_id'],
    aliases: {
      job_id: ['job_id', 'natural_job_id', 'requisition_id'],
      skill_id: ['skill_id', 'natural_skill_id'],
      required_level: ['required_level', 'importance_level', 'level'],
      data_source: ['data_source', 'record_source', 'source'],
    },
  },
  applications: {
    required: ['application_id', 'alumni_id', 'job_id', 'application_date', 'application_status'],
    aliases: {
      application_id: ['application_id', 'natural_application_id', 'appid', 'id'],
      alumni_id: ['alumni_id', 'natural_alumni_id', 'applicant_id'],
      job_id: ['job_id', 'natural_job_id', 'requisition_id'],
      application_date: ['application_date', 'applied_date', 'date'],
      application_status: ['application_status', 'status', 'stage'],
      days_to_decision: ['days_to_decision', 'duration_days', 'turnaround_days'],
      data_source: ['data_source', 'record_source', 'source'],
    },
  },
  career_outcomes: {
    required: ['outcome_id', 'alumni_id', 'employed_within_6_months'],
    aliases: {
      outcome_id: ['outcome_id', 'natural_outcome_id', 'id'],
      alumni_id: ['alumni_id', 'natural_alumni_id', 'student_id'],
      observation_period_months: ['observation_period_months', 'horizon_months', 'period'],
      employed_within_6_months: ['employed_within_6_months', 'employed', 'placed', 'target_label', 'target'],
      career_level: ['career_level', 'level', 'seniority'],
      industry: ['industry', 'sector', 'domain'],
      experience_years_at_observation: ['experience_years_at_observation', 'experience_years', 'exp'],
      data_source: ['data_source', 'record_source', 'source'],
    },
  },
}

// Canonical type normalizer for requested types and synonyms
export function normalizeDatasetType(requestedType) {
  if (!requestedType) return null
  const clean = String(requestedType).toLowerCase().trim().replace(/[^a-z0-9_]/g, '_')
  const aliases = {
    skills: 'skills',
    alumni: 'alumni',
    jobs: 'jobs',
    alumni_skills: 'alumni_skills',
    job_skills: 'job_skills',
    applications: 'applications',
    job_applications: 'applications',
    career_outcomes: 'career_outcomes',
    career_outcome: 'career_outcomes',
    // Backward compatibility for legacy naming
    synthetic_skills: 'skills',
    synthetic_alumni: 'alumni',
    synthetic_jobs: 'jobs',
    synthetic_alumni_skills: 'alumni_skills',
    synthetic_job_skills: 'job_skills',
    synthetic_applications: 'applications',
    synthetic_career_outcomes: 'career_outcomes',
  }
  return aliases[clean] || (DATASET_SCHEMAS[clean] ? clean : null)
}

/**
 * Parses raw CSV string according to RFC 4180 rules.
 */
export function parseCsvString(text) {
  const lines = []
  let currentRow = []
  let currentCell = ''
  let insideQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"'
        i++ // Skip escaped quote
      } else {
        insideQuotes = !insideQuotes
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim())
      currentCell = ''
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++ // Skip CRLF
      currentRow.push(currentCell.trim())
      if (currentRow.some((cell) => cell.length > 0)) {
        lines.push(currentRow)
      }
      currentRow = []
      currentCell = ''
    } else {
      currentCell += char
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim())
    if (currentRow.some((cell) => cell.length > 0)) {
      lines.push(currentRow)
    }
  }

  return lines
}

/**
 * Detects dataset type from headers and returns canonical column mappings.
 */
export function matchSchema(headers = [], requestedType = null) {
  const normalizedHeaders = headers.map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, '_').trim())
  const resolvedType = normalizeDatasetType(requestedType)

  const candidateTypes = resolvedType && DATASET_SCHEMAS[resolvedType]
    ? [resolvedType]
    : Object.keys(DATASET_SCHEMAS)

  let bestMatch = null
  let maxMatchedRequired = -1

  for (const type of candidateTypes) {
    const schema = DATASET_SCHEMAS[type]
    const mapping = {}
    let matchedRequiredCount = 0

    for (const [canonicalKey, aliasList] of Object.entries(schema.aliases)) {
      const idx = normalizedHeaders.findIndex((nh) => aliasList.includes(nh))
      if (idx !== -1) {
        mapping[canonicalKey] = { originalHeader: headers[idx], index: idx }
        if (schema.required.includes(canonicalKey)) {
          matchedRequiredCount++
        }
      }
    }

    if (matchedRequiredCount > maxMatchedRequired) {
      maxMatchedRequired = matchedRequiredCount
      bestMatch = {
        type,
        mapping,
        missingRequired: schema.required.filter((k) => !mapping[k]),
        isComplete: schema.required.every((k) => mapping[k]),
      }
    }
  }

  return bestMatch
}

/**
 * Helper to validate ISO date string (YYYY-MM-DD).
 */
function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false
  const match = dateStr.match(/^\d{4}-\d{2}-\d{2}$/)
  if (!match) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime())
}

/**
 * Validates a parsed row against schema and domain rules.
 */
function validateRow(row, mapping, type, rowNumber) {
  const getVal = (canonicalKey) => {
    const col = mapping[canonicalKey]
    return col && col.index < row.length ? row[col.index] : undefined
  }

  const errors = []
  const cleansed = {}

  if (type === 'placements') {
    const studentId = getVal('student_id')
    const dept = getVal('department')
    const company = getVal('company')
    const pkgRaw = getVal('package_lpa')
    const gradYearRaw = getVal('graduation_year')
    const cgpaRaw = getVal('cgpa')

    if (!studentId) errors.push('Missing student_id')
    if (!dept) errors.push('Missing department')
    if (!company) errors.push('Missing company_name')

    const pkg = parseFloat(pkgRaw)
    if (isNaN(pkg) || pkg <= 0 || pkg > 300) {
      errors.push(`Invalid annual package LPA: "${pkgRaw}". Must be between 0.1 and 300.`)
    }

    let gradYear = parseInt(gradYearRaw, 10)
    if (isNaN(gradYear) || gradYear < 2000 || gradYear > 2035) {
      gradYear = 2025
    }

    let cgpa = parseFloat(cgpaRaw)
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      cgpa = 7.5
    }

    cleansed.student_id = studentId?.trim()
    cleansed.department = dept?.trim()
    cleansed.company = company?.trim()
    cleansed.package_lpa = pkg
    cleansed.graduation_year = gradYear
    cleansed.cgpa = cgpa
    cleansed.degree = getVal('degree') || 'B.Tech'
    cleansed.offer_date = getVal('offer_date') || `${gradYear}-05-01`
  } else if (type === 'alumni_salaries') {
    const company = getVal('company')
    const role = getVal('job_role')
    const salaryRaw = getVal('salary_inr')

    if (!company) errors.push('Missing company_name')
    if (!role) errors.push('Missing job_role')

    let salary = parseFloat(salaryRaw)
    if (isNaN(salary) || salary <= 0) {
      errors.push(`Invalid salary INR: "${salaryRaw}". Must be a positive number.`)
    }
    if (salary > 0 && salary < 1000) {
      salary = Math.round(salary * 100000)
    }

    let exp = parseFloat(getVal('experience_years'))
    if (isNaN(exp) || exp < 0) exp = 3.0

    cleansed.company = company?.trim()
    cleansed.job_role = role?.trim()
    cleansed.salary_inr = salary
    cleansed.experience_years = exp
    cleansed.industry = getVal('industry') || 'Technology'
    cleansed.effective_date = getVal('effective_date') || new Date().toISOString().split('T')[0]
  } else if (type === 'skills') {
    const skillName = getVal('skill_name')
    const category = getVal('category') || 'General'
    const skillId = getVal('skill_id')
    const dataSource = getVal('data_source') || (skillId ? 'indian_academic_benchmark' : 'csv_import')

    if (!skillName) errors.push('Missing skill_name')

    cleansed.skill_name = skillName?.trim()
    cleansed.category = category?.trim()
    cleansed.natural_skill_id = skillId ? skillId.trim() : null
    cleansed.data_source = dataSource?.trim()
  } else if (type === 'alumni_profiles') {
    const dept = getVal('department')
    const comp = getVal('current_company')
    const role = getVal('job_role')
    const gradYear = parseInt(getVal('graduation_year'), 10)

    if (!dept) errors.push('Missing department')
    if (!comp) errors.push('Missing current_company')
    if (!role) errors.push('Missing job_role')
    if (isNaN(gradYear) || gradYear < 1980 || gradYear > 2035) {
      errors.push('Invalid graduation_year')
    }

    cleansed.graduation_year = gradYear
    cleansed.department = dept?.trim()
    cleansed.current_company = comp?.trim()
    cleansed.job_role = role?.trim()
    cleansed.industry = getVal('industry') || 'Technology'
    cleansed.city = getVal('city') || 'Mumbai'
    cleansed.country = getVal('country') || 'India'
    cleansed.is_mentor = ['true', '1', 'yes'].includes(String(getVal('is_mentor')).toLowerCase())
    cleansed.experience_years = parseFloat(getVal('experience_years')) || 5.0
    cleansed.data_source = getVal('data_source') || 'csv_import'
  } else if (type === 'alumni') {
    const alumniId = getVal('alumni_id')
    const gradYearRaw = getVal('graduation_year')
    const degree = getVal('degree')
    const field = getVal('field_of_study')
    const role = getVal('current_role')
    const gradYear = parseInt(gradYearRaw, 10)

    if (!alumniId) errors.push('Missing alumni_id')
    if (!degree) errors.push('Missing degree')
    if (!field) errors.push('Missing field_of_study')
    if (!role) errors.push('Missing current_role')
    if (isNaN(gradYear) || gradYear < 1980 || gradYear > 2035) {
      errors.push(`Invalid graduation_year: "${gradYearRaw}"`)
    }

    const expYears = parseFloat(getVal('experience_years'))
    if (isNaN(expYears) || expYears < 0 || expYears > 50) {
      errors.push(`Invalid experience_years: "${getVal('experience_years')}"`)
    }

    cleansed.natural_alumni_id = alumniId?.trim()
    cleansed.graduation_year = gradYear
    cleansed.degree = degree?.trim()
    cleansed.department = field?.trim()
    cleansed.job_role = role?.trim()
    cleansed.industry = getVal('industry')?.trim() || 'Technology'
    cleansed.experience_years = isNaN(expYears) ? 0 : Math.round(expYears)
    cleansed.location_region = getVal('location_region')?.trim() || 'Remote - India'
    cleansed.career_level = getVal('career_level')?.trim() || 'Entry-Level'
    cleansed.data_source = getVal('data_source')?.trim() || 'indian_academic_benchmark'
  } else if (type === 'jobs') {
    const jobId = getVal('job_id')
    const jobTitle = getVal('job_title')
    const compName = getVal('company_name')
    const postedDate = getVal('posted_date')

    if (!jobId) errors.push('Missing job_id')
    if (!jobTitle) errors.push('Missing job_title')
    if (!compName) errors.push('Missing company_name')
    if (!isValidDate(postedDate)) {
      errors.push(`Invalid posted_date: "${postedDate}". Expected YYYY-MM-DD.`)
    }

    cleansed.natural_job_id = jobId?.trim()
    cleansed.job_title = jobTitle?.trim()
    cleansed.natural_company_id = getVal('company_id')?.trim() || null
    cleansed.company_name = compName?.trim()
    cleansed.industry = getVal('industry')?.trim() || 'Technology'
    cleansed.location_region = getVal('location_region')?.trim() || 'Remote - India'
    cleansed.employment_type = getVal('employment_type')?.trim() || 'Full-Time'
    cleansed.posted_date = postedDate?.trim()
    cleansed.experience_level = getVal('experience_level')?.trim() || 'Mid-Level'
    cleansed.data_source = getVal('data_source')?.trim() || 'indian_academic_benchmark'
  } else if (type === 'alumni_skills') {
    const alumniId = getVal('alumni_id')
    const skillId = getVal('skill_id')
    const prof = getVal('proficiency_level') || 'Intermediate'
    const yearsRaw = getVal('years_used')
    const yearsUsed = parseInt(yearsRaw, 10)

    if (!alumniId) errors.push('Missing alumni_id')
    if (!skillId) errors.push('Missing skill_id')
    if (isNaN(yearsUsed) || yearsUsed < 0 || yearsUsed > 40) {
      errors.push(`Invalid years_used: "${yearsRaw}"`)
    }

    cleansed.natural_alumni_id = alumniId?.trim()
    cleansed.natural_skill_id = skillId?.trim()
    cleansed.proficiency_level = prof.trim()
    cleansed.years_used = isNaN(yearsUsed) ? 1 : yearsUsed
    cleansed.data_source = getVal('data_source')?.trim() || 'indian_academic_benchmark'
  } else if (type === 'job_skills') {
    const jobId = getVal('job_id')
    const skillId = getVal('skill_id')
    const reqLevel = getVal('required_level') || 'Preferred'

    if (!jobId) errors.push('Missing job_id')
    if (!skillId) errors.push('Missing skill_id')

    cleansed.natural_job_id = jobId?.trim()
    cleansed.natural_skill_id = skillId?.trim()
    cleansed.required_level = reqLevel.trim()
    cleansed.data_source = getVal('data_source')?.trim() || 'indian_academic_benchmark'
  } else if (type === 'applications') {
    const appId = getVal('application_id')
    const alumniId = getVal('alumni_id')
    const jobId = getVal('job_id')
    const appDate = getVal('application_date')
    const status = getVal('application_status')?.toLowerCase()?.trim()

    if (!appId) errors.push('Missing application_id')
    if (!alumniId) errors.push('Missing alumni_id')
    if (!jobId) errors.push('Missing job_id')
    if (!isValidDate(appDate)) {
      errors.push(`Invalid application_date: "${appDate}". Expected YYYY-MM-DD.`)
    }

    const validStatuses = ['applied', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected']
    if (!status || !validStatuses.includes(status)) {
      errors.push(`Invalid application_status: "${status}". Must be one of: ${validStatuses.join(', ')}`)
    }

    const daysRaw = getVal('days_to_decision')
    let daysToDecision = null
    if (daysRaw !== undefined && daysRaw !== null && String(daysRaw).trim() !== '') {
      daysToDecision = parseInt(daysRaw, 10)
      if (isNaN(daysToDecision) || daysToDecision < 0) {
        errors.push(`Invalid days_to_decision: "${daysRaw}"`)
      }
    }

    cleansed.natural_application_id = appId?.trim()
    cleansed.natural_alumni_id = alumniId?.trim()
    cleansed.natural_job_id = jobId?.trim()
    cleansed.application_date = appDate?.trim()
    cleansed.application_status = status
    cleansed.days_to_decision = daysToDecision
    cleansed.data_source = getVal('data_source')?.trim() || 'indian_academic_benchmark'
  } else if (type === 'career_outcomes') {
    const outcomeId = getVal('outcome_id')
    const alumniId = getVal('alumni_id')
    const employedRaw = getVal('employed_within_6_months')
    const employed = parseInt(employedRaw, 10)

    if (!outcomeId) errors.push('Missing outcome_id')
    if (!alumniId) errors.push('Missing alumni_id')
    if (employed !== 0 && employed !== 1) {
      errors.push(`Invalid employed_within_6_months: "${employedRaw}". Must be strictly 0 or 1.`)
    }

    const expYears = parseFloat(getVal('experience_years_at_observation'))

    cleansed.natural_outcome_id = outcomeId?.trim()
    cleansed.natural_alumni_id = alumniId?.trim()
    cleansed.observation_period_months = parseInt(getVal('observation_period_months'), 10) || 6
    cleansed.employed_within_6_months = employed
    cleansed.career_level = getVal('career_level')?.trim() || 'Entry-Level'
    cleansed.industry = getVal('industry')?.trim() || 'Technology'
    cleansed.experience_years_at_observation = isNaN(expYears) ? 0.0 : Math.max(0, expYears)
    cleansed.data_source = getVal('data_source')?.trim() || 'indian_academic_benchmark'
  }

  return {
    rowNumber,
    isValid: errors.length === 0,
    errors,
    cleansed,
    rawData: row,
  }
}

/**
 * Validates relational foreign keys, chronology, and uniqueness against the warehouse.
 */
async function validateRelationalIntegrity(validRows, type, knownParentKeys = null) {
  const rejected = []
  const approved = []
  const seenInFile = new Set()

  const extraSkillIds = knownParentKeys?.skillIds || new Set()
  const extraAlumniIds = knownParentKeys?.alumniIds || new Set()
  const extraJobMap = knownParentKeys?.jobMap || new Map()

  if (type === 'skills') {
    const skillIds = validRows.map((r) => r.natural_skill_id).filter(Boolean)
    const existingRes = skillIds.length > 0
      ? await query(`SELECT natural_skill_id, skill_name FROM dwh.dim_skill WHERE natural_skill_id = ANY($1) OR skill_name = ANY($2);`, [skillIds, validRows.map((r) => r.skill_name)])
      : { rows: [] }
    const existingSkillIds = new Set(existingRes.rows.map((r) => r.natural_skill_id).filter(Boolean))
    const existingSkillNames = new Set(existingRes.rows.map((r) => r.skill_name.toLowerCase()))

    validRows.forEach((row, idx) => {
      if (row.natural_skill_id && seenInFile.has(row.natural_skill_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Duplicate natural_skill_id "${row.natural_skill_id}" within file`,
        })
        return
      }
      if (row.natural_skill_id) seenInFile.add(row.natural_skill_id)

      row._action = existingSkillIds.has(row.natural_skill_id) || existingSkillNames.has(row.skill_name.toLowerCase())
        ? 'update'
        : 'insert'
      approved.push(row)
    })
  } else if (type === 'alumni') {
    const alumniIds = validRows.map((r) => r.natural_alumni_id)
    const existingRes = alumniIds.length > 0
      ? await query(`SELECT natural_alumni_id FROM dwh.dim_alumni WHERE natural_alumni_id = ANY($1);`, [alumniIds])
      : { rows: [] }
    const existingAlumniIds = new Set(existingRes.rows.map((r) => r.natural_alumni_id))

    validRows.forEach((row, idx) => {
      if (seenInFile.has(row.natural_alumni_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Duplicate natural_alumni_id "${row.natural_alumni_id}" within file`,
        })
        return
      }
      seenInFile.add(row.natural_alumni_id)

      row._action = existingAlumniIds.has(row.natural_alumni_id) ? 'update' : 'insert'
      approved.push(row)
    })
  } else if (type === 'jobs') {
    const jobIds = validRows.map((r) => r.natural_job_id)
    const existingRes = jobIds.length > 0
      ? await query(`SELECT natural_job_id FROM dwh.dim_job WHERE natural_job_id = ANY($1);`, [jobIds])
      : { rows: [] }
    const existingJobIds = new Set(existingRes.rows.map((r) => r.natural_job_id))

    validRows.forEach((row, idx) => {
      if (seenInFile.has(row.natural_job_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Duplicate natural_job_id "${row.natural_job_id}" within file`,
        })
        return
      }
      seenInFile.add(row.natural_job_id)

      row._action = existingJobIds.has(row.natural_job_id) ? 'update' : 'insert'
      approved.push(row)
    })
  } else if (type === 'alumni_skills') {
    const alumniIds = [...new Set(validRows.map((r) => r.natural_alumni_id))]
    const skillIds = [...new Set(validRows.map((r) => r.natural_skill_id))]

    const alumniRes = alumniIds.length > 0
      ? await query(`SELECT natural_alumni_id, alumni_sk FROM dwh.dim_alumni WHERE natural_alumni_id = ANY($1);`, [alumniIds])
      : { rows: [] }
    const validAlumniMap = new Map(alumniRes.rows.map((r) => [r.natural_alumni_id, r.alumni_sk]))

    const skillRes = skillIds.length > 0
      ? await query(`SELECT natural_skill_id, skill_sk FROM dwh.dim_skill WHERE natural_skill_id = ANY($1);`, [skillIds])
      : { rows: [] }
    const validSkillMap = new Map(skillRes.rows.map((r) => [r.natural_skill_id, r.skill_sk]))

    const existingBridges = validAlumniMap.size > 0 && validSkillMap.size > 0
      ? await query(`
          SELECT da.natural_alumni_id, ds.natural_skill_id 
          FROM dwh.bridge_alumni_skill bas
          JOIN dwh.dim_alumni da ON da.alumni_sk = bas.alumni_sk
          JOIN dwh.dim_skill ds ON ds.skill_sk = bas.skill_sk
          WHERE da.natural_alumni_id = ANY($1);
        `, [[...validAlumniMap.keys()]])
      : { rows: [] }
    const existingBridgeSet = new Set(existingBridges.rows.map((r) => `${r.natural_alumni_id}:${r.natural_skill_id}`))

    validRows.forEach((row, idx) => {
      const pairKey = `${row.natural_alumni_id}:${row.natural_skill_id}`
      if (seenInFile.has(pairKey)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Duplicate composite bridge pair (alumni_id: "${row.natural_alumni_id}", skill_id: "${row.natural_skill_id}") within file`,
        })
        return
      }
      seenInFile.add(pairKey)

      if (!validAlumniMap.has(row.natural_alumni_id) && !extraAlumniIds.has(row.natural_alumni_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Foreign key violation: alumni_id "${row.natural_alumni_id}" does not exist in dwh.dim_alumni`,
        })
        return
      }

      if (!validSkillMap.has(row.natural_skill_id) && !extraSkillIds.has(row.natural_skill_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Foreign key violation: skill_id "${row.natural_skill_id}" does not exist in dwh.dim_skill`,
        })
        return
      }

      row._alumni_sk = validAlumniMap.get(row.natural_alumni_id) || null
      row._skill_sk = validSkillMap.get(row.natural_skill_id) || null
      row._action = existingBridgeSet.has(pairKey) ? 'update' : 'insert'
      approved.push(row)
    })
  } else if (type === 'job_skills') {
    const jobIds = [...new Set(validRows.map((r) => r.natural_job_id))]
    const skillIds = [...new Set(validRows.map((r) => r.natural_skill_id))]

    const jobRes = jobIds.length > 0
      ? await query(`SELECT natural_job_id, job_sk FROM dwh.dim_job WHERE natural_job_id = ANY($1);`, [jobIds])
      : { rows: [] }
    const validJobMap = new Map(jobRes.rows.map((r) => [r.natural_job_id, r.job_sk]))

    const skillRes = skillIds.length > 0
      ? await query(`SELECT natural_skill_id, skill_sk FROM dwh.dim_skill WHERE natural_skill_id = ANY($1);`, [skillIds])
      : { rows: [] }
    const validSkillMap = new Map(skillRes.rows.map((r) => [r.natural_skill_id, r.skill_sk]))

    const existingJobBridges = validJobMap.size > 0 && validSkillMap.size > 0
      ? await query(`
          SELECT dj.natural_job_id, ds.natural_skill_id 
          FROM dwh.bridge_job_skill bjs
          JOIN dwh.dim_job dj ON dj.job_sk = bjs.job_sk
          JOIN dwh.dim_skill ds ON ds.skill_sk = bjs.skill_sk
          WHERE dj.natural_job_id = ANY($1);
        `, [[...validJobMap.keys()]])
      : { rows: [] }
    const existingJobBridgeSet = new Set(existingJobBridges.rows.map((r) => `${r.natural_job_id}:${r.natural_skill_id}`))

    validRows.forEach((row, idx) => {
      const pairKey = `${row.natural_job_id}:${row.natural_skill_id}`
      if (seenInFile.has(pairKey)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Duplicate composite bridge pair (job_id: "${row.natural_job_id}", skill_id: "${row.natural_skill_id}") within file`,
        })
        return
      }
      seenInFile.add(pairKey)

      if (!validJobMap.has(row.natural_job_id) && !extraJobMap.has(row.natural_job_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Foreign key violation: job_id "${row.natural_job_id}" does not exist in dwh.dim_job`,
        })
        return
      }

      if (!validSkillMap.has(row.natural_skill_id) && !extraSkillIds.has(row.natural_skill_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Foreign key violation: skill_id "${row.natural_skill_id}" does not exist in dwh.dim_skill`,
        })
        return
      }

      row._job_sk = validJobMap.get(row.natural_job_id) || null
      row._skill_sk = validSkillMap.get(row.natural_skill_id) || null
      row._action = existingJobBridgeSet.has(pairKey) ? 'update' : 'insert'
      approved.push(row)
    })
  } else if (type === 'applications') {
    const alumniIds = [...new Set(validRows.map((r) => r.natural_alumni_id))]
    const jobIds = [...new Set(validRows.map((r) => r.natural_job_id))]
    const appIds = [...new Set(validRows.map((r) => r.natural_application_id))]

    const alumniRes = alumniIds.length > 0
      ? await query(`SELECT natural_alumni_id, alumni_sk FROM dwh.dim_alumni WHERE natural_alumni_id = ANY($1);`, [alumniIds])
      : { rows: [] }
    const validAlumniMap = new Map(alumniRes.rows.map((r) => [r.natural_alumni_id, r.alumni_sk]))

    const jobRes = jobIds.length > 0
      ? await query(`SELECT natural_job_id, job_sk, company_sk, posted_date FROM dwh.dim_job WHERE natural_job_id = ANY($1);`, [jobIds])
      : { rows: [] }
    const validJobMap = new Map(jobRes.rows.map((r) => [r.natural_job_id, r]))

    const existingApps = appIds.length > 0
      ? await query(`SELECT natural_application_id FROM dwh.fact_job_application WHERE natural_application_id = ANY($1);`, [appIds])
      : { rows: [] }
    const existingAppSet = new Set(existingApps.rows.map((r) => r.natural_application_id))

    validRows.forEach((row, idx) => {
      if (seenInFile.has(row.natural_application_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Duplicate application_id "${row.natural_application_id}" within file`,
        })
        return
      }
      seenInFile.add(row.natural_application_id)

      if (!validAlumniMap.has(row.natural_alumni_id) && !extraAlumniIds.has(row.natural_alumni_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Foreign key violation: alumni_id "${row.natural_alumni_id}" does not exist in dwh.dim_alumni`,
        })
        return
      }

      if (!validJobMap.has(row.natural_job_id) && !extraJobMap.has(row.natural_job_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Foreign key violation: job_id "${row.natural_job_id}" does not exist in dwh.dim_job`,
        })
        return
      }

      const jobRecord = validJobMap.get(row.natural_job_id) || extraJobMap.get(row.natural_job_id)
      const jobPostedDate = jobRecord?.posted_date ? new Date(jobRecord.posted_date).toISOString().split('T')[0] : null

      // Chronological consistency: application_date >= job.posted_date
      if (jobPostedDate && row.application_date < jobPostedDate) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Date chronology violation: application_date (${row.application_date}) cannot precede job posted_date (${jobPostedDate})`,
        })
        return
      }

      row._alumni_sk = validAlumniMap.get(row.natural_alumni_id) || null
      row._job_sk = jobRecord?.job_sk || null
      row._company_sk = jobRecord?.company_sk || null
      row._action = existingAppSet.has(row.natural_application_id) ? 'update' : 'insert'
      approved.push(row)
    })
  } else if (type === 'career_outcomes') {
    const alumniIds = [...new Set(validRows.map((r) => r.natural_alumni_id))]
    const outcomeIds = [...new Set(validRows.map((r) => r.natural_outcome_id))]

    const alumniRes = alumniIds.length > 0
      ? await query(`SELECT natural_alumni_id, alumni_sk FROM dwh.dim_alumni WHERE natural_alumni_id = ANY($1);`, [alumniIds])
      : { rows: [] }
    const validAlumniMap = new Map(alumniRes.rows.map((r) => [r.natural_alumni_id, r.alumni_sk]))

    const existingOutcomes = outcomeIds.length > 0
      ? await query(`SELECT natural_outcome_id, alumni_sk FROM dwh.fact_career_outcomes WHERE natural_outcome_id = ANY($1);`, [outcomeIds])
      : { rows: [] }
    const existingOutcomeMap = new Set(existingOutcomes.rows.map((r) => r.natural_outcome_id))

    validRows.forEach((row, idx) => {
      if (seenInFile.has(row.natural_outcome_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Duplicate outcome_id "${row.natural_outcome_id}" within file`,
        })
        return
      }
      seenInFile.add(row.natural_outcome_id)

      if (seenInFile.has(`alum:${row.natural_alumni_id}`)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Duplicate 1:1 outcome for alumni_id "${row.natural_alumni_id}" within file`,
        })
        return
      }
      seenInFile.add(`alum:${row.natural_alumni_id}`)

      if (!validAlumniMap.has(row.natural_alumni_id) && !extraAlumniIds.has(row.natural_alumni_id)) {
        rejected.push({
          rowNumber: idx + 2,
          rawData: row,
          validationError: `Foreign key violation: alumni_id "${row.natural_alumni_id}" does not exist in dwh.dim_alumni`,
        })
        return
      }

      row._alumni_sk = validAlumniMap.get(row.natural_alumni_id) || null
      row._action = existingOutcomeMap.has(row.natural_outcome_id) ? 'update' : 'insert'
      approved.push(row)
    })
  } else {
    // For legacy placement / salary / alumni_profiles
    validRows.forEach((r) => {
      r._action = 'insert'
      approved.push(r)
    })
  }

  return { approved, rejected }
}

/**
 * Step 1: Upload, parse, validate, and stage CSV.
 * Supports preview / dryRun mode without committing to database ledger.
 */
export async function stageCsvUpload({ fileName, csvContent, requestedType = null, dryRun = false, knownParentKeys = null }) {
  const parsedRows = parseCsvString(csvContent)
  if (parsedRows.length < 2) {
    throw new Error('CSV file is empty or contains only a header row.')
  }

  const rawHeaders = parsedRows[0]
  const dataRows = parsedRows.slice(1)

  const match = matchSchema(rawHeaders, requestedType)
  if (!match || !match.isComplete) {
    const missing = match ? match.missingRequired.join(', ') : 'Unrecognized schema'
    throw new Error(`CSV header validation failed. Missing required columns for dataset "${match?.type || requestedType || 'unknown'}": ${missing}`)
  }

  const initialValidRows = []
  const invalidRows = []

  dataRows.forEach((row, idx) => {
    const validation = validateRow(row, match.mapping, match.type, idx + 2)
    if (validation.isValid) {
      initialValidRows.push(validation.cleansed)
    } else {
      invalidRows.push({
        rowNumber: validation.rowNumber,
        rawData: validation.rawData,
        validationError: validation.errors.join('; '),
      })
    }
  })

  // Relational and chronological cross-validation against warehouse
  const { approved: validRows, rejected: relationalRejects } = await validateRelationalIntegrity(initialValidRows, match.type, knownParentKeys)
  invalidRows.push(...relationalRejects)

  const rowsToInsert = validRows.filter((r) => r._action === 'insert').length
  const rowsToUpdate = validRows.filter((r) => r._action === 'update').length
  const rowsToReject = invalidRows.length
  const rowsToSkip = 0

  const validKeys = {
    skillIds: match.type === 'skills' ? validRows.map((r) => r.natural_skill_id).filter(Boolean) : [],
    alumniIds: match.type === 'alumni' ? validRows.map((r) => r.natural_alumni_id).filter(Boolean) : [],
    jobs: match.type === 'jobs' ? validRows.map((r) => ({ job_id: r.natural_job_id, posted_date: r.posted_date })).filter(Boolean) : [],
  }

  if (dryRun) {
    return {
      batchId: null,
      datasetType: match.type,
      fileName,
      status: 'DRY_RUN_PREVIEW',
      dryRun: true,
      rowsTotal: dataRows.length,
      rowsValid: validRows.length,
      rowsInvalid: invalidRows.length,
      rowsToInsert,
      rowsToUpdate,
      rowsToReject,
      rowsToSkip,
      validKeys,
      detectedHeaders: rawHeaders,
      mappedColumns: Object.fromEntries(
        Object.entries(match.mapping).map(([k, v]) => [k, v.originalHeader])
      ),
      preview: validRows.slice(0, 5),
      sampleErrors: invalidRows.slice(0, 5),
    }
  }

  // Create staged batch ledger in dwh.etl_batches
  const batchRes = await query(`
    INSERT INTO dwh.etl_batches (
      batch_type, file_name, status, rows_total, rows_inserted, rows_rejected,
      staged_data, started_at
    )
    VALUES ($1, $2, 'staged', $3, 0, $4, $5, NOW())
    RETURNING id;
  `, [
    `csv_${match.type}`,
    fileName,
    dataRows.length,
    invalidRows.length,
    JSON.stringify(validRows),
  ])

  const batchId = batchRes.rows[0].id

  // Record invalid rows in dwh.etl_batch_errors
  for (const err of invalidRows.slice(0, 100)) {
    await query(`
      INSERT INTO dwh.etl_batch_errors (batch_id, row_number, raw_data, validation_error)
      VALUES ($1, $2, $3, $4);
    `, [batchId, err.rowNumber, JSON.stringify(err.rawData), err.validationError])
  }

  return {
    batchId,
    datasetType: match.type,
    fileName,
    status: 'STAGED',
    dryRun: false,
    rowsTotal: dataRows.length,
    rowsValid: validRows.length,
    rowsInvalid: invalidRows.length,
    rowsToInsert,
    rowsToUpdate,
    rowsToReject,
    rowsToSkip,
    validKeys,
    detectedHeaders: rawHeaders,
    mappedColumns: Object.fromEntries(
      Object.entries(match.mapping).map(([k, v]) => [k, v.originalHeader])
    ),
    preview: validRows.slice(0, 5),
    sampleErrors: invalidRows.slice(0, 5),
  }
}

/**
 * Step 2: Confirm and atomically commit staged batch into warehouse tables.
 */
export async function confirmBatchImport(batchId) {
  logger.info(`Executing confirmed warehouse import for batch ${batchId}...`)

  return withTransaction(async (client) => {
    // 1. Fetch staged batch with row lock
    const { rows: batchRows } = await client.query(`
      SELECT id, batch_type, file_name, status, staged_data, rows_total, rows_rejected
      FROM dwh.etl_batches
      WHERE id = $1
      FOR UPDATE;
    `, [batchId])

    if (batchRows.length === 0) {
      throw new Error(`ETL Batch ${batchId} not found`)
    }

    const batch = batchRows[0]
    if (batch.status === 'completed') {
      throw new Error(`Batch ${batchId} has already been imported and completed. Repeat import prevented.`)
    }

    if (batch.status !== 'staged') {
      throw new Error(`Batch ${batchId} is in status "${batch.status}" and cannot be imported.`)
    }

    const stagedRows = typeof batch.staged_data === 'string'
      ? JSON.parse(batch.staged_data)
      : (batch.staged_data || [])

    let insertedCount = 0

    if (batch.batch_type === 'csv_skills') {
      for (const row of stagedRows) {
        const source = row.data_source || (row.natural_skill_id ? 'indian_academic_benchmark' : 'csv_import')
        await client.query(`
          INSERT INTO dwh.dim_skill (skill_name, category, natural_skill_id, record_source)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (skill_name) DO UPDATE SET 
            category = EXCLUDED.category,
            natural_skill_id = COALESCE(dwh.dim_skill.natural_skill_id, EXCLUDED.natural_skill_id),
            record_source = CASE 
              WHEN dwh.dim_skill.record_source = 'operational' THEN 'operational'
              ELSE EXCLUDED.record_source
            END;
        `, [row.skill_name, row.category, row.natural_skill_id || null, source])
        insertedCount++
      }
    } else if (batch.batch_type === 'csv_alumni') {
      for (const row of stagedRows) {
        const source = row.data_source || 'indian_academic_benchmark'
        const cityMatch = row.location_region ? row.location_region.split(' (')[0].trim() : 'Remote'

        await client.query(`
          INSERT INTO dwh.dim_alumni (
            natural_alumni_id, graduation_year, department, current_company,
            job_role, industry, experience_years, city, country,
            degree, career_level, record_source, created_at
          )
          VALUES ($1, $2, $3, 'Independent / Startup Venture', $4, $5, $6, $7, 'India', $8, $9, $10, NOW())
          ON CONFLICT (natural_alumni_id) WHERE natural_alumni_id IS NOT NULL
          DO UPDATE SET
            graduation_year = EXCLUDED.graduation_year,
            department = EXCLUDED.department,
            job_role = EXCLUDED.job_role,
            industry = EXCLUDED.industry,
            experience_years = EXCLUDED.experience_years,
            city = EXCLUDED.city,
            degree = EXCLUDED.degree,
            career_level = EXCLUDED.career_level,
            record_source = EXCLUDED.record_source;
        `, [
          row.natural_alumni_id,
          row.graduation_year,
          row.department,
          row.job_role,
          row.industry,
          row.experience_years,
          cityMatch,
          row.degree,
          row.career_level,
          source,
        ])
        insertedCount++
      }
    } else if (batch.batch_type === 'csv_jobs') {
      for (const row of stagedRows) {
        const source = row.data_source || 'indian_academic_benchmark'

        // A. Upsert company
        const compRes = await client.query(`
          INSERT INTO dwh.dim_company (company_name, industry, headquarters_location, natural_company_id, record_source)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (company_name) DO UPDATE SET
            industry = EXCLUDED.industry,
            natural_company_id = COALESCE(dwh.dim_company.natural_company_id, EXCLUDED.natural_company_id),
            record_source = EXCLUDED.record_source
          RETURNING company_sk;
        `, [row.company_name, row.industry, row.location_region, row.natural_company_id || null, source])
        const companySk = compRes.rows[0].company_sk

        // B. Resolve posted_date_sk in dim_date
        const dateNum = parseInt(String(row.posted_date).replace(/-/g, ''), 10) || 20250101

        // C. Upsert dim_job
        await client.query(`
          INSERT INTO dwh.dim_job (
            natural_job_id, company_sk, company_name, job_title, industry,
            location_region, employment_type, posted_date, posted_date_sk,
            experience_level, record_source, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
          ON CONFLICT (natural_job_id) DO UPDATE SET
            company_sk = EXCLUDED.company_sk,
            job_title = EXCLUDED.job_title,
            industry = EXCLUDED.industry,
            location_region = EXCLUDED.location_region,
            employment_type = EXCLUDED.employment_type,
            posted_date = EXCLUDED.posted_date,
            posted_date_sk = EXCLUDED.posted_date_sk,
            experience_level = EXCLUDED.experience_level,
            record_source = EXCLUDED.record_source;
        `, [
          row.natural_job_id,
          companySk,
          row.company_name,
          row.job_title,
          row.industry,
          row.location_region,
          row.employment_type,
          row.posted_date,
          dateNum,
          row.experience_level,
          source,
        ])
        insertedCount++
      }
    } else if (batch.batch_type === 'csv_alumni_skills') {
      for (const row of stagedRows) {
        const source = row.data_source || 'indian_academic_benchmark'
        const alumniSk = row._alumni_sk || (await client.query(`SELECT alumni_sk FROM dwh.dim_alumni WHERE natural_alumni_id = $1 LIMIT 1;`, [row.natural_alumni_id])).rows[0]?.alumni_sk
        const skillSk = row._skill_sk || (await client.query(`SELECT skill_sk FROM dwh.dim_skill WHERE natural_skill_id = $1 LIMIT 1;`, [row.natural_skill_id])).rows[0]?.skill_sk

        if (alumniSk && skillSk) {
          await client.query(`
            INSERT INTO dwh.bridge_alumni_skill (alumni_sk, skill_sk, proficiency_level, years_used, record_source, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (alumni_sk, skill_sk) DO UPDATE SET
              proficiency_level = EXCLUDED.proficiency_level,
              years_used = EXCLUDED.years_used,
              record_source = EXCLUDED.record_source;
          `, [alumniSk, skillSk, row.proficiency_level, row.years_used, source])
          insertedCount++
        }
      }
    } else if (batch.batch_type === 'csv_job_skills') {
      for (const row of stagedRows) {
        const source = row.data_source || 'indian_academic_benchmark'
        const jobSk = row._job_sk || (await client.query(`SELECT job_sk FROM dwh.dim_job WHERE natural_job_id = $1 LIMIT 1;`, [row.natural_job_id])).rows[0]?.job_sk
        const skillSk = row._skill_sk || (await client.query(`SELECT skill_sk FROM dwh.dim_skill WHERE natural_skill_id = $1 LIMIT 1;`, [row.natural_skill_id])).rows[0]?.skill_sk

        if (jobSk && skillSk) {
          await client.query(`
            INSERT INTO dwh.bridge_job_skill (job_sk, skill_sk, required_level, record_source, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (job_sk, skill_sk) DO UPDATE SET
              required_level = EXCLUDED.required_level,
              record_source = EXCLUDED.record_source;
          `, [jobSk, skillSk, row.required_level, source])
          insertedCount++
        }
      }
    } else if (batch.batch_type === 'csv_applications') {
      for (const row of stagedRows) {
        const source = row.data_source || 'indian_academic_benchmark'
        const alumniSk = row._alumni_sk || (await client.query(`SELECT alumni_sk FROM dwh.dim_alumni WHERE natural_alumni_id = $1 LIMIT 1;`, [row.natural_alumni_id])).rows[0]?.alumni_sk
        const jobInfo = (row._job_sk && row._company_sk)
          ? { job_sk: row._job_sk, company_sk: row._company_sk }
          : (await client.query(`SELECT job_sk, company_sk FROM dwh.dim_job WHERE natural_job_id = $1 LIMIT 1;`, [row.natural_job_id])).rows[0]

        if (alumniSk && jobInfo) {
          const appliedDateSk = parseInt(String(row.application_date).replace(/-/g, ''), 10) || 20250101
          const isShortlisted = ['shortlisted', 'interviewed', 'offered', 'hired'].includes(row.application_status) ? 1 : 0
          const isSelected = ['offered', 'hired'].includes(row.application_status) ? 1 : 0

          await client.query(`
            INSERT INTO dwh.fact_job_application (
              natural_application_id, alumni_sk, job_sk, company_sk,
              applied_date_sk, days_to_decision, is_shortlisted, is_selected,
              application_status, record_source, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            ON CONFLICT (natural_application_id) WHERE natural_application_id IS NOT NULL
            DO UPDATE SET
              application_status = EXCLUDED.application_status,
              days_to_decision = EXCLUDED.days_to_decision,
              is_shortlisted = EXCLUDED.is_shortlisted,
              is_selected = EXCLUDED.is_selected,
              record_source = EXCLUDED.record_source;
          `, [
            row.natural_application_id,
            alumniSk,
            jobInfo.job_sk,
            jobInfo.company_sk,
            appliedDateSk,
            row.days_to_decision,
            isShortlisted,
            isSelected,
            row.application_status,
            source,
          ])
          insertedCount++
        }
      }
    } else if (batch.batch_type === 'csv_career_outcomes') {
      for (const row of stagedRows) {
        const source = row.data_source || 'indian_academic_benchmark'
        const alumniSk = row._alumni_sk || (await client.query(`SELECT alumni_sk FROM dwh.dim_alumni WHERE natural_alumni_id = $1 LIMIT 1;`, [row.natural_alumni_id])).rows[0]?.alumni_sk

        if (alumniSk) {
          await client.query(`
            INSERT INTO dwh.fact_career_outcomes (
              natural_outcome_id, alumni_sk, observation_period_months,
              employed_within_6_months, career_level, industry,
              experience_years_at_observation, record_source,
              is_synthetic_educational_target, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, NOW())
            ON CONFLICT (alumni_sk) DO UPDATE SET
              natural_outcome_id = EXCLUDED.natural_outcome_id,
              employed_within_6_months = EXCLUDED.employed_within_6_months,
              career_level = EXCLUDED.career_level,
              industry = EXCLUDED.industry,
              experience_years_at_observation = EXCLUDED.experience_years_at_observation,
              record_source = EXCLUDED.record_source;
          `, [
            row.natural_outcome_id,
            alumniSk,
            row.observation_period_months,
            row.employed_within_6_months,
            row.career_level,
            row.industry,
            row.experience_years_at_observation,
            source,
          ])
          insertedCount++
        }
      }
    } else if (batch.batch_type === 'csv_placements') {
      for (const row of stagedRows) {
        const compRes = await client.query(`
          INSERT INTO dwh.dim_company (company_name, industry, company_tier)
          VALUES ($1, 'Technology', 'Core Engineering')
          ON CONFLICT (company_name) DO UPDATE SET company_name = EXCLUDED.company_name
          RETURNING company_sk;
        `, [row.company])
        const companySk = compRes.rows[0].company_sk

        const studentRes = await client.query(`
          INSERT INTO dwh.dim_student (
            student_id_number, department, degree, admission_year, graduation_year,
            cgpa, placement_status, record_source, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, 'Placed', 'csv_import', NOW(), NOW())
          RETURNING student_sk;
        `, [
          row.student_id,
          row.department,
          row.degree,
          row.graduation_year - 4,
          row.graduation_year,
          row.cgpa,
        ])
        const studentSk = studentRes.rows[0].student_sk

        const dateStr = String(row.offer_date).replace(/[^0-9]/g, '')
        const offerDateSk = dateStr.length >= 8 ? Number(dateStr.slice(0, 8)) : Number(`${row.graduation_year}0501`)

        await client.query(`
          INSERT INTO dwh.fact_placement (
            student_sk, company_sk, offer_date_sk, annual_package_lpa,
            base_salary_inr, offers_count, readiness_score, is_on_campus, record_source, created_at
          )
          VALUES ($1, $2, $3, $4, $5, 1, $6, TRUE, 'csv_import', NOW())
          ON CONFLICT (student_sk, company_sk, offer_date_sk) DO NOTHING;
        `, [
          studentSk,
          companySk,
          offerDateSk,
          row.package_lpa,
          Math.round(row.package_lpa * 80000),
          Math.round(row.cgpa * 10),
        ])
        insertedCount++
      }
    } else if (batch.batch_type === 'csv_alumni_salaries') {
      for (const row of stagedRows) {
        const compRes = await client.query(`
          INSERT INTO dwh.dim_company (company_name, industry)
          VALUES ($1, $2)
          ON CONFLICT (company_name) DO UPDATE SET industry = EXCLUDED.industry
          RETURNING company_sk;
        `, [row.company, row.industry])
        const companySk = compRes.rows[0].company_sk

        const dateStr = String(row.effective_date).replace(/[^0-9]/g, '')
        const effDateSk = dateStr.length >= 8 ? Number(dateStr.slice(0, 8)) : 20250101
        const tier = row.salary_inr >= 2000000 ? '> 20 LPA' : row.salary_inr >= 1200000 ? '12-20 LPA' : '6-12 LPA'

        await client.query(`
          INSERT INTO dwh.fact_salary_benchmark (
            company_sk, effective_date_sk, experience_years,
            total_annual_comp_inr, salary_band_tier, record_source, created_at
          )
          VALUES ($1, $2, $3, $4, $5, 'csv_import', NOW());
        `, [companySk, effDateSk, row.experience_years, row.salary_inr, tier])
        insertedCount++
      }
    } else if (batch.batch_type === 'csv_alumni_profiles') {
      for (const row of stagedRows) {
        await client.query(`
          INSERT INTO dwh.dim_alumni (
            graduation_year, department, current_company, job_role, industry,
            experience_years, city, country, is_mentor, record_source, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'csv_import', NOW());
        `, [
          row.graduation_year,
          row.department,
          row.current_company,
          row.job_role,
          row.industry,
          row.experience_years,
          row.city,
          row.country,
          row.is_mentor,
        ])
        insertedCount++
      }
    }

    // Update batch status to completed (preserving staged_data for surgical rollback and audit)
    await client.query(`
      UPDATE dwh.etl_batches
      SET status = 'completed',
          rows_inserted = $1,
          completed_at = NOW()
      WHERE id = $2;
    `, [insertedCount, batchId])

    logger.info(`Batch ${batchId} imported successfully. Inserted ${insertedCount} rows.`)

    return {
      batchId,
      status: 'COMPLETED',
      rowsInserted: insertedCount,
      completedAt: new Date().toISOString(),
    }
  })
}

/**
 * Step 3: Transactional Rollback of a previously imported batch.
 */
export async function rollbackBatchImport(batchId) {
  logger.info(`Executing rollback for batch ${batchId}...`)

  return withTransaction(async (client) => {
    const { rows: batchRows } = await client.query(`
      SELECT id, batch_type, status, staged_data, rows_inserted
      FROM dwh.etl_batches
      WHERE id = $1
      FOR UPDATE;
    `, [batchId])

    if (batchRows.length === 0) {
      throw new Error(`ETL Batch ${batchId} not found`)
    }

    const batch = batchRows[0]
    if (batch.status === 'rolled_back') {
      throw new Error(`Batch ${batchId} is already rolled back.`)
    }

    const stagedRows = typeof batch.staged_data === 'string'
      ? JSON.parse(batch.staged_data)
      : (batch.staged_data || [])

    let deletedCount = 0

    if (batch.batch_type === 'csv_career_outcomes') {
      const outcomeIds = stagedRows.map((r) => r.natural_outcome_id).filter(Boolean)
      if (outcomeIds.length > 0) {
        const res = await client.query(`DELETE FROM dwh.fact_career_outcomes WHERE natural_outcome_id = ANY($1);`, [outcomeIds])
        deletedCount = res.rowCount
      }
    } else if (batch.batch_type === 'csv_applications') {
      const appIds = stagedRows.map((r) => r.natural_application_id).filter(Boolean)
      if (appIds.length > 0) {
        const res = await client.query(`DELETE FROM dwh.fact_job_application WHERE natural_application_id = ANY($1);`, [appIds])
        deletedCount = res.rowCount
      }
    } else if (batch.batch_type === 'csv_job_skills') {
      for (const r of stagedRows) {
        const res = await client.query(`
          DELETE FROM dwh.bridge_job_skill
          WHERE job_sk = (SELECT job_sk FROM dwh.dim_job WHERE natural_job_id = $1 LIMIT 1)
            AND skill_sk = (SELECT skill_sk FROM dwh.dim_skill WHERE natural_skill_id = $2 LIMIT 1);
        `, [r.natural_job_id, r.natural_skill_id])
        deletedCount += res.rowCount
      }
    } else if (batch.batch_type === 'csv_alumni_skills') {
      for (const r of stagedRows) {
        const res = await client.query(`
          DELETE FROM dwh.bridge_alumni_skill
          WHERE alumni_sk = (SELECT alumni_sk FROM dwh.dim_alumni WHERE natural_alumni_id = $1 LIMIT 1)
            AND skill_sk = (SELECT skill_sk FROM dwh.dim_skill WHERE natural_skill_id = $2 LIMIT 1);
        `, [r.natural_alumni_id, r.natural_skill_id])
        deletedCount += res.rowCount
      }
    } else if (batch.batch_type === 'csv_jobs') {
      const jobIds = stagedRows.map((r) => r.natural_job_id).filter(Boolean)
      if (jobIds.length > 0) {
        const res = await client.query(`DELETE FROM dwh.dim_job WHERE natural_job_id = ANY($1);`, [jobIds])
        deletedCount = res.rowCount
      }
    } else if (batch.batch_type === 'csv_alumni') {
      const alumniIds = stagedRows.map((r) => r.natural_alumni_id).filter(Boolean)
      if (alumniIds.length > 0) {
        const res = await client.query(`DELETE FROM dwh.dim_alumni WHERE natural_alumni_id = ANY($1);`, [alumniIds])
        deletedCount = res.rowCount
      }
    } else if (batch.batch_type === 'csv_skills') {
      const skillIds = stagedRows.map((r) => r.natural_skill_id).filter(Boolean)
      const skillNames = stagedRows.map((r) => r.skill_name).filter(Boolean)
      if (skillIds.length > 0 || skillNames.length > 0) {
        const res = await client.query(`DELETE FROM dwh.dim_skill WHERE natural_skill_id = ANY($1) OR (natural_skill_id IS NULL AND skill_name = ANY($2));`, [skillIds, skillNames])
        deletedCount = res.rowCount
      }
    }

    await client.query(`
      UPDATE dwh.etl_batches
      SET status = 'rolled_back',
          rows_inserted = 0,
          completed_at = NOW()
      WHERE id = $1;
    `, [batchId])

    return {
      batchId,
      status: 'ROLLED_BACK',
      rowsRemoved: deletedCount,
      completedAt: new Date().toISOString(),
    }
  })
}

export default {
  DATASET_SCHEMAS,
  normalizeDatasetType,
  parseCsvString,
  matchSchema,
  stageCsvUpload,
  confirmBatchImport,
  rollbackBatchImport,
}
