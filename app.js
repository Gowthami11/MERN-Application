import express from 'express';
import HttpError from './models/HttpError';
import router from "./routes/places-routes"

const app=express();
app.use(express.json())
app.use("/api/places",router);

//to handle no routes
app.use((req,res,next)=>{
    const error=new HttpError('could not find this route',404);
    //this thows to below error handler router
    throw error;
})

//below gets executes for error
app.use((error,req,res,next)=>{
    if(res.headerSent){
        next(error)
    }
    res.status(error.code||500);
    res.json({message:error.message||'An Unknown error has occured'})
})
app.listen(5000,()=>console.log('ok'))