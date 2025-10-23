import { Abi, Address, Chain, createPublicClient, createWalletClient, defineChain, getContract, GetContractReturnType, Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
// Mainnet chain configuration
// TODO: Consider using dedicated RPC URL with credentials for production
export const youmioMainnet = defineChain({
  id: 688540,
  name: "Youmio Mainnet",
  nativeCurrency: { name: "Youmio", symbol: "YOU", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        // Use environment variable for RPC URL if available, fallback to default
        Netlify.env.get("MAINNET_RPC_URL") ||
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
        Netlify.env.get("TESTNET_RPC_URL") ||
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

export const chains: Record<string, Chain> = {
  youmioTestnet,
  youmioMainnet,
  sepolia
}

export function findChain(id: number): Chain | undefined {
  return Object.values(chains).find((c) => c.id === id);
}

export function getPublicClient(chainId: number, rpcUrl: string, cache = true) {
  const chain = findChain(chainId);
  if (!chain) {
    throw new Error(`Chain with ID ${chainId} not found`);
  }
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
    cacheTime: cache ? 10_000 : undefined,
  });
}

export function getWalletClient(chainId: number, rpcUrl: string, privateKey: Hex) {
  const chain = findChain(chainId);
  if (!chain) {
    throw new Error(`Chain with ID ${chainId} not found`);
  }

  return createWalletClient({
    chain,
    transport: http(rpcUrl),
    account: privateKeyToAccount(privateKey)
  });
}

export type GetPublicClientReturnType = ReturnType<typeof getPublicClient>;

export function getContractInstance<TAbi extends Abi>(
  contractAddress: Address,
  ABI: TAbi,
  chainId: number,
  rpcUrl: string,
): GetContractReturnType<TAbi, GetPublicClientReturnType> {
  const publicClient = getPublicClient(chainId, rpcUrl, false);

  return getContract({
    address: contractAddress,
    abi: ABI,
    client: publicClient,
  });
}