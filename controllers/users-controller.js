
import HttpError from "../models/HttpError"
import { v4 as uuid } from 'uuid'
import { validationResult } from 'express-validator'
import { Uschema } from "../models/user"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const dummyUsers = [
    {
        id: "u1",
        name: 'gow',
        email: 'gow@gmail.com',
        password: 'test'
    }
]
export const getUsers = async(req, res, next) => {
    let users;
    try{
        users=await Uschema.find({},"-password")
    }
    catch(e){
        return next(new HttpError('Fetching Users failed, Please try again later',500))
    }
    //to get id in repsonse without _
    res.json({ users: users.map(user=>user.toObject({getters:true})) })

}
export const login = async(req, res, next) => {
    const { email, pwd } = req.body;
    let existinguser;
    try{
        existinguser=await Uschema.findOne({email:email})
    }
    catch(e){
        return next(new HttpError('Login failed, Please try again !!', 500))
    }
    if(!existinguser)
    return next(new HttpError('Invalid credentails, Could not login', 500))

    let isValidPassword=false;
    try{
        isValidPassword=await bcrypt.compare(pwd,existinguser.password)
    }
    catch(e){
        return next(new HttpError('COuld not login, Please check your credentaials and login again',500))
    }
    if(!isValidPassword)
    return next(new HttpError('Invalid credentails, Could not login', 500))

let token
try{
    token=jwt.sign({userId:existinguser.id,email:existinguser.email},process.env.JWT_TOKEN,{expiresIn:'10hr'})
}
catch(e){
    return next(new HttpError("login has failed, Please try again",500))
}
    res.json({ userId:existinguser.id,email:existinguser.email,token:token})
}
export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    console.log('errrr', errors)
    if (!errors.isEmpty())
        return next(new HttpError('Invalid inputs passed, Please check your data', 422));

    const { email, pwd, uname } = req.body;
    let hashedPassword;
    try{
        hashedPassword=await bcrypt.hash(pwd,12);
    }
  catch(e){
      return next(new HttpError('could not create user, Please try again ',500))
  }
    let existinguser
    try {
        existinguser = await Uschema.findOne({ email: email });
    }
    catch (e) {
        return next(new HttpError('SignUp failed, Please try again !!', 500))
    }
    if (existinguser) {
        return next(new HttpError('email already exists, Please signin instead', 422))
    }
    const createdUser = new Uschema({

        uname,
        email,
        password: hashedPassword,
        image: req.file.path, // multer gives file path
        places:[]

    })
    console.log('createdUser', createdUser)

    try {
        await createdUser.save()

    }
    catch (e) {
        return next(new HttpError('Something went Wrong, Please try again', 500))

    }

    let token;
    try{
        token=jwt.sign({userId:createdUser.id,email:createdUser.email},process.env.JWT_TOKEN,{expiresIn:'10hr'})
    }
    catch(e){
        return next(new HttpError('Signing up failed, Please try again',500))
    }
    res.status(200).send({ userId:createdUser.id,email:createdUser.email,token:token })
}