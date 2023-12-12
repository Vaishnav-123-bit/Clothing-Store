// Import necessary modules and models
import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDb();

    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const { searchParams } = new URL(req.url);
      console.log(searchParams)
      const id = searchParams.get('id');

      if (id) {
        const extarctAllData = await Order.find({ user: isAuthUser.id }).populate('orderItems.product');

        if (extarctAllData) {
          return NextResponse.json({
            success: true,
            data: extarctAllData
          });
        } else {
          return NextResponse.json({
            success: false,
            message: "Failed to get all orders."
          });
        }
      } else {
        return NextResponse.json({
          success: false,
          message: "Invalid or missing user ID."
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are unauthorized."
      });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong."
    });
  }
}
