import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import walletRoutes from "./routes/wallet.js";
import guardianRoutes from "./routes/guardian.js";
import transactionRoutes from "./routes/transaction.js";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/guardian", guardianRoutes);
app.use("/api/transaction", transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
