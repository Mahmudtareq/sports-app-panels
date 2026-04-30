import { ROLE } from "@/config/constant";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse, generateSignature } from "@/lib/server.utils";
import { adminLoginSchema } from "@/lib/validation-schema";

import User from "@/model/User";
import bcrypt from "bcrypt";
import z from "zod";

export const POST = asyncHandler(
  adminLoginSchema,
  async (_, data: z.infer<typeof adminLoginSchema>) => {
    const { email, password } = data;

    console.log("-----------------------------");

    const admin = await User.findOne({ email: email });
    if (!admin) return apiResponse(false, 400, "Invalid account!");

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return apiResponse(false, 400, "Invalid password!");
    }

    const token = generateSignature(
      { email: admin.email, role: ROLE.ADMIN },
      20 * 24 * 60 * 60,
      // 1 * 60,
    );

    return apiResponse(true, 200, "Admin login done successfully!", { token });
  },
);
