const mongoose  = require('mongoose');
const receiptschema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This should match the model name of your User schema
        required: true
    },
    url: {
        type: String,
    },
    date: {
        type: 'String'
    }
})

const Receipt = mongoose.model('receipt', receiptschema);
module.exports = Receipt;
