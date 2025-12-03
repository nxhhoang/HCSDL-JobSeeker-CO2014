import databaseService from '~/services/database.services'
import { envConfig, isProduction } from '~/constants/config'
import cors, { CorsOptions } from 'cors'
import rateLimit from 'express-rate-limit'
import express from 'express'
import metadataRouter from './routes/metadata.routes'

const app = express()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})
app.use(limiter)

const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*'
}
app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/v1', metadataRouter)

databaseService.connect().then(() => {
  app.listen(envConfig.port, () => {
    console.log(`App is listening on port ${envConfig.port}`)
  })
})
