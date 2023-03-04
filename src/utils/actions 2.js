export function saveCovered(covered) {
  localStorage.setItem('covered', JSON.stringify(covered ? 1 : 0)); // 'covered' will always be stored as '1' or '0'
}

export function loadCovered() {
  const covered = localStorage.getItem('covered');
  if (covered === null) {
    localStorage.setItem('covered', JSON.stringify(0));
  }
  return covered > 0; // boolean coercion
}

export function saveTermsList(termsList) {
  localStorage.setItem('termsList', JSON.stringify(termsList));
}

export function loadTermsList() {
  return JSON.parse(localStorage.getItem('termsList') || '[]');
}

export async function saveAndDeleteHistoryItems() {
  console.log('covering');
  const terms = loadTermsList();
  console.log(cookies)
  for (const term of terms) {
    const termArray = [];
    chrome.history.search({ text: term, maxResults: 10000 }, function (data) {
      data.forEach(function (page) {
        // console.log('found in history', page.url, page.id);
        termArray.push(page.url);
        // console.log('deleting from history', page.url);
        chrome.history.deleteUrl({ url: page.url });
        localStorage.setItem(page.id, page.url);
      });
      localStorage.setItem(term, termArray.join('|||'));
      // buildPopupDom(divName, Object.values(urlObj));
    });
    // console.log('after deletion from history...local storage', localStorage);
  }
}

export function restoreHistoryItems() {
  // console.log('restoring');
  for (const id in localStorage) {
    if (!isNaN(id)) {
      // console.log('adding back', localStorage[id]);
      chrome.history.addUrl({ url: localStorage[id] });
      localStorage.removeItem(id);
    }
  }
}
