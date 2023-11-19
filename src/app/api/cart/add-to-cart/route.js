// Import necessary modules and functions
import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import Joi from "joi";
import { NextResponse } from "next/server";

// Define Joi schema for request validation
const AddToCartSchema = Joi.object({
    userID: Joi.string().required(),
    productID: Joi.string().required()
});

// Define the endpoint function
export async function POST(req) {
    try {
        // Connect to the database
        await connectToDb();

        // Check if the user is authenticated
        const user = await AuthUser(req);
        

        if (user) {
            // Access the user ID from the resolved Promise
            const userID = user.id;

            // Parse the request JSON
            const data = await req.json();
            // console.log("Request data:", data);

            // Validate the request data
            const { error } = AddToCartSchema.validate({ ...data, userID });
            if (error) {
                return NextResponse.json({
                    success: false,
                    message: error.details[0].message
                });
            }

            // Check if the current cart item already exists
            const isCurrentCartItemAlreadyExists = await Cart.findOne({
                productID: data.productID,
                userID: userID
            });

            if (isCurrentCartItemAlreadyExists) {
                return NextResponse.json({
                    success: false,
                    message: "Product already in the cart"
                });
            }

            // Save the product to the cart
            const saveProductToCart = await Cart.create({ ...data, userID });
            if (saveProductToCart) {
                return NextResponse.json({
                    success: true,
                    message: "Product added to the cart"
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to add product to the cart"
                });
            }
        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authorized"
            });
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        });
    }
}
