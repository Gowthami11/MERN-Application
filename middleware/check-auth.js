const HttpError = require("../models/HttpError");
import jwt from "jsonwebtoken";
export const checkAuth=(req,res,next)=>{

    try{
        let token=req.headers.authorization.split(" ")[1];
        if(!token){
            throw new Error((""));
        }
        const decodedToken=jwt.verify(token,'some_secret');
        req.userData={userId:decodedToken.userId};
        next();


    }catch(e){
        return next(new HttpError("Authentication failed",401))
    }

}
