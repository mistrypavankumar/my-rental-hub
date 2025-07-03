import connectToDatabase from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const { email, password, name } = await request.json();

  try {
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        {
          error: "Name must be at least 2 characters long",
        },
        {
          status: 400,
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Please provide a valid email address",
        },
        {
          status: 400,
        }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters long",
        },
        {
          status: 400,
        }
      );
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return NextResponse.json(
        {
          error: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
      name,
      role: "admin",
    });

    return NextResponse.json({
      message: "Admin registered successfully",
      admin: newAdmin,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred during registration",
      },
      {
        status: 500,
      }
    );
  }
}
