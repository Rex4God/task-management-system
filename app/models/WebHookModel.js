"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate")

const webhookSchema = new mongoose.Schema({
  url: {
     type: String,
      required: true
     },
    },
    {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret.__v;
            delete ret._id;
        }
    },
    timestamps: true,
    strict: false,
    
});

webhookSchema.plugin(mongoosePaginate)
const Webhook = mongoose.model('Webhook', webhookSchema);

module.exports = Webhook;
