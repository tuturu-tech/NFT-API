const Joi = require("joi");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const metadataRoutes = require("./routes/metadata");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use("/api/metadata", metadataRoutes);

mongoose.connect(process.env.DB, () => {
	console.log(mongoose.connection.host);
	console.log(mongoose.connection.port);
	console.log("Connected to DB");
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Listening on port ", port));
