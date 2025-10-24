import type React from "react";
import { useState, useEffect } from "react";
import WalletConnect from "../WalletConnectModal.tsx";
import MigrationFlow from "../MigrationFlow.tsx";
import GasBalanceChecker from "../GasBalanceChecker";
import { useAccount, useDisconnect } from "wagmi";
import "./mainnet.css";

// Helper function to truncate wallet addresses
const truncateAddress = (address: string | undefined): string => {
  if (!address) return "Connect Wallet";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const MainnetPage: React.FC = () => {
  const [starsModalActive, setStarsModalActive] = useState(false);
  const [imageModalActive, setImageModalActive] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageLabel, setModalImageLabel] = useState("");
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [migrationFlowOpen, setMigrationFlowOpen] = useState(false);

  // Wallet connection hooks
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Function to open stars modal
  const openStarsModal = () => {
    setStarsModalActive(true);
  };

  // Function to close stars modal
  const closeStarsModal = () => {
    setStarsModalActive(false);
  };

  // Function to open image modal
  const openImageModal = (imageSrc: string, imageLabel: string) => {
    setModalImageSrc(imageSrc);
    setModalImageLabel(imageLabel);
    setImageModalActive(true);
  };

  // Function to close image modal
  const closeImageModal = () => {
    setImageModalActive(false);
  };

  // Handle modal closing when clicking outside or pressing escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeStarsModal();
        closeImageModal();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("modal")) {
        closeStarsModal();
      }
      if (target.classList.contains("image-modal")) {
        closeImageModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Create sparkles effect
  useEffect(() => {
    const createSparkle = () => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 3}s`;
      sparkle.style.animationDuration = `${Math.random() * 3 + 2}s`;
      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 5000);
    };

    const interval = setInterval(createSparkle, 800);

    // Create initial sparkles
    for (let i = 0; i < 15; i++) {
      setTimeout(createSparkle, i * 100);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Sticky Header */}
      <div className="sticky-header">
        <div className="header-content">
          <div className="logo">
            <img src="/youmio-logo.png" alt="Youmio" />
          </div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
            }}
          >
            {isConnected && (
              <GasBalanceChecker
                variant="compact"
                showClaimButton={true}
                showWarning={false}
              />
            )}
            <button
              className="wallet-connect-btn"
              onClick={() =>
                isConnected ? disconnect() : setWalletModalOpen(true)
              }
            >
              {isConnected ? (
                <span className="wallet-btn-content">
                  <span className="wallet-address">
                    {truncateAddress(address)}
                  </span>
                  <span className="wallet-disconnect-text">Disconnect</span>
                </span>
              ) : (
                "Connect Wallet"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <WalletConnect
          isOpen={walletModalOpen}
          onClose={() => setWalletModalOpen(false)}
        />

        <MigrationFlow
          isOpen={migrationFlowOpen}
          onClose={() => setMigrationFlowOpen(false)}
        />

        {/* Hero Section */}
        <div className="hero">
          <div className="phase-badge">PHASE 1 COMPLETE ✓</div>
          <h1>Youmio Chain Mainnet</h1>
          <p className="subtitle">
            A milestone achieved by our incredible community
          </p>
        </div>

        {/* Migration Section */}
        <div className="migration-section">
          <div style={{ textAlign: "center" }}>
            <div className="migration-badge">
              ⚡ ACTION REQUIRED - FINAL STEP ⚡
            </div>
          </div>

          <div className="migration-grid">
            <div className="sbt-card testnet">
              <img
                src="/testnet-sbt.png"
                alt="Youmio Testnet SBT"
                onClick={() =>
                  openImageModal("/testnet-sbt.png", "Youmio Mainnet SBT")
                }
              />
              <div className="label">Current</div>
              <div className="network">Testnet</div>
            </div>

            <div className="migration-center">
              <div className="migration-header">
                <h3>Complete Your Testnet Journey</h3>
                <p>
                  Migrate your Testnet participation badge to Mainnet now and
                  secure your position for maximum opportunities.
                </p>
              </div>

              <div className="arrow-container">
                <div className="arrow-flow">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient
                        id="arrowGradient1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#8b5cf6", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#ec4899", stopOpacity: 1 }}
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 20 50 L 65 50 M 55 35 L 70 50 L 55 65"
                      stroke="url(#arrowGradient1)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient
                        id="arrowGradient2"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#8b5cf6", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#ec4899", stopOpacity: 1 }}
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 20 50 L 65 50 M 55 35 L 70 50 L 55 65"
                      stroke="url(#arrowGradient2)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient
                        id="arrowGradient3"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#8b5cf6", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#ec4899", stopOpacity: 1 }}
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 20 50 L 65 50 M 55 35 L 70 50 L 55 65"
                      stroke="url(#arrowGradient3)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="arrow-particles">
                    <div className="arrow-particle"></div>
                    <div className="arrow-particle"></div>
                    <div className="arrow-particle"></div>
                    <div className="arrow-particle"></div>
                  </div>
                </div>
              </div>

              <div className="migration-content">
                <button
                  className="btn-migrate"
                  onClick={() => setMigrationFlowOpen(true)}
                >
                  <span style={{ position: "relative", zIndex: 1 }}>
                    Migrate Badge to Mainnet
                  </span>
                  <svg
                    style={{ position: "relative", zIndex: 1 }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="final-step-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  Final Step to Maximize Opportunities
                </div>
              </div>
            </div>

            <div className="sbt-card mainnet">
              <img
                src="/mainnet-sbt.png"
                alt="Youmio Mainnet SBT"
                onClick={() =>
                  openImageModal("/mainnet-sbt.png", "Youmio Mainnet SBT")
                }
              />
              <div className="label">Upgrade To</div>
              <div className="network">Mainnet</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">7M+</div>
            <div className="stat-label">Total Transactions</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">140K</div>
            <div className="stat-label">Users</div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="coming-soon-section">
          {/* Studio Card */}
          <div className="coming-soon-card studio-card">
            <div className="coming-soon-content">
              <h2>Youmio Studio Coming Soon</h2>
              <p className="subtitle-text">The AI Character Creator</p>
              <p>
                Your participation on Youmio Studio will be key to unlocking
                maximum future ecosystem rewards & to give you an early
                advantage we are gifting a pack of stars to each wallet that
                participated in the testnet.
              </p>
              <button className="btn btn-secondary" onClick={openStarsModal}>
                How do Stars work?
              </button>
            </div>
            <div className="star-box">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 45 10 L 52 32 L 75 32 L 57 45 L 64 67 L 45 54 L 26 67 L 33 45 L 15 32 L 38 32 Z"
                  fill="#ffffff"
                />
                <path
                  d="M 75 15 L 79 25 L 90 25 L 81 32 L 85 42 L 75 35 L 65 42 L 69 32 L 60 25 L 71 25 Z"
                  fill="#ffffff"
                />
              </svg>
              <div className="label">Each Tester Receives</div>
              <div className="amount">1 × TESTER STAR PACK</div>
            </div>
          </div>

          {/* Wearable Bonus Card */}
          <div className="coming-soon-card wearable-card">
            <div className="wearable-badge-top">MAINNET EXCLUSIVE</div>
            <div className="blurred-wearable-container">
              <img
                src="/wearable-bonus-blurred.png"
                alt="Tester Bonus"
                className="blurred-wearable"
              />
              <div className="overlay-text">
                <div className="overlay-title">Additional Tester Bonus</div>
                <div className="overlay-subtitle">Unlocking Soon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Section */}
        <div className="social-section">
          <div className="social-buttons">
            <a
              href="https://discord.com/invite/youmio"
              className="btn btn-discord"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0 a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                  fill="currentColor"
                />
              </svg>
              Join us on Discord
            </a>
            <a
              href="https://x.com/youmio_ai"
              className="btn btn-x"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  fill="currentColor"
                />
              </svg>
              Follow us on X
            </a>
          </div>
        </div>
      </div>

      {/* Stars Info Modal */}
      <div
        id="starsModal"
        className={`modal ${starsModalActive ? "active" : ""}`}
      >
        <div className="modal-content">
          <button className="modal-close" onClick={closeStarsModal}>
            ×
          </button>
          <h2 className="modal-title">How Stars Work</h2>
          <img
            src="/stars-infographic.png"
            alt="Stars Infographic"
            className="infographic-image"
          />
        </div>
      </div>

      {/* Image Modal */}
      <div
        id="imageModal"
        className={`image-modal ${imageModalActive ? "active" : ""}`}
      >
        <div className="image-modal-content">
          <button className="image-modal-close" onClick={closeImageModal}>
            ×
          </button>
          <img id="modalImage" src={modalImageSrc} alt={modalImageLabel} />
          <div id="modalLabel" className="image-modal-label">
            {modalImageLabel}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainnetPage;
