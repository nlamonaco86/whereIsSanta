let db = require("../models");
require('dotenv').config();
const nodemailer = require('nodemailer');

// Configuration for Nodemailer to send Letters to/from the North Pole. 
let transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

module.exports = (app) => {
  app.get("/api/location", (req, res) => {
    db.Location.findOne({}).then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    });
  });

  app.get("/api/facts", (req, res) => {
    db.SantaFact.find({}).then(response => {
      res.json(response[Math.floor(Math.random() * response.length)]);
    })
    .catch(err => {
      res.json(err);
    });
  });

  // This route will help Santa send a personalized letter back to anyone who writes to him.
  // He's extremely busy this year, so he has hired an amateur web developer to automate the process for him
  app.post("/api/letterToSanta", (req, res) => {
     let mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: req.body.email,
            subject: `A Letter From Santa Claus`,
            html: `<div style="padding-right: 5px;padding-left: 5px;margin-right: auto;margin-left: auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 20px; background-color:wheat;color:black;">
            <h1 style="display: flex; justify-content: center; color:red; font-size: 44px;">Dear ${req.body.name},</h1>
            <p>Thank you for writing to me! It's been such a busy and stressful year, what with everything going on. But I've heard that you have been very good, and everyone is very proud of you. </p>            
            <p>I've been spending lots of time here in my workshop at the North Pole, where the elves have been hard at work making toys for all of the boys and girls around the world. Mrs. Claus and I were just out feeding the reindeer, and we were talking about how we can't wait for the big night!</p>
            <p>Well, I've got to get back to work now - there's still so much to do! Happy holidays, to you and your family!</p>
            <p>P.S. Don't forget the milk and cookies...and a carrot for the reindeer! Ho Ho Ho!</p>
            <div style="display: flex; justify-content: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 20px;">
                <div>
                <h3 style="display: flex; justify-content: center; color:red; font-size: 36px;">Sincerely,</h3>
                <h4 style="display: flex; justify-content: center; color:red; font-size: 24px;">Santa Claus</h4>
            </div>
            </div>`
          };
          // Send the e-mail
          transporter.sendMail(mailOptions, function (error, info) {
            // error handling
            (error ? console.log(error) : console.log('Email sent: ' + info.response))
          })
        // Send a success message
        res.json({ message: "success" })  
      })
};