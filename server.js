const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// =========================
// CHANGE THESE DETAILS
// =========================
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
     family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

// =========================
// Home Route
// =========================

app.get("/", (req, res) => {
    res.send("🎉 HEM Utilities Backend is Running!");
});

// =========================
// Contact Form Route
// =========================

app.post("/contact", async (req, res) => {

    const { name, email, subject, message } = req.body;

    try {

        await transporter.sendMail({

            from: `"HEM Website" <${process.env.EMAIL_USER}>`,

            to: process.env.EMAIL_USER, // Email where you want to receive enquiries

            subject: `New Contact Form: ${subject}`,

            html: `
                <h2>New Contact Form Submission</h2>

                <p><strong>Name:</strong> ${name}</p>

                <p><strong>Email:</strong> ${email}</p>

                <p><strong>Subject:</strong> ${subject}</p>

                <p><strong>Message:</strong></p>

                <p>${message}</p>
            `
        });

        res.json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });

    }

});

// =========================
// Start Server
// =========================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});