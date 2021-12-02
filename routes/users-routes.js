import express from 'express'
const router=express.Router();
import {getUsers,login,signup} from "../controllers/users-controller"
const dummyUsers=[]

router.get('/',getUsers);
router.post("/login",login);
router.post("/signup",signup);

module.exports=router