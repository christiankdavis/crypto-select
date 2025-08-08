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

  return (
    <div className="amount-display">
      <div className="amount-display__box">
        <div className="amount-display__value">{valueStr}</div>
        <div className="amount-display__ticker">{tokenSymbol}</div>
      </div>
    </div>
  );
};
