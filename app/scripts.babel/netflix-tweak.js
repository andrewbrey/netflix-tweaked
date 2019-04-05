(function(chrome) {
	"use strict";

	let script = document.createElement("script");
	script.src = chrome.extension.getURL("scripts/mutation-observers.js");
	script.onload = function() {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(script);
})(chrome);
