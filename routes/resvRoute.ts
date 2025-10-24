import { Router, Request, Response } from "express";
import Resv from "../models/resvSchema";
const router = Router();
router.route("/reservations");

router.get("/", async (req: Request, res: Response) => {
  try {
    let resvs = await Resv.find();
    if (resvs) {
      res.status(200).json({ resvs: resvs });
      return;
    }
  } catch {
    res.status(500).json();
    return;
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      userName,
      phoneNum1,
      year,
      sid,
    }: { userName: string; phoneNum1: string; year: string; sid: string } =
      req.body;

    const existingReservation = await Resv.findOne({ sid, year });
    if (existingReservation) {
      res.status(409).json();
      return;
    }

    async function checkInternSeats() {
      const count = await Resv.countDocuments({ year: "intern" });
      return count;
    }

    async function checkOthersSeats() {
      const count = await Resv.countDocuments({ year: { $ne: "intern" } });
      return count;
    }

    if (year === "intern") {
      const result = await checkInternSeats();
      if (result >= 50) {
        res.status(410).json();
        return;
      }
    } else {
      const result = await checkOthersSeats();
      if (result >= 350) {
        res.status(410).json();
        return;
      }
    }

    let sidhash =
      Math.ceil((Number(phoneNum1.slice(-6, -2)) * 1787) / 131) +
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
      res.status(200).json({ code: sidhash });
      return;
    }
  } catch {
    res.status(500).json();
    return;
  }
});

export default router;
