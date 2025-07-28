import mongoose from "mongoose";

const paymentHistorySchema = new mongoose.Schema(
  {
    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    memberName: {
      type: String,
      required: true,
    },
    rentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rent",
      required: true,
    },
    paidAmount: { type: Number, required: true },
    remainingAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PaymentHistory ||
  mongoose.model("PaymentHistory", paymentHistorySchema);
