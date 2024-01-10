import CommonListing from "@/components/CommonListing";
import { getAllAdminProducts } from "@/servies/product";




export default async function AdminAllProducts(){
    const allAdminProducts=await getAllAdminProducts()
    console.log(allAdminProducts)
    
    return(
        <CommonListing data={allAdminProducts && allAdminProducts.data}/>
    )
}
