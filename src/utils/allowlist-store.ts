import { getStore } from "@netlify/blobs";
import { Address } from "viem";
import { getCurrentEpoch } from "./time";

export type WalletData = {
  lastClaimed?: number;
  lastMessageReset: number;
  messageCount: number;
  faucetEnabled: boolean;
};

export function getWalletStore() {
  return getStore({ name: "MainnetWallet" });
}

export async function getWalletData(walletAddress: Address) {
  const walletStore = getWalletStore();

  return (await walletStore.get(walletAddress.toLowerCase(), {
    type: "json",
  })) as WalletData | undefined;
}

export async function setWalletData(walletAddress: Address, data: WalletData) {
  const walletStore = getWalletStore();

  return walletStore.setJSON(walletAddress.toLowerCase(), data);
}

export async function removeWallet(walletAddress: Address) {
  const walletStore = getWalletStore();

  return walletStore.delete(walletAddress.toLowerCase());
}

export async function addWallets(walletAddresses: Address[], data: WalletData) {
  const walletStore = getWalletStore();

  await Promise.all(
    walletAddresses.map((walletAddress: Address) =>
      walletStore.setJSON(walletAddress.toLowerCase(), data),
    ),
  );
}

export async function removeWallets(walletAddresses: Address[]) {
  const walletStore = getWalletStore();

  await Promise.all(
    walletAddresses.map((walletAddress: Address) =>
      walletStore.delete(walletAddress.toLowerCase()),
    ),
  );
}

export async function getAllowlist() {
  const walletStore = getWalletStore();

  return walletStore.list();
}

export async function initializeUser(walletAddress: Address) {
  const walletData = await getWalletData(walletAddress);

  // Enable faucet by default
  const data = {
    lastMessageReset: walletData?.lastMessageReset ?? getCurrentEpoch(),
    faucetEnabled: walletData?.faucetEnabled ?? true,
    messageCount: walletData?.messageCount ?? 0,
    lastClaimed: walletData?.lastClaimed,
  };

  await setWalletData(walletAddress, data);

  return data;
}

