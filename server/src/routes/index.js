import { Router } from 'express'
import analyticsRoutes from './analyticsRoutes.js'
import dataminingRoutes from './dataminingRoutes.js'
import { checkDatabaseConnection } from '../config/database.js'

const router = Router()

// Liveness & health probe
router.get('/health', async (_req, res) => {
  const dbHealth = await checkDatabaseConnection()
  res.json({
    status: dbHealth.ok ? 'healthy' : 'degraded',
    service: 'DWM Analytics Subsystem',
    database: dbHealth,
    timestamp: new Date().toISOString(),
  })
})

// Analytics & OLAP & Warehouse routes
router.use('/analytics', analyticsRoutes)
router.use('/datamining', dataminingRoutes)
router.use('/mining', dataminingRoutes)

export default router
