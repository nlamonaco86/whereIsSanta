const { response } = require("express");
let express = require("express");
let mongoose = require("mongoose");
const db = require("./models");

let app = express();
let PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/santaDb", {
  useNewUrlParser: true
});

const santasLocation = db.Location.findOne({}).then((response) => { return response })

// Search the database for all locations Santa hasn't visited yet
const placeToGo = db.Route.find({ visited: false }).then((response) => {
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
  sortByDistance(response, { x: santasLocation.x, y: santasLocation.y });
  // Return only the first item - the nearest location to Santa
  return response[0];
})

app.listen(PORT, () => {
  // On server startup, clear Santa's location
  db.Location.deleteMany({}).then((result) => {
    // Have an elf make sure he's there...
    db.Location.create({
      x: 90.0000,
      y: 135.0000,
      location: "Santa's Workshop - North Pole",
      visited: true,
      message: "Santa is currently at his workshop, getting ready for the Big Night."
    }).then((response) => {
      db.Location.find({ location: "Santa's Workshop - North Pole" }).then((response) => {
        // Make sure our elf did his job correctly
        if (response) {
          console.log(response[0].message)
          console.log(`Searching for Santa at: http://localhost:${PORT}`);
        }
        else { console.log("Something went wrong. Don't worry, an elf can fix it.") }
      })
    })
  })
  // If Santa isn't on his way yet, check the current time, and see if it's the Big Night.
  // Santa's Helpers say he departs on 12-24-2020 @ 8:00pm sharp
  const onHisWay = setInterval(() => {
    let today = new Date();
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    let currentTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes
    // If it's the big night, our server will mark Santa as onHisWay and our sources worldwide will begin tracking his route!
    if (currentTime >= "2020-11-20 20:00") {
      clearInterval(onHisWay);
      console.log("Santa is on his Way!")
      // Set a new interval, to check Santa's Route every 3 minutes, for Santa's current location
      // Our helpers indicate he plans to visit 160+ cities in a span of 8 hours 
      const outForDelivery = setInterval(() => {
        // Get Santa's current location
        // Get all stops on the route where Santa has NOT delivered presents to yet
        console.log(santasLocation, placeToGo)
        // Find the closest city to Santa's last location that hasn't been visited yet, and have our sources on the ground look for him there
        // Once we spot Santa, mark that city as having been visited 
        // Update the Database "Location" with the current stop on Santa's route
        // Once Santa's work is complete, send one last message to the database
        // Set to 5 seconds for testing purposes / 180k 
      }, 5000)
    }
    // Otherwise, we patiently wait.
    else {
      console.log("It's " + (12 - month) + " month, " + (24 - date) + " days, " + Math.abs(20 - hours) + " hours, " + Math.abs(00 - minutes) + "minutes, and " + Math.abs(60 - seconds) + " seconds until the Big Day...")
    }
  }, 5000)
});
