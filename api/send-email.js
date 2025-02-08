import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // TLS requires secure to be false
      auth: {
        user: process.env.HOTMAIL_USER, // Your Hotmail email
        pass: process.env.HOTMAIL_PASS, // App password or account password
      },
    });

    await transporter.sendMail({
      from: `${name} <${email}>`, // Display user's name and email as the sender
      to: process.env.RECEIVER_EMAIL, // Receiver's email (your email)
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
