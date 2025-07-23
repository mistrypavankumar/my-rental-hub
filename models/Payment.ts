import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },

  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "House",
    required: true,
  },

  rentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rent",
    required: true,
  },

  houseRent: {
    type: Number,
  },

  gas: {
    type: Number,
    required: true,
  },
  electricity: {
    type: Number,
    required: true,
  },
  internet: {
    type: Number,
    default: 0,
  },
  water: {
    type: Number,
    default: 0,
  },
  totalRent: {
    type: Number,
    default: 0,
    required: true,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  remainingAmount: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  paidDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
