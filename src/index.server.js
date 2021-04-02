if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
require("./db/mongoose");
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const authRoutes = require("./routers/auth.router");
const adminAuthRoutes = require("./routers/admin/auth.router");
const categoryRoutes = require("./routers/category.routes");
const productRoutes = require("./routers/product.routes");
const cartRoutes = require("./routers/cart.routes");
const bodyParser = require("body-parser");

app.use(express.json());
/* app.use(bodyParser.json()); ----- NOT REQUIRED USE EXPRESS-JSON*/
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.post("/data", (req, res, next) => {
  res.status(200).json({ message: "From body", mssgBody: req.body });
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
