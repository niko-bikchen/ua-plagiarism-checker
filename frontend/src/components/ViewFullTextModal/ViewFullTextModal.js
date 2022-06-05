import React from "react";

import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

import Typography from "@mui/material/Typography";

const ViewFullTextModal = ({ text, title, isOpen, onClose }) => {
  return (
    <Dialog onClose={onClose} open={isOpen} fullWidth={true} maxWidth="lg">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{text}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ViewFullTextModal;
