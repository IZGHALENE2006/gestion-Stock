import express from 'express'
import cors from 'cors'
 import AdminLoginRoute from './Routes/LoginAdmin.js'
//import product
import ProductRoute from './Routes/ProductRoute.js'
//import Category
import CategoryRoute from './Routes/CategoryRoute.js'
//imoprt Employe
import EmployeRoute from './Routes/EmployeRoute.js'
//import getme
import GetMeRoute from './Routes/getMeRoute.js'
// impotr ventes
import ventesRoute from './Routes/routeVents.js'

const app = express()

 app.use(cors())
 app.use(express.json())
 
  app.use('/aip/adimn',AdminLoginRoute)
   app.use('/Product',ProductRoute)
   app.use('/Category',CategoryRoute)
   app.use('/Employe',EmployeRoute)
   app.use('/user',GetMeRoute)
   app.use('/addVentes',ventesRoute)


export default app