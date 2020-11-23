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

// All of the stops on Santa's route. They will be sorted via algorithm according to the "Traveling Salesman" problem
// before being inserted into the database, you can add any location to the array if Santa missed a spot. This way, no
// attention needs to be given to the order of the route, it can be expanded anytime, and will always make sense.
let routeSeeds = [
  {
    x: 43.04431683454695, 
    y: 131.86475972806497,
    location: "Vladivostok, Russia",
    visited: false,
    message: ""
},
{
  x: 36.1081139584175,  
  y: 139.59403584224248,
  location: "Tokyo, Japan",
  visited: false,
  message: ""
},
{
  x: 37.96712235854281, 
  y: 126.8938387099994 ,
  location: "Seoul, South Korea",
  visited: false,
  message: ""
},
{
  x: 40.36384826827743, 
  y: 116.54115589540714,
  location: "Beijing, China",
  visited: false,
  message: ""
},
{
  x: 22.050269193562272, 
  y: 114.66191635434095,
  location: "Hong Kong",
  visited: false,
  message: ""
},
{
  x: 15.271508928719626, 
  y: 120.92614902585234 ,
  location: "Manila, Phillipines",
  visited: false,
  message: ""
},
{
  x: 13.259078525091699, 
  y: 144.55105208955015,
  location: "Guam",
  visited: false,
  message: ""
},
{
  x: -14.203161267132815, 
  y: -170.7460441095688,
  location: "American Samoa",
  visited: false,
  message: ""
},
{
  x: -43.2529743071811,  
  y: 172.73345251040178,
  location: "Christchurch, New Zealand",
  visited: false,
  message: ""
},
{
x: -33.658838722786, 
y: 151.25530962586333,
location: "Sydney, Australia",
visited: false,
message: ""
},
{
x: -6.16472388250325,  
y: 106.87034854436307,
location: "Jakarta, Indonesia",
visited: false,
message: ""
},
{
x: 4.5250123348106, 
y: 114.63214008574718,
location: "Brunei, Borneo",
visited: false,
message: ""
},
{
x: 1.0555528766280486,  
y: 103.87547569924908,
location: "Singapore",
visited: false,
message: ""
},
{
x: 11.868253989822065,  
y: 104.55662789267294,
location: "Phnom Pen, Cambodia",
visited: false,
message: ""
},
{
x: 14.18529530522888,  
y: 100.59402196665955,
location: "Bangkok, Thailand",
visited: false,
message: ""
},
{
x: 23.783271511892877,  
y: 90.41576329578403,
location: "Dhaka, Bangladesh",
visited: false,
message: ""
},
{
x: 27.583411867131662,  
y: 85.07188544230941,
location: "Kathmandu, Nepal",
visited: false,
message: ""
},
{
x: 28.504021203531586,  
y: 77.04901072569149, 
location: "New Dehli, India",
visited: false,
message: ""
},
{
  x: 31.512066164513733,  
  y: 74.00339577969817,
  location: "Lahore, Pakistan",
  visited: false,
  message: ""
},
{
x: 41.295926932195385, 
y: 69.23953419304733 ,
location: "Tashkent, Uzbekistan",
visited: false,
message: ""
},
{
x: 35.81821343251561,  
y: 51.40472411502601, 
location: "Tehran, Iran",
visited: false,
message: ""
},
{
x: 25.903093048379095,  
y: 55.30943960218752,
location: "Dubai, UAE",
visited: false,
message: ""
},
{
x: 9.373065836043208,   
y: 38.498199095447205,
location: "Addis Ababa, Ethiopia",
visited: false,
message: ""
},
{
x: -0.984727106710998,   
y: 36.871153349621835,
location: "Nairobi, Kenya",
visited: false,
message: ""
},
{
x: -33.56958610122128,   
y: 18.59470630995634,
location: "Cape Town, South Africa",
visited: false,
message: ""
},
{
x: 6.791397489228659,   
y: 3.7372392112493187,
location: "Lagos, Nigeria",
visited: false,
message: ""
},
{
x: 30.43113491100319, 
y: 31.090890780111017,  
location: "Cairo, Egypt",
visited: false,
message: ""
},
{
x: 31.774029653293347,   
y: 34.97654208634274, 
location: "Jerusalem, Israel",
visited: false,
message: ""
},
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