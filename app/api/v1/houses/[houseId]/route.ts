import connectToDatabase from "@/lib/db";
import House from "@/models/House";
import Member from "@/models/Member";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { houseId: string } }
) {
  await connectToDatabase();

  const houseId = params.houseId;

  if (!houseId) {
    return NextResponse.json(
      { error: "House ID is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(houseId)) {
    return NextResponse.json(
      { error: "Invalid House ID format" },
      { status: 400 }
    );
  }

  try {
    const house = await House.findById(houseId);

    if (!house) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    return NextResponse.json({ house }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch house:", error);
    return NextResponse.json(
      { error: "Failed to fetch house" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { houseId: string } }
) {
  await connectToDatabase();

  const houseId = params.houseId;
  const {
    name,
    address,
    ownerName,
    ownerPhone,
    defaultPrice,
    rooms,
    sharedRoomRent,
    singleRoomRent,
    utilities,
    roomStatus,
    tenants,
  } = await request.json();

  if (!houseId) {
    return NextResponse.json(
      { error: "House ID is required" },
      { status: 400 }
    );
  }

  try {
    const existingHouse = await House.findById(houseId);

    if (!existingHouse) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    const house = await House.findByIdAndUpdate(
      houseId,
      {
        name,
        address,
        ownerName,
        ownerPhone,
        defaultPrice,
        rooms,
        sharedRoomRent,
        singleRoomRent,
        utilities: {
          gasAmount: utilities?.gasAmount || 0,
          waterAmount: utilities?.waterAmount || 0,
          electricityAmount: utilities?.electricityAmount || 0,
          internetAmount: utilities?.internetAmount || 0,
          otherAmount: utilities?.otherAmount || 0,
        },
        roomStatus: roomStatus || [],
        tenants: tenants || [],
      },
      { new: true }
    );

    return NextResponse.json({ house }, { status: 200 });
  } catch (error) {
    console.error("Failed to update house:", error);
    return NextResponse.json(
      { error: "Failed to update house" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { houseId: string } }
) {
  await connectToDatabase();

  const houseId = params.houseId;

  if (!houseId) {
    return NextResponse.json(
      { error: "House ID is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(houseId)) {
    return NextResponse.json(
      { error: "Invalid House ID format" },
      { status: 400 }
    );
  }

  try {
    await Member.deleteMany({ houseId });

    const house = await House.findByIdAndDelete(houseId);

    if (!house) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "House deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete house:", error);
    return NextResponse.json(
      { error: "Failed to delete house" },
      { status: 500 }
    );
  }
}
