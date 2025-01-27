const express = require("express");
const router = express.Router();
const Resv = require("../models/resvSchema");
router.route("/reservations");

router.get("/reservations", async (req, res) => {
  await Resv.find()
    .then((resvs) => {
      res.send({ sts: "ok", resvs: resvs });
    })
    .catch(() => {
      res.send({ sts: "err", message: "Network Error, Please Try Again" });
    });
});

router.post("/reservations/", async (req, res) => {
  try {
    const { userName, phoneNum1, year, sid } = req.body;
    const existingReservation = await Resv.findOne({ sid, year });
    if (existingReservation) {
      return res.send({
        sts: "err",
        message: "You Have Already Registered A Seat",
      });
    }

    async function checkInternSeats() {
      const count = await Resv.countDocuments({ year: "intern" });
      if (count >= 350) {
        return res.send({
          sts: "err",
          message: "We Are Sorry, All Seats Have Been Reserved",
        });
      }
    }

    async function checkOthersSeats() {
      const count = await Resv.countDocuments({ year: { $ne: "intern" } });
      if (count >= 50) {
        return res.send({
          sts: "err",
          message: "We Are Sorry, All Seats Have Been Reserved",
        });
      }
    }

    if (year === "intern") {
      const result = await checkInternSeats();
      if (result) return;
    } else {
      const result = await checkOthersSeats();
      if (result) return;
    }
    let sidhash =
      Math.ceil((Number(phoneNum1.slice(-6,-2)) * 1787) / 131) +
      userName.toString().slice(-1) +
      userName.toString().slice(1, 2);
    let thisResv = new Resv({
      userName: userName,
      phoneNum1: phoneNum1,
      year: year,
      sid: sid,
      code: sidhash,
    });
    const done = await thisResv.save();
    if (done) {
      return res.send({ sts: "ok", code: sidhash });
    }
  } catch {
    return res.send({
      sts: "err",
      message: "Network Error, Please Try Again",
    });
  }
});

module.exports = router;
