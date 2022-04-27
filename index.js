/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

require("dotenv").config();

const authRouter = require("./auth");

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8001";


/**
 * Session Configuration
 */
const session = {
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false
};

if (app.get("env") === "production"){
    // Serve secure cookies, requires HTTPS
    session.cookie.secure = true;
}


/**
 * Passport Configuration
 */
const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function(accessToken, refreshToken, extraParams, profile, done){
        /**
         * Access tokens are used to authorize users to an API
         * (resource server)
         * accessToken is the token to call the Auth0 API
         * or a secured third-party API
         * extraParams.id_token has the JSON Web Token
         * profile has all the information from the user
         */
        return done(null, profile);
    }
)


/**
 * App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//write this then create a public folder containing style.css file
app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession(session)); //after this configuration, u can add passport config

passport.use(strategy);
app.use(passport.initialize()); //this must be added behind app.use(expressSession(session));
app.use(passport.session()); //this must be added behind app.use(passport.initialize());


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Creating custom middleware with Express
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

// Router mounting
app.use("/", authRouter);


/**
 * Routes Definitions
 */

const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
}

app.get('/', (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/user", secured, (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    res.render("user", { title: "Profile", userProfile: userProfile.nickname });
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