// pages/api/sendEmail.js
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { sql } from '@vercel/postgres';

// Example post req 


export async function POST(req, res) {
  // const {department_code, csv, template} = await req.json();

  const formData = await req.formData();
  console.log(formData);

  // from the csv and template, I will obtain email_info
  // Somehow i will get this eventually
  let email_info = [
    {
      department_code: "SOC",
      recipient_email: "tanshiyu1999@gmail.com",
      subject: "Imagine",
      html: `
        <p>Dear John Doe,</p>
        <p>We are writing to inform you that our policy has been updated.</p>
      `
    },
    {
      department_code: "CSC",
      recipient_email: "john.doe@example.com",
      subject: "Policy Update",
      html: `
        <p>Dear John Doe,</p>
        <p>We are writing to inform you that our policy has been updated.</p>
      `
    },
    {
      department_code: "SOC",
      recipient_email: "tanshiyu1999@gmail.com",
      subject: "Why no work",
      html: `
        <p>Dear John 2,</p>
        <p>We are writing to inform you that our policy has been updated.</p>
      `
    },
  ]


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

  const batchId = uuidv4();

  email_info = email_info.filter(info => info.department_code === department_code);

  try {
    console.log(email_info)
    for (let i = 0; i < email_info.length; i++) { 
      const trackingId = uuidv4();
      const text = "Plaintext version of the message";
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email_info[i].recipient_email,
        subject: email_info[i].subject,
        text: text,
        html: `${text} <img src="${process.env.BASE_URL}/api/track?trackingId=${trackingId}" width="1" height="1" alt="" style="display:inline;" />`,

      };
    

      await transporter.sendMail(mailOptions);


      await sql`INSERT INTO email_tracking (department_code, batch_id, tracking_id, recipient_email, subject) VALUES (${department_code}, ${batchId}, ${trackingId}, ${email_info[i].recipient_email}, ${email_info[i].subject})`;
    }
    return new Response(
      JSON.stringify({ message: "Emails sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.log("not sent");
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
    });
  }
}
