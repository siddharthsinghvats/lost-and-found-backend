const express = require('express');
const userRouter = express.Router()
const User = require('../model/User')


userRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        user.password = undefined
        // console.log(user);
        res.status(200).json(user);
    }catch(err){
        res.status(404).json({err, message:"Something went wrong !"})
    }
})


module.exports = { userRouter };