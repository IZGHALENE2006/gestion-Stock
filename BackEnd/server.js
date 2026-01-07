import express from 'express'


const app = express()
app.get('/users',(req,res)=>{
    res.json({mesage:"hello"})
})
app.listen(4000,()=>{
   console.log('success '); 
})
