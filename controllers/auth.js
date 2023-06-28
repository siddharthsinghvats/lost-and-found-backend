const express = require('express');
const User = require("../model/User")
const bcrypt = require('bcryptjs')
const cloudinary = require('cloudinary').v2;
const path = require('path');
const { createSecretToken } = require('../util/secretToken')
const { multerUploads } = require('../middleware/multer')
const DatauriParser = require("datauri/parser");
const {userVerification} = require('../middleware/auth')
const parser = new DatauriParser();

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;



cloudinary.config({
    cloud_name,
    api_key,
    api_secret
});

const authRouter = express.Router()

authRouter.post('/signup',
    multerUploads, async (req, res) => {
        const user = req.body;
        const already_exists = await User.findOne({ email: user?.email });
        if (already_exists) {
            return res.status(409).json({ error: "email already exists" })
        }
        const file = parser.format(
            path.extname(req.file.originalname).toString() + Date.now().toString(),
            req.file.buffer
        ).content;
        try {
            const resp = await cloudinary.uploader.upload(file, { timeout: 120000 });
            user.profileImg = resp.url;
        }
        catch (err) {
            res.status(400).json({
                message: 'something went wrong while processing your request',
                data: {
                    err
                }
            })
        }
        try {
            
            
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
            
            const token = createSecretToken(user._id);
            const save_user = await User.create(user);
            delete  save_user.password;
            save_user.token = token
            res
                .status(201)
                .json({ message: "User signed in successfully", success: true, user:save_user });

        }
        catch (err) {
            return res.status(500).json({ error: "failed to sign-up" ,error:err});
        }

    })

authRouter.post('/login' ,async (req, res) => {
    const user = req.body;
    try {
        const user_exists = await User.findOne({ email: user.email });
        if (user_exists) {
            const passwordOk = await bcrypt.compare(user.password, user_exists.password);
            if (passwordOk) {
                
                const token = createSecretToken(user_exists._id);
                delete user_exists._doc.password;
                user_exists._doc.token = token;
                res
                .status(201)
                .json({ message: "User logged in successfully", success: true, user:user_exists._doc });
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