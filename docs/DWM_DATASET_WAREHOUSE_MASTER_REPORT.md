# Data Warehousing & Data Mining (DWM) — Complete Warehouse, Schema & Datasets Master Report

> **Project Subsystem**: Dedicated Analytical Data Warehouse & Machine Learning Intelligence Platform  
> **Schema Namespace**: `dwh.*` (Completely isolated from operational `public.*` tables)  
> **Database Engine**: PostgreSQL 16 / PGlite (WASM Wire Protocol, Port 54329)  
> **Total Warehouse Records**: **56,772 Rows** across **15 Tables** (157 Columns, 22 Foreign Keys)  
> **Benchmark Inventory**: **7 CSV Datasets** totaling **50,150 Records**  
> **Document Location**: `DWM-project/docs/DWM_DATASET_WAREHOUSE_MASTER_REPORT.md`

---

## 1. Executive Summary & System Architecture

The **DWM Analytical Platform** is a decoupled, enterprise-grade Decision Support System (DSS) designed for academic placement forecasting, career progression tracking, multidimensional OLAP cubes, and machine learning (K-Means Clustering, Apriori Association Rules, and Supervised Classification).

Unlike standard transactional applications (OLTP) that store normalized tables to handle high-frequency row inserts and updates, the DWM platform implements a **Fact Constellation Schema** optimized for analytical read queries, complex group roll-ups, and statistical modeling.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DWM Standalone Analytics Cockpit                    │
│                        (React 19 / Vite 6)                             │
│                  http://localhost:5174 (Port 5174)                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON REST API
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      DWM Analytics Express API                         │
│                  http://localhost:5001 (Port 5001)                     │
├───────────────────────────────────┬────────────────────────────────────┤
│  • Warehouse Overview & ERD       │  • K-Means Clustering Engine       │
│  • Multidimensional OLAP Cube     │  • Apriori Association Rules       │
│  • CSV Ingestion & Validation     │  • Career Outcome Classifier       │
│  • Data Quality Diagnostics       │  • Ingestion Audit Ledger          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Parameterized SQL Pool
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Dimensional Data Warehouse                         │
│                    PostgreSQL (Schema: dwh.*)                          │
├───────────────────────────────────┬────────────────────────────────────┤
│  Dimensions (6):                  │  Facts & Bridges (7):              │
│  • dim_student (326 rows)         │  • fact_placement (277 rows)       │
│  • dim_alumni (2,026 rows)        │  • fact_job_application (6,006)    │
│  • dim_company (42 rows)          │  • fact_career_outcomes (2,002)    │
│  • dim_skill (165 rows)           │  • fact_salary_benchmark (24)      │
│  • dim_job (5,002 rows)           │  • bridge_student_skill (921)      │
│  • dim_date (4,748 rows)          │  • bridge_alumni_skill (20,013)    │
│                                   │  • bridge_job_skill (15,008)       │
│  Audit (2):                       │                                    │
│  • etl_batches (157 batches)      │  • etl_batch_errors (55 records)   │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Complete Dimensional Data Warehouse Schema (`dwh.*`)

The warehouse schema contains **15 tables** categorized into Dimensions, Facts, Bridges, and Audit tables:

### Summary Matrix

| Table Category | Table Name | Grain (1 row represents) | Primary / Surrogate Key | Natural Key |
| :--- | :--- | :--- | :--- | :--- |
| **Dimension** | `dwh.dim_student` | One registered undergraduate student | `student_sk` (SERIAL) | `student_id_number` |
| **Dimension** | `dwh.dim_alumni` | One graduated alumnus profile | `alumni_sk` (SERIAL) | `natural_alumni_id` |
| **Dimension** | `dwh.dim_company` | One recruiting corporate partner | `company_sk` (SERIAL) | `natural_company_id` |
| **Dimension** | `dwh.dim_skill` | One technical competency/skill | `skill_sk` (SERIAL) | `natural_skill_id` |
| **Dimension** | `dwh.dim_job` | One corporate job requisition | `job_sk` (SERIAL) | `natural_job_id` |
| **Dimension** | `dwh.dim_date` | One calendar day (2018–2030) | `date_sk` (YYYYMMDD INT) | `full_date` (DATE) |
| **Bridge** | `dwh.bridge_student_skill` | Student competency association | `(student_sk, skill_sk)` | Composite |
| **Bridge** | `dwh.bridge_alumni_skill` | Alumni competency association | `(alumni_sk, skill_sk)` | Composite |
| **Bridge** | `dwh.bridge_job_skill` | Job requirement association | `(job_sk, skill_sk)` | Composite |
| **Fact** | `dwh.fact_placement` | One campus placement offer event | `placement_id` (SERIAL) | Grain Composite |
| **Fact** | `dwh.fact_job_application`| One job application submission | `application_id` (SERIAL) | `natural_application_id` |
| **Fact** | `dwh.fact_career_outcomes`| 6-Month post-grad observation | `outcome_id` (SERIAL) | `natural_outcome_id` |
| **Fact** | `dwh.fact_salary_benchmark`| Industry market compensation band | `salary_id` (SERIAL) | — |
| **Audit** | `dwh.etl_batches` | One CSV ingestion execution batch | `id` (UUID) | — |
| **Audit** | `dwh.etl_batch_errors` | One row validation failure record | `id` (BIGSERIAL) | — |

---

### Detailed Table Specifications

#### 1. Dimension: `dwh.dim_student`
- **Purpose**: Stores student academic attributes, CGPA, department, and eligibility.
- **Columns**:
  - `student_sk` (`SERIAL PRIMARY KEY`): Warehouse surrogate key.
  - `source_user_id` (`UUID UNIQUE`): Foreign link to operational user (if applicable).
  - `student_id_number` (`VARCHAR(50)`): Institutional roll/enrollment number.
  - `department` (`VARCHAR(100)`): Academic branch (`Computer Engineering`, `Information Technology`, `Electronics & Telecommunication`, `Mechanical Engineering`, etc.).
  - `degree` (`VARCHAR(50)`): `B.Tech`, `B.E.`, `M.Tech`.
  - `admission_year` (`INT`), `graduation_year` (`INT`).
  - `cgpa` (`NUMERIC(4,2)`): Cumulative Grade Point Average ($0.00 - 10.00$).
  - `tenth_percentage` (`NUMERIC(5,2)`), `twelfth_percentage` (`NUMERIC(5,2)`).
  - `internships_count` (`INT`), `backlogs_count` (`INT`).
  - `placement_status` (`VARCHAR(30)`): `Placed`, `Not Placed`, `Higher Studies`.
  - `record_source` (`VARCHAR(30)`): `operational` or `csv_import`.

#### 2. Dimension: `dwh.dim_alumni`
- **Purpose**: Stores career progression, current company, role, experience level, and alumni status.
- **Columns**:
  - `alumni_sk` (`SERIAL PRIMARY KEY`): Warehouse surrogate key.
  - `natural_alumni_id` (`VARCHAR(50) UNIQUE`): Natural key from synthetic datasets (e.g., `IND-ALUM-000001`).
  - `source_user_id` (`UUID`): Operational link.
  - `graduation_year` (`INT`): Cohort year (2015–2024).
  - `department` (`VARCHAR(100)`): Academic discipline.
  - `degree` (`VARCHAR(100)`): Degree title.
  - `current_company` (`VARCHAR(150)`): Current employer organization.
  - `job_role` (`VARCHAR(150)`): `Software Development Engineer`, `Data Scientist`, `DevOps Engineer`, `Solutions Architect`, etc.
  - `industry` (`VARCHAR(100)`): `Technology & Cloud Services`, `Fintech & Banking`, `Healthcare & MedTech`, `Automotive & EV`, etc.
  - `experience_years` (`NUMERIC(4,1)`): Total professional experience ($0.0 - 25.0$).
  - `city` (`VARCHAR(100)`), `country` (`VARCHAR(100)`).
  - `career_level` (`VARCHAR(50)`): `Entry-Level`, `Associate`, `Mid-Level`, `Senior`, `Lead/Principal`, `Director/Executive`.
  - `is_mentor` (`BOOLEAN`), `is_donor` (`BOOLEAN`).
  - `valid_from` (`DATE`), `valid_to` (`DATE`), `is_current` (`BOOLEAN`): Supports SCD Type 2 tracking.
  - `record_source` (`VARCHAR(50)`): `operational` or `indian_academic_benchmark`.

#### 3. Dimension: `dwh.dim_company`
- **Purpose**: Employer registry, enterprise tier, and headquarters.
- **Columns**:
  - `company_sk` (`SERIAL PRIMARY KEY`): Warehouse surrogate key.
  - `natural_company_id` (`VARCHAR(50) UNIQUE`): Natural key (e.g., `IND-COMP-001`).
  - `company_name` (`VARCHAR(150) UNIQUE`): Corporate identity (e.g., `TCS`, `Infosys`, `Google`, `Microsoft`, `Reliance Jio`, `HDFC Bank`).
  - `industry` (`VARCHAR(100)`): Business sector.
  - `company_tier` (`VARCHAR(50)`): `Tier 1 Product / MNC`, `Tier 2 Tech Services`, `Core Engineering`, `Fintech & BFSI`.
  - `headquarters_location` (`VARCHAR(150)`): `Mumbai`, `Bengaluru`, `Hyderabad`, `Pune`, `Gurugram`.

#### 4. Dimension: `dwh.dim_skill`
- **Purpose**: Standardized technical and functional skill catalog.
- **Columns**:
  - `skill_sk` (`SERIAL PRIMARY KEY`): Warehouse surrogate key.
  - `natural_skill_id` (`VARCHAR(50) UNIQUE`): e.g., `SKILL-001`.
  - `skill_name` (`VARCHAR(100) UNIQUE`): `Python`, `PostgreSQL`, `React`, `Docker`, `Kubernetes`, `PyTorch`, `AWS`, etc.
  - `category` (`VARCHAR(50)`): `Programming Languages`, `Cloud & DevOps`, `Machine Learning & AI`, `Data Warehousing`, `Web Technologies`, `Embedded Systems`.

#### 5. Dimension: `dwh.dim_job`
- **Purpose**: Corporate job requisitions and recruitment demands.
- **Columns**:
  - `job_sk` (`SERIAL PRIMARY KEY`): Warehouse surrogate key.
  - `natural_job_id` (`VARCHAR(50) UNIQUE`): e.g., `IND-JOB-000001`.
  - `company_sk` (`INT REFERENCES dwh.dim_company(company_sk)`).
  - `job_title` (`VARCHAR(150)`).
  - `industry` (`VARCHAR(100)`).
  - `location_region` (`VARCHAR(150)`): `Bengaluru`, `Mumbai Metro`, `Pune`, `National Capital Region (NCR)`, `Hyderabad`, `Remote - India`.
  - `employment_type` (`VARCHAR(50)`): `Full-Time`, `Internship`, `Contract`.
  - `posted_date` (`DATE`), `posted_date_sk` (`INT REFERENCES dwh.dim_date(date_sk)`).
  - `experience_level` (`VARCHAR(50)`): `Entry-Level`, `Mid-Level`, `Senior`.

#### 6. Dimension: `dwh.dim_date`
- **Purpose**: Temporal hierarchy pre-computed for every calendar day between 2018-01-01 and 2030-12-31 (4,748 days).
- **Columns**:
  - `date_sk` (`INT PRIMARY KEY`): Integer key formatted as `YYYYMMDD` (e.g., `20240815`).
  - `full_date` (`DATE UNIQUE`).
  - `year` (`INT`), `quarter` (`INT`), `month` (`INT`), `month_name` (`VARCHAR(20)`).
  - `day_of_month` (`INT`), `day_of_week` (`INT`), `day_name` (`VARCHAR(20)`), `is_weekend` (`BOOLEAN`).
  - `academic_year` (`VARCHAR(20)`): Formatted as `2023-2024` based on Indian academic calendar (July to June).
  - `academic_semester` (`VARCHAR(20)`): `Odd / Fall` (July–Dec) or `Even / Spring` (Jan–June).

---

### Bridge Tables (Many-to-Many Mappings)

#### 7. Bridge: `dwh.bridge_student_skill`
- **Grain**: Associative pair linking a student to an acquired technical competency.
- **Columns**: `student_sk` (FK), `skill_sk` (FK), `proficiency_level` (`Beginner`, `Intermediate`, `Advanced`), `created_at`.
- **Primary Key**: `(student_sk, skill_sk)`.

#### 8. Bridge: `dwh.bridge_alumni_skill`
- **Grain**: Associative pair linking an alumnus to their verified competencies.
- **Columns**: `alumni_sk` (FK), `skill_sk` (FK), `proficiency_level`, `years_used`, `record_source`.
- **Primary Key**: `(alumni_sk, skill_sk)`. Total: **20,013 rows**.

#### 9. Bridge: `dwh.bridge_job_skill`
- **Grain**: Associative pair linking a job posting to a mandatory/preferred competency.
- **Columns**: `job_sk` (FK), `skill_sk` (FK), `required_level` (`Required`, `Preferred`), `record_source`.
- **Primary Key**: `(job_sk, skill_sk)`. Total: **15,008 rows**.

---

### Fact Tables (Business Observations & Numerical Measures)

#### 10. Fact: `dwh.fact_placement`
- **Grain**: One campus placement offer awarded to a student by a recruiting employer on an offer date.
- **Columns**:
  - `placement_id` (`SERIAL PRIMARY KEY`).
  - `student_sk` (`INT FK -> dim_student`).
  - `company_sk` (`INT FK -> dim_company`).
  - `offer_date_sk` (`INT FK -> dim_date`).
  - `annual_package_lpa` (`NUMERIC(8,2)`): Cost to Company (CTC) in Lakhs Per Annum (e.g., `14.50`).
  - `base_salary_inr` (`NUMERIC(12,2)`), `bonus_inr` (`NUMERIC(12,2)`).
  - `offers_count` (`INT DEFAULT 1`): Additive measure.
  - `aptitude_score`, `technical_test_score`, `interview_score` (`NUMERIC(5,2)`).
  - `readiness_score` (`INT`): Composite readiness index ($0 - 100$).
  - `is_on_campus` (`BOOLEAN`).
- **Unique Constraint**: `uq_dwh_fact_placement_grain (student_sk, company_sk, offer_date_sk)` prevents duplicate offer inflation.

#### 11. Fact: `dwh.fact_job_application`
- **Grain**: One job application submitted by an applicant (student or alumni) for an open requisition.
- **Columns**:
  - `application_id` (`SERIAL PRIMARY KEY`).
  - `natural_application_id` (`VARCHAR(50) UNIQUE`): e.g., `IND-APP-000001`.
  - `student_sk` (`INT FK`, nullable for alumni applications).
  - `alumni_sk` (`INT FK`, nullable for student applications).
  - `job_sk` (`INT FK -> dim_job`).
  - `company_sk` (`INT FK -> dim_company`).
  - `applied_date_sk`, `reviewed_date_sk` (`INT FK -> dim_date`).
  - `ats_match_score` (`INT`): Algorithmic resume match score ($0 - 100$).
  - `days_to_decision` (`INT`): Processing turnaround time.
  - `is_shortlisted` (`INT`), `is_selected` (`INT`).
  - `application_status` (`VARCHAR(30)`): `applied`, `reviewed`, `shortlisted`, `rejected`, `selected`.

#### 12. Fact: `dwh.fact_career_outcomes`
- **Grain**: Exactly one 6-month post-graduation outcome record per alumnus ($1:1$ observation).
- **Columns**:
  - `outcome_id` (`SERIAL PRIMARY KEY`).
  - `natural_outcome_id` (`VARCHAR(50) UNIQUE`): e.g., `IND-OUT-000001`.
  - `alumni_sk` (`INT FK UNIQUE -> dim_alumni`).
  - `observation_period_months` (`INT DEFAULT 6`).
  - `employed_within_6_months` (`INT CHECK (IN (0, 1))`): Supervised target variable.
  - `career_level` (`VARCHAR(50)`), `industry` (`VARCHAR(100)`).
  - `experience_years_at_observation` (`NUMERIC(4,1)`).
  - `is_synthetic_educational_target` (`BOOLEAN DEFAULT TRUE`).

#### 13. Fact: `dwh.fact_salary_benchmark`
- **Grain**: Aggregated compensation benchmark across employer tier and career level.
- **Columns**:
  - `salary_id` (`SERIAL PRIMARY KEY`).
  - `company_sk` (`INT FK -> dim_company`).
  - `experience_years` (`NUMERIC(4,1)`).
  - `total_annual_comp_inr` (`NUMERIC(12,2)`).
  - `salary_band_tier` (`VARCHAR(30)`): `Tier 1 Product`, `Tier 2 Services`, etc.

---

### Audit Ledger Tables

#### 14. `dwh.etl_batches`
- **Purpose**: Traceability and governance for every CSV uploaded or batch processed.
- **Columns**: `id` (`UUID PK`), `batch_type` (`csv_skills`, `csv_alumni`, `csv_jobs`, etc.), `file_name`, `status` (`staged`, `completed`, `failed`, `rolled_back`), `rows_total`, `rows_inserted`, `rows_rejected`, `started_at`, `completed_at`, `staged_data` (`JSONB`).

#### 15. `dwh.etl_batch_errors`
- **Purpose**: Row-level failure audit ledger preserving invalid records and exact validation error messages.
- **Columns**: `id` (`BIGSERIAL PK`), `batch_id` (`UUID FK -> etl_batches`), `row_number` (`INT`), `raw_data` (`JSONB`), `validation_error` (`TEXT`), `created_at`.

---

## 3. The 7 Synthetic Benchmark Datasets

Located in `DWM-project/datasets/`, these 7 datasets constitute an academic benchmark calibrated to Indian engineering education metrics:

```
DWM-project/datasets/
├── skills.csv          (150 rows, 12.8 KB)
├── alumni.csv          (2,000 rows, 374.6 KB)
├── jobs.csv            (5,000 rows, 978.4 KB)
├── alumni_skills.csv   (20,000 rows, 1.55 MB)
├── job_skills.csv      (15,000 rows, 1.14 MB)
├── applications.csv    (6,000 rows, 672.8 KB)
└── career_outcomes.csv (2,000 rows, 224.4 KB)
```

### Dataset Specifications

#### 1. `skills.csv` (150 Records)
- **Header**: `skill_id,skill_name,skill_category,data_source`
- **Primary / Natural Key**: `skill_id` (`SKILL-001` to `SKILL-150`).
- **Target Table**: `dwh.dim_skill`.
- **Categories Covered**:
  - Programming Languages (`Python`, `Java`, `C++`, `Go`, `Rust`, `TypeScript`, `JavaScript`)
  - Web & Mobile (`React`, `Angular`, `Node.js`, `Flutter`, `Next.js`)
  - Cloud & DevOps (`AWS`, `Docker`, `Kubernetes`, `Terraform`, `CI/CD`)
  - Data & Machine Learning (`PyTorch`, `TensorFlow`, `PostgreSQL`, `Snowflake`, `Spark`)
  - Systems & Core (`Embedded C`, `VLSI`, `MATLAB`, `AutoCAD`, `Robotics`)

#### 2. `alumni.csv` (2,000 Records)
- **Header**: `alumni_id,graduation_year,degree,field_of_study,current_role,industry,experience_years,location_region,career_level,data_source`
- **Natural Key**: `alumni_id` (`IND-ALUM-000001` to `IND-ALUM-002000`).
- **Target Table**: `dwh.dim_alumni`.
- **Distributions**:
  - Graduation Years: 2015 to 2024.
  - Experience: Strictly constrained by graduation year ($\text{Exp} \le 2026 - \text{GradYear}$).
  - Regions: Bengaluru, Mumbai Metro, Pune, Hyderabad, Delhi NCR, Chennai, Remote - India.
  - Degrees: `B.Tech Computer Engineering`, `B.Tech IT`, `B.E. Electronics`, `B.E. Mechanical`.

#### 3. `jobs.csv` (5,000 Records)
- **Header**: `job_id,job_title,company_id,company_name,industry,location_region,employment_type,posted_date,experience_level,data_source`
- **Natural Key**: `job_id` (`IND-JOB-000001` to `IND-JOB-005000`).
- **Foreign Key**: `company_id` referencing 42 corporate partners.
- **Target Table**: `dwh.dim_job`.
- **Posted Dates**: Chronologically distributed between 2023-01-01 and 2025-12-31.

#### 4. `alumni_skills.csv` (20,000 Records)
- **Header**: `alumni_id,skill_id,proficiency_level,years_used,data_source`
- **Target Table**: `dwh.bridge_alumni_skill`.
- **Affinity Distribution**: Exactly 10 skill competencies per alumnus ($2,000 \times 10 = 20,000$).
- **Consistency**: `years_used` is mathematically bounded by the alumnus's total career experience.

#### 5. `job_skills.csv` (15,000 Records)
- **Header**: `job_id,skill_id,required_level,data_source`
- **Target Table**: `dwh.bridge_job_skill`.
- **Distribution**: Exactly 3 core competencies per job posting ($5,000 \times 3 = 15,000$).
- **Requirements**: Balanced between `Required` (60%) and `Preferred` (40%).

#### 6. `applications.csv` (6,000 Records)
- **Header**: `application_id,alumni_id,job_id,application_date,application_status,days_to_decision,data_source`
- **Natural Key**: `application_id` (`IND-APP-000001` to `IND-APP-006000`).
- **Target Table**: `dwh.fact_job_application`.
- **Chronological Rule**: `application_date >= job.posted_date` (never before job posting).
- **Status Distribution**: `applied` (40%), `reviewed` (25%), `shortlisted` (20%), `selected` (10%), `rejected` (5%).

#### 7. `career_outcomes.csv` (2,000 Records)
- **Header**: `outcome_id,alumni_id,observation_period_months,employed_within_6_months,career_level,industry,experience_years_at_observation,data_source`
- **Natural Key**: `outcome_id` (`IND-OUT-000001` to `IND-OUT-002000`).
- **Target Table**: `dwh.fact_career_outcomes`.
- **Target Variable**: `employed_within_6_months` (binary: 0 or 1, calibrated to ~85% true employment rate).

---

## 4. Mathematical & Referential Integrity Rules

The synthetic dataset generation script ([`scripts/generate_dwm_datasets.py`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/scripts/generate_dwm_datasets.py)) and validation script ([`scripts/validate_dwm_datasets.py`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/scripts/validate_dwm_datasets.py)) enforce **10 mathematical integrity rules**:

1. **Deterministic Reproducibility**: Seed fixed at `42` ensuring identical hash checksums.
2. **Referential Integrity**: 100% of foreign keys in bridges and facts resolve to valid dimension natural keys.
3. **Chronological Paradox Prevention**: No job application date is earlier than the corresponding job posted date:
   $$\text{application\_date} \ge \text{job.posted\_date}$$
4. **Experience vs. Cohort Consistency**: Experience years cannot exceed the maximum elapsed time since graduation:
   $$\text{experience\_years} \le 2026 - \text{graduation\_year}$$
5. **Skill Experience Bounds**: An individual cannot have used a skill for more years than their total career length:
   $$\text{years\_used} \le \text{alumni.experience\_years}$$
6. **Career Level vs. Experience Monotonicity**:
   - `Entry-Level`: 0–2 years
   - `Associate`: 2–4 years
   - `Mid-Level`: 4–7 years
   - `Senior`: 7–11 years
   - `Lead/Principal`: 11–16 years
   - `Director/Executive`: 16+ years
7. **Unique Grain Constraints**: No duplicate natural IDs or composite primary key violations.
8. **Provenance Isolation**: Every synthetic row carries `record_source = 'indian_academic_benchmark'` to ensure analytical queries can cleanly isolate operational institutional data from benchmark data.
9. **Salary Distribution Realism**: CTC packages follow log-normal distributions matching Indian placement data:
   - Tier 1 Product: ₹18.0 – ₹45.0 LPA (Mean: ₹24.5 LPA)
   - Tier 2 Services: ₹4.5 – ₹10.0 LPA (Mean: ₹6.8 LPA)
   - Core Engineering: ₹5.5 – ₹14.0 LPA (Mean: ₹8.2 LPA)
10. **Zero Division & Null Safety**: Aggregates guard against zero eligible cohorts, displaying `0.0%` rather than `NaN` or SQL runtime errors.

---

## 5. ETL Pipeline & CSV Ingestion Engine

The CSV Ingestion Engine ([`csvIngestionService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/csvIngestionService.js)) implements a robust **Two-Phase Commit ETL Pattern**:

```text
[Uploaded CSV] 
       │
       ▼
Phase 1: Dry-Run Validation (In-Memory)
  ├── 1. Schema Validation (Header check & required columns via Zod)
  ├── 2. Row Type & Format Verification (Dates, integers, decimals)
  ├── 3. Foreign Key Lookup (Resolves natural IDs against dwh dimensions)
  └── 4. Staging into dwh.etl_batches (JSONB payload, status: 'staged')
       │
       ▼
Phase 2: Confirmed Transactional Commit
  ├── 1. Natural Key to Surrogate Key Mapping (Resolves natural_id -> *_sk)
  ├── 2. Upsert Logic (ON CONFLICT DO UPDATE - Idempotent re-import)
  ├── 3. Audit Logging (Updates rows_inserted, rows_rejected in dwh.etl_batches)
  └── 4. Error Isolation (Records bad rows into dwh.etl_batch_errors)
```

### Strict Ingestion Dependency Order
To prevent foreign key violations, datasets must be imported in topological dependency order:
1. `skills.csv` (Dimensions first)
2. `alumni.csv` (Depends on skills/dates)
3. `jobs.csv` (Depends on companies/dates)
4. `alumni_skills.csv` (Depends on alumni + skills)
5. `job_skills.csv` (Depends on jobs + skills)
6. `applications.csv` (Depends on alumni + jobs)
7. `career_outcomes.csv` (Depends on alumni)

---

## 6. OLAP Multidimensional Operations

The warehouse supports 5 core OLAP operations implemented via parameterized SQL queries in [`warehouseOverviewService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseOverviewService.js):

| Operation | Analytical Concept | SQL Implementation |
| :--- | :--- | :--- |
| **Roll-Up** | Aggregates data from fine granularity to coarse summary (e.g., Daily $\rightarrow$ Monthly $\rightarrow$ Yearly) | `GROUP BY d.year, c.company_tier` |
| **Drill-Down** | De-aggregates summary data into granular sub-dimensions (e.g., Year $\rightarrow$ Department $\rightarrow$ Specific Skill) | `GROUP BY d.year, s.department, k.skill_name` |
| **Slice** | Selects a single dimensional coordinate (e.g., `department = 'Computer Engineering'`) | `WHERE s.department = $1` |
| **Dice** | Selects a multidimensional sub-cube (e.g., `department IN (...) AND year BETWEEN 2022 AND 2024`) | `WHERE s.department = ANY($1) AND d.year BETWEEN $2 AND $3` |
| **Pivot** | Rotates a 2D matrix turning unique dimension values into columns for cross-tabular comparison | `SELECT s.department, SUM(CASE WHEN c.tier = 'Tier 1' THEN 1 ELSE 0 END) AS tier1_offers...` |

---

## 7. Data Mining & Algorithmic Foundations

The DWM server integrates **3 machine learning modules** operating directly on warehouse tables:

### 1. K-Means Clustering (`clusteringService.js`)
- **Objective**: Unsupervised profile segmentation of 2,000 alumni based on experience, cohort year, and skill proficiencies.
- **Math**:
  - Distance: Euclidean distance $\|x_i - \mu_k\|^2$ on standardized feature vectors.
  - Convergence: Iterative centroid assignment until $\Delta \mu < 10^{-4}$ or max 100 iterations.
- **Evaluation**:
  - **Inertia (WCSS)**: Computes Within-Cluster Sum of Squares across candidate $k \in [2, 10]$ for the **Elbow Method**.
  - **Silhouette Coefficient**: Measures cluster cohesion vs. separation:
    $$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$$
  - **PCA (Principal Component Analysis)**: Projects high-dimensional feature space down to 2 principal components ($PC_1, PC_2$) for 2D scatter visualization.

### 2. Apriori Association Rule Mining (`associationRuleService.js`)
- **Objective**: Discovers competency affinity baskets and market-basket co-occurrences.
- **Dual Analytical Modes**:
  - **Mode A (Alumni Skills)**: 2,000 alumni transaction baskets ($20,000$ competencies).
  - **Mode B (Job Skills)**: 5,000 job requisition baskets ($15,000$ competencies).
- **Core Formulas**:
  $$\text{Support}(X \Rightarrow Y) = \frac{\sigma(X \cup Y)}{N}$$
  $$\text{Confidence}(X \Rightarrow Y) = \frac{\sigma(X \cup Y)}{\sigma(X)}$$
  $$\text{Lift}(X \Rightarrow Y) = \frac{\text{Confidence}(X \Rightarrow Y)}{\text{Support}(Y)}$$
  *(A rule is statistically valid if $\text{Lift} > 1.0$, indicating positive correlation beyond random chance).*

### 3. Supervised Classification (`classificationService.js`)
- **Objective**: Predicts 6-month post-graduation employment placement (`Employed` vs. `Seeking Opportunities`).
- **Feature Pipeline**:
  - Continuous: `cgpa`, `internships_count`, `aptitude_score`, `technical_test_score`, `readiness_score`.
  - Categorical: `department`, `career_level`, `skill_count`.
- **Evaluation**: Stratified 80/20 train/test split computing:
  - Confusion Matrix (`TP, FP, TN, FN`)
  - Precision, Recall, F1-Score
  - ROC-AUC (Area Under Receiver Operating Characteristic Curve)

---

## 8. Viva Defense Quick-Reference Cheat Sheet

| Question | Accurate Examiner Answer |
| :--- | :--- |
| **What schema model is used in DWM?** | **Fact Constellation Schema** (also known as Fact Cluster Schema). It contains multiple shared dimensions (`dim_date`, `dim_company`, `dim_skill`) linked across multiple distinct fact tables (`fact_placement`, `fact_job_application`, `fact_career_outcomes`). |
| **Why not standard 3NF (Third Normal Form)?** | 3NF is designed for transactional OLTP to eliminate insertion/update anomalies, requiring numerous expensive multi-table joins. Analytical OLAP requires denormalized star/constellation schemas for fast aggregation, slicing, and roll-ups. |
| **How many tables and rows are in the warehouse?** | **15 tables** (6 Dimensions, 4 Facts, 3 Bridges, 2 Audit) containing **56,772 rows**. |
| **How is synthetic benchmark data separated from operational data?** | Via the **Provenance Column** (`record_source = 'indian_academic_benchmark'` vs `'operational'`). Queries can filter strictly for real university data, benchmark data, or a combined view. |
| **What is the purpose of surrogate keys (`*_sk`)?** | Surrogate keys are synthetic integer keys managed solely by the warehouse. They insulate the data warehouse from operational source schema changes, handle historical SCD changes, and provide faster join indexing than string UUIDs. |
| **What is a Bridge Table and why is it needed?** | Bridge tables resolve **Many-to-Many ($M:N$) relationships** between dimensions (e.g., one student has multiple skills, and one skill belongs to multiple students) without creating repeating multivalued columns. |
| **What does a Lift > 1.0 mean in Apriori?** | A lift value greater than 1.0 indicates that the presence of skill $X$ significantly increases the likelihood of skill $Y$ appearing in the same profile, confirming a true positive affinity rather than co-occurrence by random coincidence. |
| **How is idempotency maintained during CSV ingestion?** | Natural keys are indexed with unique constraints (`uq_dwh_*_natural`). When a batch is re-imported, the engine performs `ON CONFLICT (natural_id) DO UPDATE`, updating attributes without duplicating records or inflating fact counts. |

---

*Report generated and committed to `DWM-project/docs/DWM_DATASET_WAREHOUSE_MASTER_REPORT.md`.*
