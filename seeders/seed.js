var mongoose = require("mongoose");
var db = require("../models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/holidayDB", {
  useNewUrlParser: true
});

var locationSeed = [];

db.Location.deleteMany({})
  .then(() => db.Location.collection.insertMany(locationSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
