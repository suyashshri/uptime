import express from "express";
import baseRouter from "./routes/index";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1", baseRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
