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

let onHisWay = false

app.listen(PORT, () => {
  // On server startup, clear Santa's location
  db.Location.deleteMany({}).then((result) => {
    // Have an elf make sure he's there...
    db.Location.create({
      x: 90.0000,
      y: 135.0000,
      location: "Santa's Workshop - North Pole",
      visited: true,
      message: "Santa is currently at his workshop, preparing for the Big Night."
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
  // If Santa isn't on his way yet, check the current time, and see if it's the Big Night yet.
  // Our sources say he departs on 12-24-2020 @ 8:00pm sharp
  const onHisWay = setInterval(() => {
      let today = new Date();
      let date = ("0" + today.getDate()).slice(-2);
      let month = ("0" + (today.getMonth() + 1)).slice(-2);
      let year = today.getFullYear();
      let hours = today.getHours();
      let minutes = today.getMinutes();
      // If it's the big night, our server will mark Santa as onHisWay and our sources worldwide will begin tracking his route!
      if (year + "-" + month + "-" + date + " " + hours + ":" + minutes >= "2020-11-20 20:00") { 
        clearInterval(onHisWay); 
        console.log("Santa is on his Way!")
      // Set a new interval, to check Santa's Route every 10 minutes, for Santa's current location
      // Filter our array for Cities where Santa has NOT delivered presents to yet
      // Find the closest city to his last location, and have our sources on the ground look for him there
      // Once we spot Santa, mark that city as having been visited 
      // Update the Database "Location" with the current stop on Santa's route
      }
      // Otherwise, we patiently wait.
      else { 
        console.log("It's not the Big Night yet...") 
      }
    }, 5000)
});
