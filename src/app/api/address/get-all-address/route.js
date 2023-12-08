import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "You are not Logged in",
      });
    }

    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const getAllAddress = await Address.find({ userID: id });

      if (getAllAddress) {
        return NextResponse.json({
          success: true,
          data: getAllAddress,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to fetch Address",
        });
      }
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong !",
    });
  }
}
