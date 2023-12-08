import connectToDb from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    await connectToDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
if(!id){
    return NextResponse.json({
        success:false,message:"Address ID required"
    })
}

const isAuthUser=await AuthUser(req);
if(isAuthUser){
    const deleteAddress=await Address.findByIdAndDelete(id);
    if(deleteAddress){
        return NextResponse.json({
            success:true,message:"Address deleted"
        })
    }else{
        return NextResponse.json({
            success:false,message:"Failed to delete address "
        })
    }
}

  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong !",
    });
  }
}
