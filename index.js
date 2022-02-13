/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const dotenv = require('dotenv');

dotenv.config();

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8001";

/**
 * App Configuration
 */


/**
 * Routes Definitions
 */
app.get('/', (req, res) => {
    res.status(200).send("WHATABYTE: Food For Devs");
})

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
})