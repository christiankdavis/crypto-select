import { useState } from "react";
import { TokenSelect } from "./components/TokenSelect";
import { TOKENS } from "./constants/tokens";
import { useTheme } from "./context/ThemeContext";
import "./App.css";

export const App = () => {
  const { theme, toggleTheme } = useTheme();

  // Page state
  const [fromToken, setFromToken] = useState(TOKENS[3].symbol); // default "BTC"
  const [toToken, setToToken] = useState(TOKENS[2].symbol); // default "ETH"

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
        <button className="swap-button" onClick={handleSwap}>
          ↔
        </button>
        <TokenSelect selected={toToken} onChange={setToToken} label="To" />
      </div>
    </div>
  );
};

export default App;
