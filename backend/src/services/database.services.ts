import sql, { ConnectionPool } from 'mssql'
import { envConfig } from '~/constants/config'

const sqlConfig: sql.config = {
  user: envConfig.dbUser,
  password: envConfig.dbPassword,
  database: envConfig.dbName,
  server: envConfig.dbHost,
  port: envConfig.dbPort,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

class DatabaseService {
  private pool: ConnectionPool | null = null

  constructor() {}

  async connect() {
    try {
      this.pool = await new sql.ConnectionPool(sqlConfig).connect()
      console.log(`Connected to SQL Server Database: ${envConfig.dbName}`)
    } catch (err) {
      console.error('Database Connection Failed! Details:', err)
      process.exit(1)
    }
  }

  get connection(): ConnectionPool {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.pool
  }

  async query(queryString: string, params?: { name: string; type: any; value: any }[]) {
    if (!this.pool) return null
    const request = this.pool.request()

    if (params) {
      params.forEach((p) => {
        request.input(p.name, p.type, p.value)
      })
    }

    return await request.query(queryString)
  }
}

const databaseService = new DatabaseService()
export default databaseService
export { sql }
