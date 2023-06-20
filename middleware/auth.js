const User = require("../model/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res,next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ status: false,error:"unauthorised" });
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.status(401).json({ status: false,error:"unauthorised" });
        } else {
            const user = await User.findById(data.id);
            if (user) {
                next();
            }
            else return res.status(500).json({ status: false,error:"server error" });
        }
    });
};