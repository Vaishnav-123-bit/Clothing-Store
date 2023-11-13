"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import TileComponent from "@/components/FormElements/TileComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { addNewProduct } from "@/servies/product";

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
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
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
    setComponentLevelLoader}=useContext(GlobalContext)

  const router=useRouter();

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
    const res=await addNewProduct(formData);
    console.log(res)
    
    
  }

 
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
            <TileComponent selected={formData.sizes}  onClick={handleTileClick} data={AvailableSizes} />
          </div>
          {adminAddProductformControls.map((controlItem, index) =>
            controlItem.componentType === "input" ? (
              <InputComponent
                key={index}
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
                key={index}
                label={controlItem.label}
                options={controlItem.options}
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
          <button onClick={handleAddProduct} className="uppercase inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium tracking-wide ">
            
            {
                componentLevelLoader && componentLevelLoader.loading?
                <ComponentLevelLoader
                text={"Adding Product"}
                color={'#ffffff'}
                loading={componentLevelLoader && componentLevelLoader.loading}/>:'Add Product'
            }
          </button>
        </div>
      </div>
      <Notification/>
    </div>
  );
}
