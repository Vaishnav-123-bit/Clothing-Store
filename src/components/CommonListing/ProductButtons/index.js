"use client";

import { GlobalContext } from "@/context";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";

export default function ProductButton({item}) {
  const pathName = usePathname();
  const isAdminView = pathName.includes("admin-view");
  const{setCurrentUpdatedProduct}=useContext(GlobalContext);
  const router=useRouter();
  return isAdminView ? (
    <>
      <button onClick={()=>{
        setCurrentUpdatedProduct(item);
        router.push("/admin-view/add-product")
      }} className=" px-5 py-3 mt-1.5 flex w-full justify-center bg-black text-xs tracking-wide text-white uppercase font-medium">
        Update
      </button>
      <button className="px-5 py-3 mt-1.5 flex w-full justify-center bg-black text-xs tracking-wide text-white uppercase font-medium">
        Delete
      </button>
    </>
  ) : (
    <>
      <button className="px-5 py-3 mt-1.5 flex w-full justify-center bg-black text-xs tracking-wide text-white uppercase font-medium"></button>
    </>
  );
}
