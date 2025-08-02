import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "House",
    required: true,
  },
  role: {
    type: String,
    enum: ["owner", "tenant"],
    default: "tenant",
  },
  stayInSharedRoom: {
    type: Boolean,
    default: false,
  },
  houseRentApplied: {
    type: Boolean,
    default: true,
  },
  utilitiesApplied: {
    type: Boolean,
    default: true,
  },
  isStayHalfMonth: {
    type: Boolean,
    default: false,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Member || mongoose.model("Member", memberSchema);
