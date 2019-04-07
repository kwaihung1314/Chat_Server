const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const config = require('../config');

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

// methods generate jwt
userSchema.methods.generateVerifyJWT = function() {
    return jwt.sign({
        username: this.username,
        email: this.email
    }, config.secret, {
        expiresIn: '7 days'
    })
}

module.exports = mongoose.model('users', userSchema);