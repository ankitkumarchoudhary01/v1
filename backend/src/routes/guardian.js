import express from "express";
import {
  addGuardian,
  getWalletGuardians,
} from "../controllers/guardianController.js";
import {
  
  getMyGuardianRequests,
  updateGuardianStatus,
  getAcceptedGuardians
} from "../controllers/guardianController.js";

const router = express.Router();

router.post("/add", addGuardian);
router.get("/wallet/:walletId", getWalletGuardians);
router.get("/requests/:userId", getMyGuardianRequests);
router.post("/update-status", updateGuardianStatus);  
router.get("/wallet/:walletId/accepted", getAcceptedGuardians);

export default router;
