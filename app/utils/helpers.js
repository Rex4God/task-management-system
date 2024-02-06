"use strict";
const Joi = require("joi");

const {isEmpty} = require("lodash");
const dataToBeRemovedArray = ["", null, undefined];

/**
 * @param {object} value
 * @returns {object}
 */
function removeFieldsWithEmptyValue(value) {
    const objectTobeWorkingOn = {...value};

    if(typeof value != "object") return value;

    for (const key in objectTobeWorkingOn) {
        if(dataToBeRemovedArray.includes(objectTobeWorkingOn[key])){
            delete objectTobeWorkingOn[key];
            continue;
        }

        if(Array.isArray(objectTobeWorkingOn[key])){
            objectTobeWorkingOn[key] = objectTobeWorkingOn[key].map(removeFieldsWithEmptyValue);
            continue;
        }

        if(typeof objectTobeWorkingOn[key] === "object"){
            objectTobeWorkingOn[key] = removeFieldsWithEmptyValue(objectTobeWorkingOn[key]);
        }
    }

    return objectTobeWorkingOn;
}
exports.removeFieldsWithEmptyValue = removeFieldsWithEmptyValue;
exports.isEmpty = isEmpty;


exports.validate = (schema, payload) => {
    schema = Joi.object(schema);
    const {error} = schema.validate(payload, {
        allowUnknown: true,
    });

    if (error)
        return error.details[0].message.replace(/['"]/g, "");

    return null;
};
exports.resolveRequestQueryToMongoDBQuery = (requestQuery) => {
    const response = {
        page: 1,
        limit: 50,
        filter: {},
        sort: {_id: -1}
    };

    for (const key in requestQuery) {
        if (!requestQuery.hasOwnProperty(key)) {
            continue;
        }

        if (key === "page") {
            response.page = parseInt(requestQuery[key]);
            continue;
        }

        if (key === "limit") {
            response.limit = parseInt(requestQuery[key]);
            continue;
        }

        if (key === "sort") {
            const [sortKey, sortValue] = requestQuery[key].split(",");
            response.sort = {[sortKey]: sortValue || -1};
            continue;
        }

        if (key === "dateFrom") {
            response.filter.createdAt = {
                $gte: dayjs(requestQuery[key] || new Date(), "DD-MM-YYYY")
                    .startOf("day")
                    .unix()
            };
        }

        if (key === "dateTo") {
            response.filter.createdAt = {
                $lte: dayjs(requestQuery[key] || new Date(), "DD-MM-YYYY")
                    .endOf("day")
                    .unix()
            };
        }

        if (key.endsWith("From") && key != "dateFrom") {
            const field = response.filter[key.replace(/From/i, "")] || {};
            field["$gte"] = dayjs(requestQuery[key] || new Date(), "YYYY-MM-DD")
                .startOf("day").unix();
            response.filter[key.replace(/From/i, "")] = field;
            delete requestQuery[`${key}`];
        }

        if (key.endsWith("To") && key != "dateTo") {
            const field = response.filter[key.replace(/To/i, "")] || {};
            field["$lte"] = dayjs(requestQuery[key] || new Date(), "YYYY-MM-DD")
                .startOf("day").unix();
            response.filter[key.replace(/To/i, "")] = field;
            delete requestQuery[`${key}`];
        }

        if (key === "q") {
            response.filter.$text = {
                $search: new RegExp(requestQuery[key], "gi"),
                $caseSensitive: false
            };

            continue;
        }

        if (requestQuery[key]) response.filter[key] = requestQuery[key];
    }

    return response;
};

