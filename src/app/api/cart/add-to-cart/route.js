import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import Joi from "joi";
import { NextResponse } from "next/server";

const AddToCart=Joi.object({
    userID:Joi.string().required(),
    productID:Joi.string().required()
})

export const dynamic = "force-dynamic";
export async function POST(req){
    try{
        await connectToDb();
        const isAuthUser=await AuthUser(req)

        if(isAuthUser){
            const data=await req.json();
            const {productID,userID}=data;
            console.log(data)

            const {error}=AddToCart.validate({userID,productID});
            if(error){
                return NextResponse.json({
                    success:false,
                    message:error.details[0].message
                })
            }
            const isCurrentcartItemAlreadyExists=await Cart.find({
                productID:productID,
                userID:userID
            })
            if(isCurrentcartItemAlreadyExists){
                return NextResponse.json({
                    success:false,
                    message:"Product already in cart"
                })
            }

            const saveProductToCart=await Cart.create(data);
            if(saveProductToCart){
                return NextResponse.json({
                    success:true,
                    message:"product added to cart"
                })

            }else{
                return NextResponse.json({
                    success:false,
                    message:"Faile to add"
                })
            }


        }else{
            return NextResponse.json({
                success:false,
                message:"Not authorized "
            })
        }
    }catch(e){
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later.",
          });
    }
}