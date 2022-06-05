import React, { useState, useCallback, useEffect, useContext } from "react";

import useCompareTexts from "./hooks/useCompareTexts";
import useTexts from "../../hooks/useTexts";

import { TextsContext } from "../../contexts/TextsContext";
import { getTexts } from "../../contexts/selectors";
import { setTexts } from "../../contexts/actions";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

import Typography from "@mui/material/Typography";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import TextSnippetIcon from "@mui/icons-material/TextSnippet";

import ComparisonResults from "./components/ComparisonResults/ComparisonResults";

import "./MainPage.css";

const MainPage = () => {
  const { changeTextsContext, selectFromTextsContext } =
    useContext(TextsContext);

  const [inputValue, setInputValue] = useState("");
  const [model, setModel] = useState("word2vec");

  const { isComparing, comparisonResults, compareTexts } = useCompareTexts();
  const { fetchingTexts, fetchTexts } = useTexts();

  const texts = selectFromTextsContext(getTexts);

  const onTextsChange = useCallback(
    (newTexts) => changeTextsContext(setTexts(newTexts)),
    [changeTextsContext]
  );

  const onInputChange = useCallback(
    (event) => setInputValue(event.target.value),
    []
  );

  const onToggleChange = useCallback(
    (_event, newValue) => setModel(newValue),
    []
  );

  const onSubmit = useCallback(
    (text, model) => () => compareTexts(text, model),
    [compareTexts]
  );

  useEffect(() => {
    if (texts.length === 0) {
      fetchTexts(onTextsChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
      width="100%"
    >
      <Box textAlign="left" width="100%">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box className="TextAreaLabel">
            <Typography variant="subtitle1" marginRight="5px">
              Text to Compare
            </Typography>
            <TextSnippetIcon />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" marginRight="5px">
              Model To Use:
            </Typography>
            {fetchingTexts ? (
              <Skeleton variant="rectangular" width={170} height={50} />
            ) : (
              <ToggleButtonGroup
                value={model}
                exclusive
                onChange={onToggleChange}
              >
                <ToggleButton value="word2vec">Word2Vec</ToggleButton>
                <ToggleButton value="bert">BERT</ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>
        </Box>
        <Box marginTop="15px" width="100%">
          {fetchingTexts ? (
            <Skeleton variant="rectangular" width="100%" height={150} />
          ) : (
            <TextField
              fullWidth
              onChange={onInputChange}
              value={inputValue}
              placeholder="Enter text to compare"
              multiline
              minRows={5}
              maxRows={10}
              disabled={isComparing}
            />
          )}
        </Box>
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          marginTop="15px"
        >
          <Button
            variant="contained"
            onClick={onSubmit(inputValue, model)}
            disabled={isComparing || fetchingTexts || inputValue.length === 0}
          >
            {isComparing ? "Comparing..." : "Submit"}
          </Button>
        </Stack>
      </Box>
      <ComparisonResults
        target={inputValue}
        texts={texts}
        results={comparisonResults}
        isLoading={isComparing}
      />
    </Box>
  );
};

export default MainPage;
