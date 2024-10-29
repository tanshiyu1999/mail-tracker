import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const trackingId = searchParams.get("trackingId");

  if (trackingId) {
    console.log(`Email opened with trackingId: ${trackingId}`);
  } else {
    console.log("Email opened, but no trackingId found");
  }

  try {
    await sql`
      UPDATE email_tracking 
      SET opened = TRUE, opened_at = CURRENT_TIMESTAMP 
      WHERE tracking_id = ${trackingId};
    `;
  } catch (error) {
    console.error("Error updating email tracking:", error);
  }

  return NextResponse.json(null, { status: 200 });

}
