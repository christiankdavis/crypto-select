import React, { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { TOKENS } from "../constants/tokens";
import "./AmountInput.css";

export interface AmountInputProps {
  usdValue: number;
  tokenSymbol: string;
  tokenAmount: number;
  onUsdChange: Dispatch<SetStateAction<number>>;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  usdValue,
  tokenSymbol,
  tokenAmount,
  onUsdChange,
}) => {
  const [text, setText] = useState<string>(usdValue.toString());
  useEffect(() => {
    setText(usdValue === 0 ? "" : usdValue.toString());
  }, [usdValue]);

  const stepperRef = useRef<number | null>(null);

  // dynamic font size
  const displayStr = text || "0";
  const MAX_SIZE = 48;
  const MIN_SIZE = 30;
  const THRESHOLD = 6;
  const SHRINK_PER_CHAR = 3;
  const extra = Math.max(0, displayStr.length - THRESHOLD);
  const fontSize = Math.max(MIN_SIZE, MAX_SIZE - extra * SHRINK_PER_CHAR);

  // Stop any ongoing interval
  const stopStepping = () => {
    if (stepperRef.current !== null) {
      clearInterval(stepperRef.current);
      stepperRef.current = null;
    }
  };

  // continuous stepping
  const startStepping = (delta: number) => {
    // do one immediate step
    onUsdChange((v) => Math.max(0, v + delta));
    // then start interval
    stopStepping();
    stepperRef.current = window.setInterval(() => {
      onUsdChange((v) => Math.max(0, v + delta));
    }, 150);
  };

  // ensure we clear on global mouseup (covers right‐click, context menu, etc.)
  useEffect(() => {
    document.addEventListener("mouseup", stopStepping);
    document.addEventListener("mouseleave", stopStepping);
    document.addEventListener("contextmenu", stopStepping);
    return () => {
      document.removeEventListener("mouseup", stopStepping);
      document.removeEventListener("mouseleave", stopStepping);
      document.removeEventListener("contextmenu", stopStepping);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setText(v);
    if (v !== "") {
      const num = Number(v);
      if (!isNaN(num)) onUsdChange(num);
    }
  };
  const handleBlur = () => {
    if (text === "") {
      setText("0");
      onUsdChange(0);
    }
  };

  // Find token for preview
  const token = TOKENS.find((t) => t.symbol === tokenSymbol)!;

  return (
    <div className="amount-input">
      <div className="amount-input__box">
        <div className="amount-input__usd-row">
          <span className="amount-input__usd-prefix">$</span>
          <input
            type="number"
            className="amount-input__usd-input"
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0"
            min="0"
            step="1"
            style={{ fontSize: `${fontSize}px` }}
          />

          <div className="amount-input__steppers">
            <button
              type="button"
              className="stepper-button"
              onMouseDown={() => startStepping(1)}
            >
              ▲
            </button>
            <button
              type="button"
              className="stepper-button"
              onMouseDown={() => startStepping(-1)}
            >
              ▼
            </button>
          </div>
        </div>

        <div className="amount-input__preview">
          <div className="amount-input__preview-usd">USD</div>
          <div className="amount-input__preview-token">
            <div className="amount-input__preview-token__value">
              {`${tokenAmount.toFixed(5)} `}
            </div>
            <div className="amount-input__preview-token__symbol">
              {token.symbol}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
