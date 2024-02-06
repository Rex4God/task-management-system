"use strict";

require("./database");
// require("tm-utils/src/logging");
module.exports = (app, express) => {
    require("./middleware")(app, express);
    require("./queue")
};
