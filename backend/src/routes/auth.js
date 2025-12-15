import express from "express";
import { signup, login, setPin } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/set-pin", setPin);

export default router;
