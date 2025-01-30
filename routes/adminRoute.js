const express = require("express");
const router = express.Router();
const Admin = require("../models/adminSchema");
const bcrypt = require("bcrypt");
router.route("/admin");

router.post("/hat", async (req, res) => {
  const matching = async (pw, hashedpw) => {
    let match = await bcrypt.compare(pw, hashedpw);
    return match;
  };
  const { email, pw } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    console.log(exists);
    if (exists) {
      let isMatch = await matching(pw, exists.pw);
      if (isMatch) {
        return res.send({
          sts: "ok",
        });
      } else {
        return res.send({ sts: "err", message: "Password Is Incorrect" });
      }
    } else
      return res.send({
        sts: "err",
        message: "Admin Not Found.",
      });
  } catch {
    return res.send({
      sts: "err",
      message: "Network Error, Please Try Again.",
    });
  }
});

router.post("/7ot", async (req, res) => {
  const { email, pw } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(pw, 10);
      const newAdmin = new Admin({
        email: email,
        pw: hashedPassword,
      });
      const done = await newAdmin.save();
      if (done) {
        return res.send({ sts: "ok" });
      }
    } else
      return res.send({
        sts: "err",
        message: "Admin Already Exists",
      });
  } catch {
    return res.send({
      sts: "err",
      message: "Network Error, Please Try Again.",
    });
  }
});
module.exports = router;
