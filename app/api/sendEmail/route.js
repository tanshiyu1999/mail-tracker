// pages/api/sendEmail.js
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { sql } from '@vercel/postgres';
import generateEmails from "@/app/script/generate";
// Example post req 


export async function POST(req, res) {
  // const {department_code, csv, template} = await req.json();

  const formData = await req.formData();
  const department = formData.get("department");
  const csvFile = formData.get("csvFile");
  const textFile = formData.get("textFile");

  let email_info = [];

  async function handleEmails() {
    try {
      const email_info = await generateEmails(csvFile, textFile);
      return email_info ? email_info : [];
    } catch (error) {
      console.error("Error:", error);
    }
  }

  email_info = await handleEmails();
  

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

  if (email_info.length === 0) {
    return new Response(
      JSON.stringify({ error: "Failed to generate emails" }),
      { status: 500 }
    );
  }
  if (department !== "all") {
    email_info = email_info.filter(info => info.department === department);
  }



  try {
    for (let i = 0; i < email_info.length; i++) { 
      const trackingId = uuidv4();
      const trackingImg = `<img src="${process.env.BASE_URL}/api/track?trackingId=${trackingId}" width="1" height="1" alt="" style="display:inline;" />`;
      const html = email_info[i].emailHTML.replace('</body>', `${trackingImg}</body>`);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email_info[i].email,
        subject: email_info[i].subject,
        html: html,
      };

    

      await transporter.sendMail(mailOptions);


      await sql`INSERT INTO email_tracking (department_code, batch_id, tracking_id, recipient_email, subject) VALUES (${department}, ${batchId}, ${trackingId}, ${email_info[i].email}, ${email_info[i].subject})`;
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
