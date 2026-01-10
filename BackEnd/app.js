import express from 'express'
import cors from 'cors'
 import AdminLoginRoute from './Routes/LoginAdmin.js'
//import product
import ProductRoute from './Routes/ProductRoute.js'
//import Category
import CategoryRoute from './Routes/CategoryRoute.js'
const app = express()

 app.use(cors())
 app.use(express.json())
 
  app.use('/aip/adimn',AdminLoginRoute)
   app.use('/Product',ProductRoute)
   app.use('/Category',CategoryRoute)


export default app