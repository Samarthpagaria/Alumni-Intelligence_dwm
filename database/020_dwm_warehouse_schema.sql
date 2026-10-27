-- 020_dwm_warehouse_schema.sql
-- Dedicated Analytical Schema for Alumni Intelligence & Career Analytics Platform

CREATE SCHEMA IF NOT EXISTS dwh;

-- 1. Dimension: Student
CREATE TABLE IF NOT EXISTS dwh.dim_student (
    student_sk SERIAL PRIMARY KEY,
    source_user_id UUID,
    student_id_number VARCHAR(50),
    department VARCHAR(100) NOT NULL DEFAULT 'Computer Engineering',
    degree VARCHAR(50) NOT NULL DEFAULT 'B.Tech',
    admission_year INT,
    graduation_year INT,
    cgpa NUMERIC(4,2) DEFAULT 0.0,
    tenth_percentage NUMERIC(5,2),
    twelfth_percentage NUMERIC(5,2),
    internships_count INT DEFAULT 0,
    backlogs_count INT DEFAULT 0,
    placement_status VARCHAR(30) DEFAULT 'Not Placed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dwh_dim_student_dept ON dwh.dim_student (department);
CREATE INDEX IF NOT EXISTS idx_dwh_dim_student_grad ON dwh.dim_student (graduation_year);
CREATE INDEX IF NOT EXISTS idx_dwh_dim_student_src ON dwh.dim_student (source_user_id);

-- 2. Dimension: Alumni
CREATE TABLE IF NOT EXISTS dwh.dim_alumni (
    alumni_sk SERIAL PRIMARY KEY,
    source_user_id UUID,
    graduation_year INT,
    department VARCHAR(100),
    current_company VARCHAR(150),
    job_role VARCHAR(150),
    industry VARCHAR(100),
    experience_years NUMERIC(4,1) DEFAULT 0.0,
    city VARCHAR(100),
    country VARCHAR(100),
    is_mentor BOOLEAN DEFAULT FALSE,
    is_donor BOOLEAN DEFAULT FALSE,
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_to DATE,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dwh_dim_alumni_company ON dwh.dim_alumni (current_company);
CREATE INDEX IF NOT EXISTS idx_dwh_dim_alumni_industry ON dwh.dim_alumni (industry);
CREATE INDEX IF NOT EXISTS idx_dwh_dim_alumni_grad ON dwh.dim_alumni (graduation_year);

-- 3. Dimension: Company
CREATE TABLE IF NOT EXISTS dwh.dim_company (
    company_sk SERIAL PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL UNIQUE,
    industry VARCHAR(100) DEFAULT 'Technology',
    company_tier VARCHAR(50) DEFAULT 'Core Engineering',
    headquarters_location VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dwh_dim_company_tier ON dwh.dim_company (company_tier);

-- 4. Dimension: Skill
CREATE TABLE IF NOT EXISTS dwh.dim_skill (
    skill_sk SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) DEFAULT 'Engineering',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dwh_dim_skill_category ON dwh.dim_skill (category);

-- 5. Dimension: Date (Temporal granularity)
CREATE TABLE IF NOT EXISTS dwh.dim_date (
    date_sk INT PRIMARY KEY,
    full_date DATE NOT NULL UNIQUE,
    year INT NOT NULL,
    quarter INT NOT NULL,
    month INT NOT NULL,
    month_name VARCHAR(20) NOT NULL,
    day_of_month INT NOT NULL,
    day_of_week INT NOT NULL,
    day_name VARCHAR(20) NOT NULL,
    is_weekend BOOLEAN NOT NULL DEFAULT FALSE,
    academic_year VARCHAR(20),
    academic_semester VARCHAR(20)
);

CREATE INDEX IF NOT EXISTS idx_dwh_dim_date_year ON dwh.dim_date (year, month);

-- 6. Bridge: Student to Skill
CREATE TABLE IF NOT EXISTS dwh.bridge_student_skill (
    student_sk INT NOT NULL REFERENCES dwh.dim_student (student_sk) ON DELETE CASCADE,
    skill_sk INT NOT NULL REFERENCES dwh.dim_skill (skill_sk) ON DELETE CASCADE,
    proficiency_level VARCHAR(30) DEFAULT 'intermediate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (student_sk, skill_sk)
);

-- 7. Fact: Placement Outcomes
CREATE TABLE IF NOT EXISTS dwh.fact_placement (
    placement_id SERIAL PRIMARY KEY,
    student_sk INT NOT NULL REFERENCES dwh.dim_student (student_sk) ON DELETE CASCADE,
    company_sk INT NOT NULL REFERENCES dwh.dim_company (company_sk) ON DELETE CASCADE,
    offer_date_sk INT REFERENCES dwh.dim_date (date_sk),
    annual_package_lpa NUMERIC(8,2) NOT NULL DEFAULT 0.0,
    base_salary_inr NUMERIC(12,2) DEFAULT 0.0,
    bonus_inr NUMERIC(12,2) DEFAULT 0.0,
    offers_count INT DEFAULT 1,
    aptitude_score NUMERIC(5,2),
    technical_test_score NUMERIC(5,2),
    interview_score NUMERIC(5,2),
    readiness_score INT DEFAULT 0,
    is_on_campus BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dwh_fact_placement_student ON dwh.fact_placement (student_sk);
CREATE INDEX IF NOT EXISTS idx_dwh_fact_placement_company ON dwh.fact_placement (company_sk);
CREATE INDEX IF NOT EXISTS idx_dwh_fact_placement_date ON dwh.fact_placement (offer_date_sk);
CREATE INDEX IF NOT EXISTS idx_dwh_fact_placement_package ON dwh.fact_placement (annual_package_lpa);

-- 8. Fact: Job Applications
CREATE TABLE IF NOT EXISTS dwh.fact_job_application (
    application_id SERIAL PRIMARY KEY,
    student_sk INT NOT NULL REFERENCES dwh.dim_student (student_sk) ON DELETE CASCADE,
    company_sk INT NOT NULL REFERENCES dwh.dim_company (company_sk) ON DELETE CASCADE,
    applied_date_sk INT REFERENCES dwh.dim_date (date_sk),
    reviewed_date_sk INT REFERENCES dwh.dim_date (date_sk),
    ats_match_score INT DEFAULT 0,
    days_to_decision INT,
    is_shortlisted INT DEFAULT 0,
    is_selected INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dwh_fact_app_student ON dwh.fact_job_application (student_sk);
CREATE INDEX IF NOT EXISTS idx_dwh_fact_app_company ON dwh.fact_job_application (company_sk);

-- 9. Fact: Salary Benchmarks
CREATE TABLE IF NOT EXISTS dwh.fact_salary_benchmark (
    salary_id SERIAL PRIMARY KEY,
    alumni_sk INT REFERENCES dwh.dim_alumni (alumni_sk) ON DELETE SET NULL,
    company_sk INT NOT NULL REFERENCES dwh.dim_company (company_sk) ON DELETE CASCADE,
    effective_date_sk INT REFERENCES dwh.dim_date (date_sk),
    experience_years NUMERIC(4,1) DEFAULT 0.0,
    total_annual_comp_inr NUMERIC(12,2) NOT NULL DEFAULT 0.0,
    salary_band_tier VARCHAR(30) DEFAULT '6-12 LPA',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dwh_fact_salary_comp ON dwh.fact_salary_benchmark (company_sk);
CREATE INDEX IF NOT EXISTS idx_dwh_fact_salary_exp ON dwh.fact_salary_benchmark (experience_years);

-- 10. ETL & Ingestion Ledger
CREATE TABLE IF NOT EXISTS dwh.etl_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_type VARCHAR(50) NOT NULL DEFAULT 'csv_upload',
    file_name VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    rows_total INT DEFAULT 0,
    rows_inserted INT DEFAULT 0,
    rows_rejected INT DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_summary TEXT
);

CREATE TABLE IF NOT EXISTS dwh.etl_batch_errors (
    id BIGSERIAL PRIMARY KEY,
    batch_id UUID NOT NULL REFERENCES dwh.etl_batches (id) ON DELETE CASCADE,
    row_number INT NOT NULL,
    raw_data JSONB,
    validation_error TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dwh_etl_errors_batch ON dwh.etl_batch_errors (batch_id);

-- Ensure provenance column and staged_data exist
ALTER TABLE dwh.dim_student ADD COLUMN IF NOT EXISTS record_source VARCHAR(30) DEFAULT 'operational';
ALTER TABLE dwh.dim_alumni ADD COLUMN IF NOT EXISTS record_source VARCHAR(30) DEFAULT 'operational';
ALTER TABLE dwh.fact_placement ADD COLUMN IF NOT EXISTS record_source VARCHAR(30) DEFAULT 'operational';
ALTER TABLE dwh.fact_job_application ADD COLUMN IF NOT EXISTS record_source VARCHAR(30) DEFAULT 'operational';
ALTER TABLE dwh.fact_salary_benchmark ADD COLUMN IF NOT EXISTS record_source VARCHAR(30) DEFAULT 'operational';
ALTER TABLE dwh.etl_batches ADD COLUMN IF NOT EXISTS staged_data JSONB;

-- Grain and provenance uniqueness constraints
CREATE UNIQUE INDEX IF NOT EXISTS uq_dwh_dim_student_source ON dwh.dim_student (source_user_id) WHERE source_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_dwh_dim_alumni_source ON dwh.dim_alumni (source_user_id) WHERE source_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_dwh_fact_placement_grain ON dwh.fact_placement (student_sk, company_sk, offer_date_sk);
CREATE UNIQUE INDEX IF NOT EXISTS uq_dwh_fact_job_app_grain ON dwh.fact_job_application (student_sk, company_sk, applied_date_sk);

-- Pre-populate calendar dimension for 2018-2030 if not already populated
INSERT INTO dwh.dim_date (
    date_sk, full_date, year, quarter, month, month_name,
    day_of_month, day_of_week, day_name, is_weekend,
    academic_year, academic_semester
)
SELECT 
    TO_CHAR(d, 'YYYYMMDD')::INT as date_sk,
    d::DATE as full_date,
    EXTRACT(YEAR FROM d)::INT as year,
    EXTRACT(QUARTER FROM d)::INT as quarter,
    EXTRACT(MONTH FROM d)::INT as month,
    TRIM(TO_CHAR(d, 'Month')) as month_name,
    EXTRACT(DAY FROM d)::INT as day_of_month,
    EXTRACT(ISODOW FROM d)::INT as day_of_week,
    TRIM(TO_CHAR(d, 'Day')) as day_name,
    CASE WHEN EXTRACT(ISODOW FROM d) IN (6, 7) THEN TRUE ELSE FALSE END as is_weekend,
    CASE 
      WHEN EXTRACT(MONTH FROM d) >= 7 THEN 
        EXTRACT(YEAR FROM d)::TEXT || '-' || (EXTRACT(YEAR FROM d) + 1)::TEXT
      ELSE 
        (EXTRACT(YEAR FROM d) - 1)::TEXT || '-' || EXTRACT(YEAR FROM d)::TEXT
    END as academic_year,
    CASE 
      WHEN EXTRACT(MONTH FROM d) BETWEEN 7 AND 12 THEN 'Odd / Fall'
      ELSE 'Even / Spring'
    END as academic_semester
FROM generate_series('2018-01-01'::DATE, '2030-12-31'::DATE, '1 day'::INTERVAL) d
ON CONFLICT (date_sk) DO NOTHING;
