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
//import Fournisseur
import FournisseurRoute from './Routes/FournisseurRoute.js'
//import User Cridite 
import UserCriditeRoute from './Routes/Usercridite.js'
const app = express()

 app.use(cors())
 app.use(express.json())
 
  app.use('/api/admin',AdminLoginRoute)
   app.use('/Product',ProductRoute)
   app.use('/Category',CategoryRoute)
   app.use('/Employe',EmployeRoute)
   app.use('/user',GetMeRoute)
   app.use('/addVentes',ventesRoute)
   app.use('/Fournisseur',FournisseurRoute)
   app.use('/usercridite',UserCriditeRoute)


export default app