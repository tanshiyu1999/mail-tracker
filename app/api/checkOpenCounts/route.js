import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request) {
    const similated_data = [
        {
            id: 1,
            department_code: "HR2024",
            batch_id: "batch-1",
            tracking_id: "track-1",
            recipient_email: "john.doe@example.com",
            subject: "Policy Update",
            sent_at: "2024-11-03T10:30:00Z",
            count: 1
        },
        {
            id: 2,
            department_code: "HR2024",
            batch_id: "batch-2",
            tracking_id: "track-2",
            recipient_email: "jane.smith@example.com",
            subject: "Quarterly Update",
            sent_at: "2024-11-03T11:15:00Z",
            count: 2
        },
        {
            id: 3,
            department_code: "IT304",
            batch_id: "batch-3",
            tracking_id: "track-3",
            recipient_email: "alex.taylor@example.com",
            subject: "System Maintenance",
            sent_at: "2024-11-03T12:00:00Z",
            count: 0
        },
        {
            id: 4,
            department_code: "IT304",
            batch_id: "batch-3",
            tracking_id: "track-4",
            recipient_email: "maria.lopez@example.com",
            subject: "System Update",
            sent_at: "2024-11-03T13:45:00Z",
            count: 1
        },
        {
            id: 5,
            department_code: "IT304",
            batch_id: "batch-4",
            tracking_id: "track-5",
            recipient_email: "steven.king@example.com",
            subject: "Security Alert",
            sent_at: "2024-11-03T14:20:00Z",
            count: 0
        },
        {
            id: 6,
            department_code: "HR2024",
            batch_id: "batch-1",
            tracking_id: "track-6",
            recipient_email: "michael.jones@example.com",
            subject: "Policy Reminder",
            sent_at: "2024-11-03T15:00:00Z",
            count: 1
        },
        {
            id: 7,
            department_code: "FIN500",
            batch_id: "batch-5",
            tracking_id: "track-7",
            recipient_email: "susan.lee@example.com",
            subject: "Financial Report",
            sent_at: "2024-11-03T15:30:00Z",
            count: 2
        },
        {
            id: 8,
            department_code: "FIN500",
            batch_id: "batch-6",
            tracking_id: "track-8",
            recipient_email: "anna.white@example.com",
            subject: "Budget Overview",
            sent_at: "2024-11-03T16:00:00Z",
            count: 3
        },
        {
            id: 9,
            department_code: "FIN500",
            batch_id: "batch-5",
            tracking_id: "track-9",
            recipient_email: "robert.brown@example.com",
            subject: "Audit Notice",
            sent_at: "2024-11-03T16:30:00Z",
            count: 1
        }
    ];

    try {
        // Fetch records for group 38
        // const { rows } = await sql`SELECT * FROM ;`;
        const report = {};
        for (const record of similated_data) {
            if (!report.hasOwnProperty(record['department_code'])) {
                report[record['department_code']] = {
                    email_count: 0,
                    batch_opened: {}
                };
            }
            const current_obj = report[record['department_code']]
    
            if (!current_obj.batch_opened.hasOwnProperty(record['batch_id'])) {
                current_obj.batch_opened[record['batch_id']] = {"subject": record['subject'], open_times: 0}
                current_obj.email_count += 1
            }
            current_obj.batch_opened[record['batch_id']].open_times += record['count']
        }
          
    
        return new NextResponse(JSON.stringify(report), {
            status: 200,
            headers: {
                'Content-Type': 'application/json', // Ensures the client knows it's JSON
            },
        });
    } catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }

}