(function(chrome) {
	"use strict";

	const NT_TABS = {};
	const NT_ON_BROWSE_SCREEN = "NT_ON_BROWSE_SCREEN";
	const NT_OFF_BROWSE_SCREEN = "NT_OFF_BROWSE_SCREEN";

	chrome.runtime.onInstalled.addListener(() => {
		chrome.tabs.query({ url: "*://*.netflix.com/*" }, tabs => {
			tabs.forEach(tab => {
				NT_TABS[`_${tab.id}`] = { tabId: tab.id, url: tab.url };
				chrome.tabs.reload(tab.id, { bypassCache: true });
			});
		});
	});

	chrome.runtime.onUpdateAvailable.addListener(() => {
		console.log("Update listener invoked - reloading runtime.");
		chrome.runtime.reload();
	});

	chrome.tabs.onCreated.addListener(tab => {
		if (tab && tab.url && tab.url.includes("netflix.com")) {
			NT_TABS[`_${tab.id}`] = { tabId: tab.id, url: tab.url };
		}
	});

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		let ntTab = NT_TABS[`_${tabId}`];

		if (ntTab) {
			ntTab.url = tab.url;
		} else if (tab && tab.url && tab.url.includes("netflix.com")) {
			NT_TABS[`_${tab.id}`] = { tabId: tab.id, url: tab.url };
		}

		determineAndRunTabActions(tabId);
	});

	chrome.tabs.onActivated.addListener(activeInfo => {
		determineAndRunTabActions(activeInfo.tabId);
	});

	chrome.tabs.onRemoved.addListener(tabId => {
		delete NT_TABS[`_${tabId}`];
	});

	function determineAndRunTabActions(tabId) {
		let ntTab = NT_TABS[`_${tabId}`];

		if (ntTab && ntTab.url && ntTab.url.match(/netflix\.com\/browse\/?$|netflix\.com\/browse\?.*/)) {
			chrome.pageAction.show(tabId);
			chrome.pageAction.setTitle({ tabId: tabId, title: "Netflix Tweaked is Active!" });

			chrome.tabs.sendMessage(tabId, NT_ON_BROWSE_SCREEN);
		} else {
			chrome.pageAction.hide(tabId);
			chrome.pageAction.setTitle({ tabId: tabId, title: "Netflix Tweaked is Inactive" });

			chrome.tabs.sendMessage(tabId, NT_OFF_BROWSE_SCREEN);
		}
	}
})(chrome);
