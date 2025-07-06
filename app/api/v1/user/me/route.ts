import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Admin from "@/models/Admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const token = request.cookies.get("authToken")?.value;

  try {
    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const verified = await verifyToken(token);

    if (!verified || typeof verified !== "object" || !("adminId" in verified)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await Admin.findById(verified.adminId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
