import express from 'express';
import bodyParser from 'body-parser';

import router from "./routes/places-routes"

const app=express();
app.use("/api/places",router);
//below gets executes for error
app.use((error,req,res,next)=>{
    if(res.headerSent){
        next(error)
    }
    res.status(error.code||500);
    res.json({message:error.message||'An Unknown error has occured'})
})
app.listen(5000,()=>console.log('ok'))