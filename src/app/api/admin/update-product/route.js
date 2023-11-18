import connectToDb from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function PUT(req) {
  try {
    await connectToDb()
    const extractData=await req.json();
    const {
      _id,
      name,
      price,
      description,
      category,
      sizes,
      deliveryInfo,
      onSale,
      priceDrop,
      imageUrl,
    } = extractData;

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        name,
        price,
        description,
        category,
        sizes,
        deliveryInfo,
        onSale,
        priceDrop,
        imageUrl,
      },
      { new: true }
    );
    if(updatedProduct){
      return NextResponse.json({
        success:true,
        message:"Product updated successfully "
      })
    }else{
      return NextResponse.json({
        success:false,
        message:"Error Failed to update"
      })
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Try again",
    });
  }
}
