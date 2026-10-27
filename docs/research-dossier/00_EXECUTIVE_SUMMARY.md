# Document 00: Executive Summary & Project Synthesis

**Subsystem**: Standalone Data Warehousing and Data Mining (DWM) Analytical Intelligence Platform  
**Repository Location**: [`DWM-project/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/)  
**Document**: [`00_EXECUTIVE_SUMMARY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/00_EXECUTIVE_SUMMARY.md)  
**Status**: Decoupled, Standalone, Verified via 78 Automated Tests  

---

## 1. Project Overview & Problem Statement

Academic institutions and engineering universities generate substantial volumes of operational data spanning student academic records, placement interview logs, alumni career trajectories, and industry skill demands. However, in conventional institutional setups, this data remains fragmented in Online Transaction Processing (OLTP) operational tables, impeding longitudinal analysis and strategic career forecasting.

The **DWM Project** delivers an independent, full-lifecycle **Data Warehousing & Data Mining (DWM)** analytical platform designed to solve these institutional challenges. The system provides:

1. **Analytical Data Warehousing**: A Constellation Schema storing historical placement observations, alumni career histories, and skill competencies in a dedicated `dwh` schema.
2. **Multidimensional OLAP Cube**: A high-performance aggregation engine supporting dynamic 2D pivoting, roll-up, drill-down, and slice-and-dice operations.
3. **Data Mining Algorithms**: In-memory, mathematically rigorous implementations of:
   - **K-Means Clustering**: Profile segmentation with Elbow Method WCSS and Silhouette validation.
   - **Apriori Association Rule Mining**: Discovering skill affinity patterns across alumni and job requisitions.
   - **Supervised Classification**: Predicting 6-month post-graduation career placement outcomes with confusion matrix and ROC-AUC evaluation.
4. **Interactive Warehouse Explorer & Live ERD**: A developer-facing visual cockpit providing live SVG Entity-Relationship Diagrams, column profiling, statistical distributions, and 38 data quality diagnostics.
5. **Robust CSV Ingestion & Audit Pipeline**: Schema detection, column alias resolution, row-level validation, relational dry-runs, and transactional batch commits logged in an audit ledger.

---

## 2. Decoupling & Isolation Architecture

The DWM subsystem has been refactored into a completely independent root-level project inside [`DWM-project/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/).

### Key Decoupling Guarantees

```text
┌────────────────────────────────────────┐       ┌────────────────────────────────────────┐
│     Alumni Network (Operational)       │       │    DWM Analytical Intelligence         │
├────────────────────────────────────────┤       ├────────────────────────────────────────┤
│ • Root: client/ & server/              │       │ • Root: DWM-project/client/ & server/  │
│ • Frontend Port: 5173                  │       │ • Frontend Port: 5174                  │
│ • Backend Port: 5000                   │       │ • Backend Port: 5001                   │
│ • Database Schema: public.*            │  VS   │ • Database Schema: dwh.*               │
│ • Data: Users, Mentorship, Events      │       │ • Data: Historical Facts, Dimensions   │
│ • Workload: OLTP (Row-oriented writes) │       │ • Workload: OLAP & ML (Read & Mining)  │
│ • Auth: Cookie JWT on public.users     │       │ • Auth: Standalone Analyst Token / Key │
└────────────────────────────────────────┘       └────────────────────────────────────────┘
```

1. **Zero Cross-Schema Queries**: DWM backend code, controllers, and services query exclusively from `dwh.*`. Zero queries touch `public.*`.
2. **Operational Sync Elimination**: The legacy `syncOperationalToWarehouse()` function and routes (`POST /api/analytics/etl/refresh`) were removed. Requests to refresh or sync endpoints return `404 Not Found`.
3. **Dedicated Port Allocations**: DWM runs on Frontend Port **5174** and Backend Port **5001**, avoiding collisions with the Alumni Portal (Ports 5173/5000).
4. **Standalone Authentication**: DWM uses an independent Analyst Authentication middleware ([`server/src/middleware/auth.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/middleware/auth.js)), eliminating dependencies on `public.users` or operational login tokens.

---

## 3. High-Level Summary Statistics

All metrics in this executive summary represent physical files and live database measurements verified directly from the repository:

### A. Benchmark Datasets (Physical CSVs)
- **Directory**: [`DWM-project/datasets/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/datasets/)
- **Total Datasets**: 7 CSV files
- **Total Physical File Size**: ~4.95 MB
- **Total Physical Data Rows**: **50,150 rows** (excluding headers)
  - `skills.csv`: 150 rows, 4 columns
  - `alumni.csv`: 2,000 rows, 10 columns
  - `jobs.csv`: 5,000 rows, 10 columns
  - `alumni_skills.csv`: 20,000 rows, 5 columns
  - `job_skills.csv`: 15,000 rows, 4 columns
  - `applications.csv`: 6,000 rows, 7 columns
  - `career_outcomes.csv`: 2,000 rows, 8 columns

### B. Warehouse Database Catalog (Live `dwh` Schema)
- **Total Tables**: **15 tables**
- **Table Categories**: 6 Dimension tables, 4 Fact tables, 3 Bridge tables, 2 Audit tables
- **Total Foreign Keys**: **22 explicit referential constraints**
- **Total Warehouse Columns**: 157 columns
- **Total Stored Rows**: **56,732 rows**
  - Dimensions: `dim_student` (323), `dim_alumni` (2,026), `dim_company` (42), `dim_skill` (165), `dim_date` (4,748), `dim_job` (5,002)
  - Bridges: `bridge_student_skill` (921), `bridge_alumni_skill` (20,013), `bridge_job_skill` (15,008)
  - Facts: `fact_placement` (274), `fact_job_application` (6,006), `fact_salary_benchmark` (24), `fact_career_outcomes` (2,002)
  - Audit: `etl_batches` (137), `etl_batch_errors` (46)

### C. Software Quality & Test Suite
- **Total Automated Tests**: **78 test cases**
- **Test Results**: **78 Passed, 0 Failed, 0 Skipped (100% Pass Rate)**
  - Warehouse Schema, Ingestion & OLAP (`analytics.test.js`): 54 / 54 Passed
  - Apriori Association Rules Unit (`datamining.association.test.js`): 7 / 7 Passed
  - Supervised Classification Unit (`datamining.classification.test.js`): 4 / 4 Passed
  - K-Means Clustering Unit (`datamining.clustering.test.js`): 5 / 5 Passed
  - Mining REST API Integration (`datamining.integration.test.js`): 8 / 8 Passed

---

## 4. Key Academic Contributions

1. **Reproducible Constellation Modeling**: Demonstrates how a higher-education institution can model complex many-to-many skill competencies and disparate student/alumni career observations without combinatorial join explosions or financial metric inflation.
2. **Dual-Mode Association Rule Mining**: Evaluates skill affinities across both candidate supply (alumni skill portfolios) and recruiter demand (job requisition requirements), revealing structural curriculum gaps.
3. **Validated Unsupervised Profile Segmentation**: Implements K-Means with mathematical Inertia and Silhouette evaluations, generating continuous 2D PCA projections for institutional decision support.
4. **Transparent Data Quality & Lineage**: Combines an automated 38-point diagnostics suite with an immutable ingestion audit ledger (`etl_batches`) ensuring data provenance across synthetic benchmarks and external user uploads.

---

## 5. Synthetic Data Transparency Disclosure

> [!IMPORTANT]
> **Academic Integrity Notice:**  
> All empirical findings, cluster centroids, association rules, and classification accuracies reported in this dossier are derived from the standardized **synthetic Indian academic benchmark dataset** (`indian_academic_benchmark`) generated via [`DWM-project/scripts/generate_dwm_datasets.py`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/scripts/generate_dwm_datasets.py).  
> These results represent patterns within the synthetic dataset and must **not** be presented as real-world alumni employment data or national industry statistics.

---

## 6. Master Architectural & Research Diagrams

The research dossier includes 15 detailed Mermaid architecture and workflow diagrams located in [`diagrams/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/):

| Diagram Source File | Diagram Title | Scope & Architectural Focus |
| :--- | :--- | :--- |
| [`diagrams/01_system_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/01_system_architecture.mmd) | **Overall System Architecture** | Complete 3-tier decoupled system: React UI, Express server, analytical engines, and PostgreSQL warehouse. |
| [`diagrams/04_warehouse_erd.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/04_warehouse_erd.mmd) | **Fact Constellation ERD** | 15 relational tables with columns, surrogate keys (`_sk`), data types, and 22 referential constraints. |
| [`diagrams/06_etl_data_lineage.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/06_etl_data_lineage.mmd) | **End-to-End ETL Lineage** | Staging workflow, row validation, dry-run gates, surrogate key resolution, and analytical consumption. |
| [`diagrams/14_runtime_topology.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/14_runtime_topology.mmd) | **Runtime Topology & Isolation** | Verified port mapping (DWM: 5174/5001 vs Portal: 5173/5000) and schema-level isolation (`dwh` vs `public`). |
| [`diagrams/15_research_methodology.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/15_research_methodology.mmd) | **Research Methodology** | End-to-end research lifecycle from problem definition to benchmark generation, OLAP, ML, and threats to validity. |

