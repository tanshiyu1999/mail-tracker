import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { sql } from '@vercel/postgres';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parsing for formidable
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to parse form data" });
    }

    const department_code = fields.department; // Department code from form data
    const csvFile = files.csvFile; // CSV file from form data
    const textFile = files.textFile; // Text file from form data

    console.log(csvFile)
    console.log(textFile)

    // For this example, assuming you obtain `email_info` from csvFile & textFile
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
    ];

    // Filter email_info based on department_code
    email_info = email_info.filter(info => info.department_code === department_code);

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    const batchId = uuidv4();

    try {
      for (let i = 0; i < email_info.length; i++) {
        const trackingId = uuidv4();
        const text = "Plaintext version of the message";
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email_info[i].recipient_email,
          subject: email_info[i].subject,
          text: text,
          html: `${email_info[i].html} <img src="${process.env.BASE_URL}/api/track?trackingId=${trackingId}" width="1" height="1" alt="" style="display:none;" />`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Insert tracking information into the database
        await sql`INSERT INTO email_tracking (department_code, batch_id, tracking_id, recipient_email, subject) VALUES (${department_code}, ${batchId}, ${trackingId}, ${email_info[i].recipient_email}, ${email_info[i].subject})`;
      }

      res.status(200).json({ message: "Emails sent successfully" });
    } catch (error) {
      console.log("Error sending emails:", error);
      res.status(500).json({ error: "Failed to send emails" });
    }
  });
}
