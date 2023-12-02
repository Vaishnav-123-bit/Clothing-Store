import connectToDb from "@/database";
import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";

import Product from "@/models/product";
import Joi from "joi";
import { NextResponse } from "next/server";

const AddNewProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  sizes: Joi.array().required(),
  deliveryInfo: Joi.string().required(),
  onSale: Joi.string().required(),
  priceDrop: Joi.number().required(),
  imageUrl: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req){
  try{
    await connectToDb();
    
    const isAuthUser=await AuthUser(req)
    console.log(isAuthUser)
    if(isAuthUser?.role==='admin'){
      const extractData=await req.json()
      const{
        name,description,price,category,imageUrl,sizes,deliveryInfo,onSale,priceDrop

      }=extractData;

      const{error}=AddNewProductSchema.validate({
        name,description,price,category,imageUrl,sizes,deliveryInfo,onSale,priceDrop
      });

      if(error){
        return NextResponse.json({
          success:false,
          message:error.details[0].message
        })
      }

      const newlyCreatedProduct=await Product.create(extractData);
      if(newlyCreatedProduct){
        return NextResponse.json({
          success:true,
          message:"product added sucessfully"
        })
      }else{
        return NextResponse.json({
          success:false,
          message:"failed to add product "
        })
      }

    }else{
      return NextResponse.json({
        success:false,
        message:"you are not authoriized !!"
      })
    }

  }catch(error){
    console.log(error)
    return NextResponse.json({
      success:false,
      message:"Error try again"
    })

  }
}