require("dotenv").config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import { port } from "./config";
import apiRouter from "./routes/api";
import { initAuthentication } from "./authentication";
import "./db/mongoose";
import session from "express-session";

const secret = process.env.SECRET || "default-secret-key"

const oneDay = 1000 * 60 * 60 * 24;

const app = express();
const staticPath = path.join(__dirname, "public");

app.use(express.static(staticPath));
app.use(cookieParser());
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay, secure: false },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
initAuthentication(app);
app.use("/", apiRouter);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});
