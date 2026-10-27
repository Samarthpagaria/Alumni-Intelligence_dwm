import net from 'node:net'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import config from './env.js'
import logger from '../utils/logger.js'

let embeddedDevPg = null
let isEnsuring = false

function isPortOpen(port, host = '127.0.0.1', timeoutMs = 600) {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    socket.setTimeout(timeoutMs)
    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('error', () => {
      socket.destroy()
      resolve(false)
    })
    socket.once('timeout', () => {
      socket.destroy()
      resolve(false)
    })
    socket.connect(port, host)
  })
}

export async function ensureDwmDatabase() {
  if (config.isProduction || config.isTest) return
  if (isEnsuring) return
  isEnsuring = true

  try {
    let url
    try {
      url = new URL(config.database.url)
    } catch {
      return
    }

    if (url.port === '54329' && (url.hostname === '127.0.0.1' || url.hostname === 'localhost')) {
      const isRunning = await isPortOpen(54329)
      if (!isRunning) {
        logger.info('No external PostgreSQL detected on port 54329; auto-starting embedded development database...')
        try {
          const here = path.dirname(fileURLToPath(import.meta.url))
          const devPgPath = path.resolve(here, '../../../../server/scripts/dev-postgres.js')
          const { startDevPg } = await import(pathToFileURL(devPgPath).href)
          embeddedDevPg = await startDevPg({ quiet: false, registerSignals: false })

          for (let i = 0; i < 15; i++) {
            if (await isPortOpen(54329)) break
            await new Promise((r) => setTimeout(r, 100))
          }
          logger.info('Embedded development database is listening on 127.0.0.1:54329')
        } catch (err) {
          logger.warn('Failed to auto-start embedded development database', { error: err.message })
        }
      }
    }
  } finally {
    isEnsuring = false
  }
}

export async function stopEmbeddedDwmDatabase() {
  if (embeddedDevPg && typeof embeddedDevPg.stop === 'function') {
    await embeddedDevPg.stop()
    embeddedDevPg = null
  }
}
