import mongoose from "mongoose";

const ProductSchema=new mongoose.Schema({
    name:String,
    description:String,
    price:Number,
    category:String,
    size:Array,
    deliveryInfo:String,
    onSale:String,
    prceDrop:Number,
    imageUrl:String
},{ timestamps: true });

const Product=mongoose.models.Products || mongoose.model("Prdoucts",ProductSchema)

export default Product;