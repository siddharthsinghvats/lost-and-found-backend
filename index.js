const express = require('express');
const bodyParser = require("body-parser");
const {authRouter} = require('./controllers/auth')



// create a new server
const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/auth",authRouter);


app.listen(5000,()=>{
    console.log("Server Running");
})