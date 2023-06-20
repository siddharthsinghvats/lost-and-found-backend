const mongoose = require("mongoose")
mongoose.set('debug', true);

const foundItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    itemDescription:{
        type:String
    },
    foundAtLandmark: {
        type: String,
        required: true
    },
    foundBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default:null
    },
    foundDate: {
        type: String,
        default: new Date().toLocaleDateString()
    },
    itemImg: {
        type: String,
        default: "https://media.istockphoto.com/id/1271880340/vector/lost-items-line-vector-icon-unidentified-items-outline-isolated-icon.jpg?s=612x612&w=0&k=20&c=d2kHGEmowThp_UrqIPfhxibstH6Sq5yDZJ41NetzVaA="
    }
});
const FoundItem = mongoose.model("foundItem", foundItemSchema);
module.exports = FoundItem