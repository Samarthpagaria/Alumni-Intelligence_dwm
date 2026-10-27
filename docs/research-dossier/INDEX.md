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

