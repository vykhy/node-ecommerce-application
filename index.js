//PACKAGES
const express = require("express");
const app = express();
const env = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

//CONSTANTS
env.config();
const PORT = process.env.APP_PORT;

//ROUTERS
const adminRouter = require("./admin/index");
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");

//CUSTOM MIDDLEWARE
const isAuth = require("./middlewares/isAuth");
const isAdmin = require("./middlewares/isAdmin");
const Product = require("./models/Product");

//APP SETUP AND MIDDLEWARES
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose.connect(process.env.DB_URL, () => console.log("db connected..."));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    saveUninitialized: false,
  })
);

app.use(function (req, res, next) {
  // req.session.uid = "a123d4568964";
  // req.session.user = "Vykhy the billionaire";
  // req.session.cart = "61d3db26153420b6848e5e50";
  req.session.uid = mongoose.Types.ObjectId("61dd41f0b0dd7233902db058");
  req.session.user = "Billionaire";
  req.session.admin = true;
  //
  res.locals.session = req.session;
  next();
});

//dev routes
// app.get("/updateimages", async (req, res) => {
//   const Product = require("./models/Product");

//   try {
//     const products = await Product.find();
//     return res.send(`<pre>${products}</pre>`);
//     const results = await Promise.all(
//       products.map((product) => {
//         product.images = product.images.map((image) =>
//           image.path.replace("\\images\\", "\\uploaded-images\\")
//         );
//         return Product.findOneAndUpdate(
//           { _id: product.id },
//           { images: product.images }
//         );
//       })
//     );
//     res.send(`<pre>${results}</pre>`);
//   } catch (e) {
//     res.send(e.message);
//   }
// });

//ROUTES
app.get("/", (req, res) => res.render("home"));
app.get("/contact", (req, res) => res.render("contact"));
app.use("/admin", isAdmin, adminRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

//test route
app.get("/protected", (req, res) => {
  if (!req.session.user) return res.send("UNAUTHORIZED");
  res.send(req.session.user);
});

app.listen(PORT);

/**
 * NEXT TIME
 *
 * CREATE ORDER AND GET ITS ID  **
 * ADD ADDRESSE TO ORDER    **
 * VIEW ORDERS PAGE     **
 * DELETE ORDER     **
 * BILLING
 * IMPLEMENT PRODUCT IMAGES     **
 * UPDATE LOGIN AND AUTH SYSTEM   **
 * SEPARATE USER AND ADMIN CODE   **
 * CKEDITOR FOR PRODUCTS.LONG_DESCRIPTION   **
 * HOME PAGE DESIGN
 * NAVBAR AND FOOTER
 * IMPLEMENT REVIEWS
 * IMPLEMENT REDIS
 *  - products
 *  - recommendations
 *  - updates
 *  - cart
 * RECOMMENDATION
 * SHIPPING API
 *
 * ADMIN, PROBABLY  **
 */
