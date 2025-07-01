import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const { email, password, name, phone } = await request.json();

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

    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return NextResponse.json(
        {
          error: "Please provide a valid phone number (10 digits)",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
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

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      role: "admin",
    });

    return NextResponse.json({
      message: "User registered successfully",
      user: newUser,
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
