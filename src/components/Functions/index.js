import React, { useState } from 'react';
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-email-password", // Replace with your email app password
  },
});

exports.sendContactEmail = functions.https.onRequest(async (req, res) => {
  const { firstName, email, subject, message } = req.body;

  if (!firstName || !email || !subject || !message) {
    return res.status(400).send("All fields are required.");
  }

  const mailOptions = {
    from: "your-email@gmail.com",
    to: "recipient-email@gmail.com",
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <h3>Contact Form Submission</h3>
      <p><strong>Name:</strong> ${firstName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});
