import connectToDatabase from "@/lib/db";
import { signToken } from "@/lib/jwt";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const { email, password } = await request.json();

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = await signToken({
      adminId: admin._id.toString(),
      role: admin.role,
    });

    // Prepare response and set cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        admin: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          createdAt: admin.createdAt,
        },
      },
      { status: 200 }
    );

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred during login",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
