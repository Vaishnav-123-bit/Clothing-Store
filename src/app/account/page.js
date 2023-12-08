"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import { GlobalContext } from "@/context";
import { addNewAddressFormControls } from "@/utils";
import { useContext, useState } from "react";

export default function Account() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { addresses, setAddresses, addressFormData, setAddressFormData, user } =
    useContext(GlobalContext);
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
                <div className="mt-4">
                  {addresses && addresses.length ? (
                    addresses.map((item) => (
                      <div className="border p-6 " key={item._id}>
                        <p>Name : {item.fullName}</p>
                        <p>Address : {item.address}</p>
                        <p>City : {item.city}</p>
                        <p>Country : {item.country}</p>
                        <p>PostalCode : {item.postalCode}</p>
                      </div>
                    ))
                  ) : (
                    <p>No address found | Please add a new address</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <button onClick={()=>setShowAddressForm(!showAddressForm)} className="w-1/6 mt-5 tracking-wide inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase">
                  {showAddressForm ?'Hide Address Form':"Add New Address"}
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
                  <button className="justify-center items-center mt-5 tracking-wide inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase">
                    Save
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
