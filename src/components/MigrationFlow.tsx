import React, { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  Connector,
} from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { youmioMainnet, youmioTestnet } from "../wagmi/chain";
import { youmioSbtAbi } from "../utils/contract/abis/youmioSbt";
import "./pages/mainnet.css";

// Define TypeScript interfaces
interface MigrationFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

type MigrationStep = "connect" | "eligibility" | "mint" | "success" | "error";

const MigrationFlow: React.FC<MigrationFlowProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<MigrationStep>("connect");
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenId, setTokenId] = useState<bigint | null>(null);

  const { address, isConnected } = useAccount();
  const {
    connectors,
    connect,
    isPending: isConnecting,
    error: connectError,
  } = useConnect();
  const {
    writeContract,
    data: hash,
    isPending: isMinting,
    error: mintError,
  } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Check testnet SBT balance
  const { data: testnetBalance, isLoading: isTestnetBalanceLoading } =
    useReadContract({
      address: import.meta.env
        .VITE_TESTNET_SBT_CONTRACT_ADDRESS as `0x${string}`,
      abi: youmioSbtAbi,
      functionName: "balanceOf",
      args: [address!],
      chainId: youmioTestnet.id,
      query: {
        enabled: isConnected && currentStep !== "connect",
      },
    });

  // Check mainnet SBT balance
  const { data: mainnetBalance, isLoading: isMainnetBalanceLoading } =
    useReadContract({
      address: import.meta.env.VITE_SBT_CONTRACT_ADDRESS as `0x${string}`,
      abi: youmioSbtAbi,
      functionName: "balanceOf",
      args: [address!],
      chainId: youmioMainnet.id,
      query: {
        enabled: isConnected && currentStep !== "connect",
      },
    });

  // Fetch signature for minting
  const {
    data: signatureData,
    isLoading: isSignatureLoading,
    error: signatureError,
  } = useQuery({
    queryKey: ["signature", address],
    queryFn: async () => {
      const response = await fetch("/api/v1/signature/take", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch signature");
      }

      return response.json();
    },
    enabled: currentStep === "mint" && isConnected,
  });

  // Handle connection
  const handleConnect = async (connector: Connector) => {
    try {
      connect({ connector });
    } catch (error: unknown) {
      console.error("Connection error:", error);
      setErrorMessage("Failed to connect wallet");
      setCurrentStep("error");
    }
  };

  // Check eligibility when wallet is connected
  useEffect(() => {
    if (isConnected && currentStep === "connect") {
      setCurrentStep("eligibility");
    }
  }, [isConnected, currentStep]);

  // Check eligibility results
  useEffect(() => {
    if (
      currentStep === "eligibility" &&
      !isTestnetBalanceLoading &&
      !isMainnetBalanceLoading
    ) {
      // User is eligible if they have a testnet SBT and no mainnet SBT
      const isEligible =
        testnetBalance !== undefined &&
        testnetBalance > 0n &&
        (mainnetBalance === undefined || mainnetBalance === 0n);

      if (isEligible) {
        setCurrentStep("mint");
      } else {
        setErrorMessage(
          "You are not eligible for migration. You need to have a testnet SBT and no mainnet SBT."
        );
        setCurrentStep("error");
      }
    }
  }, [
    currentStep,
    testnetBalance,
    mainnetBalance,
    isTestnetBalanceLoading,
    isMainnetBalanceLoading,
  ]);

  // Handle minting
  const handleMint = async () => {
    if (!signatureData || !address) return;

    try {
      writeContract({
        address: import.meta.env.VITE_SBT_CONTRACT_ADDRESS as `0x${string}`,
        abi: youmioSbtAbi,
        functionName: "take",
        args: [signatureData.from, signatureData.signature],
        chainId: youmioMainnet.id,
      });
    } catch (error: unknown) {
      console.error("Minting error:", error);
      setErrorMessage("Failed to initiate minting");
      setCurrentStep("error");
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      // TODO: Fetch the actual token ID after minting
      setTokenId(1n);
      setCurrentStep("success");
    }

    if (mintError) {
      setErrorMessage(mintError.message || "Failed to mint SBT");
      setCurrentStep("error");
    }
  }, [isConfirmed, hash, mintError]);

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
      <div className="modal-content migration-flow">
        <div className="modal-header">
          <h2 className="modal-title">Migrate to Mainnet</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Step 1: Connect Wallet */}
          {currentStep === "connect" && (
            <div className="migration-step">
              <h3>Connect Your Wallet</h3>
              <p className="modal-description">
                Please connect your wallet to begin the migration process.
              </p>

              <div className="wallet-connectors">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    className="btn wallet-connector-btn"
                    onClick={() => handleConnect(connector)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <span className="loading-spinner"></span>
                    ) : null}
                    <span>{connector.name}</span>
                  </button>
                ))}
              </div>

              {connectError && (
                <div className="error-message">
                  <p>Error: {connectError.message}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Check Eligibility */}
          {currentStep === "eligibility" && (
            <div className="migration-step">
              <h3>Checking Eligibility</h3>
              <p className="modal-description">
                Verifying your testnet SBT status...
              </p>

              {isTestnetBalanceLoading || isMainnetBalanceLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <div className="eligibility-result">
                  <div className="sbt-card testnet">
                    <img src="/testnet-sbt.png" alt="Testnet SBT" />
                    <div className="overlay">
                      {testnetBalance !== undefined && testnetBalance > 0n ? (
                        <span className="eligible">Eligible</span>
                      ) : (
                        <span className="not-eligible">Not Eligible</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Mint Mainnet SBT */}
          {currentStep === "mint" && (
            <div className="migration-step">
              <h3>Mint Mainnet SBT</h3>
              <p className="modal-description">
                You are eligible for migration. Click below to mint your mainnet
                SBT.
              </p>

              <div className="sbt-card mainnet">
                <img src="/mainnet-sbt.png" alt="Mainnet SBT" />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleMint}
                disabled={isMinting || isSignatureLoading}
              >
                {isMinting || isSignatureLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Processing...
                  </>
                ) : (
                  "Mint SBT"
                )}
              </button>

              {signatureError && (
                <div className="error-message">
                  <p>Error: {signatureError.message}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === "success" && (
            <div className="migration-step success-step">
              <h3>Migration Successful!</h3>
              <p className="modal-description">
                Congratulations! Your mainnet SBT has been minted successfully.
              </p>

              <div className="sbt-card mainnet success">
                <img src="/mainnet-sbt.png" alt="Mainnet SBT" />
                <div className="token-id">
                  Token ID: {tokenId?.toString() || "..."}
                </div>
              </div>

              <button className="btn btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          )}

          {/* Error State */}
          {currentStep === "error" && (
            <div className="migration-step error-step">
              <h3>Migration Failed</h3>
              <p className="modal-description">{errorMessage}</p>

              <button
                className="btn btn-secondary"
                onClick={() => setCurrentStep("connect")}
              >
                Try Again
              </button>

              <button className="btn btn-outline" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MigrationFlow;
