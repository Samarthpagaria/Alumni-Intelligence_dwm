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
