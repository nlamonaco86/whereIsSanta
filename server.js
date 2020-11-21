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
        else {console.log("Something went wrong. Don't worry, an elf can fix it.")}
      })
    })
  })
  // This will check with our sources on the ground worldwide, every X minutes, to see where Santa is
  // And update our database with his latest location throughout the night
  setInterval(()=>{console.log("5 seconds has passed...")}, 5000)
});
