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
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//write this then create a public folder containing style.css file
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes Definitions
 */
app.get('/', (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/user", (req, res) => {
    res.render("user", { title: "Profile", userProfile: { nickname: "Auth0" } });
});

app.get("/logout", (req, res) => {
    res.render("index", { title: "Home" });
});

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
})



// https://auth0.com/blog/create-a-simple-and-stylish-node-express-app/