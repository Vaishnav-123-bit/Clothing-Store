import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    await connectToDb();
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id)
        return NextResponse.json({ success: false, message: "Please Login" });
        
        const deleteCartItem=await Cart.findByIdAndDelete(id);
        if(deleteCartItem){
            return NextResponse.json({
                success:true,
                message:"Cart item deleted"
            });
        }else{
            return NextResponse.json({
                success:false,
                message:"Failed to deleteCart item "
            });
        }


    } else {
      return NextResponse.json({
        success: false,
        message: "Not auth user",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
