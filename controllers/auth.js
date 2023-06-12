const express = require('express');
const authRouter=express.Router()

authRouter.post('/signup',async (req,res)=>{
    console.log(req.body);
    res.send(req.body);
})

module.exports ={authRouter};