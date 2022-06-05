import axios from "axios";
import { useState, useCallback } from "react";

const useCompareTexts = () => {
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState({});

  const compareTexts = useCallback((text, model) => {
    setIsComparing(true);
    axios
      .post("/compare/", {
        text,
        model,
      })
      .then((res) => {
        setComparisonResults({ ...res.data });
      })
      .finally(() => setIsComparing(false));
  }, []);

  return { isComparing, comparisonResults, compareTexts };
};

export default useCompareTexts;