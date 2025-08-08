export interface TokenInfo {
  symbol: string;
  name: string;
  chainId: number;
  iconPath: string;
}

export const TOKENS: TokenInfo[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    chainId: 1,
    iconPath: "/tokens/usdc-logo.png",
  },
  {
    symbol: "USDT",
    name: "Tether",
    chainId: 137,
    iconPath: "/tokens/usdt-logo.png",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    chainId: 8453,
    iconPath: "/tokens/eth-logo.png",
  },
  {
    symbol: "WBTC",
    name: "Wrapped BTC",
    chainId: 1,
    iconPath: "/tokens/btc-logo.png",
  },

  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    chainId: 1,
    iconPath: "/tokens/dai-logo.png",
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    chainId: 1,
    iconPath: "/tokens/uni-logo.png",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    chainId: 1,
    iconPath: "/tokens/link-logo.png",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    chainId: 137,
    iconPath: "/tokens/matic-logo.png",
  },
  {
    symbol: "AAVE",
    name: "Aave",
    chainId: 1,
    iconPath: "/tokens/aave-logo.png",
  },
];
