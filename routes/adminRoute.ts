import { Router, Request, Response } from "express";
import Admin from "../models/adminSchema";
import bcrypt from "bcrypt";

const router = Router();

router.route("/admin");
router.post("/hat", async (req: Request, res: Response) => {
  const matching = async (pw: string, hashedpw: string): Promise<boolean> => {
    return await bcrypt.compare(pw, hashedpw);
  };

  interface LoginRequest {
    email: string;
    pw: string;
  }

  const { email, pw } = req.body as LoginRequest;

  try {
    const exists = await Admin.findOne({ email });
    if (!exists) {
      res.status(404).json();
      return;
    }
    const isMatch = await matching(pw, exists.pw);
    if (!isMatch) {
      res.status(401).json();
      return;
    }
    res.status(200).json();
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json();
    return;
  }
});

router.post("/7ot", async (req: Request, res: Response) => {
  const { email, pw } = req.body;
  try {
    const exists = await Admin.findOne({ email });

    if (exists) {
      res.status(409).json();
      return;
    }

    const hashedPassword = await bcrypt.hash(pw, 10);
    const newAdmin = new Admin({
      email,
      pw: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json();
    return;
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json();
    return;
  }
});

export default router;
