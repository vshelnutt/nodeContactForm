const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars')
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
   const output = `
   <p> you have a new contact request</p>
   <h3>Contact Details</h3>
   <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
   </ul>
   <h3>Messages</h3>
   <p>${req.body.message}</p>
   `;


// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'mail.my-little-pwny.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'me@my-little-pwny.com', // generated ethereal user
        pass: '' // generated ethereal password
    },
    tls: {
        rejectUnauthorized:false
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"Nodemailer" <me@my-little-pwny.com>', // sender address
    to: 'me@vincentshelnutt.com', // list of receivers
    subject: 'Client Contact Request', // Subject line
    text: 'Hello world?', // plain text body
    html: output // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', {msg:'Email has been sent'});
});
});

app.listen(3000, () => console.log('server started'));