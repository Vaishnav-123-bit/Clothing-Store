import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDb();
    const isAuthUser = await AuthUser(req);

    if (!isAuthUser) {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated.",
      });
    }

    const user = isAuthUser.id;

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User information is missing in the request.",
      });
    }

    const data = await req.json();

    const saveNewOrder = await Order.create({
      ...data,
      user: user,
    });

    if (saveNewOrder) {
      // Use the deleteItemsByUserID method to delete cart items
      await Cart.deleteItemsByUserID(user);

      return NextResponse.json({
        success: true,
        message: "Products are on the way!",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to create an order! Please try again.",
      });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}
