(function (chrome, NetflixCadmiumPlayer) {
  'use strict';

  document.getElementsByTagName('html')[0].classList.add('netflix-tweaked-loaded');

  const NT_ON_BROWSE_SCREEN = 'NT_ON_BROWSE_SCREEN';
  const NT_OFF_BROWSE_SCREEN = 'NT_OFF_BROWSE_SCREEN';

  let browseScreenVideos = null;
  let browseScreenVideoInterval = null;

  let listsParentElement = null;
  let listsMutationObserver = null;
  let runawayMutationCounter = 0;
  let listMoveInterval = null;

  let listReorderMessageShown = false;

  chrome.runtime.onMessage.addListener(message => {
    switch (message) {
      case NT_ON_BROWSE_SCREEN: {
        onBrowseScreen();
        break;
      }
      case NT_OFF_BROWSE_SCREEN: {
        offBrowseScreen();
        break;
      }
      default: {
        ntLog(`Unknown message from Netflix Tweaked backend: ${JSON.stringify(message)}`);
        break;
      }
    }
    return true;
  });

  function onBrowseScreen() {
    if(NetflixCadmiumPlayer && NetflixCadmiumPlayer['controlProtocol'] && NetflixCadmiumPlayer['controlProtocol'].start) {
      NetflixCadmiumPlayer['controlProtocol'].start = null;
    }

    if(!listReorderMessageShown) {
      listReorderMessageShown = true;

      showListReorderOverlay();
      setTimeout(hideListReorderOverlay, 1500);
    }

    if(browseScreenVideos === null) {
      browseScreenVideos = document.getElementsByTagName('video');
    }

    if(browseScreenVideoInterval === null) {

      browseScreenVideoInterval = setInterval(function(){
        if(browseScreenVideos && browseScreenVideos.length) {
          clearInterval(browseScreenVideoInterval);
          browseScreenVideoInterval = null;

          [].forEach.call(browseScreenVideos, browseScreenVideo => {
            shutItUp(browseScreenVideo);

            ['play', 'playing'].forEach(eventName => {
              browseScreenVideo.addEventListener(eventName, function () {
                shutItUp(browseScreenVideo);
              });
            });

            function shutItUp(video){
              ntLog("Go away auto-play trailer! Re-making auto-play trailer inert. It's an epic battle with the Netflix code to keep it this way ¯\\_(ツ)_/¯");
              video.muted = true;
              video.src = null;
              video.playbackRate = 0;
              video.setAttribute('preload', 0);
              video.setAttribute('autoplay', 'false');
              video.pause();
              video.play = function () {};
            }
          });
        }
      }, 500);

    }

    if(listsMutationObserver === null) {
      if(listMoveInterval === null) {
        listMoveInterval = setInterval(function () {

          let billboard = document.querySelector('.billboard-row');
          let queue = document.querySelector('[data-list-context=queue]');
          let continueWatching = document.querySelector('[data-list-context=continueWatching]');

          if ((queue || continueWatching) && document.querySelector('.lolomo')) {
            clearInterval(listMoveInterval);
            listMoveInterval = null;

            listsParentElement = document.querySelector('.lolomo');

            setTimeout(function(){
              if(billboard) {
                if(queue && continueWatching) {
                  billboard.insertAdjacentElement('afterend', queue);
                  billboard.insertAdjacentElement('afterend', continueWatching);
                } else if(queue) {
                  billboard.insertAdjacentElement('afterend', queue);
                } else {
                  billboard.insertAdjacentElement('afterend', continueWatching);
                }
              } else {
                if(queue && continueWatching) {
                  listsParentElement.insertAdjacentElement('afterbegin', queue);
                  listsParentElement.insertAdjacentElement('afterbegin', continueWatching);
                } else if(queue) {
                  listsParentElement.insertAdjacentElement('afterbegin', queue);
                } else {
                  listsParentElement.insertAdjacentElement('afterbegin', continueWatching);
                }
              }

              makeListsOpaque();
              watchLists();
            }, 500);

          }
        }, 50);
      }

    }

    function watchLists() {
      if(listsParentElement !== null) {
        listsMutationObserver = new MutationObserver(reorderFollowingMutation);
        listsMutationObserver.observe(listsParentElement, { childList: true } );
      }
    }

    function reorderFollowingMutation() {
      ntLog('Netflix code reordered the lists - Ensuring correct order is still present.');

      runawayMutationCounter++;
      let allRows = document.querySelectorAll('.lolomoRow');
      let billboard = document.querySelector('.billboard-row');
      let queue = document.querySelector('[data-list-context=queue]');
      let continueWatching = document.querySelector('[data-list-context=continueWatching]');

      if(allRows && allRows.length && (queue || continueWatching) && runawayMutationCounter < 5000) {
        if(billboard) {
          if(queue && continueWatching) {
            if(!(allRows[0].dataset.listContext === 'continueWatching' && allRows[1].dataset.listContext === 'queue')) {
              billboard.insertAdjacentElement('afterend', queue);
              billboard.insertAdjacentElement('afterend', continueWatching);
            }
          } else if(queue) {
            if(allRows[0].dataset.listContext !== 'queue') {
              billboard.insertAdjacentElement('afterend', queue);
            }
          } else {
            if(allRows[0].dataset.listContext !== 'continueWatching') {
              billboard.insertAdjacentElement('afterend', continueWatching);
            }
          }
        } else {
          if(queue && continueWatching) {
            if(!(allRows[0].dataset.listContext === 'continueWatching' && allRows[1].dataset.listContext === 'queue')) {
              listsParentElement.insertAdjacentElement('afterbegin', queue);
              listsParentElement.insertAdjacentElement('afterbegin', continueWatching);
            }
          } else if(queue) {
            if(allRows[0].dataset.listContext !== 'queue') {
              listsParentElement.insertAdjacentElement('afterbegin', queue);
            }
          } else {
            if(allRows[0].dataset.listContext !== 'continueWatching') {
              listsParentElement.insertAdjacentElement('afterbegin', continueWatching);
            }
          }
        }
      }
    }
  }

  function offBrowseScreen() {
    makeListsOpaque();

    if(listsMutationObserver !== null) {
      listsMutationObserver.disconnect();
    }

    if(browseScreenVideoInterval !== null) {
      clearInterval(browseScreenVideoInterval);
    }

    if(listMoveInterval !== null) {
      clearInterval(listMoveInterval);
    }

    browseScreenVideos = null;
    browseScreenVideoInterval = null;

    listsParentElement = null;
    listsMutationObserver = null;
    listMoveInterval = null;

    runawayMutationCounter = 0;
  }

  function makeListsOpaque() {
    if (!document.querySelector('style.nt-make-opaque')) {

      let css = '.lolomo > :not(.billboard-row) { opacity: 1 !important; }';
      let head = document.head || document.getElementsByTagName('head')[0];
      let style = document.createElement('style');

      style.type = 'text/css';
      style.classList.add('nt-make-opaque');
      style.appendChild(document.createTextNode(css));

      head.appendChild(style);
    }
  }

  function hideListReorderOverlay() {
    if(document.querySelector('.lolomo.reorder-in-progress')) {
      document.querySelector('.lolomo.reorder-in-progress').classList.remove('reorder-in-progress');
    }
  }

  function showListReorderOverlay() {
    if(document.querySelector('.lolomo:not(.reorder-in-progress)')) {
      document.querySelector('.lolomo:not(.reorder-in-progress)').classList.add('reorder-in-progress');
    }
  }

  function ntLog(what) {
    console.log(`%c  Netflix Tweaked -> ${typeof what === 'object' ? JSON.stringify(what) : what.toString()}  `, 'font-size:14px;color:white;background-color:#2E2E2E;');
  }

})(chrome, window['_cad_global']);
