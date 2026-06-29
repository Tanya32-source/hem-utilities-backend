const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Home Route
app.get("/", (req, res) => {
    res.send("🎉 HEM Utilities Backend is Running!");
});

// Contact Form Route
app.post("/contact", async (req, res) => {

    const { name, email, subject, message } = req.body;

    try {

        const data = await resend.emails.send({

            from: "HEM Utilities <onboarding@resend.dev>",

            to: process.env.EMAIL_USER,

            subject: `New Contact Form: ${subject}`,

            replyTo: email,

            html: `
                <h2>New Contact Form Submission</h2>

                <p><strong>Name:</strong> ${name}</p>

                <p><strong>Email:</strong> ${email}</p>

                <p><strong>Subject:</strong> ${subject}</p>

                <p><strong>Message:</strong></p>

                <p>${message}</p>
            `
        });

        console.log(data);

        res.json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });

    }

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});