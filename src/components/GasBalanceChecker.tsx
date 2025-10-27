import React, { useState } from "react";
import { useBalance, useAccount, useReadContract } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { youmio, youmioMainnet } from "../wagmi/chain";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/auth-context";
import "./pages/mainnet.css";
import { youmioSbtAbi } from "../utils/contract/abis/youmioSbt";

interface GasBalanceCheckerProps {
  onClaimSuccess?: () => void;
  showClaimButton?: boolean;
  variant?: "default" | "compact";
  showWarning?: boolean;
}

const GasBalanceChecker: React.FC<GasBalanceCheckerProps> = ({
  onClaimSuccess,
  showClaimButton = true,
  variant = "default",
  showWarning = true,
}) => {
  const { address, isConnected } = useAccount();
  const { session } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Check native token balance on mainnet
  const {
    data: balance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useBalance({
    address: address,
    chainId: youmioMainnet.id,
    query: {
      enabled: isConnected && !!address,
    },
  });

  const { data: sbtBalance } = useReadContract({
    chainId: youmio.id,
    address: import.meta.env.VITE_SBT_CONTRACT_ADDRESS as `0x${string}`,
    abi: youmioSbtAbi,
    functionName: "balanceOf",
    args: [address!],
    query: {
      enabled: Boolean(address),
    },
  });

  // Check if user has zero balance
  const hasZeroBalance = balance?.value === 0n;

  // Fetch cooldown status
  const {
    data: cooldownData,
    isLoading: isCooldownLoading,
    refetch: refetchCooldown,
  } = useQuery({
    queryKey: ["faucet-cooldown", session],
    queryFn: async () => {
      if (!session) {
        throw new Error("No session available");
      }

      const response = await fetch("/api/v1/faucet/cooldown", {
        headers: {
          "x-session": session,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setDisabled(true);
        throw new Error(errorData.error || "Failed to fetch cooldown status");
      }

      setDisabled(false);
      return response.json();
    },
    enabled: isConnected && !!session && hasZeroBalance,
  });

  const canClaim =
    !disabled &&
    hasZeroBalance &&
    (!cooldownData || cooldownData.nextClaimIn <= 0);

  const handleClaimGas = async () => {
    if (!session || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsClaiming(true);

    try {
      const response = await fetch("/api/v1/faucet/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session": session,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Gas claim request submitted! You'll receive gas shortly.",
        );
        // Refetch balance after claim
        setTimeout(() => {
          refetchBalance();
          refetchCooldown();
        }, 2000);

        if (onClaimSuccess) {
          onClaimSuccess();
        }
      } else {
        if (data.error === "NOT_ALLOWLISTED") {
          toast.error("You are not allowlisted for the faucet.");
        } else if (data.error === "Cannot claim") {
          toast.error(
            `Please wait ${data.nextClaimIn} seconds before claiming again.`,
          );
        } else {
          toast.error(data.error || "Failed to claim gas. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error claiming gas:", error);
      toast.error("Failed to claim gas. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  // Don't render anything if not connected or if balance is sufficient
  if (!isConnected || !address || (!isBalanceLoading && !hasZeroBalance)) {
    return null;
  }

  // For compact variant, only show the button without any text
  if (variant === "compact") {
    return (
      <>
        {sbtBalance !== 0n ? null : isBalanceLoading ? (
          <div className="loading-spinner"></div>
        ) : hasZeroBalance && showClaimButton ? (
          <button
            className="btn btn-primary claim-gas-btn compact"
            style={{
              padding: "0.75rem 1.25rem",
            }}
            onClick={handleClaimGas}
            disabled={disabled || isClaiming || isCooldownLoading || !canClaim}
            title="Claim gas for transactions"
          >
            {isClaiming ? (
              <span className="loading-spinner"></span>
            ) : isCooldownLoading ? (
              "Loading..."
            ) : !canClaim && cooldownData?.nextClaimIn > 0 ? (
              `${cooldownData.nextClaimIn}s`
            ) : disabled ? (
              "Not Eligible"
            ) : (
              "Claim Gas"
            )}
          </button>
        ) : null}
      </>
    );
  }

  return (
    <>
      {isBalanceLoading ? (
        <div className="loading-spinner"></div>
      ) : hasZeroBalance ? (
        <div className="zero-balance-warning">
          {showWarning && (
            <p className="warning-text">
              ! You have zero gas balance. You need gas to complete
              transactions.
            </p>
          )}

          {showClaimButton && (
            <button
              className="btn btn-primary wallet-connect-btn"
              onClick={handleClaimGas}
              disabled={
                disabled || isClaiming || isCooldownLoading || !canClaim
              }
            >
              {isClaiming ? (
                <>
                  <span className="loading-spinner"></span>
                  Claiming Gas...
                </>
              ) : disabled ? (
                "Not Eligible"
              ) : (
                "Claim Gas"
              )}
            </button>
          )}
        </div>
      ) : null}
    </>
  );
};

export default GasBalanceChecker;
