// CartModal.js
import { Fragment, useContext, useEffect } from "react";
import CommonModal from "../CommonModal";
import { GlobalContext } from "@/context";
import { getAllCartItems } from "@/servies/cart";


export default function CartModal() {
  const { showCartModal, setShowCartModal, user } = useContext(GlobalContext);

  async function extractAllCartItems() {
    try {
      // Additional debugging logs
      console.log("User:", user);

      // Additional validation to check if user object is defined and has a valid _id
      if (!user || !user._id) {
        console.error("Invalid user object:", user);
        return;
      }

      const res = await getAllCartItems(user._id);
      console.log("API Response:", res);
    } catch (error) {
      console.error("Error extracting cart items:", error.message);
    }
  }

  useEffect(() => {
    if (user !== null) {
      extractAllCartItems();
    }
  }, [user]);

  return (
    <CommonModal
      showButtons={true}
      show={showCartModal}
      setShow={setShowCartModal}
      buttonComponent={
        <Fragment>
          <button>Go To Cart</button>
          <button>CheckOut</button>
        </Fragment>
      }
    />
  );
}
