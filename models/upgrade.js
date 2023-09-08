const { Schema, model } = require("mongoose");

const SchemaF = new Schema({
  userid: String,
  hashtags : { type : Array , "default" : [{ "name": String, "value": Number }] },
  cooltime: String,
})

module.exports = model("Upgrade", SchemaF);
