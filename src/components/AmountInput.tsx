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

  const stepperRef = useRef<number>(0);

  // start repeating increment or decrement
  const startStepping = (delta: number) => {
    // do one immediate step
    onUsdChange(Math.max(0, usdValue + delta));

    // then start interval
    stepperRef.current = window.setInterval(() => {
      onUsdChange((v) => Math.max(0, v + delta));
    }, 150);
  };

  // stop repeating
  const stopStepping = () => {
    if (stepperRef.current) {
      clearInterval(stepperRef.current);
    }
  };

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
          />

          {/* continuous-stepping buttons */}
          <div className="amount-input__steppers">
            <button
              type="button"
              className="stepper-button"
              onMouseDown={() => startStepping(1)}
              onMouseUp={stopStepping}
              onMouseLeave={stopStepping}
            >
              ▲
            </button>
            <button
              type="button"
              className="stepper-button"
              onMouseDown={() => startStepping(-1)}
              onMouseUp={stopStepping}
              onMouseLeave={stopStepping}
            >
              ▼
            </button>
          </div>
        </div>

        <div className="amount-input__preview">
          <div className="amount-input__preview-usd">USD</div>
          <div className="amount-input__preview-token">
            {tokenAmount.toFixed(4)} {token.symbol}
          </div>
        </div>
      </div>
    </div>
  );
};
