const express = require("express");
const router = express.Router();
const db = require("../db");
const nodemailer = require("nodemailer");

router.post("/contact", (req, res) => {
  const { name, email, number, service, message } = req.body;

  // Save into SQLite
  db.run(
    "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      // Debug env variables
      console.log("SMTP_USER:", process.env.SMTP_USER);
      console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);

      // Create transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Verify SMTP connection
      transporter.verify((error, success) => {
        if (error) {
          console.log("SMTP Connection Error:", error);
        } else {
          console.log("SMTP Ready to send emails");
        }
      });

      // Mail content
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.RECEIVER_MAIL,
        subject: "New Contact Form Submission",
        text:
          "New Contact Form Submission\n\n" +
          "Name: " + name + "\n" +
          "Email: " + email + "\n" +
          "Number: " + number + "\n" +
          "Service: " + service + "\n" +
          "Message: " + message + "\n",
      };

      // Send Mail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Mail Send Error:", error);
          return res.status(500).json({ error: "Mail sending failed" });
        }

        console.log("Email sent:", info.response);
        res.json({ success: true, message: "Message sent successfully!" });
      });
    }
  );
});

module.exports = router;
