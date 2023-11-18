import CommonListing from "@/components/CommonListing";
import { productByCategory } from "@/servies/product";

export default async function MenAllProducts(){
    const getAllProducts=await productByCategory('men')
    return <CommonListing data={getAllProducts && getAllProducts.data}/>
}