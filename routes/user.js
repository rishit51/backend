const express = require("express")

const zod=require('zod')
const  User = require("../models/userModel")
const jwt=require('jsonwebtoken')
const { JWT_SECRET } =require("../config")
const authMiddleWare = require("../middleware")
const userModel = require("../models/userModel")

const userRouter=express.Router()


const signUpBody=zod.object({
    name:zod.string().min(1),
    email:zod.string().email(),
    role:zod.enum(['User','Admin','Doctor']),
    password:zod.string().min(8)
})

const updateBody=zod.object({
    password:zod.string().optional(),
    name:zod.string().optional(),
})


const signinBody=zod.object({
    password:zod.string(),
    email:zod.string().email(),
})

userRouter.post('/signup',async function(req,res){
    
    const { success } = signUpBody.safeParse(req.body)

    if(!success){
        return res.status(411).json({
            'message':'Email has already been taken / Incorrect inputs'
        })

    }
    const existingUser=await User.findOne({username: req.body.username})
    if (existingUser) {
        return res.status(411).json({
            'message':'Email has already been taken / Incorrect inputs'})}
    const user=await User.create({
        ...req.body,
    })
    const userId=user._id 
    const token=jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        message:'User created successfully',
        token:token
    })




})

userRouter.post('/signin',async function(req,res){  

    const {success}=signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            'error':"Invalid credentials / Missing fields",
        })
    }
    else{
        const user=userModel.findOne({_id:req.body.userId,password:req.body.password});
        
        if (!user) {
            return res.status(401).json({
                message:'Invalid credentails / Missing fields'
            })
        }
        else{
            const userId=user._id 
    const token=jwt.sign({
        userId
    },JWT_SECRET);
        return res.json({message:'Successfully signed in',token:token})
        }
    }

})


userRouter.put('',async function (req,res){
    const {success}=updateBody.safeParse(req.body)
    if(success){
    try{
        await User.updateOne({_id:req.userId},req.body);

    res.json({
        'message':
        'Updated Sucessfully'
    })
}
catch(e){

    res.status(411).json({
        'message':'Error while updating information'
    })
}
}
else
{
    res.status(411).json({
        'message':'Error while updating information'
    });
}
})




module.exports=userRouter