import session from "express-session"
require("dotenv").config();

const secret = process.env.SECRET || "default-secret-key";
const oneDay = 1000 * 60 * 60 * 24;

export const sessionMiddleware = session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay, secure: false },
  })