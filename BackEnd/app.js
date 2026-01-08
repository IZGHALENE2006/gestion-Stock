import express from 'express'
import cors from 'cors'
import AdminRoute from './Routes/Adminrout.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/Admin',AdminRoute)


export default app