const mongoose = require('mongoose');
const express = require('express');

var dbConnect = async () => {
    await mongoose.connect("mongodb+srv://siddharth1singh1:JuenGKeehCRGxmNB@cluster0.nxehwbd.mongodb.net/")
    .then(() => console.log('DB Connected!'));
}

module.exports = dbConnect;