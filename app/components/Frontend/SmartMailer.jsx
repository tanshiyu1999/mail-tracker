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

    console.log(department)
    console.log(csvFile)
    console.log(textFile)

    logMessage('Sending emails...');

    // Send data to orchestrator to start the email-sending process
    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        department_code: department,
        csv: csvFile,
        template: textFile,
      }),
    });

    if (response.ok) {
      const reportData = await response.json();
      logMessage(`Report: ${reportData.message}`); // Adjust this based on the response format
    } else {
      logMessage('Failed to send emails.');
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
      console.log(openCounts)

      // Print out the report about the number of emails have been sent
      logMessage("-----------------------------------\nDepartment\t\tNumber of emails");
      Object.keys(openCounts).forEach((entry) => {
        logMessage(`${entry}\t\t\t${openCounts[entry].email_count}`);
      });

      // Print out the report of the viewed times of each email batch
      logMessage("-----------------------------------\nDepartment\t\tSubject\t\tOpen times");
      Object.keys(openCounts).forEach((entry) => {
        let first_flag = 1
        Object.keys(openCounts[entry].batch_opened).forEach((batch) => {
          const current_b = openCounts[entry].batch_opened[batch]
          if(first_flag==1){
            logMessage(`${entry}\t\t\t${current_b['subject']}\t\t\t${current_b['open_times']}`)
          }
          else{
            logMessage(`\t\t\t\t${current_b['subject']}\t\t\t${current_b['open_times']}`)
          }
          first_flag = 0
        })
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