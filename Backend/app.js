const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require('./routes/auth.routes')
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use('/api/auth',userRoutes)

module.exports = app