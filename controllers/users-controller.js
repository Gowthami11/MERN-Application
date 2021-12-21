
import HttpError from "../models/HttpError"
import {v4 as uuid} from 'uuid'
import {validationResult} from 'express-validator'
import {Uschema} from "../models/user"
const dummyUsers=[
    {
        id:"u1",
        name:'gow',
        email:'gow@gmail.com',
        password:'test'
    }
]
export const getUsers=(req,res,next)=>{
res.json({users:dummyUsers})

}
export const login=(req,res,next)=>{
    const {email,pwd}=req.body;
    const user=dummyUsers.find(d=>d.email===email);
    console.log('user',user)
    if(!user || user.password!==pwd){
        throw new HttpError('credentaials seems wrong',400)

    }

    res.json({message:'Logged in'})
}
export const signup=async(req,res,next)=>{
const errors=validationResult(req);
console.log('errrr',errors)
if(!errors.isEmpty())
return next(new HttpError('Invalid inputs passed, Please check your data',422));

    const {email,pwd,uname,places}=req.body;
    const createduser={
        email,
       uname,
       image:"https://r-cf.bstatic.com/images/hotel/max1024x768/162/162633985.jpg",
        password:pwd,
        places

    };
    let existinguser
try{
     existinguser=await Uschema.findOne({email:email});
     console.log('existinguser',existinguser)
}
catch(e){
    return next(new HttpError('SignUp failed, Please try again !!',500))
}
   if(existinguser){
       return next(new HttpError('email already exists, Please signin instead',422))
   }
  const createdUser=new Uschema({

    uname,
    email,
    password:pwd,
    image:"https://r-cf.bstatic.com/images/hotel/max1024x768/162/162633985.jpg",
    places

  })
  try{
  await createdUser.save()

  }
  catch(e)
  {
    return next(new HttpError('Something went Wrong, Please try again',500))

  }
    res.status(200).send({user:createdUser})
}