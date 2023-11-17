
import { productById } from "@/servies/product";


export default async function ProductDetails({ params }) {
  const productDetailsData = await productById(params.details);

  console.log(productDetailsData);

  return <div>details</div>;
}