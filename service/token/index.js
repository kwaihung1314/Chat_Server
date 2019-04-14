const jwt = require('jsonwebtoken')
const fs = require('fs')
const config = require('../../config')
const privateKey =  fs.readFileSync('/rsa_private.pem', 'utf8')
const publicKey = fs.readFileSync('/rsa_public.pem', 'utf8')

const signHashOptions = {
  expiresIn: '2 days'
}

const signKeyOptions = {
  algorithm: 'RS256',
  expiresIn: '2 days'
}

const genHashToken = (playload) => new Promise((resolve, reject) => {
  jwt.sign(playload, config.secret, signHashOptions, (err, token) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(token);
  })
})

const verifyHashToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, config.secret, (err, decode) => {
    if (err) {
      err.name = 'TokenError';
      reject(err);
      return
    }
    resolve(decode);
  })
})

const genKeyToken = (playload) => new Promise((resolve, reject) => {
  jwt.sign(playload, privateKey, signKeyOptions, (err, token) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(token);
  })
})

const verifyKeyToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, publicKey, (err, decode) => {
    if (err) {
      err.name = 'TokenError';
      reject(err);
      return
    }
    resolve(decode);
  })
})

module.exports = {
  genHashToken,
  verifyHashToken,
  genKeyToken,
  verifyKeyToken
}