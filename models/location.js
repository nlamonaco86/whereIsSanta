let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let locationSchema = new Schema({
  x:  Number,
  y:  Number,
  location: { type: String, required: true },
  visited: Boolean,
  message: String
});

let Location = mongoose.model("Location", locationSchema);

module.exports = Location;
