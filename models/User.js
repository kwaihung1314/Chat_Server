const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const token = require('../service/token');
// const config = require('../config');

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
  return token.genHashToken({
    username: this.username,
    email: this.email
  });
}

userSchema.methods.generateAuthJWT = function() {
  return token.genKeyToken({
    username: this.username,
    email: this.email
  })
}

userSchema.statics.findActiveUser = function(user) {
  return new Promise((resolve, reject) => {
    this.findOne({username: user.username}, (err, result) => {
      if (err) {
        reject(err);
      }
      if (result) {
        if (result.active) {
          resolve(result);
        } else {
          let err = new Error('Unactivated')
          reject(err);
        }
      } else {
        let err = new Error('User not exist')
        reject(err);
      }
    })
  })
}

module.exports = mongoose.model('users', userSchema);