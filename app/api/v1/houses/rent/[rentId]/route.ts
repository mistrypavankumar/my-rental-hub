import connectToDatabase from "@/lib/db";
import Payment from "@/models/Payment";
import Rent from "@/models/Rent";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { rentId: string } }
) {
  const rentId = params!.rentId;

  await connectToDatabase();

  try {
    if (!rentId || !mongoose.Types.ObjectId.isValid(rentId)) {
      return NextResponse.json(
        { error: "Invalid or missing rentId" },
        { status: 400 }
      );
    }

    const rent = await Rent.findById(rentId);

    if (!rent) {
      return NextResponse.json(
        { error: "Rent record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ rent }, { status: 200 });
  } catch (error) {
    console.error("Error fetching rent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { rentId: string } }
) {
  const rentId = params.rentId;

  await connectToDatabase();

  try {
    // Validate rentId
    if (!rentId || !mongoose.Types.ObjectId.isValid(rentId)) {
      return NextResponse.json(
        { error: "Invalid or missing rentId" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updatedRent = await Rent.findByIdAndUpdate(rentId, body, {
      new: true,
    });

    if (!updatedRent) {
      return NextResponse.json(
        { error: "Rent record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Rent record updated successfully",
        rent: updatedRent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating rent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { rentId: string } }
) {
  const { rentId } = params;

  await connectToDatabase();

  try {
    if (!rentId || !mongoose.Types.ObjectId.isValid(rentId)) {
      return NextResponse.json(
        { error: "Invalid or missing rentId" },
        { status: 400 }
      );
    }

    const existingRent = await Rent.findById(rentId);

    if (!existingRent) {
      return NextResponse.json(
        { error: "Rent record not found" },
        { status: 404 }
      );
    }

    await Payment.deleteMany({ rentId });

    await Rent.findByIdAndDelete(rentId);

    return NextResponse.json(
      { message: "Rent record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
