import mongoose,{Schema} from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"
const UserSchema=new Schema({
    uname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,unique:true},
    image:{type:String,required:true,unique:true},
    places:{type:String,required:true,unique:true},

})
//to validate unique mail
UserSchema.plugin(uniqueValidator);
const Uschema=mongoose.model('User',UserSchema)
export {Uschema}