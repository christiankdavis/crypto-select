import React from "react";
import "./AmountDisplay.css";

export interface AmountDisplayProps {
  tokenAmount: number;
  tokenSymbol: string;
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({
  tokenAmount,
  tokenSymbol,
}) => {
  // convert to fixed‐precision string
  const valueStr = tokenAmount.toFixed(5);

  // dynamic font size
  const MAX_SIZE = 48;
  const MIN_SIZE = 24;
  const THRESHOLD = 6;
  const SHRINK_PER_CHAR = 2;
  const extraChars = Math.max(0, valueStr.length - THRESHOLD);
  const fontSize = Math.max(MIN_SIZE, MAX_SIZE - extraChars * SHRINK_PER_CHAR);

  return (
    <div className="amount-display">
      <div className="amount-display__box">
        <div
          className="amount-display__value"
          style={{ fontSize: `${fontSize}px` }}
        >
          {valueStr}
        </div>
        <div className="amount-display__ticker">{tokenSymbol}</div>
      </div>
    </div>
  );
};
