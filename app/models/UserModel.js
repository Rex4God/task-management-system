"use strict";
const  mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const bcrypt =  require("bcryptjs")

const schema = new mongoose.Schema({
  
  firstName:{
    type: String,
    trim: true,
    required:[true, "Please provide your first name"]
  },
  lastName:{
    type: String,
    trim: true,
    required:[true, "Please provide your first name"]
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    isEmail: true,
    required: [true, "Please provide your email address"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],},
  password:{
  type: String,
  required:[true, 'Please provide your password'],
  minlength: 6,
  },
}, {
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
schema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

schema.methods.comparePassword =async function(candidatePassword){
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

schema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", schema);

