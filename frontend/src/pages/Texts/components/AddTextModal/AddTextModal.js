import React, { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import "./AddTextModal.css";

const AddTextModal = ({ isOpen, onClose, onAdd, onTextsChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [titleValue, setTitleValue] = useState("");

  const onAddWrapper = useCallback(() => {
    setInputValue("");
    setTitleValue("");
    onClose();
    onAdd(onTextsChange, { text: inputValue, title: titleValue });
  }, [onClose, onAdd, onTextsChange, inputValue, titleValue]);

  const onCloseWrapper = useCallback(() => {
    setInputValue("");
    setTitleValue("");
    onClose();
  }, [onClose]);

  const onInputChange = useCallback(
    (event) => setInputValue(event.target.value),
    []
  );

  const onTitleChange = useCallback(
    (event) => setTitleValue(event.target.value),
    []
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onCloseWrapper}
      fullWidth={true}
      maxWidth="lg"
    >
      <DialogTitle>Add New Text</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Box marginTop="15px" width="100%">
            <TextField
              label="Title"
              fullWidth
              onChange={onTitleChange}
              value={titleValue}
              placeholder="Enter title"
            />
          </Box>
          <Box marginTop="15px" width="100%">
            <TextField
              label="Text"
              fullWidth
              onChange={onInputChange}
              value={inputValue}
              placeholder="Enter text"
              multiline
              minRows={5}
              maxRows={10}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseWrapper} autoFocus>
          Close
        </Button>
        <Button
          onClick={onAddWrapper}
          disabled={inputValue.length === 0 || titleValue.length === 0}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTextModal;
