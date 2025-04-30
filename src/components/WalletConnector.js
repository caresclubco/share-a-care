import React from "react";
import { ConnectButton } from "@coinbase/onchainkit/connect";
import { useWallet } from "../hooks/useWallet";
import "../styles/WalletConnector.css";

const WalletConnector = () => {
  const { isConnected, connectWallet, disconnectWallet, address } = useWallet();

  return (
    <div className="wallet-connector">
      {!isConnected ? (
        <ConnectButton
          onConnect={(walletAddress) => connectWallet(walletAddress)}
          label="Connect Wallet"
          className="connect-wallet-btn"
        />
      ) : (
        <div className="wallet-connected">
          <div className="wallet-address">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button className="disconnect-wallet-btn" onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
