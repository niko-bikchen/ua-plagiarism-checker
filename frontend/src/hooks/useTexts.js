import axios from "axios";
import { useState, useCallback } from "react";

const useTexts = () => {
  const [fetchingTexts, setFetchingTexts] = useState(false);

  const fetchTexts = useCallback((setTexts) => {
    setFetchingTexts(true);
    axios
      .get("/texts/")
      .then((res) => {
        setTexts([...res.data.texts]);
      })
      .finally(() => setFetchingTexts(false));
  }, []);

  return { fetchingTexts, fetchTexts };
};

export default useTexts;
