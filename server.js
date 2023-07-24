import express from "express";
import http from "http";
import bodyParser from "body-parser";
import students from "./api/students";
import payments from "./api/payments";
import teachers from "./api/teachers";
import staff from "./api/staff";
import fee from "./api/fee";
import invoice from "./api/invoices";
import balances from "./api/balances";
import accounts from "./api/accounts";
import users from "./api/users";
import settings from "./api/settings";

require("dotenv").config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8001;

console.log("Server started");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.get("/", function (req, res) {
  res.send("school Server Online.");
});

app.use("/api/students", students);
app.use("/api/teachers", teachers);
app.use("/api/payments", payments);
app.use("/api/staff", staff);
app.use("/api/fee", fee);
app.use("/api/invoices", invoice);
app.use("/api/balances", balances);
app.use("/api/accounts", accounts);
app.use("/api/users", users);
app.use("/api/settings", settings);

server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
