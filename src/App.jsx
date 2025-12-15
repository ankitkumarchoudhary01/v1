import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SetPin from "./pages/SetPin";
import CreateWallet from "./pages/CreateWallet";
import WalletDetails from "./pages/WalletDetails";
import AddGuardian from "./pages/AddGuardian";
import GuardianRequests from "./pages/GuardianRequests";
import AddMoney from "./pages/AddMoney";
import SendMoney from "./pages/SendMoney";
import TransactionApprovals from "./pages/TransactionApprovals";
import Transactions from "./pages/Transactions";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/set-pin" element={<SetPin />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/wallet/:walletId" element={<WalletDetails />} />
        <Route path="/wallet/:walletId/guardians" element={<AddGuardian />} />
        <Route path="/guardian/requests" element={<GuardianRequests />} />
        <Route path="/wallet/:walletId/add-money" element={<AddMoney />} />
        <Route path="/wallet/:walletId/send-money" element={<SendMoney />} />
        <Route path="/approvals" element={<TransactionApprovals />} />
        <Route path="/wallet/:walletId/transactions" element={<Transactions />} />

      </Routes>
    </Router>
  );
}

export default App;
