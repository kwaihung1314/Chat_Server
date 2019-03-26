const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            if (this.active) {
                return true;
            } else {
                return false;
            }
        }
    },
    active: {
        type: Boolean,
        required: true,
    },
}, {timestamps: true});

userSchema.plugin(uniqueValidator, {message: '{PATH} is already used.'});

module.exports = mongoose.model('users', userSchema);