// src/index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'

// 🌐 OnchainKit + Wagmi imports (all at top)
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

// 🔑 pull env-vars
const PROJECT_ID     = process.env.REACT_APP_CDP_PROJECT_ID
const API_KEY_ID     = process.env.REACT_APP_CDP_API_KEY_ID
const API_KEY_SECRET = process.env.REACT_APP_CDP_API_KEY_SECRET

// ⚙️ define Base mainnet chain
const baseChain = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://mainnet.base.org'] } },
  blockExplorers: {
    default: { name: 'Base Explorer', url: 'https://base.blockscout.com' },
  },
}

// 🔧 configure chains + providers
const { chains, provider, webSocketProvider } = configureChains(
  [baseChain],
  [publicProvider()]
)

// 🔑 set up connectors (OnchainKit under the hood uses Wagmi + RainbowKit)
const { connectors } = getDefaultWallets({
  appName: 'Share-a-Care',
  chains,
  projectId: PROJECT_ID,
})

// 🕸 create Wagmi client
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

// 🚀 render
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <OnchainKitProvider
        projectId={PROJECT_ID}
        apiKeyId={API_KEY_ID}
        apiKeySecret={API_KEY_SECRET}
        initialChainId={8453} // Base mainnet
      >
        <App />
      </OnchainKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)

reportWebVitals()
