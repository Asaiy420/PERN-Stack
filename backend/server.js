import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = new express();

app.use(helmet()) // helmet is a security middleware that prevents web vulnerabilities like clickjacking

app.get("/test", (req,res) => {
    console.log(res.getHeaders());
    res.send("Hello from the route test")
})



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
