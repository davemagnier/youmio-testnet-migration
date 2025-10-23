import { useState } from "react";
import { toast } from "react-toastify";
import type { Address } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import { useAuth } from "../contexts/auth-context";

interface UseAuthReturn {
  authenticate: (address: Address) => Promise<boolean>;
  isAuthenticating: boolean;
  authError: string | null;
}

export const useAuthenticate = (): UseAuthReturn => {
  const { login } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { signMessageAsync } = useSignMessage();
  const { isConnected } = useAccount();

  const authenticate = async (address: Address): Promise<boolean> => {
    if (!isConnected) {
      toast("No wallet connected");
      return false;
    }
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      // Step 1: Get the authentication message from the server
      const messageResponse = await fetch(`/api/v1/auth/message/${address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!messageResponse.ok) {
        const errorData = await messageResponse.json();
        throw new Error(
          errorData.error || "Failed to get authentication message",
        );
      }

      const { authMessage } = await messageResponse.json();

      // Step 2: Prompt user to sign the message
      const signature = await signMessageAsync({ message: authMessage });

      // Step 3: Send the signed message to the server to get a session
      const sessionResponse = await fetch(`/api/v1/auth/session/${address}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: authMessage,
          signature,
        }),
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json();
        throw new Error(errorData.error || "Failed to authenticate");
      }

      const { sessionId } = await sessionResponse.json();

      // Step 4: Save the session
      login(address, sessionId);

      setIsAuthenticating(false);
      return true;
    } catch (error) {
      console.error("Authentication error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error occurred during authentication";
      setAuthError(errorMessage);
      setIsAuthenticating(false);
      return false;
    }
  };

  return {
    authenticate,
    isAuthenticating,
    authError,
  };
};
