import {
  type Abi,
  type Address,
  type Chain,
  createPublicClient,
  createWalletClient,
  type GetContractReturnType,
  getContract,
  type Hex,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { youmioMainnet, youmioTestnet } from "../wagmi/chain";

export const chains: Record<string, Chain> = {
  youmioMainnet,
  youmioTestnet,
  sepolia,
};

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

export function getWalletClient(
  chainId: number,
  rpcUrl: string,
  privateKey: Hex,
) {
  const chain = findChain(chainId);
  if (!chain) {
    throw new Error(`Chain with ID ${chainId} not found`);
  }

  return createWalletClient({
    chain,
    transport: http(rpcUrl),
    account: privateKeyToAccount(privateKey),
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
