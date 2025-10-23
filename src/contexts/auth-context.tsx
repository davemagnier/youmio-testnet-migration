import type React from "react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Address } from "viem";
import { useSession } from "../hooks/use-session";
import { useAccount } from "wagmi";

// Define types for our authentication context
interface AuthContextType {
  session: string | null;
  login: (walletAddress: Address, sessionId: string) => void;
  logout: () => void;
  isAuthenticating: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { session, saveSession } = useSession();
  const [walletAddress, setWalletAddress] = useState<Address | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (!isConnected || address !== walletAddress) {
      logout();
    }
  }, [address, walletAddress, isConnected]);

  const login = (address: Address, sessionId: string) => {
    saveSession(sessionId);
    setWalletAddress(address);
    setIsAuthenticating(false);
  };

  const logout = () => {
    saveSession(null);
    setWalletAddress(null);
  };

  const value = {
    session,
    login,
    logout,
    isAuthenticating,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
