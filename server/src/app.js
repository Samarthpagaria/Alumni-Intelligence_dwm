import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import config from './config/env.js'
import routes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import {
  attachRequestId, requestLogger, setSecurityHeaders,
} from './middleware/security.js'

const app = express()

app.set('trust proxy', 1)
app.disable('x-powered-by')

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}))

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))

app.use(attachRequestId)
app.use(setSecurityHeaders)
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true, limit: '15mb' }))
app.use(requestLogger)

// Mount both with /api prefix and direct root for maximum client compatibility
app.use('/api', routes)
app.use('/', routes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
