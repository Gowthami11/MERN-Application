
import HttpError from "../models/HttpError"
import { v4 as uuid } from 'uuid'
import { validationResult } from 'express-validator'
import { Uschema } from "../models/user"
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
    if(!existinguser || existinguser.password!==pwd)
    return next(new HttpError('Invalid credentails, Could not login', 500))


    res.json({ message: 'Logged in' })
}
export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    console.log('errrr', errors)
    if (!errors.isEmpty())
        return next(new HttpError('Invalid inputs passed, Please check your data', 422));

    const { email, pwd, uname, places } = req.body;
    const createduser = {
        email,
        uname,
        image: "https://r-cf.bstatic.com/images/hotel/max1024x768/162/162633985.jpg",
        password: pwd,
        places

    };
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
        password: pwd,
        image: "https://r-cf.bstatic.com/images/hotel/max1024x768/162/162633985.jpg",
        places

    })
    console.log('createdUser', createdUser)

    try {
        await createdUser.save()

    }
    catch (e) {
        return next(new HttpError('Something went Wrong, Please try again', 500))

    }
    res.status(200).send({ user: createdUser })
}