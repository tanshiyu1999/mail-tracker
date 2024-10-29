const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Function to generate email content based on email list and template
function generateEmails() {
    // Paths for the email list CSV and email template
    const emailListPath = path.resolve('./data/email_list.scv');
    const emailTemplatePath = path.resolve('./data/email_temp.txt');

    // Read and parse the email list CSV file
    const recipients = [];
    fs.createReadStream(emailListPath)
        .pipe(csv())
        .on('data', (row) => {
            // Trim whitespace from field names and values
            const trimmedRow = {
                Department_Code: row['Department_Code']?.trim(),
                Email: row[' Email']?.trim(),
                Campany: row[' Campany']?.trim(),
                Name: row[' Name']?.trim(),
            };
            recipients.push(trimmedRow);
        })
        .on('end', () => {
            console.log('Email list loaded:', recipients);

            // Read the email template
            fs.readFile(emailTemplatePath, 'utf8', (err, template) => {
                if (err) {
                    console.error('Error reading email template:', err);
                    return;
                }
                console.log('Email template loaded.');

                // Extract subject from <h2> tag
                const subjectMatch = template.match(/<h2>Subject:\s*(.*?)<\/h2>/);
                const subject = subjectMatch ? subjectMatch[1] : 'No Subject';

                // Prepare emails for each recipient
                const emails = recipients.map(recipient => {
                    // Replace placeholders in the template
                    let emailContent = template
                        .replace('#name#', recipient.Name)
                        .replace('#department_code#', recipient.Department_Code)
                        .replace('#company#', recipient.Campany);

                    // Remove subject HTML from the content
                    emailContent = emailContent.replace(/<h2>Subject:.*?<\/h2>/, '');

                    // Prepare the email data structure
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

                // Output data format ready for backend processing
                const recipientData = emails.map(email => email.recipientInfo);
                const emailContents = emails.map(email => email.emailHTML);

                // Log final output (in a real application, send to backend instead)
                console.log('Recipient Data:', recipientData);
                console.log('Email HTML Contents:', emailContents);
            });
        });
}

// Call the function
generateEmails();
