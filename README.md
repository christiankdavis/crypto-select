# Token Price Explorer

A simplified interface that allows users to select crypto tokens and see their value relative to a USD amount and another crypto token.

---

## Table of Contents

- [Token Price Explorer](#token-price-explorer)
  - [Table of Contents](#table-of-contents)
  - [Notable Features](#notable-features)
  - [Demo](#demo)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Installation](#installation)
  - [Deployment](#deployment)
  - [Libraries Used](#libraries-used)
  - [Assumptions](#assumptions)
  - [Repository Structure](#repository-structure)
  - [Theme Context](#theme-context)
  - [Tokens Constant \& Icons](#tokens-constant--icons)
  - [Color Variables](#color-variables)
  - [API Integration](#api-integration)
    - [`src/api/quote.ts`](#srcapiquotets)
    - [`src/hooks/useQuote.ts`](#srchooksusequotets)

---

## Notable Features

- **Theme switcher**: toggle between light and dark modes, with colors driven by CSS variables.
- **From/To token selectors**: easily pick source and target tokens via dropdowns with logos.
- **Swap button**: instantly swap "From" and "To" tokens.
- **Live conversion**: enter a USD amount and immediately see corresponding token amounts for both selected tokens, with dynamic font resizing.

---

## Demo

> Live demo: [https://token-price-explorer-bice.vercel.app/](https://token-price-explorer-bice.vercel.app/)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 16
- [npm](https://npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Environment Variables

Create a `.env` file in your project root with:

```env
# Vite-specific env prefix
VITE_FUNKIT_API_KEY=YOUR_API_KEY_HERE
```

> **Note**: Vite only exposes variables prefixed with `VITE_` to the client-side code.

### Installation

1. Clone the repo

   ```bash
   git clone https://github.com/christiankdavis/token-price-explorer.git
   cd token-price-explorer
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser at `http://localhost:3000` (or the port Vite reports)

---

## Deployment

This project can be deployed to Vercel, Netlify, GitHub Pages, or any static-hosting service that supports a single-page React app.

1. Ensure your **API key** is set in your deployment service’s environment variables as `VITE_FUNKIT_API_KEY`.

   - **Vercel**: Go to your project dashboard → **Settings** → **Environment Variables** → add `VITE_FUNKIT_API_KEY` with your key.

2. Build the production bundle:

   ```bash
   npm run build
   # or
   yarn build
   ```

3. Upload the contents of `dist/` (or `build/`) to your host.

---

## Libraries Used

- `@funkit/api-base` — fetch on-chain price data
- `react-toastify` — error toasts
- `react-spinners` — loading indicators

---

## Assumptions

- Users will not request quotes for more than **\$1 billion USD**. (Input supports up to $1 trillion to be safe)
- All supported tokens live on supported chains (see `TOKENS` array).
- “From” and “To” values always share the same USD amount input.

---

## Repository Structure

```
token-price-explorer/
├── public/
│   ├── favicon.png
│   └── tokens/
│       ├── eth-logo.png
│       ├── btc-logo.png
│       └── …other token PNGs…
├── src/
│   ├── api/
│   │   └── quote.ts
│   ├── components/
│   │   ├── AmountDisplay.tsx
│   │   ├── AmountDisplay.css
│   │   ├── AmountInput.tsx
│   │   ├── AmountInput.css
│   │   ├── TokenSelect.tsx
│   │   └── TokenSelect.css
│   ├── constants/
│   │   └── tokens.ts
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   └── useQuote.ts
│   ├── styles/
│   │   └── variables.css
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── .gitignore
├── package.json
└── README.md
```

---

## Theme Context

- **File**: `src/context/ThemeContext.tsx`
- Provides light/dark mode via React Context
- Synchronizes `data-theme` attribute on `<html>` to toggle CSS variables

---

## Tokens Constant & Icons

- **File**: `src/constants/tokens.ts`

- Exports an array of supported tokens:

  ```ts
  export interface TokenInfo {
    symbol: string; // e.g. "ETH"
    name: string; // e.g. "Ethereum"
    chainId: number; // e.g. 1 for Ethereum mainnet
    iconPath: string; // e.g. "/icons/eth.svg"
  }

  export const TOKENS: TokenInfo[] = [
    {
      symbol: "ETH",
      name: "Ethereum",
      chainId: 1,
      iconPath: "/tokens/eth.svg",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      chainId: 1,
      iconPath: "/tokens/btc.svg",
    },
    /* …other tokens… */
  ];
  ```

- **Icons** are PNGs in `src/assets/icons/` and referenced via `iconPath`.

---

## Color Variables

Defined in `src/styles/variables.css`:

```css
:root[data-theme="light"] {
  --bg: #ffffff;
  --surface: #f6f6f6;
  --border: #e1e4e8;
  --text-primary: #121212;
  --text-secondary: #6e7581;
  --theme-blue: #0061f2;
  --theme-orange: #e86e1e;
}
:root[data-theme="dark"] {
  --bg: #16212a;
  --surface: #1e242b;
  --border: #2a2f36;
  --text-primary: #ffffff;
  --text-secondary: #a0aab4;
  --theme-blue: #4fbcff;
  --theme-orange: #ff9500;
}
```

These CSS variables drive all colors in the UI (backgrounds, borders, text, accents).

---

## API Integration

### `src/api/quote.ts`

Contains low-level calls to \`\`:

```ts
import {
  getAssetErc20ByChainAndSymbol,
  getAssetPriceInfo,
} from "@funkit/api-base";
import { TOKENS } from "../constants/tokens";

const API_KEY = "YOUR_API_KEY";

export interface QuoteResult {
  fromAmount: number;
  toAmount: number;
}

export async function fetchQuote(
  fromSymbol: string,
  toSymbol: string,
  usdAmount: number
): Promise<QuoteResult> {
  const fromToken = TOKENS.find((t) => t.symbol === fromSymbol)!;
  const toToken = TOKENS.find((t) => t.symbol === toSymbol)!;

  // lookup token addresses
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

  // fetch current unit prices
  const { unitPrice: fromUnitPrice } = await getAssetPriceInfo({
    chainId: fromToken.chainId.toString(),
    assetTokenAddress: fromAddr,
    apiKey: API_KEY,
  });
  const { unitPrice: toUnitPrice } = await getAssetPriceInfo({
    chainId: toToken.chainId.toString(),
    assetTokenAddress: toAddr,
    apiKey: API_KEY,
  });

  return {
    fromAmount: usdAmount / fromUnitPrice,
    toAmount: usdAmount / toUnitPrice,
  };
}
```

### `src/hooks/useQuote.ts`

A custom React hook that:

1. **Debounces** calls to `fetchQuote` by 300ms
2. **Manages** loading & error state
3. **Returns** `{ fromAmount, toAmount, loading, error }` for your UI

Usage in `App.tsx`:

```tsx
const { fromAmount, toAmount, loading, error } = useQuote(
  fromToken,
  toToken,
  usdAmount
);
```

---
