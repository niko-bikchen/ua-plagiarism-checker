import { SET_TEXTS } from "./constants";

export const setTexts = (newTexts) => ({
  action: SET_TEXTS,
  payload: newTexts,
});
