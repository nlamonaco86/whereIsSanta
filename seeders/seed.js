let mongoose = require("mongoose");
let db = require("../models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/santaDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true 
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
    x: 37.960399257552496,
    y: -122.11610193570196,
    location: "San Francisco, CA USA",
    visited: false,
    message: ""
},
{
    x: 53.4506181740751,
    y: -6.236225314609783,
    location: "Dublin, Ireland",
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
    x: 22.006006673093523,
    y: -157.31149415244397,
    location: "Honolulu, HI USA",
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
    y: -104.89541823217208,
    location: "Denver, CO USA",
    visited: false,
    message: ""
},
];

const santasLocation = [{
  x: 40.71194499119388,
  y: -73.99693894907112,
  location: "New York, NY USA",
  visited: false,
  message: "Home"
}];

//This needs to become middleware
const dbSort = (inputArray) => {
  // credit for sort function to Amit Diwan @ https://www.tutorialspoint.com/sort-array-of-points-by-ascending-distance-from-a-given-point-javascript
  // Calculate the distance of each point from the given point
    const distance = (coord1, coord2) => {
      const x = coord2.x - coord1.x;
      const y = coord2.y - coord1.y;
      return Math.sqrt((x * x) + (y * y));
    };
    // Sort the array according to distance, nearest first
    const sortByDistance = (coordinates, point) => {
      const sorter = (a, b) => distance(a, point) - distance(b, point);
      coordinates.sort(sorter);
    };
    sortByDistance(inputArray, { x: santasLocation.x, y: santasLocation.y });
    // Return only the first item - the nearest location to Santa
    return inputArray;
  }

let sortedSeeds = dbSort(routeSeed);
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