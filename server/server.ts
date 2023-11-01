require("dotenv").config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

// import routes
import userRoutes from "./routes/users.routes";
import authRoutes from "./routes//auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import orderDetail from "./routes/orderDetail.routes";
import orderRoutes from "./routes/order.routes";


// Khởi tạo server
const server = express();

// SD các packages
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(morgan("dev"));
server.use(cors());
server.use(express.static("public"));


// // Set up routes
server.use("/api/v1/auth", authRoutes);
server.use("/api/v1/users", userRoutes);
server.use("/api/v1/products", productRoutes);
server.use("/api/v1/categories", categoryRoutes);
server.use("/api/v1/order-details", orderDetail);
server.use("/api/v1/orders", orderRoutes);

server.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});