import chromep from 'chrome-promise';


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

export function restoreHistoryItems() {
  const cookiesToRestore = JSON.parse(localStorage.getItem("cookiesToHide") || '[]');
  const historyToRestore = JSON.parse(localStorage.getItem("historyToHide") || '{}');
  if (historyToRestore && historyToRestore.length > 0) {
    for (const id in historyToRestore) {
      const { url } = historyToRestore[id];
      console.log('adding back history ', historyToRestore[id]);
      chrome.history.addUrl({ url: url });
    }
  }
  if (cookiesToRestore && cookiesToRestore.length > 0) {
    for (const cookie in cookiesToRestore) {
      console.log('mostrecent cookie stuff');
      const { domain, expirationDate, httpOnly, name, path, sameSite, secure, storeId, url, value } = cookiesToRestore[cookie];
      const newCookie = {
        domain: domain,
        expirationDate: expirationDate,
        httpOnly: httpOnly,
        name: name,
        path: path,
        sameSite: sameSite,
        secure: secure,
        storeId: storeId,
        url: url,
        value: value
      };
      console.log('theCookie', newCookie)
      console.log('adding back cookie ', newCookie);
      chrome.cookies.set(newCookie);
    }
  }
  localStorage.removeItem("historyToHide");
  localStorage.removeItem("cookiesToHide");
}

const loop = (callback) => callback().then(val => (val === true && loop(callback)) || val);

export function getHistory(requestedCount) {
  const ids = {};
  const history = [];
  const terms = loadTermsList();
  const historyToHide = {};

  return loop(() => {
    const endTime = history.length &&
      history[history.length - 1].lastVisitTime || Date.now();

    return chromep.history.search({
      text: "",
      startTime: 0,
      endTime: endTime,
      maxResults: 1000
    }).then(historyItems => {
      const initialHistoryLength = history.length;
      historyItems.forEach(item => {
        const id = item.id;
        if (!ids[id] && history.length < requestedCount) {
          ids[id] = true;
          terms.forEach((term) => {
            if (item.title && item.title.includes(term) || item.url && item.url.includes(term)) {
              historyToHide[item.id] = item;
              chrome.history.deleteUrl({ url: item.url });
            }
          })
          history.push(item)
        }
      })
      if (history.length > initialHistoryLength && history.length < requestedCount) return true;
      else {
        console.log("historyToHide", historyToHide)
        localStorage.setItem('historyToHide', JSON.stringify(historyToHide || {}));
        return;
      };

    });
  });
}

export async function getCookies() {
  const terms = loadTermsList();
  const cookies = chrome.cookies.getAll({}, async (cookies) => {
    const cookiesToHide = [];
    const names = {};
    for (const cookie of cookies) {
      if (names[cookie.name]) continue;
      names[cookie.name + cookie.domain] = true;
      terms.forEach(term => {
        if (cookie.domain && cookie.domain.toLowerCase().includes(term.toLowerCase())) {
          let cookieUrl = "http";
          cookieUrl += (cookie.secure) ? 's' : '';
          cookieUrl += (cookie.domain[0] === '.') ? '://www' : '://'
          cookieUrl += cookie.domain + cookie.path;
          cookie.url = cookieUrl;
          cookiesToHide.push(cookie)
          chrome.cookies.remove({
            name: cookie.name,
            url: cookie.url,
            storeId: cookie.storeId
          })
        }
      })
    }
    localStorage.setItem('cookiesToHide', JSON.stringify(cookiesToHide || []));
    console.log("cookiesToHide", cookiesToHide)
    return;
  });
}