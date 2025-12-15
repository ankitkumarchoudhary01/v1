import express from "express";
import { createWallet, getUserWallets, getWalletById } from "../controllers/walletController.js";
import { addMoney } from "../controllers/walletController.js";


const router = express.Router();

router.post("/create", createWallet);
router.get("/user/:userId", getUserWallets); 
router.get("/:walletId", getWalletById); 
router.post("/add-money", addMoney);


export default router;
