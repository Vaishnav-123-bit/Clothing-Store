import Cookies from "js-cookie";

export const addToCart = async (formData) => {
  try {
    const res = await fetch("/api/cart/add-to-cart", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data)
    return data;
  } catch (e) {
    console.log(e);
  }
};