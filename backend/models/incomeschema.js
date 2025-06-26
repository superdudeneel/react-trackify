const mongoose = require('mongoose');
const incomeschema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This should match the model name of your User schema
        required: true
    },
    name:{
        type: String,
    },
    income:{
        type: Number,

    },
    date:{
        type: String,
    },
    place:{
        type: String,
    },
    note:{
        type: String,
    },
    category:{
        type: String,
    }
})
const Income = mongoose.model('income', incomeschema);
module.exports = Income;
