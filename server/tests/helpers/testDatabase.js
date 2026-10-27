/**
 * Boots a private, in-memory PGlite for the DWM integration suite.
 * Applies DWM warehouse migrations directly from DWM-project/database.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'

const here = path.dirname(fileURLToPath(import.meta.url))
const dwmRoot = path.resolve(here, '..', '..', '..')

export const TEST_PG_PORT = Number.parseInt(process.env.TEST_PG_PORT ?? '54331', 10)

let db
let server

export async function startTestDatabase() {
  db = await PGlite.create({ dataDir: 'memory://' })
  server = new PGLiteSocketServer({ db, port: TEST_PG_PORT, host: '127.0.0.1', maxConnections: 50 })
  await server.start()

  process.env.DATABASE_URL =
    `postgresql://postgres:postgres@127.0.0.1:${TEST_PG_PORT}/postgres`

  await applyDwhMigrations()

  return process.env.DATABASE_URL
}

async function applyDwhMigrations() {
  const dir = path.join(dwmRoot, 'database')
  const files = (await fs.readdir(dir))
    .filter((f) => f.endsWith('.sql') && !f.endsWith('.down.sql'))
    .sort()
  for (const file of files) {
    const sql = await fs.readFile(path.join(dir, file), 'utf8')
    try {
      await db.exec(sql)
    } catch (error) {
      throw new Error(`DWM migration ${file} failed: ${error.message}`)
    }
  }
  return files.length
}

export async function stopTestDatabase() {
  if (server) await server.stop()
  if (db) await db.close()
  server = undefined
  db = undefined
}

export async function directQuery(text, params = []) {
  const result = await db.query(text, params)
  return { rows: result.rows, rowCount: result.affectedRows }
}
