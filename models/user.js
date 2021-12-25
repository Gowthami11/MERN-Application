import mongoose,{Schema} from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"
const UserSchema=new Schema({
    uname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:6},
    image:{type:String,required:true,},
    //to link places with user schema, like user can have many places , so below is an array 
    places:[{type:mongoose.Types.ObjectId,required:true,ref:"Place"}],

})
//to validate unique mail
UserSchema.plugin(uniqueValidator);
const Uschema=mongoose.model('User',UserSchema)
export {Uschema}