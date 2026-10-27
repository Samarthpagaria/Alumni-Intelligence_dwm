/**
 * Zero-install local PostgreSQL for DWM development and CI.
 *
 * Runs PGlite (PostgreSQL compiled to WebAssembly) behind the standard
 * PostgreSQL wire protocol on port 54329, so the `pg` driver, migrations,
 * and analytical warehouse code connect seamlessly without requiring an external PostgreSQL server.
 */
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const projectRoot = path.resolve(serverDir, '..')
const defaultPort = Number.parseInt(process.env.DEV_PG_PORT ?? '54329', 10)
const defaultDataDir = process.env.DEV_PG_DATA_DIR ?? path.join(projectRoot, '.dev-postgres')

export async function startDevPg({
  port = defaultPort,
  dataDir = defaultDataDir,
  quiet = false,
  registerSignals = true,
} = {}) {
  // Clean dangling lock file if an earlier process exited uncleanly
  try {
    await fs.rm(path.join(dataDir, 'postmaster.pid'), { force: true })
  } catch {
    // ignore
  }

  let db
  try {
    db = await PGlite.create({ dataDir })
  } catch (err) {
    if (!quiet) {
      process.stderr.write(`PGlite data directory was unrecoverable (${err.message}), reinitializing...\n`)
    }
    await fs.rm(dataDir, { recursive: true, force: true })
    db = await PGlite.create({ dataDir })
  }

  // Ensure DWM analytical schema and migrations are applied
  try {
    const { rows } = await db.query("SELECT to_regclass('dwh.dim_student') as exists")
    if (!rows[0]?.exists) {
      if (!quiet) process.stdout.write('Initializing DWM analytical warehouse schema and tables...\n')
      const databaseDir = path.resolve(projectRoot, 'database')
      const migFiles = (await fs.readdir(databaseDir))
        .filter((f) => f.endsWith('.sql') && !f.endsWith('.down.sql'))
        .sort()

      for (const file of migFiles) {
        if (!quiet) process.stdout.write(`  Applying migration ${file}...\n`)
        const sql = await fs.readFile(path.join(databaseDir, file), 'utf8')
        await db.exec(sql)
      }
      if (!quiet) process.stdout.write('DWM warehouse schema initialized successfully.\n')
    }
  } catch (setupErr) {
    if (!quiet) process.stderr.write(`Warning: Failed to auto-initialize warehouse schema: ${setupErr.message}\n`)
  }

  const server = new PGLiteSocketServer({ db, port, host: '127.0.0.1', maxConnections: 50 })
  await server.start()

  if (!quiet) {
    process.stdout.write(
      `DWM dev postgres listening on 127.0.0.1:${port}\n`
      + `Data directory: ${dataDir}\n`
      + `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:${port}/postgres\n`,
    )
  }

  const stop = async () => {
    try {
      await server.stop()
      await db.close()
    } catch {
      // ignore
    }
  }

  if (registerSignals) {
    const handleExit = async () => {
      await stop()
      process.exit(0)
    }
    process.on('SIGINT', handleExit)
    process.on('SIGTERM', handleExit)
  }

  return { server, db, stop }
}

// Direct CLI invocation: node scripts/dev-postgres.js
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  startDevPg({ quiet: false, registerSignals: true }).catch((err) => {
    process.stderr.write(`Failed to start DWM dev-postgres: ${err.message}\n`)
    process.exit(1)
  })
}
