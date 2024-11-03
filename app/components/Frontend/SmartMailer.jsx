import React, { useState } from 'react';
import FileInput from './FileInput';
import ProgressLog from './ProgressLog';
import './SmartMailer.css';  // Import the pastel theme styles

export default function SmartMailer() {
  const [department, setDepartment] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [textFile, setTextFile] = useState(null);
  const [logMessages, setLogMessages] = useState([]);

  // Log message helper function
  const logMessage = (message) => {
    setLogMessages((prevMessages) => [...prevMessages, message]);
  };

  // Handler for sending emails
  const handleSendEmails = async () => {
    if (!department || !csvFile || !textFile) {
      logMessage('Please fill in all fields and select all files.');
      return;
    }

    logMessage('Sending emails...');

    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append('department', department);
    formData.append('csvFile', csvFile);
    formData.append('textFile', textFile);

    // Send data to orchestrator to start the email-sending process
    try {
      // Send the FormData object to the backend
      const response = await fetch('/api/sendEmails', {
        method: 'POST',
        body: formData, // FormData object
      });

      if (response.ok) {
        const reportData = await response.json();
        logMessage(`Report: ${reportData.message}`);
      } else {
        logMessage('Failed to send emails.');
      }
    } catch (error) {
      logMessage('Error sending request to server.');
      console.error('Error:', error);
    }
  };

  // Handler for checking email open counts
  const handleCheckOpenCounts = async () => {
    logMessage('Checking email open counts...');

    const response = await fetch('/api/checkOpenCounts', {
      method: 'GET',
    });

    if (response.ok) {
      const openCounts = await response.json();
      openCounts.forEach((entry) => {
        logMessage(`Email sent to ${entry.department} opened ${entry.count} times`);
      });
    } else {
      logMessage('Failed to retrieve open counts.');
    }
  };

  return (
    <div className="smart-mailer" style={{ backgroundColor: '#AEDFF7' }}>
      <label>Department Code:</label>
      <input
        type="text"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        placeholder="Enter Department Code"
        className="pastel-yellow"
      />
      
      <FileInput label="CSV File" file={csvFile} setFile={setCsvFile} />
      <FileInput label="Email Text File" file={textFile} setFile={setTextFile} />

      <button className="pastel-pink-button" onClick={handleSendEmails}>
        Send Emails
      </button>
      <button className="pastel-pink-button" onClick={handleCheckOpenCounts}>
        Check Open Counts
      </button>

      <ProgressLog logMessages={logMessages} />
    </div>
  );
}
