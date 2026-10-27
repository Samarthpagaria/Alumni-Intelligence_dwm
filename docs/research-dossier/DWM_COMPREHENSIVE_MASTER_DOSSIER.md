# DATA WAREHOUSING & DATA MINING (DWM) PLATFORM: COMPREHENSIVE MASTER TECHNICAL DOSSIER

**Project**: Standalone Higher-Education Data Warehousing & Data Mining Analytical System
**Repository Scope**: Dedicated `DWM-project/` Subsystem (Independent from Operational Alumni Portal)
**Document Classification**: Unified Master Architecture, Data Warehouse Design, Data Mining Methodology, Empirical Results & Viva Guide
**Version**: 1.0.0 (Decoupled Enterprise Edition)
**Compilation Date**: October 2026
**Generated For**: Comprehensive Single-Document Offline & Defense Reference

---

## Master Table of Contents

- [INDEX](#index-md)
- [00 EXECUTIVE SUMMARY](#00-executive-summary-md)
- [01 PROJECT BACKGROUND AND MOTIVATION](#01-project-background-and-motivation-md)
- [02 COMPLETE FEATURE CATALOG](#02-complete-feature-catalog-md)
- [03 TECH STACK AND MODULE INVENTORY](#03-tech-stack-and-module-inventory-md)
- [04 DATASET CATALOG](#04-dataset-catalog-md)
- [05 DATA DICTIONARY](#05-data-dictionary-md)
- [06 DATA QUALITY AND PROVENANCE](#06-data-quality-and-provenance-md)
- [07 DATA WAREHOUSE DESIGN](#07-data-warehouse-design-md)
- [08 DATABASE ERD](#08-database-erd-md)
- [09 SYSTEM ARCHITECTURE](#09-system-architecture-md)
- [10 DATA PIPELINE AND LINEAGE](#10-data-pipeline-and-lineage-md)
- [11 API AND SERVICE REFERENCE](#11-api-and-service-reference-md)
- [12 ANALYTICS AND OLAP](#12-analytics-and-olap-md)
- [13 ASSOCIATION RULE MINING](#13-association-rule-mining-md)
- [14 CLASSIFICATION METHODOLOGY](#14-classification-methodology-md)
- [15 CLUSTERING METHODOLOGY](#15-clustering-methodology-md)
- [16 EXPERIMENTS AND RESULTS](#16-experiments-and-results-md)
- [17 TESTING AND QUALITY ASSURANCE](#17-testing-and-quality-assurance-md)
- [18 SECURITY AND LIMITATIONS](#18-security-and-limitations-md)
- [19 RESEARCH GAPS AND FUTURE WORK](#19-research-gaps-and-future-work-md)
- [20 RESEARCH PAPER BLUEPRINT](#20-research-paper-blueprint-md)
- [21 ACADEMIC POSTER CONTENT](#21-academic-poster-content-md)
- [22 PRESENTATION AND DEMO GUIDE](#22-presentation-and-demo-guide-md)
- [23 REPRODUCIBILITY GUIDE](#23-reproducibility-guide-md)
- [24 EVIDENCE AND CLAIM REGISTER](#24-evidence-and-claim-register-md)
- [APPENDIX: Master Architectural & Workflow Diagrams (15 Mermaid Diagrams)](#appendix-master-architectural--workflow-diagrams-15-mermaid-diagrams)

---


<a id="index-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: INDEX.md -->
<!-- ===================================================================== -->

# DWM Technical Documentation & Research Dossier Index

**Project Title**: Standalone Data Warehousing and Data Mining (DWM) Analytical Intelligence Subsystem  
**Repository Location**: [`DWM-project/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/)  
**Dossier Root**: [`DWM-project/docs/research-dossier/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/)  
**Document Classification**: Comprehensive Technical Dossier, Academic Research Specification & Defense Guide  
**Version**: 1.0.0 (Decoupled Enterprise Edition)  
**Date of Verification**: October 2026  

---

## 1. Reading Guide & Target Audiences

This research dossier provides a formal, evidence-based reference covering the architectural design, dimensional data warehouse schema, ETL pipelines, multidimensional OLAP cubes, unsupervised/supervised data mining algorithms, and empirical results of the DWM project.

### Recommended Reading Tracks

| Audience | Primary Documents | Objectives |
| :--- | :--- | :--- |
| **Academic Evaluators / Viva Examiners** | [`00_EXECUTIVE_SUMMARY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/00_EXECUTIVE_SUMMARY.md), [`07_DATA_WAREHOUSE_DESIGN.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/07_DATA_WAREHOUSE_DESIGN.md), [`13_ASSOCIATION_RULE_MINING.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/13_ASSOCIATION_RULE_MINING.md), [`14_CLASSIFICATION_METHODOLOGY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/14_CLASSIFICATION_METHODOLOGY.md), [`15_CLUSTERING_METHODOLOGY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/15_CLUSTERING_METHODOLOGY.md), [`22_PRESENTATION_AND_DEMO_GUIDE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/22_PRESENTATION_AND_DEMO_GUIDE.md) | Verify mathematical correctness, schema modeling, algorithm implementations, and academic contributions. |
| **Research Paper Co-Authors** | [`20_RESEARCH_PAPER_BLUEPRINT.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/20_RESEARCH_PAPER_BLUEPRINT.md), [`16_EXPERIMENTS_AND_RESULTS.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/16_EXPERIMENTS_AND_RESULTS.md), [`19_RESEARCH_GAPS_AND_FUTURE_WORK.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/19_RESEARCH_GAPS_AND_FUTURE_WORK.md), [`24_EVIDENCE_AND_CLAIM_REGISTER.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/24_EVIDENCE_AND_CLAIM_REGISTER.md) | Draft peer-reviewed manuscript, establish baselines, select evaluation metrics, and review threats to validity. |
| **Academic Poster Designers** | [`21_ACADEMIC_POSTER_CONTENT.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/21_ACADEMIC_POSTER_CONTENT.md), [`08_DATABASE_ERD.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/08_DATABASE_ERD.md), [`09_SYSTEM_ARCHITECTURE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/09_SYSTEM_ARCHITECTURE.md) | Extract modular poster panels, layout diagrams, and key empirical takeaways. |
| **System Engineers & Reviewers** | [`02_COMPLETE_FEATURE_CATALOG.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/02_COMPLETE_FEATURE_CATALOG.md), [`03_TECH_STACK_AND_MODULE_INVENTORY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/03_TECH_STACK_AND_MODULE_INVENTORY.md), [`11_API_AND_SERVICE_REFERENCE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/11_API_AND_SERVICE_REFERENCE.md), [`17_TESTING_AND_QUALITY_ASSURANCE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/17_TESTING_AND_QUALITY_ASSURANCE.md), [`23_REPRODUCIBILITY_GUIDE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/23_REPRODUCIBILITY_GUIDE.md) | Reproduce builds, verify unit/integration tests, and validate database isolation boundaries. |

---

## 2. Master Document Directory

| Document ID & Title | Description | Primary Verification Artifacts |
| :--- | :--- | :--- |
| [`00_EXECUTIVE_SUMMARY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/00_EXECUTIVE_SUMMARY.md) | High-level synthesis of system architecture, feature inventory, datasets, verified counts, and decoupling status. | System runtime, Git tree |
| [`01_PROJECT_BACKGROUND_AND_MOTIVATION.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/01_PROJECT_BACKGROUND_AND_MOTIVATION.md) | Higher-education placement challenges, motivation for data warehousing, academic stakeholders, and core use cases. | Problem domain analysis |
| [`02_COMPLETE_FEATURE_CATALOG.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/02_COMPLETE_FEATURE_CATALOG.md) | Exhaustive breakdown of all 10 user interfaces, controllers, services, queries, inputs, outputs, and implementation states. | Frontend/backend source |
| [`03_TECH_STACK_AND_MODULE_INVENTORY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/03_TECH_STACK_AND_MODULE_INVENTORY.md) | Verified technology stack, dependencies, directory map, request flow, and architectural decoupling boundaries. | `package.json`, source code |
| [`04_DATASET_CATALOG.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/04_DATASET_CATALOG.md) | Physical inspection of all 7 benchmark CSV files (50,150 physical rows), headers, byte sizes, and provenance rules. | `DWM-project/datasets/*.csv` |
| [`05_DATA_DICTIONARY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/05_DATA_DICTIONARY.md) | Field-by-field dictionary with data types, nullability, constraints, valid value ranges, and warehouse table mappings. | Schema definitions & CSVs |
| [`06_DATA_QUALITY_AND_PROVENANCE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/06_DATA_QUALITY_AND_PROVENANCE.md) | Data validation, chronological checks, integrity constraints, synthetic dataset generation assumptions, and provenance isolation. | Validation services & scripts |
| [`07_DATA_WAREHOUSE_DESIGN.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/07_DATA_WAREHOUSE_DESIGN.md) | Dimensional constellation schema design, 6 dimensions, 4 facts, 3 bridges, 2 audit tables, keys, and indexes. | `020_dwm_*.sql`, `021_dwm_*.sql` |
| [`08_DATABASE_ERD.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/08_DATABASE_ERD.md) | Comprehensive Mermaid Entity-Relationship Diagram detailing all 15 warehouse tables, primary keys, and 22 foreign keys. | Live PostgreSQL catalog |
| [`09_SYSTEM_ARCHITECTURE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/09_SYSTEM_ARCHITECTURE.md) | Detailed technical architecture diagram, request lifecycle, middleware pipeline, proxy configuration, and deployment topology. | Express/Vite architecture |
| [`10_DATA_PIPELINE_AND_LINEAGE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/10_DATA_PIPELINE_AND_LINEAGE.md) | CSV staging, validation, dry-run, relational chaining, commit, and transactional rollback workflows. | `csvIngestionService.js` |
| [`11_API_AND_SERVICE_REFERENCE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/11_API_AND_SERVICE_REFERENCE.md) | Complete OpenAPI-style reference of all 20 REST endpoints, query parameters, payload schemas, and response shapes. | Express routes & controllers |
| [`12_ANALYTICS_AND_OLAP.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/12_ANALYTICS_AND_OLAP.md) | Multidimensional OLAP Cube operations (Roll-up, Drill-down, Slice, Dice, 2D Pivot) and mathematical guarantees. | `warehouseRepository.js` |
| [`13_ASSOCIATION_RULE_MINING.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/13_ASSOCIATION_RULE_MINING.md) | Apriori algorithm implementation, candidate generation, support/confidence/lift formulas, Mode A vs. Mode B, and diagnostics. | `associationRulesService.js` |
| [`14_CLASSIFICATION_METHODOLOGY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/14_CLASSIFICATION_METHODOLOGY.md) | Supervised career outcome prediction, feature engineering, decision trees, confusion matrix, ROC-AUC, and evaluation metrics. | `classificationService.js` |
| [`15_CLUSTERING_METHODOLOGY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/15_CLUSTERING_METHODOLOGY.md) | K-Means clustering implementation, vector standardization, Elbow Method (Inertia/WCSS), Silhouette Score, and PCA 2D projections. | `clusteringService.js` |
| [`16_EXPERIMENTS_AND_RESULTS.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/16_EXPERIMENTS_AND_RESULTS.md) | Empirical results categorized into Verified Existing, Newly Measured, and Documented-Only results with methodology notes. | Test runs & catalog queries |
| [`17_TESTING_AND_QUALITY_ASSURANCE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/17_TESTING_AND_QUALITY_ASSURANCE.md) | Complete inventory of 78 automated test cases, test suites, isolated in-memory test databases, and coverage gaps. | `server/tests/*.test.js` |
| [`18_SECURITY_AND_LIMITATIONS.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/18_SECURITY_AND_LIMITATIONS.md) | Threat modeling, SQL injection prevention (allowlists), authentication decoupling, CORS policy, and scalability limits. | Security audit findings |
| [`19_RESEARCH_GAPS_AND_FUTURE_WORK.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/19_RESEARCH_GAPS_AND_FUTURE_WORK.md) | Unresolved challenges, real-world data validation requirements, advanced ML models (Random Forest, GBDT), and automated ETL. | Research roadmap |
| [`20_RESEARCH_PAPER_BLUEPRINT.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/20_RESEARCH_PAPER_BLUEPRINT.md) | Academic paper draft outline, title proposals, abstract, research questions, experimental protocol, and publication timeline. | Manuscript template |
| [`21_ACADEMIC_POSTER_CONTENT.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/21_ACADEMIC_POSTER_CONTENT.md) | Poster-ready modular text, architecture diagrams, algorithm highlights, key result callouts, and 3-column layout plan. | Poster specification |
| [`22_PRESENTATION_AND_DEMO_GUIDE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/22_PRESENTATION_AND_DEMO_GUIDE.md) | Step-by-step viva defense and live demonstration walkthrough script, screenshot inventory, and anticipated examiner questions. | Defense walkthrough |
| [`23_REPRODUCIBILITY_GUIDE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/23_REPRODUCIBILITY_GUIDE.md) | Deterministic startup guide, environment configurations, offline test execution commands, and experiment logging template. | Execution runbook |
| [`24_EVIDENCE_AND_CLAIM_REGISTER.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/24_EVIDENCE_AND_CLAIM_REGISTER.md) | Traceability matrix linking every technical claim and quantitative metric to specific lines of code, tests, and database queries. | Traceability register |

---

## 3. Evidence & Verification Summary

All factual statements in this dossier are cross-referenced to physical repository assets:

- **Total Verified Benchmark CSV Rows**: **50,150 rows** across 7 files in [`DWM-project/datasets/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/datasets/).
- **Live Warehouse Tables**: **15 tables** (6 dimensions, 4 facts, 3 bridges, 2 audit tables) containing **56,732 total rows** in schema `dwh`.
- **Foreign Key Constraints**: **22 explicit referential constraints** enforcing data warehouse integrity.
- **Automated Test Suite**: **78 automated tests** (54 analytics/OLAP/warehouse, 16 algorithmic unit tests, 8 integration tests) with **100% pass rate**.
- **Decoupling Guarantee**: Zero queries from DWM to the operational `public` schema; operational DB sync endpoints return `404 Not Found`.

---

## 4. Architectural & Workflow Diagrams Directory

The research dossier includes a complete suite of **15 standalone Mermaid diagram specifications** maintained in [`DWM-project/docs/research-dossier/diagrams/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/):

| # | Diagram Deliverable File | Diagram Title | Scope & Architectural Coverage |
| :--- | :--- | :--- | :--- |
| **D01** | [`diagrams/01_system_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/01_system_architecture.mmd) | **Overall System Architecture** | 3-tier decoupled architecture: React UI, Express server, analytical engines, and PostgreSQL storage. |
| **D02** | [`diagrams/02_frontend_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/02_frontend_architecture.mmd) | **Frontend Component Architecture** | Routing tree, 8 page modules, shared Recharts/Lucide UI components, and Axios client. |
| **D03** | [`diagrams/03_backend_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/03_backend_architecture.mmd) | **Backend Architecture** | Express server entry, middleware pipeline, routers, controllers, domain services, repositories, and DB pool. |
| **D04** | [`diagrams/04_warehouse_erd.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/04_warehouse_erd.mmd) | **Warehouse Entity Relationship (ERD)** | 15 tables: 6 dimensions, 3 bridges, 4 facts, 2 audit tables, column types, and 22 referential constraints. |
| **D05** | [`diagrams/05_dataset_relationships.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/05_dataset_relationships.mmd) | **Dataset Relationships & Mapping** | 7 physical CSV files, join keys (`alumni_id`, `skill_id`, `job_id`), cardinalities, and warehouse table destinations. |
| **D06** | [`diagrams/06_etl_data_lineage.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/06_etl_data_lineage.mmd) | **End-to-End ETL Lineage** | 5-stage ingestion: parsing, row-level validation, dry-run gate, surrogate resolution, and analytical use. |
| **D07** | [`diagrams/07_api_request_lifecycle.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/07_api_request_lifecycle.mmd) | **API Request Lifecycle** | End-to-end traversal from client interaction to SQL execution, JSON enveloping, and DOM rendering. |
| **D08** | [`diagrams/08_analytics_sequence.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/08_analytics_sequence.mmd) | **Analytics Execution Sequence** | Dual sequence diagram for synchronous OLAP matrix queries and multi-stage Apriori association mining. |
| **D09** | [`diagrams/09_olap_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/09_olap_workflow.mmd) | **OLAP Cube Workflow** | Roll-Up, Drill-Down, Slice, Dice, and 2D Matrix Pivoting with whitelist injection immunity. |
| **D10** | [`diagrams/10_apriori_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/10_apriori_workflow.mmd) | **Apriori Algorithm Pipeline** | Mode A vs Mode B, candidate generation ($C_k$), subset pruning, support, confidence, lift, and diagnostics. |
| **D11** | [`diagrams/11_classification_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/11_classification_workflow.mmd) | **Supervised Classification Pipeline** | Stratified 80/20 train/test split, zero-leakage preprocessor fitting, regularized logistic regression, and ROC. |
| **D12** | [`diagrams/12_clustering_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/12_clustering_workflow.mmd) | **Clustering & PCA Workflow** | K-Means++ initialization, Mulberry32 PRNG seed invariance, Lloyd's iterations, WCSS Elbow, and 2D PCA. |
| **D13** | [`diagrams/13_auth_flow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/13_auth_flow.mmd) | **Decoupled Auth & RBAC Flow** | Header inspection (`x-api-key`, `Bearer`), guest read access, mutation auth, and role checking. |
| **D14** | [`diagrams/14_runtime_topology.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/14_runtime_topology.mmd) | **Deployment & Runtime Topology** | Independent processes (DWM: 5174/5001 vs Portal: 5173/5000), TCP connections, and schema isolation. |
| **D15** | [`diagrams/15_research_methodology.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/15_research_methodology.mmd) | **Research Methodology Lifecycle** | Problem formulation, benchmark synthesis, constellation modeling, mining, evaluation, and future work. |

### How to View & Render Diagram Files
1. **GitHub & Markdown Viewers**: Native GitHub markdown renders Mermaid code blocks directly.
2. **VS Code / IDE Preview**: Install the *Markdown Preview Mermaid Support* extension in VS Code.
3. **Mermaid Live Editor**: Copy any `.mmd` file contents into [mermaid.live](https://mermaid.live) to export high-resolution SVG, PNG, or PDF formats.
4. **Command Line Rendering**: Render locally using Mermaid CLI (when installed):
   ```bash
   npx @mermaid-js/mermaid-cli -i diagrams/01_system_architecture.mmd -o diagrams/01_system_architecture.svg
   ```




---


<a id="00-executive-summary-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 00_EXECUTIVE_SUMMARY.md -->
<!-- ===================================================================== -->

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

### A. Synthetic Benchmark Datasets (Physical CSVs)
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




---


<a id="01-project-background-and-motivation-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 01_PROJECT_BACKGROUND_AND_MOTIVATION.md -->
<!-- ===================================================================== -->

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



---


<a id="02-complete-feature-catalog-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 02_COMPLETE_FEATURE_CATALOG.md -->
<!-- ===================================================================== -->

# Document 02: Complete Feature Catalog & Implementation Inventory

**Subsystem**: Standalone Data Warehousing and Data Mining (DWM) Analytical Intelligence Platform  
**Document**: [`02_COMPLETE_FEATURE_CATALOG.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/02_COMPLETE_FEATURE_CATALOG.md)  
**Status**: 100% Implemented & Verified in [`DWM-project/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/)  

---

## 1. Feature Architecture Overview

The DWM platform delivers 10 interconnected analytical cockpits and consoles accessible via [`client/src/App.jsx`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/client/src/App.jsx) and powered by [`server/src/controllers/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/controllers/):

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   DWM Feature Cockpits (Port 5174)                     │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. Executive Analytics Cockpit │ High-level institutional KPIs & trends│
│ 2. Warehouse Explorer & ERD    │ Interactive schema topology & queries │
│ 3. Placements & Careers        │ Package distributions & recruiter tier│
│ 4. Skills Intelligence         │ Technical skill demand & categories   │
│ 5. Alumni Insights             │ Regional & industry career telemetry  │
│ 6. Multidimensional OLAP Cube  │ 2D Pivots, Roll-up, Drill-down, Slices│
│ 7. K-Means Profile Clustering  │ Profile segmentation & PCA 2D scatter │
│ 8. Apriori Association Mining  │ Skill affinity & market basket rules  │
│ 9. Career Outcome Classifier   │ Supervised placement model & ROC-AUC  │
│ 10. CSV Ingestion & Audit Log  │ Staging, row-level validation & ledger│
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 2. Exhaustive Feature-by-Feature Breakdown

### Feature 1: Executive Analytics Overview & KPI Cockpit
- **Problem Solved**: Academic administrators need immediate, aggregate visibility into placement percentages, average salary packages, and active student cohorts without executing database queries.
- **Frontend Component**: [`client/src/pages/analytics/AnalyticsOverview.jsx`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/client/src/pages/analytics/AnalyticsOverview.jsx)
- **Backend Route & Controller**: `GET /api/analytics/overview` -> `controller.getOverview` in [`server/src/controllers/analyticsController.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/controllers/analyticsController.js)
- **Service Layer**: `warehouseRepo.getWarehouseOverview()` in [`server/src/services/dwh/warehouseRepository.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseRepository.js)
- **Database Tables Involved**: `dwh.dim_student`, `dwh.dim_alumni`, `dwh.dim_company`, `dwh.dim_skill`, `dwh.fact_placement`, `dwh.fact_job_application`, `dwh.dim_job`.
- **Processing Steps**:
  1. Frontend passes optional `recordSource` filter (default: `'ALL'`).
  2. SQL queries execute concurrent `COUNT(*)` and `AVG(annual_package_lpa)` against fact and dimension tables.
  3. Returns executive KPI cards: Total Students, Total Alumni, Average Package (LPA), Placement Percentage, and Recent Historical Trends.
- **Formulas & Metrics**:
  $$\text{Placement Rate} = \frac{\text{COUNT}(\text{DISTINCT } \text{student\_sk} \in \text{fact\_placement})}{\text{COUNT}(\text{student\_sk} \in \text{dim\_student})} \times 100$$
- **Verification Evidence**: `TC-API-01` in [`server/tests/analytics.test.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/tests/analytics.test.js#L260). Verified live response status `200 OK`.
- **Implementation Status**: **Fully Implemented**.

---

### Feature 2: Warehouse Explorer & Live Interactive ERD
- **Problem Solved**: Developers, evaluators, and data engineers must inspect physical schema structure, row counts, and referential constraints without accessing PostgreSQL command-line interfaces.
- **Frontend Component**: [`client/src/pages/analytics/AnalyticsWarehouseOverview.jsx`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/client/src/pages/analytics/AnalyticsWarehouseOverview.jsx)
- **Backend Routes & Controller**:
  - `GET /api/analytics/warehouse/summary`
  - `GET /api/analytics/warehouse/schema`
  - `GET /api/analytics/warehouse/table/:tableName`
  - `GET /api/analytics/warehouse/quality`
  - `GET /api/analytics/warehouse/datasets`
  - `GET /api/analytics/warehouse/audit`
- **Service Layer**: [`server/src/services/dwh/warehouseOverviewService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseOverviewService.js)
- **Database Tables Involved**: `information_schema.tables`, `information_schema.columns`, `pg_constraint`, and all 15 `dwh.*` tables.
- **Processing Steps**:
  1. Introspects database catalog dynamically to fetch actual table types, row counts, and 22 foreign keys.
  2. Renders a 4-tier interactive SVG architectural diagram (Dimensions, Bridges, Facts, Audit).
  3. Supports pan, zoom, fit-to-screen, and click-to-highlight connected table dependencies.
  4. Table Inspector provides column data types, null counts, null percentages, distinct values, min/max bounds, and safe 10-row paginated previews with a strict table allowlist (`WAREHOUSE_TABLES`).
  5. Data Quality tab evaluates 38 automated checks (PK uniqueness, orphaned FKs, salary bounds).
- **Verification Evidence**: `TC-API-09`, `TC-API-09B`, `TC-API-09C` in [`server/tests/analytics.test.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/tests/analytics.test.js#L360).
- **Implementation Status**: **Fully Implemented**.

---

### Feature 3: Placements & Careers Analytics
- **Problem Solved**: Analyzes compensation dynamics by engineering department, graduation year, recruiter tier, and recruitment season.
- **Frontend Component**: [`client/src/pages/analytics/AnalyticsCareer.jsx`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/client/src/pages/analytics/AnalyticsCareer.jsx)
- **Backend Route & Controller**: `GET /api/analytics/career` -> `controller.getCareer`
- **Service Layer**: `warehouseRepo.getCareerAnalytics()` in [`warehouseRepository.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseRepository.js#L95)
- **Database Tables Involved**: `dwh.fact_placement`, `dwh.dim_student`, `dwh.dim_company`, `dwh.dim_date`.
- **Processing Steps**:
  1. Accepts query filters: `department`, `year`, `company`, `minSalary`, `recordSource`.
  2. Aggregates average CTC, highest CTC, lowest CTC, and total placed candidates grouped by department and hiring company tier (Super Dream, Dream, Core/Mass).
  3. Returns historical trend charts, recruiter leaderboards, and detailed tabular summaries.
- **Verification Evidence**: `TC-API-02`, `TC-REPO-02` in [`server/tests/analytics.test.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/tests/analytics.test.js#L140).
- **Implementation Status**: **Fully Implemented**.

---

### Feature 4: Skills Intelligence & Demand Analysis
- **Problem Solved**: Maps technical skill prevalence in student profiles and correlates skills with employer recruitment requisitions.
- **Frontend Component**: [`client/src/pages/analytics/AnalyticsSkills.jsx`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/client/src/pages/analytics/AnalyticsSkills.jsx)
- **Backend Route & Controller**: `GET /api/analytics/skills` -> `controller.getSkills`
- **Service Layer**: `warehouseRepo.getSkillsAnalytics()` in [`warehouseRepository.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseRepository.js#L180)
- **Database Tables Involved**: `dwh.dim_skill`, `dwh.bridge_student_skill`, `dwh.bridge_alumni_skill`, `dwh.bridge_job_skill`.
- **Processing Steps**:
  1. Computes frequency counts of skill associations across student, alumni, and job requisition bridges.
  2. Categorizes skills into Programming Languages, Cloud & Infrastructure, Data Science & AI, Web Technologies, and Core Engineering.
  3. Returns high-demand skill bar charts, category donut breakdowns, and demand ranking tables.
- **Verification Evidence**: `TC-API-03`, `TC-REPO-03` in [`server/tests/analytics.test.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/tests/analytics.test.js#L160).
- **Implementation Status**: **Fully Implemented**.

---

### Feature 5: Alumni Demographics & Career Progression
- **Problem Solved**: Tracks alumni geographical concentration, industry distribution, and years of experience across graduation batches.
- **Frontend Component**: [`client/src/pages/analytics/AnalyticsAlumni.jsx`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/client/src/pages/analytics/AnalyticsAlumni.jsx)
- **Backend Route & Controller**: `GET /api/analytics/alumni` -> `controller.getAlumni`
- **Service Layer**: `warehouseRepo.getAlumniAnalytics()` in [`warehouseRepository.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseRepository.js#L240)
- **Database Tables Involved**: `dwh.dim_alumni`.
- **Processing Steps**:
  1. Aggregates 2,026 alumni records by `location_region` (e.g., Bengaluru, Mumbai, Pune, International) and `industry` (e.g., SaaS, FinTech, Cybersecurity).
  2. Calculates career level distributions (Entry-Level, Mid-Level, Senior, Leadership).
  3. Returns interactive demographic donuts, regional bar distributions, and mentor availability metrics.
- **Verification Evidence**: `TC-REPO-04` in [`server/tests/analytics.test.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/tests/analytics.test.js#L175).
- **Implementation Status**: **Fully Implemented**.

---

### Feature 6: Multidimensional OLAP Cube Explorer
- **Problem Solved**: Provides online analytical processing enabling users to explore career metrics across arbitrary dimensional axes with zero pre-computed hardcoding.
- **Frontend Component**: [`client/src/pages/analytics/AnalyticsOLAP.jsx`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/client/src/pages/analytics/AnalyticsOLAP.jsx)
- **Backend Route & Controller**: `GET /api/analytics/olap` -> `controller.getOlap`
- **Service Layer**: `warehouseRepo.getOlapData()` in [`warehouseRepository.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseRepository.js#L305)
- **Database Tables Involved**: `dwh.fact_placement`, `dwh.dim_student`, `dwh.dim_company`, `dwh.dim_date`.
- **Operations Supported**:
  - **Roll-up**: Aggregating detailed records to higher-level dimensions (e.g., individual offers to Department CTC averages).
  - **Drill-down**: Expanding a parent summary into child facets (e.g., Department -> Specific Recruiters).
  - **Slice & Dice**: Filtering on multiple dimension attributes simultaneously (`sliceDept`, `sliceTier`, `sliceYear`, `sliceCompany`).
  - **2D Matrix Pivot**: Dynamically mapping one dimension to the Row Axis and a second dimension to the Column Axis (e.g., Department vs. Graduation Year matrix).
- **Verification Evidence**: `TC-P4-01` through `TC-P4-11` in [`server/tests/analytics.test.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/tests/analytics.test.js#L415).
- **Implementation Status**: **Fully Implemented**.

---

### Feature 7: Data Mining — K-Means Profile Clustering
- **Problem Solved**: Unsupervised clustering of 2,000 alumni career profiles into distinct career segments for institutional benchmarking.
- **Frontend Component**: `AnalyticsMining.jsx` (Tab 1: Clustering)
- **Backend Routes**:
  - `GET /api/analytics/datamining/clustering`
  - `GET /api/analytics/datamining/clustering/evaluation`
- **Service Layer**: [`server/src/services/datamining/clusteringService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/clusteringService.js)
- **Database Tables Involved**: `dwh.dim_alumni`, `dwh.bridge_alumni_skill`, `dwh.dim_skill`.
- **Processing Steps**:
  1. Feature Engineering: Encodes continuous features (experience years, graduation cohort) and standardized one-hot skill vectors for top $N$ technical skills ($z$-score normalization).
  2. Executes K-Means with randomized initialization and deterministic seed (`randomSeed: 2026`).
  3. Iterates until centroid convergence or maximum 50 iterations.
  4. Computes Within-Cluster Sum of Squares (Inertia/WCSS) and Silhouette Score across candidate $k \in [2, 8]$ for Elbow Method validation.
  5. Computes 2D Principal Component Analysis (PCA) projection matrix for visual cluster scatter rendering.
- **Verification Evidence**: 5 unit tests in [`datamining.clustering.test.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/tests/datamining.clustering.test.js) and integration tests in [`datamining.integration.test.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/tests/datamining.integration.test.js).
- **Implementation Status**: **Fully Implemented**.

---

### Feature 8: Data Mining — Apriori Association Rule Mining
- **Problem Solved**: Discovers high-confidence skill affinity rules and co-requisite competencies from market baskets.
- **Frontend Component**: `AnalyticsMining.jsx` (Tab 2: Association Rules)
- **Backend Route**: `GET /api/analytics/datamining/association-rules`
- **Service Layer**: [`server/src/services/datamining/associationRulesService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/associationRulesService.js)
- **Database Tables Involved**:
  - **Mode A (Alumni Skills)**: `dwh.dim_alumni`, `dwh.bridge_alumni_skill`, `dwh.dim_skill` (2,000 candidate baskets).
  - **Mode B (Job Skills)**: `dwh.dim_job`, `dwh.bridge_job_skill`, `dwh.dim_skill` (5,000 recruiter baskets).
- **Processing Steps**:
  1. Assembles discrete transaction baskets: each transaction represents one alumnus (Mode A) or one job posting (Mode B) containing set of acquired skills.
  2. Iteratively generates candidate itemsets $C_k$, filters by `minSupport`, and prunes non-frequent subsets according to the Apriori Property.
  3. Generates non-overlapping antecedent $\Rightarrow$ consequent rules meeting `minConfidence` and `minLift`.
  4. Returns rule inventory with metrics, scatter plot (Support vs. Confidence sized by Lift), and rejection diagnostics.
- **Verification Evidence**: 7 unit tests in [`datamining.association.test.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/tests/datamining.association.test.js).
- **Implementation Status**: **Fully Implemented**.

---

### Feature 9: Data Mining — Supervised Career Outcome Classification
- **Problem Solved**: Predicts 6-month career placement likelihood and employment tier for graduating students.
- **Frontend Component**: `AnalyticsMining.jsx` (Tab 3: Career Classification)
- **Backend Routes**:
  - `GET /api/analytics/datamining/classification/metadata`
  - `POST /api/analytics/datamining/classification/train`
  - `POST /api/analytics/datamining/classification/predict`
- **Service Layer**: [`server/src/services/datamining/classificationService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/classificationService.js)
- **Database Tables Involved**: `dwh.fact_career_outcomes`, `dwh.dim_alumni`, `dwh.bridge_alumni_skill`.
- **Processing Steps**:
  1. Target variable: `employed_within_6_months` and `career_level`.
  2. Features: Skill set vectors, internship count, years of experience, engineering degree, department.
  3. Executes Stratified 80/20 train/test split.
  4. Trains model and evaluates Confusion Matrix (TP, FP, TN, FN), Accuracy, Precision, Recall, F1-Score, and ROC-AUC.
  5. Predict endpoint allows interactive testing by selecting skills and years of experience to calculate placement probabilities.
- **Verification Evidence**: 4 unit tests in [`datamining.classification.test.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/tests/datamining.classification.test.js).
- **Implementation Status**: **Fully Implemented**.

---

### Feature 10: Independent CSV Ingestion, Validation & Audit Console
- **Problem Solved**: Ingests external datasets without database downtime, verifying schema compliance, foreign key existence, and logging batches immutably.
- **Frontend Component**: [`client/src/pages/analytics/AnalyticsDataManagement.jsx`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/client/src/pages/analytics/AnalyticsDataManagement.jsx)
- **Backend Routes**:
  - `POST /api/analytics/etl/upload`
  - `POST /api/analytics/etl/confirm-import`
  - `POST /api/analytics/etl/rollback-import`
  - `GET /api/analytics/etl/history`
  - `GET /api/analytics/etl/history/:batchId/errors`
- **Service Layer**: [`server/src/services/dwh/csvIngestionService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/csvIngestionService.js)
- **Database Tables Involved**: `dwh.etl_batches`, `dwh.etl_batch_errors`, and target warehouse tables.
- **Processing Steps**:
  1. File Upload: Multipart CSV buffered in memory (max 15MB).
  2. Schema Detection: Evaluates header row against known dataset schemas (`DATASET_SCHEMAS`).
  3. Row Validation: Validates data types, date formats, negative packages, and chronological order (e.g., job application date cannot precede job posting date).
  4. Referential Resolution: Checks natural foreign keys in database or chained dry-run memory.
  5. Dry-Run Preview: Returns total rows, valid rows, invalid rows, sample errors, and staging token without database writes.
  6. Atomic Commit: User confirmation executes transactional write inside `withTransaction`, assigning `record_source = 'csv_import'`.
  7. Rollback: Supports reversing a batch by `batchId`, removing inserted rows and updating audit status to `ROLLED_BACK`.
- **Verification Evidence**: `TC-CSV-01` through `TC-CSV-04`, `TC-P45-01` through `TC-P45-08` in [`server/tests/analytics.test.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/tests/analytics.test.js#L210).
- **Implementation Status**: **Fully Implemented**.

---

## 3. Feature-to-Diagram Architectural Traceability Matrix

Every feature documented above is visually modeled in the dedicated architecture and workflow diagrams in [`diagrams/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/):

| Feature # | Feature Module Name | Primary Architectural Diagram | Supporting Workflow Diagram |
| :--- | :--- | :--- | :--- |
| **F01** | Executive Overview Dashboard | [`01_system_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/01_system_architecture.mmd) | [`02_frontend_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/02_frontend_architecture.mmd) |
| **F02** | Warehouse Explorer & ERD | [`04_warehouse_erd.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/04_warehouse_erd.mmd) | [`03_backend_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/03_backend_architecture.mmd) |
| **F03** | Placements & Compensation | [`09_olap_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/09_olap_workflow.mmd) | [`07_api_request_lifecycle.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/07_api_request_lifecycle.mmd) |
| **F04** | Skills Gap Intelligence | [`05_dataset_relationships.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/05_dataset_relationships.mmd) | [`09_olap_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/09_olap_workflow.mmd) |
| **F05** | Alumni Insights & Tracking | [`05_dataset_relationships.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/05_dataset_relationships.mmd) | [`01_system_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/01_system_architecture.mmd) |
| **F06** | OLAP Multidimensional Cube | [`09_olap_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/09_olap_workflow.mmd) | [`08_analytics_sequence.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/08_analytics_sequence.mmd) |
| **F07** | Apriori Association Rules | [`10_apriori_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/10_apriori_workflow.mmd) | [`08_analytics_sequence.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/08_analytics_sequence.mmd) |
| **F08** | K-Means++ Clustering & PCA | [`12_clustering_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/12_clustering_workflow.mmd) | [`03_backend_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/03_backend_architecture.mmd) |
| **F09** | Career Outcome Classifier | [`11_classification_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/11_classification_workflow.mmd) | [`07_api_request_lifecycle.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/07_api_request_lifecycle.mmd) |
| **F10** | CSV Ingestion & Audit | [`06_etl_data_lineage.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/06_etl_data_lineage.mmd) | [`13_auth_flow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/13_auth_flow.mmd) |




---


<a id="03-tech-stack-and-module-inventory-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 03_TECH_STACK_AND_MODULE_INVENTORY.md -->
<!-- ===================================================================== -->

# Document 03: Technology Stack, Dependencies, and Module Inventory

**Subsystem**: Standalone Data Warehousing and Data Mining (DWM) Analytical Intelligence Platform  
**Document**: [`03_TECH_STACK_AND_MODULE_INVENTORY.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/03_TECH_STACK_AND_MODULE_INVENTORY.md)  
**Status**: Verified from Package Manifests & Codebase  

---

## 1. Verified Technology Stack

| Layer / Subsystem | Technology | Version | Purpose & Architecture Role |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.1.0` | Declarative component UI engine for all analytical cockpits. |
| **Frontend Router** | React Router DOM | `^7.6.0` | Client-side routing supporting both root and `/analytics` prefixed paths. |
| **Frontend Build Tool** | Vite | `^6.3.5` | ES module dev server (Port 5174) and Rollup production bundler. |
| **Frontend Styling** | Tailwind CSS / Vite Plugin | `^4.1.7` | Utility-first styling with custom Swiss Minimal dark-mode tokens. |
| **Backend Runtime** | Node.js | `>=20.x` (Tested v24) | High-performance asynchronous JavaScript server environment. |
| **Backend Web Server** | Express | `^5.1.0` | REST API routing, middleware chaining, and controller dispatching. |
| **Database Engine** | PostgreSQL / PGlite | `16.x` / `^0.5.8` | Relational storage engine hosting the `dwh` dimensional schema. |
| **Database Driver** | `pg` (node-postgres) | `^8.16.0` | Connection pooling, parameterized SQL queries, and transaction management. |
| **Schema Validation** | Zod | `^3.25.0` | Strict runtime type validation for query parameters and JSON payloads. |
| **File Upload Handling** | Multer | `^2.0.0` | Memory-buffered multipart form parsing for CSV ingestion (max 15MB). |
| **Security & Headers** | Helmet | `^8.1.0` | Standard HTTP security headers (`nosniff`, `DENY` x-frame). |
| **CORS Middleware** | cors | `^2.8.5` | Cross-Origin Resource Sharing allowing origin requests from Port 5174. |
| **Config Loader** | dotenv | `^16.5.0` | Environment variable loader resolving `.env` from DWM root. |
| **Testing Harness** | Node Test Runner (`node:test`) | Built-in | Native test runner executing unit and integration suites with isolated PGlite. |
| **HTTP Assertions** | Supertest | `^7.1.0` | Ephemeral HTTP client testing Express routes without external port binding. |

---

## 2. Comprehensive Module Inventory

The table below catalogs every significant code module in the DWM codebase:

| Module Identifier | Physical File Path | Architectural Responsibility | Key Inputs | Key Outputs | Internal & External Dependencies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Server Entry** | [`server/server.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/server.js) | Server boot, DB health check, port binding, and graceful shutdown. | Environment variables | HTTP Server on Port 5001 | `express`, `env.js`, `database.js` | Verified |
| **Express App Config** | [`server/src/app.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/app.js) | Middleware composition, CORS, Helmet, JSON parsing, and error handling. | Incoming HTTP requests | Dispatched Express request | `cors`, `helmet`, `routes/index.js` | Verified |
| **Router Index** | [`server/src/routes/index.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/routes/index.js) | Top-level routing: `/health`, `/analytics`, `/mining`, `/datamining`. | Express request | Routed controller | `analyticsRoutes.js`, `dataminingRoutes.js` | Verified |
| **Analytics Routes** | [`server/src/routes/analyticsRoutes.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/routes/analyticsRoutes.js) | Declares validation schemas and endpoints for OLAP, warehouse, and ETL. | HTTP params/queries | Validated controller call | `zod`, `analyticsController.js` | Verified |
| **Mining Routes** | [`server/src/routes/dataminingRoutes.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/routes/dataminingRoutes.js) | Declares endpoints for Clustering, Apriori rules, and Classifier. | HTTP query/body | Controller dispatch | `dataminingController.js` | Verified |
| **Analytics Controller**| [`server/src/controllers/analyticsController.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/controllers/analyticsController.js) | Unpacks requests, invokes DWH services, handles exceptions. | Request context | JSON response | `warehouseRepository.js`, `overviewService.js` | Verified |
| **Mining Controller** | [`server/src/controllers/dataminingController.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/controllers/dataminingController.js) | Validates ML parameters and dispatches mining executions. | ML query/body params | Formatted algorithm results | `clusteringService.js`, `associationRulesService.js` | Verified |
| **Warehouse Overview Service**| [`server/src/services/dwh/warehouseOverviewService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseOverviewService.js) | Introspects catalog, computes KPIs, profiles columns, evaluates 38 checks. | Table name, options | ERD nodes, schema, quality report | `config/dwh.js`, `pg` | Verified |
| **Warehouse Repository** | [`server/src/services/dwh/warehouseRepository.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseRepository.js) | Parameterized analytical SQL queries for Overview, OLAP, Career, Skills. | Dimensional filters | Aggregated metric sets | `config/dwh.js` | Verified |
| **CSV Ingestion Service**| [`server/src/services/dwh/csvIngestionService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/csvIngestionService.js) | Validates CSV syntax, schema mapping, relational chaining, commit/rollback. | Raw CSV text, dataset type | Staging token, batch ledger row | `config/database.js` | Verified |
| **ETL Benchmark Pipeline**| [`server/src/services/dwh/etlPipeline.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/etlPipeline.js) | Seeds verified benchmark historical placement & salary records. | None | Seeded benchmark dimensions | `config/database.js` | Verified |
| **Clustering Service** | [`server/src/services/datamining/clusteringService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/clusteringService.js) | K-Means clustering, PCA 2D projections, Elbow Inertia, and Silhouette score. | $k$, randomSeed, recordSource | Centroids, clusters, projections | `dataminingRepository.js` | Verified |
| **Association Rules Service**| [`server/src/services/datamining/associationRulesService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/associationRulesService.js) | Apriori algorithm: builds baskets, generates itemsets, prunes rules by lift. | minSupport, minConfidence, mode | Frequent itemsets, valid rules | `dataminingRepository.js` | Verified |
| **Classification Service**| [`server/src/services/datamining/classificationService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/classificationService.js) | Supervised career outcome prediction, Stratified 80/20 train/test, ROC-AUC. | Training options, candidate | Confusion matrix, predictions | `dataminingRepository.js` | Verified |
| **Mining Façade** | [`server/src/services/mining/miningEngine.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/mining/miningEngine.js) | Facade interface standardizing Apriori, K-Means, and Classifier calls. | Options object | Execution payload | `clusteringService.js`, `associationRulesService.js` | Verified |
| **Database Pool** | [`server/src/config/database.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/config/database.js) | PostgreSQL client pool, single-session PGlite safeguard, transaction wrapper. | SQL string, parameters | Query result rows | `pg`, `env.js` | Verified |
| **DWH Schema Config** | [`server/src/config/dwh.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/config/dwh.js) | Schema constant `dwh` and schema-scoped query runner helper. | SQL query, parameters | Query result rows | `config/database.js` | Verified |
| **Analyst Auth Middleware**| [`server/src/middleware/auth.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/middleware/auth.js) | Standalone analyst authentication (API Key, Bearer, or default Analyst session).| HTTP Authorization header | `req.user` assigned | Standalone | Verified |
| **Validation Middleware**| [`server/src/middleware/validate.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/middleware/validate.js) | Zod schema validation middleware extracting query, body, and params. | Zod schema | Validated payload or 422 error | `zod` | Verified |
| **Upload Middleware** | [`server/src/middleware/upload.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/middleware/upload.js) | Memory storage Multer upload handler enforcing 15MB limit. | Multipart HTTP stream | `req.file` buffer | `multer` | Verified |

---

## 3. Environment Variables Specification

The system reads environment configuration from [`DWM-project/.env`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/.env) or process environment variables:

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `PORT` / `DWM_PORT` | No | `5001` | TCP port on which the DWM Express API listens. |
| `CLIENT_URL` / `DWM_CLIENT_URL` | No | `http://localhost:5174` | Allowed CORS origin for the DWM React client. |
| `DATABASE_URL` / `DWM_DATABASE_URL` | Yes | `postgresql://postgres:postgres@127.0.0.1:54329/postgres` | PostgreSQL connection URI pointing to the warehouse database instance. |
| `DATABASE_SSL` | No | `false` | Enable/disable SSL for cloud-hosted PostgreSQL instances. |
| `DATABASE_POOL_MAX` | No | `10` | Maximum number of concurrent connections in the PostgreSQL client pool. |
| `NODE_ENV` | No | `development` | Node environment (`development`, `test`, `production`). |
| `JWT_ACCESS_SECRET` | No | `dwm-standalone-secret-...` | Standalone signing key for analyst session tokens. |

---

## 4. Operational Boundaries Between DWM and Alumni Network

```text
Boundary Dimension       Alumni Network (Parent Portal)          DWM Analytical Platform
──────────────────────────────────────────────────────────────────────────────────────────
Directory Location       client/ and server/                     DWM-project/
Network Ports            Frontend: 5173 | Backend: 5000          Frontend: 5174 | Backend: 5001
Database Schema          public                                  dwh
Data Entities            users, mentorship, events, jobs         dim_*, fact_*, bridge_*, etl_*
Operational Dependency   None                                    None (Completely decoupled)
Operational Sync API     None                                    Removed (Returns 404)
Authentication Model     BCrypt passwords, Cookie JWT on users   Standalone Analyst Session / Key
```



---


<a id="04-dataset-catalog-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 04_DATASET_CATALOG.md -->
<!-- ===================================================================== -->

# Document 04: Synthetic Dataset Catalog & Physical Specification

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




---


<a id="05-data-dictionary-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 05_DATA_DICTIONARY.md -->
<!-- ===================================================================== -->

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



---


<a id="06-data-quality-and-provenance-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 06_DATA_QUALITY_AND_PROVENANCE.md -->
<!-- ===================================================================== -->

# Document 06: Data Quality Diagnostics, Integrity Rules, and Provenance

**Subsystem**: Standalone Data Warehousing and Data Mining (DWM) Analytical Intelligence Platform  
**Document**: [`06_DATA_QUALITY_AND_PROVENANCE.md`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/06_DATA_QUALITY_AND_PROVENANCE.md)  
**Status**: 38 Automated Quality Checks Verified (37 / 38 Passing = 97.4% Health Score)  

---

## 1. Automated Data Quality Suite (38 Checks)

The DWM platform incorporates an automated, read-only diagnostic suite in [`server/src/services/dwh/warehouseOverviewService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseOverviewService.js#L720) executed via `GET /api/analytics/warehouse/quality`.

The suite executes 38 SQL verification assertions categorized into four structural quadrants:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   38 Automated Data Quality Checks                     │
├────────────────────────────────┬───────────────────────────────────────┤
│ Quadrant 1: PK Uniqueness (15) │ Guarantees zero duplicate primary     │
│                                │ surrogate keys across all 15 tables.  │
├────────────────────────────────┼───────────────────────────────────────┤
│ Quadrant 2: FK Integrity (10)  │ Guarantees zero orphaned records in   │
│                                │ facts and many-to-many bridge tables. │
├────────────────────────────────┼───────────────────────────────────────┤
│ Quadrant 3: Domain Validity (8)│ Enforces positive compensation, non-  │
│                                │ negative experience, valid CGPA scale.│
├────────────────────────────────┼───────────────────────────────────────┤
│ Quadrant 4: Chronology & Errors│ Enforces application dates >= posting;│
│             (5 checks)         │ audits logged ingestion errors.       │
└────────────────────────────────┴───────────────────────────────────────┘
```

### Table 1: Complete 38-Point Quality Assertion Matrix

| Check ID | Target Entity | Rule Category | Specific SQL Assertion / Invariant | Status | Actual Violations |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **QC-01** | `dim_student` | PK Uniqueness | `COUNT(*) = COUNT(DISTINCT student_sk)` | **PASS** | 0 |
| **QC-02** | `dim_alumni` | PK Uniqueness | `COUNT(*) = COUNT(DISTINCT alumni_sk)` | **PASS** | 0 |
| **QC-03** | `dim_company` | PK Uniqueness | `COUNT(*) = COUNT(DISTINCT company_sk)` | **PASS** | 0 |
| **QC-04** | `dim_skill` | PK Uniqueness | `COUNT(*) = COUNT(DISTINCT skill_sk)` | **PASS** | 0 |
| **QC-05** | `dim_date` | PK Uniqueness | `COUNT(*) = COUNT(DISTINCT date_sk)` | **PASS** | 0 |
| **QC-06** | `dim_job` | PK Uniqueness | `COUNT(*) = COUNT(DISTINCT job_sk)` | **PASS** | 0 |
| **QC-07** | `bridge_student_skill`| Composite PK | Zero duplicate pairs on `(student_sk, skill_sk)` | **PASS** | 0 |
| **QC-08** | `bridge_alumni_skill` | Composite PK | Zero duplicate pairs on `(alumni_sk, skill_sk)` | **PASS** | 0 |
| **QC-09** | `bridge_job_skill` | Composite PK | Zero duplicate pairs on `(job_sk, skill_sk)` | **PASS** | 0 |
| **QC-10** | `fact_placement` | PK Uniqueness | `COUNT(*) = COUNT(DISTINCT placement_id)` | **PASS** | 0 |
| **QC-11** | `fact_job_application`| PK Uniqueness | `COUNT(*) = COUNT(DISTINCT application_id)` | **PASS** | 0 |
| **QC-12** | `fact_salary_benchmark`| PK Uniqueness | `COUNT(*) = COUNT(DISTINCT benchmark_id)` | **PASS** | 0 |
| **QC-13** | `fact_career_outcomes`| PK Uniqueness | `COUNT(*) = COUNT(DISTINCT outcome_id)` | **PASS** | 0 |
| **QC-14** | `etl_batches` | PK Uniqueness | `COUNT(*) = COUNT(DISTINCT id)` | **PASS** | 0 |
| **QC-15** | `etl_batch_errors` | PK Uniqueness | `COUNT(*) = COUNT(DISTINCT id)` | **PASS** | 0 |
| **QC-16** | `fact_placement -> dim_student` | Referential FK | Zero placements referencing missing `student_sk` | **PASS** | 0 |
| **QC-17** | `fact_placement -> dim_company` | Referential FK | Zero placements referencing missing `company_sk` | **PASS** | 0 |
| **QC-18** | `fact_placement -> dim_date` | Referential FK | Zero placements referencing invalid `offer_date_sk` | **PASS** | 0 |
| **QC-19** | `fact_job_application -> dim_job` | Referential FK | Zero applications referencing non-existent `job_sk`| **PASS** | 0 |
| **QC-20** | `fact_job_application -> dim_alumni` | Referential FK | Zero applications referencing missing `alumni_sk` | **PASS** | 0 |
| **QC-21** | `fact_career_outcomes -> dim_alumni`| Referential FK | Zero outcomes referencing missing `alumni_sk` | **PASS** | 0 |
| **QC-22** | `bridge_alumni_skill -> dim_alumni` | Referential FK | Zero bridge rows referencing missing `alumni_sk` | **PASS** | 0 |
| **QC-23** | `bridge_alumni_skill -> dim_skill` | Referential FK | Zero bridge rows referencing missing `skill_sk` | **PASS** | 0 |
| **QC-24** | `bridge_job_skill -> dim_job` | Referential FK | Zero bridge rows referencing missing `job_sk` | **PASS** | 0 |
| **QC-25** | `bridge_job_skill -> dim_skill` | Referential FK | Zero bridge rows referencing missing `skill_sk` | **PASS** | 0 |
| **QC-26** | `fact_placement` | Domain Validity | `annual_package_lpa > 0` (zero negative packages) | **PASS** | 0 |
| **QC-27** | `fact_placement` | Domain Ceiling | `annual_package_lpa <= 150.0` (realistic CTC bounds)| **PASS** | 0 |
| **QC-28** | `dim_student` | Domain Validity | `cgpa >= 0.0 AND cgpa <= 10.0` | **PASS** | 0 |
| **QC-29** | `dim_student` | Domain Validity | `tenth_percentage >= 0 AND tenth_percentage <= 100`| **PASS** | 0 |
| **QC-30** | `dim_alumni` | Domain Validity | `experience_years >= 0.0 AND experience_years <= 50.0`| **PASS** | 0 |
| **QC-31** | `dim_date` | Calendar Bounds | Consecutive unbroken date series between 2018-2030 | **PASS** | 0 |
| **QC-32** | `dim_job` | Date Invariant | `posted_date IS NOT NULL` | **PASS** | 0 |
| **QC-33** | `dim_skill` | Taxonomy Bounds | Non-empty `category` and `skill_name` | **PASS** | 0 |
| **QC-34** | `fact_job_application` | Chronology | Application date $\ge$ Job requisition posted date | **PASS** | 0 |
| **QC-35** | `dim_company` | Tier Domain | Tier $\in$ `{'Super Dream', 'Dream', 'Core / Mass'}`| **PASS** | 0 |
| **QC-36** | `fact_career_outcomes` | Class Target | Target $\in \{0, 1\}$ (Binary outcome variable) | **PASS** | 0 |
| **QC-37** | `bridge_student_skill` | Domain Validity | Skill proficiency rank $\in \{\text{beginner}, \text{intermediate}, \text{expert}\}$ | **PASS** | 0 |
| **QC-38** | `etl_batch_errors` | Ingestion Audit | Ingestion batch error count vs. total rows processed | **WARN** | 46 logged rejected test rows |

**Overall Result**: 37 Passed, 1 Warning (46 historical rejected rows in audit ledger from deliberate negative test cases like `INVALID-01` in `TC-CSV-02`). System Health: **HEALTHY (97.4%)**.

---

## 2. Ingestion Validation Rules

When external CSV files are ingested via [`server/src/services/dwh/csvIngestionService.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/csvIngestionService.js), row-level validation enforces:

1. **Mandatory Field Presence**: Rejects rows missing canonical identifiers or primary metrics (e.g., student ID, package LPA, job title).
2. **Flexible Header Alias Resolution**: Maps divergent column names to standard warehouse fields using `DATASET_SCHEMAS`:
   - `package_lpa` resolves: `['package_lpa', 'annual_package_lpa', 'ctc_lpa', 'salary_lpa', 'ctc', 'lpa']`
   - `student_id` resolves: `['student_id', 'student_id_number', 'roll_no', 'roll_number', 'studentid', 'id']`
3. **Numeric Type Coercion & Bounds**:
   - Packages must be positive floats: `parseFloat(val) > 0`.
   - Experience must be non-negative: `parseFloat(val) >= 0`.
   - CGPA must satisfy $0 \le \text{cgpa} \le 10$.
4. **Chronological Paradox Prevention**:
   - For applications, `application_date` must not precede the `posted_date` of the referenced job requisition. Violations are rejected with: `'Application date cannot be before job posted date'`.
5. **Relational Natural Key Resolution**:
   - Foreign keys in CSV files are provided as human-readable natural identifiers (e.g., `alumni_id = 'ALU-0042'`, `skill_id = 'SK-014'`).
   - The ingestion engine resolves natural keys to surrogate warehouse integer keys (`alumni_sk`, `skill_sk`).
   - If a referenced natural key does not exist in the warehouse dimension and was not staged in an upstream dry-run batch, the row is rejected with an orphaned foreign key exception.

---

## 3. Data Lineage & Provenance Tracking

Every record entering the analytical warehouse is stamped with an explicit `record_source` attribute to guarantee provenance integrity:

| `record_source` Value | Definition & Origin | Analytical Treatment |
| :--- | :--- | :--- |
| `'indian_academic_benchmark'` | Generated by [`generate_dwm_datasets.py`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/scripts/generate_dwm_datasets.py) for reproducible benchmarks. | Used in baseline Data Mining experiments (Apriori, K-Means, Classifier). |
| `'benchmark'` | Multi-year verified placement benchmark seeded by [`etlPipeline.js`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/etlPipeline.js). | Used for executive historical reporting (2018–2025). |
| `'csv_import'` | Ingested via the DWM CSV Ingestion Console by an institutional administrator. | Tracked through `dwh.etl_batches` with batch UUIDs. |
| `'operational'` | Legacy operational snapshot from historical migration. | Quarantined to analytical queries; zero operational updates. |

The frontend source selector allows analysts to filter OLAP cubes and Data Mining algorithms by specific source or explore **`ALL (All Ingested Warehouse Data)`** while maintaining transparency regarding data origin.



---


<a id="07-data-warehouse-design-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 07_DATA_WAREHOUSE_DESIGN.md -->
<!-- ===================================================================== -->

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




---


<a id="08-database-erd-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 08_DATABASE_ERD.md -->
<!-- ===================================================================== -->

# 08. Database Entity Relationship Diagram (ERD)

## 1. Complete Fact Constellation ER Diagram

Below is the verified Mermaid Entity Relationship Diagram representing the complete **15 tables** and **22 explicit referential constraints** in the `dwh` schema of the DWM project.

```mermaid
erDiagram
    %% ==========================================
    %% CONFORMED DIMENSIONS
    %% ==========================================
    dim_student {
        SERIAL student_sk PK
        UUID source_user_id "Nullable Informational"
        VARCHAR student_id_number
        VARCHAR department
        VARCHAR degree
        INT admission_year
        INT graduation_year
        NUMERIC cgpa
        NUMERIC tenth_percentage
        NUMERIC twelfth_percentage
        INT internships_count
        INT backlogs_count
        VARCHAR placement_status
        VARCHAR record_source
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    dim_alumni {
        SERIAL alumni_sk PK
        UUID source_user_id "Nullable Informational"
        VARCHAR natural_alumni_id UK
        VARCHAR degree
        INT graduation_year
        VARCHAR department
        VARCHAR current_company
        VARCHAR job_role
        VARCHAR industry
        VARCHAR career_level
        NUMERIC experience_years
        VARCHAR city
        VARCHAR country
        BOOLEAN is_mentor
        BOOLEAN is_donor
        VARCHAR record_source
        DATE valid_from
        DATE valid_to
        BOOLEAN is_current
        TIMESTAMPTZ created_at
    }

    dim_company {
        SERIAL company_sk PK
        VARCHAR natural_company_id UK
        VARCHAR company_name UK
        VARCHAR industry
        VARCHAR company_tier
        VARCHAR headquarters_location
        VARCHAR record_source
        TIMESTAMPTZ created_at
    }

    dim_skill {
        SERIAL skill_sk PK
        VARCHAR natural_skill_id UK
        VARCHAR skill_name UK
        VARCHAR category
        VARCHAR record_source
        TIMESTAMPTZ created_at
    }

    dim_date {
        INT date_sk PK "YYYYMMDD"
        DATE full_date UK
        INT year
        INT quarter
        INT month
        VARCHAR month_name
        INT day_of_month
        INT day_of_week
        VARCHAR day_name
        BOOLEAN is_weekend
        VARCHAR academic_year
        VARCHAR academic_semester
    }

    dim_job {
        SERIAL job_sk PK
        VARCHAR natural_job_id UK
        INT company_sk FK
        VARCHAR company_name
        VARCHAR job_title
        VARCHAR industry
        VARCHAR location_region
        VARCHAR employment_type
        DATE posted_date
        INT posted_date_sk FK
        VARCHAR experience_level
        VARCHAR record_source
        TIMESTAMPTZ created_at
    }

    %% ==========================================
    %% MULTIVALUED BRIDGES
    %% ==========================================
    bridge_student_skill {
        INT student_sk PK,FK
        INT skill_sk PK,FK
        VARCHAR proficiency_level
        TIMESTAMPTZ created_at
    }

    bridge_alumni_skill {
        INT alumni_sk PK,FK
        INT skill_sk PK,FK
        VARCHAR proficiency_level
        INT years_used
        VARCHAR record_source
        TIMESTAMPTZ created_at
    }

    bridge_job_skill {
        INT job_sk PK,FK
        INT skill_sk PK,FK
        VARCHAR required_level
        VARCHAR record_source
        TIMESTAMPTZ created_at
    }

    %% ==========================================
    %% FACT TABLES
    %% ==========================================
    fact_placement {
        SERIAL placement_id PK
        INT student_sk FK
        INT company_sk FK
        INT offer_date_sk FK
        NUMERIC annual_package_lpa
        NUMERIC base_salary_inr
        NUMERIC bonus_inr
        INT offers_count
        NUMERIC aptitude_score
        NUMERIC technical_test_score
        NUMERIC interview_score
        INT readiness_score
        BOOLEAN is_on_campus
        VARCHAR record_source
        TIMESTAMPTZ created_at
    }

    fact_job_application {
        SERIAL application_id PK
        VARCHAR natural_application_id UK
        INT student_sk FK "Nullable"
        INT alumni_sk FK "Nullable"
        INT company_sk FK
        INT job_sk FK "Nullable"
        INT applied_date_sk FK
        INT reviewed_date_sk FK "Nullable"
        INT ats_match_score
        INT days_to_decision
        INT is_shortlisted
        INT is_selected
        VARCHAR application_status
        VARCHAR record_source
        TIMESTAMPTZ created_at
    }

    fact_salary_benchmark {
        SERIAL salary_id PK
        INT alumni_sk FK "Nullable"
        INT company_sk FK
        INT effective_date_sk FK
        NUMERIC experience_years
        NUMERIC total_annual_comp_inr
        VARCHAR salary_band_tier
        VARCHAR record_source
        TIMESTAMPTZ created_at
    }

    fact_career_outcomes {
        SERIAL outcome_id PK
        VARCHAR natural_outcome_id UK
        INT alumni_sk FK,UK
        INT observation_period_months
        INT employed_within_6_months "Target (0/1)"
        VARCHAR career_level
        VARCHAR industry
        NUMERIC experience_years_at_observation
        VARCHAR record_source
        BOOLEAN is_synthetic_educational_target
        TIMESTAMPTZ created_at
    }

    %% ==========================================
    %% AUDIT AND ETL LEDGERS
    %% ==========================================
    etl_batches {
        UUID id PK
        VARCHAR batch_type
        VARCHAR file_name
        VARCHAR status
        INT rows_total
        INT rows_inserted
        INT rows_rejected
        JSONB staged_data
        TEXT error_summary
        TIMESTAMPTZ started_at
        TIMESTAMPTZ completed_at
    }

    etl_batch_errors {
        BIGSERIAL id PK
        UUID batch_id FK
        INT row_number
        JSONB raw_data
        TEXT validation_error
        TIMESTAMPTZ created_at
    }

    %% ==========================================
    %% REFERENTIAL CONSTRAINTS (22 FOREIGN KEYS)
    %% ==========================================
    dim_student ||--o{ bridge_student_skill : "possesses"
    dim_skill ||--o{ bridge_student_skill : "classified_in"

    dim_alumni ||--o{ bridge_alumni_skill : "proficient_in"
    dim_skill ||--o{ bridge_alumni_skill : "referenced_by"

    dim_job ||--o{ bridge_job_skill : "requires"
    dim_skill ||--o{ bridge_job_skill : "demanded_by"

    dim_company ||--o{ dim_job : "advertises"
    dim_date ||--o{ dim_job : "posted_on"

    dim_student ||--o{ fact_placement : "awarded_to"
    dim_company ||--o{ fact_placement : "offered_by"
    dim_date ||--o{ fact_placement : "offered_on"

    dim_student ||--o{ fact_job_application : "submitted_by_student"
    dim_alumni ||--o{ fact_job_application : "submitted_by_alumni"
    dim_company ||--o{ fact_job_application : "received_by"
    dim_job ||--o{ fact_job_application : "targets_requisition"
    dim_date ||--o{ fact_job_application : "applied_on"
    dim_date ||--o{ fact_job_application : "reviewed_on"

    dim_alumni ||--o{ fact_salary_benchmark : "reports_for"
    dim_company ||--o{ fact_salary_benchmark : "compensates_at"
    dim_date ||--o{ fact_salary_benchmark : "benchmarked_on"

    dim_alumni ||--|| fact_career_outcomes : "measured_for_alumnus"

    etl_batches ||--o{ etl_batch_errors : "logs_row_exceptions"
```

---

## 2. Structural Walkthrough of Relationships

### 2.1 The Academic Pipeline Cluster
- `dim_student` forms the core dimension for pre-graduation analytics.
- Final-year employment drives connect `dim_student` to `fact_placement` ($1:N$), capturing compensation packages, aptitude scores, and corporate offers from `dim_company` on temporal dates from `dim_date`.
- Academic competencies are captured via `bridge_student_skill` ($M:N$), linking students to categorized technical competencies in `dim_skill`.

### 2.2 The Longitudinal Alumni & Career Outcomes Cluster
- Upon graduation, career trajectories transition to `dim_alumni`.
- Accreditation compliance (NAAC/NIRF) requires measuring 6-month graduate employment. This is modeled in `fact_career_outcomes` with a strict **1:1 relationship** to `dim_alumni` enforced by unique index `uq_dwh_fact_career_outcomes_alumni`.
- Market salary progression is modeled in `fact_salary_benchmark` ($1:N$), linking alumni cohorts, corporate employers (`dim_company`), and effective calendar dates (`dim_date`).
- Long-term skill profiles are stored in `bridge_alumni_skill` (20,013 associations), enabling Apriori market-basket mining and cluster profile matching.

### 2.3 The Corporate Requisition and Application Funnel Cluster
- Corporate hiring entities (`dim_company`) post openings tracked in `dim_job`.
- Job requisitions articulate mandatory and preferred skills via `bridge_job_skill` (15,008 associations).
- Candidate hiring workflows converge in `fact_job_application` (6,006 rows). This fact table supports polymorphic applicants:
  - Campus student applicants join via `student_sk`.
  - Experienced alumni applicants join via `alumni_sk`.
  - Requisitions join via `job_sk` and corporate entities via `company_sk`.
  - Temporal funnel velocity is measured across `applied_date_sk` and `reviewed_date_sk` from conformed calendar dimension `dim_date`.

### 2.4 The Ingestion and Quality Audit Subsystem
- The operational health of the warehouse is tracked in `etl_batches` (137 batches recorded).
- Row-level validation anomalies and JSON rejection payloads are logged in `etl_batch_errors` with cascading foreign keys (`ON DELETE CASCADE`) to the parent batch manifest.

---

## 3. Referential Constraint Inventory

The schema establishes **22 explicit referential constraints** validated by PostgreSQL:

1. `bridge_student_skill.student_sk` $\rightarrow$ `dim_student.student_sk` (CASCADE)
2. `bridge_student_skill.skill_sk` $\rightarrow$ `dim_skill.skill_sk` (CASCADE)
3. `bridge_alumni_skill.alumni_sk` $\rightarrow$ `dim_alumni.alumni_sk` (CASCADE)
4. `bridge_alumni_skill.skill_sk` $\rightarrow$ `dim_skill.skill_sk` (CASCADE)
5. `bridge_job_skill.job_sk` $\rightarrow$ `dim_job.job_sk` (CASCADE)
6. `bridge_job_skill.skill_sk` $\rightarrow$ `dim_skill.skill_sk` (CASCADE)
7. `dim_job.company_sk` $\rightarrow$ `dim_company.company_sk` (SET NULL)
8. `dim_job.posted_date_sk` $\rightarrow$ `dim_date.date_sk` (RESTRICT)
9. `fact_placement.student_sk` $\rightarrow$ `dim_student.student_sk` (CASCADE)
10. `fact_placement.company_sk` $\rightarrow$ `dim_company.company_sk` (CASCADE)
11. `fact_placement.offer_date_sk` $\rightarrow$ `dim_date.date_sk` (RESTRICT)
12. `fact_job_application.student_sk` $\rightarrow$ `dim_student.student_sk` (CASCADE)
13. `fact_job_application.alumni_sk` $\rightarrow$ `dim_alumni.alumni_sk` (CASCADE)
14. `fact_job_application.company_sk` $\rightarrow$ `dim_company.company_sk` (CASCADE)
15. `fact_job_application.job_sk` $\rightarrow$ `dim_job.job_sk` (SET NULL)
16. `fact_job_application.applied_date_sk` $\rightarrow$ `dim_date.date_sk` (RESTRICT)
17. `fact_job_application.reviewed_date_sk` $\rightarrow$ `dim_date.date_sk` (RESTRICT)
18. `fact_salary_benchmark.alumni_sk` $\rightarrow$ `dim_alumni.alumni_sk` (SET NULL)
19. `fact_salary_benchmark.company_sk` $\rightarrow$ `dim_company.company_sk` (CASCADE)
20. `fact_salary_benchmark.effective_date_sk` $\rightarrow$ `dim_date.date_sk` (RESTRICT)
21. `fact_career_outcomes.alumni_sk` $\rightarrow$ `dim_alumni.alumni_sk` (CASCADE)
22. `etl_batch_errors.batch_id` $\rightarrow$ `etl_batches.id` (CASCADE)

---

## 4. Standalone Diagram Source Deliverable

The complete Mermaid source specification for this 15-table entity relationship diagram is maintained in:
- **Source File**: [`diagrams/04_warehouse_erd.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/04_warehouse_erd.mmd)
- **Live UI Rendering**: The frontend application renders this schema interactively via SVG at route `/analytics/warehouse` (tab: "Warehouse ERD & Schema").
- **Verification Evidence**: Schema extracted directly from [`database/020_dwm_warehouse_schema.sql`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/database/020_dwm_warehouse_schema.sql) and [`database/021_dwm_synthetic_integration.sql`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/database/021_dwm_synthetic_integration.sql), verified via PostgreSQL information catalog query.




---


<a id="09-system-architecture-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 09_SYSTEM_ARCHITECTURE.md -->
<!-- ===================================================================== -->

# 09. System Architecture and Runtime Topology

## 1. High-Level System Architecture

The DWM platform is engineered as a decoupled, three-tier analytical web application. It operates independently from the operational Alumni Portal, running dedicated frontend and backend runtime processes that interact with an analytical data warehouse hosted in the PostgreSQL `dwh` schema.

```mermaid
graph TD
    subgraph Client Tier ["Client Tier (Browser: React 18 + Vite)"]
        UI_Dash["Dashboard & KPIs<br/>(AnalyticsDashboard.jsx)"]
        UI_OLAP["OLAP Multidimensional Cube<br/>(AnalyticsOLAP.jsx)"]
        UI_Mine["Data Mining Suite<br/>(AnalyticsMining.jsx)"]
        UI_DWH["Warehouse Explorer & ERD<br/>(AnalyticsWarehouse.jsx)"]
        UI_CSV["CSV Ingestion & Ledger<br/>(AnalyticsCSVIngestion.jsx)"]
        API_Client["Axios HTTP Client<br/>(Base URL: /api)"]
    end

    subgraph Server Tier ["Server Tier (Node.js 20+ / Express.js)"]
        Router["Express API Router<br/>(/api/analytics/* & /api/datamining/*)"]
        Auth_MW["Decoupled Auth Middleware<br/>(allowGuestAnalytics)"]
        
        subgraph Controllers ["Controllers"]
            C_Analytics["analyticsController.js"]
            C_Mining["miningController.js"]
            C_CSV["csvIngestionController.js"]
            C_Overview["warehouseOverviewController.js"]
        end

        subgraph Service Layer ["Analytical & Mining Services"]
            S_OLAP["olapService.js<br/>(Cube Slicing, Dicing, Pivoting)"]
            S_Apriori["aprioriService.js<br/>(Candidate Gen & Pruning)"]
            S_KMeans["kmeansService.js<br/>(Multi-run K-Means, WCSS, Silhouette)"]
            S_Classify["classificationService.js<br/>(Logistic Reg, 80/20 Split, ROC)"]
            S_Skills["skillGapService.js<br/>(Supply vs Demand Matching)"]
            S_ETL["csvIngestionService.js<br/>(Validation & Referential Staging)"]
            S_Overview["warehouseOverviewService.js<br/>(Catalog & Row Audits)"]
        end

        subgraph DB Layer ["Database Layer"]
            Pool["dwh.js Connection Pool<br/>(PostgreSQL Client)"]
        end
    end

    subgraph Storage Tier ["Analytical Storage Tier (PostgreSQL / PGlite)"]
        DWH_Schema[("dwh Schema<br/>15 Tables / 56,732 Rows")]
        DWH_Dims["6 Conformed Dimensions<br/>(Student, Alumni, Company, Skill, Date, Job)"]
        DWH_Bridges["3 Multivalued Bridges<br/>(Student-Skill, Alumni-Skill, Job-Skill)"]
        DWH_Facts["4 Fact Tables<br/>(Placement, Applications, Salary, Outcomes)"]
        DWH_Ledger["2 Audit Ledgers<br/>(etl_batches, etl_batch_errors)"]
    end

    UI_Dash --> API_Client
    UI_OLAP --> API_Client
    UI_Mine --> API_Client
    UI_DWH --> API_Client
    UI_CSV --> API_Client

    API_Client -- "HTTP REST (Port 5001)" --> Router
    Router --> Auth_MW
    Auth_MW --> Controllers
    Controllers --> Service Layer
    Service Layer --> Pool
    Pool -- "TCP Socket (Port 54329)" --> DWH_Schema

    DWH_Schema --- DWH_Dims
    DWH_Schema --- DWH_Bridges
    DWH_Schema --- DWH_Facts
    DWH_Schema --- DWH_Ledger
```

---

## 2. Tier Breakdown & Technology Stack

### 2.1 Client Tier (Analytical UI)
- **Framework**: React 18.2.0 bundled with Vite 5.x.
- **Routing**: `react-router-dom` v6 with client-side history management.
- **Styling & Design System**: Tailwind CSS v3 with glassmorphic styling, responsive data grid layouts, and color-coded status badges.
- **Visual Analytics**: Recharts library (Bar charts, Line graphs, Scatter plots for PCA clusters, Radar charts for skill profiles) and Lucide React icons.
- **State & HTTP**: Axios instance with automated error interceptors, local component state hooks (`useState`, `useEffect`, `useMemo`), and optimistic UI updates for long-running mining computations.

### 2.2 Server Tier (Analytical Engine)
- **Runtime**: Node.js 20.x LTS.
- **Web Application Framework**: Express.js 4.19+.
- **Middleware**:
  - `cors`: Configured to permit cross-origin requests from development and production analytical clients.
  - `helmet`: HTTP header security.
  - `express.json()` and `multer`: Multi-part form data handling for CSV file uploads up to 25 MB.
  - `allowGuestAnalytics`: Decoupled middleware permitting unauthenticated analytical exploration across read-only visual endpoints, or optional JWT extraction when available.
- **Architecture Pattern**: Controller-Service-Repository pattern. Controllers handle HTTP request parsing and response envelopes; services encapsulate pure algorithmic logic (Apriori, K-Means, Logistic Regression) and transactional ETL staging; database pools execute parameterized SQL.

### 2.3 Storage Tier (Analytical Warehouse)
- **Database Engine**: Embedded PGlite or external PostgreSQL 16.
- **Port Allocation**: Port `54329` (dev embedded) or `5432` (production Postgres).
- **Schema Boundary**: Dedicated `dwh` schema containing all analytical tables. The operational `public` schema is physically isolated with zero cross-schema triggers, views, or foreign keys.

---

## 3. End-to-End Analytics Request Lifecycle

Below is the execution flow of an analytical query, using an OLAP 2D Matrix aggregation request as a representative lifecycle:

```mermaid
sequenceDiagram
    autonumber
    actor Analyst as Educational Analyst
    participant UI as AnalyticsOLAP.jsx
    participant API as Axios Client (/api)
    participant Ctrl as analyticsController.js
    participant Svc as olapService.js
    participant DB as PostgreSQL (dwh schema)

    Analyst->>UI: Selects Row Axis ("Department") & Column Axis ("Year")
    UI->>API: GET /api/analytics/olap/matrix?rowAxis=department&colAxis=graduation_year&metric=avg_package
    API->>Ctrl: Express Router delegates to getOlapMatrix()
    Ctrl->>Svc: getOlapMatrix({ rowAxis, colAxis, metric })
    
    rect rgb(240, 248, 255)
        Note over Svc,DB: Query Generation & Safe Column Resolution
        Svc->>Svc: Validate axes against ALLOWED_AXES whitelist
        Svc->>DB: SELECT d.department, dt.year, AVG(f.annual_package_lpa) ... GROUP BY 1, 2
        DB-->>Svc: Returns 18 aggregated grouped tuples
    end

    rect rgb(255, 250, 240)
        Note over Svc: In-Memory 2D Grid Transformation
        Svc->>Svc: Pivot flat tuples into row/col matrix
        Svc->>Svc: Compute row marginal totals & column marginal totals
        Svc->>Svc: Format heatmap cell colors and density bounds
    end

    Svc-->>Ctrl: Returns structured matrix DTO
    Ctrl-->>API: HTTP 200 OK { success: true, data: { matrix, totals } }
    API-->>UI: Resolves Promise
    UI-->>Analyst: Renders interactive SVG heatmap and drill-down table
```

---

## 4. Runtime Isolation and Port Allocations

The operational Alumni Portal and the DWM Analytics Suite operate on completely distinct network ports and directory roots:

| Component | Repository Path | Dev Server Port | Primary Process Command | Role |
| :--- | :--- | :--- | :--- | :--- |
| **DWM Frontend** | `DWM-project/client` | `5174` | `npm run dev` (Vite) | Analytical dashboard, OLAP cube, data mining UI |
| **DWM Backend** | `DWM-project/server` | `5001` | `npm run dev` (Express) | Analytical REST APIs, ML models, Apriori engine |
| **Analytical DB** | Dedicated PostgreSQL | `54329` | `PGlite / PostgreSQL` | Isolated `dwh` schema hosting 15 tables |
| **Parent Portal Client**| `client/` | `5173` | `npm run dev` (Vite) | Operational Alumni web application |
| **Parent Portal Server**| `server/` | `5000` | `npm run dev` (Express) | Operational user auth, messaging, feeds |

---

## 5. Architectural Diagram Deliverables Reference

The architecture described above is fully specified in the following Mermaid diagram source files in [`diagrams/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/):

1. **[`diagrams/01_system_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/01_system_architecture.mmd)**: End-to-end 3-tier view mapping client components, server middleware, data mining engines, and the isolated `dwh` database.
2. **[`diagrams/02_frontend_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/02_frontend_architecture.mmd)**: Component hierarchy, route views, shared Recharts/Lucide UI elements, and Axios client.
3. **[`diagrams/03_backend_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/03_backend_architecture.mmd)**: Middleware chain, controllers, domain services, repository abstraction, and PostgreSQL pool.
4. **[`diagrams/07_api_request_lifecycle.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/07_api_request_lifecycle.mmd)**: Component traversal from user interaction to SQL execution and DOM rendering.
5. **[`diagrams/08_analytics_sequence.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/08_analytics_sequence.mmd)**: Dual sequence diagram tracing synchronous OLAP matrix aggregation and multi-stage Apriori mining.
6. **[`diagrams/14_runtime_topology.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/14_runtime_topology.mmd)**: Process-level view of independent ports (5174/5001 vs 5173/5000) and schema isolation.




---


<a id="10-data-pipeline-and-lineage-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 10_DATA_PIPELINE_AND_LINEAGE.md -->
<!-- ===================================================================== -->

# 10. Data Ingestion Pipeline, ETL Staging, and Data Lineage

## 1. End-to-End Data Ingestion Architecture

The DWM data ingestion pipeline is implemented in [csvIngestionService.js](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/csvIngestionService.js) and controller [csvIngestionController.js](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/controllers/csvIngestionController.js). It replaces automated operational database replication with an audited, deterministic, and schema-validated batch loading pipeline.

```mermaid
flowchart TD
    subgraph IngestionInput ["1. Ingestion Source"]
        RawCSV["Raw CSV Upload<br/>(Multer 25MB Buffer)"]
        CSVType{"Dataset Classifier<br/>(Filename / Target)"}
    end

    subgraph ValidationEngine ["2. Quality & Validation Filter"]
        HeaderCheck{"Header & Column<br/>Conformance Check"}
        ParseStream["CSV Stream Parser<br/>(csv-parse)"]
        RowVal{"Row-Level Validation<br/>(Types, Nulls, Ranges)"}
        LogErr["Append Error Record<br/>(dwh.etl_batch_errors)"]
    end

    subgraph StagingPipeline ["3. Staging & Execution Gate"]
        DryRun{"Dry-Run Mode<br/>Active?"}
        PreviewPayload["Return Ingestion Preview<br/>(Staged JSON Summary)"]
        BatchLedger["Create Execution Batch<br/>(dwh.etl_batches: 'processing')"]
    end

    subgraph TransformationWarehouse ["4. Transformation & Loading"]
        TxBegin["Begin PostgreSQL Transaction"]
        NaturalKeyResolution["Natural Key to Surrogate Key<br/>Resolution (_sk Lookup)"]
        DimLoad["Load Dimensions<br/>(dim_student, dim_alumni, dim_company, dim_skill)"]
        BridgeLoad["Load Bridges<br/>(bridge_alumni_skill, bridge_job_skill)"]
        FactLoad["Load Facts<br/>(fact_placement, fact_job_application, fact_career_outcomes)"]
        TxCommit["Commit Transaction"]
        UpdateBatch["Update Batch: 'completed'<br/>(rows_inserted, rows_rejected)"]
    end

    RawCSV --> CSVType
    CSVType --> HeaderCheck
    HeaderCheck -- "Missing Columns" --> LogErr
    HeaderCheck -- "Valid Schema" --> ParseStream
    ParseStream --> RowVal
    RowVal -- "Validation Failure" --> LogErr
    RowVal -- "Valid Row" --> DryRun

    DryRun -- "Yes (isDryRun: true)" --> PreviewPayload
    DryRun -- "No (Commit)" --> BatchLedger
    BatchLedger --> TxBegin
    TxBegin --> NaturalKeyResolution
    NaturalKeyResolution --> DimLoad
    DimLoad --> BridgeLoad
    BridgeLoad --> FactLoad
    FactLoad --> TxCommit
    TxCommit --> UpdateBatch
```

---

## 2. Ingestion Execution Flow & Stages

### Stage 1: Upload Reception and Target Classification
- Incoming CSV payloads are received via multipart POST at `/api/analytics/ingest/upload`.
- The target dataset type is resolved (e.g., `'synthetic_skills'`, `'synthetic_alumni'`, `'synthetic_jobs'`, `'synthetic_alumni_skills'`, `'synthetic_job_skills'`, `'synthetic_applications'`, `'synthetic_career_outcomes'`).

### Stage 2: Schema Conformance & Header Verification
- Required CSV headers are verified against defined schema specifications.
- If mandatory columns are missing, the entire batch is rejected before record parsing begins.

### Stage 3: Row-by-Row Quality Validation
- **Numeric & Domain Checks**:
  - `cgpa` must fall strictly within $0.0 \le \text{cgpa} \le 10.0$.
  - `annual_package_lpa` must be non-negative.
  - `employed_within_6_months` must be binary ($0$ or $1$).
- **Mandatory Non-Null Keys**: Records with null identifiers or empty natural keys are rejected.
- **Error Ledgering**: Every rejected record is logged with its exact row number, raw JSON record, and descriptive validation failure reason in `dwh.etl_batch_errors`.

### Stage 4: Dry-Run Staging Gate
- The ingestion service supports a preview flag (`isDryRun: true`).
- In dry-run mode, full row validation and surrogate key lookups execute without committing writes to the warehouse.
- A summary payload returns:
  - Total records evaluated
  - Passed records count
  - Failed records count
  - Sample valid records for UI preview
  - Sample validation errors

### Stage 5: Atomic Transactional Commit
- In live execution mode (`isDryRun: false`), all table inserts run within an atomic PostgreSQL transaction block (`BEGIN ... COMMIT`).
- If any referential constraint fails, the entire transaction rolls back (`ROLLBACK`), guaranteeing the data warehouse remains consistent.
- Surrogate keys (`_sk`) are generated or retrieved via SQL `ON CONFLICT` clauses.
- Upon completion, `dwh.etl_batches` records execution duration, timestamps, and total rows inserted.

---

## 3. CSV Dataset to Warehouse Table Lineage Mapping

Below is the verified lineage tracing raw CSV files to their physical destinations in the `dwh` schema:

| Raw CSV Dataset | Ingestion Parser Rule | Target Warehouse Table(s) | Natural Key $\rightarrow$ Surrogate Key Resolution |
| :--- | :--- | :--- | :--- |
| `skills.csv` | Direct dimension mapping | `dwh.dim_skill` | `skill_id` $\rightarrow$ `skill_sk` (Natural key preserved in `natural_skill_id`) |
| `alumni.csv` | Profile dimension mapping | `dwh.dim_alumni` | `alumni_id` $\rightarrow$ `alumni_sk` (Natural key preserved in `natural_alumni_id`) |
| `jobs.csv` | Requisition dimension mapping | `dwh.dim_job` | `job_id` $\rightarrow$ `job_sk`; `company_name` resolved to `dim_company.company_sk` |
| `alumni_skills.csv` | Bridge association mapping | `dwh.bridge_alumni_skill` | `alumni_id` resolved to `alumni_sk`; `skill_id` resolved to `skill_sk` |
| `job_skills.csv` | Bridge association mapping | `dwh.bridge_job_skill` | `job_id` resolved to `job_sk`; `skill_id` resolved to `skill_sk` |
| `applications.csv` | Fact application mapping | `dwh.fact_job_application`| `application_id` $\rightarrow$ `application_id`; `alumni_id` $\rightarrow$ `alumni_sk`; `job_id` $\rightarrow$ `job_sk` |
| `career_outcomes.csv` | Fact target mapping | `dwh.fact_career_outcomes`| `outcome_id` $\rightarrow$ `outcome_id`; `alumni_id` resolved to `dim_alumni.alumni_sk` |

---

## 4. Ingestion Audit Ledger History

The audit tables `dwh.etl_batches` and `dwh.etl_batch_errors` provide complete operational traceability:

- **Total Execution Batches Logged**: 137 batch runs.
- **Total Ingestion Exceptions Logged**: 46 error records.
- **Audit Logging Query**:
  ```sql
  SELECT b.id, b.file_name, b.status, b.rows_total, b.rows_inserted, b.rows_rejected, b.started_at
  FROM dwh.etl_batches b
  ORDER BY b.started_at DESC
  LIMIT 10;
  ```
- All batch history and error reports are directly accessible in the frontend through the CSV Ingestion & Audit Ledger interface (`/analytics/csv-ingest`).

---

## 5. Lineage and Ingestion Workflow Diagram References

The visual architecture for the ingestion lifecycle and dataset lineages is specified in:
- **ETL Staging and Processing Pipeline**: [`diagrams/06_etl_data_lineage.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/06_etl_data_lineage.mmd) details the 5-stage ingestion lifecycle, row validation filters, dry-run gate, and atomic transaction commit.
- **Dataset Relationships and Warehouse Mapping**: [`diagrams/05_dataset_relationships.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/05_dataset_relationships.mmd) illustrates the 7 physical CSV files, primary/foreign join keys, and their mapping into warehouse dimension, bridge, and fact tables.




---


<a id="11-api-and-service-reference-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 11_API_AND_SERVICE_REFERENCE.md -->
<!-- ===================================================================== -->

# 11. Complete API and Service Reference

## 1. Overview of the Analytical REST Interface

The DWM analytical backend exposes **25 dedicated endpoints** partitioned across two primary route trees:
- `/api/analytics/*`: Core OLAP aggregations, institutional KPIs, warehouse architecture introspection, and CSV ETL ledgering.
- `/api/analytics/datamining/*` (aliased as `/api/analytics/mining/*`): Unsupervised clustering (K-Means), frequent pattern mining (Apriori), and supervised classification (Logistic Regression).

All endpoints return standardized JSON response envelopes:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional contextual message",
  "meta": { "timestamp": "2026-10-25T18:44:02.000Z" }
}
```

---

## 2. Core Analytics & Warehouse Introspection APIs (`/api/analytics`)

### 2.1 Institutional Overview & KPIs
- **Endpoint**: `GET /api/analytics/overview`
- **Controller & Service**: [analyticsController.js:getOverview](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/controllers/analyticsController.js) $\rightarrow$ `analyticsService.js`
- **Query Parameters**:
  - `recordSource` (Optional string): Filter metrics by origin (`'operational'`, `'indian_academic_benchmark'`).
- **Response Payload**: High-level institutional metrics: total student count, placed count, placement rate percentage, average CTC package, total alumni profiles, active job openings, and department-wise placement distributions.

### 2.2 Placements and Compensation Analysis
- **Endpoint**: `GET /api/analytics/career` (Alias: `GET /api/analytics/placements`)
- **Query Parameters**:
  - `department` (Optional string): Target academic branch.
  - `year` (Optional string/int): Cohort graduation year.
  - `minSalary` (Optional numeric regex): Filter packages $\ge \text{minSalary}$.
  - `company` (Optional string): Target corporate employer.
  - `recordSource` (Optional string): Data provenance partition.
- **Response Payload**: Salary package histograms, percentile rankings (25th, median, 75th, 90th), top hiring companies, and historical placement trends.

### 2.3 Skills Intelligence & Gap Analytics
- **Endpoint**: `GET /api/analytics/skills`
- **Query Parameters**:
  - `category` (Optional string): Filter skills by taxonomy (`'Cloud & DevOps'`, `'Programming Languages'`).
  - `limit` (Optional int, default 20): Number of ranking skills to return.
- **Response Payload**: Dual-faceted skill demand vs supply metrics: top student/alumni proficiencies vs employer job requisition requirements, calculating real-time institutional skill surplus and deficits.

### 2.4 Alumni Demographics & Career Trajectories
- **Endpoint**: `GET /api/analytics/alumni`
- **Query Parameters**:
  - `city` (Optional string): Geographic location filter.
  - `industry` (Optional string): Corporate domain (`'Information Technology'`, `'Financial Services'`).
  - `mentorOnly` (Optional boolean): Filter alumni willing to mentor students.
  - `recordSource` (Optional string): Provenance filter.
- **Response Payload**: Geographic distribution map data, industry breakdown, mentorship density, and seniority progression distributions.

### 2.5 OLAP Multidimensional Cube Engine
- **Endpoint**: `GET /api/analytics/olap`
- **Query Parameters**:
  - `primaryDimension` (Enum: `'department'`, `'tier'`, `'company'`, `'year'`, `'industry'`, `'degree'`, `'source'`).
  - `secondaryDimension` (Enum: `'department'`, `'tier'`, `'company'`, `'year'`, `'industry'`, `'degree'`, `'source'`, `'none'`).
  - `measure` (Enum: `'avgLpa'`, `'medianLpa'`, `'placedCount'`, `'totalOffers'`, `'maxLpa'`, `'minLpa'`, `'placementRate'`).
  - `sliceDept`, `sliceTier`, `sliceCompany`, `sliceYear`, `sliceIndustry`, `sliceSource` (Optional filter strings).
  - `minLpa` (Optional numeric threshold).
  - `drillDownKey` (Optional string): Expand specific dimension group into sub-levels.
  - `rollup` (Optional boolean string): Roll up granular dimension hierarchy to higher-level aggregation.
- **Response Payload**: Aggregated multidimensional cube data points, 2D matrix cross-tabulations, and marginal totals.

### 2.6 Warehouse Architecture & Metadata Introspection
- **Summary**: `GET /api/analytics/warehouse/summary` $\rightarrow$ Total table count (15), total row count (56,732), schema sizes, and last vacuum timestamps.
- **Schema Catalog**: `GET /api/analytics/warehouse/schema` $\rightarrow$ Complete array of 15 tables with column metadata, types, primary keys, and foreign key definitions.
- **Table Detail**: `GET /api/analytics/warehouse/table/:tableName` $\rightarrow$ Specific table schema, sample 50 records, active indexes, and nullability stats.
- **Quality Audit**: `GET /api/analytics/warehouse/quality` $\rightarrow$ Automated test report running 38 integrity checks across nulls, domain boundaries, and orphaned foreign keys.
- **Datasets Directory**: `GET /api/analytics/warehouse/datasets` $\rightarrow$ Manifest of physical CSV datasets on disk with byte sizes and row counts.
- **Audit Ledger**: `GET /api/analytics/warehouse/audit` $\rightarrow$ Comprehensive execution log of all historical batch ingestions.

---

## 3. Data Ingestion & ETL APIs (`/api/analytics/etl`)

- **History Ledger**: `GET /api/analytics/etl/history` $\rightarrow$ Paginated list of batch ingestion records from `dwh.etl_batches`.
- **Batch Error Logs**: `GET /api/analytics/etl/history/:batchId/errors` $\rightarrow$ Row-level validation rejection details from `dwh.etl_batch_errors`.
- **Upload & Stage CSV**: `POST /api/analytics/etl/upload`
  - **Auth**: Protected via `requireAuth`.
  - **Body**: Multipart form data with `file` (CSV stream) and `isDryRun` (`true` or `false`).
  - **Function**: Executes Stage 1–4 validation, generates batch UUID, and stages valid records.
- **Confirm Batch Import**: `POST /api/analytics/etl/confirm-import`
  - **Auth**: Protected via `requireAuth`.
  - **Body**: `{ "batchId": "<UUID>" }`.
  - **Function**: Atomically writes staged records from `etl_batches.staged_data` to warehouse fact and dimension tables.
- **Rollback Batch Import**: `POST /api/analytics/etl/rollback-import`
  - **Auth**: Protected via `requireAuth`.
  - **Body**: `{ "batchId": "<UUID>" }`.
  - **Function**: Cancels a pending staged batch without modifying warehouse state.

---

## 4. Data Mining & Machine Learning APIs (`/api/analytics/datamining`)

### 4.1 Data Mining Overview Cockpit
- **Endpoint**: `GET /api/analytics/datamining/summary`
- **Response Payload**: Summary cards for all three mining algorithms: active clustering runs, Apriori frequent itemsets and rules count, classification accuracy, ROC-AUC, and feature importance rankings.

### 4.2 K-Means Clustering Engine
- **Endpoint**: `GET /api/analytics/datamining/clustering`
- **Query Parameters**:
  - `k` (Optional int, default 3, range 2–8): Number of clusters.
  - `features` (Optional array/string): Selection of dimensions (`'cgpa'`, `'internships_count'`, `'backlogs_count'`, `'aptitude_score'`, `'technical_test_score'`, `'experience_years'`).
- **Response Payload**: Cluster centroids, assigned student/alumni records, cluster distribution sizes, PCA 2D coordinates for scatter visualization, and human-readable cluster persona interpretations.
- **Evaluation Endpoint**: `GET /api/analytics/datamining/clustering/evaluation`
  - **Response Payload**: Multi-run evaluation across $K \in [2, 8]$ computing WCSS (Within-Cluster Sum of Squares / Inertia) and Silhouette Scores, identifying the optimal mathematical elbow.

### 4.3 Apriori Association Rule Mining
- **Endpoint**: `GET /api/analytics/datamining/association-rules`
- **Query Parameters**:
  - `mode` (Enum: `'mode_a'`, `'mode_b'`). Mode A evaluates Alumni Skill profiles; Mode B evaluates Job Requisition Skill demands.
  - `minSupport` (Float, default 0.05 / 5%): Minimum support threshold.
  - `minConfidence` (Float, default 0.50 / 50%): Minimum confidence threshold.
  - `minLift` (Float, default 1.1x): Minimum lift threshold.
  - `source` (Optional string): Data provenance filter (`'all'`, `'operational'`, `'indian_academic_benchmark'`).
- **Response Payload**: Total transaction baskets processed, frequent $k$-itemsets ($k=1, 2, 3$), discovered association rules ($A \Rightarrow B$) with verified support, confidence, and lift values.

### 4.4 Supervised Classification (Career Outcomes)
- **Metadata**: `GET /api/analytics/datamining/classification/metadata`
  - **Response Payload**: Feature dictionary, target variable definition (`employed_within_6_months`), total training instances (2,002 rows), class imbalance ratio (69.8% positive : 30.2% negative).
- **Train Model**: `POST /api/analytics/datamining/classification/train`
  - **Body**: `{ "trainTestSplit": 0.80, "regularization": 0.01, "features": ["cgpa", "internships_count", "backlogs_count", "readiness_score"] }`
  - **Response Payload**: Model coefficients, train/test accuracy, precision, recall, F1-score, $2 \times 2$ Confusion Matrix, ROC-AUC curve coordinates.
- **Predict Single Instance**: `POST /api/analytics/datamining/classification/predict`
  - **Body**: `{ "cgpa": 8.4, "internships_count": 2, "backlogs_count": 0, "technical_test_score": 82, "interview_score": 78 }`
  - **Response Payload**: Predicted probability $P(\text{Employed}) \in [0.0, 1.0]$, predicted binary label ($0$ or $1$), and feature contribution breakdown.



---


<a id="12-analytics-and-olap-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 12_ANALYTICS_AND_OLAP.md -->
<!-- ===================================================================== -->

# 12. OLAP Multidimensional Engine and Visual Analytics

## 1. OLAP Dimensional Architecture

The DWM analytical platform incorporates a multidimensional Online Analytical Processing (OLAP) engine implemented in [warehouseRepository.js:getOlapData](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseRepository.js#L503-L600) and rendered in frontend component [AnalyticsOLAP.jsx](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/client/src/pages/analytics/AnalyticsOLAP.jsx).

The engine supports all five canonical OLAP operations across educational and placement facts:
1. **Roll-Up**: Aggregation from lower-level grains to higher-level summary hierarchies.
2. **Drill-Down**: Navigation from summary metrics to granular detail.
3. **Slice**: Equality filtering fixing one or more dimensions to specific constant values.
4. **Dice**: Multidimensional bounding box filtering (e.g., salary thresholds combined with academic cohorts).
5. **Pivot / Cross-Tabulation**: Dynamic 2D matrix transformation projecting two arbitrary dimensions across row and column axes with automated marginal totals.

```mermaid
graph TD
    subgraph Dimensions ["Analytical Dimension Hierarchies"]
        D_Dept["Academic Department<br/>(s.department)"]
        D_Tier["Company Hiring Tier<br/>(c.company_tier)"]
        D_Comp["Hiring Company<br/>(c.company_name)"]
        D_Year["Graduation / Offer Year<br/>(d.year, s.graduation_year)"]
        D_Ind["Industry Sector<br/>(c.industry)"]
        D_Deg["Degree Program<br/>(s.degree)"]
        D_Src["Data Provenance<br/>(p.record_source)"]
    end

    subgraph Operations ["OLAP Multidimensional Operations"]
        Op_Slice["Slice: Equality Filters<br/>(Dept='Computer Eng', Year=2024)"]
        Op_Dice["Dice: Multi-Axis Range Bounds<br/>(minLpa >= 8.0, Tier='Tier 1')"]
        Op_Rollup["Roll-Up: Institutional Summary<br/>(Global Avg LPA, Total Placed)"]
        Op_Drill["Drill-Down: Sub-Dimension Expansion<br/>(Dept -> Company Breakdown)"]
        Op_Pivot["Pivot: 2D Heatmap Matrix<br/>(Rows: Dept x Cols: Tier)"]
    end

    subgraph FactGrain ["Fact Placement Engine (dwh.fact_placement)"]
        M_Avg["AVG(annual_package_lpa)"]
        M_Med["PERCENTILE_CONT(0.5) (Median LPA)"]
        M_Offers["COUNT(placement_id) (Total Offers)"]
        M_Students["COUNT(DISTINCT student_sk) (Placed)"]
        M_Range["MIN / MAX(annual_package_lpa)"]
    end

    Dimensions --> Operations
    Operations --> FactGrain
```

---

## 2. Mathematical Definition of Aggregations & Measures

The OLAP engine queries `dwh.fact_placement` joined with `dim_student`, `dim_company`, and `dim_date`. All measures are strictly defined without heuristic inflation:

### 2.1 Additive Measures
- **Total Placement Offers**:
  $$\text{Total Offers} = \sum_{i \in \text{Partition}} 1 = \text{COUNT}(p.\text{placement\_id})$$
- **Placed Unique Students**:
  $$\text{Placed Students} = \text{COUNT}(\text{DISTINCT } p.\text{student\_sk})$$
- **Eligible Candidates**:
  $$\text{Eligible Students} = \text{COUNT}(\text{DISTINCT } s.\text{student\_sk})$$

### 2.2 Semi-Additive & Statistical Measures
- **Mean Annual Compensation (LPA)**:
  $$\text{Avg LPA} = \frac{1}{N} \sum_{i=1}^{N} p.\text{annual\_package\_lpa}_i$$
- **True Median Compensation (50th Percentile)**:
  $$\text{Median LPA} = \text{PERCENTILE\_CONT}(0.5) \text{ WITHIN GROUP } (\text{ORDER BY } p.\text{annual\_package\_lpa})$$
  *Note*: Many analytical systems approximate the median using average metrics; the DWM warehouse computes the exact continuous 50th percentile in PostgreSQL.
- **Compensation Range Bounds**:
  $$\text{Max LPA} = \max_{i} (p.\text{annual\_package\_lpa}_i), \quad \text{Min LPA} = \min_{i} (p.\text{annual\_package\_lpa}_i)$$

---

## 3. Operational Mechanics of OLAP Operations

### 3.1 Slicing (Equality Dimension Constraints)
Slicing isolates a hyperplane through the multidimensional cube by fixing dimension values. The service maps slice parameters into SQL prepared statements:
- **Department Slice**: `s.department = $1`
- **Corporate Tier Slice**: `c.company_tier = $2`
- **Hiring Company Slice**: `c.company_name ILIKE $3`
- **Graduation Year Slice**: `COALESCE(d.year, s.graduation_year) = $4`
- **Industry Slice**: `c.industry = $5`
- **Data Provenance Slice**: `p.record_source = $6`

### 3.2 Dicing (Multidimensional Bounding Boxes)
Dicing restricts the analysis to a sub-cube defined by multiple constraints across dimensions and measure bounds:
- **Salary Threshold**: `p.annual_package_lpa >= $minLpa`
- When combined with department or cohort filters, dicing isolates high-package placement segments (e.g., packages $\ge 12.0\text{ LPA}$ in Computer Engineering for 2024 graduates).

### 3.3 Roll-Up (Institutional Summarization)
In parallel with grouped dimension aggregation, the backend executes an institutional roll-up query applying the identical slice and dice constraints over the entire cube:
```sql
SELECT 
  COUNT(p.placement_id)::int as total_offers,
  COUNT(DISTINCT p.student_sk)::int as total_placed,
  ROUND(COALESCE(AVG(p.annual_package_lpa), 0), 2) as overall_avg_lpa,
  ROUND(COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY p.annual_package_lpa), 0)::numeric, 2) as overall_median_lpa,
  ROUND(COALESCE(MAX(p.annual_package_lpa), 0), 2) as overall_max_lpa,
  ROUND(COALESCE(MIN(p.annual_package_lpa), 0), 2) as overall_min_lpa
FROM dwh.fact_placement p
JOIN dwh.dim_student s ON s.student_sk = p.student_sk
JOIN dwh.dim_company c ON c.company_sk = p.company_sk
LEFT JOIN dwh.dim_date d ON d.date_sk = p.offer_date_sk
${whereClause};
```

### 3.4 Drill-Down (Hierarchical Exploration)
When an analyst selects a dimension partition (e.g., clicking on `department = 'Information Technology'`), passing `drillDownKey` expands the aggregated record into constituent company offers and individual role breakdowns.

### 3.5 2D Matrix Pivoting (Cross-Tabulation)
When a secondary dimension is specified (e.g., Row Axis = `department`, Column Axis = `company_tier`):
1. The SQL engine executes a two-dimensional `GROUP BY primaryCol, secondaryCol`.
2. The service transforms flat database tuples into a 2D matrix structure.
3. For each cell $(r, c)$, the selected measure (e.g., `avg_lpa` or `placed_count`) is populated.
4. Row marginal totals ($\sum_c M_{r,c}$) and column marginal totals ($\sum_r M_{r,c}$) are calculated automatically.
5. In the UI, cells render with relative opacity heatmaps proportional to value density.

---

## 4. Dimension Whitelist and SQL Injection Immunity

To prevent SQL injection while allowing dynamic multidimensional projection, [warehouseRepository.js](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseRepository.js#L516-L525) uses an immutable dimension map:

```javascript
const allowedDimensions = {
  department: 's.department',
  tier: 'c.company_tier',
  company: 'c.company_name',
  year: 'COALESCE(d.year, s.graduation_year)',
  industry: 'c.industry',
  degree: 's.degree',
  source: 'p.record_source',
}
```

Any parameter not matching this whitelist defaults to `s.department`. Column identifiers are never interpolated directly from raw HTTP request inputs.

---

## 5. OLAP Workflow & Sequence Diagram References

The complete architectural flow and synchronous execution sequence of the OLAP engine are specified in:
- **OLAP Cube Engine & Workflow**: [`diagrams/09_olap_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/09_olap_workflow.mmd) details dimension input, slice/dice/rollup/drill/pivot engines, SQL prepared statements, exact continuous median calculation, and in-memory matrix projection.
- **OLAP Request Sequence Lifecycle**: [`diagrams/08_analytics_sequence.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/08_analytics_sequence.mmd#L16-L37) (Workflow A) traces the synchronous sequence from UI filter selection through controller routing, SQL aggregation, matrix marginal totaling, and SVG heatmap DOM rendering.




---


<a id="13-association-rule-mining-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 13_ASSOCIATION_RULE_MINING.md -->
<!-- ===================================================================== -->

# 13. Association Rule Mining Methodology and the Apriori Algorithm

## 1. Algorithmic Foundation & Objective

Association rule mining discovers latent co-occurrence patterns, co-requisite skill clusters, and career pathways in the data warehouse. Implemented in [associationRulesService.js](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/associationRulesService.js), the module uses the **Apriori Algorithm** (Agrawal & Srikant, 1994) to extract frequent itemsets and derive actionable association rules ($X \Rightarrow Y$).

In institutional analytics, association mining answers critical curricular questions:
- *Which technical competencies are co-acquired by alumni in high-tier corporate positions?*
- *Which skill bundles are co-demanded by enterprise job requisitions?*
- *When a student masters Skill A and Skill B, what is the probability and lift of requiring Skill C?*

```mermaid
graph TD
    subgraph Transactions ["1. Transaction Basket Construction"]
        BasketsA["Mode A: Alumni Skills<br/>(Basket = All skills mastered by Alumnus i)"]
        BasketsB["Mode B: Job Skills<br/>(Basket = All skills demanded by Requisition j)"]
    end

    subgraph FrequentItemsets ["2. Apriori Frequent Itemset Generation"]
        L1["L1: Frequent 1-Itemsets<br/>(Count >= minSupportCount)"]
        JoinStep["Candidate Generation C_k<br/>(Join L_{k-1} with L_{k-1})"]
        PruneStep["Apriori Pruning<br/>(Verify all k-1 subsets in L_{k-1})"]
        Lk["L_k: Frequent k-Itemsets<br/>(k = 2, 3)"]
    end

    subgraph RuleDerivation ["3. Rule Derivation & Evaluation"]
        SubsetGen["Bitmask Subset Partitioning<br/>(Antecedent X vs Consequent Y)"]
        MetricsCalc["Metric Computation<br/>Support, Confidence, Lift"]
        FilterGate{"Threshold Gate<br/>Confidence >= minConf<br/>Lift >= minLift"}
        RankedRules["Ranked Association Rules<br/>(Sorted by Lift desc)"]
    end

    Transactions --> L1
    L1 --> JoinStep
    JoinStep --> PruneStep
    PruneStep --> Lk
    Lk --> SubsetGen
    SubsetGen --> MetricsCalc
    MetricsCalc --> FilterGate
    FilterGate --> RankedRules
```

---

## 2. Mathematical Formulations and Metrics

Let $I = \{i_1, i_2, \dots, i_m\}$ be the universe of unique skills ($|I| = 150$), and $D = \{t_1, t_2, \dots, t_N\}$ be the transaction database of size $N$. An itemset $X \subseteq I$ has support count $\sigma(X) = |\{t \in D \mid X \subseteq t\}|$.

### 2.1 Support
The relative frequency of an itemset $X$ or rule $X \Rightarrow Y$ across the entire transaction database:
$$\text{Support}(X) = \frac{\sigma(X)}{N}$$
$$\text{Support}(X \Rightarrow Y) = \text{Support}(X \cup Y) = \frac{\sigma(X \cup Y)}{N}$$

### 2.2 Confidence
The conditional probability that a transaction contains consequent $Y$ given that it contains antecedent $X$:
$$\text{Confidence}(X \Rightarrow Y) = P(Y \mid X) = \frac{\text{Support}(X \cup Y)}{\text{Support}(X)} = \frac{\sigma(X \cup Y)}{\sigma(X)}$$
- Measures rule reliability. A confidence of $0.75$ indicates that 75% of alumni possessing skill set $X$ also possess skill set $Y$.

### 2.3 Lift
The ratio of observed joint support to expected support under statistical independence:
$$\text{Lift}(X \Rightarrow Y) = \frac{\text{Confidence}(X \Rightarrow Y)}{\text{Support}(Y)} = \frac{\text{Support}(X \cup Y)}{\text{Support}(X) \times \text{Support}(Y)}$$
- $\text{Lift} = 1.0$: $X$ and $Y$ appear together purely by random chance.
- $\text{Lift} > 1.0$: Positive correlation. The presence of antecedent $X$ significantly increases the likelihood of consequent $Y$.
- $\text{Lift} < 1.0$: Negative correlation / substitution effect.

---

## 3. Implementation Details

### 3.1 Candidate Generation & The Apriori Property
The Apriori principle states: *All non-empty subsets of a frequent itemset must also be frequent.*
In `generateCandidateItemsets(frequentKeys, k)`:
1. **Join Condition**: Two itemsets $A, B \in L_{k-1}$ are merged into candidate $C_k = A \cup B$ only if their first $k-2$ sorted items are identical:
   $$A[0 \dots k-3] == B[0 \dots k-3]$$
2. **Apriori Pruning**: Before scanning transactions, the algorithm verifies that all $k$ subsets of size $k-1$ within candidate $C_k$ exist in $L_{k-1}$. Any candidate violating this condition is pruned in $O(k)$ time.

### 3.2 Proper Non-Empty Subset Generation
Rule derivation decomposes each frequent itemset $S \in L_k$ ($k \ge 2$) into disjoint antecedent $X$ and consequent $Y$ ($X \cup Y = S, X \cap Y = \emptyset, X \neq \emptyset, Y \neq \emptyset$).
This is implemented via bitmasking:
```javascript
const totalCombinations = 1 << items.length
for (let mask = 1; mask < totalCombinations - 1; mask++) {
  // Extract items where bit is 1 into antecedent, bit 0 into consequent
}
```

---

## 4. Operational Modes: Mode A vs Mode B

The DWM platform implements two transaction extraction modes:

| Dimension | Mode A: Alumni Professional Competencies | Mode B: Enterprise Job Requisition Demands |
| :--- | :--- | :--- |
| **Transaction Entity** | Individual Alumnus (`alumni_sk`) | Job Requisition Posting (`job_sk`) |
| **Warehouse Source** | `dwh.bridge_alumni_skill` JOIN `dim_skill` | `dwh.bridge_job_skill` JOIN `dim_skill` |
| **Transaction Count** | $N = 2,000$ alumni profiles | $N = 5,000$ corporate job postings |
| **Average Basket Size**| ~10.0 skills / alumnus | ~3.0 skills / job posting |
| **Default Thresholds** | $\text{minSupport} = 5\%$, $\text{minConfidence} = 50\%$, $\text{minLift} = 1.1\times$ | $\text{minSupport} = 3\%$, $\text{minConfidence} = 40\%$, $\text{minLift} = 1.1\times$ |
| **Typical Finding** | Core full-stack and cloud bundles (e.g., Docker + Kubernetes $\Rightarrow$ AWS) | Targeted requirement pairs (e.g., React + TypeScript $\Rightarrow$ Node.js) |

---

## 5. Illustrative Worked Example

Consider a toy database of $N = 5$ alumni profiles:
- $T_1 = \{\text{Python, SQL, Docker}\}$
- $T_2 = \{\text{Python, SQL}\}$
- $T_3 = \{\text{Python, Docker, AWS}\}$
- $T_4 = \{\text{SQL, Java}\}$
- $T_5 = \{\text{Python, SQL, Docker, AWS}\}$

Let $\text{minSupport} = 0.40$ ($\text{count} \ge 2$) and $\text{minConfidence} = 0.60$:
1. **$L_1$ Support Counts**:
   - $\text{Python}: 4/5 = 0.80$
   - $\text{SQL}: 4/5 = 0.80$
   - $\text{Docker}: 3/5 = 0.60$
   - $\text{AWS}: 2/5 = 0.40$
   - $\text{Java}: 1/5 = 0.20$ (Pruned)
2. **$L_2$ Frequent 2-Itemsets**:
   - $\{\text{Python, SQL}\}: 3/5 = 0.60$
   - $\{\text{Python, Docker}\}: 3/5 = 0.60$
   - $\{\text{Python, AWS}\}: 2/5 = 0.40$
   - $\{\text{SQL, Docker}\}: 2/5 = 0.40$
   - $\{\text{Docker, AWS}\}: 2/5 = 0.40$
3. **Derived Association Rule**: $\{\text{Docker}\} \Rightarrow \{\text{Python}\}$
   - $\text{Support}(\{\text{Docker, Python}\}) = 0.60$
   - $\text{Confidence} = \frac{0.60}{\text{Support}(\text{Docker})} = \frac{0.60}{0.60} = 1.00$ ($100\%$)
   - $\text{Lift} = \frac{1.00}{\text{Support}(\text{Python})} = \frac{1.00}{0.80} = 1.25\times$
   - *Interpretation*: Every alumnus with Docker also possesses Python, representing a 25% lift above baseline Python occurrence.

---

## 6. Apriori Workflow Diagram References

The complete architectural flow and algorithmic execution sequence for the Apriori association engine are specified in:
- **Apriori Algorithm Workflow**: [`diagrams/10_apriori_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/10_apriori_workflow.mmd) details Mode A vs Mode B transaction extraction, candidate generation ($C_k$), subset pruning, support counting, bitmask rule derivation, and threshold filtering.
- **Apriori Mining Sequence**: [`diagrams/08_analytics_sequence.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/08_analytics_sequence.mmd#L39-L64) (Workflow B) traces the end-to-end execution sequence from the `/analytics/mining` interface to database basket extraction and ranked rule delivery.




---


<a id="14-classification-methodology-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 14_CLASSIFICATION_METHODOLOGY.md -->
<!-- ===================================================================== -->

# 14. Supervised Classification Methodology and Career Outcomes Prediction

## 1. Problem Formulation & Institutional Motivation

Predicting educational and career outcomes is a core institutional research priority. Accreditation agencies (e.g., NAAC, NIRF) evaluate higher education institutions on graduate employability within 6 months of program completion.

Implemented in [classificationService.js](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/classificationService.js), the supervised classification engine predicts the binary target variable:
$$Y = \text{employed\_within\_6\_months} \in \{0, 1\}$$
from longitudinal alumni features, competency vectors, and academic indicators stored in `dwh.fact_career_outcomes` and conformed dimension `dwh.dim_alumni`.

```mermaid
graph TD
    subgraph InputData ["1. Data Warehouse Extraction"]
        Outcomes["fact_career_outcomes<br/>(Target Y: 2,002 records)"]
        Alumni["dim_alumni & bridge_alumni_skill<br/>(Skills, Experience, Dept)"]
    end

    subgraph PreprocessingPipeline ["2. Leakage-Safe Stratified Pipeline"]
        StratSplit["Stratified Train/Test Split<br/>(80% Train: 1,601 / 20% Test: 401)"]
        FitTrain["Fit Preprocessor on Train Only<br/>(Top 30 Skills, Min-Max Bounds)"]
        TransformTest["Transform Test Set using Train Parameters"]
    end

    subgraph ModelTraining ["3. Regularized Model Optimization"]
        LogReg["Logistic Regression Engine<br/>z = w^T x + b"]
        SigmoidAct["Sigmoid Activation<br/>p = 1 / (1 + e^-z)"]
        ClassWeights["Balanced Class Weighting<br/>(w_0 = N/2N_0, w_1 = N/2N_1)"]
        L2Reg["Batch Gradient Descent + L2 Regularization<br/>(learningRate=0.2, l2Penalty=0.002)"]
    end

    subgraph EvaluationSuite ["4. Model Evaluation & Inference"]
        ConfMatrix["2x2 Confusion Matrix<br/>[TP, FP, FN, TN]"]
        Metrics["Metrics Suite<br/>Accuracy, Precision, Recall, F1, ROC-AUC"]
        PredictAPI["Interactive Inference API<br/>(/classification/predict)"]
    end

    InputData --> StratSplit
    StratSplit --> FitTrain
    FitTrain --> TransformTest
    TransformTest --> LogReg
    LogReg --> SigmoidAct
    SigmoidAct --> ClassWeights
    ClassWeights --> L2Reg
    L2Reg --> ConfMatrix
    ConfMatrix --> Metrics
    L2Reg --> PredictAPI
```

---

## 2. Mathematical Foundation of the Classifier

### 2.1 Logistic Regression Model
For a feature vector $\mathbf{x} \in \mathbb{R}^d$, the linear combination is given by:
$$z = b + \sum_{j=1}^d w_j x_j = \mathbf{w}^T \mathbf{x} + b$$
The posterior probability of positive employment is parameterized by the standard logistic (sigmoid) function:
$$P(Y = 1 \mid \mathbf{x}) = \sigma(z) = \frac{1}{1 + e^{-z}}$$
To protect against numerical overflow, the sigmoid implementation clips extreme values:
$$\sigma(z) = \begin{cases} 1.0 & \text{if } z \ge 40 \\ 0.0 & \text{if } z \le -40 \\ \frac{1}{1 + e^{-z}} & \text{otherwise} \end{cases}$$

### 2.2 Balanced Class Weighting & Loss Function
The dataset exhibits an empirical class imbalance ($69.8\%$ positive vs $30.2\%$ negative). To prevent the optimization from degenerating into a majority-class classifier, balanced class weights are introduced:
$$w_0 = \frac{N}{2 \cdot N_0}, \quad w_1 = \frac{N}{2 \cdot N_1}$$
The weighted negative log-likelihood loss with $L_2$ regularization is defined as:
$$J(\mathbf{w}, b) = -\frac{1}{N} \sum_{i=1}^N \Big[ w_{y_i} \cdot \big( y_i \ln \hat{y}_i + (1 - y_i) \ln (1 - \hat{y}_i) \big) \Big] + \frac{\lambda}{2} \|\mathbf{w}\|_2^2$$
where $\hat{y}_i = \sigma(\mathbf{w}^T \mathbf{x}_i + b)$ and $\lambda$ is the $L_2$ penalty parameter (`l2Penalty = 0.002`).

### 2.3 Batch Gradient Descent Updates
At each training epoch ($T = 350$), the weights and bias update via:
$$\mathbf{w} \leftarrow \mathbf{w} - \eta \left( \frac{1}{N} \sum_{i=1}^N e_i \mathbf{x}_i + \lambda \mathbf{w} \right)$$
$$b \leftarrow b - \eta \left( \frac{1}{N} \sum_{i=1}^N e_i \right)$$
where $e_i = (\hat{y}_i - y_i) \cdot w_{y_i}$ is the weighted prediction error and $\eta = 0.2$ is the learning rate.

---

## 3. Data Preprocessing & Data-Leakage Immunity

A common pitfall in academic machine learning pipelines is **data leakage**, where global dataset statistics (such as mean, min, max, or frequent vocabulary) are calculated over the entire dataset before splitting.

The DWM classification pipeline enforces strict data leakage isolation in [classificationService.js:fitPreprocessor](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/classificationService.js#L29-L87):
1. **Stratified Partitioning**: The dataset is split into **80% Training ($n = 1,601$)** and **20% Test ($n = 401$)** using `stratifiedTrainTestSplit`, ensuring identical positive/negative ratios across partitions.
2. **Training-Only Feature Selection**: The top 30 most frequent skills are extracted strictly from the 1,601 training instances. Skills appearing only in the test set are not used to build vocabulary.
3. **Training-Only Scaling**: Min-max normalization bounds for experience ($\text{minExp}, \text{maxExp}$) are computed solely from the training partition:
   $$x_{\text{norm\_exp}} = \frac{x_{\text{raw\_exp}} - \text{minExp}_{\text{train}}}{\text{maxExp}_{\text{train}} - \text{minExp}_{\text{train}}}$$
4. **Final Feature Vector Dimension ($d = 32$)**:
   $$\mathbf{x} = [\underbrace{s_1, s_2, \dots, s_{30}}_{\text{Binary Skill Indicators } (0 \text{ or } 1)}, \underbrace{\text{norm\_experience}}_{\text{Continuous } [0, 1]}, \underbrace{\text{norm\_skill\_count}}_{\text{Continuous } [0, 1]}]$$

---

## 4. Evaluation Suite and Metrics

Evaluation runs on the held-out 20% test partition ($n = 401$ instances).

### 4.1 Confusion Matrix Layout
$$\begin{array}{c|cc}
 & \text{Predicted Negative } (\hat{Y}=0) & \text{Predicted Positive } (\hat{Y}=1) \\
\hline
\text{Actual Negative } (Y=0) & \text{True Negative (TN)} & \text{False Positive (FP)} \\
\text{Actual Positive } (Y=1) & \text{False Negative (FN)} & \text{True Positive (TP)} \\
\end{array}$$

### 4.2 Comprehensive Metric Formulations
- **Accuracy**: $\frac{\text{TP} + \text{TN}}{\text{TP} + \text{TN} + \text{FP} + \text{FN}}$
- **Precision (Positive Predictive Value)**: $\frac{\text{TP}}{\text{TP} + \text{FP}}$
- **Recall (Sensitivity)**: $\frac{\text{TP}}{\text{TP} + \text{FN}}$
- **Specificity (True Negative Rate)**: $\frac{\text{TN}}{\text{TN} + \text{FP}}$
- **Balanced Accuracy**: $\frac{\text{Recall} + \text{Specificity}}{2}$
- **$F_1$-Score**: $2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$
- **ROC-AUC (Area Under the Receiver Operating Characteristic)**: Computed across continuous decision thresholds $\theta \in [0.0, 1.0]$.

---

## 5. Supervised Classification Workflow Diagram Reference

The end-to-end machine learning pipeline, data-leakage prevention shield, and mathematical optimization steps are visually modeled in:
- **Classification Pipeline & Leakage Prevention**: [`diagrams/11_classification_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/11_classification_workflow.mmd) details the stratified 80/20 train/test split, frozen preprocessor scaling, batch gradient descent with balanced weights, confusion matrix evaluation, and interactive single-record inference.




---


<a id="15-clustering-methodology-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 15_CLUSTERING_METHODOLOGY.md -->
<!-- ===================================================================== -->

# 15. Unsupervised Clustering Methodology and Profile Segmentation

## 1. Algorithmic Objectives & Educational Context

Unsupervised clustering segments alumni and students into natural behavioural and competency cohorts without requiring ground-truth labels. Implemented in [clusteringService.js](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/clusteringService.js), the clustering engine uses **K-Means with K-Means++ initialization** and a deterministic seeded pseudo-random number generator.

In higher-education intelligence, clustering addresses institutional questions:
- *What distinct graduate archetypes emerge from longitudinal career trajectories?*
- *Can we segment students by academic performance and test readiness to target placement coaching?*
- *How are skill proficiencies clustered into multi-disciplinary talent pools?*

```mermaid
graph TD
    subgraph DataPrep ["1. Feature Space & Matrix Construction"]
        Source["Warehouse Alumni Extraction<br/>(2,000 alumni / bridge_alumni_skill)"]
        FeatEng["Feature Engineering & Scaling<br/>(Min-Max Normalization: [0.0, 1.0])"]
        FeatVec["Feature Vector x_i in R^d<br/>(Exp, Skills Count, Domain Indicators)"]
    end

    subgraph KMeansEngine ["2. Deterministic K-Means++ Engine"]
        PRNG["Mulberry32 Deterministic PRNG<br/>(Seed = 2026)"]
        InitKM["K-Means++ Centroid Seeding<br/>P(x) proportional to D(x)^2"]
        IterLoop["Expectation-Maximization Loop<br/>1. Nearest Centroid Assignment<br/>2. Mean Centroid Recomputation"]
        ConvGate{"Convergence Check<br/>Drift < 1e-4 or Iter = 50"}
    end

    subgraph EvaluationViz ["3. Model Evaluation & Visualization"]
        ElbowCalc["Inertia / WCSS Computation<br/>sum ||x_i - mu_c||^2"]
        SilhCalc["Silhouette Coefficient s_i<br/>(b_i - a_i) / max(a_i, b_i)"]
        PCA2D["2D PCA Projection<br/>(Power Iteration for Top 2 Components)"]
        Archetypes["Persona Characterization<br/>(e.g., Tech Leaders, Domain Specialists)"]
    end

    DataPrep --> PRNG
    PRNG --> InitKM
    InitKM --> IterLoop
    IterLoop --> ConvGate
    ConvGate -- "Not Converged" --> IterLoop
    ConvGate -- "Converged" --> ElbowCalc
    ElbowCalc --> SilhCalc
    SilhCalc --> PCA2D
    PCA2D --> Archetypes
```

---

## 2. Mathematical Formulations

### 2.1 Distance Metric & Optimization Objective
Let $X = \{\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_n\} \subset \mathbb{R}^d$ be the normalized feature matrix ($n = 2,000$ alumni). The objective is to partition $X$ into $K$ disjoint clusters $C = \{C_1, C_2, \dots, C_K\}$ minimizing the **Within-Cluster Sum of Squares (WCSS / Inertia)**:
$$J(C) = \sum_{k=1}^K \sum_{\mathbf{x}_i \in C_k} \|\mathbf{x}_i - \boldsymbol{\mu}_k\|_2^2$$
where $\boldsymbol{\mu}_k = \frac{1}{|C_k|} \sum_{\mathbf{x}_i \in C_k} \mathbf{x}_i$ is the centroid of cluster $C_k$, and $\|\cdot\|_2^2$ denotes squared Euclidean distance:
$$\|\mathbf{u} - \mathbf{v}\|_2^2 = \sum_{j=1}^d (u_j - v_j)^2$$

### 2.2 K-Means++ Initialization
Standard random centroid initialization is vulnerable to suboptimal local minima. The DWM platform uses **K-Means++** (Arthur & Vassilvitskii, 2007):
1. The first centroid $\boldsymbol{\mu}_1$ is selected uniformly at random from $X$ using the deterministic Mulberry32 PRNG.
2. For each point $\mathbf{x} \in X$, compute the minimum squared distance to all existing centroids:
   $$D(\mathbf{x})^2 = \min_{j \in \{1, \dots, m\}} \|\mathbf{x} - \boldsymbol{\mu}_j\|_2^2$$
3. The next centroid $\boldsymbol{\mu}_{m+1}$ is sampled from $X$ with probability proportional to $D(\mathbf{x})^2$:
   $$P(\mathbf{x}) = \frac{D(\mathbf{x})^2}{\sum_{\mathbf{x}' \in X} D(\mathbf{x}')^2}$$
4. Repeat Steps 2–3 until $K$ initial centroids are established.

### 2.3 Deterministic Reproducibility via Mulberry32 PRNG
To eliminate stochastic variability across academic demonstrations, the system implements a 32-bit Mulberry32 PRNG initialized with fixed seed `2026`:
```javascript
function createPrng(seed = 2026) {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
```

---

## 3. Multi-$K$ Evaluation: Elbow Method & Silhouette Analysis

The service evaluates clustering quality across candidate cluster counts $K \in \{2, 3, 4, 5, 6, 7, 8\}$:

### 3.1 Inertia (Elbow Method)
As $K$ increases, WCSS monotonically decreases. The optimal $K$ corresponds to the inflection point ("elbow") beyond which additional clusters yield diminishing returns in error reduction.

### 3.2 Silhouette Analysis
For point $\mathbf{x}_i \in C_A$:
1. $a(i) = \frac{1}{|C_A| - 1} \sum_{\mathbf{x}_j \in C_A, j \neq i} \|\mathbf{x}_i - \mathbf{x}_j\|$: Mean intra-cluster distance.
2. $b(i) = \min_{C_B \neq C_A} \frac{1}{|C_B|} \sum_{\mathbf{x}_j \in C_B} \|\mathbf{x}_i - \mathbf{x}_j\|$: Mean nearest-cluster distance.
3. The silhouette coefficient $s(i)$ is:
   $$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))} \in [-1.0, 1.0]$$
The global silhouette score $S = \frac{1}{n} \sum_{i=1}^n s(i)$ quantifies cluster separation and cohesion.

---

## 4. Dimensionality Reduction: 2D Principal Component Analysis (PCA)

High-dimensional cluster assignments cannot be directly plotted on 2D screens. The service computes a deterministic **2D PCA projection** in [featureEngineeringService.js:computePCA2D](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/featureEngineeringService.js):
1. **Centering**: The feature matrix is mean-centered: $\tilde{X} = X - \bar{X}$.
2. **Covariance Matrix**: $\Sigma = \frac{1}{n} \tilde{X}^T \tilde{X} \in \mathbb{R}^{d \times d}$.
3. **Power Iteration with Deflation**: Computes the top two eigenvectors $\mathbf{v}_1, \mathbf{v}_2$ corresponding to the largest eigenvalues $\lambda_1, \lambda_2$.
4. **Projection**:
   $$\mathbf{z}_i = [\tilde{\mathbf{x}}_i^T \mathbf{v}_1, \tilde{\mathbf{x}}_i^T \mathbf{v}_2] \in \mathbb{R}^2$$
The resulting coordinates $(z_{i,1}, z_{i,2})$ power interactive SVG scatter plots in the frontend data mining dashboard.

---

## 5. Unsupervised Clustering Workflow Diagram Reference

The algorithmic stages, seed-invariance guarantees, and PCA projection are visually modeled in:
- **Clustering & PCA Projection Workflow**: [`diagrams/12_clustering_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/12_clustering_workflow.mmd) details feature extraction, Mulberry32 PRNG seed invariance, K-Means++ centroid initialization, Lloyd's optimization iterations, multi-$K$ Elbow and Silhouette evaluation, and Power Iteration 2D PCA projection.




---


<a id="16-experiments-and-results-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 16_EXPERIMENTS_AND_RESULTS.md -->
<!-- ===================================================================== -->

# 16. Empirical Experiments, Benchmarks, and Verification Results

## 1. Classification of Experimental Evidence

To adhere to rigorous academic standards, all metrics, benchmarks, and experimental results in this dossier are partitioned into three explicit evidentiary categories:
1. **Verified Existing Results**: Verified through direct inspection of physical file artifacts, live PostgreSQL query execution, or automated test suite execution.
2. **Newly Measured Results**: Experimentally evaluated using verified non-mutating algorithms on the current warehouse data.
3. **Previously Reported but Unverified Claims**: Historical assertions found in earlier draft documentation that have been corrected or flagged for omission.

---

## 2. Category 1: Verified Existing Results

### 2.1 Physical Dataset Catalog (File System Verification)
Direct file inspection of `DWM-project/datasets/` confirms exact file sizes and record counts:

| Dataset Identifier | Physical File Name | File Size (Bytes) | Verified Data Rows | Verified Columns |
| :--- | :--- | :--- | :--- | :--- |
| `skills` | `skills.csv` | 12,836 | 150 | 4 |
| `alumni` | `alumni.csv` | 374,645 | 2,000 | 10 |
| `jobs` | `jobs.csv` | 978,415 | 5,000 | 10 |
| `alumni_skills` | `alumni_skills.csv` | 1,550,239 | 20,000 | 5 |
| `job_skills` | `job_skills.csv` | 1,140,125 | 15,000 | 4 |
| `applications` | `applications.csv` | 672,760 | 6,000 | 7 |
| `career_outcomes` | `career_outcomes.csv` | 224,389 | 2,000 | 8 |
| **Total** | **7 CSV Files** | **4,953,409 (~4.95 MB)** | **50,150 Rows** | — |

### 2.2 Live Analytical Warehouse Table Counts
Direct execution of count queries against the PostgreSQL `dwh` schema on port `54329`:

| Table Classification | Physical Table Name | Verified Row Count | Foreign Keys | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Dimension** | `dwh.dim_student` | 323 | 0 | Verified |
| **Dimension** | `dwh.dim_alumni` | 2,026 | 0 | Verified |
| **Dimension** | `dwh.dim_company` | 42 | 0 | Verified |
| **Dimension** | `dwh.dim_skill` | 165 | 0 | Verified |
| **Dimension** | `dwh.dim_date` | 4,748 | 0 | Verified |
| **Dimension** | `dwh.dim_job` | 5,002 | 2 | Verified |
| **Bridge Table** | `dwh.bridge_student_skill` | 921 | 2 | Verified |
| **Bridge Table** | `dwh.bridge_alumni_skill` | 20,013 | 2 | Verified |
| **Bridge Table** | `dwh.bridge_job_skill` | 15,008 | 2 | Verified |
| **Fact Table** | `dwh.fact_placement` | 274 | 3 | Verified |
| **Fact Table** | `dwh.fact_job_application` | 6,006 | 6 | Verified |
| **Fact Table** | `dwh.fact_salary_benchmark`| 24 | 3 | Verified |
| **Fact Table** | `dwh.fact_career_outcomes` | 2,002 | 1 | Verified |
| **Audit Ledger** | `dwh.etl_batches` | 137 | 0 | Verified |
| **Audit Ledger** | `dwh.etl_batch_errors` | 46 | 1 | Verified |
| **Total** | **15 Tables** | **56,732 Rows** | **22 FK Constraints** | **Verified** |

### 2.3 Automated Test Suite Execution
Execution of the comprehensive test suite in `DWM-project/server/`:

| Test Suite File | Subsystem Under Test | Total Tests | Passed | Failed | Execution Time |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tests/analytics.test.js` | OLAP cube, endpoints, validation, SQL | 54 | 54 | 0 | ~1,450 ms |
| `tests/datamining.association.test.js` | Apriori itemsets, confidence, lift, pruning | 7 | 7 | 0 | ~180 ms |
| `tests/datamining.classification.test.js`| Logistic regression, split, ROC-AUC | 4 | 4 | 0 | ~140 ms |
| `tests/datamining.clustering.test.js` | K-Means++, Mulberry32, inertia, silhouette | 5 | 5 | 0 | ~190 ms |
| `tests/datamining.integration.test.js` | End-to-end data mining API integration | 8 | 8 | 0 | ~620 ms |
| **Total Suite** | **Analytical & Mining Platform** | **78** | **78** | **0** | **~2,580 ms** |

---

## 3. Category 2: Newly Measured Experimental Results

### 3.1 Apriori Association Rule Mining Experiments
Evaluated on $N = 2,000$ alumni competency baskets (Mode A) and $N = 5,000$ corporate job requisitions (Mode B):

| Experimental Setting | Mode A: Alumni Skills | Mode B: Job Skills |
| :--- | :--- | :--- |
| **Baskets Processed ($N$)** | 2,000 alumni profiles | 5,000 job postings |
| **Minimum Support Threshold** | 5.0% ($\sigma \ge 100$ transactions) | 3.0% ($\sigma \ge 150$ transactions) |
| **Minimum Confidence Threshold**| 50.0% ($0.50$) | 40.0% ($0.40$) |
| **Minimum Lift Threshold** | $1.10\times$ | $1.10\times$ |
| **Frequent 1-Itemsets ($L_1$)**| 19 items | 28 items |
| **Frequent 2-Itemsets ($L_2$)**| 14 itemsets | 22 itemsets |
| **Frequent 3-Itemsets ($L_3$)**| 2 itemsets | 4 itemsets |
| **Candidate Rules Generated** | 32 candidate rules | 58 candidate rules |
| **Rules Qualified** | 11 qualified rules | 19 qualified rules |
| **Top Discovered Rule** | $\{\text{Docker, Kubernetes}\} \Rightarrow \{\text{AWS}\}$ | $\{\text{React, TypeScript}\} \Rightarrow \{\text{Node.js}\}$ |
| **Top Rule Support / Confidence / Lift** | $\text{Supp} = 6.8\%, \text{Conf} = 74.2\%, \text{Lift} = 1.48\times$ | $\text{Supp} = 4.2\%, \text{Conf} = 68.5\%, \text{Lift} = 1.55\times$ |

### 3.2 K-Means Clustering Multi-$K$ Evaluation
Evaluated over $n = 2,000$ alumni profiles using normalized feature matrix ($d = 6$):

| Cluster Count ($K$) | Inertia / WCSS | Silhouette Coefficient ($S$) | Convergence Iterations | Persona Segmentation Summary |
| :--- | :--- | :--- | :--- | :--- |
| $K = 2$ | 482.15 | 0.482 | 6 | Junior Specialists vs Senior Generalists |
| **$K = 3$ (Elbow Candidate)**| **312.40** | **0.524** | **11** | **Core Engineers, Tech Leads, Cloud Architects** |
| **$K = 4$ (Optimal Silhouette)**| **248.80** | **0.561** | **14** | **Entry-level, Full-stack, Data/ML, Cloud/Infra** |
| $K = 5$ | 215.30 | 0.508 | 18 | Granular specialization, marginal separation |
| $K = 6$ | 189.60 | 0.462 | 22 | Over-segmented clusters, diminishing return |
| $K = 7$ | 172.10 | 0.431 | 25 | Cluster fragmentation |
| $K = 8$ | 158.40 | 0.405 | 29 | Cluster fragmentation |

- **Conclusion**: The mathematical elbow appears at $K = 3$, while the peak Silhouette Score ($S = 0.561$) occurs at $K = 4$.

### 3.3 Supervised Classification (Career Outcomes)
Evaluated on $N = 2,002$ records in `fact_career_outcomes` using regularized Logistic Regression ($L_2 = 0.002, \eta = 0.2, T = 350$ epochs):

| Metric | Measured Value | Standard Deviation / Notes |
| :--- | :--- | :--- |
| **Total Dataset Size ($N$)** | 2,002 | 1,397 Positive ($69.8\%$), 605 Negative ($30.2\%$) |
| **Train / Test Partition** | 80% / 20% | $n_{\text{train}} = 1,601$, $n_{\text{test}} = 401$ (Stratified) |
| **Majority Class Baseline Accuracy**| 69.8% | Predicting all positive |
| **Test Accuracy** | **78.3%** | $+8.5\%$ lift over majority baseline |
| **Precision (Positive Class)** | **82.1%** | $\text{TP} / (\text{TP} + \text{FP})$ |
| **Recall / Sensitivity** | **87.5%** | $\text{TP} / (\text{TP} + \text{FN})$ |
| **Specificity (True Negative Rate)** | **57.0%** | $\text{TN} / (\text{TN} + \text{FP})$ |
| **Balanced Accuracy** | **72.3%** | $(\text{Recall} + \text{Specificity}) / 2$ |
| **$F_1$-Score** | **0.847** | Harmonic mean of precision and recall |
| **ROC-AUC** | **0.812** | Continuous threshold integration |

---

## 4. Category 3: Corrected Historical Claims

To prevent academic misrepresentation, the following claims from preliminary project documentation are formally corrected:

| Unverified Historical Assertion | Verified Current Behavior | Resolution & Caveat |
| :--- | :--- | :--- |
| *"Real-time automated sync replicates operational database records into the data warehouse on every insert."* | Operational database sync was intentionally removed to ensure data warehouse isolation. Ingestion is now executed via schema-validated CSV uploads. | Documented in [09_SYSTEM_ARCHITECTURE.md](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/09_SYSTEM_ARCHITECTURE.md). |
| *"Deep Learning / Random Forest models achieve 98.5% accuracy on placement prediction."* | The implemented model is regularized Logistic Regression achieving 78.3% accuracy and 0.812 ROC-AUC. No deep learning models exist in the codebase. | Future ML architectures proposed in [19_RESEARCH_GAPS_AND_FUTURE_WORK.md](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/19_RESEARCH_GAPS_AND_FUTURE_WORK.md). |
| *"Findings reflect general employment and hiring trends across the Indian IT industry."* | All 50,150 dataset records were generated by synthetic distribution scripts. | Synthetic data disclosure added across all research artifacts. |



---


<a id="17-testing-and-quality-assurance-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 17_TESTING_AND_QUALITY_ASSURANCE.md -->
<!-- ===================================================================== -->

# 17. Software Quality Assurance and Test Engineering

## 1. Testing Philosophy & Framework Architecture

The DWM platform uses Node.js's native test runner (`node:test`) combined with `node:assert/strict` to guarantee fast, dependency-free test execution. The testing harness emphasizes three core principles:
1. **Mathematical Verifiability**: Algorithmic unit tests evaluate hand-calculated fixtures where expected matrices, itemsets, and metric values are known a priori.
2. **Deterministic Seed Control**: Stochastic algorithms (K-Means++ initialization, train/test splitting) enforce fixed seeds to guarantee reproducible assertions.
3. **Database Isolation**: Integration tests run against transactional test fixtures without polluting the persistent analytical warehouse.

---

## 2. Comprehensive Test Inventory

The automated test suite comprises **5 test suites** containing **78 distinct test cases**:

| Test Suite File | Subsystem Under Test | Test Count | Key Test Assertions | Status |
| :--- | :--- | :--- | :--- | :--- |
| `tests/analytics.test.js` | Core Analytics & Warehouse Services | 54 | Dimensional roll-ups, salary percentiles, table catalog queries, date formatting, CSV staging | 54 / 54 Passed |
| `tests/datamining.association.test.js` | Apriori Mining Engine | 7 | Support counts, join condition, Apriori pruning, confidence, lift, disjoint antecedents/consequents | 7 / 7 Passed |
| `tests/datamining.classification.test.js`| Logistic Regression & Preprocessing | 4 | Hand-calculated metrics, ROC-AUC extremes (1.0 vs 0.0), stratified ratio preservation | 4 / 4 Passed |
| `tests/datamining.clustering.test.js` | K-Means Clustering | 5 | Deterministic separation of 3 synthetic clusters, PRNG seed invariance, WCSS, Silhouette $> 0.8$ | 5 / 5 Passed |
| `tests/datamining.integration.test.js` | REST API Integration | 8 | End-to-end HTTP responses for summary, clustering, Apriori, classification training, and inference | 8 / 8 Passed |
| **Total Automated Suite** | **Analytical Platform** | **78** | **Full verification of algorithms, APIs, and data integrity** | **78 / 78 Passed** |

---

## 3. Notable Algorithmic Test Cases

### 3.1 Hand-Calculated Classification Metrics (`TC-CLASS-01`)
- **Fixture**: $N = 5$ samples with ground truth $\mathbf{y} = [1, 1, 0, 0, 1]$ and predictions $\hat{\mathbf{y}} = [1, 0, 0, 1, 1]$.
- **Evaluated Values**:
  - $\text{TP} = 2, \text{FN} = 1, \text{TN} = 1, \text{FP} = 1$
  - $\text{Accuracy} = 3/5 = 0.60$
  - $\text{Precision} = 2/(2+1) = 0.6667$
  - $\text{Recall} = 2/(2+1) = 0.6667$
  - $\text{F1-Score} = 0.6667$
- **Verification**: Hand-calculated ground truth matched code outputs to 4 decimal places.

### 3.2 ROC-AUC Extreme Invariance (`TC-CLASS-02`)
- **Perfect Ranking**: $\mathbf{y} = [1, 1, 0, 0]$, $\mathbf{p} = [0.95, 0.80, 0.30, 0.10] \implies \text{AUC} = 1.0$ (Verified).
- **Inverted Ranking**: $\mathbf{y} = [1, 1, 0, 0]$, $\mathbf{p} = [0.10, 0.20, 0.80, 0.90] \implies \text{AUC} = 0.0$ (Verified).

### 3.3 Apriori Disjoint Rule Constraint (`TC-ASSOC-03`)
- **Property**: Asserts that for all discovered rules $X \Rightarrow Y$, $X \cap Y = \emptyset$.
- **Verification**: Passed across all generated candidate and qualified rules.

### 3.4 Seed Invariance in K-Means (`TC-CLUST-02`)
- **Property**: Two independent runs initialized with `randomSeed: 12345` must produce bitwise identical centroid coordinates, cluster assignments, inertia values, and iteration counts.
- **Verification**: `assert.deepEqual(run1.assignments, run2.assignments)` passed.

---

## 4. Test Coverage Gaps & Quality Roadmap

While algorithmic and API layers maintain 100% test pass rates, the following coverage gaps are documented for future engineering cycles:
1. **Frontend Component Unit Testing**: Frontend React components are currently validated via Vite production builds and manual UI verification rather than automated Jest/Vitest unit tests.
2. **Stress Testing Under Concurrent Ingestion**: The CSV upload pipeline has been tested with single 25 MB files, but concurrent multi-user multipart uploads under high memory pressure require benchmark profiling.
3. **Database Failover & Reconnect Tests**: While connection pools handle transient errors, network partition simulations against external PostgreSQL instances remain to be implemented.



---


<a id="18-security-and-limitations-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 18_SECURITY_AND_LIMITATIONS.md -->
<!-- ===================================================================== -->

# 18. Security Posture, Data Privacy, and System Limitations

## 1. Security Architecture & Threat Mitigation

The DWM analytical platform is engineered with defensive security controls tailored for institutional data warehousing:

```mermaid
graph TD
    subgraph Client ["Client Perimeter"]
        Browser["Analyst Web Browser"]
    end

    subgraph DefensePerimeter ["Perimeter Defenses"]
        Helmet["Helmet HTTP Headers<br/>(HSTS, CSP, XSS Protection)"]
        CORS["Strict CORS Policy<br/>(Allowed Origins Whitelist)"]
        RateLimit["Body Parser & File Size Limits<br/>(25 MB Buffer Capping)"]
    end

    subgraph ValidationAuth ["Validation & Access Layer"]
        ZodVal["Zod Schema Validation<br/>(Query, Param & Body Types)"]
        AuthGate{"Endpoint Classification<br/>Read-Only vs Mutation"}
        GuestPerm["Guest Access Allowed<br/>(Read-only visual queries)"]
        JWTAuth["JWT & Role Enforcement<br/>(admin / faculty for uploads)"]
    end

    subgraph DataPerimeter ["Storage & SQL Defenses"]
        ParamSQL["Parameterized SQL Queries<br/>($1, $2, ... placeholders)"]
        IdentMap["Identifier Whitelist Map<br/>(ALLOWED_DIMENSIONS)"]
        NoCrossFK["Zero Cross-Schema Foreign Keys<br/>(dwh <--> public isolated)"]
    end

    Browser --> Helmet
    Helmet --> CORS
    CORS --> RateLimit
    RateLimit --> ZodVal
    ZodVal --> AuthGate
    AuthGate -- "GET Read-Only" --> GuestPerm
    AuthGate -- "POST Mutations" --> JWTAuth
    GuestPerm --> ParamSQL
    JWTAuth --> ParamSQL
    ParamSQL --> IdentMap
    IdentMap --> NoCrossFK
```

---

## 2. Threat Analysis & Defensive Implementations

### 2.1 SQL Injection Defenses
- **Prepared Statements**: All dynamic filters (department, corporate tier, company name, graduation year) are executed via parameterized queries (`$1, $2, ...`), preventing string interpolation attacks.
- **Dynamic Dimension Whitelisting**: For multidimensional OLAP operations where SQL column identifiers vary dynamically based on user selection, raw strings are prohibited. Columns are resolved through an immutable dictionary:
  ```javascript
  const allowedDimensions = {
    department: 's.department',
    tier: 'c.company_tier',
    company: 'c.company_name',
    year: 'COALESCE(d.year, s.graduation_year)',
    industry: 'c.industry',
    degree: 's.degree',
    source: 'p.record_source',
  }
  ```
  Unrecognized input strings default safely to `s.department`.

### 2.2 Input Sanitization & Ingestion Security
- **File Upload Protection**: Multer limits multipart CSV uploads to **25 MB**, rejecting oversized memory exhaustion payloads.
- **File Type Enforcement**: File streams are validated for `.csv` extensions and `text/csv` MIME types.
- **Zod Schema Validation**: Request parameters, pagination limits, and query strings are strictly parsed using Zod schemas. Non-numeric strings passed to numerical parameters (e.g., `minLpa`, `limit`) return HTTP 400 Bad Request before hitting the database.

### 2.3 Authentication Decoupling
- **Analytical Read Access**: Educational institutions often display analytical dashboards publicly (e.g., NIRF accreditation or prospective student portals). Read endpoints permit unauthenticated access via `allowGuestAnalytics`.
- **Ingestion Mutations**: All endpoints that alter warehouse records (`/api/analytics/etl/upload`, `/confirm-import`, `/rollback-import`) require valid JWT bearer tokens with administrative privileges (`requireAuth`).

---

## 3. Data Privacy and Sensitive Identifiers

The data warehouse enforces privacy through structural omission:
1. **No PII Storage**: Physical names, personal email addresses, phone numbers, and street addresses are excluded from all `dwh` tables.
2. **Informational Keys**: Student ID numbers and UUID references (`source_user_id`) serve solely as non-sensitive linking identifiers.
3. **Aggregate Reporting**: Visual dashboards and OLAP cubes display aggregate metrics ($\mu$, $\sigma$, percentiles), minimizing the risk of individual re-identification.

---

## 4. Technical and Scientific Limitations

### 4.1 Synthetic Data Realism & Distributional Assumptions
- **Empirical Boundary**: All 50,150 dataset records were generated by synthetic distribution scripts (`generate_dwm_datasets.py`).
- **Research Implication**: The strong associations discovered by Apriori (e.g., Docker $\Rightarrow$ AWS) and the 78.3% classification accuracy reflect the mathematical distributions embedded in the generator scripts. **They must not be presented as empirical evidence of general hiring trends in the commercial software industry.**

### 4.2 In-Memory Algorithm Scalability
- The machine learning and Apriori services run in-memory within the Node.js V8 runtime heap.
- While performant for institutional datasets ($N = 2,000$ to $50,000$ records, execution $< 300\text{ ms}$), scaling to multi-million record enterprise warehouses will require migrating compute workloads to out-of-core engines (e.g., Apache Spark, pgvector, or Python scikit-learn background workers).

### 4.3 Longitudinal Tracking Constraints
- `dim_alumni` provides SCD Type 2 tracking fields (`valid_from`, `valid_to`, `is_current`), but current synthetic datasets represent single-snapshot career states. Full historical career trajectory modeling requires multi-year observation ingestion.



---


<a id="19-research-gaps-and-future-work-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 19_RESEARCH_GAPS_AND_FUTURE_WORK.md -->
<!-- ===================================================================== -->

# 19. Research Gaps, Hypotheses, and Future Work Roadmap

## 1. Identified Research and Engineering Gaps

The DWM project provides a robust foundation for institutional data warehousing and educational data mining. However, critical research gaps remain that present valuable opportunities for future academic research and system evolution:

```mermaid
graph TD
    CurrentState["Current DWM Implementation<br/>- Constellation Schema (15 Tables)<br/>- 50,150 Synthetic Records<br/>- In-Memory Logistic Reg (78.3%)<br/>- Apriori Mining (Mode A & B)<br/>- K-Means++ Clustering"]
    
    Gap1["Gap 1: Empirical Real-World Validation<br/>(Absence of Multi-Campus Operational Datasets)"]
    Gap2["Gap 2: Advanced Predictive Architectures<br/>(Linear Classifier vs Non-Linear Tree/GNN Models)"]
    Gap3["Gap 3: Graph-Theoretic Competency Networks<br/>(Hypergraph Modeling of Skill Co-Occurrence)"]
    Gap4["Gap 4: Dynamic Recommender Systems<br/>(Closing Student-to-Market Skill Deficits)"]

    CurrentState --> Gap1
    CurrentState --> Gap2
    CurrentState --> Gap3
    CurrentState --> Gap4
```

---

## 2. Proposed Research Agendas & Hypotheses

### Agenda 1: Non-Linear Ensemble vs Linear Models for Career Trajectory Prediction
- **Problem Statement**: The current classifier implements regularized Logistic Regression assuming linear decision boundaries in normalized skill-space. Do non-linear ensemble models (Gradient Boosted Decision Trees, Random Forests) or Deep Learning models improve sensitivity on the minority class (unemployed graduates)?
- **Hypothesis**: *Gradient Boosted Decision Trees (XGBoost) will demonstrate statistically significant improvements in ROC-AUC ($\Delta \text{AUC} \ge 0.08$) and recall on underrepresented engineering disciplines compared to regularized linear baselines.*
- **Evaluation Plan**:
  - Implement 5-fold cross-validation.
  - Baselines: Zero-R (Majority class), Logistic Regression (current), Random Forest, XGBoost.
  - Metrics: Macro-F1, ROC-AUC, Brier score, and SHAP (SHapley Additive exPlanations) values for global feature attribution.

### Agenda 2: Graph Neural Networks (GNN) on Higher-Ed Knowledge Graphs
- **Problem Statement**: Student-skill-job relationships form a natural heterogeneous information network (HIN). Relational table joins and flat feature vectors discard structural topological relationships.
- **Hypothesis**: *A Heterogeneous Graph Neural Network (HAN / HGT) trained on bipartite student-skill and job-skill subgraphs will predict student-job compatibility with higher precision than isolated ATS keyword matching.*
- **Methodology**:
  - Node types: $\mathcal{V} = \{\text{Student}, \text{Alumni}, \text{Skill}, \text{Company}, \text{Job}\}$.
  - Edge types: $\mathcal{E} = \{\text{proficient\_in}, \text{demands}, \text{placed\_at}, \text{applied\_to}\}$.
  - Evaluation: Link prediction accuracy and ranking metrics (MRR, NDCG@10).

### Agenda 3: Closed-Loop Curricular Recommendation System
- **Problem Statement**: While the platform identifies institutional skill deficits via `GET /api/analytics/skills`, it does not automatically prescribe personalized learning pathways to close the gap.
- **Research Question**: *Can an automated recommender system using Apriori association rules and market vacancy weights dynamically generate personalized course and certification suggestions that maximize a student's placement probability?*

---

## 3. Engineering and Scalability Roadmap

| Horizon | Engineering Objective | Proposed Technical Architecture | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **Short-Term (3 Months)** | Out-of-Core ML Training | Python FastAPI microservice wrapping `scikit-learn` and `lightgbm` | Support datasets $> 1,000,000$ rows without Node.js heap exhaustion |
| **Medium-Term (6 Months)**| Real-Time Streaming Ingestion | Apache Kafka message bus with Debezium CDC | Near-instantaneous analytical cube refresh upon transactional commits |
| **Long-Term (12 Months)** | Cross-Institutional Federation | Multi-tenant schema isolation with differential privacy | Collaborative cross-university benchmarking without data exposure |



---


<a id="20-research-paper-blueprint-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 20_RESEARCH_PAPER_BLUEPRINT.md -->
<!-- ===================================================================== -->

# 20. Academic Research Paper Blueprint

## 1. Title Proposals

1. **"Bridging Academia and Enterprise: A Fact-Constellation Data Warehousing and Multi-Mining Framework for Higher-Education Career Intelligence"** *(Recommended: Captures both data warehousing and data mining dimensions)*
2. **"Decoupled Educational Analytics: An Integrated Galaxy-Schema Architecture for Longitudinal Graduate Trajectory Modeling and Skill-Gap Mining"** *(Emphasizes architectural decoupling and dimensional modeling)*
3. **"From Curriculum to Placement: Longitudinal Educational Data Mining via Apriori Association Rules and Constellation Warehousing"** *(Emphasizes pedagogical and institutional decision-making)*

---

## 2. Structured Academic Abstract Blueprint

- **Background & Motivation**: Higher-education institutions face increasing scrutiny from accreditation bodies and industry stakeholders regarding graduate employability, curricular alignment, and placement transparency. However, traditional enterprise student information systems (SIS) are designed for operational transaction processing rather than longitudinal career intelligence.
- **Methodology & Architecture**: This paper presents the architecture, implementation, and empirical evaluation of an end-to-end higher-education Data Warehousing and Data Mining (DWM) platform. The system employs a 15-table Fact Constellation (Galaxy Schema) in PostgreSQL comprising four interconnected fact tables, six conformed dimensions, and three multivalued bridge tables. It integrates five canonical OLAP operations with a three-pillar data mining suite: (i) an Apriori frequent itemset engine for multi-modal skill co-occurrence discovery, (ii) a deterministic K-Means++ clustering module for graduate profile segmentation, and (iii) a leakage-safe regularized Logistic Regression classifier for 6-month graduate employment prediction.
- **Empirical Findings**: Evaluated across an integrated institutional warehouse containing 56,732 rows and 50,150 synthetic benchmark instances, the OLAP engine delivers sub-50ms multi-axis cube aggregations. The Apriori algorithm identifies high-confidence enterprise skill bundles (e.g., $\{\text{Docker, Kubernetes}\} \Rightarrow \{\text{AWS}\}$ with $74.2\%$ confidence and $1.48\times$ lift). Cluster evaluation demonstrates an optimal structural partition at $K=4$ (Silhouette score $S=0.561$). The predictive classifier achieves $78.3\%$ accuracy ($+8.5\%$ lift over majority baseline) with an ROC-AUC of $0.812$.
- **Contribution & Significance**: We provide formal architectural blueprints, dimensional schemas, algorithmic workflows, and an open reproducible benchmark suite for higher-education institutional researchers.

---

## 3. Formal Research Questions (RQs)

- **RQ1 (Architectural Efficacy)**: *How effectively does a Fact Constellation schema with conformed dimensions balance multidimensional OLAP aggregation performance against relational maintenance complexity in higher-education analytics?*
- **RQ2 (Competency Association Mining)**: *What latent co-occurrence patterns exist between graduate skill acquisition (Mode A) and enterprise job requisition demand (Mode B), and how can lift-ranked association rules inform university curriculum design?*
- **RQ3 (Longitudinal Predictability)**: *To what extent can 6-month post-graduation employment outcomes be predicted from academic metrics, technical skill vectors, and pre-graduation test scores without data leakage?*
- **RQ4 (Structural Profile Segmentation)**: *What natural student and alumni archetypes emerge from multi-dimensional clustering, and what is the optimal cluster count $K$ supported by inertia and silhouette analysis?*

---

## 4. Manuscript Structure & Section Writing Guidelines

```
1. INTRODUCTION
   1.1 Domain Context & Institutional Bottlenecks (Accreditation, Placement Gaps)
   1.2 Limitations of Operational SIS and Monolithic Star Schemas
   1.3 Primary Contributions & Paper Organization

2. RELATED WORK
   2.1 Educational Data Mining (EDM) & Learning Analytics
   2.2 Data Warehousing in Higher Education (Star vs Snowflake vs Constellation)
   2.3 Machine Learning for Graduate Employability Prediction

3. SYSTEM ARCHITECTURE & DATA WAREHOUSE DESIGN
   3.1 Three-Tier Decoupled Architecture
   3.2 Fact Constellation Schema (15 Tables, 22 Foreign Keys)
   3.3 Conformed Dimensions, Surrogate Keys, and Pre-Computed Date Calendar
   3.4 Multivalued Bridge Tables & Grain Integrity

4. DATA INGESTION, LINEAGE, AND QUALITY ASSURANCE
   4.1 Schema-Validated Batch ETL Pipeline
   4.2 Row-Level Quality Filtering & Error Ledgering
   4.3 Complete Physical Separation from Operational OLTP Stores

5. DATA MINING METHODOLOGY
   5.1 OLAP Multidimensional Cube Engine (Roll-Up, Drill-Down, Slice, Dice, Pivot)
   5.2 Apriori Association Rule Mining (Mode A vs Mode B)
   5.3 Deterministic K-Means++ Clustering & PCA 2D Dimensionality Reduction
   5.4 Supervised Classification: Regularized Logistic Regression with Zero Leakage

6. EXPERIMENTAL RESULTS & DISCUSSION
   6.1 Experimental Setup & Benchmark Dataset Specifications
   6.2 OLAP Execution Latency & Cube Roll-Up Evaluation
   6.3 Discovered Skill Bundles & Rule Diagnostics
   6.4 Cluster Optimization: Elbow WCSS & Silhouette Score Distributions
   6.5 Classification Evaluation: Accuracy, F1, Confusion Matrix, and ROC-AUC

7. THREATS TO VALIDITY & LIMITATIONS
   7.1 Synthetic Data Realism & Distributional Assumptions
   7.2 In-Memory Node.js V8 Runtime Constraints
   7.3 Cross-Institutional Generalizability

8. CONCLUSION & FUTURE WORK
   8.1 Summary of Findings
   8.2 Deep Graph Neural Networks and Automated Recommender Extensions
```

---

## 5. Ready-to-Publish vs Pending Literature Tasks

| Manuscript Section | Preparation Status | Evidence Source | Remaining Actions Required |
| :--- | :--- | :--- | :--- |
| Section 1: Introduction | **Ready** | `01_PROJECT_BACKGROUND_AND_MOTIVATION.md` | Finalize institutional author affiliations |
| Section 2: Related Work | **Pending Review** | External literature search | Synthesize 20–25 IEEE/ACM EDM papers |
| Section 3: Warehouse Design | **Ready** | `07_DATA_WAREHOUSE_DESIGN.md`, `08_DATABASE_ERD.md` | Convert Mermaid ERD to high-res publication vector |
| Section 4: ETL & Lineage | **Ready** | `10_DATA_PIPELINE_AND_LINEAGE.md` | Embed batch audit summary statistics |
| Section 5: Data Mining | **Ready** | `13_ASSOCIATION_RULE_MINING.md`, `14_CLASSIFICATION.md` | Typeset mathematical equations in LaTeX |
| Section 6: Results | **Ready** | `16_EXPERIMENTS_AND_RESULTS.md` | Generate final publication SVG/EPS charts |
| Section 7: Limitations | **Ready** | `18_SECURITY_AND_LIMITATIONS.md` | Explicit synthetic data caveat emphasized |
| Section 8: Conclusion | **Ready** | `19_RESEARCH_GAPS_AND_FUTURE_WORK.md` | Finalize concluding remarks |

---

## 6. Recommended Publication Figures & Vector Diagrams

The following Mermaid architectural diagrams in [`diagrams/`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/) are recommended for inclusion as primary figures in the academic manuscript:

| Manuscript Figure | Recommended Diagram Source File | Academic Publication Focus |
| :--- | :--- | :--- |
| **Figure 1** | [`diagrams/15_research_methodology.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/15_research_methodology.mmd) | **Research Methodology Framework**: Placed in Section 1 (Introduction) or Section 3 (Methodology) outlining the multi-stage research lifecycle. |
| **Figure 2** | [`diagrams/01_system_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/01_system_architecture.mmd) | **Decoupled System Architecture**: Placed in Section 3 outlining the 3-tier decoupled design and independent runtime. |
| **Figure 3** | [`diagrams/04_warehouse_erd.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/04_warehouse_erd.mmd) | **Fact Constellation Schema**: Placed in Section 3 illustrating the 15 tables, conformed dimensions, and 22 referential constraints. |
| **Figure 4** | [`diagrams/06_etl_data_lineage.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/06_etl_data_lineage.mmd) | **Data Lineage & Staged Ingestion**: Placed in Section 4 detailing row validation and transactional loading. |
| **Figure 5** | [`diagrams/10_apriori_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/10_apriori_workflow.mmd) | **Apriori Algorithm Pipeline**: Placed in Section 5 detailing candidate generation, pruning, and Mode A vs Mode B. |
| **Figure 6** | [`diagrams/11_classification_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/11_classification_workflow.mmd) | **Leakage-Safe Classification Pipeline**: Placed in Section 5 highlighting stratified splitting and frozen train-only scaling. |
| **Figure 7** | [`diagrams/12_clustering_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/12_clustering_workflow.mmd) | **K-Means++ & PCA Workflow**: Placed in Section 5 illustrating Lloyd's optimization and Power Iteration 2D PCA scatter plots. |




---


<a id="21-academic-poster-content-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 21_ACADEMIC_POSTER_CONTENT.md -->
<!-- ===================================================================== -->

# 21. Academic Poster Layout and Content Specification

## 1. Poster Metadata & Recommended Layout

- **Dimensions**: Standard Academic Poster Size: **A0 Portrait** ($841\text{ mm} \times 1189\text{ mm}$) or **A0 Landscape** ($1189\text{ mm} \times 841\text{ mm}$).
- **Target Venue**: IEEE / ACM International Conference on Educational Data Mining (EDM) or Learning Analytics & Knowledge (LAK).
- **Recommended Layout Architecture**: **Three-Column Grid** with high contrast, modern sans-serif typography (Inter / Roboto), and clear visual hierarchy.

```
+----------------------------------------------------------------------------------------------------+
|                                         POSTER HEADER BANNER                                       |
|      TITLE: Bridging Academia & Enterprise: A Fact-Constellation DWM Platform for Career Analytics |
|      AUTHORS: [Author Name 1], [Author Name 2], [Faculty Advisor] | [Department / Institution]     |
+------------------------------------+-----------------------------------+---------------------------+
|             COLUMN 1               |             COLUMN 2              |          COLUMN 3         |
|  1. Problem Statement & Context    |  4. System & Warehouse Design     |  7. Apriori Skill Mining  |
|  2. Core Research Objectives       |     - Fact Constellation ERD      |  8. Profile Clustering   |
|  3. Benchmark Dataset Summary      |  5. OLAP Multidimensional Cube    |  9. Placement Classifier  |
|     (50,150 Synthetic Records)     |  6. Quality & Ingestion Pipeline  | 10. Key Verified Results  |
|                                    |                                   | 11. Conclusions & Gaps    |
+------------------------------------+-----------------------------------+---------------------------+
|                                         FOOTER & QR CODES                                          |
|      [QR: GitHub Repository]          [QR: Live Interactive Demo]          [QR: Research Dossier]  |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Poster Panel Content (Modular Text)

### Panel 1: Problem Statement & Motivation
- **Institutional Challenge**: Academic institutions struggle with fragmented, siloed student data. Operational systems track semester grades but fail to model longitudinal post-graduation career trajectories.
- **Curricular Mismatch**: Universities lack automated mechanisms to contrast student technical competency against shifting corporate hiring demands.
- **Accreditation Mandates**: Regulatory bodies (NAAC / NIRF) require transparent, auditable tracking of 6-month graduate employment rates.

### Panel 2: Research Objectives
- **O1**: Design and implement a conformed **Fact Constellation Data Warehouse** in PostgreSQL isolating analytical workloads from operational OLTP databases.
- **O2**: Engineer an interactive **OLAP Multidimensional Engine** supporting Roll-Up, Drill-Down, Slice, Dice, and 2D Matrix Pivoting.
- **O3**: Formulate an **Educational Data Mining Suite** combining Apriori frequent itemsets, deterministic K-Means++ clustering, and leakage-safe Logistic Regression.

### Panel 3: Benchmark Datasets & Warehouse Catalog
- **Physical Datasets**: 7 curated CSV files ($50,150$ total rows, $4.95\text{ MB}$).
- **Analytical Warehouse**: 15 relational tables in PostgreSQL `dwh` schema ($56,732$ rows, $22$ foreign keys).
- **Integrity**: $38$ automated data quality checks ($37$ passed, $1$ warning for $46$ logged test rejections).

### Panel 4: System Architecture & Warehouse Design
- **Architecture**: Decoupled three-tier architecture (React 18 + Vite frontend, Node.js + Express backend, PostgreSQL analytical warehouse).
- **Constellation Schema**:
  - $4$ Fact Tables: `fact_placement`, `fact_job_application`, `fact_salary_benchmark`, `fact_career_outcomes`.
  - $6$ Conformed Dimensions: `dim_student`, `dim_alumni`, `dim_company`, `dim_skill`, `dim_date`, `dim_job`.
  - $3$ Multivalued Bridges: `bridge_student_skill`, `bridge_alumni_skill`, `bridge_job_skill`.

### Panel 5: OLAP Multidimensional Analysis
- **Sub-50ms Query Performance**: Dynamic execution across $7$ dimension axes and $7$ statistical measures.
- **Exact Continuous Medians**: Evaluates exact 50th percentiles using PostgreSQL `PERCENTILE_CONT(0.5) WITHIN GROUP`.
- **2D Dynamic Pivot**: Real-time matrix cross-tabulation with automated row and column marginal totals.

### Panel 6: Data Mining Methodologies & Results
- **Apriori Association Rule Mining**:
  - Discovered enterprise skill bundles across $2,000$ alumni profiles and $5,000$ job requisitions.
  - Top Discovered Rule: $\{\text{Docker, Kubernetes}\} \Rightarrow \{\text{AWS}\}$ ($\text{Conf} = 74.2\%, \text{Lift} = 1.48\times$).
- **K-Means++ Profile Clustering**:
  - Deterministic clustering using Mulberry32 PRNG (seed `2026`).
  - Elbow point verified at $K=3$ ($\text{Inertia} = 312.4$); peak Silhouette Score verified at $K=4$ ($S = 0.561$).
- **Supervised Placement Classifier**:
  - Regularized Logistic Regression with $L_2$ penalty and balanced class weighting.
  - Zero data leakage: preprocessing fitted strictly on $80\%$ training partition.
  - **Results**: $78.3\%$ Test Accuracy ($+8.5\%$ lift over majority baseline), $82.1\%$ Precision, $87.5\%$ Recall, and $\text{ROC-AUC} = 0.812$.

### Panel 7: Conclusions & Ethical Disclosure
- **Key Takeaway**: Fact Constellation data warehousing combined with modular data mining bridges the gap between academic curriculum design and corporate hiring realities.
- **Synthetic Data Transparency**: All findings represent empirical distributions in the synthetic benchmark dataset and must not be interpreted as commercial labor market evidence.

---

## 3. Recommended Visual Diagrams for Academic Poster

To maintain high visual impact and readability without overcrowding the poster layout, only a curated subset of diagrams should be featured:

| Poster Panel / Column | Recommended Diagram | Rationale & Visual Design Strategy |
| :--- | :--- | :--- |
| **Column 1 (System Architecture)** | **[`diagrams/01_system_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/01_system_architecture.mmd)** | High-level 3-tier view illustrating the React frontend, Express backend, and isolated PostgreSQL `dwh` schema. Avoid showing minor utility scripts. |
| **Column 2 (Dataset to Warehouse Flow)** | **[`diagrams/05_dataset_relationships.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/05_dataset_relationships.mmd)** | Clean flow showing how the 7 CSV datasets map into warehouse dimensions, bridges, and facts. *(Note: Do NOT place the full 15-table ERD on the poster as text will be unreadable from 2 meters away; provide a QR code linking to [`04_warehouse_erd.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/04_warehouse_erd.mmd) instead).* |
| **Column 3 (Data Mining & Evaluation)** | **[`diagrams/11_classification_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/11_classification_workflow.mmd)** & **[`diagrams/12_clustering_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/12_clustering_workflow.mmd)** | Show the leakage-safe 80/20 train/test split box and the 2D PCA cluster scatter plot alongside the $2 \times 2$ confusion matrix table and ROC curve ($0.812$). |
| **Footer (Interactive Repositories)** | **QR Codes** | QR 1: GitHub Repository URL; QR 2: Live Demo URL (`http://localhost:5174`); QR 3: Complete Research Dossier & Full-Res ERD. |




---


<a id="22-presentation-and-demo-guide-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 22_PRESENTATION_AND_DEMO_GUIDE.md -->
<!-- ===================================================================== -->

# 22. Technical Presentation and Live Demonstration Guide

## 1. Demonstration Sequence & Time Allocation (15-Minute Viva Defense)

| Phase | Duration | Focus Area | Active Route / Component | Primary Talking Points |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | 0:00 – 2:30 | Problem & Architecture | `/analytics/warehouse` | Higher-ed data silos, constellation schema, 15 tables, 22 foreign keys, complete isolation from OLTP |
| **Phase 2** | 2:30 – 5:30 | OLAP Multidimensional Cube | `/analytics/olap` | Roll-up, Drill-down, Slicing by department, Dicing by LPA threshold, 2D Pivot Heatmap |
| **Phase 3** | 5:30 – 8:30 | Apriori Association Mining | `/analytics/mining` (Tab 1) | Mode A (Alumni) vs Mode B (Jobs), support/confidence/lift, discovered $\{\text{Docker, K8s}\} \Rightarrow \{\text{AWS}\}$ |
| **Phase 4** | 8:30 – 11:00 | K-Means Clustering & PCA | `/analytics/mining` (Tab 2) | K-Means++, Mulberry32 PRNG seed invariance, Elbow at $K=3$, peak Silhouette at $K=4$, 2D PCA scatter |
| **Phase 5** | 11:00 – 13:00| Supervised Classification | `/analytics/mining` (Tab 3) | 6-month placement target, 80/20 train/test split, zero leakage, ROC-AUC $= 0.812$, live inference form |
| **Phase 6** | 13:00 – 15:00| Quality & Ingestion Ledger | `/analytics/csv-ingest` | 38 automated checks, dry-run staging, audit logs (137 batches), rejection ledger |

---

## 2. Step-by-Step Screen Walkthrough

### Step 1: Warehouse Explorer (`http://localhost:5174/analytics/warehouse`)
1. Show the **Warehouse Metric Cards**: Point out the **15 analytical tables**, **56,732 warehouse rows**, and **22 referential constraints**.
2. Click on the **Database ERD Tab**: Display the interactive Mermaid diagram illustrating the conformed dimensions (`dim_student`, `dim_alumni`, `dim_company`, `dim_skill`, `dim_date`, `dim_job`) connected to the 4 fact tables.
3. Open the **Table Detail View** for `fact_career_outcomes`: Demonstrate that `employed_within_6_months` is strictly binary ($0$ or $1$) and tied $1:1$ to `dim_alumni`.
4. Highlight **Architectural Decoupling**: Explain that no foreign key references `public.users` or any operational table.

### Step 2: OLAP Explorer (`http://localhost:5174/analytics/olap`)
1. Demonstrate **Default Roll-Up**: View institutional placement statistics across all departments.
2. Perform **Slicing**: Set Department = `'Computer Engineering'`, observe instant filtered updates.
3. Perform **Dicing**: Set Minimum Package = `10.0 LPA`. Show that low-tier offers are excluded from the aggregation.
4. Execute **2D Dynamic Pivot**:
   - Set Row Axis = `Department`.
   - Set Column Axis = `Company Tier`.
   - Set Metric = `Average Package (LPA)`.
   - Demonstrate the generated SVG heatmap matrix showing marginal row and column totals.

### Step 3: Apriori Association Mining (`http://localhost:5174/analytics/mining`)
1. Navigate to the **Association Rules** tab.
2. Select **Mode A (Alumni Skills)**: Set Min Support = `5%`, Min Confidence = `50%`, Min Lift = `1.1x`.
3. Click **Execute Mining**: Show the discovered frequent 2-itemsets and 3-itemsets.
4. Highlight Rule: $\{\text{Docker, Kubernetes}\} \Rightarrow \{\text{AWS}\}$ with $\text{Lift} = 1.48\times$. Explain that lift $> 1.0$ indicates strong positive co-occurrence rather than random coincidence.
5. Switch to **Mode B (Job Skills)**: Contrast candidate demands against alumni competency.

### Step 4: K-Means Clustering (`http://localhost:5174/analytics/mining`)
1. Navigate to the **Profile Clustering** tab.
2. Set $K = 4$: Show the 2D PCA scatter plot projecting the 6-dimensional feature space onto 2 principal components.
3. Show **Cluster Personas**: Review cluster summaries (e.g., *Cloud Infrastructure Specialists*, *Core Software Engineers*).
4. Review **Evaluation Curve**: Show the Elbow graph and Silhouette score peak at $K=4$ ($S = 0.561$).

### Step 5: Supervised Classification (`http://localhost:5174/analytics/mining`)
1. Navigate to the **Placement Classifier** tab.
2. Review the **Evaluation Metrics Card**: Test Accuracy ($78.3\%$), Precision ($82.1\%$), Recall ($87.5\%$), ROC-AUC ($0.812$).
3. Point out the **$2 \times 2$ Confusion Matrix**: Discuss True Positives vs False Negatives.
4. Demonstrate **Interactive Single-Record Prediction**:
   - Input: $\text{CGPA} = 8.5, \text{Internships} = 2, \text{Backlogs} = 0, \text{Technical Score} = 85$.
   - Click **Predict**: Observe live predicted probability (e.g., $91.4\%$ Employed within 6 months).

---

## 3. Anticipated Viva Defense Questions & Verified Answers

### Q1: *"Why did you use a Fact Constellation schema instead of a single Star Schema?"*
> **Answer**: A single star schema requires forcing all business events to a single grain. Institutional analytics involves multiple distinct business processes occurring at different points in time: campus placements (student grain), career portal applications (applicant/requisition grain), compensation benchmarking (alumni/tier grain), and 6-month graduate employment (alumni longitudinal grain). A Fact Constellation shares conformed dimensions (`dim_company`, `dim_skill`, `dim_date`) across these four distinct fact tables, maintaining relational normalization and preventing null-padded records.

### Q2: *"How do you guarantee that your classification model does not suffer from data leakage?"*
> **Answer**: In [classificationService.js:fitPreprocessor](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/classificationService.js), data partitioning occurs *before* any feature extraction. The dataset is split into 80% train and 20% test partitions using stratified sampling. Preprocessing transformations—specifically the selection of the top 30 skill features and the min-max normalization bounds for experience—are computed strictly on the 1,601 training instances. The test partition is transformed using the frozen training parameters.

### Q3: *"Can these findings be used to conclude that Docker is the most demanded skill in the Indian software industry?"*
> **Answer**: No. All 50,150 dataset records were generated by synthetic distribution scripts (`generate_dwm_datasets.py`) for educational demonstrations. While the algorithms and data warehouse design are production-grade, the resulting statistical rules represent patterns within the synthetic dataset and must not be interpreted as empirical industry trends.

### Q4: *"Why was operational database synchronization removed from the project?"*
> **Answer**: Real-time replication between the operational OLTP database (`public` schema) and the analytical warehouse (`dwh` schema) violated transactional isolation. It introduced lock contention, risked cross-schema cascading deletes, and coupled analytical uptime to user portal activity. Decoupling the systems and moving to an audited, schema-validated CSV ETL pipeline ensures the analytical warehouse remains independent, deterministic, and read-only.

---

## 4. Visual Presentation & Slide Deck Diagram Mapping

When preparing Microsoft PowerPoint or Keynote slide decks for a technical conference or viva defense, map slides directly to the following vector diagrams:

| Slide # | Slide Topic & Title | Recommended Diagram Source File | Visual Emphasis |
| :--- | :--- | :--- | :--- |
| **Slide 2** | Institutional Context & Problem | [`diagrams/15_research_methodology.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/15_research_methodology.mmd) | Focus on Phase 1 (Problem Definition & SIlos). |
| **Slide 3** | System Architecture & Decoupling | [`diagrams/01_system_architecture.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/01_system_architecture.mmd) | Highlight 3 tiers and the complete decoupling callout box. |
| **Slide 4** | Runtime Topology & Ports | [`diagrams/14_runtime_topology.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/14_runtime_topology.mmd) | Show independent ports: 5174/5001 vs 5173/5000 and schema isolation. |
| **Slide 5** | Dimensional Warehouse Design | [`diagrams/04_warehouse_erd.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/04_warehouse_erd.mmd) | Fact Constellation, conformed dimensions, and multivalued bridges. |
| **Slide 6** | Data Ingestion & Audit Ledger | [`diagrams/06_etl_data_lineage.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/06_etl_data_lineage.mmd) | Show row validation filters and dry-run staging gate. |
| **Slide 7** | OLAP Multidimensional Cube | [`diagrams/09_olap_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/09_olap_workflow.mmd) | Slicing, dicing, roll-up, drill-down, and 2D matrix pivoting. |
| **Slide 8** | Apriori Association Rule Mining | [`diagrams/10_apriori_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/10_apriori_workflow.mmd) | Candidate generation, subset pruning, and Mode A vs Mode B. |
| **Slide 9** | Unsupervised K-Means++ Clustering | [`diagrams/12_clustering_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/12_clustering_workflow.mmd) | Lloyd's iterations, Elbow/Silhouette curves, and 2D PCA scatter. |
| **Slide 10** | Supervised Career Outcome Classifier| [`diagrams/11_classification_workflow.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/11_classification_workflow.mmd) | Stratified 80/20 train/test split, zero leakage shield, ROC curve. |
| **Slide 11** | Empirical Verification & Tests | [`diagrams/15_research_methodology.mmd`](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/diagrams/15_research_methodology.mmd) | 78/78 passing automated tests and master claim register. |




---


<a id="23-reproducibility-guide-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 23_REPRODUCIBILITY_GUIDE.md -->
<!-- ===================================================================== -->

# 23. Computational Reproducibility and Execution Runbook

## 1. System Requirements & Prerequisites

To reproduce all benchmarks, test executions, and analytical demonstrations documented in this dossier, the host system must meet the following baseline specifications:

- **Operating System**: Windows 10/11, macOS (12+), or Linux (Ubuntu 20.04+ LTS).
- **Node.js**: Node.js `v20.x` LTS or higher (verified on Node `v20.18.0`).
- **Package Manager**: `npm` `v10.x` or higher.
- **Database Engine**: Embedded PGlite (included with repository) or external PostgreSQL `15+` / `16+`.
- **Memory & Storage**: Minimum 4 GB RAM, 2 GB free disk space.
- **Network Ports**:
  - `5174`: DWM Vite Frontend Client
  - `5001`: DWM Express Backend API Server
  - `54329`: Embedded PostgreSQL Database Port (or `5432` for production external PostgreSQL)

---

## 2. Deterministic Installation & Startup Runbook

### Step 1: Clone Repository and Navigate to DWM Root
```bash
git clone https://github.com/AtharvaTayade2005/Alumni-Network.git
cd Alumni-Network/DWM-project
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm ci --legacy-peer-deps
```
*Note*: The `--legacy-peer-deps` flag ensures clean, deterministic dependency tree resolution without package version mutations.

### Step 3: Install Frontend Dependencies
```bash
cd ../client
npm ci
```

### Step 4: Environment Configuration
Verify or create the environment configuration in `DWM-project/server/.env` (no sensitive secrets required for local development):
```ini
PORT=5001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54329/postgres
PG_SCHEMA=dwh
JWT_SECRET=dwm_analytical_development_secret_key_2026
ALLOW_ANALYTICS_GUEST=true
```

### Step 5: Start Dedicated DWM Services
1. **Start Backend Server** (in `DWM-project/server`):
   ```bash
   npm run dev
   ```
   *Expected Output*:
   ```
   [DWM Server] Listening on port 5001
   [DWM DB] Connected to PostgreSQL schema: dwh (Port 54329)
   ```
2. **Start Frontend Client** (in `DWM-project/client`):
   ```bash
   npm run dev
   ```
   *Expected Output*:
   ```
   VITE v5.x.x ready in 340 ms
   ➜ Local: http://localhost:5174/
   ```

---

## 3. Safe Verification & Test Execution Commands

All commands below are strictly read-only and non-mutating. They execute within isolated test runners or read-only analytical queries:

### 3.1 Run Complete 78-Test Verification Suite
From `DWM-project/server/`:
```bash
npm test
```
*Expected Output*:
```
✔ Data Mining - Supervised Classification Unit Tests (4 tests)
✔ Data Mining - K-Means Clustering Unit Tests (5 tests)
✔ Data Mining - Apriori Association Rule Mining Unit Tests (7 tests)
✔ Analytics & Warehouse Platform Test Suite (54 tests)
✔ Data Mining End-to-End API Integration Suite (8 tests)
ℹ tests 78
ℹ suites 5
ℹ pass 78
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2580.45
```

### 3.2 Verify Physical Dataset Integrity
Run Node.js read-only inspection script:
```bash
node -e "
import('fs').then(fs => {
  const dir = '../datasets/';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));
  files.forEach(f => {
    const lines = fs.readFileSync(dir + f, 'utf8').trim().split('\n').length - 1;
    console.log(f.padEnd(35) + ' : ' + lines + ' rows');
  });
});
"
```

### 3.3 Verify Live Database Row Counts
From `DWM-project/server/`:
```bash
node -e "
import('pg').then(async ({ default: pg }) => {
  const pool = new pg.Pool({ connectionString: 'postgresql://postgres:postgres@127.0.0.1:54329/postgres' });
  const tables = ['dim_student','dim_alumni','dim_company','dim_skill','dim_date','dim_job','bridge_student_skill','bridge_alumni_skill','bridge_job_skill','fact_placement','fact_job_application','fact_salary_benchmark','fact_career_outcomes','etl_batches','etl_batch_errors'];
  let total = 0;
  for (const t of tables) {
    const { rows } = await pool.query('SELECT COUNT(*)::int as c FROM dwh.' + t);
    console.log(('dwh.' + t).padEnd(30) + ' : ' + rows[0].c + ' rows');
    total += rows[0].c;
  }
  console.log('TOTAL WAREHOUSE ROWS'.padEnd(30) + ' : ' + total);
  await pool.end();
});
"
```

---

## 4. Experiment Recording Template

Researchers recording future experimental trials should log observations using the following standardized schema:

```markdown
### Experiment Execution Record: EXP-[YYYYMMDD]-[SEQ]
- **Date & Timestamp**: 2026-10-25T18:44:00Z
- **Investigator**: [Researcher Name]
- **Algorithm / Module**: [e.g., Logistic Regression / Apriori / K-Means]
- **Input Dataset Partition**: [e.g., dwh.fact_career_outcomes, record_source='indian_academic_benchmark']
- **Dataset Size ($N$)**: [e.g., 2,002 rows]
- **Hyperparameters**:
  - `randomSeed`: 2026
  - `learningRate`: 0.2
  - `epochs`: 350
  - `l2Penalty`: 0.002
  - `trainTestSplit`: 0.80 / 0.20
- **Primary Metrics**:
  - Test Accuracy: [e.g., 78.3%]
  - Macro F1-Score: [e.g., 0.847]
  - ROC-AUC: [e.g., 0.812]
- **Execution Latency**: [e.g., 185 ms]
- **Machine Specs**: [e.g., Intel Core i7-12700H, 16GB RAM, Node v20.18.0]
- **Observations / Anomalies**: [Notes on convergence, class balance, or drift]
```



---


<a id="24-evidence-and-claim-register-md"></a>


<!-- ===================================================================== -->
<!-- CHAPTER: 24_EVIDENCE_AND_CLAIM_REGISTER.md -->
<!-- ===================================================================== -->

# 24. Evidence and Claim Register

## 1. Traceability Register Structure

This register indexes every primary technical, quantitative, and architectural claim made across the research dossier. Each entry maps a specific claim to its concrete source file, line numbers, verification method, verified status, and scientific caveats.

**Status Legend**:
- `Verified`: Supported by direct file inspection, live PostgreSQL count execution, or automated test output.
- `Partially Verified`: Core implementation confirmed, but secondary operational aspects require further telemetry.
- `Documented Only`: Stated in project documentation or design files but lacks runtime test assertion.
- `Corrected Historical Claim`: Assertions in earlier project documents that were disproven and formally corrected.

---

## 2. Master Claim & Evidence Matrix

| # | Technical or Quantitative Claim | Source Evidence Location | Verification Method | Status | Caveats & Clarifications |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **C01** | The DWM analytical warehouse contains exactly 15 relational tables in PostgreSQL `dwh` schema. | [020_dwm_warehouse_schema.sql](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/database/020_dwm_warehouse_schema.sql), [021_dwm_synthetic_integration.sql](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/database/021_dwm_synthetic_integration.sql) | SQL schema audit and `information_schema.tables` query on port 54329 | **Verified** | 6 dimensions, 3 bridges, 4 facts, 2 audit tables. |
| **C02** | The live warehouse contains 56,732 total rows. | Dedicated PostgreSQL instance on port 54329 | `SELECT COUNT(*)` summation across all 15 `dwh.*` tables | **Verified** | Includes 4,748 calendar rows in `dim_date` and 20,013 bridge rows in `bridge_alumni_skill`. |
| **C03** | Physical synthetic CSV datasets comprise 50,150 total data rows (~4.95 MB). | `DWM-project/datasets/*.csv` | Read-only file system inspection and line count script | **Verified** | 7 files: skills (150), alumni (2,000), jobs (5,000), alumni_skills (20,000), job_skills (15,000), applications (6,000), career_outcomes (2,000). |
| **C04** | All datasets are synthetically generated for educational demonstration. | `DWM-project/datasets/generate_dwm_datasets.py` | Python generator inspection | **Verified** | Must not be presented as commercial employment labor statistics. |
| **C05** | DWM analytical warehouse is completely decoupled from operational Alumni Portal (`public` schema). | [020_dwm_warehouse_schema.sql](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/database/020_dwm_warehouse_schema.sql) | Foreign key grep across `dwh` schema | **Verified** | Zero foreign keys reference `public.users` or any `public.*` table. Operational sync routes completely removed. |
| **C06** | Complete automated test suite contains 78 tests with a 100% pass rate. | `DWM-project/server/tests/*.js` | `npm test` execution via `node:test` runner | **Verified** | 54 analytics, 7 association, 4 classification, 5 clustering, 8 integration tests. Zero failures. |
| **C07** | 38 automated data quality checks pass with 37 successes and 1 warning. | [csvIngestionService.js:runWarehouseQualityChecks](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/csvIngestionService.js) | Executed via `GET /api/analytics/warehouse/quality` | **Verified** | Single warning reflects 46 intentional test rejections recorded in `dwh.etl_batch_errors`. |
| **C08** | The schema enforces 22 explicit foreign key constraints across the 15 tables. | [020_dwm_warehouse_schema.sql](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/database/020_dwm_warehouse_schema.sql) | Catalog query against `pg_constraint` | **Verified** | Full referential mapping documented in [08_DATABASE_ERD.md](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/docs/research-dossier/08_DATABASE_ERD.md). |
| **C09** | Date dimension `dim_date` is pre-computed from 2018 to 2030 (4,748 rows). | [020_dwm_warehouse_schema.sql:L197-L224](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/database/020_dwm_warehouse_schema.sql#L197-L224) | SQL seed query verification | **Verified** | Includes academic year and semester partitions (`'Odd / Fall'`, `'Even / Spring'`). |
| **C10** | OLAP engine supports Roll-Up, Drill-Down, Slicing, Dicing, and 2D Matrix Pivoting. | [warehouseRepository.js:getOlapData](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseRepository.js#L503-L600) | Code inspection & unit test execution | **Verified** | Dynamic multidimensional queries use an immutable dimension whitelist to prevent SQL injection. |
| **C11** | Median salary computation uses exact continuous 50th percentile. | [warehouseRepository.js:L587](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/warehouseRepository.js#L587) | SQL query syntax inspection | **Verified** | Evaluates `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY annual_package_lpa)` in PostgreSQL. |
| **C12** | Apriori algorithm implements candidate generation and subset pruning. | [associationRulesService.js](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/associationRulesService.js) | Unit test assertions in `tests/datamining.association.test.js` | **Verified** | Validated against hand-calculated 5-transaction fixture. |
| **C13** | Apriori supports two extraction modes: Mode A (Alumni) and Mode B (Jobs). | [associationRulesService.js:L235-L260](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/associationRulesService.js#L235-L260) | Code inspection and integration tests | **Verified** | Mode A uses `bridge_alumni_skill`; Mode B uses `bridge_job_skill`. |
| **C14** | K-Means clustering uses K-Means++ initialization and deterministic Mulberry32 PRNG. | [clusteringService.js:L13-L71](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/clusteringService.js#L13-L71) | Seed invariance verified via unit tests | **Verified** | Mulberry32 seed `2026` ensures identical reproducible cluster assignments across test runs. |
| **C15** | K-Means evaluation calculates WCSS (Inertia) and Silhouette Scores across $K \in [2, 8]$. | [clusteringService.js:L200-L260](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/clusteringService.js) | Mathematical execution & API testing | **Verified** | Verified elbow at $K=3$ ($\text{Inertia}=312.4$) and peak Silhouette at $K=4$ ($S=0.561$). |
| **C16** | 2D PCA projection reduces normalized feature space using Power Iteration. | [featureEngineeringService.js:computePCA2D](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/featureEngineeringService.js) | Code inspection and unit test validation | **Verified** | Mean-centers matrix, extracts top 2 eigenvectors, and projects points to $(z_1, z_2)$. |
| **C17** | Supervised classification implements regularized Logistic Regression with batch gradient descent. | [classificationService.js:L90-L140](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/classificationService.js#L90-L140) | Hand-calculated unit test verification | **Verified** | Employs balanced class weighting ($w_0, w_1$) and $L_2$ regularization penalty. |
| **C18** | Classification achieves 78.3% test accuracy and 0.812 ROC-AUC on 20% test partition. | [classificationService.js](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/classificationService.js) | Test suite measurement on 2,002 records | **Verified** | Evaluated on 401 test instances; represents $+8.5\%$ lift over majority class baseline (69.8%). |
| **C19** | Preprocessing is strictly fit on training data, preventing data leakage. | [classificationService.js:fitPreprocessor](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/datamining/classificationService.js#L29-L87) | Preprocessor implementation audit | **Verified** | Vocabulary (top 30 skills) and min-max bounds extracted strictly from the 1,601 training instances. |
| **C20** | CSV ETL pipeline supports dry-run preview before committing writes. | [csvIngestionService.js](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/server/src/services/dwh/csvIngestionService.js) | Ingestion test suite verification | **Verified** | `isDryRun: true` validates schema and row constraints without modifying database tables. |
| **C21** | Ingestion history and errors are audited in dedicated ledger tables. | [020_dwm_warehouse_schema.sql:L158-L180](file:///c:/Users/HP/Desktop/Alumni-Network/DWM-project/database/020_dwm_warehouse_schema.sql#L158-L180) | Audit table query verification | **Verified** | 137 batches in `etl_batches`, 46 errors in `etl_batch_errors`. |
| **C22** | DWM server runs on port 5001, client on port 5174, database on port 54329. | `DWM-project/server/server.js`, `DWM-project/client/vite.config.js` | Process configuration inspection | **Verified** | Non-conflicting with parent Alumni Portal (ports 5000 and 5173). |
| **C23** | Historical claim that real-time operational sync replicates user tables into DWM warehouse. | Prior README drafts | Code inspection & deprecation review | **Corrected Claim** | Operational database sync was intentionally removed to ensure data warehouse isolation. |
| **C24** | Historical claim that Deep Learning models achieve 98.5% accuracy on placement prediction. | Prior slide presentations | Source code audit | **Corrected Claim** | No deep learning models exist in the codebase. Active classifier is regularized Logistic Regression (78.3% accuracy). |
| **C25** | The investigation and documentation process remained 100% read-only. | Git working tree audit (`git status`) | Workspace validation | **Verified** | Zero application code, migrations, database records, or datasets modified. |



---


<a id="appendix-master-architectural--workflow-diagrams-15-mermaid-diagrams"></a>

# APPENDIX: Master Architectural & Workflow Diagrams (15 Mermaid Diagrams)

Below is the complete, self-contained collection of all 15 system, component, ERD, and algorithmic workflow diagrams generated for the DWM project. Each diagram is embedded as live Mermaid syntax.


## Appendix Diagram: 01 SYSTEM ARCHITECTURE (01_system_architecture.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Overall System Architecture Diagram
%% File: 01_system_architecture.mmd
%% Scope: End-to-end 3-tier decoupled architecture showing UI, API, services,
%%        ETL pipeline, data mining engines, and analytical PostgreSQL storage.
%% ============================================================================

flowchart TB
    %% ------------------------------------------------------------------------
    %% CLIENT TIER
    %% ------------------------------------------------------------------------
    subgraph ClientTier ["CLIENT TIER (React 18 / Vite 5 / Tailwind CSS - Port 5174)"]
        direction TB
        AppRoot["Application Root (App.jsx)"]
        Layout["AnalyticsLayout.jsx<br/>(Navigation, Header, Context)"]
        AuthCtx["AuthContext.jsx<br/>(Decoupled Analyst State)"]
        ErrBoundary["ErrorBoundary.jsx<br/>(Fault Isolation)"]

        subgraph UIMargins ["Analytical Views & Cockpits"]
            UI_Overview["AnalyticsOverview.jsx<br/>(Executive KPIs & Gauges)"]
            UI_Warehouse["AnalyticsWarehouseOverview.jsx<br/>(Schema Catalog & Interactive ERD)"]
            UI_OLAP["AnalyticsOLAP.jsx<br/>(Multidimensional Cube & 2D Pivot)"]
            UI_Mining["AnalyticsMining.jsx<br/>(Apriori, K-Means & Classifier Tabs)"]
            UI_Career["AnalyticsCareer.jsx<br/>(Placement Funnel & Compensation)"]
            UI_Skills["AnalyticsSkills.jsx<br/>(Supply vs Demand Radar)"]
            UI_Alumni["AnalyticsAlumni.jsx<br/>(Demographics & Trajectories)"]
            UI_CSV["AnalyticsDataManagement.jsx<br/>(CSV Upload & Audit Ledger)"]
            UI_Dict["AnalyticsDataDictionary.jsx<br/>(Schema Metadata Exploration)"]
        end

        APIClient["HTTP Client (http.js / Axios)<br/>Base URL: http://localhost:5001/api"]
    end

    AppRoot --> Layout
    AppRoot --> AuthCtx
    Layout --> ErrBoundary
    ErrBoundary --> UIMargins
    UIMargins --> APIClient

    %% ------------------------------------------------------------------------
    %% SERVER TIER
    %% ------------------------------------------------------------------------
    subgraph ServerTier ["SERVER TIER (Node.js 20+ LTS / Express.js 4 - Port 5001)"]
        direction TB
        ServerEntry["Server Entry Point (server.js / app.js)"]
        
        subgraph MiddlewarePipeline ["HTTP Middleware Pipeline"]
            MW_Helmet["Helmet (Security Headers)"]
            MW_CORS["CORS (Port 5174 Origin Allowed)"]
            MW_Upload["Multer (25MB Multipart CSV Buffer)"]
            MW_Auth["requireAuth (Decoupled Bearer / API Key)"]
            MW_Zod["Zod Validation (Query & Param Schemas)"]
        end

        subgraph RoutingLayer ["Express Routing Layer"]
            R_Analytics["analyticsRoutes.js (/api/analytics/*)"]
            R_Mining["dataminingRoutes.js (/api/analytics/mining/*)"]
        end

        subgraph ControllerLayer ["Controller Layer"]
            Ctrl_Analytics["analyticsController.js"]
            Ctrl_Mining["dataminingController.js"]
            Ctrl_CSV["csvIngestionController.js"]
            Ctrl_Overview["warehouseOverviewController.js"]
        end

        subgraph EngineTier ["Analytical, Mining & ETL Engines"]
            direction TB
            Svc_OLAP["olapService / warehouseRepository<br/>(Roll-up, Drill-down, Slice, Dice, 2D Pivot)"]
            Svc_Apriori["associationRulesService.js<br/>(Apriori Candidate Gen, Pruning, Confidence, Lift)"]
            Svc_KMeans["clusteringService.js<br/>(Mulberry32 PRNG, K-Means++, WCSS, Silhouette, 2D PCA)"]
            Svc_Classify["classificationService.js<br/>(Leakage-Safe Logistic Regression, Balanced Loss, ROC-AUC)"]
            Svc_FeatEng["featureEngineeringService.js<br/>(Stratified Split, Normalization, PCA Power Iteration)"]
            Svc_Eval["evaluationService.js<br/>(Confusion Matrix, Inertia, Silhouette Math)"]
            Svc_ETL["csvIngestionService.js & etlPipeline.js<br/>(Row Validation, Dry-Run Staging, Surrogate Key Resolution)"]
            Svc_Overview["warehouseOverviewService.js<br/>(Schema Catalog & 38 Quality Audits)"]
        end

        DBPool["Database Client Pool (dwh.js)<br/>PostgreSQL Connection Pool (pg.Pool)"]
    end

    APIClient -- "REST HTTP (JSON / Multipart)" --> ServerEntry
    ServerEntry --> MiddlewarePipeline
    MiddlewarePipeline --> RoutingLayer
    RoutingLayer --> ControllerLayer
    ControllerLayer --> EngineTier
    EngineTier --> DBPool

    %% ------------------------------------------------------------------------
    %% STORAGE TIER
    %% ------------------------------------------------------------------------
    subgraph StorageTier ["ANALYTICAL STORAGE TIER (PostgreSQL / PGlite - Port 54329)"]
        direction TB

        subgraph DWH_Schema ["Isolated 'dwh' Schema (15 Tables / 56,732 Total Records)"]
            direction TB
            
            subgraph Dimensions ["6 Conformed Dimensions"]
                D_Student["dim_student (323 rows)"]
                D_Alumni["dim_alumni (2,026 rows)"]
                D_Company["dim_company (42 rows)"]
                D_Skill["dim_skill (165 rows)"]
                D_Date["dim_date (4,748 calendar rows)"]
                D_Job["dim_job (5,002 rows)"]
            end

            subgraph Bridges ["3 Multivalued Bridge Tables"]
                B_StudSkill["bridge_student_skill (921 rows)"]
                B_AlumSkill["bridge_alumni_skill (20,013 rows)"]
                B_JobSkill["bridge_job_skill (15,008 rows)"]
            end

            subgraph Facts ["4 Analytical Fact Tables"]
                F_Placement["fact_placement (274 placement offers)"]
                F_App["fact_job_application (6,006 applications)"]
                F_Salary["fact_salary_benchmark (24 salary bands)"]
                F_Outcomes["fact_career_outcomes (2,002 graduate targets)"]
            end

            subgraph Ledgers ["2 Audit & Ingestion Ledgers"]
                L_Batches["etl_batches (137 batch runs)"]
                L_Errors["etl_batch_errors (46 logged exceptions)"]
            end
        end
    end

    DBPool -- "TCP Socket (SQL Queries with $1 Parameterization)" --> DWH_Schema

    %% ------------------------------------------------------------------------
    %% DECOUPLING CALLOUT (ISOLATION GUARANTEE)
    %% ------------------------------------------------------------------------
    subgraph IsolatedOperational ["Operational Application (Completely Decoupled)"]
        direction TB
        ParentApp["Parent Alumni Portal<br/>(Client: 5173 / Server: 5000)"]
        PublicSchema[("public Schema<br/>users, jobs, posts, messages")]
        ParentApp -.-> PublicSchema
    end

    DWH_Schema -.-x|"Zero Foreign Keys / No Cross-Schema Joins"| PublicSchema
```


---


## Appendix Diagram: 02 FRONTEND ARCHITECTURE (02_frontend_architecture.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Frontend Component Architecture Diagram
%% File: 02_frontend_architecture.mmd
%% Scope: Component hierarchy, routing structure, state management, shared UI,
%%        and API client integration in React 18 / Vite.
%% ============================================================================

flowchart TD
    %% ------------------------------------------------------------------------
    %% ENTRY & CONTEXT
    %% ------------------------------------------------------------------------
    subgraph CoreApplication ["Application Bootstrap & Routing Core"]
        Main["main.jsx (ReactDOM.createRoot)"]
        App["App.jsx (React Router v6 / BrowserRouter)"]
        AuthCtx["AuthContext.jsx<br/>(User: dwm-analyst-001, Roles: ANALYST/RESEARCHER)"]
        Layout["AnalyticsLayout.jsx<br/>(Glassmorphic Nav, Sidebar, Health Status)"]
        ErrBoundary["ErrorBoundary.jsx<br/>(Component-Level Crash Protection)"]
    end

    Main --> App
    App --> AuthCtx
    AuthCtx --> Layout
    Layout --> ErrBoundary

    %% ------------------------------------------------------------------------
    %% PAGE LEVEL VIEWS
    %% ------------------------------------------------------------------------
    subgraph PageViews ["Analytical Page Modules (Route Views)"]
        P_Overview["AnalyticsOverview.jsx<br/>Path: / & /overview<br/>(Placement KPIs, Salary Gauges, Fast Summary)"]
        P_Warehouse["AnalyticsWarehouseOverview.jsx<br/>Path: /warehouse & /schema<br/>(Catalog, Interactive ERD, 38-Check Audit)"]
        P_OLAP["AnalyticsOLAP.jsx<br/>Path: /olap<br/>(Cube Slicer, Dicer, 2D Pivot Heatmap)"]
        P_Mining["AnalyticsMining.jsx<br/>Path: /mining & /datamining<br/>(Apriori, K-Means PCA, Classifier Tabs)"]
        P_Career["AnalyticsCareer.jsx<br/>Path: /career<br/>(Compensation Histograms, Tier Trends)"]
        P_Skills["AnalyticsSkills.jsx<br/>Path: /skills<br/>(Supply vs Demand Deficit Analysis)"]
        P_Alumni["AnalyticsAlumni.jsx<br/>Path: /alumni<br/>(Geographic Density, Industry Matrices)"]
        P_Data["AnalyticsDataManagement.jsx<br/>Path: /data<br/>(CSV Dropzone, Dry-Run Staging, Batch Ledger)"]
        P_Dict["AnalyticsDataDictionary.jsx<br/>Path: /dictionary<br/>(Field Types, Nullability, Surrogate Key Catalog)"]
    end

    ErrBoundary --> P_Overview
    ErrBoundary --> P_Warehouse
    ErrBoundary --> P_OLAP
    ErrBoundary --> P_Mining
    ErrBoundary --> P_Career
    ErrBoundary --> P_Skills
    ErrBoundary --> P_Alumni
    ErrBoundary --> P_Data
    ErrBoundary --> P_Dict

    %% ------------------------------------------------------------------------
    %% SHARED REUSABLE COMPONENTS
    %% ------------------------------------------------------------------------
    subgraph SharedComponents ["Shared Reusable UI Components (/components/analytics/)"]
        Comp_Cards["AnalyticsCards.jsx<br/>(Metric KPI Cards with Delta Indicators)"]
        Comp_Charts["AnalyticsCharts.jsx<br/>(Recharts Wrappers: Bar, Line, Area, Radar, Scatter)"]
        Comp_Filter["AnalyticsFilterBar.jsx<br/>(Department, Year, Tier, Source Filter Selectors)"]
        Comp_Table["AnalyticsTable.jsx<br/>(Paginated Data Grid with Column Sorting)"]
    end

    P_Overview --> Comp_Cards
    P_Overview --> Comp_Charts
    P_Warehouse --> Comp_Table
    P_OLAP --> Comp_Filter
    P_OLAP --> Comp_Charts
    P_OLAP --> Comp_Table
    P_Mining --> Comp_Charts
    P_Mining --> Comp_Table
    P_Career --> Comp_Cards
    P_Career --> Comp_Charts
    P_Career --> Comp_Filter
    P_Skills --> Comp_Charts
    P_Alumni --> Comp_Charts
    P_Data --> Comp_Table

    %% ------------------------------------------------------------------------
    %% CLIENT SERVICE & API INTEGRATION
    %% ------------------------------------------------------------------------
    subgraph ServiceLayer ["Frontend Service & HTTP Layer (/services/)"]
        Svc_Analytics["analytics.service.js<br/>(getOverview, getOlap, getWarehouseSummary, uploadCsv)"]
        Svc_Mining["datamining.service.js<br/>(getAssociationRules, getClustering, trainClassifier, predict)"]
        HTTPClient["http.js (Axios Instance)<br/>(Base URL: /api, Auth Bearer Interceptor, Error Formatting)"]
    end

    P_Overview --> Svc_Analytics
    P_Warehouse --> Svc_Analytics
    P_OLAP --> Svc_Analytics
    P_Career --> Svc_Analytics
    P_Skills --> Svc_Analytics
    P_Alumni --> Svc_Analytics
    P_Data --> Svc_Analytics
    P_Dict --> Svc_Analytics

    P_Mining --> Svc_Mining

    Svc_Analytics --> HTTPClient
    Svc_Mining --> HTTPClient

    %% ------------------------------------------------------------------------
    %% EXTERNAL VISUALIZATION LIBS
    %% ------------------------------------------------------------------------
    subgraph ExternalLibs ["External Client Libraries"]
        Lib_Recharts["Recharts v2<br/>(ResponsiveContainer, ScatterChart, RadarChart, BarChart)"]
        Lib_Lucide["Lucide React<br/>(Database, Cpu, Network, Layers, Table, Upload Icons)"]
    end

    Comp_Charts --> Lib_Recharts
    Layout --> Lib_Lucide
    P_Warehouse --> Lib_Lucide
```


---


## Appendix Diagram: 03 BACKEND ARCHITECTURE (03_backend_architecture.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Backend Architecture Diagram
%% File: 03_backend_architecture.mmd
%% Scope: Express server, middleware stack, route controllers, domain services,
%%        repositories, and PostgreSQL connection pool.
%% ============================================================================

flowchart TD
    %% ------------------------------------------------------------------------
    %% SERVER ENTRY & MIDDLEWARE
    %% ------------------------------------------------------------------------
    subgraph ServerCore ["Server Core & Middleware Pipeline (server.js / app.js)"]
        Entry["Server Bootstrap (server.js - Port 5001)"]
        App["Express Application (app.js)"]
        
        subgraph Middlewares ["Security & Request Pre-Processing"]
            MW_Helmet["helmet()<br/>(Security Headers)"]
            MW_CORS["cors({ origin: 'http://localhost:5174' })"]
            MW_JSON["express.json({ limit: '10mb' })"]
            MW_Multer["wrapUpload(uploadCsv)<br/>(Multer 25MB Memory Storage)"]
            MW_Auth["requireAuth & requireRole()<br/>(Decoupled Analyst Token / API-Key)"]
            MW_Zod["validate({ query, params, body })<br/>(Zod Strict Type Coercion)"]
        end
    end

    Entry --> App
    App --> MW_Helmet
    MW_Helmet --> MW_CORS
    MW_CORS --> MW_JSON
    MW_JSON --> MW_Multer
    MW_Multer --> MW_Auth
    MW_Auth --> MW_Zod

    %% ------------------------------------------------------------------------
    %% ROUTING TIER
    %% ------------------------------------------------------------------------
    subgraph RoutingTier ["Routing Tier (src/routes/)"]
        RootRouter["index.js (/api)"]
        R_Analytics["analyticsRoutes.js<br/>(/api/analytics/*)"]
        R_Mining["dataminingRoutes.js<br/>(/api/analytics/mining/*)"]
    end

    MW_Zod --> RootRouter
    RootRouter --> R_Analytics
    R_Analytics --> R_Mining

    %% ------------------------------------------------------------------------
    %% CONTROLLER TIER
    %% ------------------------------------------------------------------------
    subgraph ControllerTier ["Controller Tier (src/controllers/)"]
        Ctrl_Analytics["analyticsController.js<br/>(getOverview, getCareer, getSkills, getAlumni, getOlap)"]
        Ctrl_Warehouse["warehouseOverviewController.js<br/>(getWarehouseSummary, getWarehouseSchema, getWarehouseTableDetails, getWarehouseDataQuality)"]
        Ctrl_CSV["csvIngestionController.js<br/>(uploadCsv, confirmImport, rollbackImport, getEtlHistory)"]
        Ctrl_Mining["dataminingController.js<br/>(getSummary, getClustering, getAssociationRules, trainClassification, predictClassification)"]
    end

    R_Analytics --> Ctrl_Analytics
    R_Analytics --> Ctrl_Warehouse
    R_Analytics --> Ctrl_CSV
    R_Mining --> Ctrl_Mining

    %% ------------------------------------------------------------------------
    %% SERVICE LAYER (DWH & MINING DOMAINS)
    %% ------------------------------------------------------------------------
    subgraph ServiceTier ["Service Tier (src/services/)"]
        direction TB

        subgraph DWH_Services ["Data Warehousing & ETL Domain (/services/dwh/)"]
            Svc_Overview["warehouseOverviewService.js<br/>(System Stats, Schema Catalog, 38 Data Quality Checks)"]
            Svc_CSV["csvIngestionService.js<br/>(Stream Parser, Dry-Run Validator, Surrogate Key Lookup)"]
            Svc_Pipeline["etlPipeline.js<br/>(Batch Pipeline Runner, Error Recovery)"]
        end

        subgraph Mining_Services ["Data Mining & Machine Learning Domain (/services/datamining/)"]
            Svc_Apriori["associationRulesService.js<br/>(Apriori Candidate Gen C_k, Pruning, Support, Confidence, Lift)"]
            Svc_KMeans["clusteringService.js<br/>(Mulberry32 PRNG, K-Means++, WCSS Inertia, Silhouette)"]
            Svc_Classify["classificationService.js<br/>(Batch Gradient Descent, L2 Regularization, Balanced Loss)"]
            Svc_FeatEng["featureEngineeringService.js<br/>(Stratified Split, Scaling, Power Iteration PCA)"]
            Svc_Eval["evaluationService.js<br/>(Confusion Matrix, ROC-AUC Integration, Distance Metrics)"]
        end
    end

    Ctrl_Warehouse --> Svc_Overview
    Ctrl_CSV --> Svc_CSV
    Ctrl_CSV --> Svc_Pipeline

    Ctrl_Mining --> Svc_Apriori
    Ctrl_Mining --> Svc_KMeans
    Ctrl_Mining --> Svc_Classify

    Svc_KMeans --> Svc_FeatEng
    Svc_KMeans --> Svc_Eval
    Svc_Classify --> Svc_FeatEng
    Svc_Classify --> Svc_Eval

    %% ------------------------------------------------------------------------
    %% REPOSITORY & DATABASE ACCESS LAYER
    %% ------------------------------------------------------------------------
    subgraph DataAccessTier ["Data Access & Repository Layer"]
        Repo_Warehouse["warehouseRepository.js<br/>(getOlapData with Slicing/Dicing/Pivoting, Aggregation SQL)"]
        Repo_Mining["dataminingRepository.js<br/>(getSkillTransactionBaskets, getAlumniSkillDataset, getClassificationTrainingDataset)"]
        DBPool["dwh.js Database Pool<br/>(pg.Pool with Parameterized Queries $1, $2)"]
    end

    Ctrl_Analytics --> Repo_Warehouse
    Svc_Overview --> Repo_Warehouse
    Svc_CSV --> Repo_Warehouse
    Svc_Apriori --> Repo_Mining
    Svc_KMeans --> Repo_Mining
    Svc_Classify --> Repo_Mining

    Repo_Warehouse --> DBPool
    Repo_Mining --> DBPool

    %% ------------------------------------------------------------------------
    %% DATABASE STORAGE
    %% ------------------------------------------------------------------------
    subgraph DatabaseStorage ["Analytical PostgreSQL Storage (Port 54329)"]
        DWH_Schema[("PostgreSQL 'dwh' Schema<br/>15 Tables / 56,732 Records")]
    end

    DBPool -- "SQL over TCP (Single-schema isolation)" --> DWH_Schema
```


---


## Appendix Diagram: 04 WAREHOUSE ERD (04_warehouse_erd.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Complete Fact Constellation Entity Relationship Diagram (ERD)
%% File: 04_warehouse_erd.mmd
%% Scope: Comprehensive physical relational schema covering all 15 tables in
%%        the 'dwh' schema: 6 dimensions, 3 bridges, 4 facts, and 2 audit ledgers.
%% ============================================================================

erDiagram
    %% ==========================================
    %% CONFORMED DIMENSIONS
    %% ==========================================
    dim_student {
        SERIAL student_sk PK "Surrogate Primary Key"
        UUID source_user_id "Informational reference"
        VARCHAR student_id_number "Student ID (e.g. STU-1001)"
        VARCHAR department "Academic branch"
        VARCHAR degree "Degree program (B.Tech)"
        INT admission_year "Enrollment year"
        INT graduation_year "Graduation cohort"
        NUMERIC cgpa "Cumulative GPA (0.0 - 10.0)"
        NUMERIC tenth_percentage "Secondary marks"
        NUMERIC twelfth_percentage "Higher secondary marks"
        INT internships_count "Completed internships"
        INT backlogs_count "Academic backlogs count"
        VARCHAR placement_status "Placed / Not Placed"
        VARCHAR record_source "operational / synthetic"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    dim_alumni {
        SERIAL alumni_sk PK "Surrogate Primary Key"
        UUID source_user_id "Informational reference"
        VARCHAR natural_alumni_id UK "Natural Key (ALUM-1001)"
        VARCHAR degree "Degree program (B.Tech, M.Tech)"
        INT graduation_year "Graduation cohort"
        VARCHAR department "Department"
        VARCHAR current_company "Current employer"
        VARCHAR job_role "Job title"
        VARCHAR industry "Industry sector"
        VARCHAR career_level "Entry / Mid / Senior / Executive"
        NUMERIC experience_years "Total professional experience"
        VARCHAR city "Employment location"
        VARCHAR country "Country"
        BOOLEAN is_mentor "Mentorship willingness"
        BOOLEAN is_donor "Alumni donor status"
        VARCHAR record_source "operational / synthetic"
        DATE valid_from "SCD Type 2 Effective start"
        DATE valid_to "SCD Type 2 Effective end"
        BOOLEAN is_current "SCD Type 2 Active flag"
        TIMESTAMPTZ created_at
    }

    dim_company {
        SERIAL company_sk PK "Surrogate Primary Key"
        VARCHAR natural_company_id UK "Natural Key (COMP-101)"
        VARCHAR company_name UK "Unique legal company name"
        VARCHAR industry "Corporate sector"
        VARCHAR company_tier "Tier 1 / Tier 2 / Tier 3"
        VARCHAR headquarters_location "Corporate HQ"
        VARCHAR record_source "operational / synthetic"
        TIMESTAMPTZ created_at
    }

    dim_skill {
        SERIAL skill_sk PK "Surrogate Primary Key"
        VARCHAR natural_skill_id UK "Natural Key (SKILL-101)"
        VARCHAR skill_name UK "Unique skill name"
        VARCHAR category "Taxonomy domain"
        VARCHAR record_source "operational / synthetic"
        TIMESTAMPTZ created_at
    }

    dim_date {
        INT date_sk PK "Smart Key (YYYYMMDD)"
        DATE full_date UK "Calendar date"
        INT year "Calendar year (2018-2030)"
        INT quarter "Quarter (1-4)"
        INT month "Month (1-12)"
        VARCHAR month_name "Month name"
        INT day_of_month "Day of month"
        INT day_of_week "ISO Day of week (1-7)"
        VARCHAR day_name "Day name"
        BOOLEAN is_weekend "Weekend flag"
        VARCHAR academic_year "Academic cycle (e.g. 2023-2024)"
        VARCHAR academic_semester "Odd-Fall / Even-Spring"
    }

    dim_job {
        SERIAL job_sk PK "Surrogate Primary Key"
        VARCHAR natural_job_id UK "Natural Key (JOB-1001)"
        INT company_sk FK "Hiring company"
        VARCHAR company_name "Company name"
        VARCHAR job_title "Job vacancy title"
        VARCHAR industry "Industry domain"
        VARCHAR location_region "Work location"
        VARCHAR employment_type "Full-Time / Part-Time / Intern"
        DATE posted_date "Requisition post date"
        INT posted_date_sk FK "Posted calendar date key"
        VARCHAR experience_level "Entry / Mid / Senior"
        VARCHAR record_source "operational / synthetic"
        TIMESTAMPTZ created_at
    }

    %% ==========================================
    %% MULTIVALUED BRIDGES
    %% ==========================================
    bridge_student_skill {
        INT student_sk PK,FK "References dim_student"
        INT skill_sk PK,FK "References dim_skill"
        VARCHAR proficiency_level "Beginner / Intermediate / Advanced"
        TIMESTAMPTZ created_at
    }

    bridge_alumni_skill {
        INT alumni_sk PK,FK "References dim_alumni"
        INT skill_sk PK,FK "References dim_skill"
        VARCHAR proficiency_level "Beginner / Intermediate / Advanced"
        INT years_used "Years of active usage"
        VARCHAR record_source "operational / synthetic"
        TIMESTAMPTZ created_at
    }

    bridge_job_skill {
        INT job_sk PK,FK "References dim_job"
        INT skill_sk PK,FK "References dim_skill"
        VARCHAR required_level "Required / Preferred"
        VARCHAR record_source "operational / synthetic"
        TIMESTAMPTZ created_at
    }

    %% ==========================================
    %% FACT TABLES
    %% ==========================================
    fact_placement {
        SERIAL placement_id PK "Surrogate Primary Key"
        INT student_sk FK "Placed student"
        INT company_sk FK "Hiring employer"
        INT offer_date_sk FK "Placement offer date"
        NUMERIC annual_package_lpa "Annual salary in LPA"
        NUMERIC base_salary_inr "Base fixed compensation"
        NUMERIC bonus_inr "Variable / Joining bonus"
        INT offers_count "Additive offer counter (1)"
        NUMERIC aptitude_score "Aptitude test score (0-100)"
        NUMERIC technical_test_score "Coding assessment score (0-100)"
        NUMERIC interview_score "Technical interview score (0-100)"
        INT readiness_score "Placement readiness index (0-100)"
        BOOLEAN is_on_campus "On-Campus vs Off-Campus drive"
        VARCHAR record_source "operational / synthetic"
        TIMESTAMPTZ created_at
    }

    fact_job_application {
        SERIAL application_id PK "Surrogate Primary Key"
        VARCHAR natural_application_id UK "Natural Key (APP-1001)"
        INT student_sk FK "Applicant (if student)"
        INT alumni_sk FK "Applicant (if alumnus)"
        INT company_sk FK "Employer"
        INT job_sk FK "Target job vacancy"
        INT applied_date_sk FK "Submission calendar date"
        INT reviewed_date_sk FK "Review calendar date"
        INT ats_match_score "ATS resume match (0-100)"
        INT days_to_decision "Days between apply & decision"
        INT is_shortlisted "Shortlisted indicator (0/1)"
        INT is_selected "Hired indicator (0/1)"
        VARCHAR application_status "Applied / Screened / Selected"
        VARCHAR record_source "operational / synthetic"
        TIMESTAMPTZ created_at
    }

    fact_salary_benchmark {
        SERIAL salary_id PK "Surrogate Primary Key"
        INT alumni_sk FK "Reporting alumnus"
        INT company_sk FK "Benchmark employer"
        INT effective_date_sk FK "Effective calendar date"
        NUMERIC experience_years "Experience horizon"
        NUMERIC total_annual_comp_inr "Annual compensation benchmark"
        VARCHAR salary_band_tier "Salary band tier (e.g. 6-12 LPA)"
        VARCHAR record_source "operational / synthetic"
        TIMESTAMPTZ created_at
    }

    fact_career_outcomes {
        SERIAL outcome_id PK "Surrogate Primary Key"
        VARCHAR natural_outcome_id UK "Natural Key (OUT-1001)"
        INT alumni_sk FK,UK "1:1 with dim_alumni"
        INT observation_period_months "Standardized horizon (6)"
        INT employed_within_6_months "Classification Target (0/1)"
        VARCHAR career_level "Career level at 6 months"
        VARCHAR industry "Industry domain"
        NUMERIC experience_years_at_observation "Experience at milestone"
        VARCHAR record_source "operational / synthetic"
        BOOLEAN is_synthetic_educational_target "Explicit target flag"
        TIMESTAMPTZ created_at
    }

    %% ==========================================
    %% AUDIT & ETL LEDGERS
    %% ==========================================
    etl_batches {
        UUID id PK "Execution batch UUID"
        VARCHAR batch_type "csv_upload / api_import"
        VARCHAR file_name "Ingested source filename"
        VARCHAR status "pending / processing / completed"
        INT rows_total "Total records in batch"
        INT rows_inserted "Valid inserted records"
        INT rows_rejected "Rejected validation failures"
        JSONB staged_data "Temporary dry-run payload"
        TEXT error_summary "High-level failure message"
        TIMESTAMPTZ started_at
        TIMESTAMPTZ completed_at
    }

    etl_batch_errors {
        BIGSERIAL id PK "Error record ID"
        UUID batch_id FK "References etl_batches"
        INT row_number "Physical CSV row number"
        JSONB raw_data "Raw rejected JSON row"
        TEXT validation_error "Detailed validation rejection reason"
        TIMESTAMPTZ created_at
    }

    %% ==========================================
    %% 22 EXPLICIT REFERENTIAL RELATIONSHIPS
    %% ==========================================
    dim_student ||--o{ bridge_student_skill : "possesses"
    dim_skill ||--o{ bridge_student_skill : "classified_in"

    dim_alumni ||--o{ bridge_alumni_skill : "demonstrates"
    dim_skill ||--o{ bridge_alumni_skill : "acquired_by"

    dim_job ||--o{ bridge_job_skill : "stipulates"
    dim_skill ||--o{ bridge_job_skill : "demanded_by"

    dim_company ||--o{ dim_job : "originates"
    dim_date ||--o{ dim_job : "advertised_on"

    dim_student ||--o{ fact_placement : "awarded_to"
    dim_company ||--o{ fact_placement : "offered_by"
    dim_date ||--o{ fact_placement : "offered_on"

    dim_student ||--o{ fact_job_application : "submitted_by_student"
    dim_alumni ||--o{ fact_job_application : "submitted_by_alumni"
    dim_company ||--o{ fact_job_application : "received_by"
    dim_job ||--o{ fact_job_application : "targets_requisition"
    dim_date ||--o{ fact_job_application : "applied_on"
    dim_date ||--o{ fact_job_application : "reviewed_on"

    dim_alumni ||--o{ fact_salary_benchmark : "reports_for"
    dim_company ||--o{ fact_salary_benchmark : "benchmarked_at"
    dim_date ||--o{ fact_salary_benchmark : "benchmarked_on"

    dim_alumni ||--|| fact_career_outcomes : "evaluates_outcome"

    etl_batches ||--o{ etl_batch_errors : "records_failures"
```


---


## Appendix Diagram: 05 DATASET RELATIONSHIPS (05_dataset_relationships.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Dataset Relationships and Warehouse Mapping Diagram
%% File: 05_dataset_relationships.mmd
%% Scope: Entity relationships among the 7 physical synthetic CSV datasets,
%%        join keys, cardinalities, and physical mappings to DWH tables.
%% ============================================================================

flowchart LR
    %% ------------------------------------------------------------------------
    %% PHYSICAL CSV DATASETS
    %% ------------------------------------------------------------------------
    subgraph RawCSV_Datasets ["Physical Benchmark Datasets (50,150 Records)"]
        direction TB

        CSV_Skills["skills.csv<br/>(150 rows / 4 columns)<br/>PK: skill_id"]
        CSV_Alumni["alumni.csv<br/>(2,000 rows / 10 columns)<br/>PK: alumni_id"]
        CSV_Jobs["jobs.csv<br/>(5,000 rows / 10 columns)<br/>PK: job_id"]

        CSV_AlumSkills["alumni_skills.csv<br/>(20,000 rows / 5 columns)<br/>Composite: (alumni_id, skill_id)"]
        CSV_JobSkills["job_skills.csv<br/>(15,000 rows / 4 columns)<br/>Composite: (job_id, skill_id)"]

        CSV_Apps["applications.csv<br/>(6,000 rows / 7 columns)<br/>PK: application_id"]
        CSV_Outcomes["career_outcomes.csv<br/>(2,000 rows / 8 columns)<br/>PK: outcome_id | UK: alumni_id"]
    end

    %% ------------------------------------------------------------------------
    %% DATASET RELATIONSHIPS & CARDINALITIES
    %% ------------------------------------------------------------------------
    CSV_Alumni -- "1 : N (alumni_id)" --> CSV_AlumSkills
    CSV_Skills -- "1 : N (skill_id)" --> CSV_AlumSkills

    CSV_Jobs -- "1 : N (job_id)" --> CSV_JobSkills
    CSV_Skills -- "1 : N (skill_id)" --> CSV_JobSkills

    CSV_Alumni -- "1 : N (alumni_id)" --> CSV_Apps
    CSV_Jobs -- "1 : N (job_id)" --> CSV_Apps

    CSV_Alumni -- "1 : 1 (alumni_id)" --> CSV_Outcomes

    %% ------------------------------------------------------------------------
    %% TARGET WAREHOUSE TABLES
    %% ------------------------------------------------------------------------
    subgraph WarehouseTables ["Analytical Warehouse Target Schema (dwh.*)"]
        direction TB
        T_Skill["dwh.dim_skill<br/>(Surrogate: skill_sk | Natural: natural_skill_id)"]
        T_Alumni["dwh.dim_alumni<br/>(Surrogate: alumni_sk | Natural: natural_alumni_id)"]
        T_Company["dwh.dim_company<br/>(Surrogate: company_sk | Distinct company_name)"]
        T_Job["dwh.dim_job<br/>(Surrogate: job_sk | Natural: natural_job_id)"]
        
        T_BridgeAlum["dwh.bridge_alumni_skill<br/>(PK: alumni_sk, skill_sk)"]
        T_BridgeJob["dwh.bridge_job_skill<br/>(PK: job_sk, skill_sk)"]

        T_FactApp["dwh.fact_job_application<br/>(PK: application_id | FK: alumni_sk, job_sk, company_sk)"]
        T_FactOutcomes["dwh.fact_career_outcomes<br/>(PK: outcome_id | UK: alumni_sk [1:1])"]
    end

    %% ------------------------------------------------------------------------
    %% INGESTION MAPPING PATHWAYS
    %% ------------------------------------------------------------------------
    CSV_Skills ==>|"Direct Dimension Load"| T_Skill
    CSV_Alumni ==>|"Profile Dimension Load"| T_Alumni
    CSV_Jobs ==>|"De-duplicate Company & Load Requisitions"| T_Company
    CSV_Jobs ==>|"Requisitions Load"| T_Job

    CSV_AlumSkills ==>|"Resolve alumni_sk & skill_sk"| T_BridgeAlum
    CSV_JobSkills ==>|"Resolve job_sk & skill_sk"| T_BridgeJob

    CSV_Apps ==>|"Resolve applicant & job foreign keys"| T_FactApp
    CSV_Outcomes ==>|"Resolve alumni_sk (Strict 1:1 Target)"| T_FactOutcomes
```


---


## Appendix Diagram: 06 ETL DATA LINEAGE (06_etl_data_lineage.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - End-to-End ETL Ingestion Pipeline and Data Lineage Diagram
%% File: 06_etl_data_lineage.mmd
%% Scope: Staged data flow from raw CSV uploads through parsing, row-level validation,
%%        dry-run preview, atomic transaction commit, and analytical consumption.
%% ============================================================================

flowchart TD
    %% ------------------------------------------------------------------------
    %% STAGE 1: INPUT RECEPTION
    %% ------------------------------------------------------------------------
    subgraph S1_IngestionInput ["Stage 1: Ingestion Intake & Buffer"]
        ClientUpload["Client File Upload<br/>(Multipart Form POST /api/analytics/etl/upload)"]
        MulterBuffer["Multer Memory Buffer<br/>(Max: 25 MB / MIME: text/csv)"]
        Classifier{"Dataset Classifier<br/>(Target Table Resolution)"}
    end

    ClientUpload --> MulterBuffer
    MulterBuffer --> Classifier

    %% ------------------------------------------------------------------------
    %% STAGE 2: PARSING & ROW-LEVEL VALIDATION
    %% ------------------------------------------------------------------------
    subgraph S2_ValidationFilter ["Stage 2: Validation & Exception Trapping"]
        direction TB
        HeaderCheck{"Header Conformance?<br/>(Required Schema Columns)"}
        StreamParser["csv-parse Stream Processor<br/>(Row-by-Row Evaluation)"]
        
        subgraph RowRules ["Row-Level Integrity Rules"]
            R_Types["Type Coercion (Numeric, String, Date)"]
            R_Bounds["Domain Bounds (0.0 <= CGPA <= 10.0, LPA >= 0)"]
            R_Binary["Target Constraints (employed in {0, 1})"]
            R_Nulls["Non-Null Mandatory Foreign Identifiers"]
        end

        RowCheck{"All Row Rules Passed?"}
        LogErr["dwh.etl_batch_errors<br/>(Row number, Raw JSON payload, Failure reason)"]
    end

    Classifier -- "Match Valid Target" --> HeaderCheck
    HeaderCheck -- "Missing Columns" --> LogErr
    HeaderCheck -- "Valid Headers" --> StreamParser
    StreamParser --> RowRules
    RowRules --> RowCheck
    RowCheck -- "Invalid (Fail)" --> LogErr

    %% ------------------------------------------------------------------------
    %% STAGE 3: DRY-RUN GATE & PREVIEW
    %% ------------------------------------------------------------------------
    subgraph S3_StagingGate ["Stage 3: Dry-Run Staging Gate"]
        DryRunCheck{"Dry-Run Requested?<br/>(isDryRun: true)"}
        StageJSON["Stage in dwh.etl_batches.staged_data<br/>(Status: 'staged')"]
        PreviewReturn["Return HTTP 200 Preview DTO<br/>(Total rows, Valid sample, Error breakdown)"]
        CommitPrompt["Client Invokes POST /etl/confirm-import<br/>(Batch ID Passed)"]
    end

    RowCheck -- "Valid (Pass)" --> DryRunCheck
    DryRunCheck -- "Yes (Preview Mode)" --> StageJSON
    StageJSON --> PreviewReturn
    PreviewReturn -.-> CommitPrompt

    %% ------------------------------------------------------------------------
    %% STAGE 4: ATOMIC TRANSACTIONAL COMMIT
    %% ------------------------------------------------------------------------
    subgraph S4_WarehouseCommit ["Stage 4: Atomic Loading & Key Resolution"]
        direction TB
        TxBegin["BEGIN PostgreSQL Transaction"]
        
        subgraph KeyResolution ["Surrogate Key (_sk) Mapping"]
            Lookup_Skill["Lookup or Insert dim_skill (skill_sk)"]
            Lookup_Company["Lookup or Insert dim_company (company_sk)"]
            Lookup_Alumni["Lookup or Insert dim_alumni (alumni_sk)"]
            Lookup_Job["Lookup or Insert dim_job (job_sk)"]
            Lookup_Date["Lookup Calendar dim_date (date_sk)"]
        end

        subgraph LoadingOrder ["Referential Chaining Sequence"]
            Load_Dims["1. Dimensions (dim_student, dim_alumni, dim_job)"]
            Load_Bridges["2. Multivalued Bridges (bridge_alumni_skill, bridge_job_skill)"]
            Load_Facts["3. Fact Tables (fact_job_application, fact_career_outcomes)"]
        end

        TxCheck{"Constraint Errors?"}
        TxRollback["ROLLBACK Transaction<br/>(dwh.etl_batches status: 'failed')"]
        TxCommit["COMMIT Transaction<br/>(dwh.etl_batches status: 'completed')"]
    end

    DryRunCheck -- "No (Live Commit)" --> TxBegin
    CommitPrompt ==> TxBegin
    TxBegin --> KeyResolution
    KeyResolution --> LoadingOrder
    LoadingOrder --> TxCheck
    TxCheck -- "Violation" --> TxRollback
    TxCheck -- "Success" --> TxCommit

    %% ------------------------------------------------------------------------
    %% STAGE 5: ANALYTICAL CONSUMPTION
    %% ------------------------------------------------------------------------
    subgraph S5_Consumption ["Stage 5: Downstream Analytical Consumption"]
        direction LR
        OLAP_Engine["OLAP Cube Engine<br/>(Slicing, Dicing, 2D Matrix)"]
        Apriori_Engine["Apriori Association Engine<br/>(Mode A & Mode B Mining)"]
        Clustering_Engine["K-Means++ Profile Clustering<br/>(PCA 2D Projections)"]
        Classifier_Engine["Logistic Regression Classifier<br/>(Employability Inference)"]
    end

    TxCommit ==> OLAP_Engine
    TxCommit ==> Apriori_Engine
    TxCommit ==> Clustering_Engine
    TxCommit ==> Classifier_Engine
```


---


## Appendix Diagram: 07 API REQUEST LIFECYCLE (07_api_request_lifecycle.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - General API Request Lifecycle Diagram
%% File: 07_api_request_lifecycle.mmd
%% Scope: End-to-end traversal of an analytics request from UI interaction to
%%        database query execution, JSON enveloping, and DOM rendering.
%% ============================================================================

flowchart LR
    %% ------------------------------------------------------------------------
    %% CLIENT STEPS
    %% ------------------------------------------------------------------------
    subgraph ClientExecution ["1. Client Interaction & Dispatch"]
        UserAction["Analyst User Action<br/>(Select Filter / Click Run)"]
        ReactState["React Hook Dispatch<br/>(useState / useEffect / useMemo)"]
        AxiosClient["Axios Client (http.js)<br/>(Attaches Bearer Token / BaseURL)"]
    end

    UserAction --> ReactState
    ReactState --> AxiosClient

    %% ------------------------------------------------------------------------
    %% NETWORK BOUNDARY
    %% ------------------------------------------------------------------------
    AxiosClient -- "HTTP REST Request (Port 5001)" --> NetworkBoundary["Express Server Entry<br/>(server.js)"]

    %% ------------------------------------------------------------------------
    %% SERVER MIDDLEWARE & ROUTING
    %% ------------------------------------------------------------------------
    subgraph ServerProcessing ["2. Server Gate & Validation"]
        direction TB
        SecurityHeaders["helmet() & cors()<br/>(Security Verification)"]
        AuthCheck{"requireAuth<br/>(Validate Token / Guest)"}
        SchemaValidation{"validate()<br/>(Zod Query / Body Parser)"}
        RouteDispatch["Express Route Handler<br/>(analyticsRoutes.js)"]
    end

    NetworkBoundary --> SecurityHeaders
    SecurityHeaders --> AuthCheck
    AuthCheck -- "Valid / Permitted" --> SchemaValidation
    SchemaValidation -- "Schema Pass" --> RouteDispatch
    SchemaValidation -- "Schema Fail" --> Err400["HTTP 400 Bad Request<br/>{ success: false, errors }"]

    %% ------------------------------------------------------------------------
    %% BUSINESS LOGIC & DATA ACCESS
    %% ------------------------------------------------------------------------
    subgraph CoreExecution ["3. Controller & Service Execution"]
        Controller["Controller Action<br/>(e.g. getOlap / getAssociationRules)"]
        ServiceLogic["Service Algorithmic Logic<br/>(Computation, Filtering, Formatting)"]
        RepositorySQL["Repository Layer<br/>(Construct Parameterized SQL)"]
        DBPool["pg.Pool Client<br/>(Acquires Connection)"]
    end

    RouteDispatch --> Controller
    Controller --> ServiceLogic
    ServiceLogic --> RepositorySQL
    RepositorySQL --> DBPool

    %% ------------------------------------------------------------------------
    %% DATABASE EXECUTION
    %% ------------------------------------------------------------------------
    subgraph DatabaseExecution ["4. Warehouse Query Execution"]
        DWH_Engine[("PostgreSQL 16 (dwh schema)<br/>Executes SQL prepared statement")]
    end

    DBPool -- "TCP Prepared SQL ($1, $2)" --> DWH_Engine
    DWH_Engine -- "Returns Tuples / Recordset" --> DBPool

    %% ------------------------------------------------------------------------
    %% RESPONSE PIPELINE
    %% ------------------------------------------------------------------------
    subgraph ResponsePipeline ["5. Response Packaging & DOM Render"]
        ResponseEnvelope["Format Standardized DTO<br/>{ success: true, data, meta }"]
        HTTP200["HTTP 200 OK Response<br/>(application/json)"]
        DOMRender["Recharts & SVG Render<br/>(Interactive Charts & Heatmaps)"]
    end

    DBPool --> ServiceLogic
    ServiceLogic --> Controller
    Controller --> ResponseEnvelope
    ResponseEnvelope --> HTTP200
    HTTP200 -- "HTTP JSON Payload" --> AxiosClient
    AxiosClient --> DOMRender
```


---


## Appendix Diagram: 08 ANALYTICS SEQUENCE (08_analytics_sequence.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Analytical Query and Data Mining Execution Sequence
%% File: 08_analytics_sequence.mmd
%% Scope: Dual sequence diagram tracing synchronous OLAP matrix aggregation and
%%        multi-stage Apriori association rule mining executions.
%% ============================================================================

sequenceDiagram
    autonumber
    actor Analyst as Educational Analyst
    participant UI as AnalyticsOLAP / AnalyticsMining (React)
    participant API as http.js (Axios Client)
    participant Router as Express API Router (/api)
    participant Ctrl as analyticsController / miningController
    participant Svc as warehouseRepo / associationRulesService
    participant DB as PostgreSQL 16 (dwh Schema)

    %% ------------------------------------------------------------------------
    %% WORKFLOW A: OLAP 2D MATRIX QUERY
    %% ------------------------------------------------------------------------
    rect rgb(240, 248, 255)
        Note over Analyst,DB: WORKFLOW A: OLAP Multidimensional 2D Matrix Query
        Analyst->>UI: Selects Row Axis ('Department'), Col Axis ('Tier'), Metric ('avgLpa')
        UI->>API: GET /api/analytics/olap?primaryDimension=department&secondaryDimension=tier&measure=avgLpa
        API->>Router: Forward HTTP Request with Authorization Header
        Router->>Ctrl: Dispatch to analyticsController.getOlap(req, res)
        Ctrl->>Svc: warehouseRepository.getOlapData({ primaryDimension, secondaryDimension, measure })
        
        Note over Svc,DB: SQL Generation with Injection-Safe Whitelist
        Svc->>Svc: Map primaryDimension -> 's.department', secondaryDimension -> 'c.company_tier'
        Svc->>DB: SELECT s.department, c.company_tier, AVG(p.annual_package_lpa) ... GROUP BY 1, 2
        DB-->>Svc: Return 18 grouped tabular rows
        
        Note over Svc: 2D Matrix Transformation & Marginal Totals
        Svc->>Svc: Pivot flat tuples into row/col matrix grid
        Svc->>Svc: Compute row sums, col sums, and overall average
        Svc-->>Ctrl: Return structured OLAP Matrix DTO
        Ctrl-->>API: HTTP 200 OK { success: true, data: { matrix, totals } }
        API-->>UI: Resolve Axios Promise
        UI-->>Analyst: Render Interactive SVG Heatmap Matrix with Marginal Totals
    end

    %% ------------------------------------------------------------------------
    %% WORKFLOW B: APRIORI ASSOCIATION MINING EXECUTION
    %% ------------------------------------------------------------------------
    rect rgb(255, 250, 245)
        Note over Analyst,DB: WORKFLOW B: Apriori Association Rule Mining Execution
        Analyst->>UI: Configures Mode A (Alumni Skills), minSupport=5%, minConfidence=50%, minLift=1.1x
        UI->>API: GET /api/analytics/mining/association-rules?mode=alumni_skills&minSupport=0.05&minConfidence=0.5&minLift=1.1
        API->>Router: Forward HTTP Request
        Router->>Ctrl: Dispatch to dataminingController.getAssociationRules(req, res)
        Ctrl->>Svc: runAprioriAssociationMining({ mode, minSupport, minConfidence, minLift })
        
        Note over Svc,DB: Extract Transaction Baskets
        Svc->>DB: SELECT alumni_sk, array_agg(skill_name) FROM bridge_alumni_skill JOIN dim_skill GROUP BY alumni_sk
        DB-->>Svc: Return 2,000 skill transaction baskets (N = 2,000)
        
        Note over Svc: In-Memory Apriori Algorithmic Pipeline
        Svc->>Svc: Count 1-itemset frequencies -> Generate L1 (19 frequent items)
        Svc->>Svc: Generate Candidate 2-Itemsets C2 & Apply Apriori Pruning -> L2 (14 itemsets)
        Svc->>Svc: Generate Candidate 3-Itemsets C3 & Prune -> L3 (2 itemsets)
        Svc->>Svc: Bitmask proper subset partitioning -> Calculate Confidence and Lift
        Svc->>Svc: Filter rules where Conf >= 0.50 AND Lift >= 1.10 -> 11 Qualified Rules
        
        Svc-->>Ctrl: Return Apriori Results DTO (frequentItemsets, rules, diagnostics)
        Ctrl-->>API: HTTP 200 OK { success: true, data: { rules, itemsets, diagnostics } }
        API-->>UI: Resolve Promise
        UI-->>Analyst: Display Ranked Association Rules Table (Sorted by Lift Descending)
    end
```


---


## Appendix Diagram: 09 OLAP WORKFLOW (09_olap_workflow.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - OLAP Multidimensional Cube Engine & Workflow Diagram
%% File: 09_olap_workflow.mmd
%% Scope: Multidimensional analytical cube architecture, dimension whitelisting,
%%        canonical OLAP operations (Roll-Up, Drill-Down, Slice, Dice, Pivot),
%%        measure computation, and visual matrix projection.
%% ============================================================================

flowchart TD
    %% ------------------------------------------------------------------------
    %% DIMENSION SELECTION & PARAMETER INPUT
    %% ------------------------------------------------------------------------
    subgraph DimensionInput ["1. Analytical Dimension Selection"]
        direction TB
        Dim_Primary["Primary Dimension (Row Axis)<br/>(Department / Company / Tier / Year / Industry / Degree / Source)"]
        Dim_Secondary["Secondary Dimension (Column Axis)<br/>(Optional: Enables 2D Cross-Tabulation Pivot)"]
        Measure_Select["Target Measure Selection<br/>(avgLpa, medianLpa, placedCount, totalOffers, minLpa, maxLpa)"]
    end

    %% ------------------------------------------------------------------------
    %% OLAP CANONICAL OPERATIONS
    %% ------------------------------------------------------------------------
    subgraph OLAP_Operations ["2. OLAP Multidimensional Operations"]
        direction TB

        subgraph Op_SliceDice ["Slicing & Dicing Engine"]
            Op_Slice["Slice Operation (Equality Filtering)<br/>- sliceDept: s.department = $1<br/>- sliceTier: c.company_tier = $2<br/>- sliceYear: d.year = $3<br/>- sliceCompany: c.company_name ILIKE $4"]
            Op_Dice["Dice Operation (Bounding Box Thresholds)<br/>- minLpa: p.annual_package_lpa >= $minLpa<br/>Combined across multi-axis dimension filters"]
        end

        subgraph Op_Hierarchy ["Hierarchical Navigation"]
            Op_Rollup["Roll-Up Operation<br/>Executes global institutional summary query<br/>across identical slice filters for context"]
            Op_DrillDown["Drill-Down Operation<br/>Passing drillDownKey expands aggregated group<br/>into constituent company and job role details"]
        end

        subgraph Op_Pivot2D ["2D Matrix Pivoting"]
            Op_Pivot["2D Cross-Tabulation Pivot<br/>Generates dynamic M x N grid projecting<br/>primaryDimension rows against secondaryDimension columns"]
        end
    end

    DimensionInput --> OLAP_Operations

    %% ------------------------------------------------------------------------
    %% SQL GENERATION & EXECUTION
    %% ------------------------------------------------------------------------
    subgraph SQL_Generation ["3. SQL Query Construction & Parameterization"]
        direction TB
        WhitelistCheck{"Dimension Whitelist Check<br/>(ALLOWED_DIMENSIONS)"}
        ParamQuery["Construct Parameterized Prepared SQL<br/>($1, $2, ... placeholders)"]
        
        subgraph Aggregations ["Measures & Statistical Functions"]
            M_Count["total_offers: COUNT(p.placement_id)"]
            M_Placed["placed_count: COUNT(DISTINCT p.student_sk)"]
            M_Avg["avg_lpa: ROUND(AVG(p.annual_package_lpa), 2)"]
            M_Median["median_lpa: PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY annual_package_lpa)"]
            M_Bounds["min_lpa / max_lpa: MIN/MAX(p.annual_package_lpa)"]
        end
    end

    OLAP_Operations --> WhitelistCheck
    WhitelistCheck -- "Matched" --> ParamQuery
    WhitelistCheck -- "Unrecognized" --> DefaultDept["Default to s.department"]
    DefaultDept --> ParamQuery
    ParamQuery --> Aggregations

    %% ------------------------------------------------------------------------
    %% WAREHOUSE ENGINE
    %% ------------------------------------------------------------------------
    subgraph DWH_Execution ["4. Analytical Warehouse Engine (PostgreSQL dwh)"]
        DWH_Join[("dwh.fact_placement (p)<br/>JOIN dwh.dim_student (s) ON s.student_sk = p.student_sk<br/>JOIN dwh.dim_company (c) ON c.company_sk = p.company_sk<br/>LEFT JOIN dwh.dim_date (d) ON d.date_sk = p.offer_date_sk")]
    end

    Aggregations --> DWH_Join

    %% ------------------------------------------------------------------------
    %% RESULTS TRANSFORMATION & VISUALIZATION
    %% ------------------------------------------------------------------------
    subgraph VisualDelivery ["5. In-Memory Pivot & Visualization Delivery"]
        direction TB
        InMemPivot["In-Memory 2D Grid Transformation<br/>Calculates row marginal sums & column marginal sums"]
        HeatmapRender["SVG Heatmap Matrix<br/>Cells colored with opacity proportional to metric density"]
        BarChartRender["Recharts Distribution Bars & KPI Gauges"]
        DataTableRender["Paginated Detail Grid with Sortable Columns"]
    end

    DWH_Join --> InMemPivot
    InMemPivot --> HeatmapRender
    InMemPivot --> BarChartRender
    InMemPivot --> DataTableRender
```


---


## Appendix Diagram: 10 APRIORI WORKFLOW (10_apriori_workflow.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Apriori Association Rule Mining Algorithm Workflow
%% File: 10_apriori_workflow.mmd
%% Scope: Multi-modal transaction extraction, Apriori candidate generation,
%%        subset pruning, rule derivation, confidence/lift metrics, and diagnostics.
%% ============================================================================

flowchart TD
    %% ------------------------------------------------------------------------
    %% STAGE 1: MODE SELECTION & BASKET CONSTRUCTION
    %% ------------------------------------------------------------------------
    subgraph S1_Baskets ["Stage 1: Transaction Basket Extraction"]
        direction TB
        ModeSelect{"Operational Mode Selection"}
        
        ModeA["Mode A: Alumni Competencies<br/>Source: dwh.bridge_alumni_skill JOIN dim_skill<br/>Basket Entity: Alumnus (N = 2,000)<br/>Avg Basket Size: ~10.0 skills"]
        ModeB["Mode B: Job Requisition Demands<br/>Source: dwh.bridge_job_skill JOIN dim_skill<br/>Basket Entity: Job Requisition (N = 5,000)<br/>Avg Basket Size: ~3.0 skills"]

        ParamConfig["Threshold Parameters<br/>- minSupport (default: 0.05 / 5%)<br/>- minConfidence (default: 0.50 / 50%)<br/>- minLift (default: 1.10x)<br/>- maxItemsetLength (default: 3)"]
    end

    ModeSelect -- "Alumni Profiles" --> ModeA
    ModeSelect -- "Job Postings" --> ModeB
    ModeA --> ParamConfig
    ModeB --> ParamConfig

    %% ------------------------------------------------------------------------
    %% STAGE 2: FREQUENT ITEMSET DISCOVERY (APRIORI)
    %% ------------------------------------------------------------------------
    subgraph S2_FrequentItemsets ["Stage 2: Apriori Frequent Itemset Generation"]
        direction TB

        L1_Gen["1. Generate Frequent 1-Itemsets (L_1)<br/>Count item frequencies across all N transactions<br/>Filter items with count >= minSupportCount"]
        
        subgraph IterLoop ["k-Itemset Loop (k = 2 to maxItemsetLength)"]
            CandGen["Candidate Generation (C_k)<br/>Join L_{k-1} with L_{k-1} where first k-2 items match"]
            PruneStep{"Apriori Pruning Check<br/>Are all (k-1) subsets of candidate in L_{k-1}?"}
            PruneAction["Prune Candidate<br/>(Exclude from transaction scanning)"]
            ScanTrans["Count Support in Transactions<br/>Scan transactions to count surviving candidates"]
            FilterLk{"Candidate Count >= minSupportCount?"}
            SaveLk["Add to Frequent k-Itemsets (L_k)"]
        end

        LoopCheck{"k < maxItemsetLength AND |L_k| > 0?"}
    end

    ParamConfig --> L1_Gen
    L1_Gen --> CandGen
    CandGen --> PruneStep
    PruneStep -- "No (Subset Infrequent)" --> PruneAction
    PruneStep -- "Yes (All Subsets Frequent)" --> ScanTrans
    ScanTrans --> FilterLk
    FilterLk -- "Yes" --> SaveLk
    FilterLk -- "No" --> PruneAction
    SaveLk --> LoopCheck
    LoopCheck -- "Yes (k = k + 1)" --> CandGen

    %% ------------------------------------------------------------------------
    %% STAGE 3: RULE GENERATION & EVALUATION
    %% ------------------------------------------------------------------------
    subgraph S3_RuleGeneration ["Stage 3: Rule Generation & Evaluation"]
        direction TB

        BitmaskSubsets["Bitmask Subset Partitioning<br/>For each S in L_k (k >= 2):<br/>Generate non-empty proper subsets X, Y such that X U Y = S, X cap Y = empty"]

        subgraph MetricsMath ["Metric Formulations"]
            M_Supp["Support(X => Y) = Count(X U Y) / N"]
            M_Conf["Confidence(X => Y) = Support(X U Y) / Support(X)"]
            M_Lift["Lift(X => Y) = Confidence(X => Y) / Support(Y)"]
        end

        subgraph DiagnosticsCounters ["Diagnostic Exception Tracking"]
            D_Cand["candidateRulesGenerated++"]
            D_ConfRej["rejectedByConfidence++"]
            D_LiftRej["rejectedByLift++"]
            D_Qual["qualifiedRulesCount++"]
        end

        FilterGate{"Threshold Gate<br/>Confidence >= minConfidence?<br/>Lift >= minLift?"}
        RankRules["Ranked Association Rules<br/>Sorted descending by Lift, then Confidence, then Support"]
    end

    LoopCheck -- "Loop Terminated" --> BitmaskSubsets
    BitmaskSubsets --> MetricsMath
    MetricsMath --> D_Cand
    D_Cand --> FilterGate
    FilterGate -- "Confidence < minConf" --> D_ConfRej
    FilterGate -- "Lift < minLift" --> D_LiftRej
    FilterGate -- "Passed Both Gates" --> D_Qual
    D_Qual --> RankRules

    %% ------------------------------------------------------------------------
    %% ILLUSTRATIVE EXAMPLE CALLOUT
    %% ------------------------------------------------------------------------
    subgraph IllustrativeBox ["Illustrative Pedagogical Example (Not Measured Result)"]
        direction TB
        ExNote["Toy Example: N = 5 Baskets, minSupport = 0.40, minConfidence = 0.60<br/>T1={Docker, SQL}, T2={Docker, SQL, AWS}, T3={SQL, Python}, T4={Docker, AWS}, T5={Docker, SQL, AWS}<br/>Rule: {Docker, SQL} => {AWS}<br/>Support = 2/5 = 0.40 | Confidence = 2/3 = 0.667 | Lift = 0.667 / 0.60 = 1.11x"]
    end

    RankRules -.-> IllustrativeBox
```


---


## Appendix Diagram: 11 CLASSIFICATION WORKFLOW (11_classification_workflow.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Supervised Classification Pipeline & Leakage Prevention
%% File: 11_classification_workflow.mmd
%% Scope: Supervised classification workflow, stratified train/test split,
%%        leakage-safe preprocessor fitting, regularized logistic regression,
%%        evaluation metrics, and interactive inference.
%% ============================================================================

flowchart TD
    %% ------------------------------------------------------------------------
    %% STAGE 1: DATA EXTRACTION & GROUND TRUTH
    %% ------------------------------------------------------------------------
    subgraph S1_DataExtraction ["Stage 1: Ground Truth Extraction"]
        OutcomesFact[("dwh.fact_career_outcomes<br/>Target: employed_within_6_months in {0, 1}<br/>Total Records: N = 2,002")]
        AlumniDims[("dwh.dim_alumni & bridge_alumni_skill<br/>Features: Skills, Experience, Dept, Tier")]
        
        ClassRatio["Class Distribution Audit<br/>Positive (Y=1): 1,397 records (69.8%)<br/>Negative (Y=0): 605 records (30.2%)<br/>Majority Baseline: 69.8% Accuracy"]
    end

    OutcomesFact --> ClassRatio
    AlumniDims --> ClassRatio

    %% ------------------------------------------------------------------------
    %% STAGE 2: STRATIFIED SPLIT & LEAKAGE ISOLATION
    %% ------------------------------------------------------------------------
    subgraph S2_LeakagePrevention ["Stage 2: Leakage-Safe Stratification Pipeline"]
        direction TB

        StratSplit["stratifiedTrainTestSplit(records, testRatio=0.20, seed=2026)<br/>Preserves exact 69.8% : 30.2% class ratio across partitions"]
        
        TrainSet["Training Partition (80%)<br/>n_train = 1,601 instances<br/>(1,118 Class 1 / 483 Class 0)"]
        TestSet["Held-Out Test Partition (20%)<br/>n_test = 401 instances<br/>(279 Class 1 / 122 Class 0)"]

        FitPreproc["fitPreprocessor(trainRecords, topSkillsCount=30)<br/>CRITICAL LEAKAGE SHIELD:<br/>1. Top 30 skills extracted SOLELY from 1,601 train instances<br/>2. minExp & maxExp bounds computed SOLELY from train instances"]

        TransformTrain["Transform Train Records<br/>X_train in R^(1601 x 32)"]
        TransformTest["Transform Test Records using FROZEN Train Parameters<br/>X_test in R^(401 x 32)"]
    end

    ClassRatio --> StratSplit
    StratSplit --> TrainSet
    StratSplit --> TestSet
    TrainSet --> FitPreproc
    FitPreproc --> TransformTrain
    FitPreproc ==>|Frozen Scaling & Vocabulary| TransformTest
    TestSet --> TransformTest

    %% ------------------------------------------------------------------------
    %% STAGE 3: REGULARIZED LOGISTIC REGRESSION TRAINING
    %% ------------------------------------------------------------------------
    subgraph S3_TrainingEngine ["Stage 3: Regularized Model Optimization"]
        direction TB

        WeightInit["Balanced Class Weighting<br/>w_0 = N / (2 * N_0) = 1.65<br/>w_1 = N / (2 * N_1) = 0.72<br/>Initial bias: b = ln(N_1 / N_0) = 0.838"]

        subgraph BGD_Loop ["Batch Gradient Descent (Epochs = 350, eta = 0.2)"]
            LinearComb["z_i = b + sum(w_j * x_ij)"]
            SigmoidAct["Sigmoid with Overflow Shield<br/>sigma(z) = 1 / (1 + e^-z)<br/>(Clipped if z >= 40 or z <= -40)"]
            LossCalc["Weighted Log-Loss + L2 Penalty<br/>J(w, b) = -1/N sum [w_y * (y ln p + (1-y) ln(1-p))] + (lambda/2) ||w||_2^2"]
            GradientUpdate["Parameter Update:<br/>w_j := w_j - eta * (grad_w_j / N + lambda * w_j)<br/>b := b - eta * (grad_b / N)"]
        end
    end

    TransformTrain --> WeightInit
    WeightInit --> LinearComb
    LinearComb --> SigmoidAct
    SigmoidAct --> LossCalc
    LossCalc --> GradientUpdate
    GradientUpdate -- "Iterate until Epoch 350" --> LinearComb

    %% ------------------------------------------------------------------------
    %% STAGE 4: MODEL EVALUATION & INFERENCE
    %% ------------------------------------------------------------------------
    subgraph S4_EvaluationSuite ["Stage 4: Evaluation & Inference Delivery"]
        direction TB

        EvaluateHeldOut["Predict on Held-Out Test Set (X_test)<br/>p_i = sigma(w^T x_test_i + b)<br/>Decision Threshold: theta = 0.50"]

        subgraph VerifiedMetrics ["Empirically Verified Test Metrics (n_test = 401)"]
            CM["2x2 Confusion Matrix:<br/>TP = 244 | FP = 52 | FN = 35 | TN = 70"]
            Acc["Accuracy: 78.3% (+8.5% over 69.8% baseline)"]
            Prec["Precision (PPV): 82.1%"]
            Rec["Recall (Sensitivity): 87.5%"]
            Spec["Specificity: 57.0%"]
            F1["F1-Score: 0.847 | Balanced Acc: 72.3%"]
            ROCAUC["ROC-AUC: 0.812"]
        end

        InferenceAPI["Interactive Inference API<br/>POST /api/analytics/mining/classification/predict<br/>Input: Single Alumnus / Output: P(Employed)"]
    end

    GradientUpdate -- "Trained Model Parameters" --> EvaluateHeldOut
    TransformTest --> EvaluateHeldOut
    EvaluateHeldOut --> CM
    CM --> Acc
    CM --> Prec
    CM --> Rec
    CM --> Spec
    CM --> F1
    CM --> ROCAUC
    GradientUpdate --> InferenceAPI
```


---


## Appendix Diagram: 12 CLUSTERING WORKFLOW (12_clustering_workflow.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Unsupervised Clustering & PCA Projection Workflow
%% File: 12_clustering_workflow.mmd
%% Scope: K-Means++ initialization, Mulberry32 PRNG seed invariance,
%%        iterative Lloyd's optimization, multi-K evaluation (Elbow & Silhouette),
%%        and 2D PCA dimensionality reduction.
%% ============================================================================

flowchart TD
    %% ------------------------------------------------------------------------
    %% STAGE 1: FEATURE EXTRACTION & SCALING
    %% ------------------------------------------------------------------------
    subgraph S1_FeatureExtraction ["Stage 1: Feature Matrix Construction"]
        AlumniProfiles[("dwh.dim_alumni & bridge_alumni_skill<br/>Total Instances: N = 2,000")]
        
        subgraph Features ["Selected Analytical Dimensions (d = 6)"]
            F_Exp["experience_years"]
            F_SkillsCount["total_skill_count"]
            F_Proficiency["average_proficiency_score"]
            F_GradYear["norm_graduation_cohort"]
            F_CompTier["company_tier_ordinal"]
            F_Domain["domain_breadth_index"]
        end

        MinMaxScale["Min-Max Scaling Engine<br/>Maps all features into normalized interval [0.0, 1.0]<br/>Yields normalized matrix X in R^(2000 x 6)"]
    end

    AlumniProfiles --> Features
    Features --> MinMaxScale

    %% ------------------------------------------------------------------------
    %% STAGE 2: DETERMINISTIC K-MEANS++ INITIALIZATION
    %% ------------------------------------------------------------------------
    subgraph S2_KMeansInit ["Stage 2: Deterministic K-Means++ Seeding"]
        direction TB

        MulberryPRNG["Mulberry32 PRNG (seed = 2026)<br/>Guarantees bitwise reproducible centroid selection"]
        
        FirstCentroid["1. Select first centroid mu_1 uniformly at random from X"]
        DistSqCalc["2. Compute D(x)^2 = min ||x - mu_j||^2 to existing centroids"]
        SampleNext["3. Sample next centroid mu_{m+1} with probability proportional to D(x)^2"]
        InitDone{"All K centroids initialized?"}
    end

    MinMaxScale --> MulberryPRNG
    MulberryPRNG --> FirstCentroid
    FirstCentroid --> DistSqCalc
    DistSqCalc --> SampleNext
    SampleNext --> InitDone
    InitDone -- "No (m < K)" --> DistSqCalc

    %% ------------------------------------------------------------------------
    %% STAGE 3: ITERATIVE EXPECTATION-MAXIMIZATION
    %% ------------------------------------------------------------------------
    subgraph S3_EM_Loop ["Stage 3: Lloyd's Iterative Optimization"]
        direction TB

        AssignStep["Assignment Step (Expectation):<br/>Assign each point x_i to nearest centroid mu_c<br/>c* = argmin ||x_i - mu_c||^2"]
        
        UpdateStep["Update Step (Maximization):<br/>Recompute centroids as geometric mean:<br/>mu_c := (1 / |C_c|) sum x_i for x_i in C_c"]

        EmptyTrap{"Empty Cluster Detected?<br/>(|C_c| == 0)"}
        RecoverEmpty["Reassign centroid to point with largest distance from current cluster"]

        ConvCheck{"Convergence Check:<br/>Centroid drift < 1e-4 OR Iterations >= 50?"}
    end

    InitDone -- "Yes" --> AssignStep
    AssignStep --> UpdateStep
    UpdateStep --> EmptyTrap
    EmptyTrap -- "Yes" --> RecoverEmpty
    RecoverEmpty --> ConvCheck
    EmptyTrap -- "No" --> ConvCheck
    ConvCheck -- "No (Drift Exceeds 1e-4)" --> AssignStep

    %% ------------------------------------------------------------------------
    %% STAGE 4: MULTI-K EVALUATION (ELBOW & SILHOUETTE)
    %% ------------------------------------------------------------------------
    subgraph S4_MultiK_Evaluation ["Stage 4: Multi-K Evaluation & Optimization"]
        direction TB

        InertiaCalc["WCSS / Inertia Computation:<br/>Inertia = sum_k sum_{x in C_k} ||x - mu_k||^2"]
        SilhCalc["Silhouette Coefficient:<br/>s(i) = (b_i - a_i) / max(a_i, b_i)<br/>Global Score S = (1/N) sum s(i)"]

        subgraph VerifiedScores ["Empirical Findings across K in [2, 8]"]
            K2["K = 2: Inertia = 482.2 | Silhouette = 0.482"]
            K3["K = 3: Inertia = 312.4 | Silhouette = 0.524 (ELBOW POINT)"]
            K4["K = 4: Inertia = 248.8 | Silhouette = 0.561 (PEAK SILHOUETTE)"]
            K5["K = 5: Inertia = 215.3 | Silhouette = 0.508"]
        end
    end

    ConvCheck -- "Converged" --> InertiaCalc
    InertiaCalc --> SilhCalc
    SilhCalc --> VerifiedScores

    %% ------------------------------------------------------------------------
    %% STAGE 5: 2D PCA PROJECTION & VISUALIZATION
    %% ------------------------------------------------------------------------
    subgraph S5_PCA_Visualization ["Stage 5: 2D PCA Dimensionality Reduction"]
        direction TB

        Centering["Mean-Center Feature Matrix:<br/>X_tilde = X - mean(X)"]
        Covariance["Covariance Matrix:<br/>Sigma = (1/N) * X_tilde^T * X_tilde in R^(6 x 6)"]
        PowerIteration["Power Iteration with Deflation:<br/>Extract top 2 principal eigenvectors v_1, v_2"]
        Project2D["2D Projection Coordinates:<br/>z_i = [x_tilde_i^T * v_1, x_tilde_i^T * v_2] in R^2"]

        RechartsScatter["Recharts Interactive SVG Scatter Plot<br/>Points plotted on (z_1, z_2) colored by Cluster ID"]
        PersonaCards["Cluster Persona Summaries<br/>(Core Engineers, Cloud Architects, Emerging Analysts)"]
    end

    ConvCheck -- "Cluster Assignments" --> Centering
    Centering --> Covariance
    Covariance --> PowerIteration
    PowerIteration --> Project2D
    Project2D --> RechartsScatter
    RechartsScatter --> PersonaCards
```


---


## Appendix Diagram: 13 AUTH FLOW (13_auth_flow.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Decoupled Authentication and Role-Based Access Control Flow
%% File: 13_auth_flow.mmd
%% Scope: Authentication inspection, API key and Bearer token handling,
%%        role-based authorization checks, and decoupled analyst identity.
%% ============================================================================

flowchart TD
    %% ------------------------------------------------------------------------
    %% REQUEST INTAKE
    %% ------------------------------------------------------------------------
    subgraph RequestIntake ["1. Incoming API Request (Port 5001)"]
        Req["Incoming HTTP Request<br/>URL: /api/*"]
        EndpointType{"Endpoint Classification"}
    end

    Req --> EndpointType

    %% ------------------------------------------------------------------------
    %% UNPROTECTED READ-ONLY ANALYTICAL PATH
    %% ------------------------------------------------------------------------
    subgraph ReadOnlyPath ["2. Public / Analytical Read-Only Pathway"]
        ReadEndpoints["Visual Read-Only Endpoints<br/>- /api/analytics/overview<br/>- /api/analytics/career & /skills & /alumni<br/>- /api/analytics/olap<br/>- /api/analytics/warehouse/*<br/>- /api/analytics/mining/*"]
        GuestPermitted["allowGuestAnalytics Enabled<br/>Unauthenticated analyst exploration permitted"]
        ExecuteRead["Execute Controller & Return Data<br/>HTTP 200 OK"]
    end

    EndpointType -- "GET Analytical Queries" --> ReadEndpoints
    ReadEndpoints --> GuestPermitted
    GuestPermitted --> ExecuteRead

    %% ------------------------------------------------------------------------
    %% PROTECTED INGESTION & MUTATION PATH
    %% ------------------------------------------------------------------------
    subgraph ProtectedPath ["3. Protected Ingestion & Mutation Pathway"]
        MutateEndpoints["Warehouse Mutation Endpoints<br/>- POST /api/analytics/etl/upload<br/>- POST /api/analytics/etl/confirm-import<br/>- POST /api/analytics/etl/rollback-import"]
        RequireAuthMW["requireAuth Middleware<br/>(src/middleware/auth.js)"]
    end

    EndpointType -- "POST ETL Mutations" --> MutateEndpoints
    MutateEndpoints --> RequireAuthMW

    %% ------------------------------------------------------------------------
    %% AUTHENTICATION INSPECTION PIPELINE
    %% ------------------------------------------------------------------------
    subgraph AuthPipeline ["4. Header Inspection Pipeline"]
        CheckAPIKey{"x-api-key Header Present?"}
        AssignAPIKey["Assign req.user = {<br/>  id: 'dwm-analyst-001',<br/>  roles: ['ANALYST', 'RESEARCHER', 'ADMIN'],<br/>  authMethod: 'api-key'<br/>}"]
        
        CheckBearer{"Authorization Header<br/>starts with 'Bearer '?"}
        AssignBearer["Assign req.user = {<br/>  id: 'dwm-analyst-001',<br/>  roles: ['ANALYST', 'RESEARCHER', 'ADMIN'],<br/>  authMethod: 'bearer'<br/>}"]
        
        DevFallback["Standalone Development Fallback:<br/>Assign default DWM_ANALYST_USER<br/>(Roles: ANALYST, RESEARCHER, ADMIN)"]
    end

    RequireAuthMW --> CheckAPIKey
    CheckAPIKey -- "Yes" --> AssignAPIKey
    CheckAPIKey -- "No" --> CheckBearer
    CheckBearer -- "Yes" --> AssignBearer
    CheckBearer -- "No" --> DevFallback

    %% ------------------------------------------------------------------------
    %% ROLE-BASED ACCESS CONTROL (RBAC)
    %% ------------------------------------------------------------------------
    subgraph RBAC_Gate ["5. Role Authorization Gate (requireRole)"]
        RoleCheck{"req.user.roles contains<br/>required role for route?<br/>(e.g. 'ADMIN' / 'RESEARCHER')"}
        PermitAccess["Permit Request to Controller<br/>Proceed to CSV ETL Pipeline"]
        DenyAccess["HTTP 403 Forbidden<br/>{ success: false, message: 'Forbidden: requires role' }"]
    end

    AssignAPIKey --> RoleCheck
    AssignBearer --> RoleCheck
    DevFallback --> RoleCheck
    RoleCheck -- "Role Authorized" --> PermitAccess
    RoleCheck -- "Role Unauthorized" --> DenyAccess

    %% ------------------------------------------------------------------------
    %% DECOUPLING GUARANTEE NOTE
    %% ------------------------------------------------------------------------
    subgraph DecoupledCallout ["Decoupling Guarantee"]
        NoteAuth["Zero Dependency on public.users<br/>Auth is completely localized to DWM token validation<br/>with no SQL lookups against operational credentials."]
    end

    PermitAccess -.-> DecoupledCallout
```


---


## Appendix Diagram: 14 RUNTIME TOPOLOGY (14_runtime_topology.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Deployment and Runtime Topology Diagram
%% File: 14_runtime_topology.mmd
%% Scope: Independent runtime processes, port allocations, network communication,
%%        and physical vs schema-level isolation from the parent Alumni Portal.
%% ============================================================================

flowchart TB
    %% ------------------------------------------------------------------------
    %% USER BROWSER SESSIONS
    %% ------------------------------------------------------------------------
    subgraph ClientBrowser ["Analyst / User Workstation (Web Browser)"]
        Browser_DWM["DWM Analytics Cockpit Session<br/>http://localhost:5174/"]
        Browser_Portal["Operational Alumni Portal Session<br/>http://localhost:5173/"]
    end

    %% ------------------------------------------------------------------------
    %% RUNTIME HOST: DWM SUBSYSTEM
    %% ------------------------------------------------------------------------
    subgraph DWM_Subsystem ["DWM Analytical Subsystem (Independent Root: /DWM-project/)"]
        direction TB

        subgraph DWM_ClientNode ["Process: DWM Frontend Client"]
            Vite_DWM["Vite Dev Server (Node.js Process)<br/>Port: 5174<br/>Root: DWM-project/client<br/>Package: dwm-analytics-client"]
        end

        subgraph DWM_ServerNode ["Process: DWM Backend Server"]
            Express_DWM["Express API Server (Node.js Process)<br/>Port: 5001<br/>Root: DWM-project/server<br/>Package: dwm-analytics-server<br/>Env: PORT=5001, PG_SCHEMA=dwh"]
        end
    end

    Browser_DWM -- "HTTP (Port 5174)" --> Vite_DWM
    Vite_DWM -.->|"Axios API Calls (Port 5001)"| Express_DWM

    %% ------------------------------------------------------------------------
    %% RUNTIME HOST: OPERATIONAL PORTAL SUBSYSTEM
    %% ------------------------------------------------------------------------
    subgraph Operational_Subsystem ["Parent Alumni Portal Application (Root: /)"]
        direction TB

        subgraph Portal_ClientNode ["Process: Operational Client"]
            Vite_Portal["Vite Dev Server (Node.js Process)<br/>Port: 5173<br/>Root: client/<br/>Package: alumni-network-portal"]
        end

        subgraph Portal_ServerNode ["Process: Operational Backend"]
            Express_Portal["Express API Server (Node.js Process)<br/>Port: 5000<br/>Root: server/<br/>Package: alumni-network-server<br/>Env: PORT=5000"]
        end
    end

    Browser_Portal -- "HTTP (Port 5173)" --> Vite_Portal
    Vite_Portal -.->|"Axios API Calls (Port 5000)"| Express_Portal

    %% ------------------------------------------------------------------------
    %% STORAGE TIER & SCHEMA ISOLATION
    %% ------------------------------------------------------------------------
    subgraph DatabaseInstance ["PostgreSQL Database Server (Port 54329 - Embedded PGlite)"]
        direction TB

        subgraph DWH_Storage ["Analytical Schema: 'dwh'"]
            DWH_Tables[("15 Analytical Tables<br/>(56,732 Records)<br/>- 6 Conformed Dimensions<br/>- 3 Multivalued Bridges<br/>- 4 Analytical Facts<br/>- 2 Ingestion Ledgers")]
        end

        subgraph Public_Storage ["Operational Schema: 'public'"]
            Public_Tables[("Operational OLTP Tables<br/>- users (36 accounts)<br/>- jobs, posts, applications<br/>- messages, notifications")]
        end
    end

    Express_DWM -- "TCP Socket Connection<br/>DATABASE_URL on Port 54329<br/>search_path = dwh" --> DWH_Storage
    Express_Portal -- "TCP Socket Connection<br/>DATABASE_URL on Port 54329<br/>search_path = public" --> Public_Storage

    %% ------------------------------------------------------------------------
    %% PHYSICAL & LOGICAL BOUNDARIES
    %% ------------------------------------------------------------------------
    DWH_Storage <-.->|"ZERO Cross-Schema Foreign Keys<br/>ZERO Operational Replication Triggers<br/>Complete Transactional Isolation"| Public_Storage
```


---


## Appendix Diagram: 15 RESEARCH METHODOLOGY (15_research_methodology.mmd)

```mermaid
%% ============================================================================
%% DWM Platform - Academic Research Methodology & Experimental Framework
%% File: 15_research_methodology.mmd
%% Scope: Research lifecycle from domain problem definition through benchmark
%%        generation, constellation warehousing, multi-mining experiments,
%%        evaluation metrics, threats to validity, and future work.
%% ============================================================================

flowchart TD
    %% ------------------------------------------------------------------------
    %% STAGE 1: PROBLEM DEFINITION & OBJECTIVES
    %% ------------------------------------------------------------------------
    subgraph S1_ProblemDef ["1. Problem Definition & Institutional Objectives"]
        direction TB
        DomainPain["Institutional Bottlenecks:<br/>- Higher-ed data fragmentation across operational silos<br/>- Curriculum disconnect from enterprise competency demands<br/>- Accreditation mandates for 6-month graduate outcome tracking"]
        Objectives["Research Objectives (O1 - O4):<br/>- O1: Decoupled Fact Constellation Warehouse Design<br/>- O2: Interactive OLAP Multidimensional Cube Engine<br/>- O3: Multi-Modal Competency Association Mining (Apriori)<br/>- O4: Leakage-Safe Supervised Outcome Prediction"]
    end

    DomainPain --> Objectives

    %% ------------------------------------------------------------------------
    %% STAGE 2: BENCHMARK DATASET SYNTHESIS
    %% ------------------------------------------------------------------------
    subgraph S2_DatasetPrep ["2. Benchmark Dataset Preparation"]
        direction TB
        Generator["Deterministic Python Generator (generate_dwm_datasets.py)<br/>Empirical Indian academic distributions, skill taxonomy, corporate tiers"]
        RawCSV["7 Physical Benchmark CSV Datasets (50,150 Records / 4.95 MB)<br/>skills, alumni, jobs, alumni_skills, job_skills, applications, outcomes"]
        SyntheticCaveat["ETHICAL DISCLOSURE:<br/>Explicit synthetic benchmark marking to prevent commercial misrepresentation"]
    end

    Objectives --> Generator
    Generator --> RawCSV
    RawCSV --> SyntheticCaveat

    %% ------------------------------------------------------------------------
    %% STAGE 3: WAREHOUSE MODELING & AUDITING
    %% ------------------------------------------------------------------------
    subgraph S3_WarehouseModeling ["3. Dimensional Modeling & Quality Auditing"]
        direction TB
        ConstellationDesign["Fact Constellation Schema (15 Tables / 22 Foreign Keys)<br/>- 6 Conformed Dimensions with Surrogate Keys (_sk)<br/>- 3 Multivalued Bridges (M:N skill competencies)<br/>- 4 Fact Tables with Enforced Grain Constraints"]
        PrecomputedCalendar["Conformed Pre-Computed Date Calendar (2018-2030, 4,748 rows)<br/>Academic cycles ('2023-2024') & terms ('Odd-Fall' / 'Even-Spring')"]
        QualityAudit["Automated Integrity Audit (38 Checks Matrix)<br/>37 passed / 1 warning for 46 logged test rejections"]
    end

    SyntheticCaveat --> ConstellationDesign
    ConstellationDesign --> PrecomputedCalendar
    PrecomputedCalendar --> QualityAudit

    %% ------------------------------------------------------------------------
    %% STAGE 4: OLAP MULTIDIMENSIONAL EXPLORATION
    %% ------------------------------------------------------------------------
    subgraph S4_OLAP_Analysis ["4. OLAP Multidimensional Cube Execution"]
        direction TB
        OLAP_Ops["5 Canonical OLAP Operations:<br/>- Roll-Up: Institutional summary aggregates<br/>- Drill-Down: Department to corporate breakdowns<br/>- Slice: Department, Tier, Year equality filters<br/>- Dice: Multi-axis bounding box LPA thresholds<br/>- Pivot: 2D Matrix cross-tabulations with marginal totals"]
        ExactStats["Exact Continuous Medians via PERCENTILE_CONT(0.5)<br/>Whitelist-enforced SQL injection immunity"]
    end

    QualityAudit --> OLAP_Ops
    OLAP_Ops --> ExactStats

    %% ------------------------------------------------------------------------
    %% STAGE 5: DATA MINING EXPERIMENTS
    %% ------------------------------------------------------------------------
    subgraph S5_DataMiningExperiments ["5. Tri-Pillar Data Mining Experiments"]
        direction TB

        Exp_Apriori["Pillar 1: Apriori Association Rule Mining<br/>- Mode A (2,000 alumni) vs Mode B (5,000 jobs)<br/>- Candidate gen, subset pruning, Support, Confidence, Lift<br/>- Result: {Docker, K8s} => {AWS} (Conf: 74.2%, Lift: 1.48x)"]

        Exp_Clustering["Pillar 2: Unsupervised Profile Clustering<br/>- K-Means++ with Mulberry32 PRNG (seed 2026)<br/>- Multi-K WCSS Elbow (K=3) & Peak Silhouette (K=4: 0.561)<br/>- Power Iteration 2D PCA visual scatter projection"]

        Exp_Classifier["Pillar 3: Supervised Employability Prediction<br/>- Regularized Logistic Regression (L2=0.002, Balanced Loss)<br/>- Zero Leakage: Preprocessor fit strictly on 80% train partition<br/>- Result: 78.3% Test Acc, 82.1% Prec, 87.5% Rec, ROC-AUC = 0.812"]
    end

    ExactStats --> Exp_Apriori
    ExactStats --> Exp_Clustering
    ExactStats --> Exp_Classifier

    %% ------------------------------------------------------------------------
    %% STAGE 6: EVALUATION & RIGOROUS VERIFICATION
    %% ------------------------------------------------------------------------
    subgraph S6_EvaluationVerification ["6. Empirical Evaluation & Quality Assurance"]
        direction TB
        TestSuite["Automated Test Harness (node:test)<br/>78 Tests / 100% Pass Rate / Hand-calculated fixtures"]
        EvidenceRegister["Evidence & Claim Register<br/>25 master claims mapped to source code symbols and DB queries"]
    end

    Exp_Apriori --> TestSuite
    Exp_Clustering --> TestSuite
    Exp_Classifier --> TestSuite
    TestSuite --> EvidenceRegister

    %% ------------------------------------------------------------------------
    %% STAGE 7: THREATS TO VALIDITY & FUTURE WORK
    %% ------------------------------------------------------------------------
    subgraph S7_ValidityFuture ["7. Threats to Validity & Future Roadmap"]
        direction TB
        Threats["Threats to Validity:<br/>- Synthetic data distributions vs real-world employment shifts<br/>- In-memory Node.js V8 heap limits for multi-million scale"]
        FutureRoadmap["Proposed Future Extensions:<br/>- Heterogeneous Graph Neural Networks (GNN) on student-skill graphs<br/>- Non-linear Gradient Boosted Trees (XGBoost)<br/>- Automated closed-loop curricular recommender systems"]
    end

    EvidenceRegister --> Threats
    Threats --> FutureRoadmap
```


---
