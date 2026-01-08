    import express from 'express'
    import cors from 'cors'
    import AdminRoute from './Routes/Adminrout.js'
    import AdminLoginRoute from './Routes/LoginAdmin.js'

    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use('/api/Admin',AdminRoute)
    app.use('/LoginAdmin',AdminLoginRoute)


    export default app