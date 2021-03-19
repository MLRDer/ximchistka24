// all needed packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv/config");

// routes
const loginRoute = require("./routes/login");
const welcomeRoute = require("./routes/welcome");
const aboutRoute = require("./routes/about");
const galleryRoute = require("./routes/gallery");
const serviceRoute = require("./routes/service");

// database connection
const ConnectionString = process.env.ConnectionString;
mongoose.connect(ConnectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

// all middleware functions
app.disable("x-powered-by");
app.use(
    bodyParser.json({
        limit: "50mb",
        extended: true,
    })
);
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    })
);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Expose-Headers", "x-token");
    next();
});

app.use("/api/uploads", express.static("uploads"));
app.use("/api/welcome", welcomeRoute);
app.use("/api/about", aboutRoute);
app.use("/api/login", loginRoute);
app.use("/api/service", serviceRoute);
app.use("/api/gallery", galleryRoute);

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// listen
app.listen(3000, () => {
    console.log("Port listening...");
});
