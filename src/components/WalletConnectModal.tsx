import React, { useEffect } from "react";
import { useAccount, useConnect, useSwitchChain, type Connector } from "wagmi";
import { useAuthenticate } from "../hooks/use-auth";
import "./pages/mainnet.css";
import { useAuth } from "../contexts/auth-context";
import { youmioMainnet } from "../wagmi/chain";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { connectors, isPending, error, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { session } = useAuth();
  const { isAuthenticating, authError, authenticate } = useAuthenticate();
  const { switchChain } = useSwitchChain();

  // Handle connection
  const handleConnect = async (connector: Connector) => {
    connect(
      { connector },
      {
        onSuccess: () => {
          switchChain({
            chainId: youmioMainnet.id,
          });
        },
      },
    );
  };

  useEffect(() => {
    const effect = async () => {
      await authenticate(address!);
      onClose();
    };
    if (!session && !isAuthenticating && isConnected) {
      effect();
    }
  }, [isConnected, isAuthenticating, address, session]);

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
            <p>Choose your preferred wallet to connect to the Youmio Network</p>
          </div>

          {/* Show authentication progress */}
          {isAuthenticating && (
            <div
              className="step-card"
              style={{ textAlign: "center", padding: "20px" }}
            >
              <div className="loading-spinner"></div>
              <p>Authenticating your wallet...</p>
            </div>
          )}

          {/* Show authentication error */}
          {authError && (
            <div
              className="step-card"
              style={{ color: "#ff6464", marginTop: "16px" }}
            >
              <p>Error: {authError}</p>
            </div>
          )}

          {/* Show wallet connectors only when not authenticating */}
          {!isAuthenticating && (
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
                        type="button"
                        key={connector.id}
                        className="btn wallet-connector-btn"
                        onClick={() => handleConnect(connector)}
                        disabled={isPending || isAuthenticating}
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
          )}

          {error && !isAuthenticating && (
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
