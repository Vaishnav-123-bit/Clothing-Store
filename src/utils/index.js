export const navOptions = [
    {
      id: "home",
      label: "Home",
      path: "/",
    },
    {
      id: "listing",
      label: "All Products",
      path: "/product/listing/all-products",
    },
    {
      id: "listingMen",
      label: "Men",
      path: "/product/listing/men",
    },
    {
      id: "listingWomen",
      label: "Women",
      path: "/product/listing/women",
    },
    {
      id: "listingKids",
      label: "kids",
      path: "/product/listing/kids",
    },
  ];

  export const adminNavOptions = [
    {
      id: "adminListing",
      label: "Manage All Products",
      path: "/admin-view/all-products",
    },
    {
      id: "adminNewProduct",
      label: "Add New Product",
      path: "/admin-view/add-product",
    },
  ];

export const styles = {
  button:
    "mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white",
};

export const registrationFormControls = [
  {
    id: "name",
    type: "text",
    placeholder: "Enter your name",
    label: "Name",
    componentType: "input",
  },

  {
    id: "email",
    type: "email",
    placeholder: "Enter your email",
    label: "Email",
    componentType: "input",
  },

  {
    id: "password",
    type: "password",
    placeholder: "Enter Password",
    label: "Password",
    componentType: "input",
  },

  {
    id: "role",
    type: "",
    placeholder: "",
    label: "Role",
    componentType: "select",
    options: [
      {
        id: "admin",
        label: "Admin",
      },
      { id: "customer", label: "customer" },
    ],
  },
];

export const loginFormControls=[
  {
    id: "email",
    type: "email",
    placeholder: "Enter your email",
    label: "Email",
    componentType: "input",
  },

  {
    id: "password",
    type: "password",
    placeholder: "Enter Password",
    label: "Password",
    componentType: "input",
  }
]