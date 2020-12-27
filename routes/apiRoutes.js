let db = require("../models");

module.exports = function (app) {
  app.get("/api/location", (req, res) => {
    db.Location.findOne({}).then(response => {
      res.json(response._doc);
    })
    .catch(err => {
      res.json(err);
    });
  });
};