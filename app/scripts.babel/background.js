(function (chrome) {
  'use strict';

  chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
      chrome.declarativeContent.onPageChanged.addRules([
        {
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: {hostSuffix: 'netflix.com', pathEquals: '/browse'},
            })
          ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        }
      ]);
    });
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
      chrome.tabs.sendMessage(tabId, 'NT_RUN_TWEAKS');
    }
  });

})(chrome);
