"use strict";
exports.success = (res, data, code = 200) => {
    return res.status(code).json({data});
};

exports.paginated = (res, data, code = 200) => {
    data.data = data.docs;
    delete data.docs;
    res.response = "Paginated Response";
    data.page = parseInt(data.page);

    return res.status(code).json(data);
};


exports.error = (res, error = "Oops. An Error Occurred", code = 500) => {
    console.log("Error Response", error);
    res.response = error;

    return res.status(code).json({
        error
    });
};
