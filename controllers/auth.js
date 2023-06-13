const express = require('express');
const User = require("../model/User")
const bcrypt = require('bcryptjs')
const cloudinary = require('cloudinary').v2;

const { multerUploads } = require('../middleware/multer')


// cloudinary.config({
//     cloud_name: 'dntah3mts',
//     api_key: '415326662792133',
//     api_secret: 'OxEbpzm8q-aNRapXGcdBynqV5Ls'
// });




const authRouter = express.Router()






authRouter.post('/signup',
    multerUploads, async (req, res) => {
        // res.send(req);
        // console.log(req.body,req.files);
        res.send(req.body);
        console.log("image",req.file);
        const user = req.body;
        // // const file = req.files.profileImage;
        // const already_exists = await User.findOne({ email: user?.email });
        // if (already_exists) {
        //     return res.status(409).json({ error: "email already exists" })
        // } else {
        //     try {
        //         // cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
        //         //     if (error) {
        //         //         console.error(error);
        //         //         return res.status(500).json({ error: 'Failed to upload image' });
        //         //     }
        //         //    user.profileImage = result.secure_url;
        //         // });
        //         const save_user = await User.create(user);
        //         const salt = await bcrypt.genSalt(10);
        //         const hash = await bcrypt.hash(user.password, salt);
        //         save_user.password = hash;
        //         save_user.save();
        //         return res.status(201).json({ message: "user signed up successfully" });
        //     }
        //     catch (err) {
        //         return res.status(500).json({ error: "failed to create user" });
        //     }
        // }
    })

authRouter.post('/login', async (req, res) => {
    const user = req.body;
    try {
        const user_exists = await User.findOne({ email: user.email });
        if (user_exists) {
            const passwordOk = await bcrypt.compare(user.password, user_exists.password);
            if (passwordOk) {
                return res.status(200).json({ "message": "login succesful" });
            } else {
                return res.status(401).json({ "error": "wrong email or password" })
            }
        } else {
            return res.status(404).json({ "error": "user does not exist" });
        }
    }
    catch (err) {
        return res.status(500).json({ "error": "internal server error" });
    }
})

module.exports = { authRouter };