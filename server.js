// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const router = require("./routes");
const processRoutes = require("./src/routes/processes/processes.routes");
const emloyeeRoutes = require("./src/routes/employees/emloyees.routes");

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());
app.use("/api", processRoutes);
app.use("/api", emloyeeRoutes);

app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
