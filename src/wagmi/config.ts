import { youmio } from "./chain";
import { createConfig, http } from "wagmi";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
	chains: [youmio],
	transports: {
		[youmio.id]: http(),
	},
	connectors: [injected(), metaMask()],
});
