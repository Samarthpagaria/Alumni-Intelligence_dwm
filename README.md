# Data Warehousing & Data Mining (DWM) Analytical Intelligence Platform

An independent, standalone enterprise-grade Data Warehousing and Data Mining platform designed for academic intelligence, student placement forecasting, career progression tracking, multidimensional OLAP cubes, and unsupervised/supervised machine learning.

Decoupled completely from the operational Alumni Portal database, operating exclusively on its own dimensional warehouse schema (`dwh.*`) and synthetic benchmark datasets.

---

## 1. System Architecture Diagram

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   DWM Standalone Analytics Cockpit                    │
│                        (React 19 / Vite 6)                             │
│                  http://localhost:5174 (Port 5174)                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON API Proxy
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
│  • dim_student (308 rows)         │  • fact_placement (259 rows)       │
│  • dim_alumni (2,024 rows)        │  • fact_job_application (6,004)    │
│  • dim_company (39 rows)          │  • fact_career_outcomes (2,000)    │
│  • dim_skill (163 rows)           │  • fact_salary_benchmark (24)      │
│  • dim_job (5,000 rows)           │  • bridge_student_skill (921)      │
│  • dim_date (4,748 rows)          │  • bridge_alumni_skill (20,000)    │
│                                   │  • bridge_job_skill (15,000)       │
│  Audit (2):                       │                                    │
│  • etl_batches (37 batches)       │  • etl_batch_errors (1 error log)  │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Directory Structure

```text
DWM-project/
├── client/                      # Standalone React 19 Frontend (Vite)
│   ├── src/
│   │   ├── components/analytics/# Analytics Cards, Charts, FilterBar, Tables
│   │   ├── context/             # Standalone Analyst AuthContext
│   │   ├── layouts/             # AnalyticsLayout (Sidebar, navigation shell)
│   │   ├── pages/analytics/     # 10 Analytics Pages & Cockpits:
│   │   │   ├── AnalyticsOverview.jsx          # Executive KPI Cockpit
│   │   │   ├── AnalyticsWarehouseOverview.jsx # Interactive ERD & Explorer
│   │   │   ├── AnalyticsCareer.jsx            # Placements & Salary Trends
│   │   │   ├── AnalyticsSkills.jsx            # Skill Demand Intelligence
│   │   │   ├── AnalyticsAlumni.jsx            # Geographic & Industry Insights
│   │   │   ├── AnalyticsOLAP.jsx              # Multidimensional Cube Explorer
│   │   │   ├── AnalyticsMining.jsx            # Apriori, K-Means & Classifier
│   │   │   ├── AnalyticsDataManagement.jsx    # CSV Ingestion & Audit Ledger
│   │   │   └── AnalyticsDataDictionary.jsx    # Schema Field Catalog
│   │   ├── services/            # analytics.service.js, datamining.service.js
│   │   ├── App.jsx              # Standalone router
│   │   ├── index.css            # Swiss Minimal Dark Theme & Tailwind CSS
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js           # Dev server configured for port 5174
│
├── server/                      # Standalone Express 5 API Backend
│   ├── src/
│   │   ├── config/              # database.js, dwh.js, env.js
│   │   ├── controllers/         # analyticsController.js, dataminingController.js
│   │   ├── middleware/          # auth.js, upload.js, validate.js, security.js
│   │   ├── routes/              # analyticsRoutes.js, dataminingRoutes.js, index.js
│   │   ├── services/
│   │   │   ├── dwh/             # warehouseRepo, overviewService, csvIngestion, etlPipeline
│   │   │   ├── datamining/      # associationRules, clustering, classification, eval
│   │   │   └── mining/          # miningEngine façade
│   │   └── utils/               # dataminingValidation, errors, logger, response
│   ├── tests/                   # 78 Automated Unit & Integration Tests:
│   │   ├── helpers/             # testDatabase.js (Isolated PGlite instance)
│   │   ├── analytics.test.js    # 54 warehouse, OLAP & API tests
│   │   ├── datamining.association.test.js     # 7 Apriori unit tests
│   │   ├── datamining.classification.test.js  # 4 Classifier unit tests
│   │   ├── datamining.clustering.test.js      # 5 K-Means unit tests
│   │   └── datamining.integration.test.js     # 8 Mining REST API integration tests
│   ├── package.json
│   └── server.js                # Server entry point (port 5001)
│
├── datasets/                    # 7 Standard CSV Benchmark Datasets
│   ├── skills.csv                             # 150 skill taxonomy records
│   ├── alumni.csv                             # 2,000 alumni career profiles
│   ├── jobs.csv                               # 5,000 job requisitions
│   ├── alumni_skills.csv                      # 20,000 alumni-skill associations
│   ├── job_skills.csv                         # 15,000 job-skill requirements
│   ├── applications.csv                       # 6,000 job applications
│   └── career_outcomes.csv                    # 2,000 6-month career outcomes
│
├── scripts/                     # Dataset Generator & Validator Python Scripts
│   ├── generate_dwm_datasets.py # Reproducible synthetic dataset generator
│   └── validate_dwm_datasets.py # 10-point mathematical integrity validation
│
├── database/                    # Warehouse Schema & SQL Migrations
│   ├── 020_dwm_warehouse_schema.sql          # Base dwh schema and 11 tables
│   ├── 020_dwm_warehouse_schema.down.sql     # Rollback schema
│   ├── 021_dwm_synthetic_integration.sql     # Synthetic schema extensions
│   └── 021_dwm_synthetic_integration.down.sql# Rollback extensions
│
├── docs/                        # Complete Technical Documentation
│   ├── DWM_ARCHITECTURE.md                   # Comprehensive architecture & isolation spec
│   ├── DATA_MINING_GUIDE.md                  # Viva defense & algorithm derivation guide
│   ├── DWM_FINAL_SUBMISSION_REPORT.md         # Final academic project submission report
│   ├── PHASE_6_FINAL_REPORT.md               # End-to-end verification report
│   └── SCHEMA_MAPPING.md                     # Source-to-warehouse mapping dictionary
│
├── .env.example                 # Configuration template
├── .env                         # Local environment configuration
├── package.json                 # Project workspace runner
└── README.md                    # Project documentation (this file)
```

---

## 3. Data Warehouse Design (15 Tables, 22 Foreign Keys, 56,528 Rows)

The dimensional data warehouse employs a **Constellation (Fact Constellation) Schema** with dimension normalization where appropriate:

### A. Dimensions
1. `dwh.dim_student`: 308 rows — Academic profiles, CGPA, department, graduation year.
2. `dwh.dim_alumni`: 2,024 rows — Alumni career profiles, current company, role, experience level.
3. `dwh.dim_company`: 39 rows — Employers, industry classification, recruitment tier.
4. `dwh.dim_skill`: 163 rows — Standardized skill taxonomy and technical competencies.
5. `dwh.dim_job`: 5,000 rows — Job requisition details, posted date, required experience.
6. `dwh.dim_date`: 4,748 rows — Calendar dimension covering historical and future cohorts (2018–2030).

### B. Bridges (Many-to-Many Relationships)
1. `dwh.bridge_student_skill`: 921 rows — Student skill proficiencies.
2. `dwh.bridge_alumni_skill`: 20,000 rows — Alumni skill competencies.
3. `dwh.bridge_job_skill`: 15,000 rows — Job requisition skill requirements.

### C. Fact Tables
1. `dwh.fact_placement`: 259 rows — Campus placement outcomes, CTC (LPA), offer date.
2. `dwh.fact_job_application`: 6,004 rows — Application submissions and interview progression.
3. `dwh.fact_career_outcomes`: 2,000 rows — 6-month post-graduation career placement observations.
4. `dwh.fact_salary_benchmark`: 24 rows — Industry compensation benchmarks by tier and role.

### D. Audit Ledger
1. `dwh.etl_batches`: 37 batches — Traceability of all ingested CSV files and batch executions.
2. `dwh.etl_batch_errors`: 1 error record — Row-level rejected records and validation exceptions.

---

## 4. Data Mining Algorithms

### 1. K-Means Clustering (Unsupervised Profile Segmentation)
- **Feature Space**: Standardized multidimensional vectors combining continuous experience, graduation cohort, and skill competency vectors.
- **Diagnostics**:
  - Within-Cluster Sum of Squares (Inertia) with automated Elbow Method evaluation for candidate $k \in [2, 10]$.
  - Silhouette Coefficient analysis evaluating inter-cluster separation vs. intra-cluster cohesion.
  - Principal Component Analysis (PCA) 2D projection for cluster visualization.

### 2. Apriori Association Rule Mining (Market Basket Analysis)
- **Dual Analytical Modes**:
  - **Mode A (Alumni Skills)**: Discovers skill co-occurrence and competency affinity baskets among 2,000 alumni.
  - **Mode B (Job Skills)**: Analyzes co-requisite skill clusters required by recruiters across 5,000 job requisitions.
- **Metrics Computed**:
  $$\text{Support}(X \Rightarrow Y) = \frac{\text{count}(X \cup Y)}{N}$$
  $$\text{Confidence}(X \Rightarrow Y) = \frac{\text{Support}(X \Rightarrow Y)}{\text{Support}(X)}$$
  $$\text{Lift}(X \Rightarrow Y) = \frac{\text{Confidence}(X \Rightarrow Y)}{\text{Support}(Y)}$$

### 3. Supervised Classification (Career Outcome Prediction)
- **Model**: Decision Tree and Logistic/Probabilistic classifier predicting 6-month placement outcomes (`Placed_Tier_1`, `Placed_Tier_2`, `Higher_Studies`, `Seeking_Opportunities`).
- **Evaluation**: Stratified 80/20 train/test split computing Confusion Matrix, Precision, Recall, F1-Score, and ROC-AUC.

---

## 5. Setup & Development Instructions

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x
- PostgreSQL or PGlite instance running with database credentials.

### Installation

```bash
# Navigate to DWM-project directory
cd DWM-project

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install --legacy-peer-deps
cd ..
```

### Environment Configuration

Configure `DWM-project/.env` (or copy from `.env.example`):

```ini
PORT=5001
CLIENT_URL=http://localhost:5174
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54329/postgres
NODE_ENV=development
```

### Starting DWM Services

```bash
# 1. Start DWM Backend API (Port 5001)
cd DWM-project/server
npm run dev

# 2. In a separate terminal, start DWM Frontend (Port 5174)
cd DWM-project/client
npm run dev
```

Open your browser to: **`http://localhost:5174`**

---

## 6. Running Test Suites

DWM contains 78 automated unit and integration tests covering warehouse integrity, CSV ingestion, OLAP rollups, and data mining algorithms:

```bash
cd DWM-project/server

# Run all warehouse, OLAP, and CSV ingestion tests (54 tests)
node --test tests/analytics.test.js

# Run Data Mining algorithmic unit tests (16 tests)
node --test tests/datamining.association.test.js tests/datamining.classification.test.js tests/datamining.clustering.test.js

# Run Data Mining API integration tests (8 tests)
node --test tests/datamining.integration.test.js
```

---

## 7. API Reference

All endpoints are hosted at `http://localhost:5001/api/analytics`:

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/warehouse/summary` | GET | Executive warehouse summary KPIs and table counts |
| `/warehouse/schema` | GET | Live SVG ERD schema topology and foreign-key links |
| `/warehouse/table/:tableName` | GET | Detailed column structure, statistics, and sample rows |
| `/warehouse/quality` | GET | 38 automated data-quality diagnostics and checks |
| `/warehouse/datasets` | GET | Physical CSV benchmark inventory |
| `/warehouse/audit` | GET | Ingestion batch execution ledger from `dwh.etl_batches` |
| `/overview` | GET | High-level analytics metrics and KPI rollups |
| `/career` | GET | Placement distributions by recruiter and department |
| `/skills` | GET | Skill demand ranking and categorisation |
| `/alumni` | GET | Geographic and industry alumni distributions |
| `/olap` | GET | Multidimensional group rollup, pivot, slice & dice |
| `/etl/upload` | POST | Multipart CSV file upload with dry-run validation |
| `/etl/confirm-import` | POST | Commit staged batch into warehouse tables |
| `/datamining/summary` | GET | Mining inventory and transaction summary |
| `/datamining/clustering` | GET | K-Means clustering with PCA projections |
| `/datamining/clustering/evaluation` | GET | Elbow method inertia and silhouette scores |
| `/datamining/association-rules` | GET | Apriori association rules with support/confidence/lift |
| `/datamining/classification/train` | POST | Train career outcome classifier on benchmark data |
| `/datamining/classification/predict` | POST | Predict candidate placement probability |

---

## 8. Academic Viva Defense Reference

For in-depth mathematical proofs, algorithm complexity derivations, and architectural explanations, refer to:
- [`docs/DWM_ARCHITECTURE.md`](./docs/DWM_ARCHITECTURE.md)
- [`docs/DATA_MINING_GUIDE.md`](./docs/DATA_MINING_GUIDE.md)
- [`docs/DWM_FINAL_SUBMISSION_REPORT.md`](./docs/DWM_FINAL_SUBMISSION_REPORT.md)
