const express = require('express');
const lostRouter=express.Router()

lostRouter.post('/create',async (req,res)=>{
    console.log(req.body);
    res.send(req.body);
})


module.exports ={lostRouter};