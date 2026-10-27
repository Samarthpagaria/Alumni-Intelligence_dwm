# DWM Benchmark Dataset Pack — Warehouse Schema & ETL Mapping Specification

## 1. Executive Summary & Provenance Architecture

This document specifies the authoritative dimensional mapping, schema reconciliation, relational key resolution, and ETL staging/commit pipeline between the **~50,150-record DWM Benchmark Dataset Pack** located in [`datasets/`](datasets/) and the **Alumni Intelligence & Career Analytics Platform** warehouse implementation (`dwh.*` schema defined in [`020_dwm_warehouse_schema.sql`](database/migrations/020_dwm_warehouse_schema.sql) and [`021_dwm_synthetic_integration.sql`](database/migrations/021_dwm_synthetic_integration.sql)).

### Core Guarantees & Safeguards Enforced:
1. **Zero Contamination of Operational Tables**: Synthetic data is completely isolated in the `dwh.*` analytical schema. Not a single operational table in `public.*` (`users`, `alumni_profiles`, `jobs`, `job_applications`, `skills`, `events`, `donations`) is modified or overwritten.
2. **Deterministic Provenance Labeling**: Every synthetic record across dimensions, bridges, and facts is stamped with `record_source = 'indian_academic_benchmark'`. Operational records carry `record_source = 'operational'` or `record_source = 'benchmark'`.
3. **Surrogate Key Integrity**: Persistent synthetic natural IDs (`SKILL-*`, `IND-ALUM-*`, `IND-JOB-*`, `IND-APP-*`, `IND-OUT-*`) resolve deterministically to warehouse integer surrogate keys (`skill_sk`, `alumni_sk`, `job_sk`, `company_sk`).
4. **Relational & Chronological Validation**: Application submissions strictly adhere to $T_{application} \ge T_{job\_posted}$. Duplicate composite pairs, missing foreign keys, and malformed target classes are rejected with row-level error reporting in `dwh.etl_batch_errors`.
5. **Transactional Commits & Rollback**: Imports execute inside atomic transactions (`withTransaction`). Repeated imports are idempotent (`ON CONFLICT` resolution). Completed batches can be reversed surgically via `rollbackBatchImport(batchId)` or `POST /api/analytics/etl/rollback-import`.
6. **Preview / Dry-Run Mode**: Operators can preview any CSV upload with `{ dryRun: true }` to inspect predicted insertions, updates, rejections, and skips before any database write.

---

## 2. Strict Ingestion Sequence & Dependency Graph

To prevent foreign key constraint violations, datasets must be staged and committed in strict topological order:

```
[1. skills.csv]   ──┐
                              ├──> [4. alumni_skills.csv] (Bridge)
[2. alumni.csv]   ──┼──> [5. job_skills.csv]    (Bridge)
                              ├──> [6. applications.csv]    (Fact)
[3. jobs.csv]     ──┘──> [7. career_outcomes.csv] (1:1 Target)
```

| Order | Dataset Type | Source File | Destination Table | Pre-Requisite Dependencies |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `skills` | `skills.csv` | `dwh.dim_skill` | None (Independent dimension) |
| **2** | `alumni` | `alumni.csv` | `dwh.dim_alumni` | None (Independent dimension) |
| **3** | `jobs` | `jobs.csv` | `dwh.dim_company`, `dwh.dim_job` | `dwh.dim_date` (Pre-seeded 2018–2030) |
| **4** | `alumni_skills` | `alumni_skills.csv` | `dwh.bridge_alumni_skill` | Requires Step 1 (`dim_skill`) & Step 2 (`dim_alumni`) |
| **5** | `job_skills` | `job_skills.csv` | `dwh.bridge_job_skill` | Requires Step 1 (`dim_skill`) & Step 3 (`dim_job`) |
| **6** | `applications` | `applications.csv` | `dwh.fact_job_application` | Requires Step 2 (`dim_alumni`) & Step 3 (`dim_job`) |
| **7** | `career_outcomes` | `career_outcomes.csv` | `dwh.fact_career_outcomes` | Requires Step 2 (`dim_alumni`) (Strict 1:1) |

---

## 3. Dataset-by-Dataset Mapping & Transformations

### 3.1. `skills.csv` (150 Records)
- **Source Grain**: 1 row = 1 normalized skill concept.
- **Target Table**: `dwh.dim_skill`
- **Natural Key**: `natural_skill_id` (e.g., `SKILL-001`)
- **Surrogate Key Generated**: `skill_sk SERIAL PRIMARY KEY`

| Source CSV Column | Target Warehouse Column | Data Type | Transformation & Validation Rules |
| :--- | :--- | :--- | :--- |
| `skill_id` | `natural_skill_id` | `VARCHAR(50) UNIQUE` | Trimmed, non-empty. Indexed via `uq_dwh_dim_skill_natural`. |
| `skill_name` | `skill_name` | `VARCHAR(100) UNIQUE` | Trimmed canonical name. Conflict resolution target. |
| `skill_category` | `category` | `VARCHAR(50)` | Aliased via `category` $\leftarrow$ `skill_category`. Default: `'General'`. |
| `data_source` | `record_source` | `VARCHAR(50)` | Standardized to `'indian_academic_benchmark'`. |

---

### 3.2. `alumni.csv` (2,000 Records)
- **Source Grain**: 1 row = 1 graduated alumnus profile.
- **Target Table**: `dwh.dim_alumni`
- **Natural Key**: `natural_alumni_id` (e.g., `IND-ALUM-000001`)
- **Surrogate Key Generated**: `alumni_sk SERIAL PRIMARY KEY`

| Source CSV Column | Target Warehouse Column | Data Type | Transformation & Validation Rules |
| :--- | :--- | :--- | :--- |
| `alumni_id` | `natural_alumni_id` | `VARCHAR(50) UNIQUE` | Indexed via `uq_dwh_dim_alumni_natural`. |
| `graduation_year` | `graduation_year` | `INT` | Range validated: $1980 \le Y \le 2035$. |
| `degree` | `degree` | `VARCHAR(100)` | Standardized degree title (e.g. `B.Tech CSE`, `MCA`). |
| `field_of_study` | `department` | `VARCHAR(100)` | Aliased via `department` $\leftarrow$ `field_of_study`. |
| `current_role` | `job_role` | `VARCHAR(150)` | Standardized job role. |
| `industry` | `industry` | `VARCHAR(100)` | Corporate sector profile (e.g. `SaaS`, `BFSI`). |
| `experience_years` | `experience_years` | `NUMERIC(4,1)` | $E \ge 0$. |
| `location_region` | `city` | `VARCHAR(100)` | Parsed base metropolitan hub: `SPLIT_PART(location_region, ' (', 1)`. |
| *(derived)* | `country` | `VARCHAR(50)` | Set to `'India'`. |
| `career_level` | `career_level` | `VARCHAR(50)` | Seniority bracket (`Entry-Level`, `Mid-Level`, `Senior`, `Lead/Principal`). |
| `data_source` | `record_source` | `VARCHAR(50)` | Standardized to `'indian_academic_benchmark'`. |

---

### 3.3. `jobs.csv` (5,000 Records)
- **Source Grain**: 1 row = 1 corporate requisition.
- **Target Tables**: `dwh.dim_company` (upserted corporate dimension) and `dwh.dim_job` (requisition dimension).
- **Natural Key**: `natural_job_id` (e.g., `IND-JOB-000001`)
- **Surrogate Key Generated**: `job_sk SERIAL PRIMARY KEY`

| Source CSV Column | Target Table & Column | Data Type | Transformation & Validation Rules |
| :--- | :--- | :--- | :--- |
| `job_id` | `dwh.dim_job.natural_job_id` | `VARCHAR(50) UNIQUE` | Unique requisition identifier. |
| `job_title` | `dwh.dim_job.job_title` | `VARCHAR(150)` | Requisition title. |
| `company_id` | `dwh.dim_company.natural_company_id` | `VARCHAR(50)` | Unique corporate entity natural ID. |
| `company_name` | `dwh.dim_company.company_name` | `VARCHAR(150) UNIQUE` | Upserted to resolve `company_sk`. Also copied to `dim_job.company_name`. |
| `industry` | `dwh.dim_company.industry`<br>`dwh.dim_job.industry` | `VARCHAR(100)` | Industry vertical. |
| `location_region` | `dwh.dim_job.location_region` | `VARCHAR(150)` | Regional hiring location. |
| `employment_type` | `dwh.dim_job.employment_type` | `VARCHAR(50)` | Values: `Full-Time`, `Contract`, `Internship`. |
| `posted_date` | `dwh.dim_job.posted_date`<br>`dwh.dim_job.posted_date_sk` | `DATE`<br>`INT` | Validated ISO date. Integer surrogate resolved to `dim_date.date_sk` (`YYYYMMDD`). |
| `experience_level` | `dwh.dim_job.experience_level` | `VARCHAR(50)` | Seniority tier. |
| `data_source` | `record_source` | `VARCHAR(50)` | Standardized to `'indian_academic_benchmark'`. |

---

### 3.4. `alumni_skills.csv` (20,000 Records)
- **Source Grain**: 1 row = 1 alumnus-to-skill competency link (~10 skills per alumnus).
- **Target Table**: `dwh.bridge_alumni_skill`
- **Natural Keys**: `(alumni_id, skill_id)`
- **Surrogate Resolution**: `(alumni_sk, skill_sk)` composite primary key.

| Source CSV Column | Target Warehouse Column | Resolution & Constraints |
| :--- | :--- | :--- |
| `alumni_id` | `alumni_sk` | Resolved against `dwh.dim_alumni.natural_alumni_id`. Row rejected if missing. |
| `skill_id` | `skill_sk` | Resolved against `dwh.dim_skill.natural_skill_id`. Row rejected if missing. |
| `proficiency_level` | `proficiency_level` | Domain: `Beginner`, `Intermediate`, `Advanced`, `Expert`. |
| `years_used` | `years_used` | Integer practical experience duration ($Y \ge 0$). |
| `data_source` | `record_source` | Standardized to `'indian_academic_benchmark'`. |

---

### 3.5. `job_skills.csv` (15,000 Records)
- **Source Grain**: 1 row = 1 job-to-skill requirement link (3 skills per requisition).
- **Target Table**: `dwh.bridge_job_skill`
- **Natural Keys**: `(job_id, skill_id)`
- **Surrogate Resolution**: `(job_sk, skill_sk)` composite primary key.

| Source CSV Column | Target Warehouse Column | Resolution & Constraints |
| :--- | :--- | :--- |
| `job_id` | `job_sk` | Resolved against `dwh.dim_job.natural_job_id`. Row rejected if missing. |
| `skill_id` | `skill_sk` | Resolved against `dwh.dim_skill.natural_skill_id`. Row rejected if missing. |
| `required_level` | `required_level` | Domain: `Mandatory`, `Preferred`, `Good-to-have`. |
| `data_source` | `record_source` | Standardized to `'indian_academic_benchmark'`. |

---

### 3.6. `applications.csv` (6,000 Records)
- **Source Grain**: 1 row = 1 recruitment application lifecycle submission.
- **Target Table**: `dwh.fact_job_application`
- **Natural Key**: `natural_application_id` (e.g., `IND-APP-000001`)

| Source CSV Column | Target Warehouse Column | Resolution, Transformation & Temporal Checks |
| :--- | :--- | :--- |
| `application_id` | `natural_application_id` | Unique application tracking ID. Indexed via `uq_dwh_fact_app_natural`. |
| `alumni_id` | `alumni_sk` | Resolved against `dwh.dim_alumni.natural_alumni_id`. Row rejected if missing. |
| `job_id` | `job_sk`<br>`company_sk` | Resolved against `dwh.dim_job.natural_job_id`. Inherits job's `company_sk`. |
| `application_date` | `applied_date_sk` | Validated ISO date. Verified: $T_{application} \ge T_{job\_posted}$. Transformed to `YYYYMMDD`. |
| `application_status` | `application_status`<br>`is_shortlisted`<br>`is_selected` | Domain: `applied`, `shortlisted`, `interviewed`, `offered`, `hired`, `rejected`.<br>`is_shortlisted = (status IN ('shortlisted', 'interviewed', 'offered', 'hired') ? 1 : 0)`.<br>`is_selected = (status IN ('offered', 'hired') ? 1 : 0)`. |
| `days_to_decision` | `days_to_decision` | Integer turnaround duration, or `NULL` for in-process stages. |
| `data_source` | `record_source` | Standardized to `'indian_academic_benchmark'`. |

---

### 3.7. `career_outcomes.csv` (2,000 Records)
- **Source Grain**: 1 row = 1 alumnus 6-month career status (Strict 1:1 with `alumni.csv`).
- **Target Table**: `dwh.fact_career_outcomes`
- **Natural Key**: `natural_outcome_id` (e.g., `IND-OUT-000001`)
- **Foreign Key / 1:1 Grain**: `alumni_sk INT UNIQUE REFERENCES dwh.dim_alumni (alumni_sk)`

| Source CSV Column | Target Warehouse Column | Resolution & Classification Purpose |
| :--- | :--- | :--- |
| `outcome_id` | `natural_outcome_id` | Unique outcome identifier. |
| `alumni_id` | `alumni_sk` | Strict 1:1 foreign key joining features from `dim_alumni`. Enforced via unique index `uq_dwh_fact_career_outcomes_alumni`. |
| `observation_period_months` | `observation_period_months` | Fixed at 6 months across all samples. |
| `employed_within_6_months` | `employed_within_6_months` | **Ground Truth Binary Target Label (0 or 1)**. Validated: must strictly equal 0 or 1. |
| `career_level` | `career_level` | Feature dimension. |
| `industry` | `industry` | Feature dimension. |
| `experience_years_at_observation` | `experience_years_at_observation` | Numerical predictor variable. |
| `data_source` | `record_source` | Standardized to `'indian_academic_benchmark'`. |
| *(constant)* | `is_synthetic_educational_target` | Explicitly `TRUE` to prevent confusion with empirical placement records. |

---

## 4. Operational Ingestion, Preview & Rollback Procedures

### 4.1. Dry-Run / Preview Workflow
Before staging or committing any CSV, the service exposes an idempotent dry-run preview:
- **API**: Send multipart form with `dryRun: true` or `?dryRun=true` to `POST /api/analytics/etl/upload`.
- **Response**:
  ```json
  {
    "success": true,
    "status": "DRY_RUN_PREVIEW",
    "dryRun": true,
    "rowsTotal": 2000,
    "rowsValid": 2000,
    "rowsToInsert": 2000,
    "rowsToUpdate": 0,
    "rowsToReject": 0,
    "rowsToSkip": 0,
    "preview": [...],
    "sampleErrors": []
  }
  ```
- **Database Safety**: Zero rows are inserted into `dwh.etl_batches` or any warehouse table during dry-run.

### 4.2. Staging & Transactional Commit
1. **Upload & Stage**: `POST /api/analytics/etl/upload` (without dryRun) parses headers, runs row validations, checks foreign keys and chronology against the live warehouse, logs invalid rows in `dwh.etl_batch_errors`, and registers a staged batch in `dwh.etl_batches` with `status = 'staged'`.
2. **Confirm & Commit**: `POST /api/analytics/etl/confirm-import` with `{ "batchId": "<uuid>" }` executes atomic insertion inside `withTransaction`. Once committed, updates batch to `status = 'completed'` and records `rows_inserted`.
3. **Idempotency**: Repeated commits of the same batch are prevented by state verification (`status !== 'staged'`). Re-uploading identical rows triggers `ON CONFLICT` updates without duplicate row inflation.

### 4.3. Surgical Rollback Procedure
If a batch must be reversed due to erroneous source data:
- **API**: Send authenticated request to `POST /api/analytics/etl/rollback-import`:
  ```json
  {
    "batchId": "c51669bb-9bc2-40ed-af5a-fd9336e7017c"
  }
  ```
- **Service Operation**:
  ```javascript
  import { rollbackBatchImport } from './src/services/dwh/csvIngestionService.js'
  const result = await rollbackBatchImport(batchId)
  ```
- **Surgical Mechanism**: Uses the batch's preserved `staged_data` natural IDs to delete **only the records created by that specific batch**, leaving all other batches, operational data, and benchmark series completely untouched. Updates batch ledger status to `'rolled_back'`.

---

## 5. Verified Small-Sample Test Results

A verified small-sample test was executed using `server/scripts/synthetic-sample-import.mjs` against the local development database:

| Pipeline Step | Source Dataset | Records Staged | Records Valid | Records Inserted | Rejections | Result |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| 1. Skills Dimension | `skills.csv` | 10 | 10 | 10 | 0 | **PASS** |
| 2. Alumni Dimension | `alumni.csv` | 10 | 10 | 10 | 0 | **PASS** |
| 3. Jobs Dimension | `jobs.csv` | 10 | 10 | 10 | 0 | **PASS** |
| 4. Alumni Skills Bridge | `alumni_skills.csv` | 15 | 15 | 15 | 0 | **PASS** |
| 5. Job Skills Bridge | `job_skills.csv` | 2 | 2 | 2 | 0 | **PASS** |
| 6. Applications Fact | `applications.csv` | 10 | 10 | 10 | 0 | **PASS** |
| 7. Career Outcomes Fact | `career_outcomes.csv` | 10 | 10 | 10 | 0 | **PASS** |

### Verified Database Invariant Audit:
- **Operational Alumni Profiles**: 24 records (Intact, 0 modified).
- **Operational Users**: 0 synthetic records (Strictly zero contamination).
- **Synthetic Records Provenance**: 100% stamped as `indian_academic_benchmark`.
- **Surrogate Linkage**: All bridge and fact foreign keys resolve to genuine parent dimension keys without orphan rows.

---

## 6. Exact Instructions for Approving the Full 50,150-Record Import

To execute the full dataset ingestion after review:

### Step 1: Execute Full Dataset Dry-Run Preview
Inspect predicted row actions across all 50,150 rows without writing to the database:
```bash
cd server
node scripts/synthetic-full-import.mjs --dry-run
```

### Step 2: Approve & Execute Full Transactional Import
To proceed with importing all 50,150 records into the warehouse:
```bash
cd server
node scripts/synthetic-full-import.mjs --confirm
```

---

## 7. Known Limitations & Precautions

1. **Academic Demonstration Data**: All corporate entities (*VistaraGrid Technologies*, *Kavach CyberSec Systems*, etc.) and simulated metrics are designed exclusively for academic DWM laboratory exercises and machine learning benchmarks. They must not be interpreted as empirical market hiring statistics.
2. **PostgreSQL Single-Session Wire Protocol**: The embedded PGlite development database utilizes a single-session wire protocol. Automated scripts utilize `ensureDevDatabase()` to manage connection lifecycles cleanly.
3. **Phase 5 Modeling Boundary**: This phase strictly establishes the data engineering and integration foundation. Supervised machine learning algorithms (Decision Trees, Naive Bayes, K-Means clustering, Association Rule Mining) will be implemented in Phase 5.
