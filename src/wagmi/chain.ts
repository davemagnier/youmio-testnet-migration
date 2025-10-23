import { defineChain } from "viem";

// Mainnet chain configuration
// TODO: Consider using dedicated RPC URL with credentials for production
export const youmioMainnet = defineChain({
  id: 61360,
  name: "Youmio",
  nativeCurrency: { name: "Youmio", symbol: "YOU", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        // Use environment variable for RPC URL if available, fallback to default
        import.meta.env?.VITE_MAINNET_RPC_URL ||
        "https://subnets.avax.network/youmio/mainnet/rpc",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Youmioscan",
      url: "https://explorer.avax.network/youmio",
    },
  },
  testnet: false,
});

// Testnet chain configuration
// TODO: Replace with actual testnet RPC URL and consider using dedicated credentials
export const youmioTestnet = defineChain({
  id: 68854,
  name: "Youmio Testnet",
  nativeCurrency: { name: "Youmio", symbol: "YOU", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        // Use environment variable for RPC URL if available, fallback to default
        import.meta.env?.VITE_TESTNET_RPC_URL ||
        "https://subnets.avax.network/youtest/testnet/rpc",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Youmio Testnet Explorer",
      url: "https://explorer.avax.network/youtest",
    },
  },
  testnet: true,
});

// Default export for backward compatibility
export const youmio = youmioMainnet;
