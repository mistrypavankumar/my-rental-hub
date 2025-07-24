import connectToDatabase from "@/lib/db";
import Payment from "@/models/Payment";
import PaymentHistory from "@/models/PaymentHistory";
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
      remainingAmount:
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

export async function PUT(request: NextRequest) {
  const { paymentId, memberId, rentId, paidAmount, remainingAmount } =
    await request.json();
  await connectToDatabase();

  try {
    if (!paymentId || !mongoose.Types.ObjectId.isValid(paymentId)) {
      return NextResponse.json(
        { error: "Invalid payment ID" },
        { status: 400 }
      );
    }

    if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
    }

    if (!rentId || !mongoose.Types.ObjectId.isValid(rentId)) {
      return NextResponse.json({ error: "Invalid rent ID" }, { status: 400 });
    }

    if (typeof paidAmount !== "number" || paidAmount < 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (typeof remainingAmount !== "number" || remainingAmount < 0) {
      return NextResponse.json(
        { error: "Invalid remaining amount" },
        { status: 400 }
      );
    }

    const payment = await Payment.findOneAndUpdate(
      {
        _id: paymentId,
        memberId,
        rentId,
      },
      {
        paidAmount: paidAmount,
        remainingAmount: remainingAmount,
        paid: remainingAmount <= 0,
      }
    );

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found or not updated" },
        { status: 404 }
      );
    }

    await PaymentHistory.create({
      paymentId: payment._id,
      memberId,
      rentId,
      paidAmount,
      remainingAmount,
    });

    if (payment.remainingAmount <= 0) {
      payment.paid = true;
    }

    return NextResponse.json({ payment }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update payment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
