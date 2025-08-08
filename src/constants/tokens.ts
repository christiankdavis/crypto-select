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
    iconPath: "src/assets/icons/usdc-logo.png",
  },
  {
    symbol: "USDT",
    name: "Tether",
    chainId: 137,
    iconPath: "src/assets/icons/usdt-logo.png",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    chainId: 8453,
    iconPath: "src/assets/icons/eth-logo.png",
  },
  {
    symbol: "WBTC",
    name: "Wrapped BTC",
    chainId: 1,
    iconPath: "src/assets/icons/btc-logo.png",
  },

  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    chainId: 1,
    iconPath: "src/assets/icons/dai-logo.png",
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    chainId: 1,
    iconPath: "src/assets/icons/uni-logo.png",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    chainId: 1,
    iconPath: "src/assets/icons/link-logo.png",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    chainId: 137,
    iconPath: "src/assets/icons/matic-logo.png",
  },
  {
    symbol: "AAVE",
    name: "Aave",
    chainId: 1,
    iconPath: "src/assets/icons/aave-logo.png",
  },
];
