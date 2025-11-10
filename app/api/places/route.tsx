import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;

  if (!query) {
    return NextResponse.json({ status: "ERROR", message: "Missing query" });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${apiKey}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: "ERROR", message: "Failed to fetch" });
  }
}
