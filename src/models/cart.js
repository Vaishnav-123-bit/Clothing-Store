import mongoose from "mongoose";

const CartItems = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products'
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  },
  {
    timestamps: true // Add createdAt and updatedAt fields
  }
);

CartItems.statics.deleteItemsByUserID = async function (userID) {
  try {
    await this.deleteMany({ userID: userID });
    console.log('Cart items deleted successfully');
  } catch (error) {
    console.error('Error deleting cart items:', error);
    throw error;
  }
};



const Cart = mongoose.models.Cart || mongoose.model("Cart", CartItems);

export default Cart;
