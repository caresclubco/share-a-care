import { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // CARES wallet address (admin)
  const ADMIN_ADDRESS = process.env.REACT_APP_ADMIN_WALLET_ADDRESS;

  useEffect(() => {
    // Check if connected wallet is admin
    if (isConnected && address) {
      setIsAdmin(address.toLowerCase() === ADMIN_ADDRESS?.toLowerCase());
    } else {
      setIsAdmin(false);
    }
  }, [address, isConnected, ADMIN_ADDRESS]);

  const connectWallet = async (walletAddress) => {
    setAddress(walletAddress);
    setIsConnected(true);
    // Store connected state in localStorage
    localStorage.setItem("walletConnected", "true");
    localStorage.setItem("walletAddress", walletAddress);
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    // Clear localStorage
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAddress");
  };

  // Check for existing connection on load
  useEffect(() => {
    const connected = localStorage.getItem("walletConnected") === "true";
    const savedAddress = localStorage.getItem("walletAddress");

    if (connected && savedAddress) {
      setAddress(savedAddress);
      setIsConnected(true);
    }
  }, []);

  const value = {
    address,
    isConnected,
    isAdmin,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
