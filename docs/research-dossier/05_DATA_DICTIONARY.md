# Document 05: Comprehensive Data Dictionary & Warehouse Field Catalog

**Subsystem**: Standalone Data Warehousing and Data Mining (DWM) Analytical Intelligence Platform  
**Document**: [`05_DATA_DICTIONARY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/05_DATA_DICTIONARY.md)  
**Schema Scope**: Dedicated Dimensional Warehouse Schema (`dwh.*`) & Ingestion Interfaces  
**Status**: Verified against SQL Schemas & Database Information Schema  

---

## 1. Dimension Tables

### 1.1 `dwh.dim_student` (323 rows)
*Grain: One row per registered student candidate.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description & Value Domain |
| :--- | :--- | :---: | :--- | :--- |
| `student_sk` | `SERIAL (INT)` | No | **Primary Key** | Surrogate key uniquely identifying student dimension record. |
| `source_user_id` | `UUID` | Yes | Foreign Key | Historical identifier linking to originating registration record if present. |
| `student_id_number` | `VARCHAR(50)` | Yes | Natural Key | Institution roll/matriculation number (e.g., `STU-2022-001`, `STU-CS-042`). |
| `department` | `VARCHAR(100)`| No | Default `'Computer Engineering'` | Academic branch (Computer Engineering, IT, AI & Data Science, Electronics). |
| `degree` | `VARCHAR(50)` | No | Default `'B.Tech'` | Degree program (`B.Tech`, `M.Tech`, `MCA`). |
| `admission_year` | `INT` | Yes | Range $[2016, 2024]$ | Year of student matriculation. |
| `graduation_year` | `INT` | Yes | Range $[2018, 2026]$ | Conferred or expected cohort graduation year. |
| `cgpa` | `NUMERIC(4,2)`| Yes | Range $[0.00, 10.00]$ | Cumulative Grade Point Average on standard 10-point scale. |
| `tenth_percentage` | `NUMERIC(5,2)`| Yes | Range $[40.00, 100.00]$| Standard 10th-grade board examination percentage. |
| `twelfth_percentage`| `NUMERIC(5,2)`| Yes | Range $[40.00, 100.00]$| Standard 12th-grade or diploma board percentage. |
| `internships_count`| `INT` | No | Default `0` | Number of completed industrial internships. |
| `backlogs_count` | `INT` | No | Default `0` | Active academic backlog count during recruitment drive. |
| `placement_status` | `VARCHAR(30)` | No | Default `'Not Placed'` | Current candidate status (`'Placed'`, `'Not Placed'`, `'Higher Studies'`). |
| `record_source` | `VARCHAR(50)` | No | Default `'operational'`| Provenance lineage (`'operational'`, `'benchmark'`, `'csv_import'`). |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Timestamp of dimensional record creation. |
| `updated_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Timestamp of most recent attribute update. |

---

### 1.2 `dwh.dim_alumni` (2,026 rows)
*Grain: One row per engineering graduate alumnus.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description & Value Domain |
| :--- | :--- | :---: | :--- | :--- |
| `alumni_sk` | `SERIAL (INT)` | No | **Primary Key** | Surrogate dimensional primary key. |
| `natural_alumni_id` | `VARCHAR(50)` | Yes | **Unique Index** | Synthetic/natural identifier (e.g., `ALU-0001`, `IND-ALUM-001`). |
| `source_user_id` | `UUID` | Yes | Unique Index | Legacy operational user UUID if mapped from historical migration. |
| `graduation_year` | `INT` | Yes | Range $[2018, 2024]$ | Year alumnus graduated from university. |
| `department` | `VARCHAR(100)`| Yes | Standardized | Field of study (Computer Science, Information Technology, AI/Data Science). |
| `degree` | `VARCHAR(100)`| Yes | Standardized | Degree qualification conferred (`B.Tech CSE`, `M.Tech AI`, `MCA`). |
| `current_company` | `VARCHAR(150)`| Yes | Free text | Current corporate employer name. |
| `job_role` | `VARCHAR(150)`| Yes | Standardized | Current job title (e.g., `Frontend Engineer`, `ML Ops Engineer`, `DevOps`). |
| `industry` | `VARCHAR(100)`| Yes | Categorical | Sector (`SaaS`, `FinTech`, `Cybersecurity`, `Healthcare Tech`, `Consulting`). |
| `career_level` | `VARCHAR(50)` | Yes | Categorical | Seniority rank (`Entry-Level`, `Mid-Level`, `Senior`, `Lead / Architect`). |
| `experience_years` | `NUMERIC(4,1)`| Yes | Range $[0.0, 40.0]$ | Total accumulated professional working experience. |
| `location_region` | `VARCHAR(150)`| Yes | Categorical | Metro region (Bengaluru, Mumbai, Pune, Hyderabad, Delhi NCR, International). |
| `city` | `VARCHAR(100)`| Yes | City name | City of primary employment residence. |
| `country` | `VARCHAR(100)`| Yes | Default `'India'` | Country of current employment. |
| `is_mentor` | `BOOLEAN` | No | Default `FALSE` | Willingness to mentor current undergraduates. |
| `is_donor` | `BOOLEAN` | No | Default `FALSE` | Financial contributor to endowment funds. |
| `record_source` | `VARCHAR(50)` | No | Default `'operational'`| Origin provenance (`'indian_academic_benchmark'`, `'operational'`). |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Row creation timestamp. |

---

### 1.3 `dwh.dim_company` (42 rows)
*Grain: One row per corporate recruiting entity.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description & Value Domain |
| :--- | :--- | :---: | :--- | :--- |
| `company_sk` | `SERIAL (INT)` | No | **Primary Key** | Surrogate company key. |
| `natural_company_id`| `VARCHAR(50)` | Yes | **Unique Index** | Synthetic/natural identifier (e.g., `IND-COMP-01`). |
| `company_name` | `VARCHAR(150)`| No | **Unique** | Official recruiter name (e.g., Microsoft, Google, AWS, Goldman Sachs, TCS). |
| `industry` | `VARCHAR(100)`| Yes | Domain taxonomy | Technology sector domain. |
| `company_tier` | `VARCHAR(50)` | No | Default `'Core / Mass'`| Recruiter classification: `'Super Dream'` (>18 LPA), `'Dream'` (10-18 LPA), `'Core / Mass'` (<10 LPA). |
| `record_source` | `VARCHAR(50)` | No | Default `'operational'`| Lineage source. |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Timestamp of record creation. |

---

### 1.4 `dwh.dim_skill` (165 rows)
*Grain: One row per technical competency taxonomy entry.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description & Value Domain |
| :--- | :--- | :---: | :--- | :--- |
| `skill_sk` | `SERIAL (INT)` | No | **Primary Key** | Surrogate skill identifier. |
| `natural_skill_id` | `VARCHAR(50)` | Yes | **Unique Index** | Standardized skill key (`SK-001` through `SK-150`). |
| `skill_name` | `VARCHAR(100)`| No | **Unique** | Canonical skill name (e.g., Python, Docker, React, PyTorch). |
| `category` | `VARCHAR(100)`| No | Default `'General'` | Taxonomy grouping (`Programming Languages`, `Cloud & Infrastructure`, `AI/ML`). |
| `record_source` | `VARCHAR(50)` | No | Default `'operational'`| Provenance source. |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Timestamp of insertion. |

---

### 1.5 `dwh.dim_job` (5,002 rows)
*Grain: One row per campus or industry job requisition posting.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description & Value Domain |
| :--- | :--- | :---: | :--- | :--- |
| `job_sk` | `SERIAL (INT)` | No | **Primary Key** | Surrogate job key. |
| `natural_job_id` | `VARCHAR(50)` | Yes | **Unique** | Requisition identifier (`JOB-0001` through `JOB-5000`). |
| `company_sk` | `INT` | Yes | FK -> `dim_company` | Referential link to hiring employer dimension. |
| `company_name` | `VARCHAR(150)`| Yes | Denormalized | Company name cached for OLAP efficiency. |
| `job_title` | `VARCHAR(150)`| No | Job title | Designation (e.g., `Full Stack Engineer`, `DevOps Engineer`, `Data Analyst`). |
| `industry` | `VARCHAR(100)`| Yes | Industry domain | Sector domain of the hiring division. |
| `location_region` | `VARCHAR(150)`| Yes | Region | Primary job location or `'Remote'`. |
| `employment_type` | `VARCHAR(50)` | No | Default `'Full-Time'` | Working arrangement (`Full-Time`, `Contract`, `Internship-to-FTE`). |
| `posted_date` | `DATE` | Yes | Calendar date | Date job posting opened for applications. |
| `posted_date_sk` | `INT` | Yes | FK -> `dim_date` | Foreign key to calendar date dimension. |
| `experience_level` | `VARCHAR(50)` | Yes | Categorical | Experience bracket (`Entry-Level`, `Mid-Level`, `Senior`). |
| `record_source` | `VARCHAR(50)` | No | Default `'synthetic...'`| Provenance lineage. |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Record creation timestamp. |

---

### 1.6 `dwh.dim_date` (4,748 rows)
*Grain: One row per calendar day from 2018-01-01 through 2030-12-31.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description & Value Domain |
| :--- | :--- | :---: | :--- | :--- |
| `date_sk` | `INT` | No | **Primary Key** | Integer key in `YYYYMMDD` format (e.g., `20240315`). |
| `full_date` | `DATE` | No | **Unique** | Standard ISO calendar date (`2024-03-15`). |
| `day_of_week` | `INT` | No | Range $[1, 7]$ | Day index ($1 = \text{Sunday}, 7 = \text{Saturday}$). |
| `day_name` | `VARCHAR(10)` | No | Name | Day name (Sunday, Monday, ...). |
| `day_of_month` | `INT` | No | Range $[1, 31]$ | Day of the month. |
| `day_of_year` | `INT` | No | Range $[1, 366]$ | Day count of the year. |
| `week_of_year` | `INT` | No | Range $[1, 53]$ | ISO calendar week index. |
| `month_actual` | `INT` | No | Range $[1, 12]$ | Calendar month number. |
| `month_name` | `VARCHAR(10)` | No | Name | Month name (January, February, ...). |
| `quarter_actual` | `INT` | No | Range $[1, 4]$ | Calendar quarter ($1 = \text{Q1}, \dots, 4 = \text{Q4}$). |
| `year_actual` | `INT` | No | Range $[2018, 2030]$ | 4-digit calendar year. |
| `is_weekend` | `BOOLEAN` | No | Boolean flag | Indicates Saturday or Sunday. |
| `academic_year` | `VARCHAR(20)` | No | e.g. `'2023-2024'` | Indian academic cycle format (July to June). |
| `academic_semester`| `VARCHAR(20)`| No | e.g. `'Odd'`, `'Even'` | Academic term classification. |

---

## 2. Bridge Tables (Many-to-Many Mappings)

### 2.1 `dwh.bridge_student_skill` (921 rows)
*Grain: Composite junction linking a student candidate to an evaluated skill.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :---: | :--- | :--- |
| `student_sk` | `INT` | No | **Composite PK**, FK -> `dim_student` | Student dimension surrogate key. |
| `skill_sk` | `INT` | No | **Composite PK**, FK -> `dim_skill` | Skill dimension surrogate key. |
| `proficiency_level`| `VARCHAR(30)` | No | Default `'intermediate'` | Proficiency rank (`beginner`, `intermediate`, `expert`). |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Association timestamp. |

---

### 2.2 `dwh.bridge_alumni_skill` (20,013 rows)
*Grain: Composite junction linking an alumnus to an acquired skill.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :---: | :--- | :--- |
| `alumni_sk` | `INT` | No | **Composite PK**, FK -> `dim_alumni` | Alumni dimension surrogate key. |
| `skill_sk` | `INT` | No | **Composite PK**, FK -> `dim_skill` | Skill dimension surrogate key. |
| `proficiency_level`| `VARCHAR(30)` | No | Default `'Intermediate'` | Proficiency level (`Beginner`, `Intermediate`, `Expert`). |
| `years_used` | `INT` | No | Default `1`, Range $[1, 10]$ | Years practicing this skill in professional engineering. |
| `record_source` | `VARCHAR(50)` | No | Lineage tag | Origin tag (`'indian_academic_benchmark'`). |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Record timestamp. |

---

### 2.3 `dwh.bridge_job_skill` (15,008 rows)
*Grain: Composite junction linking a job requisition to a mandatory skill requirement.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :---: | :--- | :--- |
| `job_sk` | `INT` | No | **Composite PK**, FK -> `dim_job` | Job posting dimension surrogate key. |
| `skill_sk` | `INT` | No | **Composite PK**, FK -> `dim_skill` | Skill dimension surrogate key. |
| `required_level` | `VARCHAR(30)` | No | Default `'Intermediate'` | Minimum proficiency required (`Intermediate`, `Expert`). |
| `record_source` | `VARCHAR(50)` | No | Lineage tag | Origin tag (`'indian_academic_benchmark'`). |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Record timestamp. |

---

## 3. Fact Tables

### 3.1 `dwh.fact_placement` (274 rows)
*Grain: One row per accepted campus placement offer.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description & Value Domain |
| :--- | :--- | :---: | :--- | :--- |
| `placement_id` | `SERIAL (INT)` | No | **Primary Key** | Surrogate placement fact transaction key. |
| `student_sk` | `INT` | No | FK -> `dim_student` | Student candidate receiving placement offer. |
| `company_sk` | `INT` | No | FK -> `dim_company` | Hiring employer extending offer. |
| `offer_date_sk` | `INT` | Yes | FK -> `dim_date` | Calendar dimension key of formal offer letter date. |
| `annual_package_lpa`| `NUMERIC(8,2)`| No | Non-negative | Cost to Company (CTC) package in Lakhs Per Annum (INR). Range $[3.5, 45.0]$. |
| `base_salary_inr` | `NUMERIC(12,2)`| Yes | Non-negative | Fixed gross annual compensation component (INR). |
| `bonus_inr` | `NUMERIC(12,2)`| Yes | Non-negative | Joining/retention bonus component (INR). |
| `offers_count` | `INT` | No | Default `1` | Count of simultaneous job offers received by candidate. |
| `aptitude_score` | `NUMERIC(5,2)`| Yes | Range $[0.0, 100.0]$ | Standardized institutional campus aptitude assessment score. |
| `technical_test_score`| `NUMERIC(5,2)`| Yes | Range $[0.0, 100.0]$ | Technical coding screening test score. |
| `interview_score`| `NUMERIC(5,2)`| Yes | Range $[0.0, 100.0]$ | Technical and HR interview panel evaluation score. |
| `readiness_score`| `INT` | No | Default `0` | Automated composite placement readiness index. |
| `is_on_campus` | `BOOLEAN` | No | Default `TRUE` | Distinguishes On-Campus recruitment from Off-Campus offers. |
| `record_source` | `VARCHAR(50)` | No | Lineage tag | Lineage tag (`'benchmark'`, `'csv_import'`). |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Fact insertion timestamp. |

---

### 3.2 `dwh.fact_job_application` (6,006 rows)
*Grain: One row per application submitted by an alumnus candidate to an open job posting.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description & Value Domain |
| :--- | :--- | :---: | :--- | :--- |
| `application_id` | `SERIAL (INT)` | No | **Primary Key** | Surrogate application event key. |
| `natural_application_id`| `VARCHAR(50)`| Yes | Unique Index | Synthetic identifier (`APP-0001` through `APP-6000`). |
| `student_sk` | `INT` | Yes | FK -> `dim_student` | Student candidate key if submitted while enrolled. |
| `alumni_sk` | `INT` | Yes | FK -> `dim_alumni` | Alumnus candidate key if submitted by graduated alumni. |
| `company_sk` | `INT` | Yes | FK -> `dim_company` | Corporate employer offering position. |
| `job_sk` | `INT` | Yes | FK -> `dim_job` | Foreign key referencing job posting dimension. |
| `applied_date_sk`| `INT` | Yes | FK -> `dim_date` | Date application was formally submitted. |
| `application_status`| `VARCHAR(50)` | No | Default `'submitted'` | Status (`'Submitted'`, `'Shortlisted'`, `'Interviewing'`, `'Offered'`). |
| `days_to_decision`| `INT` | Yes | Range $[1, 90]$ | Calendar turnaround duration from submission to final decision. |
| `interview_rounds`| `INT` | No | Default `0` | Total screening rounds completed by candidate. |
| `is_shortlisted` | `BOOLEAN` | No | Default `FALSE` | Boolean filter for recruitment conversion pipelines. |
| `is_offered` | `BOOLEAN` | No | Default `FALSE` | Success indicator. |
| `record_source` | `VARCHAR(50)` | No | Lineage tag | Origin tag (`'indian_academic_benchmark'`). |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Event timestamp. |

---

### 3.3 `dwh.fact_career_outcomes` (2,002 rows)
*Grain: One row per 6-month post-graduation longitudinal observation per alumnus.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description & Value Domain |
| :--- | :--- | :---: | :--- | :--- |
| `outcome_id` | `SERIAL (INT)` | No | **Primary Key** | Surrogate outcome key. |
| `natural_outcome_id`| `VARCHAR(50)`| Yes | Unique Index | Identifier (`OUT-0001` through `OUT-2000`). |
| `alumni_sk` | `INT` | No | FK -> `dim_alumni` | Foreign key to alumnus dimension profile. |
| `observation_period_months`| `INT` | No | Constant `6` | Standardized longitudinal post-graduation observation window. |
| `employed_within_6_months`| `BOOLEAN` | No | Target Variable | **1** if gainfully employed within 6 months of graduation; **0** otherwise. |
| `career_level` | `VARCHAR(50)` | Yes | Standardized | Seniority level achieved at observation milestone. |
| `industry` | `VARCHAR(100)`| Yes | Sector | Industry sector of observed employment. |
| `experience_years_at_observation`| `NUMERIC(4,1)`| Yes | Years | Professional experience accumulated at observation milestone. |
| `record_source` | `VARCHAR(50)` | No | Lineage tag | Origin tag (`'indian_academic_benchmark'`). |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Observation logging timestamp. |

---

### 3.4 `dwh.fact_salary_benchmark` (24 rows)
*Grain: Aggregated historical compensation benchmarks grouped by department, company tier, and experience bracket.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :---: | :--- | :--- |
| `benchmark_id` | `SERIAL (INT)` | No | **Primary Key** | Surrogate benchmark key. |
| `department` | `VARCHAR(100)`| No | Dimension | Academic department. |
| `company_tier` | `VARCHAR(50)` | No | Dimension | Company tier (`Super Dream`, `Dream`, `Core / Mass`). |
| `experience_bracket`| `VARCHAR(50)`| No | Dimension | Career experience bracket (`0-1 Years`, `1-3 Years`, `3-5 Years`). |
| `median_lpa` | `NUMERIC(8,2)`| No | Metric | 50th percentile market compensation package in LPA. |
| `p25_lpa` | `NUMERIC(8,2)`| No | Metric | 25th percentile market compensation package in LPA. |
| `p75_lpa` | `NUMERIC(8,2)`| No | Metric | 75th percentile market compensation package in LPA. |
| `sample_size` | `INT` | No | Metric | Total historical data points contributing to benchmark calculation. |
| `record_source` | `VARCHAR(50)` | No | Lineage tag | Lineage tag (`'benchmark'`). |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Timestamp of computation. |

---

## 4. Audit & Lineage Tables

### 4.1 `dwh.etl_batches` (137 rows)
*Grain: One row per execution of an ingestion batch.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | **Primary Key** | Cryptographically random UUID identifying ingestion run. |
| `batch_type` | `VARCHAR(50)` | No | Standardized | Type (`'placements'`, `'alumni'`, `'skills'`, `'jobs'`, `'benchmark_seed'`). |
| `file_name` | `VARCHAR(255)`| Yes | Filename | Uploaded or seeded CSV file name. |
| `status` | `VARCHAR(50)` | No | Status enum | Batch status (`'processing'`, `'completed'`, `'failed'`, `'rolled_back'`). |
| `rows_total` | `INT` | No | Default `0` | Total physical rows parsed in raw uploaded file. |
| `rows_inserted` | `INT` | No | Default `0` | Total clean rows committed to dimensional tables. |
| `rows_rejected` | `INT` | No | Default `0` | Total malformed or invalid rows rejected during dry-run validation. |
| `started_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Timestamp ingestion commenced. |
| `completed_at` | `TIMESTAMPTZ` | Yes | Timestamp | Timestamp transactional commit finished. |
| `error_summary` | `TEXT` | Yes | Error text | High-level diagnostic summary if batch failed or had partial rejections. |

---

### 4.2 `dwh.etl_batch_errors` (46 rows)
*Grain: One row per rejected record in an ingestion batch.*

| Column Name | SQL Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `SERIAL (INT)` | No | **Primary Key** | Error entry surrogate key. |
| `batch_id` | `UUID` | No | FK -> `etl_batches` | Foreign key referencing failed or partially rejected batch. |
| `row_number` | `INT` | No | Line number | Physical line index of rejected row in original CSV file. |
| `raw_data` | `TEXT` | Yes | Raw string | Exact textual content of rejected CSV line. |
| `validation_error`| `TEXT` | No | Reason | Specific rule violation (e.g., `'annual package LPA must be a positive number'`). |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Timestamp exception was recorded. |
