import { Config, Context } from "@netlify/functions";
import { Hono } from "hono";
import { createAuthMessage, verifyAuthSignature } from "../utils/signature.ts";
import { Address, getAddress } from "viem";
import { setSessionData } from "../utils/auth-store.ts";
import { generateSessionId } from "../utils/hash.ts";
import { generateSiweNonce } from "viem/siwe";
import { getWalletData, setWalletData } from "../utils/allowlist-store.ts";
import { getCurrentEpoch } from "../utils/time.ts";
import { youmioMainnet } from "../wagmi/chain.ts";

const mainnetChainId = youmioMainnet.id;
const mainnetRpcUrl = youmioMainnet.rpcUrls.default.http[0] as string;
const domain = Netlify.env.get("DOMAIN");

if (domain === undefined) {
	throw new Error("One or more required environment variables are not set");
}

const app = new Hono().basePath("/api/v1/auth");

app.get("/", (c) => c.json({ message: "Youmio auth API v1" }));

app.get("/message/:walletAddress", async (c) => {
	const { walletAddress } = c.req.param();
	const { uri } = c.req.query();
	if (uri === undefined) {
		return c.json({ error: "uri is required" }, 400);
	}

	return c.json({
		authMessage: createAuthMessage(
			walletAddress as Address,
			mainnetChainId,
			domain,
			uri,
			generateSiweNonce(),
		),
	});
});

app.post("/session/:walletAddress", async (c) => {
	const { walletAddress } = c.req.param();
	const { message, signature } = await c.req.json();
	if (!message || !signature) {
		return c.json({ error: "message and signature are required" }, 400);
	}

	const valid = await verifyAuthSignature(
		walletAddress as Address,
		message,
		signature,
		mainnetChainId,
		mainnetRpcUrl,
	);
	if (!valid) {
		return c.json({ error: "Invalid signature" }, 401);
	}

	const sessionId = generateSessionId();

	await setSessionData(sessionId, { walletAddress: walletAddress as Address });
	await initializeUser(getAddress(walletAddress));
	return c.json({ sessionId });
});

async function initializeUser(walletAddress: Address) {
	const walletData = await getWalletData(walletAddress);
	// Lazily reset
	await setWalletData(walletAddress, {
		lastMessageReset: walletData?.lastMessageReset ?? getCurrentEpoch(),
		faucetEnabled: walletData?.faucetEnabled ?? false,
		messageCount: walletData?.messageCount ?? 0,
		lastClaimed: walletData?.lastClaimed,
	});
}

export default async (request: Request, context: Context) => {
	return app.fetch(request, context);
};

export const config: Config = {
	path: "/api/v1/auth/*",
};
