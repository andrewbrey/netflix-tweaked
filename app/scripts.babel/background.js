(function(chrome) {
	"use strict";

	const NETFLIX_GENERAL_URL_MATCHER = "*://*.netflix.com/*";

	chrome.runtime.onUpdateAvailable.addListener(() => chrome.runtime.reload());
	chrome.runtime.onInstalled.addListener(() => {
		chrome.tabs.query({ url: NETFLIX_GENERAL_URL_MATCHER }, tabs => {
			tabs.forEach(tab => chrome.tabs.reload(tab.id, { bypassCache: true }));
		});
	});
})(chrome);
