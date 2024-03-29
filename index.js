//PACKAGES
const express = require("express");
const app = express();
const env = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const Product = require("./models/Product");
const { formatImagePath } = require("./services/functions");
const getCategories = require("./services/getCategories");

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
const reviewRouter = require("./routes/review");
const checkoutRouter = require("./routes/checkout");

//CUSTOM MIDDLEWARE
const isAuth = require("./middlewares/isAuth");
const isAdmin = require("./middlewares/isAdmin");

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

app.use(async function (req, res, next) {
  // req.session.uid = "a123d4568964";
  // req.session.user = "Vykhy the billionaire";
  // req.session.cart = "61d3db26153420b6848e5e50";
  req.session.uid = mongoose.Types.ObjectId("61dd41f0b0dd7233902db058");
  req.session.user = "Billionaire";
  req.session.admin = true;
  //
  res.locals.categories = await getCategories.getCategories();
  res.locals.session = req.session;
  next();
});

//ROUTES
app.get("/", async (req, res) => {
  const products = await Product.find({ available: true }).limit(6);
  products.forEach((product) => {
    formatImagePath(product);
  });
  res.render("home", { products });
});

app.get("/contact", (req, res) => res.render("contact"));
app.use("/admin", isAdmin, adminRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/reviews", reviewRouter);
app.use("/checkout", checkoutRouter);

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
 * IMPLEMENT PRODUCT IMAGES     **
 * UPDATE LOGIN AND AUTH SYSTEM   **
 * SEPARATE USER AND ADMIN CODE   **
 * CKEDITOR FOR PRODUCTS.LONG_DESCRIPTION   **
 * HOME PAGE DESIGN   **
 * NAVBAR AND FOOTER   **
 * PRODUCTS, PRODUCT PAGES DESIGN   **
 * ORDERS AND ORDER PAGE DESIGN   **
 * ADMIN PAGES DESIGN   **
 * ADMIN DASHBOARD
 * BILLING  **
 * IMPLEMENT REVIEWS    **
 * IMPLEMENT REDIS
 *  - products
 *  - recommendations
 *  - updates
 *  - cart
 * RECOMMENDATIONS
 * SHIPPING API
 *
 * ADMIN, PROBABLY  **
 */
