import connectToDb from "@/database"
import AuthUser from "@/middleware/AuthUser";
import Order from "@/models/order";
import { NextResponse } from "next/server"



export const dynamic ="force-dynamic"

export async function GET(req){
    try{
        await connectToDb();
        
        const isAuthUser=await AuthUser(req);

        if(isAuthUser){
            const {searchParams}=new URL(req.url);
            const id=searchParams.get('id')

            const extarctAllData=await Order.find({user:id}).populate('orderItems.product')
            if(extarctAllData){
                return NextResponse.json({
                    success:true,
                    data:extarctAllData
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message:"failed to get all orders ..."
                })
            }
        }else{
            return NextResponse.json({
                success:false,
                message:"Yu are unauthorixed "
            })
        }

    }catch(e){
        console.log(e)
        return NextResponse.json({
            success:false,
            message:"Something went wrong"
        })
    }
}