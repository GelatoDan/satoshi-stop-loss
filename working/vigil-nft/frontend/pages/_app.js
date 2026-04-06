/**
 * _app.js — App wrapper with wagmi + RainbowKit providers
 */

import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";

import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider }   from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const IS_TESTNET = process.env.NEXT_PUBLIC_USE_TESTNET === "true";

const config = getDefaultConfig({
  appName:     "The Vigil",
  projectId:   process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains:      IS_TESTNET ? [baseSepolia] : [base],
  ssr:         true,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor:          "#C0A060",  // Gold — The Vigil brand color
            accentColorForeground: "#000000",
            borderRadius:          "small",
            fontStack:             "system",
          })}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
