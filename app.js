"use strict";
const {StatusCodes} = require("http-status-codes");
require("dotenv")
    .config({});


global.isProduction = process.env.NODE_ENV === "production";
global.isDevelopment = process.env.NODE_ENV === "development";
global.isStaging = process.env.NODE_ENV === "staging";


let express = require("express");
require("express-async-errors");
let app = express();
require("./lib")(app, express);




//routes
require("./routes")(app);



// catch 404 and forward to error handler
app.use((err, req, res, next) => {
    return res.status(err.status || StatusCodes.NOT_FOUND)
        .json({error: err.message});
});

// error handler
app.use((err, req, res, next) => {
    console.log("Error", err);
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error: err.message});
});

module.exports = app;
