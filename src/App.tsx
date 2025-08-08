import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import { AmountDisplay } from "./components/AmountDisplay";
import { AmountInput } from "./components/AmountInput";
import { TokenSelect } from "./components/TokenSelect";
import { TOKENS } from "./constants/tokens";
import { useTheme } from "./context/ThemeContext";
import { useQuote } from "./hooks/useQuote";
import "./App.css";

export const App = () => {
  const { theme, toggleTheme } = useTheme();

  const [fromToken, setFromToken] = useState(TOKENS[7].symbol);
  const [toToken, setToToken] = useState(TOKENS[2].symbol);
  const [usdAmount, setUsdAmount] = useState(222);

  const { fromAmount, toAmount, loading, error } = useQuote(
    fromToken,
    toToken,
    usdAmount
  );

  // Show toast on error
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
    }
  }, [error]);

  // Swap handler
  const handleSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Token Price Explorer</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          Switch to {theme === "light" ? "dark" : "light"} mode
        </button>
      </header>

      <div className="selectors">
        <TokenSelect
          selected={fromToken}
          onChange={setFromToken}
          label="From"
        />
        {/* Swap button */}
        <button
          className="swap-button"
          onClick={handleSwap}
          title="Swap tokens"
        >
          ↔
        </button>
        <TokenSelect selected={toToken} onChange={setToToken} label="To" />
      </div>

      <div className="values">
        <AmountInput
          usdValue={usdAmount}
          tokenSymbol={fromToken}
          tokenAmount={fromAmount}
          onUsdChange={setUsdAmount}
        />
        <div className="values__center">
          {loading ? (
            <ClipLoader size={24} color={"var(--theme-blue)"} loading={true} />
          ) : (
            <span className="values__equals">=</span>
          )}
        </div>
        <AmountDisplay tokenAmount={toAmount} tokenSymbol={toToken} />
      </div>
      <ToastContainer hideProgressBar />
      <footer className="app-footer">Designed by Christian K Davis</footer>
    </div>
  );
};

export default App;
