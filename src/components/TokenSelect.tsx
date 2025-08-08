import React, { useState, useRef, useEffect } from "react";
import { TOKENS } from "../constants/tokens";
import "./TokenSelect.css";

const DEFAULT_ICON = "/favicon.png";

export interface TokenSelectProps {
  label?: string;
  selected: string;
  onChange: (symbol: string) => void;
}

export const TokenSelect: React.FC<TokenSelectProps> = ({
  label,
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const current = TOKENS.find((t) => t.symbol === selected)!;

  const handleIconError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    // Prevent infinite loop if default also fails
    e.currentTarget.onerror = null;
    e.currentTarget.src = DEFAULT_ICON;
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        open &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="token-select" ref={wrapperRef}>
      {label && <div className="token-select__heading">{label}</div>}

      <button
        className={`token-select__trigger${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <img
          src={current.iconPath}
          alt={current.symbol}
          onError={handleIconError}
          className="token-select__icon"
        />
        <span className="token-select__label">{`${current.name} (${current.symbol})`}</span>
        <svg
          className="token-select__chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul className="token-select__menu">
          {[...TOKENS]
            .sort((a, b) =>
              a.symbol.localeCompare(b.symbol, undefined, {
                sensitivity: "base",
              })
            )
            .map((token) => (
              <li
                key={token.symbol}
                className="token-select__option"
                onClick={() => {
                  onChange(token.symbol);
                  setOpen(false);
                }}
              >
                <img
                  src={token.iconPath}
                  alt={token.symbol}
                  onError={handleIconError}
                  className="token-select__icon"
                />
                <span className="token-select__label">{`${token.name} (${token.symbol})`}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
