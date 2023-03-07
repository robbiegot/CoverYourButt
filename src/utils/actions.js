import chromep from 'chrome-promise';
// console.log(">  file: actions.js:2  chromep:", chromep)

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

export function hideHistoryItems(requestedCount) {
  const ids = {};
  const history = [];
  const terms = loadTermsList();
  const historyToHide = {};

  return loop(() => {
    const endTime =
      (history.length && history[history.length - 1].lastVisitTime) ||
      Date.now();

    return chromep.history
      .search({
        text: '',
        startTime: 0,
        endTime: endTime,
        maxResults: 1000,
      })
      .then((historyItems) => {
        const initialHistoryLength = history.length;
        historyItems.forEach((item) => {
          const id = item.id;
          if (!ids[id] && history.length < requestedCount) {
            ids[id] = true;
            terms.forEach((term) => {
              if (
                (item.title && item.title.includes(term)) ||
                (item.url && item.url.includes(term))
              ) {
                historyToHide[item.id] = item;
                chrome.history.deleteUrl({ url: item.url });
              }
            });
            history.push(item);
          }
        });
        if (
          history.length > initialHistoryLength &&
          history.length < requestedCount
        )
          return true;
        else {
          // console.log("historyToHide", historyToHide)
          localStorage.setItem(
            'hiddenHistoryItems',
            JSON.stringify(historyToHide || {})
          );
          return;
        }
      });
  });
}

export async function hideCookies() {
  const terms = loadTermsList();
  const countsByTerm = Object.fromEntries(terms.map((term) => [term, 0]));
  const allCookies = await chrome.cookies.getAll({});
  const matchedCookies = allCookies.filter(({ domain }) => { // * Filter all cookies such that...
    return terms.some((term) => { // * ...at least one term has a partial match in the domain
      const partialMatch = domain?.toLowerCase()?.includes(term?.toLowerCase()); // ? also filter by path as well
      if (partialMatch) countsByTerm[term]++;
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
  return countsByTerm;
}

export function restoreHistoryItems() {
  const historyToRestore = JSON.parse(
    localStorage.getItem('hiddenHistoryItems') || '{}'
  );
  if (Object.keys(historyToRestore)?.length > 0) {
    for (const id in historyToRestore) {
      const { url } = historyToRestore[id];
      chrome.history.addUrl({ url });
    }
  }
  localStorage.removeItem('hiddenHistoryItems');
}

export function restoreCookies() {
  const cookiesToRestore = JSON.parse(
    localStorage.getItem('hiddenCookies') || '[]'
  );
  if (cookiesToRestore?.length > 0) {
    for (const cookie in cookiesToRestore) {
      const {
        domain,
        expirationDate,
        httpOnly,
        name,
        path,
        sameSite,
        secure,
        storeId,
        url,
        value,
      } = cookiesToRestore[cookie];
      const newCookie = {
        domain,
        expirationDate,
        httpOnly,
        name,
        path,
        sameSite,
        secure,
        storeId,
        url,
        value,
      };
      chrome.cookies.set(newCookie);
    }
  }
  localStorage.removeItem('hiddenCookies');
}

const loop = (callback) =>
  callback().then((val) => (val === true && loop(callback)) || val);
