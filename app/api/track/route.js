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

  
  // Path to a 1x1 transparent pixel image
  const imagePath = path.resolve("./public/pixel.png");

  // Read the pixel image
  const image = fs.readFileSync(imagePath);

  // Return the pixel image with a 200 status code
  return new NextResponse(image, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
