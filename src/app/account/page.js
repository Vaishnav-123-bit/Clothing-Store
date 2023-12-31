"use client";
import InputComponent from "@/components/FormElements/IputComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import {
  addNewAddress,
  deleteAddress,
  fetchAllAddresses,
  updateAddress,
} from "@/servies/address";
import { addNewAddressFormControls } from "@/utils";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Account() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const {
    componentLevelLoader,
    setComponentLevelLoader,
    addresses,
    setAddresses,
    addressFormData,
    setAddressFormData,
    user,pageLevelLoader, setPageLevelLoader
  } = useContext(GlobalContext);
  const [currentEditedAddressid, setCurrentEditedAddressid] = useState(null);

  async function handleUpdateAddress(getCurrentAddress) {
    setShowAddressForm(true);
    setAddressFormData({
      fullName: getCurrentAddress.fullName,
      city: getCurrentAddress.city,
      country: getCurrentAddress.country,
      postalCode: getCurrentAddress.postalCode,
      address: getCurrentAddress.address,
    });
    setCurrentEditedAddressid(getCurrentAddress._id);
  }

  async function extractAllAddresses() {
    setPageLevelLoader(true)
    const res = await fetchAllAddresses(user._id);
    if (res.success) {
      setPageLevelLoader(false)
      setAddresses(res.data);
    }
  }

  async function handleAddOrUpdateAddress() {
    setComponentLevelLoader({ loading: true, id: "" });

    const res =
      currentEditedAddressid !== null
        ? await updateAddress({
            ...addressFormData,
            _id: currentEditedAddressid,
          })
        : await addNewAddress({ ...addressFormData, userID: user?._id });
    console.log(res);
    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setAddressFormData({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
      });
      extractAllAddresses();
      setCurrentEditedAddressid(null);
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setAddressFormData({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
      });
    }
  }

  async function handleDelete(getCurrentAddressID) {
    setComponentLevelLoader({ loading: true, id: getCurrentAddressID });
    const res = await deleteAddress(getCurrentAddressID);
    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      extractAllAddresses();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
        toast.error(res.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  

  useEffect(() => {
    if (user !== null) extractAllAddresses();
  }, [user]);
  return (
    <section>
      <div className="mx-auto bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow">
          <div className="p-6 sm:p-12">
            <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
              {/**render user img */}
            </div>
            <div className="flex flex-col flex-1">
              <h4 className="text-lg font-semibold text-center md:text-left">
                {user?.name}
              </h4>
              <p>{user?.email}</p>
              <p>{user?.role}</p>
              <button className="w-1/6 mt-5 tracking-wide inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase">
                View Your Orders
              </button>

              <div className="mt-6">
                <h1 className="font-bold text-lg">Your addresses</h1>
                {pageLevelLoader ?
                <PulseLoader 
                color={"#000000"}
                size={"15px"}
                loading={pageLevelLoader}
                data-testid="loader"
                /> :
                <div className="mt-4  flex flex-col gap-4">
                {addresses && addresses.length ? (
                  addresses.map((item) => (
                    <div className="border p-6 " key={item._id}>
                      <p>Name : {item.fullName}</p>
                      <p>Address : {item.address}</p>
                      <p>City : {item.city}</p>
                      <p>Country : {item.country}</p>
                      <p>PostalCode : {item.postalCode}</p>
                      <button
                        onClick={() => handleUpdateAddress(item)}
                        className="mr-5 w-1/7 mt-5 tracking-wide inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="w-1/7 mt-5 tracking-wide inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase"
                      >
                        {componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id===item._id? (
                    <ComponentLevelLoader
                      text={"Deleting Address"}
                      color={"#ffffff"}
                      loading={
                        componentLevelLoader && componentLevelLoader.loading
                      }
                    />
                  ) : (
                    "Delete"
                  )}
                      
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No address found | Please add a new address</p>
                )}
              </div>}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="w-1/6 mt-5 tracking-wide inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase"
                >
                  {showAddressForm ? "Hide Address Form" : "Add New Address"}
                </button>
              </div>
              {showAddressForm ? (
                <div className="flex flex-col mt-5 justify-center pt-4 items-center">
                  <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
                    {addNewAddressFormControls.map((controlItem) => (
                      <InputComponent
                        type={controlItem.type}
                        placeholder={controlItem.placeholder}
                        label={controlItem.label}
                        value={addressFormData[controlItem.id]}
                        onChange={(event) =>
                          setAddressFormData({
                            ...addressFormData,
                            [controlItem.id]: event.target.value,
                          })
                        }
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleAddOrUpdateAddress}
                    className="justify-center items-center mt-5 tracking-wide inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase"
                  >
                    {componentLevelLoader && componentLevelLoader.loading ? (
                      <ComponentLevelLoader
                        text={"Saving Address"}
                        color={"#ffffff"}
                        loading={
                          componentLevelLoader && componentLevelLoader.loading
                        }
                      />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </section>
  );
}
