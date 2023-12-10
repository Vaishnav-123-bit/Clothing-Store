// Import statements
import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";
import Joi from "joi";
import { NextResponse } from "next/server";

// Validation schema
const AddNewAddressSchema = Joi.object({
  fullName: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  postalCode: Joi.string().required(),
  userID: Joi.string().required(),
});

export const dynamic = "force-dynamic";

// POST handler
export async function POST(req) {
  try {
    // Connect to the database
    await connectToDb();

    // Authenticate user
    const authUser = await AuthUser(req);

    // Check if the user is authenticated
    if (!authUser) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // Parse request body
    const data = await req.json();
    const userID = authUser.id;

    // Validate request data
    const { error } = AddNewAddressSchema.validate({
      fullName: data.fullName,
      address: data.address,
      city: data.city,
      country: data.country,
      postalCode: data.postalCode,
      userID,
    });

    // If validation fails, return an error response
    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Create a new address
    const newlyAddedAddress = await Address.create({ ...data, userID });

    // Check if the address was added successfully
    if (newlyAddedAddress) {
      return NextResponse.json({
        success: true,
        message: "Address added successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to add address",
      });
    }
  } catch (e) {
    // Log the error for debugging
    console.error("Error in POST request:", e);

    // Return an error response
    return NextResponse.json({
      success: false,
      message: "Something went wrong!",
    });
  }
}
