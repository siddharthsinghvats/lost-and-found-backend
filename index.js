const express = require('express');
const {authRouter} = require('./controllers/auth');
const {lostRouter} = require('./controllers/lost');
const {foundRouter} = require('./controllers/found');
const db = require('./db')

// create a new server
const app = express();
app.use(express.json());



app.use("/auth",authRouter);
app.use('/lost',lostRouter);
app.use('/found',foundRouter);

db();

app.listen(5000,()=>{
    console.log("Server Running");
})