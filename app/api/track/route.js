import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const trackingId = searchParams.get("trackingId");

  if (trackingId) {
    console.log(`Email opened with trackingId: ${trackingId}`);
  } else {
    console.log("Email opened, but no trackingId found");
  }

  // Path to a 1x1 transparent pixel image
  const imagePath = path.resolve("./public/pixel.png");

  // Read the pixel image and return it as a response
  const image = fs.readFileSync(imagePath);
  return new NextResponse(image, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
