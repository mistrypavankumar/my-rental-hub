import connectToDatabase from "@/lib/db";
import Rent from "@/models/Rent";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { rentId: string } }
) {
  const { rentId } = params;

  await connectToDatabase();

  const body = await request.json();
  const { updateFields } = body;

  // Validate rentId
  if (!rentId || !mongoose.Types.ObjectId.isValid(rentId)) {
    return NextResponse.json(
      { error: "Invalid or missing rentId" },
      { status: 400 }
    );
  }

  try {
    const existingRent = await Rent.findById(rentId);
    if (!existingRent) {
      return NextResponse.json(
        { error: "Rent record not found" },
        { status: 404 }
      );
    }

    const updatedRent = await Rent.findByIdAndUpdate(
      rentId,
      {
        ...updateFields,
        updatedAt: new Date(),
      },
      {
        new: true,
      }
    );

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

    await Rent.findByIdAndDelete(rentId);
    return NextResponse.json(
      { message: "Rent record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
