# 07. Data Warehouse Architecture and Schema Design

## 1. Architectural Overview & Modeling Paradigm

The Data Warehousing and Data Mining (DWM) platform utilizes a **Fact Constellation (Galaxy Schema)** modeling paradigm rather than a single star or snowflake schema. In institutional and higher-education analytics, a single business process cannot adequately capture the multifaceted student-to-alumni journey. The lifecycle spans distinct operational and longitudinal milestones: academic progression, campus placement drives, post-graduation job application pipelines, longitudinal compensation progression, and 6-month graduate employment outcomes.

The constellation schema shares conformed dimensions across four distinct fact tables and three multivalued bridge tables within the isolated PostgreSQL `dwh` schema.

```
       +------------------+         +--------------------+
       |   dim_student    |         |     dim_alumni     |
       +--------+---------+         +---------+----------+
                |                             |
      +---------+---------+         +---------+----------+
      |  fact_placement   |         |fact_career_outcomes|
      +---------+---------+         +---------+----------+
                |                             |
       +--------+---------+         +---------+----------+
       |   dim_company    |<-------+|fact_salary_benchmk |
       +--------+---------+         +---------+----------+
                |                             |
       +--------+---------+                   |
       |     dim_job      |<------------------+
       +--------+---------+                   |
                |                             |
      +---------+---------+                   |
      |fact_job_applicatn |<------------------+
      +---------+---------+
                |
       +--------+---------+
       |     dim_date     |
       +------------------+
```

---

## 2. Table Classification Matrix

The analytical warehouse comprises **15 tables** categorized into four distinct dimensional modeling structures:

| Table Category | Table Name | Physical Table Identifier | Row Count (Verified) | Modeling Role |
| :--- | :--- | :--- | :--- | :--- |
| **Dimension** | Student Dimension | `dwh.dim_student` | 323 | Student academic profile, cohort, CGPA, backlogs |
| **Dimension** | Alumni Dimension | `dwh.dim_alumni` | 2,026 | Longitudinal graduate profile, employer, seniority |
| **Dimension** | Company Dimension | `dwh.dim_company` | 42 | Conformed corporate entity, tier, industry |
| **Dimension** | Skill Dimension | `dwh.dim_skill` | 165 | Conformed technical competency, taxonomy category |
| **Dimension** | Date Dimension | `dwh.dim_date` | 4,748 | Pre-computed temporal calendar (2018–2030) |
| **Dimension** | Job Requisitions | `dwh.dim_job` | 5,002 | Corporate vacancies, experience levels, titles |
| **Bridge Table** | Student-Skill Bridge | `dwh.bridge_student_skill` | 921 | M:N association, student proficiency ratings |
| **Bridge Table** | Alumni-Skill Bridge | `dwh.bridge_alumni_skill` | 20,013 | M:N association, alumni skill competency & years |
| **Bridge Table** | Job-Skill Bridge | `dwh.bridge_job_skill` | 15,008 | M:N association, job requisition required skills |
| **Fact Table** | Placement Fact | `dwh.fact_placement` | 274 | On-campus placement offers, packages, scores |
| **Fact Table** | Job Applications Fact| `dwh.fact_job_application` | 6,006 | Application pipeline, ATS scores, hiring funnel |
| **Fact Table** | Salary Benchmark Fact| `dwh.fact_salary_benchmark` | 24 | Longitudinal market compensation aggregates |
| **Fact Table** | Career Outcomes Fact | `dwh.fact_career_outcomes` | 2,002 | Supervised ground truth: 6-month placement target |
| **Audit/Ledger** | ETL Batches Ledger | `dwh.etl_batches` | 137 | Ingestion execution manifests and metadata |
| **Audit/Ledger** | ETL Batch Errors | `dwh.etl_batch_errors` | 46 | Row-level validation rejection logs and JSON payloads |

---

## 3. Conformed Dimensions and Surrogate Keys

### 3.1 Surrogate Key Strategy (`_sk`)
Every dimension table implements an integer or serial surrogate primary key (`_sk`). Natural keys (e.g., `natural_alumni_id`, `student_id_number`, `natural_job_id`) are preserved as indexed attributes with partial unique constraints:
- **Decoupling from Source Systems**: Internal surrogate keys isolate the data warehouse from operational identifier collisions, changes in student registration number formats, or synthetic generator prefixes.
- **Join Performance**: Integer surrogate keys optimize equi-joins across millions of candidate fact rows compared to variable-length character keys (`UUID` or `VARCHAR`).
- **Audit & Provenance**: Dimension records track origin via `record_source VARCHAR(50)`, distinguishing operational OLTP-derived rows (`'operational'`) from synthetic research records (`'indian_academic_benchmark'`).

### 3.2 Slowly Changing Dimensions (SCD Type 1 vs Type 2)
Longitudinal tracking of alumni professional careers requires managing changes in employer, job title, and geographic location:
- **SCD Type 2 Implementation in `dwh.dim_alumni`**:
  - `valid_from DATE DEFAULT CURRENT_DATE`
  - `valid_to DATE NULL`
  - `is_current BOOLEAN DEFAULT TRUE`
  - When an alumnus changes positions or companies, the historical record can be marked `is_current = FALSE` with `valid_to` populated, and a new record inserted with the updated role and current timestamp.
- **SCD Type 1 in `dwh.dim_student` and `dwh.dim_company`**: Academic backlogs, CGPA, and company headquarters tiers are updated in-place via overwrite semantics.

### 3.3 Pre-computed Date Dimension (`dwh.dim_date`)
Temporal analysis does not rely on ad-hoc date parsing in SQL queries. A conformed, pre-computed calendar dimension covers dates from **2018-01-01 to 2030-12-31** (4,748 rows):
- **Surrogate Key Pattern**: Smart integer key formatted as `YYYYMMDD` (e.g., `20240515`), enabling direct numerical partition pruning and range comparisons.
- **Calendar Attributes**: `year`, `quarter`, `month`, `month_name`, `day_of_month`, `day_of_week`, `day_name`, `is_weekend`.
- **Higher Education Attributes**:
  - `academic_year`: Formatted as academic cycles (e.g., `'2023-2024'`).
  - `academic_semester`: Conformed educational terms (`'Odd / Fall'` for months 7–12; `'Even / Spring'` for months 1–6).

---

## 4. Fact Table Grain & Metric Specifications

### 4.1 Fact Placement (`dwh.fact_placement`)
- **Business Process**: Campus placement drives, aptitude tests, technical interviews, and salary offers extended to final-year students.
- **Formal Grain**: *One row per placement offer extended to a student by a specific hiring company on a specific offer date.*
- **Enforced Grain Constraint**: `UNIQUE (student_sk, company_sk, offer_date_sk)`
- **Measures (Additive & Semi-Additive)**:
  - `annual_package_lpa NUMERIC(8,2)`: Additive annual CTC package in Lakhs Per Annum.
  - `base_salary_inr NUMERIC(12,2)`: Additive base fixed compensation.
  - `bonus_inr NUMERIC(12,2)`: Additive variable component or joining bonus.
  - `offers_count INT`: Additive counter (default 1).
  - `aptitude_score NUMERIC(5,2)`: Non-additive assessment score (0–100).
  - `technical_test_score NUMERIC(5,2)`: Non-additive technical coding score (0–100).
  - `interview_score NUMERIC(5,2)`: Non-additive interview evaluation (0–100).
  - `readiness_score INT`: Composite index of placement preparedness.

### 4.2 Fact Job Applications (`dwh.fact_job_application`)
- **Business Process**: Graduate career portal job applications, applicant tracking system (ATS) matching, shortlisting, and hiring funnel stages.
- **Formal Grain**: *One row per job application submitted by an applicant (student or alumnus) to an employer requisition on a specific application date.*
- **Enforced Grain Constraints**:
  - `uq_dwh_fact_app_grain`: `UNIQUE (student_sk, company_sk, applied_date_sk)` for student campus applications.
  - `uq_dwh_fact_app_alumni_grain`: `UNIQUE (alumni_sk, job_sk, applied_date_sk)` for alumni corporate applications.
  - `uq_dwh_fact_app_natural`: `UNIQUE (natural_application_id)` across all ingested synthetic rows.
- **Measures & Status Flags**:
  - `ats_match_score INT`: Resume-to-job requisition semantic keyword matching percentage (0–100).
  - `days_to_decision INT`: Duration in days between application submission and corporate response.
  - `is_shortlisted INT`: Discrete boolean flag (0 or 1) indicating applicant progression.
  - `is_selected INT`: Discrete hiring outcome flag (0 or 1).

### 4.3 Fact Salary Benchmark (`dwh.fact_salary_benchmark`)
- **Business Process**: Aggregated industry compensation benchmarking across experience bands, corporate tiers, and job roles.
- **Formal Grain**: *One row per compensation benchmark observation for an alumni cohort and corporate tier at a specific experience level.*
- **Foreign Key Constraints**: `alumni_sk REFERENCES dwh.dim_alumni`, `company_sk REFERENCES dwh.dim_company`, `effective_date_sk REFERENCES dwh.dim_date`.
- **Measures**:
  - `experience_years NUMERIC(4,1)`: Experience horizon.
  - `total_annual_comp_inr NUMERIC(12,2)`: Additive compensation benchmark.
  - `salary_band_tier VARCHAR(30)`: Categorical bracket (e.g., `'6-12 LPA'`, `'12-25 LPA'`).

### 4.4 Fact Career Outcomes (`dwh.fact_career_outcomes`)
- **Business Process**: Mandatory higher education compliance and accreditation tracking (e.g., NAAC / NIRF institutional reporting) measuring employment status within 6 months of graduation.
- **Formal Grain**: *Strictly one row per graduated alumnus recording 6-month employment outcome.*
- **Enforced Grain Constraint**: `UNIQUE (alumni_sk)` (`uq_dwh_fact_career_outcomes_alumni`).
- **Target Measures**:
  - `employed_within_6_months INT NOT NULL`: Supervised binary classification ground truth target ($Y \in \{0, 1\}$).
  - `observation_period_months INT`: Standardized follow-up horizon (default 6).
  - `experience_years_at_observation NUMERIC(4,1)`: Verified experience at milestone.
  - `is_synthetic_educational_target BOOLEAN`: Transparency indicator explicitly marking synthetic training targets.

---

## 5. Many-to-Many Relationships and Bridge Tables

Relational normal forms cannot represent multi-skill competencies (e.g., an alumnus possessing 12 distinct skills, or a job requiring 8 skills) without multivalued bridge structures. Traditional comma-delimited strings in dimension rows violate 1NF, prevent indexing, and preclude efficient analytical filtering.

The schema uses three dedicated bridge tables:

### 5.1 `dwh.bridge_student_skill`
- **Composite Primary Key**: `(student_sk, skill_sk)`
- **Referential Integrity**: Cascading foreign keys to `dim_student` and `dim_skill`.
- **Attribute**: `proficiency_level VARCHAR(30)` (`'beginner'`, `'intermediate'`, `'advanced'`).

### 5.2 `dwh.bridge_alumni_skill`
- **Composite Primary Key**: `(alumni_sk, skill_sk)`
- **Referential Integrity**: Cascading foreign keys to `dim_alumni` and `dim_skill`.
- **Verified Row Count**: 20,013 rows connecting 2,000 synthetic alumni to 150 skills (mean density: ~10.0 skills/alumnus).
- **Attributes**: `proficiency_level`, `years_used INT`.

### 5.3 `dwh.bridge_job_skill`
- **Composite Primary Key**: `(job_sk, skill_sk)`
- **Referential Integrity**: Cascading foreign keys to `dim_job` and `dim_skill`.
- **Verified Row Count**: 15,008 rows connecting 5,000 synthetic job requisitions to 150 skills (mean density: ~3.0 skills/job).
- **Attribute**: `required_level VARCHAR(30)` (`'Required'`, `'Preferred'`).

---

## 6. Physical Indexing & Query Optimization

To ensure real-time response times ($< 50\text{ ms}$) across OLAP aggregations, Apriori basket extractions, and data mining feature matrix queries, the schema defines **22 targeted B-Tree indexes**:

| Target Table | Index Name | Indexed Columns | Analytical Purpose |
| :--- | :--- | :--- | :--- |
| `dim_student` | `idx_dwh_dim_student_dept` | `(department)` | Fast department-wise filtering and OLAP roll-up |
| `dim_student` | `idx_dwh_dim_student_grad` | `(graduation_year)` | Cohort and graduation year slice/dice |
| `dim_alumni` | `idx_dwh_dim_alumni_company`| `(current_company)` | Employer distribution queries |
| `dim_alumni` | `idx_dwh_dim_alumni_industry`| `(industry)` | Industry-sector breakdown |
| `dim_alumni` | `idx_dwh_dim_alumni_grad` | `(graduation_year)` | Graduation year temporal trend analysis |
| `dim_company` | `idx_dwh_dim_company_tier` | `(company_tier)` | Placement tier analysis ('Tier 1', 'Tier 2') |
| `dim_skill` | `idx_dwh_dim_skill_category`| `(category)` | Skill domain roll-up ('Cloud', 'Languages') |
| `dim_date` | `idx_dwh_dim_date_year` | `(year, month)` | Fast calendar range queries and time slicing |
| `dim_job` | `idx_dwh_dim_job_comp` | `(company_sk)` | Job requisition employer lookup |
| `dim_job` | `idx_dwh_dim_job_title` | `(job_title)` | Keyword search and role filtering |
| `bridge_alumni_skill` | `idx_dwh_bridge_alum_skill` | `(skill_sk)` | Fast inverted index for skill-to-alumni mining |
| `bridge_job_skill` | `idx_dwh_bridge_job_skill` | `(skill_sk)` | Fast inverted index for job skill demand |
| `fact_placement` | `idx_dwh_fact_placement_stud`| `(student_sk)` | Student placement outcome lookup |
| `fact_placement` | `idx_dwh_fact_placement_comp`| `(company_sk)` | Company recruitment outcome lookup |
| `fact_placement` | `idx_dwh_fact_placement_date`| `(offer_date_sk)` | Placement date temporal joins |
| `fact_placement` | `idx_dwh_fact_placement_pack`| `(annual_package_lpa)`| Salary package percentile and bucket scanning |
| `fact_job_application`| `idx_dwh_fact_app_student` | `(student_sk)` | Student application pipeline analysis |
| `fact_job_application`| `idx_dwh_fact_app_company` | `(company_sk)` | Employer candidate funnel queries |
| `fact_salary_benchmk`| `idx_dwh_fact_salary_comp` | `(company_sk)` | Company salary benchmarking |
| `fact_salary_benchmk`| `idx_dwh_fact_salary_exp` | `(experience_years)` | Experience-to-compensation regressions |
| `fact_career_outcomes`| `idx_dwh_fact_outcomes_source`| `(record_source)` | Training dataset partition isolation |
| `etl_batch_errors` | `idx_dwh_etl_errors_batch` | `(batch_id)` | Audit log and validation error reporting |

---

## 7. Schema Isolation and Operational Decoupling

A critical architectural requirement verified during the inspection is the **complete decoupling** between the operational database (`public` schema) and the analytical data warehouse (`dwh` schema):

1. **Absence of Cross-Schema Foreign Keys**:
   - Examination of [020_dwm_warehouse_schema.sql](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/database/020_dwm_warehouse_schema.sql) and [021_dwm_synthetic_integration.sql](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/database/021_dwm_synthetic_integration.sql) confirms that **no table in `dwh` contains a foreign key referencing `public.users` or any other `public.*` table**.
   - Fields such as `source_user_id UUID` in `dwh.dim_student` and `dwh.dim_alumni` are stored as unconstrained informational attributes, allowing historical tracking without blocking operational user lifecycle operations or introducing lock contention.
2. **Transactional and Mutation Isolation**:
   - The DWM server interacts exclusively with `dwh.*` tables.
   - Dropping, truncating, or updating operational `public` tables has zero structural impact on `dwh` queries.
   - Operational Alumni Portal sync routes and triggers have been completely removed, establishing pure read-only and CSV-staged analytical pipelines.

---

## 8. Physical Warehouse Diagram References

For visual exploration and reproduction of the warehouse schema:
- **Master Entity Relationship Diagram**: [`diagrams/04_warehouse_erd.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/04_warehouse_erd.mmd) provides the complete physical schema mapping all 15 tables, 157 columns, surrogate/natural keys, and 22 referential integrity constraints.
- **Data Ingestion and Surrogate Key Resolution**: [`diagrams/06_etl_data_lineage.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/06_etl_data_lineage.mmd) illustrates how natural keys from CSV datasets resolve into surrogate integer keys (`_sk`) across the dimensional hierarchy.

