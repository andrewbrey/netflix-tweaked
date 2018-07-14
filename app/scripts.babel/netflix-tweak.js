(function (chrome) {
  'use strict';

  document.getElementsByTagName('html')[0].classList.add('netflix-tweaked-loaded');

  const NT_ON_BROWSE_SCREEN = 'NT_ON_BROWSE_SCREEN';
  const NT_OFF_BROWSE_SCREEN = 'NT_OFF_BROWSE_SCREEN';

  let browseScreenVideos = null;
  let browseScreenVideoInterval = null;

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
    if(browseScreenVideos === null) {
      browseScreenVideos = document.getElementsByTagName('video');
    }

    if(browseScreenVideoInterval === null) {

      browseScreenVideoInterval = setInterval(function(){
        if(browseScreenVideos.length) {
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
              video.pause();
              video.play = function () {};
            }
          });
        }
      }, 500);

    }
  }

  function offBrowseScreen() {
    browseScreenVideos = null;
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

  function makeListsTransparent() {
    if(document.querySelector('style.nt-make-opaque')) {
      document.querySelector('style.nt-make-opaque').remove();
    }
  }

  function ntLog(what) {
    console.log(`%c  Netflix Tweaked -> ${typeof what === 'object' ? JSON.stringify(what) : what.toString()}  `, 'font-size:14px;color:white;background-color:#2E2E2E;');
  }
})(chrome);
