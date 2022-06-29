const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: value => validator.isEmail(value),
            message: 'Invalid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        /*validate: {
            validator: value => /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/g.test(value),
            message: 'Password minimal length is 8 and must contains letters [a-zA-Z], digits [0-9], special characters [!#$%&? "]'
        }*/
    },
    auth: [{
        token: {
            type: String
        }
    }]
});

userSchema.virtual('items', {
    ref: 'Item',
    localField: '_id',
    foreignField: 'userid'
});

userSchema.pre('remove', async function(next){
    await Item.deleteMany({userid: this._id});
    next();
});

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.auth;
    return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;