const mongoose = require("mongoose");

const resvSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  phoneNum1: { type: String, required: true },
  year: { type: String, required: true },
  sid: { type: String, required: true },
  code: { type: String, required: true },
});

const Resv = mongoose.model("Resv", resvSchema);

module.exports = Resv;
