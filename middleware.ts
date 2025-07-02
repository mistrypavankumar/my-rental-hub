import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";
import bcrypt from "bcryptjs";

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

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.userId as string);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
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
