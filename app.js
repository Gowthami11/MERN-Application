import express from 'express';
import HttpError from './models/HttpError';
import router from "./routes/places-routes"
import usersRoutes from "./routes/users-routes"
import mongoose from "mongoose"
const dburl = 'mongodb+srv://gow1:12345@merncluster.h08bv.mongodb.net/mern?retryWrites=true&w=majority'

const app = express();
app.use(express.json())
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
    if (res.headerSent) {
        next(error)
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An Unknown error has occured' })
})
mongoose.connect(dburl).then(() => app.listen(5000, () => console.log('connection successfull')))
.catch(err=>console.log(err))