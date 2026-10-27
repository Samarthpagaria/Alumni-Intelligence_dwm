# Alumni Intelligence & Career Analytics Platform (DWM Architecture & Specification)

> **Document Type:** Data Warehousing & Data Mining System Specification  
> **System Name:** Alumni Intelligence & Career Analytics Platform  
> **Target Schema:** `dwh` (PostgreSQL 16 / PGlite)  
> **Status:** Phase 1 Foundation Verified  

---

## 1. System Vision & Architecture

The **Alumni Intelligence & Career Analytics Platform** is a dedicated analytical layer built on top of the Alumni Network Portal. It bridges the university's operational online transaction processing (OLTP) database with a multidimensional data warehouse (OLAP) and an integrated data mining engine.

### Architectural Data Flow

```text
┌────────────────────────────────┐     ┌────────────────────────────────┐
│   Operational Database (OLTP)  │     │   External Historical CSVs     │
│   Schema: public (49 tables)   │     │   (Multi-Year Benchmark Data)  │
└───────────────┬────────────────┘     └───────────────┬────────────────┘
                │                                      │
                │ (Transactional Extract)              │ (Multipart Stream / Zod)
                ▼                                      ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    STAGING & ETL INGESTION ENGINE                     │
│  - Data Cleansing & Normalization (Standardize skills, dates, wages)   │
│  - Validation & Deduplication (Composite keys, error logging)          │
│  - Staging Ledger & Execution Audit (dwh.etl_batches, etl_errors)     │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │ (Atomic Load / withTransaction)
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│              ANALYTICAL DATA WAREHOUSE (Schema: dwh)                  │
│                                                                       │
│  DIMENSIONS (Star Schema):                                            │
│    - dwh.dim_student       (Academics, CGPA, department, study year)   │
│    - dwh.dim_alumni        (Graduation, employer, seniority, geo)     │
│    - dwh.dim_company       (Employer profile, sector, tier)           │
│    - dwh.dim_skill         (Standardized skill catalogue & category)  │
│    - dwh.dim_date          (Academic calendar, semester, temporal)    │
│                                                                       │
│  FACTS:                                                               │
│    - dwh.fact_placement    (Offers, package LPA, interview scores)    │
│    - dwh.fact_job_application (Applications, ATS score, outcome)      │
│    - dwh.fact_salary_benchmark (Comp benchmarks, experience bands)    │
│                                                                       │
│  BRIDGES:                                                             │
│    - dwh.bridge_student_skill (Student-to-skill proficiency mappings) │
└───────────────────┬───────────────────────────────┬───────────────────┘
                    │                               │
                    ▼                               ▼
┌───────────────────────────────────┐   ┌───────────────────────────────┐
│        OLAP AGGREGATION ENGINE    │   │      DATA MINING SUBSYSTEM    │
│  - Roll-Up & Drill-Down           │   │  - Apriori Association Rules  │
│  - Multi-Dimensional Slice & Dice │   │  - K-Means Career Clustering  │
│  - Caching & Parameterized Views  │   │  - Placement Classification   │
└───────────────────┬───────────────┘   └───────────────┬───────────────┘
                    │                                   │
                    └───────────────┬───────────────────┘
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│               ANALYTICS FRONTEND PLATFORM (/analytics/*)              │
│  - Executive Cockpit & KPI Cards                                      │
│  - Multidimensional OLAP Cube Explorer                                │
│  - Skills Market Basket Visualizer                                    │
│  - K-Means Cluster Projection & Career Personas                       │
│  - Interactive Placement Prediction Simulator                         │
│  - CSV Data Management & Column Mapping Wizard                        │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 2. Operational Data Assessment (Live Verified Counts)

Direct inspection of the active local database on port `54329` confirmed 49 public tables and 753 rows. The key operational tables relevant to analytics and their data profiles are:

| Operational Source Table | Verified Rows | Analytical Use & Grain | Identified Limitations / Handling |
|---|---|---|---|
| `users` | 33 | User entity, account verification, timestamps | Operational identity only; passwords/tokens stripped |
| `alumni_profiles` | 24 | Industry, company, graduation year, location | 24 profiles across major tech firms; salary is not captured in OLTP |
| `student_profiles` | 6 | Department, degree, year of study | Small sample; insufficient alone for statistical ML training |
| `skills` / `user_skills` | 18 / 23 | Skill catalogue, individual user proficiencies | Good structure; requires larger transaction sets for high-confidence Apriori |
| `jobs` | 25 | Roles, industries, work modes, salary bands | 25 listings; some salary fields are null |
| `job_applications` | 4 | Application status, review timestamps | 4 rows; too sparse for standalone placement classification |
| `donations` / `receipts` | 14 / 12 | Financial giving, currency, tax receipts | Solid history of alumni philanthropic engagement |
| `career_roadmaps` / `tasks`| 4 / 20 | Student milestones, readiness scores (0-100) | Benchmark scores for feature engineering in placement modeling |

**Data Sufficiency Strategy:** Live operational records are synced directly into warehouse dimensions and facts. To power statistical data mining (Apriori frequent itemsets and Decision Tree / Naive Bayes placement classification), the platform pairs operational sync with standardized multi-year benchmark CSV datasets (1,500+ student placement records from 2018–2025).

---

## 3. Dimensional Schema Specification (`dwh`)

All analytical tables reside within the dedicated PostgreSQL schema `dwh`.

### 3.1 Dimension Tables

#### 1. `dwh.dim_student`
- **Grain:** One row per student.
- **Attributes:**
  - `student_sk` (`SERIAL PRIMARY KEY`): Surrogate key.
  - `source_user_id` (`UUID`, nullable): Natural key referencing `public.users.id`.
  - `student_id_number` (`VARCHAR(50)`): Institutional roll number.
  - `department` (`VARCHAR(100)`): e.g. `'Computer Engineering'`, `'Information Technology'`.
  - `degree` (`VARCHAR(50)`): e.g. `'B.Tech'`, `'M.Tech'`.
  - `admission_year` (`INT`), `graduation_year` (`INT`).
  - `cgpa` (`NUMERIC(4,2)`): Cumulative GPA (0.00 – 10.00).
  - `tenth_percentage` (`NUMERIC(5,2)`), `twelfth_percentage` (`NUMERIC(5,2)`).
  - `internships_count` (`INT`), `backlogs_count` (`INT`).
  - `placement_status` (`VARCHAR(30)`: `'Placed'`, `'Not Placed'`, `'Higher Studies'`).
  - `created_at`, `updated_at` (`TIMESTAMPTZ`).

#### 2. `dwh.dim_alumni`
- **Grain:** One row per alumnus career profile (SCD Type 2 ready).
- **Attributes:**
  - `alumni_sk` (`SERIAL PRIMARY KEY`): Surrogate key.
  - `source_user_id` (`UUID`, nullable): Natural key referencing `public.users.id`.
  - `graduation_year` (`INT`), `department` (`VARCHAR(100)`).
  - `current_company` (`VARCHAR(150)`), `current_role` (`VARCHAR(150)`).
  - `industry` (`VARCHAR(100)`), `experience_years` (`NUMERIC(4,1)`).
  - `city` (`VARCHAR(100)`), `country` (`VARCHAR(100)`).
  - `is_mentor` (`BOOLEAN`), `is_donor` (`BOOLEAN`).
  - `valid_from` (`DATE`), `valid_to` (`DATE`), `is_current` (`BOOLEAN`).

#### 3. `dwh.dim_company`
- **Grain:** One row per recruiting employer.
- **Attributes:**
  - `company_sk` (`SERIAL PRIMARY KEY`): Surrogate key.
  - `company_name` (`VARCHAR(150)` UNIQUE).
  - `industry` (`VARCHAR(100)`).
  - `company_tier` (`VARCHAR(50)`: `'Dream / Super Dream'`, `'Core Engineering'`, `'Mass Recruiter'`).
  - `headquarters_location` (`VARCHAR(150)`).

#### 4. `dwh.dim_skill`
- **Grain:** One row per technical or professional skill.
- **Attributes:**
  - `skill_sk` (`SERIAL PRIMARY KEY`): Surrogate key.
  - `skill_name` (`VARCHAR(100)` UNIQUE).
  - `category` (`VARCHAR(50)`: `'Languages'`, `'Frameworks'`, `'Cloud/DevOps'`, `'Databases'`, `'AI/Data Science'`, `'Core CS'`).

#### 5. `dwh.dim_date`
- **Grain:** One row per calendar day (2018–2030).
- **Attributes:**
  - `date_sk` (`INT PRIMARY KEY`): Format `YYYYMMDD`.
  - `full_date` (`DATE` UNIQUE).
  - `year` (`INT`), `quarter` (`INT`), `month` (`INT`), `month_name` (`VARCHAR(20)`).
  - `day_of_month` (`INT`), `day_of_week` (`INT`), `day_name` (`VARCHAR(20)`).
  - `academic_year` (`VARCHAR(20)`), `academic_semester` (`VARCHAR(20)`).

---

### 3.2 Fact Tables

#### 1. `dwh.fact_placement`
- **Grain:** One row per student job offer or placement outcome.
- **Foreign Keys:**
  - `student_sk` (`INT REFERENCES dwh.dim_student(student_sk)`)
  - `company_sk` (`INT REFERENCES dwh.dim_company(company_sk)`)
  - `offer_date_sk` (`INT REFERENCES dwh.dim_date(date_sk)`)
- **Measures:**
  - `annual_package_lpa` (`NUMERIC(8,2)`): CTC in Lakhs Per Annum.
  - `base_salary_inr` (`NUMERIC(12,2)`).
  - `bonus_inr` (`NUMERIC(12,2)`).
  - `offers_count` (`INT`, default 1).
  - `aptitude_score` (`NUMERIC(5,2)`), `technical_test_score` (`NUMERIC(5,2)`), `interview_score` (`NUMERIC(5,2)`).
  - `readiness_score` (`INT`: 0–100, synced from career roadmaps).
  - `is_on_campus` (`BOOLEAN`).

#### 2. `dwh.fact_job_application`
- **Grain:** One row per job application event.
- **Foreign Keys:**
  - `student_sk` (`INT REFERENCES dwh.dim_student(student_sk)`)
  - `company_sk` (`INT REFERENCES dwh.dim_company(company_sk)`)
  - `applied_date_sk` (`INT REFERENCES dwh.dim_date(date_sk)`)
  - `reviewed_date_sk` (`INT REFERENCES dwh.dim_date(date_sk)`)
- **Measures:**
  - `ats_match_score` (`INT`: 0–100).
  - `days_to_decision` (`INT`).
  - `is_shortlisted` (`INT`: 0 or 1).
  - `is_selected` (`INT`: 0 or 1).

#### 3. `dwh.fact_salary_benchmark`
- **Grain:** One row per alumni compensation report or industry benchmark.
- **Foreign Keys:**
  - `alumni_sk` (`INT REFERENCES dwh.dim_alumni(alumni_sk)`)
  - `company_sk` (`INT REFERENCES dwh.dim_company(company_sk)`)
  - `effective_date_sk` (`INT REFERENCES dwh.dim_date(date_sk)`)
- **Measures:**
  - `experience_years` (`NUMERIC(4,1)`).
  - `total_annual_comp_inr` (`NUMERIC(12,2)`).
  - `salary_band_tier` (`VARCHAR(30)`: e.g. `'< 6 LPA'`, `'6-12 LPA'`, `'12-25 LPA'`, `'> 25 LPA'`).

---

### 3.3 Bridge & Ingestion Ledger Tables

- **`dwh.bridge_student_skill`**: `student_sk`, `skill_sk`, `proficiency_level` (`'beginner'`, `'intermediate'`, `'advanced'`). Primary Key: `(student_sk, skill_sk)`.
- **`dwh.etl_batches`**: `id` (`UUID PK`), `batch_type` (`'internal_sync'` | `'csv_upload'`), `file_name` (`VARCHAR`), `status` (`'pending'`, `'processing'`, `'completed'`, `'failed'`), `rows_total` (`INT`), `rows_inserted` (`INT`), `rows_rejected` (`INT`), `started_at`, `completed_at`, `error_summary` (`TEXT`).
- **`dwh.etl_batch_errors`**: `id` (`BIGSERIAL PK`), `batch_id` (`UUID REFERENCES dwh.etl_batches(id)`), `row_number` (`INT`), `raw_data` (`JSONB`), `validation_error` (`TEXT`), `created_at` (`TIMESTAMPTZ`).

---

## 4. OLAP & Data Mining Operations

### 4.1 OLAP Capabilities
1. **Roll-Up / Drill-Down**:
   - Time Hierarchy: Day $\to$ Month $\to$ Quarter $\to$ Academic Year.
   - Academic Hierarchy: Student $\to$ Department $\to$ University Division.
   - Employer Hierarchy: Job Title $\to$ Company $\to$ Industry Sector.
2. **Slice**: Filter facts along a single dimension (e.g. `WHERE d.department = 'Information Technology'`).
3. **Dice**: Multi-dimensional bounded box (e.g. `WHERE d.department = 'Computer Engineering' AND t.year = 2025 AND p.annual_package_lpa >= 12.0`).

### 4.2 Data Mining Algorithms
1. **Apriori Association Rule Mining**:
   - Transaction: Set of skills associated with each student or job posting.
   - Metrics computed: Support $S(X \implies Y)$, Confidence $C(X \implies Y)$, Lift $L(X \implies Y)$.
   - Target Application: Emerging skill bundles (e.g. $\{\text{Docker}, \text{Kubernetes}\} \implies \text{AWS}$).
2. **K-Means Clustering**:
   - Feature vector: Normalized $[ \text{Years Experience}, \text{Package LPA}, \text{Skill Count}, \text{Mentorship Score} ]$.
   - Method: Lloyd's algorithm with K-Means++ centroid initialization.
   - Output: Visualized 2D projections and identifiable alumni career personas.
3. **Placement Classification (Naive Bayes / Decision Tree)**:
   - Supervised classification: Target = `Placed (1)` vs `Not Placed (0)`.
   - Feature set: `CGPA`, `Twelfth Percentage`, `Backlogs`, `Internship Count`, `Technical Assessment Score`, `Readiness Score`.
   - Validation: Train/Test split (80/20), Confusion Matrix, Precision, Recall, F1 Score.

---

## 5. Privacy, Governance & Non-Regression Guarantees

1. **Strict Decoupling Guarantee**: The operational schema `public` and the analytical schema `dwh` are completely decoupled. Operational database sync (`public -> dwh`) has been permanently removed. Analytical endpoints and services never query, copy, or synchronize from `public.*`.
2. **Zero Sensitive PII**: No user passwords, authentication hashes, session tokens, or sensitive personal credentials exist in the `dwh` schema.
3. **Audit Trail**: Every data import is logged in `dwh.etl_batches` with row-level validation errors preserved in `dwh.etl_batch_errors`.

---

## 6. Decoupled Independent DWM Architecture & Warehouse Overview

### 6.1 Architectural Isolation & Removal of Operational Sync
The DWM system operates as an independent analytical platform:
- The `Sync Operational DB (public → dwh)` button, background triggers, and API endpoints (`POST /api/analytics/etl/refresh`, `POST /api/analytics/etl/sync`) have been removed.
- All analytical queries (OLAP, Data Mining, Dashboards) execute exclusively against `dwh.*` tables.
- Data ingestion is supported independently via external CSV files (`POST /api/analytics/etl/upload` and `confirm-import`) with transactional staging, schema validation, and audit tracking.

### 6.2 Warehouse Table Topology (15 Tables across 4 Tiers)
1. **Dimensions (6 Tables)**:
   - `dwh.dim_student`: Enrolled students, department, admission/graduation cohorts, CGPA.
   - `dwh.dim_alumni`: Graduated alumni profiles, current roles, employer, seniority, experience.
   - `dwh.dim_company`: Recruiting firms, industry sectors, and tier classifications.
   - `dwh.dim_skill`: Standardized taxonomy of 163 technology competencies.
   - `dwh.dim_date`: Temporal calendar dimension pre-populated from 2018 to 2030 (4,748 days).
   - `dwh.dim_job`: Job requisitions (5,000 postings), company links, seniority levels.
2. **Bridges / Associative Junctions (3 Tables)**:
   - `dwh.bridge_student_skill`: Student-to-skill competencies (921 rows).
   - `dwh.bridge_alumni_skill`: Alumni-to-skill proficiencies (20,000 rows).
   - `dwh.bridge_job_skill`: Job requisitions to required candidate skills (15,000 rows).
3. **Facts (4 Tables)**:
   - `dwh.fact_placement`: Verified campus placement outcomes, CTC package LPA (259 rows).
   - `dwh.fact_job_application`: Application lifecycle events and ATS match scores (6,004 rows).
   - `dwh.fact_salary_benchmark`: Compensation bands and experience tiers (24 rows).
   - `dwh.fact_career_outcomes`: 6-month post-graduation employment targets for ML (2,000 rows).
4. **Audit Ledger (2 Tables)**:
   - `dwh.etl_batches`: Ingestion batch execution transactions (37 rows).
   - `dwh.etl_batch_errors`: Row-level validation rejection audit records (1 row).

### 6.3 Table Relationships (22 Foreign Keys)
The warehouse schema defines 22 foreign key constraints:
- `bridge_student_skill` $\to$ `dim_student`, `dim_skill`
- `bridge_alumni_skill` $\to$ `dim_alumni`, `dim_skill`
- `bridge_job_skill` $\to$ `dim_job`, `dim_skill`
- `fact_placement` $\to$ `dim_student`, `dim_company`, `dim_date`
- `fact_job_application` $\to$ `dim_student`, `dim_alumni`, `dim_company`, `dim_job`, `dim_date`
- `fact_salary_benchmark` $\to$ `dim_alumni`, `dim_company`, `dim_date`
- `fact_career_outcomes` $\to$ `dim_alumni`
- `dim_job` $\to$ `dim_company`, `dim_date`
- `etl_batch_errors` $\to$ `etl_batches`

### 6.4 Measurement Metric Distinction
To ensure clarity for developers, students, and evaluators:
- **Warehouse Table Rows (56,528)**: Physical rows across all 15 relational tables in PostgreSQL `dwh.*`.
- **Source CSV Records (50,150)**: Exact line counts in the 7 physical benchmark files under `datasets/`.
- **Ingestion Batches (37)**: Distinct ETL execution records in `dwh.etl_batches`.
- **Distinct Business Entities**: 308 students, 2,024 alumni, 39 companies, 163 skills, 5,000 jobs.

### 6.5 Interactive Schema ERD & Table Explorer
Accessible at `/analytics/warehouse`:
- **Interactive SVG ERD**: Visual 4-tier diagram with zoom, pan, table search, and category filtering. Clicking any table node highlights incoming/outgoing relations and opens column profiles.
- **Table Explorer**: Searchable inventory table with category badges, row counts, and primary key indicators.
- **Table Details**: Column types, null percentages, distinct counts, min/max values, and safe 10-row paginated sample record previews.
- **Data Quality Diagnostics**: 38 automated read-only verification checks (0 duplicate PKs, 0 orphaned FKs, 100% domain range validity, 97.4% overall pass rate).
- **Dataset Inventory**: Direct inspection of the 7 CSV benchmark files with column breakdowns and row comparisons.
- **Audit Ledger**: Complete ingestion batch execution ledger and error tracking.

### 6.6 Running DWM Independently
1. Start the PostgreSQL / PGlite database:
   ```bash
   cd server && npm run dev
   ```
2. Start the Frontend Analytics UI:
   ```bash
   cd client && npm run dev
   ```
3. Navigate to `http://localhost:5173/analytics` or `http://localhost:5173/analytics/warehouse`.
All analytics features (OLAP, Association Mining, Clustering, Classification, and Ingestion) run strictly on the `dwh` schema without any dependency on operational `public` tables.

