import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    await connectToDb();
    const isAuthUser = await AuthUser(req);
    if (isAuthUser?.role === "admin") {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
        return NextResponse.json({
          success: true,
          message: "Product id is required ",
        });
      }

      const deleteProduct = await Product.findByIdAndDelete(id);

      if (deleteProduct) {
        return NextResponse.json({
          success: true,
          message: "product deleted successfully !! ",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "failed to delete",
        });
      }
    }else{
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });

    }
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong | Try again ",
    });
  }
}
