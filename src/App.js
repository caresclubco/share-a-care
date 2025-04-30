import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { OnchainProvider } from "@coinbase/onchainkit/provider";
import { WalletProvider } from "./hooks/useWallet";
import Layout from "./components/layout/Layout";
import "./App.css";

// Import your existing components or create new ones
import Dashboard from "./ShareACareApp"; // Using your existing component for now

// Chain configuration
const config = {
  chains: [
    {
      id: 8453, // Base Mainnet chain ID
      name: "Base",
      rpcUrl: process.env.REACT_APP_BASE_RPC_URL || "https://mainnet.base.org",
    },
  ],
  projectId: process.env.REACT_APP_CDP_PROJECT_ID || "1234567890",
};

function App() {
  return (
    <OnchainProvider config={config}>
      <WalletProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* Add more routes as needed */}
            </Routes>
          </Layout>
        </Router>
      </WalletProvider>
    </OnchainProvider>
  );
}

export default App;
