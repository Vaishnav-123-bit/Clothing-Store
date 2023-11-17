import CommonListing from "@/components/CommonListing";
import { productByCategory } from "@/servies/product";

export default async function KidsAllProducts(){
    const getAllProducts=await productByCategory("kids")
    return <CommonListing data={getAllProducts && getAllProducts.data}/>
}