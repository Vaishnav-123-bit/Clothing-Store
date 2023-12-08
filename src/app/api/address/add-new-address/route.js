import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";
import { NextResponse } from "next/server";

const AddNewAddress = Joi.object({
  fullName: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  postalCode: Joi.string().required(),
  userID: Joi.string().required(),
});

export const dynamic = "force-dynamic";
export async function POST(req) {
  try {
    await connectToDb();
    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const data = await req.json();
      const { fullName, address, city, country, userID, postalCode } = data;
      const { error } = AddNewAddress.validate({
        fullName,
        address,
        city,
        country,
        userID,
        postalCode,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      const newlyAddedAddress = await Address.create(data);
      if (newlyAddedAddress) {
        return NextResponse.json({
          success: true,
          message: "Address Added successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to add Address ",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "Unauthorized user",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong !",
    });
  }
}
