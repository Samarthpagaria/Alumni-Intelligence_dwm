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

