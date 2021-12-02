
import HttpError from "../models/HttpError"
import {v4 as uuid} from 'uuid'
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
export const signup=(req,res,next)=>{

    const {email,pwd,uname}=req.body;
    const createduser={
        id:uuid(),
        email,
        name:uname,
        password:pwd

    };

    const checkifexists=dummyUsers.findIndex(d=>d.email===email);
    if(checkifexists>=0)
    res.send('email already exists')
    dummyUsers.push(createduser);
    res.status(200).send({user:createduser})
}