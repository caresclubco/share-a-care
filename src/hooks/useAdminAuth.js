// src/hooks/useAdminAuth.js
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

// List of authorized admin wallets
const ADMIN_WALLETS = [
  "0x8aB0c174F40C5E22b00065C4Cc7b561c299Cad1C", // CARES admin wallet
  "0x616A2336eC93ACdd1caA8CA17732285F34331bf0", // Secondary admin wallet
];

/**
 * Hook to verify if the currently connected wallet is an admin
 * @returns {Object} { isAdmin, isLoading, error }
 */
export const useAdminAuth = () => {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // If user isn't connected, they're not an admin
        if (!isConnected || !address) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Basic check - if the address is in our admin list
        const normalizedAddress = address.toLowerCase();
        const isAdminWallet = ADMIN_WALLETS.some(
          (adminAddress) => adminAddress.toLowerCase() === normalizedAddress
        );

        setIsAdmin(isAdminWallet);
      } catch (err) {
        console.error("Error checking admin status:", err);
        setError(err.message);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [address, isConnected]);

  return { isAdmin, isLoading, error };
};
