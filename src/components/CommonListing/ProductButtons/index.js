"use client";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import { GlobalContext } from "@/context";
import { addToCart } from "@/servies/cart";
import { deleteAProduct } from "@/servies/product";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "react-toastify";

export default function ProductButton({item}) {
  const pathName = usePathname();
  const isAdminView = pathName.includes("admin-view");
  const{componentLevelLoader,setCurrentUpdatedProduct,setComponentLevelLoader,user}=useContext(GlobalContext);
  const router=useRouter();



  async function handleDeleteProduct(item) {
    setComponentLevelLoader({ loading: true, id: item._id })
    const res = await deleteAProduct(item._id);
    
    if (res.success){
      setComponentLevelLoader({ loading: false, id: '' });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      router.refresh();
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
    }
  }

  async function handleAddToCart(getItem){
    const res = await addToCart({ productID: getItem._id, userID: user._id });

    console.log(res)
  }
  return isAdminView ? (
    <>
      <button
        onClick={() => {
          setCurrentUpdatedProduct(item);
          router.push("/admin-view/add-product")
        }}
        className=" px-5 py-3 mt-1.5 flex w-full justify-center bg-black text-xs tracking-wide text-white uppercase font-medium"
      >
        Update
      </button>
      <button
        onClick={() => handleDeleteProduct(item)}
        className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
      >
        {componentLevelLoader &&
        componentLevelLoader.loading &&
        item._id === componentLevelLoader.id ? (
          <ComponentLevelLoader
            text={"Deleting Product"}
            color={"#ffffff"}
            loading={componentLevelLoader && componentLevelLoader.loading}
          />
        ) : (
          "DELETE"
        )}
      </button>
    </>
  ) : (
    <>
      <button onClick={()=>handleAddToCart(item)} className="px-5 py-3 mt-1.5 flex w-full justify-center bg-black text-xs tracking-wide text-white uppercase font-medium">Add to Cart</button>
    </>
  );
}
