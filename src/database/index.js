import mongoose from "mongoose";
const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDb = async () => {
  const connectionUrl = "mongodb+srv://hard:hard@cluster0.sucrsem.mongodb.net/";

  (await mongoose.connect(connectionUrl, configOptions))
    .isObjectIdOrHexString(() =>
      console.log("ecom database connected sucessfully !!")
    )
    .catch((err) =>
      console.log(`getting error in db connection ${err.message}`)
    );
};

export default connectToDb;