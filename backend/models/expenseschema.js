const mongoose = require('mongoose');
const expenseschema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This should match the model name of your User schema
        required: true
    },
    name:{
        type: String,
    },
    expense:{
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

const Expense = mongoose.model('expense', expenseschema);
module.exports = Expense;
