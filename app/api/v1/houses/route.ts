import connectToDatabase from "@/lib/db";
import Admin from "@/models/Admin";
import House from "@/models/House";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const adminId = request.headers.get("x-admin-id");

  const {
    name,
    address,
    ownerName,
    ownerPhone,
    defaultPrice,
    paymentDueDate,
    lateFeePerDay,
    rooms,
    utilitiesIncluded,
  } = await request.json();

  await connectToDatabase();

  try {
    if (
      !name ||
      !address ||
      !ownerName ||
      !ownerPhone ||
      !defaultPrice ||
      !rooms ||
      !adminId ||
      !paymentDueDate ||
      !lateFeePerDay
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate address fields
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode
    ) {
      return NextResponse.json(
        {
          error: "Invalid address format",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!phoneRegex.test(ownerPhone)) {
      return NextResponse.json(
        {
          error: "Invalid phone number format",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingHouse = await House.findOne({ name, ownerPhone });

    if (existingHouse) {
      return NextResponse.json(
        {
          error: "House with the same name and owner phone already exists",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newHouse = await House.create({
      adminId,
      name,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      },
      paymentDueDate,
      lateFeePerDay,
      utilitiesIncluded: utilitiesIncluded || false,
      ownerName,
      ownerPhone,
      defaultPrice,
      rooms,
    });

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return NextResponse.json(
        {
          error: "Admin not found",
        },
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await Admin.findByIdAndUpdate(adminId, {
      $push: { houses: newHouse._id },
    });

    return NextResponse.json(
      {
        message: "House created successfully",
        house: newHouse,
      },
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create house",
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
