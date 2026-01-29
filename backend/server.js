const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const nodemailer = require("nodemailer");

const app = express();

// ===================
// Middleware
// ===================
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===================
// Nodemailer Transporter (create once)
// ===================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP on startup
transporter.verify((error) => {
  if (error) {
    console.log("SMTP Connection Error:", error.message);
  } else {
    console.log("SMTP Server Ready");
  }
});

// ===================
// TEST ROUTE
// ===================
app.get("/", (req, res) => {
  res.send("Zaarix Backend Running");
});

// ===================
// CONTACT FORM + MAIL
// ===================
app.post("/api/contact", (req, res) => {
  const { name, email, phone, service, message } = req.body;

  db.run(
    `INSERT INTO contacts (name,email,phone,service,message,status)
     VALUES (?,?,?,?,?,?)`,
    [name, email, phone, service, message, "new"],
    function (err) {
      if (err) {
        console.log("DB Error:", err.message);
        return res.status(500).json({ success: false });
      }

      // Mail content
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.RECEIVER_MAIL,
        subject: "New Consultation - Zaarix",
        text:
          `New Enquiry Received\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Phone: ${phone}\n` +
          `Service: ${service}\n` +
          `Message: ${message}\n`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.log("Mail Send Error:", error.message);
          return res.json({ success: true, mailSent: false });
        }
        console.log("Mail Sent Successfully");
        return res.json({ success: true, mailSent: true });
      });
    }
  );
});

// ===================
// CONTACTS (ADMIN)
// ===================
app.get("/api/contacts", (req, res) => {
  db.all("SELECT * FROM contacts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      console.log("Fetch Contacts Error:", err.message);
      return res.status(500).json([]);
    }
    res.json(rows);
  });
});

app.delete("/api/contact/:id", (req, res) => {
  db.run("DELETE FROM contacts WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      console.log("Delete Contact Error:", err.message);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

app.put("/api/contact/:id/status", (req, res) => {
  const { status } = req.body;
  db.run(
    "UPDATE contacts SET status = ? WHERE id = ?",
    [status, req.params.id],
    function (err) {
      if (err) {
        console.log("Update Status Error:", err.message);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    }
  );
});

// ===================
// SERVICES (ADMIN)
// ===================
app.get("/api/services", (req, res) => {
  db.all("SELECT * FROM services ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.log("Fetch Services Error:", err.message);
      return res.status(500).json([]);
    }
    res.json(rows);
  });
});

app.post("/api/services", (req, res) => {
  const { title, description } = req.body;
  db.run(
    "INSERT INTO services (title, description) VALUES (?,?)",
    [title, description],
    function (err) {
      if (err) {
        console.log("Add Service Error:", err.message);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    }
  );
});

app.delete("/api/services/:id", (req, res) => {
  db.run("DELETE FROM services WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      console.log("Delete Service Error:", err.message);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// ===================
// PROJECTS (ADMIN)
// ===================
app.get("/api/projects", (req, res) => {
  db.all("SELECT * FROM projects ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.log("Fetch Projects Error:", err.message);
      return res.status(500).json([]);
    }
    res.json(rows);
  });
});

app.post("/api/projects", (req, res) => {
  const { title, image, link } = req.body;
  db.run(
    "INSERT INTO projects (title, image, link) VALUES (?,?,?)",
    [title, image, link],
    function (err) {
      if (err) {
        console.log("Add Project Error:", err.message);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    }
  );
});

app.delete("/api/projects/:id", (req, res) => {
  db.run("DELETE FROM projects WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      console.log("Delete Project Error:", err.message);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// ===================
// START SERVER
// ===================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Backend Running on Port " + PORT);
});
