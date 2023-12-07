"use client";

import { Fragment, useContext, useEffect } from "react";
import CommonModal from "../CommonModal";
import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItems } from "@/servies/cart";
import { toast } from "react-toastify";
import ComponentLevelLoader from "../Loader/componentlevel";

export default function CartModal() {
  const { componentLevelLoader,setComponentLevelLoader,cartItems, setCartItems, showCartModal, setShowCartModal, user } =
    useContext(GlobalContext);

  async function extractAllCartItems() {
    const res = await getAllCartItems(user?._id);

    if (res.success) {
      setCartItems(res.data);
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
  return (
    <CommonModal
      showButtons={true}
      show={showCartModal}
      setShow={setShowCartModal}
      mainContent={
        cartItems && cartItems.length ? (
          <ul role="list " className="my-6 divide-y divide-gray-300">
            {cartItems.map((cartItem) => (
              <li key={cartItem.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={
                      cartItem &&
                      cartItem.productID &&
                      cartItem.productID.imageUrl
                    }
                    alt="Cart Item"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-col flex-1">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <a>
                          {cartItem &&
                            cartItem.productID &&
                            cartItem.productID.name}
                        </a>
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      $
                      {cartItem &&
                        cartItem.productID &&
                        cartItem.productID.price}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <button
                      type="button"
                      onClick={()=>handleDeleteCartItem(cartItem._id)}
                      className="font-medium text-yellow-600 sm:order-2"
                    >
                     {
                      componentLevelLoader && componentLevelLoader.loading 
                      && componentLevelLoader.id ===cartItem._id ?
                      <ComponentLevelLoader
                      text={"Removing from Cart"}
                      color={"#000000"}
                      loading={componentLevelLoader && componentLevelLoader.loading}

                      />:'Remove'
                     }
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null
      }
      buttonComponent={
        <Fragment>
          <button className="w-full mt-1.5 trackiing-wide inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase">Go To Cart</button>
          <button disabled={cartItems && cartItems.length ===0 } type="button" className="w-full disabled:opacity-50 mt-1.5 trackiing-wide inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase">Checkout</button>
          <div className="mt-6 flex text-sm text-center text-gray-600 justify-center">
            <button type="button" className="font-medium text-gray">
                Continue Shopping
            </button>
            <span aria-hidden="true">&rarr;</span>
          </div>
        </Fragment>
      }
    />
  );
}
