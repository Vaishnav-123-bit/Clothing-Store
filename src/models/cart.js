import mongoose from "mongoose";

const CartItems=new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
    productID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Products'
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    }
},{timeseries:true})

const Cart=mongoose.models.Cart || mongoose.model("Cart",CartItems);

export default Cart