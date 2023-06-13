const express = require('express');
const foundRouter=express.Router()

foundRouter.post('/create',async (req,res)=>{
    console.log(req.body);
    res.send(req.body);
})



module.exports ={foundRouter};