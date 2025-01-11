import express from "express";
import register from "./Routes/Register.js";
import login from "./Routes/login.js";
import home from "./Routes/home.js";
import mysql from "./Routes/database.js";
import session from "express-session";
import user_info from "./Routes/User_info.js";
import cors from "cors";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use("/register", register);
app.use("/login", login);
app.use("/user_info", user_info);
app.use("/home", home);

app.listen(5000, () => console.log("Server listing"));
