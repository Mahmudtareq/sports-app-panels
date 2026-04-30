import User from "@/model/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { AuthUser } from "./types";
import { apiResponse } from "./utils";

export async function authenticate(
  req: NextRequest
): Promise<{ data?: AuthUser; error?: NextResponse }> {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return {
        error: apiResponse(false, 401, "Unauthorized Token!"),
      };
    }

    const token = authHeader.substring(7);

    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error("NEXTAUTH_SECRET is not defined!");
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);

    if (typeof decoded === "string" || !decoded.email) {
      return {
        error: apiResponse(false, 401, "Invalid token format!"),
      };
    }

    const user = await User.findOne({ email: decoded?.email });
    if (!user) return { error: apiResponse(false, 401, "User not found!") };

    // Return data if authentication is successful
    return {
      data: {
        _id: user._id.toString(),
      },
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { error: apiResponse(false, 401, "Token expired!") };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return { error: apiResponse(false, 401, "Invalid token!") };
    }

    // Handle other errors
    return { error: apiResponse(false, 401, "Authentication failed!") };
  }
}
