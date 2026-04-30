import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { passwordChangeSchema } from "@/lib/validation-schema";
import User from "@/model/User";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import z from "zod";

export const PUT = asyncHandler(
  passwordChangeSchema,
  async (req: NextRequest, data: z.infer<typeof passwordChangeSchema>) => {
    const { oldPassword, newPassword } = data;

    const admin = await User.findById(req.user._id);

    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
    if (!isPasswordValid)
      return apiResponse(false, 400, "Old password is incorrect!");

    const isSame = await bcrypt.compare(newPassword, admin.password);
    if (isSame)
      return apiResponse(
        false,
        400,
        "New password cannot be same as old password!",
      );

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { password: hashedPassword },
    );

    return apiResponse(true, 200, "Admin password updated successfully!");
  },
  true,
);
