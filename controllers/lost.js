const express = require('express');
const lostRouter = express.Router()
const LostItem = require('../model/LostItem')
const User = require('../model/User')
const cloudinary = require('cloudinary').v2;
const path = require('path');

const { multerUploads } = require('../middleware/itemMulter')
const DatauriParser = require("datauri/parser");
const { default: mongoose } = require('mongoose');

const parser = new DatauriParser();

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;



cloudinary.config({
    cloud_name,
    api_key,
    api_secret
});



lostRouter.post('/new', multerUploads, async (req, res) => {
    const item = req.body
    console.log(item);
    if (req.file) {
        const file = parser.format(
            path.extname(req.file.originalname).toString() + Date.now().toString(),
            req.file.buffer
        ).content;
        try {
            const resp = await cloudinary.uploader.upload(file, { timeout: 120000 });
            item.itemImg = resp.url;
        }
        catch (err) {
            res.status(400).json({
                message: 'something went wrong while processing your request',
                data: {
                    err
                }
            })
        }
    }

    try {
        const user = JSON.parse(item.user);
        const modified_item = Object.assign({}, item);
        delete modified_item.user
        modified_item.lostBy = user._id;
        const save_item = await LostItem.create(modified_item);
        // save_item.save();
        // console.log('item-user', item)

        // console.log('user-after-parse', user)
        const new_user = await User.findById(user._id);
        console.log(new_user);
        new_user.lostPosts.push(save_item._id);
        console.log(new_user.lostPosts);
        new_user.save();
        return res.status(201).json({ message: "created item successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "error creating item" });
    }


})


lostRouter.put('/edit/:id', multerUploads, async (req, res) => {
    const id = req.params.id;
    var oldCard = await LostItem.findById(id);
    console.log("old", oldCard);
    const item = req.body
    console.log(item);
    if (req.file) {
        const file = parser.format(
            path.extname(req.file.originalname).toString() + Date.now().toString(),
            req.file.buffer
        ).content;
        try {
            const resp = await cloudinary.uploader.upload(file, { timeout: 120000 });
            item.itemImg = resp.url;
        }
        catch (err) {
            res.status(400).json({
                message: 'something went wrong while processing your request',
                data: {
                    err
                }
            })
        }
    }

    try {
        oldCard = {...oldCard._doc, ...item};
        console.log("old+new",oldCard);
        const newCard = await LostItem.findByIdAndUpdate(id,oldCard);
        return res.status(201).json({ message: "updated item successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "error updating item" });
    }


})

lostRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const resp = await LostItem.findById(id);
        if (resp) {
            res.status(200).json(resp);
        } else {
            res.status(500).json({ error: "Could not fetch data" })
        }
    }
    catch (err) {
        res.status(500).json({ error: "something went wrong, try again later" });
    }
})


lostRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const post = await LostItem.findById(id);
        console.log("here", post)
        const user = await User.findById(post.lostBy);
        const newLostPosts = user.lostPosts.filter((item) => item != id);
        user.lostPosts = newLostPosts;
        user.save();
        const resp = await LostItem.deleteOne({ _id: id });
        if (resp) {
            res.status(200).json(resp);
        } else {
            res.status(500).json({ error: "Could not delete card" })
        }
    }
    catch (err) {
        res.status(500).json({ error: "something went wrong, try again later" });
    }
})

lostRouter.get('/', async (req, res) => {
    try {
        const lost = await LostItem.find();
        if (lost) {
            res.status(200).json(lost);
        } else {
            res.status(400).json({ error: "could not load items" })
        }
    }
    catch (err) {
        res.status(500).json({ error: "internal server error" })
    }

})

lostRouter.put('/:id', async (req, res) => {

    try {
        const id = req.params.id;
        const lostCard = await LostItem.findById(id);
        if (req.body.foundBy)
            lostCard.foundBy = req.body.foundBy;
        lostCard.save();
        res.status(200).json({ message: "Post updated succesfully" })
    } catch (err) {
        res.status(500).json({ error: err, message: "Something went wrong" })
    }

})


module.exports = { lostRouter };