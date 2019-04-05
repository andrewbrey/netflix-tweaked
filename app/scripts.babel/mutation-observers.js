(function(window) {
	"use strict";

	monkeyPatchPushState();
	setWindowHistoryListeners();

	document.getElementsByTagName("html")[0].classList.add("netflix-tweaked-loaded");

	const NETFLIX_TWEAKED_DATA_NAME = "NETFLIX_TWEAKED_DATA";
	const BILLBOARD_OBSERVER_NAME = "BILLBOARD_OBSERVER";
	const TITLE_CARDS_OBSERVER_NAME = "TITLE_CARDS_OBSERVER";
	const BIG_ROW_OBSERVER_NAME = "BIG_ROW_OBSERVER";
	const JAWBONE_OBSERVER_NAME = "JAWBONE_OBSERVER";
	const LIST_ORDER_OBSERVER_NAME = "LIST_ORDER_OBSERVER";
	const NETFLIX_TWEAKED_CLASS = "netflix-tweaked";

	// TODO (enhancement)
	// Make these to be user settings
	const PREVENT_BILLBOARD_AUTOPLAY = true;
	const PREVENT_TITLE_CARD_AUTOPLAY = true;
	const PREVENT_BIG_ROW_AUTOPLAY = true;
	const PREVENT_JAWBONE_AUTOPLAY = true;

	rebuildObservers();

	function titleCardTrailerObserver() {
		return mutationsFor({
			parentSelector: ".lolomo",
			childSelector: ".title-card video",
			onMutate: videos => {
				videos.forEach(v => {
					if (PREVENT_TITLE_CARD_AUTOPLAY) {
						superMuteVideo(v);
					}
				});
			},
			disconnectOnMutate: false,
			throttleTime: 100
		});
	}

	function billboardTrailerObserver() {
		return mutationsFor({
			parentSelector: ".lolomo",
			childSelector: ".billboard-row video",
			onMutate: videos => {
				videos.forEach(v => {
					if (PREVENT_BILLBOARD_AUTOPLAY) {
						superMuteVideo(v);
					}
				});
			},
			disconnectOnMutate: false,
			throttleTime: 100
		});
	}

	function bigRowTrailerObserver() {
		return mutationsFor({
			parentSelector: ".lolomo",
			childSelector: ".lolomoBigRow video",
			onMutate: videos => {
				videos.forEach(v => {
					if (PREVENT_BIG_ROW_AUTOPLAY) {
						superMuteVideo(v);
					}
				});
			},
			disconnectOnMutate: false,
			throttleTime: 100
		});
	}

	function jawboneTrailerObserver() {
		return mutationsFor({
			parentSelector: ".lolomo",
			childSelector: ".jawBoneContent video",
			onMutate: videos => {
				videos.forEach(v => {
					if (PREVENT_JAWBONE_AUTOPLAY) {
						superMuteVideo(v);
					}
				});
			},
			disconnectOnMutate: false,
			throttleTime: 100
		});
	}

	function listOrderObserver(LOLOMO) {
		return mutationsFor({
			parentSelector: ".lolomo",
			childSelector: ".lolomoRow",
			onMutate: allRows => {
				let billboard = document.querySelector(".billboard-row");
				let queue = document.querySelector("[data-list-context=queue]");
				let continueWatching = document.querySelector("[data-list-context=continueWatching]");

				if (allRows && allRows.length && (queue || continueWatching)) {
					if (billboard) {
						if (queue && continueWatching) {
							if (
								!(allRows[0].dataset.listContext === "continueWatching" && allRows[1].dataset.listContext === "queue")
							) {
								billboard.insertAdjacentElement("afterend", queue);
								billboard.insertAdjacentElement("afterend", continueWatching);
							}
						} else if (queue) {
							if (allRows[0].dataset.listContext !== "queue") {
								billboard.insertAdjacentElement("afterend", queue);
							}
						} else {
							if (allRows[0].dataset.listContext !== "continueWatching") {
								billboard.insertAdjacentElement("afterend", continueWatching);
							}
						}
					} else {
						if (queue && continueWatching) {
							if (
								!(allRows[0].dataset.listContext === "continueWatching" && allRows[1].dataset.listContext === "queue")
							) {
								LOLOMO.insertAdjacentElement("afterbegin", queue);
								LOLOMO.insertAdjacentElement("afterbegin", continueWatching);
							}
						} else if (queue) {
							if (allRows[0].dataset.listContext !== "queue") {
								LOLOMO.insertAdjacentElement("afterbegin", queue);
							}
						} else {
							if (allRows[0].dataset.listContext !== "continueWatching") {
								LOLOMO.insertAdjacentElement("afterbegin", continueWatching);
							}
						}
					}
				}
			},
			disconnectOnMutate: false,
			throttleTime: 100
		});
	}

	function mutationsFor(observationParams) {
		observationParams.childSelector = observationParams.childSelector || "NON_EXISTENT_TAG";
		observationParams.onMutate = observationParams.onMutate || noop;
		observationParams.disconnectOnMutate = observationParams.disconnectOnMutate !== false;
		observationParams.throttleTime = Number(observationParams.throttleTime) || 0;

		const PARENT = observationParams.parentSelector
			? document.querySelector(observationParams.parentSelector)
			: document;

		const MUTATION_OBSERVER = new MutationObserver(
			throttle(
				() => {
					if (PARENT) {
						const CHILDREN_TO_OBSERVE = [].slice.call(PARENT.querySelectorAll(observationParams.childSelector));

						if (Array.isArray(CHILDREN_TO_OBSERVE) && CHILDREN_TO_OBSERVE.length) {
							observationParams.onMutate(CHILDREN_TO_OBSERVE);

							if (observationParams.disconnectOnMutate) {
								MUTATION_OBSERVER.disconnect();
							}
						}
					}
				},
				observationParams.throttleTime >= 0 ? observationParams.throttleTime : 100,
				{ leading: true, trailing: false }
			)
		);

		if (PARENT) {
			MUTATION_OBSERVER.observe(PARENT, {
				subtree: true,
				childList: true
			});
		} else {
			ntLog("Bad parent selector for mutation observation!");
		}

		return MUTATION_OBSERVER;
	}

	function superMuteVideo(video) {
		video.classList.add(NETFLIX_TWEAKED_CLASS);
		video.muted = true;
		video.playbackRate = 0;
		video.setAttribute("preload", 0);
		video.setAttribute("autoplay", "false");
		video.pause();
		video.play = noop;
	}

	function noop() {}

	function rebuildObservers() {
		clearObservers().then(buildObservers);
	}

	function clearObservers() {
		return new Promise(resolve => {
			if (typeof window[NETFLIX_TWEAKED_DATA_NAME] === "object" && window[NETFLIX_TWEAKED_DATA_NAME] !== null) {
				const CACHE = window[NETFLIX_TWEAKED_DATA_NAME];

				[
					BILLBOARD_OBSERVER_NAME,
					TITLE_CARDS_OBSERVER_NAME,
					BIG_ROW_OBSERVER_NAME,
					JAWBONE_OBSERVER_NAME,
					LIST_ORDER_OBSERVER_NAME
				].forEach(cacheKey => {
					if (typeof CACHE[cacheKey] === "object" && CACHE[cacheKey] !== null) {
						CACHE[cacheKey].disconnect();
					}

					CACHE[cacheKey] = null;
				});
			} else {
				window[NETFLIX_TWEAKED_DATA_NAME] = {
					[BILLBOARD_OBSERVER_NAME]: null,
					[TITLE_CARDS_OBSERVER_NAME]: null,
					[BIG_ROW_OBSERVER_NAME]: null,
					[JAWBONE_OBSERVER_NAME]: null,
					[LIST_ORDER_OBSERVER_NAME]: null
				};
			}

			resolve();
		});
	}

	function buildObservers() {
		mutationsFor({
			childSelector: ".lolomo",
			onMutate: lolomos => {
				const LOLOMO = lolomos[0];

				window[NETFLIX_TWEAKED_DATA_NAME][BILLBOARD_OBSERVER_NAME] = billboardTrailerObserver();
				window[NETFLIX_TWEAKED_DATA_NAME][TITLE_CARDS_OBSERVER_NAME] = titleCardTrailerObserver();
				window[NETFLIX_TWEAKED_DATA_NAME][BIG_ROW_OBSERVER_NAME] = bigRowTrailerObserver();
				window[NETFLIX_TWEAKED_DATA_NAME][JAWBONE_OBSERVER_NAME] = jawboneTrailerObserver();
				window[NETFLIX_TWEAKED_DATA_NAME][LIST_ORDER_OBSERVER_NAME] = listOrderObserver(LOLOMO);
			},
			disconnectOnMutate: true
		});
	}

	function monkeyPatchPushState() {
		const ORIGINAL_PUSH_STATE = window.history.pushState;

		window.history.pushState = function(state) {
			if (typeof window.onpushstate == "function") {
				window.onpushstate({ state });
			}

			return ORIGINAL_PUSH_STATE.apply(window.history, arguments);
		};
	}

	function setWindowHistoryListeners() {
		window.onpushstate = rebuildObservers;
		window.onpopstate = rebuildObservers;
		window.onhashchange = rebuildObservers;
	}

	function ntLog(what) {
		console.log(`%c Netflix Tweaked ${new Date()} `, "font-size:14px;color:white;background-color:#2E2E2E;", what);
	}

	// Modified underscore.js throttle, borrowed from https://stackoverflow.com/a/27078401
	function throttle(func, wait, options) {
		let context, args, result;
		let timeout = null;
		let previous = 0;
		if (!options) options = {};
		let later = function() {
			previous = options.leading === false ? 0 : Date.now();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		};
		return function() {
			let now = Date.now();
			if (!previous && options.leading === false) previous = now;
			let remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	}
})(window);
