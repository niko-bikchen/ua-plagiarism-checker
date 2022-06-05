import { useState, useCallback } from "react";

const useModalState = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = useCallback(() => setModalIsOpen(true), []);

  const closeModal = useCallback(() => setModalIsOpen(false), []);

  return { modalIsOpen, openModal, closeModal };
};

export default useModalState;
