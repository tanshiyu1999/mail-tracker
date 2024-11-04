import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET() {
    try {
        const response = await fetch('https://mail-tracker-cs3103.vercel.app/api/getData', {
            method: 'GET',
        });
      
          // Parse the response as JSON
        const tracker_data = await response.json();

        // const { rows } = await sql`SELECT * FROM email_tracking;`;
        const report = {};
        for (const record of tracker_data) {
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