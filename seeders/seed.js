let mongoose = require("mongoose");
let db = require("../models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/santaDb", {
  useNewUrlParser: true
});

let routeSeed = [
  {
    x: 40.453033312279594,
    y: -80.01332493117893,
    location: "Pittsburgh, PA USA",
    visited: false,
    message: ""
},
{
    x: 41.908803749658276,
    y: -87.64648290810564,
    location: "Chicago, IL USA",
    visited: false,
    message: ""
},
{
    x: 39.809208378724435,
    y:  -104.89541823217208,
    location: "Denver, CO USA",
    visited: false,
    message: ""
},
{
    x: 37.960399257552496, 
    y: -122.11610193570196,
    location: "San Francisco, CA USA",
    visited: false,
    message: ""
},
{
    x: 22.006006673093523, 
    y: -157.31149415244397,
    location: "Honolulu, HI USA",
    visited: false,
    message: ""
},
];

db.Route.deleteMany({})
  .then(() => db.Route.collection.insertMany(routeSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });