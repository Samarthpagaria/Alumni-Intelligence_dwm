# Document 01: Project Background, Problem Domain, and Motivation

**Subsystem**: Standalone Data Warehousing and Data Mining (DWM) Analytical Intelligence Platform  
**Document**: [`01_PROJECT_BACKGROUND_AND_MOTIVATION.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/01_PROJECT_BACKGROUND_AND_MOTIVATION.md)  
**Classification**: Domain Analysis, Problem Formulation & Institutional Motivation  

---

## 1. Higher-Education Domain Challenges

Higher education institutions in India and globally face increasing pressure to demonstrate graduate employability, align academic curricula with rapid technological shifts, and maintain lifelong relationships with their alumni networks. Despite gathering vast quantities of transactional data, educational institutions struggle with three systemic information bottlenecks:

### A. The OLTP vs. OLAP Conflict
Institutional management platforms are built on Online Transaction Processing (OLTP) relational databases (such as PostgreSQL or MySQL in 3NF). These systems excel at atomic, single-row operations—such as creating a user account, submitting a resume, or booking an event ticket. However, running multi-year longitudinal aggregations, cross-cohort salary comparisons, and skill co-occurrence queries directly against OLTP operational tables causes:
- **Severe Database Contention**: Analytical queries lock operational rows and consume transaction pool connections, degrading application responsiveness for active users.
- **Query Inefficiency**: Star and constellation queries executed across highly normalized relational tables require 10+ joins, resulting in slow query execution times.
- **Absence of Historical Dimensioning**: Operational tables overwrite records (e.g., updating an alumnus's current salary or job role overwrites their past career milestones), destroying temporal lineage required for time-series modeling.

### B. The Placement-Curriculum Disconnect
Placement cells frequently rely on retrospective spreadsheets (Excel/Google Sheets) compiled at the conclusion of recruitment cycles. These static spreadsheets lack relational integrity, duplicate company names, and fail to correlate student skill portfolios with recruiter conversion rates. Academic curriculum boards subsequently lack quantitative evidence indicating which technical competencies (e.g., Docker, Kubernetes, React, Python) directly correlate with higher placement packages or tier-1 recruitment.

### C. Data Silos and Ingestion Fragility
Career development data originates from disparate external sources: campus placement aptitude test platforms, CSV exports from job portals, student self-reported LinkedIn profiles, and survey responses. Without a standardized data warehousing pipeline equipped with schema detection, alias mapping, and referential validation, ad-hoc data imports corrupt institutional databases with orphaned records and duplicate foreign keys.

---

## 2. Project Motivation & Research Goals

The **Data Warehousing & Data Mining (DWM) Project** was conceived to build a production-grade, standalone analytical ecosystem that resolves these structural challenges.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   Institutional Objectives                             │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. Complete System Isolation   │ Separate analytical workloads (dwh)  │
│                                │ from operational tables (public).     │
├────────────────────────────────┼───────────────────────────────────────┤
│ 2. Dimensional Data Warehouse  │ Multi-fact Constellation schema       │
│                                │ tracking placement, jobs, and skills. │
├────────────────────────────────┼───────────────────────────────────────┤
│ 3. Multidimensional OLAP Engine│ Dynamic Roll-up, Drill-down, Slicing, │
│                                │ Dicing, and 2D Matrix Pivoting.       │
├────────────────────────────────┼───────────────────────────────────────┤
│ 4. Algorithmic Data Mining     │ Unsupervised K-Means clustering,      │
│                                │ Apriori association rule discovery,   │
│                                │ and supervised outcome prediction.    │
├────────────────────────────────┼───────────────────────────────────────┤
│ 5. Auditability & Data Quality │ 38 automated quality diagnostics and  │
│                                │ immutable batch audit ledgering.      │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 3. Key Stakeholders and Personas

| Stakeholder Persona | Institutional Role | Primary Objectives in DWM | Key Interface Modules Used |
| :--- | :--- | :--- | :--- |
| **Dean of Academics / Curriculum Board** | Institutional Leadership | Identify skill gaps in engineering curricula; adjust syllabus based on recruiter demand and alumni career progression. | Skills Intelligence, Apriori Association Rules, Data Dictionary |
| **Training & Placement Officer (TPO)** | Career Development Head | Track annual placement velocity, compare department CTC averages across cohorts, and benchmark top recruiters. | Executive KPI Cockpit, Placements & Careers, OLAP Explorer |
| **Data Mining Researcher / Analyst** | Technical Evaluator | Run clustering algorithms, evaluate Elbow inertia curves, generate association rules, and train predictive classifiers. | Data Mining Cockpit, Clustering Inspector, Classifier Trainer |
| **Data Warehouse Engineer** | Systems Administrator | Ingest external CSV datasets, monitor ETL batch execution, inspect referential integrity, and evaluate data quality. | Warehouse Explorer & ERD, CSV Ingestion Console, Ingestion Audit Ledger |
| **Graduating Student / Alumnus** | Primary End-User | Understand market compensation benchmarks by industry, identify high-demand skill combinations, and explore career roadmaps. | Placements & Careers, Skills Intelligence |

---

## 4. Formal Research Objectives

The DWM project formulates four concrete research objectives:

1. **RO-1 (Dimensional Modeling)**: Design, evaluate, and benchmark a multidimensional constellation schema that models student competencies, recruiter job postings, and alumni career paths while preventing metric inflation across bridge relationships.
2. **RO-2 (Association Rule Analysis)**: Formulate and evaluate a dual-mode Apriori mining algorithm that extracts frequent skill itemsets across candidate supply (alumni competencies) and employer demand (job requirements), assessing lift and confidence dynamics.
3. **RO-3 (Predictive Career Classification)**: Construct a supervised machine learning pipeline predicting 6-month post-graduation employment outcomes from academic, skill, and internship features, evaluating classification performance via Stratified Cross-Validation and ROC-AUC.
4. **RO-4 (Auditable Ingestion Architecture)**: Implement an immutable batch-ledgered ETL architecture ensuring end-to-end traceability from raw CSV ingestion to warehouse reporting with zero operational database dependency.
