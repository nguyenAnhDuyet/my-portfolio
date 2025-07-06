import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import axios from 'axios'; // Nếu cần dùng lại Telegram, bỏ comment dòng này

// Tạo transporter cho Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSKEY,
  },
});

// Hàm tạo template email HTML
const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

// ========================
// PHẦN GỬI TELEGRAM (ĐÃ COMMENT LẠI)
// ========================
// Helper function to send a message via Telegram
async function sendTelegramMessage(token, chat_id, message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await axios.post(url, {
      text: message,
      chat_id,
    });
    return res.data.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    return false;
  }
}
// ========================

// Hàm gửi email
async function sendEmail({ name, email, message: userMessage }) {
  const mailOptions = {
    from: 'Portfolio',
    to: process.env.EMAIL_ADDRESS,
    subject: `New Message From ${name}`,
    text: `New message from ${name}\n\nEmail: ${email}\n\nMessage:\n\n${userMessage}\n\n`,
    html: generateEmailTemplate(name, email, userMessage),
    replyTo: email,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error while sending email:', error.message);
    return false;
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    // ========================
    // PHẦN GỬI TELEGRAM (ĐÃ COMMENT LẠI)
    // ========================
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = parseInt(process.env.TELEGRAM_CHAT_ID);
    const message = `New message from ${payload.name}\n\nEmail: ${payload.email}\n\nMessage:\n\n${payload.message}\n\n`;
    // Gửi Telegram
    const telegramSuccess = await sendTelegramMessage(token, chat_id, message);
    // ========================
    const emailSuccess = await sendEmail(payload);
    if (emailSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Message sent to your email successfully!' + (telegramSuccess ? ' (Telegram sent)' : ' (Telegram failed)'),
      }, { status: 200 });
    }
    return NextResponse.json({
      success: false,
      message: 'Failed to send email.',
    }, { status: 500 });
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Server error occurred.',
    }, { status: 500 });
  }
}