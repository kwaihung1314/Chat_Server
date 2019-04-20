const app = require('express').Router();
const userModel = require('../../models/User');
const email = require('../../service/email');
const token = require('../../service/token');
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
    return user.generateVerifyJWT().then((token) => {
      let url = process.env.API_BASE + '/activate-setpassword?code=' + token;
      email.activateAccAndSetPassword(user.username, user.email, url);
      res.send(user);
      return;
    })
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
  if (user.password.length < 8 || !user.password.match(config.validationPattern.user_password)) {
    res.status(400).send('Password Invalid');
    return;
  }
  if (user.password != user.confirm_password) {
    res.status(400).send('Confirm password and password are not matching');
    return;
  }

  token.verifyHashToken(req.body.code).then((decode) => {
    Object.assign(user, decode);
    return bcrypt.hash(user.password, 10)
  })
  .then(hash => {
    userModel.update({
      username: user.username,
      email: user.email,
      active: false
    }, {
      password: hash,
      active: true
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.nModified === 0) {
        res.status(401).send('Account was activated before')
      } else {
        res.sendStatus(200);
      }
      console.log('updated: ', result.nModified);
    })
  })
  .catch((err) => {
    if (err.name == 'TokenError') {
      res.status(401).send('Invalid or expired link')
      return;
    }
    next(err);
  })
});

app.get('/checkCode', (req, res, next) => {
  if (!req.query.code) {
    res.send(400);
    return;
  }
  if (req.query.type === 'hash') {
    token.verifyHashToken(req.query.code)
    .then(decode => {
      res.send(decode);
      return;
    })
    .catch(err => {
      if (err.name == 'TokenError') {
        res.status(401).send('Invalid or expired link.')
        return;
      }
      next(err);
    })
  }
  if (req.query.type === 'key') {
    token.verifyKeyToken(req.query.code)
    .then(decode => {
      res.send(decode);
      return;
    })
    .catch(err => {
      if (err.name == 'TokenError') {
        res.status(401).send('Invalid or expired link.')
        return;
      }
      next(err);
    })
  }
});

// authenticate user
app.post('/login', (req, res, next) => {
  let user = {
    username: req.body.username,
    password: req.body.password
  }

  userModel.findActiveUser(user)
  .then(existUser => {
    // compare password
    return bcrypt.compare(user.password, existUser.password)
    .then(isCorrectPassword => {
      if (isCorrectPassword) {
        return existUser.generateAuthJWT()
      } else {
        res.sendStatus(401);
      }
    })
  })
  .then(token => {
    // TODO: set cookie
    res.send({token});
  })
  .catch(err => {
    if (err.message == 'Unactivated') {
      res.status(403).send('User has not activated');
    }
    if (err.message == 'User not exist') {
      res.sendStatus(401);
    }
    return next(err);
  })
})


module.exports = app;