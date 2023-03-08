import Fuse from 'fuse.js';

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

export async function hideHistoryItems(requestedCount, useFuzzySearch = true) {
  if (useFuzzySearch) {
    const allHistoryItems = await chrome.history.search({
      text: '',
      startTime: 0,
      maxResults: requestedCount,
    });
    const historyItemsSearcher = new Fuse(allHistoryItems, {
      keys: ['title', 'url'],
      threshold: 0.35,
    });
    const terms = loadTermsList();
    const historyItemCountByTerm = Object.fromEntries(terms.map((term) => [term, 0]));
    const historyToHide = terms
      .map((term) => {
        return historyItemsSearcher.search(term).map(({ item: matchedHistoryItem }) => {
          historyItemCountByTerm[term]++;
          const UrlDetails = { url: matchedHistoryItem.url };
          chrome.history.deleteUrl({ url: matchedHistoryItem.url });
          return UrlDetails;
        });
      })
      .flat();
    localStorage.setItem('hiddenHistoryItems', JSON.stringify(historyToHide || []));
    saveHistoryItemCountByTerm(historyItemCountByTerm);
  } else {
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
                historyItemCountByTerm[term]++;
                chrome.history.deleteUrl({ url: historyItem.url });
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
      });
  }
  return true;
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

export async function hideCookies(useFuzzySearch = true) {
  if (useFuzzySearch) {
    const allCookies = await chrome.cookies.getAll({});
    const cookiesSearcher = new Fuse(allCookies, {
      keys: ['domain', 'path'],
      threshold: 0.2,
    });
    const terms = loadTermsList();
    const cookieCountByTerm = Object.fromEntries(terms.map((term) => [term, 0]));
    const cookiesToHide = terms
      .map((term) => {
        return cookiesSearcher.search(term).map(({ item: matchedCookie }) => {
          const { name, storeId, secure, domain, path } = matchedCookie;
          cookieCountByTerm[term]++;
          const url = 'http' + (secure ? 's' : '') + (domain[0] === '.' ? '://www' : '://') + domain + path;
          matchedCookie.url = url;
          chrome.cookies.remove({ name, storeId, url });
          return matchedCookie;
        });
      })
      .flat();
    localStorage.setItem('hiddenCookies', JSON.stringify(cookiesToHide || []));
    saveCookieCountByTerm(cookieCountByTerm);
  } else {
    return chrome.cookies.getAll({}).then((cookies) => {
      const terms = loadTermsList();
      const cookieCountByTerm = Object.fromEntries(terms.map((term) => [term, 0]));
      const cookiesToHide = cookies.filter(({ domain }) => {
        return terms.some((term) => {
          if (domain?.toLowerCase()?.includes(term?.toLowerCase())) {
            cookieCountByTerm[term]++;
            return true;
          }
          return false;
        });
      });
      cookiesToHide.forEach((cookie) => {
        const { name, storeId, secure, domain, path } = cookie;
        const url = 'http' + (secure ? 's' : '') + (domain[0] === '.' ? '://www' : '://') + domain + path;
        cookie.url = url;
        chrome.cookies.remove({ name, storeId, url });
      });
      localStorage.setItem('hiddenCookies', JSON.stringify(cookiesToHide || []));
      saveCookieCountByTerm(cookieCountByTerm);
    });
  }
  return true;
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
  const historyItemsToRestore = JSON.parse(localStorage.getItem('hiddenHistoryItems') || '[]'); // * hiddenHistoryItems is stored as { url: string }[]
  historyItemsToRestore?.forEach((UrlDetails) => {
    chrome.history.addUrl(UrlDetails);
  });
  localStorage.removeItem('hiddenHistoryItems');
  clearHistoryItemCountByTerm();
}

export function restoreCookies() {
  const cookiesToRestore = JSON.parse(localStorage.getItem('hiddenCookies') || '[]');
  cookiesToRestore?.forEach(
    ({ domain, expirationDate, httpOnly, name, path, sameSite, secure, storeId, url, value }) => {
      chrome.cookies.set({ domain, expirationDate, httpOnly, name, path, sameSite, secure, storeId, url, value });
    }
  );
  localStorage.removeItem('hiddenCookies');
  clearCookieCountByTerm();
}

export function saveHistoryPreference(historyPreference) {
  localStorage.setItem('historyEnabled', JSON.stringify(historyPreference));
}

export function loadHistoryPreference() {
  return JSON.parse(localStorage.getItem('historyEnabled') || 'false');
}

export function saveCookiesPreference(cookiesPreference) {
  localStorage.setItem('cookiesEnabled', JSON.stringify(cookiesPreference));
}

export function loadCookiesPreference() {
  return JSON.parse(localStorage.getItem('cookiesEnabled') || 'false');
}

export function saveFuzzySearchPreference(fuzzySearchPreference) {
  localStorage.setItem('fuzzySearchEnabled', JSON.stringify(fuzzySearchPreference));
}

export function loadFuzzySearchPreference() {
  return JSON.parse(localStorage.getItem('fuzzySearchEnabled') || 'false');
}

const loop = (callback) => callback().then((val) => (val === true && loop(callback)) || val);
