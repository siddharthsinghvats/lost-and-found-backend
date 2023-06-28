const express = require('express');
const foundRouter = express.Router()
const FoundItem = require('../model/FoundItem')
const cloudinary = require('cloudinary').v2;
const path = require('path');
const User = require('../model/User')
const { multerUploads } = require('../middleware/itemMulter')
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;



cloudinary.config({
    cloud_name,
    api_key,
    api_secret
});


foundRouter.get('/',async (req,res)=>{
    try{
    const found = await FoundItem.find();
    if(found){
        res.status(200).json(found);
    }else{
        res.status(400).json({error:"could not load items"})
    }
    }
    catch(err){
        res.status(500).json({error:"internal server error"})
    }
    
})


foundRouter.post('/new', multerUploads, async (req, res) => {
    const item = req.body
    console.log(item);
    if(req.file){
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
        const modified_item =  Object.assign({}, item);
        delete modified_item.user 
        // console.log("here",modified_item)
        const save_item = await FoundItem.create(modified_item);
        const user = JSON.parse(item.user);
        // console.log('user-after-parse', user)
        const new_user = await User.findById(user._id);
        new_user.foundPosts.push(save_item._id);
        new_user.save();
        return res.status(201).json({ message: "created item successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "error creating item" });
    }


})


foundRouter.put('/:id', async (req,res)=>{
    const id = req.params.id;
    try{
    const foundCard = await FoundItem.findById(id);
    if (req.body.claimedBy)
    foundCard.claimedBy = req.body.claimedBy;
    foundCard.save();
    res.status(200).json({message:"card updated succesfully",card:foundCard})
    }catch(err){
        res.status(500).json({error:err})
    }
})

foundRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const resp = await FoundItem.findById(id);
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



foundRouter.put('/edit/:id', multerUploads, async (req, res) => {
    console.log("yaha");
    const id = req.params.id;
    console.log(id);
    var oldCard = await FoundItem.findById(id);
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
        const newCard = await FoundItem.findByIdAndUpdate(id,oldCard);
        return res.status(201).json({ message: "updated item successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "error updating item" });
    }


})

module.exports = { foundRouter };