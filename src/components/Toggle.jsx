import { useEffect, useRef } from 'react';

import { PulseLoader } from 'react-spinners';

import Modal from '@/components/Modal';

import peachUrl from '@/assets/peach.png';

import styles from '@/styles/Toggle.module.css';

export default function Toggle({ covered, setCovered, processing, pillRef, peachRef, circleRef }) {
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) return;
    // * Add transitions only after initial render; this prevents the toggle animation when opening the extension
    pillRef.current.classList.add(styles.transition);
    circleRef.current.classList.add(styles.transition);
    pillRef.current.classList.toggle(styles.toggled);
    peachRef.current.classList.toggle(styles.toggled);
    circleRef.current.classList.toggle(styles.toggled);
  }, [covered]);

  useEffect(() => {
    initialRender.current = false;
    if (covered) {
      pillRef.current.classList.add(styles.toggled);
      peachRef.current.classList.add(styles.toggled);
      circleRef.current.classList.add(styles.toggled);
    }
  }, []);

  // useEffect(() => {
  //   if (processing) return circleRef.current.classList.add(styles.processing);
  //   return circleRef.current.classList.remove(styles.processing); //consider adding this inside a setTimeout. It looks weird when it happens too quickly
  // }, [processing]);

  return (
    <>
      <div id={styles.switch_container}>
        <div id={styles.pill} ref={pillRef} />
        <img id={styles.peach} ref={peachRef} src={peachUrl} draggable={false} unselectable={true} />
        <div
          id={styles.circle}
          onClick={() => {
            if (processing) return;
            setCovered(() => !covered);
          }}
          ref={circleRef}
        />
      </div>
      {processing && (
        <Modal background={'rgba(0, 0, 0, 0.2)'}>
          <PulseLoader color={'#fff'} />
        </Modal>
      )}
    </>
  );
}
