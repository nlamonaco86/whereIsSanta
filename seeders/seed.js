let mongoose = require("mongoose");
let db = require("../models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/santaDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

// Santa's starting location is the North Pole, but you can change it to anywhere else if you'd like him to start from there.
const santasLocation = [{
  x: 90.0000,
  y: 135.0000,
  location: "Santa's Workshop - North Pole",
  visited: false,
  message: "Santa is currently at the North Pole, preparing for the Big Night."
}];

// All of the stops on Santa's route, they will be sorted according to the "Traveling Salesman" problem
// before being inserted into the database, you can add any location to the array if Santa missed a spot.
let routeSeeds = [
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
  x: 35.21115245205097,
  y: -90.16451283089317,
  location: "Memphis, TN USA",
  visited: false,
  message: ""
},
{
  x: 39.809208378724435,
  y: -104.89541823217208,
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
// {
//     x: 53.4506181740751,
//     y: -6.236225314609783,
//     location: "Dublin, Ireland",
//     visited: false,
//     message: ""
// },
];

// function calculateDistance(lat1, lon1, lat2, lon2, unit) {
//   var radlat1 = Math.PI * lat1/180
//   var radlat2 = Math.PI * lat2/180
//   // var radlon1 = Math.PI * lon1/180
//   // var radlon2 = Math.PI * lon2/180
//   var theta = lon1-lon2
//   var radtheta = Math.PI * theta/180
//   var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//   dist = Math.acos(dist)
//   dist = dist * 180/Math.PI
//   dist = dist * 60 * 1.1515
//   if (unit=="K") { dist = dist * 1.609344 }
//   if (unit=="N") { dist = dist * 0.8684 }
//   return dist
// }

// for ( i = 0; i < routeSeeds.length; i++) {
//   routeSeeds[i]["distance"] = calculateDistance(routeSeeds[0].x,routeSeeds[0].y,routeSeeds[i].x,routeSeeds[i].y,"K");
// }

// routeSeeds.sort(function(a, b) { 
//   return a.distance - b.distance;
// });

let sortedSeeds = routeSeeds
// Clear out any existing data, and populate the database for Santa
db.Route.deleteMany({})
  .then(() => db.Route.collection.insertMany(sortedSeeds))
  .then(data => {
    console.log("Santa will be visiting " + data.result.n + " cities across the world tonight!");
  })
  .catch(err => {
    console.error(err);
  });
  db.Location.deleteMany({})
  .then(() => db.Location.collection.insertMany(santasLocation))
  .then(data => {
    console.log(data.result.n + " possible location for Santa has been entered!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });