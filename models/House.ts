import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerPhone: {
      type: String,
      required: true,
    },
    defaultPrice: {
      type: Number,
      required: true,
    },
    utilitiesIncluded: {
      type: Boolean,
      default: false,
    },
    paymentDueDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    lateFeePerDay: {
      type: Number,
      default: 0,
      required: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    singleRoomRent: {
      type: Number,
    },
    roomStatus: [
      {
        roomNumber: {
          type: Number,
          required: true,
        },
        isOccupied: {
          type: Boolean,
          default: false,
        },
        tenantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    tenants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.House || mongoose.model("House", houseSchema);
