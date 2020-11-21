let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let santaFactSchema = new Schema({
   fact: String
});

let SantaFact = mongoose.model("SantaFact", santaFactSchema);

module.exports = SantaFact;
