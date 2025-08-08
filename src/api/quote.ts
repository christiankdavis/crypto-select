import {
  getAssetErc20ByChainAndSymbol,
  getAssetPriceInfo,
} from "@funkit/api-base";
import { TOKENS } from "../constants/tokens";

const API_KEY = "Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk";

export interface QuoteResult {
  fromAmount: number;
  toAmount: number;
}

export async function fetchQuote(
  fromSymbol: string,
  toSymbol: string,
  usdAmount: number
): Promise<QuoteResult> {
  // look up chainId & token address
  const fromToken = TOKENS.find((t) => t.symbol === fromSymbol)!;
  const toToken = TOKENS.find((t) => t.symbol === toSymbol)!;

  // first fetch token metadata to get the contract address
  const { address: fromAddr } = await getAssetErc20ByChainAndSymbol({
    chainId: fromToken.chainId.toString(),
    symbol: fromSymbol,
    apiKey: API_KEY,
  });
  const { address: toAddr } = await getAssetErc20ByChainAndSymbol({
    chainId: toToken.chainId.toString(),
    symbol: toSymbol,
    apiKey: API_KEY,
  });

  // then price info
  const { unitPrice: fromPrice } = await getAssetPriceInfo({
    chainId: fromToken.chainId.toString(),
    assetTokenAddress: fromAddr,
    apiKey: API_KEY,
  });
  const { unitPrice: toPrice } = await getAssetPriceInfo({
    chainId: toToken.chainId.toString(),
    assetTokenAddress: toAddr,
    apiKey: API_KEY,
  });

  // compute how many tokens for the USD amount
  const fromAmount = usdAmount / fromPrice;
  const toAmount = usdAmount / toPrice;

  return { fromAmount, toAmount };
}
