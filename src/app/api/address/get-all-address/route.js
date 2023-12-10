import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDb();

    // Extract user ID from URL parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Check if user ID is provided
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "User ID is not provided in the request",
      });
    }

    // Authenticate user
    const isAuthUser = await AuthUser(req);

    // Check if user is authenticated
    if (isAuthUser) {
      // Perform database query using the user ID
      const getAllAddress = await Address.find({ userID: isAuthUser.id });

      // Check if addresses were found
      if (getAllAddress && getAllAddress.length > 0) {
        return NextResponse.json({
          success: true,
          data: getAllAddress,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "No addresses found for the specified user ID",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "Unauthorized user",
      });
    }
  } catch (e) {
    console.error("Error in GET request:", e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong!",
    });
  }
}
