import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js"

dotenv.config(); // initializing the .env file

const app = new express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is a security middleware that prevents web vulnerabilities like clickjacking
app.use(morgan("dev")); // morgan is a middle that helps to log incoming requests

app.use("/api/products", productRoutes) // if someone uses the /api/products end point route them to productRoute

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
