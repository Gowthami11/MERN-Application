import express, { application } from 'express';
import HttpError from './models/HttpError';
import router from "./routes/places-routes"
import usersRoutes from "./routes/users-routes"
import mongoose from "mongoose";
import fs from 'fs';
import path from 'path'
const dburl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@merncluster.h08bv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const app = express();
app.use(express.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Origin, Authorization, Accept, Content-Type')
    next();
})
app.use("/api/places", router);
app.use("/api/users", usersRoutes)
//to handle no routes
app.use((req, res, next) => {
    const error = new HttpError('could not find this route', 404);
    //this thows to below error handler router
    throw error;
})
//below gets executes for error
app.use((error, req, res, next) => {
    //multer gives req.file
    if(req.file)
    {
        fs.unlink(req.file.path,(err)=>{
            console.log('image error',err)
        })
    }
    if (res.headerSent) {
        next(error)
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An Unknown error has occured' })
})
mongoose.connect(dburl).then(() => app.listen(process.env.PORT||5000, () => console.log('connection successfull')))
.catch(err=>console.log(err))