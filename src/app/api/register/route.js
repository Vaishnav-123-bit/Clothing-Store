import connectToDb from "@/database";
import User from "@/models/user";
import { hash } from "bcryptjs";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

export const dynamic = "force-dynamic";



export async function POST(req) {
  
    await connectToDb();

    const { name, email, password, role } = await req.json();
    console.log(name,email,password);

    // Validate the schema
    const { error } = schema.validate({ name, email, password, role });

    if (error) {
      console.error(error);
      return NextResponse.json({
        success: false,
        message: `Validation error: ${error.details[0].message}`,
        
      }); // Bad Request
    }
    try {
      const isUserAlreadyExists = await User.findOne({ email });

      if (isUserAlreadyExists) {
        return NextResponse.json({
          success: false,
          message: "User already exists. Please try with a different email.",
        }); // Conflict
      } else {
        const hashPassword = await hash(password, 12);
        const newlyCreatedUser = await User.create({
          name,
          email,
          password: hashPassword,
          role,
        });
        if (newlyCreatedUser) {
          return NextResponse.json({
            success: true,
            message: "Account created successfully.",
            newlyCreatedUser,
          });
        }
      }

      // Check if the user already exists

      // Hash the password and create a new user

      // Created
    } catch (error) {
      console.error("Error while new user registration:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong! Please try again later.",
        }
        
      );
    }
}
