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

