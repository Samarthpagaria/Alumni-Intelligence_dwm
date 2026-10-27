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
