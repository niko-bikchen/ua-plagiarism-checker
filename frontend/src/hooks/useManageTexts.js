import axios from "axios";
import { useState, useCallback } from "react";

const useTexts = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const addText = useCallback((setTexts, newText) => {
    setIsProcessing(true);
    axios
      .post("/texts/", {
        text: newText,
      })
      .then(() => axios.get("/texts/"))
      .then((res) => setTexts([...res.data.texts]))
      .finally(() => setIsProcessing(false));
  }, []);

  const deleteText = useCallback((setTexts, slug) => {
    setIsProcessing(true);
    axios
      .delete(`/texts/${slug}`)
      .then(() => axios.get("/texts/"))
      .then((res) => setTexts([...res.data.texts]))
      .finally(() => setIsProcessing(false));
  }, []);

  return { isProcessing, addText, deleteText };
};

export default useTexts;
