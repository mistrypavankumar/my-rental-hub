import connectToDatabase from "@/lib/db";
import House from "@/models/House";
import Member from "@/models/Member";
import Rent from "@/models/Rent";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const memberId = params.get("memberId");

  await connectToDatabase();

  try {
    if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
    }

    const member = await Member.findById(memberId);

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ member }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch member details",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const memberId = params.get("memberId");

  await connectToDatabase();

  try {
    if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
    }

    const body = await request.json();

    const updatedMember = await Member.findByIdAndUpdate(memberId, body, {
      new: true,
    });

    if (!updatedMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ member: updatedMember }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update member details",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const memberId = params.get("memberId");

  await connectToDatabase();

  try {
    if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
    }

    const member = await Member.findById(memberId);

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const paymentGenerated = await Rent.findOne({
      houseId: member?.houseId,
    }).sort({ month: -1 });

    if (
      paymentGenerated?.isRentGenerated === true &&
      paymentGenerated.month.getMonth() + 1 === new Date().getMonth() + 1
    ) {
      return NextResponse.json(
        { error: "Cannot delete member, rent has already been generated" },
        { status: 400 }
      );
    }

    const updateHouse = await House.updateOne(
      { _id: member?.houseId },
      {
        $pull: { tenants: memberId },
      }
    );

    if (updateHouse.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update house tenants" },
        { status: 500 }
      );
    }

    const deletedMember = await Member.findByIdAndDelete(memberId);

    if (!deletedMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /member:", error);
    return NextResponse.json(
      {
        error: "Failed to delete member",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
