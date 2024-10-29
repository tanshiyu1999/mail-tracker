// pages/api/sendEmail.js
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";


export async function POST(req, res) {
  const { to, subject, text } = await req.json();

  const trackingId = uuidv4();


  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // or any other email service
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.APP_PASSWORD, // your email password or app-specific password
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
    html: `${text} <img src="${process.env.BASE_URL}/api/track?trackingId=${trackingId}" width="1" height="1" alt="" style="display:none;" />`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("sent");
    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.log("not sent");
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
    });
  }
}
