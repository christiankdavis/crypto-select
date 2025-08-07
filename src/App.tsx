import { useTheme } from "./context/ThemeContext";
import "./App.css";

export const App = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Token Price Explorer</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          Switch to {theme === "light" ? "dark" : "light"} mode
        </button>
      </header>
    </div>
  );
};

export default App;
