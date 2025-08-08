import { useState, useEffect, useRef } from "react";
import { fetchQuote } from "../api/quote";
import type { QuoteResult } from "../api/quote";

export function useQuote(
  fromSymbol: string,
  toSymbol: string,
  usdAmount: number
) {
  const [quote, setQuote] = useState<QuoteResult>({
    fromAmount: 0,
    toAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // keep track of our debounce timeout
  const debounceRef = useRef<number>(0);

  useEffect(() => {
    // clear any in‐flight debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // skip zero or missing
    if (!fromSymbol || !toSymbol || usdAmount <= 0) {
      setQuote({ fromAmount: 0, toAmount: 0 });
      return;
    }

    setLoading(true);
    setError(null);

    // schedule the actual fetch after 300ms of “quiet”
    debounceRef.current = window.setTimeout(() => {
      fetchQuote(fromSymbol, toSymbol, usdAmount)
        .then((result) => setQuote(result))
        .catch((err) => {
          console.error(err);
          setError(err.message || "Failed to fetch quote");
        })
        .finally(() => setLoading(false));
    }, 300);

    // cleanup if inputs change before 300ms
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fromSymbol, toSymbol, usdAmount]);

  return {
    fromAmount: quote.fromAmount,
    toAmount: quote.toAmount,
    loading,
    error,
  };
}
