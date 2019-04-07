const app = require('express').Router();
const userModel = require('../../models/User');
const email = require('../../service/email');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const bcrypt = require('bcrypt');

// register API
app.post('/register', (req, res, next) => {
    if (!req.body.username || !req.body.email) {
        res.sendStatus(400);
        return;
    }
    let newUser = new userModel({
        username: req.body.username,
        email: req.body.email,
        active: false,
    });
    newUser.save()
        .then(user => {
            let url = process.env.API_BASE + '/activate-setpassword?code=' + user.generateVerifyJWT();
            email.activateAccAndSetPassword(user.username, user.email, url);
            res.send(user);
            return;
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

// verify API
app.post('/activate-setpassword', (req, res, next) => {
    if (!req.body.code || !req.body.password || !req.body.confirm_password) {
        res.sendStatus(400);
        return;
    }
    let user = {
        password: req.body.password,
        confirm_password: req.body.confirm_password
    };
    jwt.verify(req.body.code, config.secret, (err, decode) => {
        if (err) {
            res.status(401).send('Invalid or expired link.')
            return;
        }
        Object.assign(user, decode);
    });
    if (user.password.length < 8 || !user.password.match(config.validationPattern.user_password)) {
        res.status(400).send('Password Invalid');
        return;
    }
    if (user.password != user.confirm_password) {
        res.status(400).send('Confirm password and password are not matching');
        return;
    }
    bcrypt.hash(user.password, 10)
        .then(hash => {
            userModel.update({
                username: user.username,
                email: user.email
            }, {
                password: hash,
                active: true
            }, (err, result) => {
                if (err) {
                    next(err);
                }
                res.sendStatus(200);
                console.log('updated: ', result.nModified);
            })
        })
        .catch(err => {
            next(err);
        })

})


module.exports = app;