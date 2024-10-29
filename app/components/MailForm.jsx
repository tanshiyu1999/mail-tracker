// components/EmailForm.js
import { useState } from "react";

export default function EmailForm() {
  const [to, setTo] = useState("tanshiyu1999@gmail.com");
  const [subject, setSubject] = useState("test email");
  const [message, setMessage] = useState("test content");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, text: message }),
    });

    if (res.ok) {
      setStatus("Email sent successfully");
    } else {
      setStatus("Failed to send email");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Recipient's email"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit">Send Email</button>
      <p>{status}</p>
    </form>
  );
}
