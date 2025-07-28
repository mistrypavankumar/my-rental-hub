import connectToDatabase from "@/lib/db";
import House from "@/models/House";
import Member from "@/models/Member";
import Rent from "@/models/Rent";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectToDatabase();

  try {
    const { name, phone, email, houseId, role, stayInSharedRoom } =
      await request.json();

    if (!name || !phone || !email || !houseId) {
      return NextResponse.json(
        {
          error:
            "Name, phone, email, houseId, and stayInSharedRoom are required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(houseId)) {
      return NextResponse.json({ error: "Invalid houseId" }, { status: 400 });
    }

    const existingMember = await Member.findOne({ email, houseId });

    if (existingMember) {
      return NextResponse.json(
        { error: "Member with this email already exists in the house" },
        { status: 409 }
      );
    }

    const latestRent = await Rent.findOne({ houseId }).sort({ month: -1 });

    if (
      latestRent &&
      latestRent.isRentGenerated &&
      latestRent.month.getMonth() + 1 === new Date().getMonth() + 1
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot add new member, rent of this month has already been generated",
        },
        { status: 400 }
      );
    }

    const newMember = await Member.create({
      name,
      phone,
      email,
      houseId,
      role: role || "tenant",
      stayInSharedRoom,
    });

    if (!newMember) {
      return NextResponse.json(
        { error: "Failed to create member" },
        { status: 500 }
      );
    }

    await House.findByIdAndUpdate(houseId, {
      $push: { tenants: newMember._id },
    });

    return NextResponse.json({ member: newMember }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /members:", error);
    return NextResponse.json(
      { error: "Failed to add member" },
      { status: 500 }
    );
  }
}

// Get members by houseId
export async function GET(request: NextRequest) {
  await connectToDatabase();

  const params = request.nextUrl.searchParams;

  const houseId = params.get("houseId");

  try {
    if (!houseId || !mongoose.Types.ObjectId.isValid(houseId)) {
      return NextResponse.json(
        { error: "Invalid or missing houseId" },
        { status: 400 }
      );
    }

    const members = await Member.find({ houseId });

    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch members",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
