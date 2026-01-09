    import express from 'express'
    import cors from 'cors'
    import AdminRoute from './Routes/Adminrout.js'
    import AdminLoginRoute from './Routes/LoginAdmin.js'
//import product
    import ProductRoute from './Routes/ProductRoute.js'
    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use('/api/Admin',AdminRoute)
    app.use('/LoginAdmin',AdminLoginRoute)
    app.use('/Product',ProductRoute)


    export default app