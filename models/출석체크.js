const { Schema, model } = require("mongoose");

const SchemaF = new Schema({
  userid: String,
  date: Number,
  count: Number,
})

module.exports = model("출석체크", SchemaF);