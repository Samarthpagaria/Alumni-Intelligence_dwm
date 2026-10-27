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
