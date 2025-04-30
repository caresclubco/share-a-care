import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

// A simplified wallet connector that uses the window.ethereum provider directly
const SimpleWalletConnector = () => {
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Check if ethereum provider exists
  const checkEthereumProvider = () => {
    return (
      typeof window !== "undefined" &&
      (window.ethereum || window.coinbaseWalletExtension)
    );
  };

  // Get the appropriate provider
  const getProvider = () => {
    if (window.coinbaseWalletExtension) {
      return window.coinbaseWalletExtension;
    }
    return window.ethereum;
  };

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Connect wallet using window.ethereum
  const connectWallet = async () => {
    setError(null);

    if (!checkEthereumProvider()) {
      setError(
        "No Ethereum wallet found. Please install MetaMask or Coinbase Wallet."
      );
      return;
    }

    try {
      // Request accounts from the appropriate provider
      const provider = getProvider();
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet. Please try again.");
    }
  };

  // Disconnect wallet (just resets state - doesn't disconnect from provider)
  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
  };

  // Handle account changes
  useEffect(() => {
    if (checkEthereumProvider()) {
      const provider = getProvider();

      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setAddress(null);
          setIsConnected(false);
        } else if (accounts[0] !== address) {
          // User switched accounts
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      };

      provider.on("accountsChanged", handleAccountsChanged);

      // Check if already connected
      provider
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
          }
        })
        .catch((err) => console.error("Error checking accounts:", err));

      return () => {
        if (provider && provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, [address]);

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center overflow-hidden">
          <User size={14} className="text-white" />
        </div>
        <span className="text-sm font-medium">{formatAddress(address)}</span>
        <button
          onClick={disconnectWallet}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Function to launch Coinbase Wallet
  const launchCoinbaseWallet = () => {
    // Deep link to Coinbase Wallet
    window.location.href = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(
      window.location.href
    )}`;
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <button
          className="bg-red-600 text-white px-3 py-1 rounded-full text-sm"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
          onClick={launchCoinbaseWallet}
        >
          Coinbase Wallet
        </button>
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

export default SimpleWalletConnector;
