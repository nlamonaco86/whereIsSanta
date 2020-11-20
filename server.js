let express = require("express");
let mongoose = require("mongoose");

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

app.listen(PORT, function() {
  console.log(`Searching for Santa at: http://localhost:${PORT}`);
});
