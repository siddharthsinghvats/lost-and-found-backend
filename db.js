const mongoose = require('mongoose');
const express = require('express');

var dbConnect = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_SECRET}@cluster0.nxehwbd.mongodb.net/`)
    .then(() => console.log('DB Connected!'));
}

module.exports = dbConnect;