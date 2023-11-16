"use client"

import ProductTile from "./ProductTile";
import ProductButton from "./ProductButtons";

const dummyData = [
  {
    _id: "65560eea26ba9422eb65aae3 ",

    name: "kids T",
    description: "reee",
    price: 400,
    category: "kids",

    sizes: [{}],

    deliveryInfo: "free",
    onSale: "no",
    priceDrop: 0,
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ecom-937f2.appspot.com/o/ecom%2Frbl7.JPG-1700138706998-t7suv4pbfs?alt=media&token=e4f9b3f7-27ca-408d-87fe-c388e4031648",
  },
];

export default function CommonListing() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-16">
        <div className="mt-10 grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
          {
            dummyData && dummyData.length ? 
            dummyData.map((item)=>(
                <article key={item._id}>
                    <ProductTile item={item}/>
                    <ProductButton item={item}/>
                </article>
            ))
            :null
          }
        </div>
      </div>
    </section>
  );
}
