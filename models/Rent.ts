import mongoose from "mongoose";

const rentSchema = new mongoose.Schema({
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "House",
    required: true,
  },
  month: {
    type: Date,
    required: Date.now,
  },
  houseRent: {
    type: Number,
    required: true,
  },
  gas: {
    type: Number,
  },
  electricity: {
    type: Number,
  },
  internet: {
    type: Number,
  },
  water: {
    type: Number,
  },
  totalRent: {
    type: Number,
    required: true,
  },
  splitAmount: {
    type: Number,
  },
  lateFeeApplied: {
    type: Boolean,
    default: false,
  },
  lateFeeAmount: {
    type: Number,
    default: 0,
  },
  reasonForLateFee: {
    type: String,
    default: "",
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Rent || mongoose.model("Rent", rentSchema);
