import dotenv from 'dotenv'
import path from 'node:path'

// Load environment variables from DWM-project root or server directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(process.cwd(), '../.env') })

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || process.env.DWM_PORT || '5001', 10),
  clientUrl: process.env.CLIENT_URL || process.env.DWM_CLIENT_URL || 'http://localhost:5174',
  database: {
    url: process.env.DWM_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54329/postgres',
    ssl: process.env.DATABASE_SSL === 'true',
    poolMax: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
  },
  uploads: {
    maxBytes: 15 * 1024 * 1024, // 15MB
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dwm-standalone-secret-key-32-chars-min!!',
    accessExpiresIn: '1h',
  },
}

export default env
