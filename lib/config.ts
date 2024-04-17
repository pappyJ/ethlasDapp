import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';

const projectId = 'fc464cbd4f0304fbce469a5b39cd9561';

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected(), walletConnect({ projectId })],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
