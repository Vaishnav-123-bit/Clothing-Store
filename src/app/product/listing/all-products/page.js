import CommonListing from "@/components/CommonListing";
import { getAllAdminProducts } from "@/servies/product";

export default async function AllProduct() {
  const getAllProducts = await getAllAdminProducts();
  return <CommonListing data={getAllProducts && getAllProducts.data} />;
}
