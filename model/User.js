const mongoose = require("mongoose")
mongoose.set('debug', true);

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String
    },
    lostPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lostPosts'
    }], 
    foundPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foundPosts'
    }],
    upvotedPosts: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    profileImg: {
        type: String,
        default: "https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
    }
});
const User = mongoose.model("users", usersSchema);
module.exports = User