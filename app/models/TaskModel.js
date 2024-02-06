"use strict";
const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");
const dayjs = require("dayjs")


const schema = new mongoose.Schema({
          title:{
            type: String,
            required:  true
          },
          description:{
            type: String,
            required: true
          },
          creationTimestamp: {
             type: Date,
              default: Date.now 
            }
         
        }, {
          toJSON: {
            transform: function (doc, ret) {
              ret.id = ret._id.toString();
              ret.createdAt = dayjs(ret.createdAt)
                .unix();
              ret.updatedAt = dayjs(ret.updatedAt)
                .unix();
              delete ret.__v;
              delete ret._id;
            }
          },
          strict: false,
          timestamps: true

        })

schema.plugin(mongoosePaginate)
module.exports = mongoose.model("Task", schema)