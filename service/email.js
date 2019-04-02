const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.gmail.user,
    pass: config.gmail.pass
  }
});

function activateAccAndSetPassword(username, email) {
  let messageConfig = {
    from: 'berylchatroom@gmail.com',
    to: `"${username}" <${email}>`,
    subject: 'Hello from beryl chatroom',
    text: 'Hello it is sent from beryl chatroom',
    html: '<b>Hello it is sent from beryl chatroom</b>'
  }

  transporter.sendMail(messageConfig, function(err, info) {
    if (err) {
      console.log(err);
    }
    console.log('email info:', info);
  });
}

module.exports = {
  activateAccAndSetPassword
};

