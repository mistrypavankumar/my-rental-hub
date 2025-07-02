import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  const publicRoutes = [
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/forgot-password",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Reject if token is missing
  if (!token) {
    return NextResponse.json(
      { error: "Authentication token is missing" },
      { status: 401 }
    );
  }

  try {
    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token or expired" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid or expired token",
      },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/v1/:path*"],
};
