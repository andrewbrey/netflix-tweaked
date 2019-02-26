(function(chrome, window) {
	"use strict";

	document.getElementsByTagName("html")[0].classList.add("netflix-tweaked-loaded");

	const NETFLIX_TWEAKED_DATA_NAME = "NETFLIX_TWEAKED_DATA";

	const BILLBOARD_OBSERVER_NAME = "BILLBOARD_OBSERVER";
	const TITLE_CARDS_OBSERVER_NAME = "TITLE_CARDS_OBSERVER";
	const JAWBONE_OBSERVER_NAME = "JAWBONE_OBSERVER";
	const LIST_ORDER_OBSERVER_NAME = "LIST_ORDER_OBSERVER";

	const NETFLIX_TWEAKED_CLASS = "netflix-tweaked";

	// TODO (enhancement)
	// Make these to be user settings
	const PREVENT_BILLBOARD_AUTOPLAY = true;
	const PREVENT_TITLE_CARD_AUTOPLAY = true;
	const PREVENT_JAWBONE_AUTOPLAY = false;

	resetObserverCache();

	chrome.runtime.onMessage.addListener(message => {
		switch (message.message) {
			case "RUN_TWEAKS": {
				runTweaks();
				break;
			}
			case "SHUT_OFF_TWEAKS": {
				resetObserverCache();
				break;
			}
			default: {
				ntLog(`Unknown message [${message.message}]`);
				break;
			}
		}
		return true;
	});

	const runTweaks = throttle(_runTweaks, 500, { leading: true, trailing: false });
	function _runTweaks() {
		mutationsFor({
			childSelector: ".lolomo",
			onMutate: lolomos => {
				const LOLOMO = lolomos[0];

				/* Billboard Trailers */
				window[NETFLIX_TWEAKED_DATA_NAME][BILLBOARD_OBSERVER_NAME] = mutationsFor({
					parentSelector: ".lolomo",
					childSelector: ".billboard-row video",
					onMutate: videos => {
						videos.forEach(v => {
							if (PREVENT_BILLBOARD_AUTOPLAY) {
								v.classList.add(NETFLIX_TWEAKED_CLASS);
								v.muted = true;
								v.playbackRate = 0;
								v.setAttribute("preload", 0);
								v.setAttribute("autoplay", "false");
								v.pause();
								v.play = noop;
							}
						});
					},
					disconnectOnMutate: false
				});

				/* Title Card Trailers */
				window[NETFLIX_TWEAKED_DATA_NAME][TITLE_CARDS_OBSERVER_NAME] = mutationsFor({
					parentSelector: ".lolomo",
					childSelector: ".title-card video",
					onMutate: videos => {
						videos.forEach(v => {
							if (PREVENT_TITLE_CARD_AUTOPLAY) {
								v.classList.add(NETFLIX_TWEAKED_CLASS);
								v.muted = true;
								v.playbackRate = 0;
								v.setAttribute("preload", 0);
								v.setAttribute("autoplay", "false");
								v.pause();
								v.play = noop;
							}
						});
					},
					disconnectOnMutate: false
				});

				/* Jawbone Trailers */
				window[NETFLIX_TWEAKED_DATA_NAME][JAWBONE_OBSERVER_NAME] = mutationsFor({
					parentSelector: ".lolomo",
					childSelector: ".jawBoneContent video",
					onMutate: videos => {
						videos.forEach(v => {
							if (PREVENT_JAWBONE_AUTOPLAY) {
								v.classList.add(NETFLIX_TWEAKED_CLASS);
								v.muted = true;
								v.playbackRate = 0;
								v.setAttribute("preload", 0);
								v.setAttribute("autoplay", "false");
								v.pause();
								v.play = noop;
							}
						});
					},
					disconnectOnMutate: false
				});

				/* List Order */
				window[NETFLIX_TWEAKED_DATA_NAME][LIST_ORDER_OBSERVER_NAME] = mutationsFor({
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
										!(
											allRows[0].dataset.listContext === "continueWatching" &&
											allRows[1].dataset.listContext === "queue"
										)
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
										!(
											allRows[0].dataset.listContext === "continueWatching" &&
											allRows[1].dataset.listContext === "queue"
										)
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
					disconnectOnMutate: false
				});
			}
		});
	}

	function mutationsFor(observationParams) {
		observationParams.childSelector = observationParams.childSelector || "NON_EXISTENT_TAG";
		observationParams.onMutate = observationParams.onMutate || noop;
		observationParams.disconnectOnMutate = observationParams.disconnectOnMutate !== false;

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
				100,
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

	function noop() {} // Does nothing, goes nowhere

	function resetObserverCache() {
		if (typeof window[NETFLIX_TWEAKED_DATA_NAME] === "object" && window[NETFLIX_TWEAKED_DATA_NAME] !== null) {
			const CACHE = window[NETFLIX_TWEAKED_DATA_NAME];

			[BILLBOARD_OBSERVER_NAME, TITLE_CARDS_OBSERVER_NAME, JAWBONE_OBSERVER_NAME, LIST_ORDER_OBSERVER_NAME].forEach(
				cacheKey => {
					if (typeof CACHE[cacheKey] === "object" && CACHE[cacheKey] !== null) {
						CACHE[cacheKey].disconnect();
					}

					CACHE[cacheKey] = null;
				}
			);
		} else {
			window[NETFLIX_TWEAKED_DATA_NAME] = {
				[BILLBOARD_OBSERVER_NAME]: null,
				[TITLE_CARDS_OBSERVER_NAME]: null,
				[JAWBONE_OBSERVER_NAME]: null,
				[LIST_ORDER_OBSERVER_NAME]: null
			};
		}
	}

	function ntLog(what) {
		console.log(
			`%c  Netflix Tweaked -> ${typeof what === "object" ? JSON.stringify(what) : what.toString()}  `,
			"font-size:14px;color:white;background-color:#2E2E2E;"
		);
	}

	// Modified underscore.js throttle, borrowed from
	// https://stackoverflow.com/a/27078401
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
})(chrome, window);
