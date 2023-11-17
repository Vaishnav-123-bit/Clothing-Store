"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import TileComponent from "@/components/FormElements/TileComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { addNewProduct, updateProduct } from "@/servies/product";



import {
  AvailableSizes,
  adminAddProductformControls,
  firebaseConfig,
  firebaseStorageURL,
} from "@/utils";

import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { resolve ,reject} from "styled-jsx/css";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStorageURL);

const createUniqueFileName = (getFile) => {
  const timestamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);

  return `${getFile.name}-${timestamp}-${randomStringValue}`;
};

async function helperForUploadingImageTofirebase(file) {
  const getFileName = createUniqueFileName(file);
  const storageReference = ref(storage, `ecom/${getFileName}`);
  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      "status-changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadUrl) => resolve(downloadUrl))
          .catch((error) => reject(error));
      }
    );
  });
}

const initialFormData = {
  name: "",
  price: 0,
  description: "",
  category: "men",
  sizes: [],
  deliveryInfo: "",
  onSale: "no",
  imageUrl: "",
  priceDrop: 0,
};

export default function AdminAddNewProduct() {
  const [formData, setFormData] = useState(initialFormData);
  const {componentLevelLoader,
    setComponentLevelLoader,currentUpdatedProduct,setCurrentUpdatedProduct}=useContext(GlobalContext)
  

    console.log(currentUpdatedProduct)
  const router=useRouter();

  useEffect(()=>{
    if(currentUpdatedProduct !==null)setFormData(currentUpdatedProduct)
  },[currentUpdatedProduct])

  async function handleImage(event) {
    console.log(event.target.files);
    const extractImageUrl = await helperForUploadingImageTofirebase(
      event.target.files[0]
    );
    console.log(extractImageUrl);
    if (extractImageUrl !== "") {
      setFormData({
        ...formData,
        imageUrl: extractImageUrl,
      });
    }
  }
  console.log(formData)

  function handleTileClick(getCurrentItem) {
    let cpySizes = [...formData.sizes];
    const index = cpySizes.findIndex((item) => item.id === getCurrentItem.id);

    if (index === -1) {
      cpySizes.push(getCurrentItem);
    } else {
      cpySizes = cpySizes.filter((item) => item.id !== getCurrentItem.id);
    }

    setFormData({
      ...formData,
      sizes: cpySizes,
    });
  }
  async function handleAddProduct() {
    setComponentLevelLoader({loading:true,id:''})
    const res =currentUpdatedProduct!==null ? await updateProduct(formData): await addNewProduct(formData)
    console.log(res)
    if(res.success){
      setComponentLevelLoader({loading:false,id:''})
      toast.success(res.message,{
        position:toast.POSITION.TOP_RIGHT
      })

      setFormData(initialFormData)
      setCurrentUpdatedProduct(null)
      setTimeout(()=>{
        router.push('/admin-view/all-products')
      },1000)
    }else{
      toast.error(res.message,{
      position:toast.POSITION.TOP_RIGHT

    })
    setComponentLevelLoader({loading:false,id:''})
    setFormData(initialFormData)
    }}
 
  

  

 
  console.log(formData);
  return (
    <div className="w-full mt-0 mr-0 mb-0 ml-0 relative">
      <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
        <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
          <input
            type="file"
            accept="image/*"
            max="1000000"
            onChange={handleImage}
          />

          <div className="flex gap-2 flex-col ">
            <label>Available sizes</label>
            <TileComponent
              selected={formData.sizes}
              onClick={handleTileClick}
              data={AvailableSizes}
            />
          </div>
          {adminAddProductformControls.map((controlItem, id) =>
            controlItem.componentType === "input" ? (
              <InputComponent
                key={id}
                type={controlItem.type}
                label={controlItem.label}
                placeholder={controlItem.placeholder}
                value={formData[controlItem.id]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [controlItem.id]: event.target.value,
                  });
                }}
              />
            ) : controlItem.componentType === "select" ? (
              <SelectComponent
                label={controlItem.label}
                options={controlItem.options}
                key={id}
                value={formData[controlItem.id]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [controlItem.id]: event.target.value,
                  });
                }}
              />
            ) : null
          )}
          <button
            onClick={handleAddProduct}
            className="uppercase inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium tracking-wide "
          >
            {componentLevelLoader && componentLevelLoader.loading ? (
              <ComponentLevelLoader
                text={currentUpdatedProduct!==null ?"Updating Product ":"Adding Product"}
                color={"#ffffff"}
                loading={componentLevelLoader && componentLevelLoader.loading}
              />
            ) : currentUpdatedProduct !== null ? (
              "Update product"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
      <Notification />
    </div>
  );
}

