import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Admin from "@/models/Admin";
import House from "@/models/House";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  const {
    name,
    address,
    ownerName,
    ownerPhone,
    defaultPrice,
    paymentDueDate,
    lateFeePerDay,
    rooms,
    utilitiesIncluded,
    singleRoomRent,
    sharedRoomRent,
  } = await request.json();

  await connectToDatabase();

  try {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    const verified = await verifyToken(token);
    if (!verified) {
      return NextResponse.json(
        { error: "Unauthorized token" },
        { status: 400 }
      );
    }

    const adminId = verified.adminId;

    // Check for required fields
    if (
      !name ||
      !address ||
      !ownerName ||
      !ownerPhone ||
      !defaultPrice ||
      !rooms ||
      !paymentDueDate ||
      !lateFeePerDay
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode
    ) {
      return NextResponse.json(
        { error: "Invalid address format" },
        { status: 400 }
      );
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(ownerPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const existingHouse = await House.findOne({
      name,
      adminId,
    });

    if (existingHouse) {
      return NextResponse.json(
        {
          error: "You have already created a house with this name.",
        },
        { status: 400 }
      );
    }

    const newHouse = await House.create({
      adminId,
      name,
      address,
      paymentDueDate,
      lateFeePerDay,
      utilitiesIncluded: utilitiesIncluded || false,
      ownerName,
      ownerPhone,
      defaultPrice,
      rooms,
      singleRoomRent,
      sharedRoomRent,
    });

    await Admin.findByIdAndUpdate(adminId, {
      $push: { houses: newHouse._id },
    });

    return NextResponse.json(
      {
        message: "House created successfully",
        house: newHouse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("House creation error:", error);
    return NextResponse.json(
      { error: "Failed to create house" },
      { status: 500 }
    );
  }
}
