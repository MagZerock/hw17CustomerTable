// David's port 3002
const port = 3002;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("David system connected to MongoDB Database"));
app.use(express.json());
app.use(cors());
const customerRouter = require("./routes/customerRoutes");
app.use("/computerstore", customerRouter);
app.listen(port, () => console.log("David´s Computer Store Server is running on port -->" + port));

app.use(express.static(path.join(__dirname, 'frontend')));
app.get('/:path(*)', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});
