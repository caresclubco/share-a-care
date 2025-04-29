// src/utils/walletUtils.js
import { parseEther } from "viem";

/**
 * Formats a wallet address for display by showing only the first 6 and last 4 characters
 * @param {string} address - The wallet address to format
 * @returns {string} Formatted address string
 */
export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

/**
 * Constants for admin wallet addresses
 */
export const ADMIN_WALLETS = {
  PRIMARY: "0x8aB0c174F40C5E22b00065C4Cc7b561c299Cad1C", // CARES wallet
  SECONDARY: "0x616A2336eC93ACdd1caA8CA17732285F34331bf0", // Secondary admin wallet
};

/**
 * Checks if a wallet address is an admin
 * @param {string} address - The wallet address to check
 * @returns {boolean} True if the address is an admin wallet
 */
export const isAdminWallet = (address) => {
  if (!address) return false;

  const normalizedAddress = address.toLowerCase();
  return Object.values(ADMIN_WALLETS).some(
    (adminAddress) => adminAddress.toLowerCase() === normalizedAddress
  );
};

/**
 * Formats an amount of CARES tokens for display
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted amount string
 */
export const formatCARES = (amount) => {
  if (!amount) return "0 CARES";

  const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${parsedAmount.toLocaleString()} CARES`;
};

/**
 * Converts an amount of CARES tokens to wei for on-chain transactions
 * @param {number|string} amount - The amount to convert
 * @returns {bigint} Amount in wei
 */
export const caresToWei = (amount) => {
  if (!amount) return parseEther("0");
  return parseEther(amount.toString());
};

/**
 * Formats a date for display
 * @param {Date|number|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return "";

  const dateObj = typeof date === "object" ? date : new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Calculates the percentage of a current amount compared to a goal
 * @param {number} current - The current amount
 * @param {number} goal - The goal amount
 * @returns {number} The percentage (0-100)
 */
export const calculatePercentage = (current, goal) => {
  if (!current || !goal) return 0;
  return Math.min((current / goal) * 100, 100);
};

/**
 * Returns donation amount options for a project
 * @param {Object} project - The project
 * @returns {Array} Array of donation amount options
 */
export const getDonationOptions = (project) => {
  if (!project || !project.fundingGoal) {
    return [10, 25, 50, 100, 250];
  }

  // Recommended donations based on project goal
  const goal = project.fundingGoal;

  if (goal < 500) {
    return [5, 10, 25, 50, 100];
  } else if (goal < 1000) {
    return [10, 25, 50, 100, 250];
  } else if (goal < 5000) {
    return [25, 50, 100, 250, 500];
  } else {
    return [50, 100, 250, 500, 1000];
  }
};

/**
 * Validates if a string is a valid Ethereum address
 * @param {string} address - The address to validate
 * @returns {boolean} True if the address is valid
 */
export const isValidEthereumAddress = (address) => {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
