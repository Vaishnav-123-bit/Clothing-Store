// Import necessary modules and dependencies
import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import Joi from "joi";
import { NextResponse } from "next/server";

// Define Joi schema for input validation
const AddToCart = Joi.object({
  userID: Joi.string().required(),
  productID: Joi.string().required(),
});

// Define the API route handler
export const dynamic = "force-dynamic";
export async function POST(req) {
  try {
    // Connect to the MongoDB database
    await connectToDb();

    // Authenticate the user
    const isAuthUser = await AuthUser(req);

    // Check if the user is authenticated
    if (isAuthUser) {
      const userID = isAuthUser.id;
      const data = await req.json();
      const { productID } = data;

      // Validate input using Joi schema
      const { error } = AddToCart.validate({ userID, productID });
      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      // Check if the product is already in the cart
      const isCurrentCartItemAlreadyExists = await Cart.find({
        productID: productID,
        userID: userID,
      });

      if (isCurrentCartItemAlreadyExists.length > 0) {
        return NextResponse.json({
          success: false,
          message: "Product already in cart",
        });
      }

      // Add the user ID to the data object and save the product to the cart
      const saveProductToCart = await Cart.create({
        ...data,
        userID: userID,
      });

      if (saveProductToCart) {
        return NextResponse.json({
          success: true,
          message: "Product added to cart",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to add product to cart",
        });
      }
    } else {
      // Return error if the user is not authenticated
      return NextResponse.json({
        success: false,
        message: "Not authorized",
      });
    }
  } catch (e) {
    // Handle any unexpected errors
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}
