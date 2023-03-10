import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import styles from '@/styles/Modal.module.css';

const portal = document.getElementById('portal');

const Modal = ({ children, background }) => {
  const modalRef = useRef(null);
  if (!modalRef.current) {
    modalRef.current = document.createElement('div');
    modalRef.current.id = styles.modal;
    if (background) modalRef.current.style.background = background;
  }

  useEffect(() => {
    portal.appendChild(modalRef.current);
    return () => portal.removeChild(modalRef.current);
  }, []);

  return createPortal(<span id="contents">{children}</span>, modalRef.current);
};

export default Modal;
