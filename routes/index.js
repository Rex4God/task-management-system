"use strict";
const home = require("./home")
module.exports = (app) => {
    app.use("/", home)
    app.use("/api/tasks", require("./task"));
    app.use("/api/users", require("./user"))
    app.use("/api/webhooks", require("./webhook"))
    
};
