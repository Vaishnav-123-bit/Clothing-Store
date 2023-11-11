import connectToDb from "@/database";
import User from "@/models/user";
import { compare } from "bcryptjs";
import Joi from "joi";
import { NextResponse } from "next/server";
import jwt  from "jsonwebtoken";

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const dynamic = "force-dynamic";
export async function POST(req) {
  await connectToDb();
  const { email, password } = await req.json();

  const { error } = schema.validate({ email, password });

  if (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: `Validation error: ${error.details[0].message}`,
    });
  }

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return NextResponse.json({
        success: false,
        message: "User does not exist with this email id",
      });
    }
    const checkPassword = await compare(password, checkUser.password);
    if (!checkPassword) {
      return NextResponse.json({
        success: false,
        message: "Incorrect Password ! Please try again ",
      });
    }
    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser?.email,
        role: checkUser?.role,
      },
      "default_secret_key",
      { expiresIn: "1d" }
    );

    const finalData = {
      token,
      user: {
        email: checkUser.email,
        name: checkUser.name,
        id: checkUser._id,
        role: checkUser.role,
      },
    };
    return NextResponse.json({
      sucess: true,
      message: "Login sucessfull !!",
      finalData,
    });
  } catch (error) {
    console.error("Error while logging in :", error);

    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}
