const mongoose = require('mongoose');
//const validator = require('validator');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 128
    },
    date: {
        type: Date,
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;