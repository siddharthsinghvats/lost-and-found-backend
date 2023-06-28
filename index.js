const express = require('express');
const {authRouter} = require('./controllers/auth');
const {lostRouter} = require('./controllers/lost');
const {foundRouter} = require('./controllers/found');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const db = require('./db');
const { userRouter } = require('./controllers/user');

// create a new server
const app = express();
app.use(express.json());
app.use(cors({origin: 'http://localhost:5000',credentials: true}));
app.use(cookieParser());




app.use("/auth",authRouter);
app.use('/lost',lostRouter);
app.use('/found',foundRouter);
app.use('/user', userRouter);

db();

app.listen(process.env.PORT||5000,()=>{
    console.log("Server Running");
})