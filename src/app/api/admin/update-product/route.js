import connectToDb from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    await connectToDb();
    const extarctData = await req.json();
    const {
      _id,
      name,
      price,
      description,
      sizes,
      deliveryInfo,
      priceDrop,
      onSale,
      imageUrl,
      category,
    } = extarctData;

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
            message:"Product updated successfully !! "
        })
    }else{
        return NextResponse.json({
            success:false,
            message:"Failed to update | Try again "
        })
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong | Try again",
    });
  }
}
