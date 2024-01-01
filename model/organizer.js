const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const organizerSchema = Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required:true
    },
    phone: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    questions: [
        {
            type:Schema.Types.ObjectId,
            ref: 'question',
            required:false
        }
    ]
});

module.exports = new mongoose.model("organizer",organizerSchema);