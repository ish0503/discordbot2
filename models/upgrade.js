const { Schema, model } = require("mongoose");

const SchemaF = new Schema({
  userid: String,
  hashtags: [
    { name: String, value: Number },
   // { name: String, value: Number },
    //{ name: String, value: Number },
  ],
  cooltime: String,
})

module.exports = model("Upgrade", SchemaF);