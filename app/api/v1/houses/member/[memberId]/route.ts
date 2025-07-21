import connectToDatabase from "@/lib/db";
import House from "@/models/House";
import Member from "@/models/Member";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  const memberId = params.memberId;
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

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { memberId: string };
  }
) {
  const memberId = params.memberId;
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  const memberId = params.memberId;
  await connectToDatabase();

  try {
    if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
    }

    const member = await Member.findById(memberId);

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
    return NextResponse.json(
      {
        error: "Failed to delete member",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
