import connectToDatabase from "@/lib/db";
import PaymentHistory from "@/models/PaymentHistory";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { rentId: string } }
) {
  const params = context.params;
  const rentId = params.rentId;

  await connectToDatabase();

  try {
    if (!rentId || !mongoose.Types.ObjectId.isValid(rentId)) {
      return NextResponse.json({ error: "Invalid rent ID" }, { status: 400 });
    }

    const paymentHistory = await PaymentHistory.find({ rentId }).sort({
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
