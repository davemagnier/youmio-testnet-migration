import { defineChain } from "viem";

export const youmio = defineChain({
	id: 68854,
	name: "Youmio",
	nativeCurrency: { name: "Youmio", symbol: "YOU", decimals: 18 },
	rpcUrls: {
		default: { http: ["https://subnets.avax.network/youmio/mainnet/rpc"] },
	},
	blockExplorers: {
		default: {
			name: "Youmioscan",
			url: "https://explorer.avax.network/youmio",
		},
	},
});
