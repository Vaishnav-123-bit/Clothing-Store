import connectToDb from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDb();
    const user = "admin";

    if (user === "admin") {
      const extractAllProducts = await Product.find({});

      if (extractAllProducts) {
        return NextResponse.json({
          success: true,
          data: extractAllProducts,
        });
      } else {
        return NextResponse.json({
          success: false,
          status: 204,
          message: "No products found",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authorized !!",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Error try again",
    });
  }
}
