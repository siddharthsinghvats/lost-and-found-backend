const mongoose = require("mongoose")
mongoose.set('debug', true);

const lostItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    itemDescription: {
        type: String
    },
    lostAtLandmark: {
        type: String,
        required: true
    },
    lostBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    foundBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    lostDate: {
        type: String,
        default: new Date().toLocaleString()
    },
    itemImg: {
        type: String,
        default: "https://media.istockphoto.com/id/1271880340/vector/lost-items-line-vector-icon-unidentified-items-outline-isolated-icon.jpg?s=612x612&w=0&k=20&c=d2kHGEmowThp_UrqIPfhxibstH6Sq5yDZJ41NetzVaA="
    }
});
const LostItem = mongoose.model("lostItem", lostItemSchema);
module.exports = LostItem