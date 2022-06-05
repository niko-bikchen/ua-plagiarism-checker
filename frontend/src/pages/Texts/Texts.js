import React, { useContext, useEffect, useCallback, useState } from "react";

import useModalState from "../../hooks/useModalState";

import { TextsContext } from "../../contexts/TextsContext";
import { getTexts } from "../../contexts/selectors";
import { setTexts } from "../../contexts/actions";

import useTexts from "../../hooks/useTexts";
import useManageTexts from "../../hooks/useManageTexts";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import TextSnippetIcon from "@mui/icons-material/TextSnippet";

import ViewFullTextModal from "../../components/ViewFullTextModal";
import DeleteTextModal from "./components/DeleteTextModal";

const TEXT_LEN_LIMIT = 500;

const TextInstance = ({ title, text, viewFullText, slug, deleteText }) => {
  return (
    <Box className="TextBlock">
      <Typography variant="h5" marginBottom="5px">
        {title}
      </Typography>
      <Divider />
      <Typography marginTop="10px">
        {text.length > TEXT_LEN_LIMIT
          ? text.substring(0, TEXT_LEN_LIMIT)
          : text}
        ...
        <Button variant="text" onClick={viewFullText(title, text)}>
          See Full
        </Button>
      </Typography>
      <Box textAlign="right">
        <Button variant="contained" color="error" onClick={deleteText(slug)}>
          Delete
        </Button>
      </Box>
    </Box>
  );
};

const Texts = () => {
  const { changeTextsContext, selectFromTextsContext } =
    useContext(TextsContext);
  const { fetchingTexts, fetchTexts } = useTexts();
  const { modalIsOpen, openModal, closeModal } = useModalState();
  const {
    modalIsOpen: deleteModalIsOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModalState();
  const { isProcessing, addText, deleteText } = useManageTexts();
  const [textData, setTextData] = useState({ title: "", text: "", slug: "" });

  const texts = selectFromTextsContext(getTexts);

  const onTextsChange = useCallback(
    (newTexts) => changeTextsContext(setTexts(newTexts)),
    [changeTextsContext]
  );

  const onTextDelete = useCallback(
    (slug) => () => deleteText(onTextsChange, slug),
    [deleteText, onTextsChange]
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

  const openDeleteModalWrapper = useCallback(
    (slug) => () => {
      setTextData({ title: "", text: "", slug });
      openDeleteModal();
    },
    [openDeleteModal]
  );

  const closeDeleteModalWrapper = useCallback(() => {
    setTextData({ title: "", text: "", slug: "" });
    closeDeleteModal();
  }, [closeDeleteModal]);

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
      gap={2}
      width="100%"
    >
      <Box className="TextAreaLabel">
        <Typography variant="subtitle1" marginRight="5px">
          Available Texts
        </Typography>
        <TextSnippetIcon />
      </Box>
      {fetchingTexts || isProcessing ? (
        <Stack direction="column" gap={2}>
          <Skeleton variant="rectangular" width="100%" height="80px" />
          <Skeleton variant="rectangular" width="100%" height="80px" />
          <Skeleton variant="rectangular" width="100%" height="80px" />
          <Skeleton variant="rectangular" width="100%" height="80px" />
          <Skeleton variant="rectangular" width="100%" height="80px" />
        </Stack>
      ) : (
        texts.map((text) => (
          <TextInstance
            title={text.title}
            text={text.text}
            slug={text.slug}
            viewFullText={openModalWrapper}
            deleteText={openDeleteModalWrapper}
          />
        ))
      )}
      <ViewFullTextModal
        text={textData.text}
        title={textData.title}
        isOpen={modalIsOpen}
        onClose={closeModalWrapper}
      />
      <DeleteTextModal
        isOpen={deleteModalIsOpen}
        onClose={closeDeleteModalWrapper}
        onDelete={onTextDelete(textData.slug)}
      />
    </Box>
  );
};

export default Texts;
