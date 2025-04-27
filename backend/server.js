import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

dotenv.config(); // initializing the .env file

const app = new express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is a security middleware that prevents web vulnerabilities like clickjacking
app.use(morgan("dev")); // morgan is a middle that helps to log incoming requests

//applying arcjet rate limit and bot detection

app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // this specifies that each request will consume 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied!" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
    }
  } catch (error) {}
});

app.use("/api/products", productRoutes); // if someone uses the /api/products end point route them to productRoute

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("DB INITIALIZED SUCCESSFULLY!");
  } catch (error) {
    console.log("Error initializing the database", error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});
