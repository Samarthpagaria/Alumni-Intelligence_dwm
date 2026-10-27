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
