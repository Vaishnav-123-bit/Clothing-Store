import CommonListing from "@/components/CommonListing";
import { productByCategory } from "@/servies/product";

export default async function WomenAllProducts(){
    const getAllProducts=await productByCategory('women')
    return <CommonListing data={getAllProducts && getAllProducts.data}/>
}