export const setTextsReducer = (state, newData) => {
  const newTexts = newData.payload;

  return {
    ...state,
    texts: newTexts,
  };
};
