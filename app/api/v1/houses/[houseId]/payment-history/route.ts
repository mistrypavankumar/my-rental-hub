import connectToDatabase from "@/lib/db";
import PaymentHistory from "@/models/PaymentHistory";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { houseId: string } }
) {
  const houseId = params.houseId;
  await connectToDatabase();

  try {
    if (!houseId || !mongoose.Types.ObjectId.isValid(houseId)) {
      return NextResponse.json({ error: "Invalid house ID" }, { status: 400 });
    }

    const paymentHistory = await PaymentHistory.find({ houseId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ paymentHistory }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch payment history",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
