import express from "express";
import dotenv from "dotenv";
// import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import mongoose from "mongoose";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import products from "./data/Products.js";
import Stripe from 'stripe'
const stripe = Stripe('sk_test_51LbRq8SF7VgOxsCYwQS1vSYujjdskRLWcqFX06YLpUCW81cKYyyvBTs2U8Oxt13eOIlosWbKgvQtT4f7GL47nvCa00yQyWEhbW')
import cors from 'cors'


dotenv.config();
const URL = `mongodb://Blog:blog123@cluster0-shard-00-00.y3qru.mongodb.net:27017,cluster0-shard-00-01.y3qru.mongodb.net:27017,cluster0-shard-00-02.y3qru.mongodb.net:27017/shoes?ssl=true&replicaSet=atlas-nyng0w-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// API
app.use("/api/import", ImportData);
app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.post("/api/config/paypal", async(req, res) => {
  try{
    console.log("req.body",req.body)

  // let PAYPAL_CLIENT_ID = ATm6YyJekI3EuECyM-JK23BwiRxYuGfXk0BqsFeNr6CfvuXMJXP-cydpDvzif6oSkNMCPsCIlJ5_5-Si
  // res.send(process.env.PAYPAL_CLIENT_ID);
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
  }catch(error){
    console.log("error",error)
  }
});
// app.get("/api/getkey", (req, res) =>
//   res.status(200).json({ key: process.env.RAZORPAY_APT_KEY })
// );
// app.post("/api/config/paypal", async(req, res) => {
//   try{
//      console.log("yrreeee",req.body)
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;

//   if (isAuthentic) {
//     // Database comes here

//     await Payment.create({
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     });

//     // res.redirect(
//     //   `http://localhost:5000/paymentsuccess?reference=${razorpay_payment_id}`
//     // );
//   } else {
//     res.status(400).json({
//       success: false,
//     });
//   }
//   }catch(error){
//     console.log("error",error)
//   }
// });
// app.get("/api/products", (req, res) => {
//   console.log("heee");
//   res.send(products);
// });
// app.get(
//   "/:id",
//   asyncHandler(async (req, res) => {
//     console.log("this work");
//     const product = await Product.findById(req.params.id);
//     if (product) {
//       res.json(product);
//     } else {
//       res.status(404);
//       throw new Error("Product not Found");
//     }
//   })
// );

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

app.listen(5000, () => {
  console.log(process.env.PORT)
  console.log("i am working!");
});
