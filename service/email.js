const nodemailer = require('nodemailer');
const config = require('../config');
const fs = require('fs');
const compiled = require('lodash.template');
const path = require('path');

let verificationEmailText = compiled(fs.readFileSync(path.resolve(__dirname, './emailTemplates/activateAccAndSetPassword.txt'), {encoding: 'UTF-8'}));
let verificationEmailHtml = compiled(fs.readFileSync(path.resolve(__dirname, './emailTemplates/activateAccAndSetPassword.html'), {encoding: 'UTF-8'}));

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.gmail.user,
    pass: config.gmail.pass
  }
});

function activateAccAndSetPassword(username, email, url) {
  let messageConfig = {
    from: 'berylchatroom@gmail.com',
    to: `"${username}" <${email}>`,
    subject: 'Hello from beryl chatroom',
    text: verificationEmailText({username, url}),
    html: verificationEmailHtml({username, url})
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

