const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionSchema = Schema({
    description: {
        type: String,
        required: true
    },
    optionOne: {
        statement: {
            type:String,
            required:true
        },
        count: {
            type:Number,
            required:false
        }
    },
    optionTwo: {
        statement: {
            type:String,
            required:true
        },
        count: {
            type:Number,
            required:false
        }
    }
})

module.exports = new mongoose.model("question",questionSchema);