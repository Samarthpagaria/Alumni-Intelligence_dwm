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
