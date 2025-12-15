import express from "express";
import {
  sendMoney,
  getPendingApprovals,
  approveTransaction,
  getWalletTransactions
} from "../controllers/transactionController.js";
const router = express.Router();


router.post("/send", sendMoney);
router.get("/pending/:userId", getPendingApprovals);
router.post("/approve", approveTransaction);
router.get("/wallet/:walletId", getWalletTransactions);

export default router;
