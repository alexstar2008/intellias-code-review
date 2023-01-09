const bodyParser = require("body-parser");
const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const fileupload = require('express-fileupload');
const errorHandler = require("./middleware/error");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(fileupload()); 
app.use(cookieParser(process.env.SECRETKEY));
app.use(cors({ credentials: true, origin: process.env.CLIENT_URI }));

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const companyRoutes = require("./routes/company");
const vacancyRoutes = require("./routes/vacancy");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/vacancies", vacancyRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running at ${PORT || 5000}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
