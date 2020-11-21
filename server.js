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
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});



const visitLocation = () => {
  db.Route.findOne({ visited: false }).then((response) => {
    if (response === null) {
      db.Location.findOneAndUpdate({},{$set: { message: "Santa is headed back to the North Pole. Merry Christmas to all, and to all a good night." }}).then((response)=>{
        db.Location.findOne({}).then((response)=>{
          console.log(response._doc.message);
          // for testing purposes
          process.exit(1);
        })
      })
    }
    else {
      db.Route.findOneAndUpdate({ location: response._doc.location }, { $set: { visited: true } }).then((result) => {
        console.log("Santa has been sighted in " + result._doc.location)
      })
    }
  })
}

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
          console.log(`Searching for Santa at: http://localhost:${PORT}`);
          console.log(response[0].message)
        }
        else { console.log("Something went wrong. Don't worry, an elf can fix it.") }
      })
    })
  })
  // If Santa isn't on his way yet, check the current time every five seconds, and see if it's the Big Night.
  // Santa's Helpers say he departs on 12-24-2020 @ 20:00 sharp!
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
        // Get the next stop on the route where Santa has NOT delivered presents to yet
        visitLocation();
        // db.Route.findOne({ visited: false }).then((response) => { 
        //   console.log(response)
        // // Once we spot Santa, mark that city as having been visited 
        // db.Route.findOneAndUpdate({location: response.location}, {$set:{visited: true}}).then((result)=>{console.log("Was marked as visited")})
        // // // Update the Database "Location" with the current stop on Santa's route
        // // db.Location.findOneAndUpdate({},{x: response.x, y: response.y, location: response.location, message: response.message}).then((result)=>{console.log(result, "Location Updated")})
        // // Once Santa's work is complete, send one last message to the database
        // });      
        // Set to 5 seconds for testing purposes / 180k 
      }, 1000)
    }
    // Otherwise, we patiently wait for the Big Night.
    else {
      console.log("It's " + (12 - month) + " month, " + (24 - date) + " days, " + Math.abs(20 - hours) + " hours, " + Math.abs(00 - minutes) + "minutes, and " + Math.abs(60 - seconds) + " seconds until the Big Night...")
    }
  }, 5000)
});
