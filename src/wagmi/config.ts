import { youmioMainnet, youmioTestnet } from "./chain";
import { createConfig, http } from "wagmi";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
	chains: [youmioMainnet, youmioTestnet],
	transports: {
		[youmioMainnet.id]: http(),
		[youmioTestnet.id]: http(),
	},
	connectors: [injected(), metaMask()],
});
