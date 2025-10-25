import { NextResponse } from "next/server";
import { verifiedClinics } from "@/lib/verified-clinics"; // Import our mock data

export async function POST(request) {
  try {
    const body = await request.json();
    const { hfrId } = body;

    if (!hfrId) {
      return NextResponse.json(
        { message: "HFR ID is required." },
        { status: 400 }
      );
    }

    // Find the clinic in our "database" (the array)
    const clinic = verifiedClinics.find(
      (c) => c.hfrId.toLowerCase() === hfrId.toLowerCase()
    );

    // Check if the clinic was found
    if (clinic) {
      // If found, it's verified. Return a success message and the clinic data.
      return NextResponse.json(
        { message: "Clinic verified successfully.", clinic },
        { status: 200 }
      );
    } else {
      // If not found, it's an invalid ID.
      return NextResponse.json(
        { message: "Invalid HFR ID. This clinic is not recognized." },
        { status: 404 } // 404 Not Found is appropriate here
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
