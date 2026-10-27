# Phase 5: Advanced Data Mining Implementation & Academic Viva Guide
## Alumni Intelligence & Career Analytics Platform

> **Module Status:** Verified and Integrated  
> **Backend Implementation:** Native Pure-JavaScript ML Engine (`server/src/services/datamining/`)  
> **Database:** Local PostgreSQL Warehouse (`dwh` schema on PGlite)  
> **Frontend:** Interactive Analytics Cockpit (`client/src/pages/analytics/AnalyticsMining.jsx`)

---

## 1. Executive Summary & Audit Reconciliation

### 1.1 Warehouse Row Count Reconciliation (Phase 4.6 Audit)
In the Phase 4.6 dataset import audit, the previous report noted **50,797** total warehouse rows, while the sum of the eight prominent entity tables was calculated at **48,230** rows (an apparent discrepancy of **2,567** rows).

Through automated schema queries (`audit-dwh-inventory.mjs`), the exact difference was reconciled down to the single digit:

$$\text{8 Prominent Tables (48,230)} + \text{dim\_student (308)} + \text{fact\_placement (259)} + \text{fact\_career\_outcomes (2,000)} = \mathbf{50,797}$$

#### Complete Inventory Breakdown:
| Warehouse Table | Schema Entity | Record Count | Source Breakdown |
|---|---|---:|---|
| `dwh.dim_student` | Student Dimension | 308 | Operational (308) |
| `dwh.dim_alumni` | Alumni Dimension | 2,024 | Operational (24) + Synthetic (2,000) |
| `dwh.dim_company` | Employer Dimension | 39 | Operational (39) |
| `dwh.dim_skill` | Technical Skill Catalog | 163 | Operational (13) + Synthetic (150) |
| `dwh.dim_job` | Job Postings Dimension | 5,000 | Synthetic (5,000) |
| `dwh.fact_placement` | Historical Placements | 259 | Operational (259) |
| `dwh.fact_job_application` | Job Applications | 6,004 | Operational (4) + Synthetic (6,000) |
| `dwh.fact_career_outcomes` | 6-Month Career Outcomes | 2,000 | Synthetic Educational Benchmarks (2,000) |
| `dwh.bridge_alumni_skill` | Alumni $\leftrightarrow$ Skill Bridge | 20,000 | Synthetic (20,000) |
| `dwh.bridge_job_skill` | Job $\leftrightarrow$ Skill Bridge | 15,000 | Synthetic (15,000) |
| **Primary DWM Entity Total** | | **50,797** | |
| `dwh.dim_date` | Academic Calendar Dimension | 4,748 | Generated Calendar (2018–2030) |
| `dwh.bridge_student_skill` | Student $\leftrightarrow$ Skill Bridge | 921 | Operational (921) |
| `dwh.fact_salary_benchmark` | Salary Experience Bands | 24 | Operational Benchmark (24) |
| `dwh.etl_batches` | ETL Ingestion Audit Ledger | 38 | System Execution Logs |
| **Grand Total Across All DWH Tables** | | **56,528** | |

---

## 2. Core Data Mining Algorithms

### 2.1 Module A: K-Means Clustering for Alumni Career Profiling
- **Objective:** Discover natural segments among 2,000 alumni based on their technical skill indicator profiles and normalized professional experience.
- **Initialization:** K-Means++ algorithm (selects first centroid uniformly at random; subsequent $k-1$ centroids chosen with probability proportional to squared distance $D(x)^2$).
- **Deterministic Reproducibility:** Uses seeded Mulberry32 pseudo-random number generator (PRNG) to guarantee exact reproducibility across runs.
- **Empty Cluster Safeguard:** Reassigns centroid to the observation with the largest squared distance to prevent degenerate clusters.
- **Multi-k Evaluation:** Computes Within-Cluster Sum of Squares (WCSS / Inertia) and Silhouette Scores across $k \in [2, 7]$.
- **2D Dimensionality Reduction:** Power-iteration Principal Component Analysis (PCA) projects multi-dimensional feature space onto 2 principal eigenvectors for responsive SVG scatter plot visualization.

#### Mathematical Formulations:
1. **WCSS / Inertia:**
   $$\text{WCSS} = \sum_{c=1}^k \sum_{x \in S_c} \|x - \mu_c\|^2$$
2. **Silhouette Coefficient:**
   $$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}, \quad s(i) \in [-1, +1]$$
   - $a(i)$: Mean intra-cluster distance between $i$ and all other points in the same cluster.
   - $b(i)$: Mean nearest-cluster distance between $i$ and points in the closest neighboring cluster.

---

### 2.2 Module B: Apriori Association Rule Mining
- **Objective:** Discover frequent skill combinations and conditional dependencies across three analysis modes:
  1. `alumni_skills`: Transaction basket per unique alumnus ($N=2,000$).
  2. `job_skills`: Transaction basket per job posting ($N=5,000$).
  3. `career_outcomes`: Transaction basket per career outcome with explicit placement target item (`Target:Placed_6M` or `Target:Not_Placed_6M`).
- **Level-wise Search:** Generates candidate $k$-itemsets from frequent $(k-1)$-itemsets using the Apriori Join and Prune property (every subset of a frequent itemset must also be frequent).
- **Redundancy & Overlap Controls:** Strictly enforces that Antecedent and Consequent are non-empty and mutually disjoint ($A \cap B = \emptyset$).

#### Mathematical Formulations:
1. **Support:**
   $$\text{Support}(A \Rightarrow B) = \frac{\sigma(A \cup B)}{N}$$
2. **Confidence:**
   $$\text{Confidence}(A \Rightarrow B) = \frac{\sigma(A \cup B)}{\sigma(A)} = P(B \mid A)$$
3. **Lift:**
   $$\text{Lift}(A \Rightarrow B) = \frac{\text{Confidence}(A \Rightarrow B)}{\text{Support}(B)} = \frac{P(B \mid A)}{P(B)}$$
   - $\text{Lift} > 1.0$: Positive correlation (occurrence of $A$ increases probability of $B$).
   - $\text{Lift} = 1.0$: Independence.
   - $\text{Lift} < 1.0$: Negative correlation / substitutive relationship.

---

### 2.3 Module C: Supervised Classification for Career Outcome Prediction
- **Target Variable:** `dwh.fact_career_outcomes.employed_within_6_months` (Binary: 1 = Placed within 6 months, 0 = Extended search).
- **Target Provenance Disclosure:** Prominently flagged as an educational synthetic curriculum target.
- **Leakage Prevention:**
  - Strict stratified train/test split (default 80% train, 20% test).
  - Preprocessing (skill feature frequency ranking, min-max scaling of experience) is fitted **strictly on the training partition**. The test partition is transformed using frozen training scalers.
  - Zero target leakage: No post-observation variables (such as actual starting salary or company name) are included as features.
- **Algorithm:** Regularized Logistic Regression with Batch Gradient Descent:
  $$P(y = 1 \mid x) = \sigma(w \cdot x + b) = \frac{1}{1 + e^{-(w \cdot x + b)}}$$
  With balanced class weighting ($w_0 = \frac{N}{2N_0}, w_1 = \frac{N}{2N_1}$) to address the 72.75% / 27.25% class imbalance.
- **Evaluation on Held-Out Test Set:**
  - Accuracy, Precision, Recall, F1 Score
  - $2 \times 2$ Confusion Matrix (TP, FP, TN, FN)
  - Area Under the ROC Curve (ROC-AUC) via trapezoidal integration
  - Majority Class Baseline Comparison ($\Delta \text{Accuracy}$)
  - Feature Importance (Learned weights/coefficients showing positive and negative skill signals)
- **Interactive Inference:** Real-time prediction endpoint (`/classification/predict`) accepting candidate skill sets and experience years.

---

## 3. Academic Viva Preparation & Q&A

### Q1: Why use K-Means++ instead of standard random initialization?
> **Answer:** Standard K-Means chooses initial centroids completely at random, which frequently places multiple centroids in the same dense cluster, leading to slow convergence or suboptimal local minima. K-Means++ chooses the first centroid randomly, and then chooses subsequent centroids with probability proportional to squared distance $D(x)^2$ from existing centroids. This spreads initial centroids across the feature space, yielding provably $O(\log k)$-competitive initial clustering and faster convergence.

### Q2: What is the difference between Support, Confidence, and Lift in Apriori?
> **Answer:**
> - **Support** measures rule popularity: what percentage of all transactions contain both $A$ and $B$? High support ensures the rule is statistically common.
> - **Confidence** measures rule reliability: if a transaction contains $A$, what is the conditional probability that it also contains $B$?
> - **Lift** measures rule strength beyond independence: if $B$ is already very common (e.g. 90% of students know Git), high confidence alone can be misleading. Lift divides confidence by the prior support of $B$. A Lift $> 1.0$ indicates that knowing $A$ genuinely increases the likelihood of having $B$.

### Q3: How did you prevent Data Leakage during Classification?
> **Answer:**
> 1. **Temporal separation:** We only extracted pre-outcome features (candidate skills and experience at the observation threshold), excluding post-placement variables.
> 2. **Pipeline separation:** The stratified 80/20 train/test split was performed before any feature transformation. The min-max scaler for experience and the selection of top 30 skill dimensions were computed strictly on the training set. The test set was transformed using the training parameters, ensuring test data never informed model training.

### Q4: Why is testing on synthetic data limited?
> **Answer:** Synthetic datasets are generated from underlying probabilistic rules and parameter distributions. Supervised learning models will learn these generative rules accurately, resulting in clean metrics on held-out synthetic test sets. However, synthetic data lacks real-world human noise, macroeconomic hiring freezes, and qualitative interview dynamics. High performance on synthetic benchmarks demonstrates algorithmic correctness, not commercial hiring efficacy.

---

## 4. API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/datamining/summary` | Mining inventory counts, dataset sizes, and educational notice |
| `GET` | `/api/analytics/datamining/clustering` | Runs K-Means ($k$, seed, source) and returns cluster profiles & PCA coordinates |
| `GET` | `/api/analytics/datamining/clustering/evaluation` | Computes Inertia & Silhouette across candidate $k \in [2..8]$ |
| `GET` | `/api/analytics/datamining/association-rules` | Mines Apriori rules across 3 modes with support, confidence, lift |
| `GET` | `/api/analytics/datamining/classification/metadata` | Returns target schema, labeled record counts, and model status |
| `POST` | `/api/analytics/datamining/classification/train` | Trains Logistic Regression classifier with held-out test evaluation |
| `POST` | `/api/analytics/datamining/classification/predict` | Computes live placement probability for candidate profile |
