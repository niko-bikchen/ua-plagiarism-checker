import React, { useMemo, useState, useCallback } from "react";

import useModalState from "../../../../hooks/useModalState";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";

import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ModeStandbyIcon from "@mui/icons-material/ModeStandby";
import ListAltIcon from "@mui/icons-material/ListAlt";

import ViewFullTextModal from "../../../../components/ViewFullTextModal";

import "./ComparisonResults.css";

const TEXT_LEN_LIMIT = 500;

const ResultInstance = ({ title, text, score, scoreLabel, viewFullText }) => (
  <Box className="TextBlock" display="flex" flexDirection="column">
    <Box marginBottom="10px" className="TextLabel">
      <Typography variant="subtitle2">
        {scoreLabel}:{" "}
        {Math.round((parseFloat(score) + Number.EPSILON) * 100) / 100}
      </Typography>
    </Box>
    <Typography variant="subtitle1" marginBottom="5px" fontWeight="bold">
      {title}
    </Typography>
    <Typography>
      {text?.length > TEXT_LEN_LIMIT
        ? text?.substring(0, TEXT_LEN_LIMIT)
        : text}
      ...
      <Button variant="text" onClick={viewFullText(title, text)}>
        See Full
      </Button>
    </Typography>
  </Box>
);

const ComparisonResults = ({ results = {}, texts = [], isLoading }) => {
  const [metric, setMetric] = useState("cosine_similarities");
  const [textData, setTextData] = useState({ title: "", text: "" });
  const { modalIsOpen, openModal, closeModal } = useModalState();

  const target = useMemo(() => {
    return results.cosine_similarities?.target || "";
  }, [results]);

  const onToggleChange = useCallback(
    (_event, newValue) => setMetric(newValue),
    []
  );

  const openModalWrapper = useCallback(
    (title, text) => () => {
      setTextData({ title, text });
      openModal();
    },
    [openModal]
  );

  const closeModalWrapper = useCallback(() => {
    setTextData({ title: "", text: "" });
    closeModal();
  }, [closeModal]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      width="100%"
    >
      {isLoading ? (
        <Stack direction="column">
          <Skeleton variant="text" width="100%" height="50px" />
          <Skeleton variant="text" width="100%" height="50px" />
          <Skeleton variant="text" width="100%" height="50px" />
          <Skeleton variant="text" width="100%" height="50px" />
          <Skeleton variant="text" width="100%" height="50px" />
        </Stack>
      ) : (
        <>
          <Box className="TextLabel" marginBottom="15px">
            <Typography variant="subtitle1" marginRight="5px">
              Comparison Results
            </Typography>
            <CompareArrowsIcon />
          </Box>
          {Object.keys(results).length === 0 ? (
            <Box className="TextLabel">
              <Typography variant="subtitle1" marginRight="5px">
                No Comparison Results Available
              </Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap="15px">
              <Box className="TextLabel">
                <Typography variant="subtitle1" marginRight="5px">
                  Target Text
                </Typography>
                <ModeStandbyIcon />
              </Box>
              <Box className="TextBlock">
                <Typography>{target}</Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  gap={1}
                >
                  <Box className="TextLabel">
                    <Typography variant="subtitle1" marginRight="5px">
                      Results ({results[metric].similar.length} documents)
                    </Typography>
                    <ListAltIcon />
                  </Box>
                  <Box className="TextLabel">
                    <Typography variant="subtitle1" marginRight="5px">
                      {metric === "cosine_similarities"
                        ? "Cosine Similarities"
                        : "Euclidian Distances"}
                    </Typography>
                  </Box>
                </Box>
                <ToggleButtonGroup
                  value={metric}
                  exclusive
                  onChange={onToggleChange}
                >
                  <ToggleButton value="cosine_similarities">
                    Cosine Similarity
                  </ToggleButton>
                  <ToggleButton value="euclidian_distances">
                    Euclidian Distance
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box display="flex" flexDirection="column" gap="15px">
                {results[metric].similar.map(([slug, score]) => {
                  const textItem = texts.find((item) => item.slug === slug);
                  return (
                    <ResultInstance
                      score={score}
                      title={textItem?.title}
                      text={textItem?.text}
                      scoreLabel={
                        metric === "cosine_similarities"
                          ? "Cosine Similarity"
                          : "Euclidian Distance"
                      }
                      viewFullText={openModalWrapper}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
          <ViewFullTextModal
            text={textData.text}
            title={textData.title}
            isOpen={modalIsOpen}
            onClose={closeModalWrapper}
          />
        </>
      )}
    </Box>
  );
};

export default ComparisonResults;
