import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const URL = `mongodb://Blog:blog123@cluster0-shard-00-00.y3qru.mongodb.net:27017,cluster0-shard-00-01.y3qru.mongodb.net:27017,cluster0-shard-00-02.y3qru.mongodb.net:27017/showed?ssl=true&replicaSet=atlas-nyng0w-shard-0&authSource=admin&retryWrites=true&w=majority`;

    const conn = await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("moongosee connect");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDatabase;
