import databaseService from '~/services/database.services'
import { envConfig, isProduction } from '~/constants/config'
import cors, { CorsOptions } from 'cors'
import { createServer } from 'http'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import express from 'express'
import metadataRouter from './routes/metadata.routes'
import initSocket from './utils/socket'
import authRouter from './routes/auth.routes'
import usersRouter from './routes/users.routes'
import candidatesRouter from './routes/candidates.routes'
import employersRouter, { companiesRouter } from './routes/employers.routes'
import jobsRouter from './routes/jobs.routes'
import applicationsRouter from './routes/applications.routes'
import interactionsRouter from './routes/interactions.routes'
import adminRouter from './routes/admin.routes'

const app = express()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})
app.use(limiter)

const httpServer = createServer(app)
app.use(helmet())
const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*'
}
app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/v1', metadataRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/candidates', candidatesRouter)
app.use('/api/v1/employers', employersRouter)
app.use('/api/v1/companies', companiesRouter)
app.use('/api/v1/jobs', jobsRouter)
app.use('/api/v1/application', applicationsRouter)
app.use('/api/v1/interaction', interactionsRouter)
app.use('/api/v1/admin', adminRouter)

initSocket(httpServer)

databaseService.connect().then(() => {
  httpServer.listen(envConfig.port, () => {
    console.log(`App is listening on port ${envConfig.port}`)
  })
})
