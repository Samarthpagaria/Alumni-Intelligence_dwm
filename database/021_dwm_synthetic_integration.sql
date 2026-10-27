-- 021_dwm_synthetic_integration.sql
-- Integrates synthetic DWM datasets into the analytical warehouse schema
-- Preserves existing operational tables, indexes, and records

CREATE SCHEMA IF NOT EXISTS dwh;

-- 1. Skill Natural Key and Provenance
ALTER TABLE dwh.dim_skill ADD COLUMN IF NOT EXISTS natural_skill_id VARCHAR(50);
ALTER TABLE dwh.dim_skill ADD COLUMN IF NOT EXISTS record_source VARCHAR(50) DEFAULT 'operational';
CREATE UNIQUE INDEX IF NOT EXISTS uq_dwh_dim_skill_natural ON dwh.dim_skill (natural_skill_id) WHERE natural_skill_id IS NOT NULL;

-- 2. Alumni Natural Key, Degree, Career Level
ALTER TABLE dwh.dim_alumni ADD COLUMN IF NOT EXISTS natural_alumni_id VARCHAR(50);
ALTER TABLE dwh.dim_alumni ADD COLUMN IF NOT EXISTS degree VARCHAR(100);
ALTER TABLE dwh.dim_alumni ADD COLUMN IF NOT EXISTS career_level VARCHAR(50);
CREATE UNIQUE INDEX IF NOT EXISTS uq_dwh_dim_alumni_natural ON dwh.dim_alumni (natural_alumni_id) WHERE natural_alumni_id IS NOT NULL;

-- 3. Company Natural Key and Provenance
ALTER TABLE dwh.dim_company ADD COLUMN IF NOT EXISTS natural_company_id VARCHAR(50);
ALTER TABLE dwh.dim_company ADD COLUMN IF NOT EXISTS record_source VARCHAR(50) DEFAULT 'operational';
CREATE UNIQUE INDEX IF NOT EXISTS uq_dwh_dim_company_natural ON dwh.dim_company (natural_company_id) WHERE natural_company_id IS NOT NULL;

-- 4. Job Requisitions Dimension (dim_job)
CREATE TABLE IF NOT EXISTS dwh.dim_job (
    job_sk SERIAL PRIMARY KEY,
    natural_job_id VARCHAR(50) UNIQUE,
    company_sk INT REFERENCES dwh.dim_company (company_sk) ON DELETE SET NULL,
    company_name VARCHAR(150),
    job_title VARCHAR(150) NOT NULL,
    industry VARCHAR(100),
    location_region VARCHAR(150),
    employment_type VARCHAR(50) DEFAULT 'Full-Time',
    posted_date DATE,
    posted_date_sk INT REFERENCES dwh.dim_date (date_sk),
    experience_level VARCHAR(50),
    record_source VARCHAR(50) DEFAULT 'indian_academic_benchmark',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dwh_dim_job_comp ON dwh.dim_job (company_sk);
CREATE INDEX IF NOT EXISTS idx_dwh_dim_job_title ON dwh.dim_job (job_title);
CREATE INDEX IF NOT EXISTS idx_dwh_dim_job_source ON dwh.dim_job (record_source);

-- 5. Bridge: Alumni to Skill (bridge_alumni_skill)
CREATE TABLE IF NOT EXISTS dwh.bridge_alumni_skill (
    alumni_sk INT NOT NULL REFERENCES dwh.dim_alumni (alumni_sk) ON DELETE CASCADE,
    skill_sk INT NOT NULL REFERENCES dwh.dim_skill (skill_sk) ON DELETE CASCADE,
    proficiency_level VARCHAR(30) DEFAULT 'Intermediate',
    years_used INT DEFAULT 1,
    record_source VARCHAR(50) DEFAULT 'indian_academic_benchmark',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (alumni_sk, skill_sk)
);

CREATE INDEX IF NOT EXISTS idx_dwh_bridge_alum_skill ON dwh.bridge_alumni_skill (skill_sk);

-- 6. Bridge: Job to Skill (bridge_job_skill)
CREATE TABLE IF NOT EXISTS dwh.bridge_job_skill (
    job_sk INT NOT NULL REFERENCES dwh.dim_job (job_sk) ON DELETE CASCADE,
    skill_sk INT NOT NULL REFERENCES dwh.dim_skill (skill_sk) ON DELETE CASCADE,
    required_level VARCHAR(30) DEFAULT 'Preferred',
    record_source VARCHAR(50) DEFAULT 'indian_academic_benchmark',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (job_sk, skill_sk)
);

CREATE INDEX IF NOT EXISTS idx_dwh_bridge_job_skill ON dwh.bridge_job_skill (skill_sk);

-- 7. Fact Table Enhancements for Job Applications
ALTER TABLE dwh.fact_job_application ALTER COLUMN student_sk DROP NOT NULL;
ALTER TABLE dwh.fact_job_application ADD COLUMN IF NOT EXISTS alumni_sk INT REFERENCES dwh.dim_alumni (alumni_sk) ON DELETE CASCADE;
ALTER TABLE dwh.fact_job_application ADD COLUMN IF NOT EXISTS job_sk INT REFERENCES dwh.dim_job (job_sk) ON DELETE SET NULL;
ALTER TABLE dwh.fact_job_application ADD COLUMN IF NOT EXISTS natural_application_id VARCHAR(50);
ALTER TABLE dwh.fact_job_application ADD COLUMN IF NOT EXISTS application_status VARCHAR(30);

CREATE UNIQUE INDEX IF NOT EXISTS uq_dwh_fact_app_natural ON dwh.fact_job_application (natural_application_id) WHERE natural_application_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_dwh_fact_app_alumni_grain ON dwh.fact_job_application (alumni_sk, job_sk, applied_date_sk) WHERE alumni_sk IS NOT NULL AND job_sk IS NOT NULL;

-- 8. Fact Table: Educational Career Outcomes Target (1:1 with alumni)
CREATE TABLE IF NOT EXISTS dwh.fact_career_outcomes (
    outcome_id SERIAL PRIMARY KEY,
    natural_outcome_id VARCHAR(50) UNIQUE,
    alumni_sk INT NOT NULL REFERENCES dwh.dim_alumni (alumni_sk) ON DELETE CASCADE,
    observation_period_months INT DEFAULT 6,
    employed_within_6_months INT NOT NULL CHECK (employed_within_6_months IN (0, 1)),
    career_level VARCHAR(50),
    industry VARCHAR(100),
    experience_years_at_observation NUMERIC(4,1) DEFAULT 0.0,
    record_source VARCHAR(50) DEFAULT 'indian_academic_benchmark',
    is_synthetic_educational_target BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_dwh_fact_career_outcomes_alumni ON dwh.fact_career_outcomes (alumni_sk);
CREATE INDEX IF NOT EXISTS idx_dwh_fact_outcomes_source ON dwh.fact_career_outcomes (record_source);
