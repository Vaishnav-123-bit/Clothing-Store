import mongoose from "mongoose";
const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDb = async () => {
  const connectionUrl = "mongodb+srv://hard:hard@cluster0.sucrsem.mongodb.net/";

  mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log("Ecommerce database connected successfully!"))
    .catch((err) =>
      console.log(`Getting Error from DB connection ${err.message}`)
    );
};

export default connectToDb;