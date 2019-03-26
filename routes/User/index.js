const app = require('express').Router();
const userModel = require('../../models/User');

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
            res.send(user);
        })
        .catch(err => {
            next(err);
        });
});
module.exports = app;