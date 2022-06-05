import React, { useReducer } from "react";

import { SET_TEXTS } from "./constants";

import { setTextsReducer } from "./reducers";

const TextsContext = React.createContext();

const TextsProvider = ({ children }) => {
  const [textsContext, changeTextsContext] = useReducer(
    (state, newData) => {
      switch (newData.action) {
        case SET_TEXTS:
          return setTextsReducer(state, newData);
        default:
          throw new Error("Unexpected action!");
      }
    },
    {
      texts: [],
    }
  );

  const selectFromTextsContext = (selector) => {
    return selector(textsContext);
  };

  return (
    <TextsContext.Provider
      value={{ changeTextsContext, selectFromTextsContext }}
    >
      {children}
    </TextsContext.Provider>
  );
};

export { TextsProvider, TextsContext };
