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
    iconPath: "/assets/icons/usdc.svg",
  },
  {
    symbol: "USDT",
    name: "Tether",
    chainId: 137,
    iconPath: "/assets/icons/usdt.svg",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    chainId: 8453,
    iconPath: "/assets/icons/eth.svg",
  },
  {
    symbol: "WBTC",
    name: "Wrapped BTC",
    chainId: 1,
    iconPath: "/assets/icons/wbtc.svg",
  },

  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    chainId: 1,
    iconPath: "/assets/icons/dai.svg",
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    chainId: 1,
    iconPath: "/assets/icons/uni.svg",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    chainId: 1,
    iconPath: "/assets/icons/link.svg",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    chainId: 137,
    iconPath: "/assets/icons/matic.svg",
  },
  {
    symbol: "AAVE",
    name: "Aave",
    chainId: 1,
    iconPath: "/assets/icons/aave.svg",
  },
];
