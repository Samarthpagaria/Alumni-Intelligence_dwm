import app from './src/app.js'
import config from './src/config/env.js'
import logger from './src/utils/logger.js'
import { checkDatabaseConnection } from './src/config/database.js'
import { ensureDwmDatabase, stopEmbeddedDwmDatabase } from './src/config/devDbAutoStart.js'

const port = config.port

async function startServer() {
  await ensureDwmDatabase()

  const dbStatus = await checkDatabaseConnection()
  if (dbStatus.ok) {
    logger.info(`Connected to DWM Warehouse database (latency: ${dbStatus.latencyMs}ms)`)
  } else {
    logger.warn(`DWM Warehouse database connection pending/warning: ${dbStatus.reason}`)
  }

  const server = app.listen(port, () => {
    logger.info(`DWM Analytical Subsystem Server listening on port ${port}`)
    logger.info(`API Base URL: http://localhost:${port}/api/analytics`)
    logger.info(`DWM Client CORS allowed: ${config.clientUrl}`)
  })

  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Shutting down DWM server...`)
    await stopEmbeddedDwmDatabase().catch(() => {})
    server.close(() => {
      logger.info('DWM server closed.')
      process.exit(0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

startServer().catch((err) => {
  logger.error('Failed to start DWM server:', { error: err.stack })
  process.exit(1)
})
