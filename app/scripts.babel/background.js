(function(chrome) {
	"use strict";

	const NETFLIX_GENERAL_URL_MATCHER = "*://*.netflix.com/*";
	const NETFLIX_WATCH_URL_MATCHER = /netflix\.com\/watch.+/;

	chrome.runtime.onUpdateAvailable.addListener(() => chrome.runtime.reload());
	chrome.runtime.onInstalled.addListener(() => {
		chrome.tabs.query({ url: NETFLIX_GENERAL_URL_MATCHER }, tabs => {
			tabs.forEach(tab => chrome.tabs.reload(tab.id, { bypassCache: true }));
		});
	});

	chrome.tabs.onCreated.addListener(determineAndRunTabCommands);
	chrome.tabs.onUpdated.addListener(determineAndRunTabCommands);
	chrome.tabs.onActivated.addListener(determineAndRunTabCommands);

	function determineAndRunTabCommands() {
		chrome.tabs.query({ url: NETFLIX_GENERAL_URL_MATCHER }, tabs => {
			tabs
				.filter(tab => NETFLIX_WATCH_URL_MATCHER.test(tab.url))
				.forEach(tab => {
					sendCommandToTab(tab.id, "SHUT_OFF_TWEAKS");
				});

			tabs
				.filter(tab => !NETFLIX_WATCH_URL_MATCHER.test(tab.url))
				.forEach(tab => {
					sendCommandToTab(tab.id, "RUN_TWEAKS");
				});
		});
	}

	function sendCommandToTab(tabId, message, payload = null) {
		chrome.tabs.sendMessage(tabId, { message, payload });
	}
})(chrome);
