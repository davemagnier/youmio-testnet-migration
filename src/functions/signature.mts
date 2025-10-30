import { Config, Context } from "@netlify/functions";
import { Hono } from "hono";
import {
  signMintMessageSignature,
  signTakeSignature,
} from "../utils/signature.ts";
import { Address, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hashChatMessage } from "../utils/hash.ts";
import { sessionAuth } from "../utils/middlewares.ts";
import { SessionData } from "../utils/auth-store.ts";
import { encryptMessage, setMessageData } from "../utils/message-store.ts";
import { getBalance, getTokenOwner } from "../utils/contract/sbt.ts";
import { getCurrentEpoch } from "../utils/time.ts";
import { youmioMainnet, youmioTestnet } from "../wagmi/chain.ts";
import { error } from "console";

// Mainnet configuration
const mainnetChainId = youmioMainnet.id;
const mainnetSbtContractAddress = Netlify.env.get("SBT_CONTRACT") as Address;
const SbtContractName = Netlify.env.get("SBT_CONTRACT_NAME");
const SbtContractVersion = Netlify.env.get("SBT_CONTRACT_VERSION");
const sbtAuthPrivateKey = Netlify.env.get("SBT_AUTH_PRIVATE_KEY") as Hex;
const messageAuthPrivateKey = Netlify.env.get(
  "MESSAGE_AUTH_PRIVATE_KEY",
) as Hex;
const encryptionKey = Netlify.env.get("ENCRYPTION_KEY");
const mainnetRpcUrl = youmioMainnet.rpcUrls.default.http[0] as string;

// Testnet configuration
const testnetChainId = youmioTestnet.id;
const testnetSbtContractAddress = Netlify.env.get(
  "TESTNET_SBT_CONTRACT",
) as Address;
const testnetRpcUrl = youmioTestnet.rpcUrls.default.http[0] as string;

if (
  !mainnetSbtContractAddress ||
  !SbtContractName ||
  !SbtContractVersion ||
  !sbtAuthPrivateKey ||
  !messageAuthPrivateKey ||
  !encryptionKey ||
  !mainnetRpcUrl
) {
  throw new Error("One or more required environment variables are not set");
}

type Variables = {
  session: SessionData | undefined;
};

const app = new Hono<{ Variables: Variables }>()
  .basePath("/api/v1/signature")
  .use("*", sessionAuth);

app.get("/", (c) => c.json({ message: "Youmio signatures API v1" }));
app.get("/take", async (c) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Check mainnet balance - user should NOT have a mainnet SBT to be eligible
  const mainnetBalance = await getBalance(
    session.walletAddress,
    mainnetSbtContractAddress,
    mainnetChainId,
    mainnetRpcUrl,
  );
  if (mainnetBalance !== 0n) {
    return c.json({ error: "Already minted mainnet SBT" }, 400);
  }

  // Check testnet balance - user MUST have a testnet SBT to be eligible
  const testnetBalance = await getBalance(
    session.walletAddress,
    testnetSbtContractAddress,
    testnetChainId,
    testnetRpcUrl,
  );
  if (testnetBalance === 0n) {
    return c.json({ error: "No testnet SBT found" }, 400);
  }

  const from = privateKeyToAccount(sbtAuthPrivateKey);

  const data = await signTakeSignature({
    contractName: SbtContractName,
    contractVersion: SbtContractVersion,
    chainId: mainnetChainId,
    contractAddress: mainnetSbtContractAddress,
    from,
    to: session.walletAddress,
  });

  return c.json({
    from: from.address,
    signature: data.signature,
    walletAddress: session.walletAddress,
    contract: mainnetSbtContractAddress,
    chainId: mainnetChainId,
  });
});

app.get("/mint", async (c) => {
  return c.json({ error: "Not found" }, 404);
  const session = c.get("session");
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { tokenId, message } = c.req.query();
  if (tokenId === undefined || message === undefined) {
    return c.json({ error: "tokenId and message are required" }, 400);
  }

  const tokenOwner = await getTokenOwner(
    BigInt(tokenId),
    mainnetSbtContractAddress,
    mainnetChainId,
    mainnetRpcUrl,
  );
  if (tokenOwner.toLowerCase() !== session.walletAddress.toLowerCase()) {
    return c.json({ error: "Session does not own this token" }, 401);
  }

  const messageHash = hashChatMessage(message, session.walletAddress);
  const encryptedMessage = await encryptMessage(encryptionKey, message);
  await setMessageData(messageHash, {
    encryptedMessage: encryptedMessage.ciphertext,
    iv: encryptedMessage.iv,
    owner: session.walletAddress,
    minted: false,
    mintedAt: getCurrentEpoch(),
  });

  const { signature } = await signMintMessageSignature({
    privateKey: messageAuthPrivateKey,
    contractName: SbtContractName,
    contractVersion: SbtContractVersion,
    chainId: mainnetChainId,
    contractAddress: mainnetSbtContractAddress,
    owner: session.walletAddress,
    tokenId: BigInt(tokenId),
    message: messageHash,
  });

  return c.json({
    signature,
    walletAddress: session.walletAddress,
    contract: mainnetSbtContractAddress,
    chainId: mainnetChainId,
    tokenId,
    message: messageHash,
  });
});

export default async (request: Request, context: Context) => {
  return app.fetch(request, context);
};

export const config: Config = {
  path: "/api/v1/signature/*",
};
