# Document 04: Benchmark Dataset Catalog & Physical Specification

**Subsystem**: Standalone Data Warehousing and Data Mining (DWM) Analytical Intelligence Platform  
**Document**: [`04_DATASET_CATALOG.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/04_DATASET_CATALOG.md)  
**Location**: [`DWM-project/datasets/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/datasets/)  
**Status**: Verified Physical Inspection (50,150 Data Rows, ~4.95 MB Total)  

---

## 1. Master Dataset Inventory

The DWM analytical platform is pre-loaded with seven standardized synthetic academic benchmark datasets generated for reproducible empirical research:

| Dataset Identifier | Physical Filename | Physical File Size | Data Rows | Column Count | Primary Key / Natural Identifier | Corresponding Warehouse Table | Data Source Tag |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| **DS-1: Skills** | `skills.csv` | 12,836 bytes (12.5 KB) | **150** | 4 | `skill_id` | `dwh.dim_skill` | `indian_academic_benchmark` |
| **DS-2: Alumni** | `alumni.csv` | 374,645 bytes (365.9 KB) | **2,000** | 10 | `alumni_id` | `dwh.dim_alumni` | `indian_academic_benchmark` |
| **DS-3: Jobs** | `jobs.csv` | 978,415 bytes (955.5 KB) | **5,000** | 10 | `job_id` | `dwh.dim_job` | `indian_academic_benchmark` |
| **DS-4: Alumni Skills**| `alumni_skills.csv`| 1,550,239 bytes (1.48 MB) | **20,000** | 5 | Composite `(alumni_id, skill_id)` | `dwh.bridge_alumni_skill` | `indian_academic_benchmark` |
| **DS-5: Job Skills** | `job_skills.csv` | 1,140,125 bytes (1.09 MB) | **15,000** | 4 | Composite `(job_id, skill_id)` | `dwh.bridge_job_skill` | `indian_academic_benchmark` |
| **DS-6: Applications** | `applications.csv` | 672,760 bytes (657.0 KB) | **6,000** | 7 | `application_id` | `dwh.fact_job_application` | `indian_academic_benchmark` |
| **DS-7: Outcomes** | `career_outcomes.csv`| 224,389 bytes (219.1 KB) | **2,000** | 8 | `outcome_id` | `dwh.fact_career_outcomes` | `indian_academic_benchmark` |
| **Total** | **7 Benchmark Files** | **4,953,409 bytes (~4.95 MB)** | **50,150** | — | — | **15 Warehouse Tables** | — |

---

## 2. Detailed Dataset Specifications

### DS-1: `skills.csv`
- **Business Purpose**: Standardized technical skill taxonomy modeling engineering competencies required in the software and technology sectors.
- **Header Line**: `skill_id,skill_name,skill_category,data_source`
- **Row Count**: 150 rows.
- **Observed Categories**:
  - `Programming Languages` (e.g., Python, Java, TypeScript, Go, C++, Rust)
  - `Cloud & Infrastructure` (e.g., AWS, Docker, Kubernetes, Terraform)
  - `Data Science & AI` (e.g., PyTorch, TensorFlow, Scikit-Learn, Pandas)
  - `Web Technologies` (e.g., React, Node.js, Next.js, GraphQL)
  - `Databases` (e.g., PostgreSQL, MongoDB, Redis, Cassandra)
- **Natural Key**: `skill_id` format `SK-001` through `SK-150`.

---

### DS-2: `alumni.csv`
- **Business Purpose**: Profiles of graduated engineering alumni capturing graduation cohorts, academic degrees, current job designations, and accumulated industry experience.
- **Header Line**: `alumni_id,graduation_year,degree,field_of_study,current_role,industry,experience_years,location_region,career_level,data_source`
- **Row Count**: 2,000 rows.
- **Field Characteristics**:
  - `alumni_id`: Unique identifier formatted `ALU-0001` to `ALU-2000`.
  - `graduation_year`: Integer range $[2018, 2024]$.
  - `degree`: B.Tech (68%), M.Tech (18%), MCA (14%).
  - `field_of_study`: Computer Science, Information Technology, Electronics & Telecommunication, Artificial Intelligence & Data Science.
  - `experience_years`: Numeric floating point $[0.5, 7.0]$.
  - `location_region`: Indian technology corridors (Bengaluru, Mumbai, Pune, Hyderabad, Delhi NCR, Chennai) and International.
  - `career_level`: `Entry-Level`, `Mid-Level`, `Senior`, `Lead / Architect`.

---

### DS-3: `jobs.csv`
- **Business Purpose**: Campus placement job postings and corporate recruiter requisitions with company metadata, employment types, and experience levels.
- **Header Line**: `job_id,job_title,company_id,company_name,industry,location_region,employment_type,posted_date,experience_level,data_source`
- **Row Count**: 5,000 rows.
- **Field Characteristics**:
  - `job_id`: Unique requisition key `JOB-0001` to `JOB-5000`.
  - `company_name`: 39 distinct recruiters (e.g., Microsoft, Google, AWS, Goldman Sachs, Stripe, Atlassian, TCS, Infosys).
  - `employment_type`: Full-Time (85%), Internship-to-Full-Time (12%), Contract (3%).
  - `posted_date`: ISO dates $[2020-01-01, 2025-12-31]$.

---

### DS-4: `alumni_skills.csv`
- **Business Purpose**: Associative bridge linking alumni to their acquired technical skills, forming the market basket transactions for Apriori association mining.
- **Header Line**: `alumni_id,skill_id,proficiency_level,years_used,data_source`
- **Row Count**: 20,000 rows.
- **Density**: Average of 10 skills per alumnus ($\frac{20000}{2000} = 10.0$).
- **Proficiency Levels**: `Beginner` (15%), `Intermediate` (55%), `Expert` (30%).
- **Composite Primary Key**: `(alumni_id, skill_id)` strictly enforced with zero duplicate pairs.

---

### DS-5: `job_skills.csv`
- **Business Purpose**: Associative bridge linking job requisitions to mandatory and preferred skill requirements, forming the recruiter basket transactions for Mode B Apriori mining.
- **Header Line**: `job_id,skill_id,required_level,data_source`
- **Row Count**: 15,000 rows.
- **Density**: Exactly 3 skills required per job posting requisition ($\frac{15000}{5000} = 3.0$).
- **Composite Primary Key**: `(job_id, skill_id)`.

---

### DS-6: `applications.csv`
- **Business Purpose**: Longitudinal tracking of job application submissions by alumni candidates across active job requisitions.
- **Header Line**: `application_id,alumni_id,job_id,application_date,application_status,days_to_decision,data_source`
- **Row Count**: 6,000 rows.
- **Statuses**: `Submitted`, `Under Review`, `Shortlisted`, `Interview Scheduled`, `Offer Extended`, `Rejected`.
- **Chronological Rule**: `application_date` must occur on or after `posted_date` of the referenced job.
- **Foreign Keys**: `alumni_id -> alumni.csv`, `job_id -> jobs.csv`.

---

### DS-7: `career_outcomes.csv`
- **Business Purpose**: 6-month post-graduation longitudinal observation outcomes serving as the ground-truth labeled training set for supervised classification.
- **Header Line**: `outcome_id,alumni_id,observation_period_months,employed_within_6_months,career_level,industry,experience_years_at_observation,data_source`
- **Row Count**: 2,000 rows (one outcome observation per alumnus).
- **Target Variable**: `employed_within_6_months` (Boolean: 1 = Placed, 0 = Unplaced/Seeking).
- **Class Distribution**: 1,642 Placed (82.1%), 358 Seeking/Higher Studies (17.9%).

---

## 3. Cross-Dataset Relationship Matrix

```text
┌─────────────────────────┐           1:N           ┌─────────────────────────────┐
│   alumni.csv  │◄────────────────────────┤ alumni_skills.csv │
│       (2,000 rows)      │                         │        (20,000 rows)        │
└────────────┬────────────┘                         └──────────────┬──────────────┘
             │ 1:1                                                 │ N:1
             ▼                                                     ▼
┌─────────────────────────┐                         ┌─────────────────────────────┐
│synthetic_career_outcomes│                         │     skills.csv    │
│       (2,000 rows)      │                         │          (150 rows)         │
└─────────────────────────┘                         └──────────────▲──────────────┘
             │ 1:N                                                 │ N:1
             ▼                                                     │
┌─────────────────────────┐           N:1           ┌──────────────┴──────────────┐
│synthetic_application.csv├────────────────────────►│  job_skills.csv   │
│       (6,000 rows)      │                         │        (15,000 rows)        │
└─────────────────────────┘                         └──────────────▲──────────────┘
                                                                   │ N:1
                                                    ┌──────────────┴──────────────┐
                                                    │      jobs.csv     │
                                                    │         (5,000 rows)        │
                                                    └─────────────────────────────┘
```

---

## 4. Generator Reproducibility Specification

All 7 CSV datasets are generated deterministically by [`DWM-project/scripts/generate_dwm_datasets.py`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/scripts/generate_dwm_datasets.py):
- **Random Seed**: `random.seed(2026)` and `np.random.seed(2026)` initialized at entry point.
- **Statistical Distributions**:
  - Graduation Year: Discrete uniform distribution $U(2018, 2024)$.
  - Experience Years: Truncated normal distribution $\mathcal{N}(\mu=2.5, \sigma=1.2)$ clipped to $[0.5, 7.0]$.
  - Skill Portfolio Size: Truncated normal distribution $\mathcal{N}(\mu=10, \sigma=2)$ clipped to $[5, 18]$ skills per profile.
- **Integrity Validation**: Evaluated via [`DWM-project/scripts/validate_dwm_datasets.py`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/scripts/validate_dwm_datasets.py) which verifies 10 mathematical integrity checks with **10/10 checks passing**.

---

## 5. Dataset Architecture & Lineage Diagrams

The relationships and physical warehouse loading pathways for all 7 benchmark datasets are visually documented in:

1. **[`diagrams/05_dataset_relationships.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/05_dataset_relationships.mmd)**:
   - Illustrates the entity-relationship graph between `skills.csv`, `alumni.csv`, `jobs.csv`, `alumni_skills.csv`, `job_skills.csv`, `applications.csv`, and `career_outcomes.csv`.
   - Visualizes exact primary and foreign join keys (`alumni_id`, `skill_id`, `job_id`) and relational cardinalities ($1:1$, $1:N$).
   - Traces the physical mapping of each dataset to its corresponding dimension, bridge, and fact table in the PostgreSQL `dwh` schema.

2. **[`diagrams/06_etl_data_lineage.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/06_etl_data_lineage.mmd)**:
   - Documents the complete data lineage from CSV parsing and row validation through dry-run staging, surrogate key resolution (`_sk`), and transactional loading into facts and dimensions.

