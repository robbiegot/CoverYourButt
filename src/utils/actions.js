import chromep from 'chrome-promise';

export function saveCovered(covered) {
  localStorage.setItem('covered', JSON.stringify(covered ? 1 : 0)); // 'covered' will always be stored as '1' or '0'
}

export function loadCovered() {
  const covered = localStorage.getItem('covered');
  if (covered === null) localStorage.setItem('covered', JSON.stringify(0));
  return covered > 0; // boolean coercion
}

export function saveTermsList(termsList) {
  localStorage.setItem('termsList', JSON.stringify(termsList));
}

export function loadTermsList() {
  return JSON.parse(localStorage.getItem('termsList') || '[]');
}

export async function hideHistoryItems(requestedCount) {
  return chrome.history
    .search({
      text: '',
      startTime: 0,
      maxResults: requestedCount,
    })
    .then((historyItems) => {
      const terms = loadTermsList();
      const historyItemCountByTerm = Object.fromEntries(terms.map((term) => [term, 0]));
      const historyToHide = historyItems
        .filter((historyItem) => {
          return terms.some((term) => {
            if (historyItem?.title?.includes(term) || historyItem?.url?.includes(term)) {
              // * Term partially matches with history item title and/or url
              historyItemCountByTerm[term]++;
              chrome.history.deleteUrl({ url: historyItem.url });
              console.table(historyItem);
              return true;
            }
            return false;
          });
        })
        .map(({ url }) => {
          return {
            url,
          };
        });
      localStorage.setItem('hiddenHistoryItems', JSON.stringify(historyToHide || []));
      saveHistoryItemCountByTerm(historyItemCountByTerm);
      return true;
    });
}

function saveHistoryItemCountByTerm(historyItemCountByTerm) {
  return localStorage.setItem('historyItemCountByTerm', JSON.stringify(historyItemCountByTerm));
}

export function loadHistoryItemCountByTerm() {
  return JSON.parse(localStorage.getItem('historyItemCountByTerm') || '{}');
}

function clearHistoryItemCountByTerm() {
  return localStorage.removeItem('historyItemCountByTerm');
}

export async function hideCookies() {
  const terms = loadTermsList();
  const cookieCountByTerm = Object.fromEntries(terms.map((term) => [term, 0]));
  const allCookies = await chrome.cookies.getAll({});
  const matchedCookies = allCookies.filter(({ domain }) => { // * Filter all cookies such that...
    return terms.some((term) => { // * ...at least one term has a partial match in the domain
      const partialMatch = domain?.toLowerCase()?.includes(term?.toLowerCase()); // ? also filter by path as well
      if (partialMatch) cookieCountByTerm[term]++;
      return partialMatch;
    });
  });
  matchedCookies.forEach((cookie) => {
    const { name, storeId, secure, domain, path } = cookie;
    const url = 'http' + (secure ? 's' : '') + (domain[0] === '.' ? '://www' : '://') + domain + path;
    cookie.url = url;
    chrome.cookies.remove({ name, storeId, url });
  });
  localStorage.setItem('hiddenCookies', JSON.stringify(matchedCookies || []));
  saveCookieCountByTerm(cookieCountByTerm);
  return;
}

function saveCookieCountByTerm(cookieCountByTerm) {
  return localStorage.setItem('cookieCountByTerm', JSON.stringify(cookieCountByTerm));
}

export function loadCookieCountByTerm() {
  return JSON.parse(localStorage.getItem('cookieCountByTerm') || '{}');
}

function clearCookieCountByTerm() {
  return localStorage.removeItem('cookieCountByTerm');
}

export function restoreHistoryItems() {
  JSON.parse(localStorage.getItem('hiddenHistoryItems') || '[]')?.forEach((historyItem) => {
    // * hiddenHistoryItems is stored as { url: string }[]
    chrome.history.addUrl(historyItem);
  });
  localStorage.removeItem('hiddenHistoryItems');
  clearHistoryItemCountByTerm();
}

export function restoreCookies() {
  const cookiesToRestore = JSON.parse(localStorage.getItem('hiddenCookies') || '[]');
  if (cookiesToRestore?.length > 0) {
    for (const cookie in cookiesToRestore) {
      const { domain, expirationDate, httpOnly, name, path, sameSite, secure, storeId, url, value } =
        cookiesToRestore[cookie];
      const newCookie = { domain, expirationDate, httpOnly, name, path, sameSite, secure, storeId, url, value };
      chrome.cookies.set(newCookie);
    }
  }
  localStorage.removeItem('hiddenCookies');
  clearCookieCountByTerm();
}

const loop = (callback) => callback().then((val) => (val === true && loop(callback)) || val);
