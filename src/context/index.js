"use client";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

export const initialCheckoutFormData={
  shippingAddress:{},
  payementMethod:'',
  totalPrice:0,
  isPaid:false,
  paidAt:new Date(),
  isProcessing:true

}

export default function GlobalState({ children }) {
  const [showNavModal, setShowNavModal] = useState(false);
  const[allOrdersForUser,setAllOrdersForUser]=useState([])
  const [pageLevelLoader, setPageLevelLoader] = useState(true);
  const[componentLevelLoader,setComponentLevelLoader]=useState({loading:false,id:''})
  const [isAuthUser, setIsAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const[currentUpdatedProduct,setCurrentUpdatedProduct]=useState(null)
  const[showCartModal,setShowCartModal]=useState(false)
  const[cartItems,setCartItems]=useState([])
  
const[addresses,setAddresses]=useState([]);
const[addressFormData,setAddressFormData]=useState({
  fullName:'',city:'',country:'',postalCode:'',address:''
})

const[checkoutFormData,setCheckoutFormData]=useState(initialCheckoutFormData)
const router=useRouter()
const pathName=usePathname()
const protectedRoutes=[
  '/cart',
  '/checkout',
  '/account',
  '/orders',
  '/admin-view',
  '/admin-view/add-product',
  '/admin-view/all-products'
]

const protectedAdminRoutes=[
  
  '/admin-view',
  '/admin-view/add-product',
  '/admin-view/all-products'
]


  useEffect(()=>{
    console.log(Cookies.get('token'));

    if(Cookies.get('token')!==undefined){
        setIsAuthUser(true);
        const userData=JSON.parse(localStorage.getItem('user'))||{};
        const getCartItems=JSON.parse(localStorage.getItem("cartItems")) || [];
        setUser(userData);
        setCartItems(getCartItems)
    }else{
        setIsAuthUser(false);
        setUser({})
    }

  },[Cookies])


  useEffect(()=>{
    if(user && Object.keys(user).length===0 && protectedRoutes.indexOf(pathName) > -1) router.push('/login')
  },[user,pathName])

  useEffect(() => {
    if (
      user !== null &&
      user &&
      Object.keys(user).length > 0 &&
      user?.role !== "admin" &&
      protectedAdminRoutes.indexOf(pathName) > -1
    )
      router.push("/unauthorized-page");
  }, [user, pathName]);

  return (
    <GlobalContext.Provider value={{checkoutFormData,setCheckoutFormData,addresses,setAddresses,addressFormData,setAddressFormData,cartItems,setCartItems,currentUpdatedProduct,setCurrentUpdatedProduct, showNavModal, setShowNavModal,user,setUser,isAuthUser,setIsAuthUser ,pageLevelLoader,setPageLevelLoader,componentLevelLoader,setComponentLevelLoader,showCartModal,setShowCartModal}}>
      {children}
    </GlobalContext.Provider>
  );
}
