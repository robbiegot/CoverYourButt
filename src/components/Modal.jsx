import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import styles from "@/styles/Modal.module.css";

const portal = document.getElementById("portal");

const Modal = ({ children }) => {
  const modalRef = useRef(null);
  if (!modalRef.current) {
    modalRef.current = document.createElement("div");
    modalRef.current.id = styles.modal;
  }

  useEffect(() => {
    portal.appendChild(modalRef.current);
    return () => portal.removeChild(modalRef.current);
  }, []);

  return createPortal(<>{children}</>, modalRef.current);
};

export default Modal;