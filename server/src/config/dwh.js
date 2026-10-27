/**
 * Data Warehouse Configuration and Schema Access Helper for DWM Project.
 * Isolates all analytical operations exclusively to the 'dwh' schema.
 */
import pool, { query as execQuery, withTransaction } from './database.js'

export const DWH_SCHEMA = 'dwh'

export async function ensureDwhSchema(client = null) {
  const runner = client ? client.query.bind(client) : execQuery
  await runner(`CREATE SCHEMA IF NOT EXISTS ${DWH_SCHEMA};`)
}

export async function queryDwh(text, params) {
  return execQuery(text, params)
}

export default {
  schema: DWH_SCHEMA,
  ensureDwhSchema,
  queryDwh,
  withTransaction,
  pool,
}
