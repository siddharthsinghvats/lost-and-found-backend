const express = require('express');
const lostRouter = express.Router()
const LostItem = require('../model/LostItem')
const cloudinary = require('cloudinary').v2;
const path = require('path');

const { multerUploads } = require('../middleware/itemMulter')
const DatauriParser = require("datauri/parser");

const parser = new DatauriParser();

cloudinary.config({
    cloud_name: 'dntah3mts',
    api_key: '415326662792133',
    api_secret: 'OxEbpzm8q-aNRapXGcdBynqV5Ls'
});





lostRouter.post('/new', multerUploads, async (req, res) => {
    const item = req.body
    console.log(item);
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

    try {
        const save_item = await LostItem.create(item);
        save_item.save();
        return res.status(201).json({ message: "created item successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "error creating item" });
    }


})

lostRouter.get('/', async (req, res) => {
    try {
        const resp = await LostItem.find();
        if (resp) {
            res.status(200).json({lostItems:resp});
        }else{
            res.status(500).json({error:"Could not fetch data"})
        }
    }
    catch(err){
        res.status(500).json({error:"something went wrong, try again later"});
    }
})
 

lostRouter.get('/',async (req,res)=>{
    try{
    const lost = await LostItem.find();
    if(lost){
        res.status(200).json(lost);
    }else{
        res.status(400).json({error:"could not load items"})
    }
    }
    catch(err){
        res.status(500).json({error:"internal server error"})
    }
    
})


module.exports = { lostRouter };