import connectToDb from "@/database";
import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDb();

    const user = await AuthUser(req);
    

    if (user) {
      const userID = user.id;
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      console.log(id)
      
      if (!id)
        return NextResponse.json({
          success: false,
          message: "Please login in!",
        });
      const extractAllCartItems = await Cart.find({ userID: id }).populate(
        productID
      );

      if (extractAllCartItems) {
        return NextResponse.json({ success: true, data: extractAllCartItems });
      } else {
        return NextResponse.json({
          success: false,
          message: "No Cart items are found !",
          status: 204,
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated",
      });
    }
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again",
    });
  }
}