(function (chrome) {
  'use strict';

  let madeOpaque = false;

  chrome.runtime.onMessage.addListener(message => {
    if (message === 'NT_RUN_TWEAKS') {
      preventTrailerAutoPlay();
      moveMyListsToTop();
    }
    return true;
  });

  preventTrailerAutoPlay();
  moveMyListsToTop();

  function preventTrailerAutoPlay() {
    if (location.pathname === '/browse') {
      let preventAutoplayCounter = 0;
      let preventAutoplayInterval = setInterval(function () {
        preventAutoplayCounter++;

        let video = document.querySelector('video');
        if (video) {
          clearInterval(preventAutoplayInterval);

          shutItUp();

          ['play', 'playing'].forEach(eventName => {
            video.addEventListener(eventName, function () {
              shutItUp();
            });
          });

          let image = document.querySelector('.hero.static-image');
          if (image) {
            image.style.opacity = '1';
          }
        } else if (preventAutoplayCounter > 100) {
          clearInterval(preventAutoplayInterval);
        }

        function shutItUp() {
          video.muted = true;
          video.pause();
          video.play = function () {
          };
        }
      }, 100);
    }
  }

  function moveMyListsToTop() {
    if (location.pathname === '/browse') {
      let moveListsCounter = 0;
      let moveListsInterval = setInterval(function () {
        moveListsCounter++;

        let billboard = document.querySelector('.billboard-row');
        let queue = document.querySelector('[data-list-context=queue]');
        let continueWatching = document.querySelector('[data-list-context=continueWatching]');

        if (billboard && queue && continueWatching && document.querySelectorAll('.lolomoRow').length > 5) {
          clearInterval(moveListsInterval);

          billboard.insertAdjacentElement('afterend', queue);
          billboard.insertAdjacentElement('afterend', continueWatching);

          makeListsOpaque();
        } else if (moveListsCounter > 100) {
          clearInterval(moveListsInterval);

          makeListsOpaque();
        }
      }, 50);
    } else {
      makeListsOpaque();
    }

    function makeListsOpaque() {
      if (!madeOpaque) {
        madeOpaque = true;

        let css = '.lolomo > :not(.billboard-row) { opacity: 1; }';
        let head = document.head || document.getElementsByTagName('head')[0];
        let style = document.createElement('style');

        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));

        head.appendChild(style);
      }
    }
  }

})(chrome);
