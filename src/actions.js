export function saveCovered(covered) {
  localStorage.setItem('covered', JSON.stringify(covered ? 1 : 0)); // 'covered' will always be stored as '1' or '0'
  // saveAndDeleteHistory();
  // addBackHistory();
}

export function loadCovered() {
  const covered = localStorage.getItem('covered');
  if (covered === null) {
    localStorage.setItem('covered', JSON.stringify(0));
  }
  return covered > 0; // boolean coercion
}
