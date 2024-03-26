const express=require('express');
const  Router = require('./routes/main');
const env=require('dotenv').config()
const PORT_NUM=env.PORT_NUM||3000;



const app=express();
app.use(express.json());



app.use('/api',Router);


app.listen(PORT_NUM,()=>{
    console.log('Server started at port:'+PORT_NUM)
})