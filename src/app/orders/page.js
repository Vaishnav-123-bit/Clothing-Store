'use client' 
import { GlobalContext } from "@/context";
import { getAllOrdersForAllUsers } from "@/servies/order";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

export default function Orders() {
  const {
    allOrdersForUser,
    setAllOrdersForUser,
    user,
    pageLevelLoader,
    setPageLevelLoader,
  } = useContext(GlobalContext);

  async function extractAllOrders() {
    setPageLevelLoader(true);

    const res = await getAllOrdersForAllUsers(user?._id);
    console.log("----------",res)
    if (res.success){
      setPageLevelLoader(false);
      setAllOrdersForUser(res.data);
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      setPageLevelLoader(false);
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  useEffect(() => {
    if (user !== null) extractAllOrders();
  }, [user]);

  console.log(allOrdersForUser);

  return <section>Your orders</section>;
}
