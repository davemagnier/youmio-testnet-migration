import React from "react";
import { useConnect, type Connector } from "wagmi";
import "./pages/mainnet.css";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { connectors, connect, isPending, error } = useConnect();

  // Handle connection
  const handleConnect = async (connector: Connector) => {
    connect({ connector }, { onSuccess: () => onClose() });
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal ${isOpen ? "active" : ""}`}
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Connect Wallet</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-description">
            <p>Choose your preferred wallet to connect to the Youmio Testnet</p>
          </div>

          <div className="installation-steps">
            {connectors.length === 0 ? (
              <div className="step-card">
                <p>No wallets found. Please install a compatible wallet.</p>
              </div>
            ) : (
              <div className="wallet-connectors">
                {connectors
                  .filter((connector) => connector.name !== "Injected")
                  .map((connector) => (
                    <button
                      key={connector.id}
                      className="btn wallet-connector-btn"
                      onClick={() => handleConnect(connector)}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <span className="loading-spinner"></span>
                      ) : null}
                      <span>{connector.name}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {error && (
            <div
              className="step-card"
              style={{ color: "#ff6464", marginTop: "16px" }}
            >
              <p>Error: {error.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
