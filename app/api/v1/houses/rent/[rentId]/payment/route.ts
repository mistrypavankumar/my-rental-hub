import connectToDatabase from "@/lib/db";
import Payment from "@/models/Payment";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { rentId: string } }
) {
  const rentId = params.rentId;
  await connectToDatabase();

  const searchParams = request.nextUrl.searchParams;

  try {
    if (!rentId || !mongoose.Types.ObjectId.isValid(rentId)) {
      return NextResponse.json({ error: "Invalid rent ID" }, { status: 400 });
    }

    const memberId = searchParams.get("memberId");

    let payments = undefined;

    if (memberId) {
      if (!mongoose.Types.ObjectId.isValid(memberId)) {
        return NextResponse.json(
          { error: "Invalid member ID" },
          { status: 400 }
        );
      }
      payments = await Payment.find({ rentId, memberId });
    } else {
      payments = await Payment.find({ rentId });
    }

    if (!payments || payments.length === 0) {
      return NextResponse.json({ error: "No payments found" }, { status: 404 });
    }

    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch payments",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { rentId: string } }
) {
  const rentId = params.rentId;
  await connectToDatabase();

  try {
    if (!rentId || !mongoose.Types.ObjectId.isValid(rentId)) {
      return NextResponse.json({ error: "Invalid rent ID" }, { status: 400 });
    }

    const body = await request.json();
    const newPayment = new Payment({
      ...body,
      rentId,
      totalRent:
        body.houseRent +
        body.gas +
        body.electricity +
        body.internet +
        body.water,
    });

    const savedPayment = await newPayment.save();

    return NextResponse.json({ payment: savedPayment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create payment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
