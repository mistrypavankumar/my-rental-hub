import connectToDatabase from "@/lib/db";
import House from "@/models/House";
import Member from "@/models/Member";
import Rent from "@/models/Rent";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectToDatabase();

  try {
    const {
      month,
      houseId,
      gas,
      electricity,
      internet,
      water,
      houseRent,
      totalRent,
    } = await request.json();

    if (!month || !houseId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(houseId)) {
      return NextResponse.json({ error: "Invalid houseId" }, { status: 400 });
    }

    const house = await House.findById(houseId);
    if (!house) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    const members = await Member.find({ houseId });
    if (!members.length) {
      return NextResponse.json({ error: "No tenants found" }, { status: 404 });
    }

    const rent = await Rent.create({
      month,
      houseId,
      gas,
      electricity,
      internet,
      water,
      houseRent,
      totalRent,
      lateFeeApplied: false,
      lateFeeAmount: 0,
      reasonForLateFee: "",
    });

    return NextResponse.json(
      {
        message: "Rent calculated and recorded successfully",
        rent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating rent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const houseId = request.nextUrl.searchParams.get("houseId");

  try {
    if (!houseId || !mongoose.Types.ObjectId.isValid(houseId)) {
      return NextResponse.json(
        { error: "Invalid or missing houseId" },
        { status: 400 }
      );
    }

    const rents = await Rent.find({ houseId }).sort({ month: -1 });
    return NextResponse.json(
      {
        message: "Rents fetched successfully",
        rents,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: (error as Error).message || "Failed to fetch rents",
      },
      { status: 500 }
    );
  }
}
