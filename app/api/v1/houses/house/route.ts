import connectToDatabase from "@/lib/db";
import Admin from "@/models/Admin";
import House from "@/models/House";
import Member from "@/models/Member";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const searchParams = request.nextUrl.searchParams;
  const houseId = searchParams.get("houseId");

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

export async function PUT(request: NextRequest) {
  await connectToDatabase();

  const params = request.nextUrl.searchParams;

  if (!params.has("houseId")) {
    return NextResponse.json(
      { error: "House ID is required" },
      { status: 400 }
    );
  }

  const houseId = params.get("houseId");

  const {
    name,
    address,
    ownerName,
    ownerPhone,
    defaultPrice,
    rooms,
    singleRoomRent,
    utilities,
    roomStatus,
    tenants,
    lateFeePerDay,
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
        singleRoomRent,
        lateFeePerDay,
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

export async function DELETE(request: NextRequest) {
  await connectToDatabase();

  const params = request.nextUrl.searchParams;

  const houseId = params.get("houseId");

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
    // Remove all members associated with the house
    await Member.deleteMany({ houseId });

    // Remove the house from the admin's houses array
    await Admin.findOneAndUpdate(
      { houses: houseId },
      { $pull: { houses: houseId } },
      { new: true }
    );

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
