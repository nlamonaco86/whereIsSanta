let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let routeSchema = new Schema({
  x:  Number,
  y:  Number,
  route: { type: String, required: true },
  visited: Boolean,
  message: String
});

let Route = mongoose.model("Route", routeSchema);

module.exports = Route;
