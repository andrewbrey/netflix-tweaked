# Netflix Tweaked <img src="https://github.com/andrewbrey/netflix-tweaked/blob/master/app/images/icon-150.png" width="75" align="left" />

[![GitHub release](https://img.shields.io/github/package-json/v/andrewbrey/netflix-tweaked.svg?label=Package%20Version)](https://github.com/andrewbrey/netflix-tweaked/releases)
[![License: MIT](https://img.shields.io/github/license/andrewbrey/netflix-tweaked.svg?label=License)](https://github.com/andrewbrey/netflix-tweaked/blob/master/LICENSE)
[![Web store version](https://img.shields.io/chrome-web-store/v/piocfidbkeehbojkamgamfhflpkoaifh.svg?label=Chrome%20Store%20Version)](https://chrome.google.com/webstore/detail/netflix-tweaked/piocfidbkeehbojkamgamfhflpkoaifh)
[![User count](https://img.shields.io/chrome-web-store/users/piocfidbkeehbojkamgamfhflpkoaifh.svg?label=Chrome%20Users)](https://chrome.google.com/webstore/detail/netflix-tweaked/piocfidbkeehbojkamgamfhflpkoaifh)
[![Firefox store version](https://img.shields.io/amo/v/netflix-tweaked.svg?label=Firefox%20Store%20Version)](https://addons.mozilla.org/en-US/firefox/addon/netflix-tweaked)
[![Firefox User count](https://img.shields.io/amo/users/netflix-tweaked.svg?label=Firefox%20Users)](https://addons.mozilla.org/en-US/firefox/addon/netflix-tweaked)
[![Edge compatibility](https://img.shields.io/badge/Microsoft%20Edge-Compatible-brightgreen.svg)](https://www.microsoft.com/store/apps/9MZ4BW66H3ZG)

---
## Release Notes
### 1.x.x

- ***1.0.x***
  - ***1.0.15*** - Correct build issue.
  - ***1.0.14*** - Resolve issues caused by Netflix updates - trailer autoplay should again be prevented.
  - ***1.0.13*** - Further improve auto-playback of trailers seed when hovering over a list item
  - ***1.0.12*** - Improve auto-playback blocking behavior to hopefully also prevent trailers seen when hovering over a list entry
  - ***1.0.11*** - Add an update listener to ensure everyone stays up to date
  - ***1.0.10*** - Fixes issue in Firefox where extension interferes with the ability to mute a tab from the browser controls
  - ***1.0.9*** - Add gulp tasks for building Firefox which allows for adding permissions to Firefox specifically
  - ***1.0.8*** - Bump the version to keep everything in sync
  - ***1.0.7*** - Quick fix to prevent a possible infinite loop - My bad ¯\\_(ツ)_/¯
  - ***1.0.6*** - Basically a rewrite to make methods location-change event based, with idempotent methods and mutation observation. TLDR, it should be more reliable now even when Netflix code changes things at runtime
  - ***1.0.5*** - Reliability improvements for Firefox
  - ***1.0.4*** - Prevent specificity issues for Firefox
  - ***1.0.3*** - Fixing an issue observed by a user where lists do not sort correctly every time
  - ***1.0.2*** - Several more improvements to reliability, especially under variable network conditions
  - ***1.0.1*** - Major improvement to the reliability of the logic, especially during Netflix-internal navigation
  - ***1.0.0*** - An extension is born :)