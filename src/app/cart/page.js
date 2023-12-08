"use client";

import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItems } from "@/servies/cart";
import { useContext, useEffect } from "react";
import CommmonCart from "../../components/CommonCart";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Cart() {
  const {componentLevelLoader,setComponentLevelLoader, user, setCartItems, cartItems, pageLevelLoader, setPageLevelLoader } =
    useContext(GlobalContext);
  async function extractAllCartItems() {
    setPageLevelLoader(true);
    const res = await getAllCartItems(user?._id);

    if (res.success) {
      setCartItems(res.data);
      setPageLevelLoader(false);
      localStorage.setItem("cartItems", JSON.stringify(res.data));
    }
    console.log(res);
  }

  useEffect(() => {
    if (user !== null) extractAllCartItems();
  }, [user]);

  async function handleDeleteCartItem(getCartItemID){
    setComponentLevelLoader({loading:true,id:getCartItemID})
    const res =await deleteFromCart(getCartItemID)
    if(res.success){
      setComponentLevelLoader({loading:false,id:''})
      toast.success(res.message,{
        position:toast.POSITION.TOP_RIGHT
      })
      extractAllCartItems()
    }else{
      setComponentLevelLoader({loading:false,id:getCartItemID})
      toast.error(res.message,{
        position:toast.POSITION.TOP_RIGHT
      })
    }
  }

  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center ">
        <PulseLoader
          color={"#000000"}
          loading={pageLevelLoader}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }
  return <CommmonCart componentLevelLoader={componentLevelLoader} handleDeleteCartItem={handleDeleteCartItem} cartItems={cartItems} />;
}
