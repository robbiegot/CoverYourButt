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

export async function saveAndDeleteHistoryItems() {
  // console.log('covering');
  const terms = loadTermsList();
  const cookies = await chrome.cookies.getAll({});
  for (const term of terms) {
    const termArray = [];
    const cookiesByTerm = [];
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
    cookies.forEach((cookie) => {
      const { domain, name, path, storeID, value } = cookie;
      if (name.includes(term) || domain.includes(term)) {
        const cookiesByTerm = [];

      }
    })
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
            }})
          history.push(item)
        }
      })     
      if (history.length > initialHistoryLength && history.length < requestedCount) return true;
      else {
        localStorage.setItem('historyToHide', JSON.stringify(historyToHide));
        return;
      };
     
    });
  });
}




// export async function go() {
//   const terms = loadTermsList();
//   const uninterestingHistory = JSON.parse(localStorage.getItem("uninterestingHistory") || '{}')
//   const historyToHide = JSON.parse(localStorage.getItem("historyToHide") || '{}')
//   const historyParams = { text: "", maxResults: 500, startTime: 0 };
//   let historySearchEndTime = 0;

//   while (typeof historySearchEndTime === 'number') {
//     historySearchEndTime = await getMoreHistory(terms, historyParams, historySearchEndTime, historyToHide, uninterestingHistory);
//     console.log("historySearchEndTime", historySearchEndTime)
//   }
//   localStorage.setItem('historyToHide', JSON.stringify(historyToHide));
//   localStorage.setItem('uninterestingHistory', JSON.stringify(uninterestingHistory));
//   return;
// }

// export async function getMoreHistory(terms, historyParams, nextEndTimeToUse, historyToHide, uninterestingHistory) {
//   const endTimeForThisRound = [];
//   if (nextEndTimeToUse > 0) historyParams.endTime = nextEndTimeToUse;
//   const endTime = chrome.history.search(historyParams, (items) => {
//     items.forEach((item) => {
//       if (item.id in uninterestingHistory || item.id in historyToHide) return;
//       terms.forEach((term) => {
//         if (item.title && item.title.includes(term) || item.url && item.url.includes(term)) {
//           historyToHide[item.id] = item;
//           chrome.history.deleteUrl({ url: item.url });
//         } else {
//           uninterestingHistory[item.id] = item;
//         }
//       })
//     })
//     if (items && items.length > 0) {
//       nextEndTimeToUse = items[items.length - 1].lastVisitTime;
    
//       console.log('push', endTimeForThisRound.push['helloBossMan']);
//       const randomArray = [stringVersion]
//       console.log('randomArray', randomArray)
//       console.log("stringversion0", stringVersion)
//       console.log("endTimeForThisRound9678910", endTimeForThisRound)
//     } else {
//       endTimeForThisRound.push[false];
//     }
//   })
//   console.log("endTimeForThisRound", endTimeForThisRound[1])
//   return endTimeForThisRound[0];
// }
