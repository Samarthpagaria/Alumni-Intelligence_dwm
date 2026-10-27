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
