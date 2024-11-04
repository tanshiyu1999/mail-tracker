import csv from 'csv-parser';
import { Readable } from 'stream';

// Function to generate email content based on email list and template
async function generateEmails(csvFile, textFile) {
    // Read and parse the email list CSV content
    const recipients = [];
    
    // Convert the CSV file into a readable stream for parsing
    const csvContent = await csvFile.text();
    const csvStream = Readable.from(csvContent); // Create a readable stream from CSV text

    await new Promise((resolve, reject) => {
        csvStream
            .pipe(csv())
            .on('data', (row) => {
                const trimmedRow = {
                    Department_Code: row['Department_Code']?.trim(),
                    Email: row[' Email']?.trim(),
                    Campany: row[' Campany']?.trim(),
                    Name: row[' Name']?.trim(),
                };
                recipients.push(trimmedRow);
            })
            .on('end', resolve)
            .on('error', reject);
    });

    console.log('Email list loaded:', recipients);

    // Read the email template as a string
    const template = await textFile.text(); // Get the text content of the template file
    console.log('Email template loaded.');

    // Extract subject from <h2> tag
    const subjectMatch = template.match(/<h2>Subject:\s*(.*?)<\/h2>/);
    const subject = subjectMatch ? subjectMatch[1] : 'No Subject';

    // Prepare emails for each recipient
    const emails = recipients.map(recipient => {
        let emailContent = template
            .replace('#name#', recipient.Name)
            .replace('#department_code#', recipient.Department_Code)
            .replace('#company#', recipient.Campany);

        // Remove subject HTML from the content
        emailContent = emailContent.replace(/<h2>Subject:.*?<\/h2>/, '');

        return {
            recipientInfo: {
                name: recipient.Name,
                email: recipient.Email,
                department: recipient.Department_Code,
                company: recipient.Campany,
                subject: subject
            },
            emailHTML: emailContent
        };
    });

    const recipientData = emails.map(email => email.recipientInfo);
    const emailContents = emails.map(email => email.emailHTML);

    console.log('Recipient Data:', recipientData);
    console.log('Email HTML Contents:', emailContents);
    return {
        recipientData,
        emailContents
    }
}

export default generateEmails;
