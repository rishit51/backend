const mongoose=require('mongoose')

mongoose.connect("mongodb+srv://asus:Fcjw2qjbPkR9lLqt@cluster0.buwvd4g.mongodb.net/classroom")


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['Doctor','User','Admin']
    }
})

module.exports=mongoose.model("User",userSchema)