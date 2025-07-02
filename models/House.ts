import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
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
    utilities: {
      gasAmount: {
        type: Number,
        default: 0,
      },
      waterAmount: {
        type: Number,
        default: 0,
      },
      electricityAmount: {
        type: Number,
        default: 0,
      },
      internetAmount: {
        type: Number,
        default: 0,
      },
      otherAmount: {
        type: Number,
        default: 0,
      },
    },
    rooms: {
      type: Number,
      required: true,
    },
    singleRoomRent: {
      type: Number,
    },
    sharedRoomRent: {
      type: Number,
      required: true,
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
