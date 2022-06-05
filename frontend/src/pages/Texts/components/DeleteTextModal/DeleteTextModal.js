import React, { useCallback } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const DeleteTextModal = ({ isOpen, onClose, onDelete }) => {
  const onDeleteWrapper = useCallback(() => {
    onClose();
    onDelete();
  }, [onClose, onDelete]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Attention!</DialogTitle>
      <DialogContent>
        <DialogContentText>Do you want to delete this text?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
        <Button onClick={onDeleteWrapper}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTextModal;
