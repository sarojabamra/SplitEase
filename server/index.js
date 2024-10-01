import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Connection from "./database/db.js";
import dotenv from "dotenv";
import Router from "./routes/route.js";
import cookieParser from "cookie-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { notFound, errorHandler } from "./middlewares/error-middlewares.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", Router);

app.use(
  "/images",
  express.static(path.join(__dirname, "../client/public/images"))
);

app.post("/api", (req, res) => {
  const jsonData = req.body;
  console.log(jsonData);
  res.json({ message: "Data recieved successfully" });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(`Server is running successfully on PORT ${PORT}`)
);

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const URL = `mongodb+srv://${USERNAME}:${PASSWORD}@splitwise.6wyuazb.mongodb.net/?retryWrites=true&w=majority&appName=Splitwise`;

Connection(URL);
