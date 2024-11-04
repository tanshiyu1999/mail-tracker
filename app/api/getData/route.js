import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Fetch all records from the email_tracking table
    const { rows } = await sql`SELECT * FROM email_tracking;`;

    // Return the data as a JSON response
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching email tracking data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
