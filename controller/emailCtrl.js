const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

const sendEmail = asyncHandler(async (data, req, res) => {
  // create mail transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, //true for 465, false for 587
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  // send mail with the transport object
  const info = await transporter.sendMail({
    from: '"Hey 👻" <digitc@gmail.com>', //sender address
    to: data.to, // recievers
    subject: data.subject, //subject line
    text: data.text, //text body
    html: data.htm, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  console.log('PREVIEW URL: %s', nodemailer.getTestMessageUrl(info));
});

module.exports = sendEmail;
