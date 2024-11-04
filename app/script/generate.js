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
                // Trim whitespace from field names and values
                const trimmedRow = {};
                for (const key in row) {
                    if (row.hasOwnProperty(key)) {
                        trimmedRow[key.trim()] = row[key]?.trim();
                    }
                }
                recipients.push(trimmedRow);
            })
            .on('end', resolve)
            .on('error', reject);
    });

    // console.log('Email list loaded:', recipients);

    // Read the email template as a string
    const template = await textFile.text(); // Get the text content of the template file
    // console.log('Email template loaded.');

    // Extract subject from <h2> tag
    const subjectMatch = template.match(/<h2>Subject:\s*(.*?)<\/h2>/);
    const subject = subjectMatch ? subjectMatch[1] : 'No Subject';

    // Prepare emails for each recipient and return the combined results
    const results = recipients.map(recipient => {
        let emailContent = template;

        // Replace placeholders dynamically in the template based on CSV headers
        for (const key in recipient) {
            if (recipient.hasOwnProperty(key)) {
                const placeholder = `#${key}#`;
                emailContent = emailContent.replace(new RegExp(placeholder, 'g'), recipient[key]);
            }
        }
        emailContent = emailContent.replace(/<h2>Subject:.*?<\/h2>/, '');

        // Pack the information and email content into a single object
        const result = {
            name: recipient.Name,
            email: recipient.Email,
            department: recipient.Department_Code,
            company: recipient.Campany,
            subject: subject,
            emailHTML: `${emailContent}`
        };

        return result;
    });

    // Log the final output for debugging
    // console.log('Final output:', results);

    // Return the combined results
    return results;
}

export default generateEmails;