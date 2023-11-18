import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDb();
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id)
        return NextResponse.json({ success: false, message: "Please Login" });

      const extractAllCartItems = await Cart.find({ userID: id })
        .populate("userID")
        .populate("productID");
      if (extractAllCartItems) {
        return NextResponse.json({
          success: true,
          data: extractAllCartItems,
        });
      }else{
        return NextResponse.json({
            success:false,
            status:204,
            message:"No cart items found"
        })
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "Not authenticated",
      });
    }
  } catch (e) {
    return NextResponse.json({
      success: true,
      message: "Something wrong | try agian",
    });
  }
}
