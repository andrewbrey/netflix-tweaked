(function () {
  'use strict';

  preventTrailerAutoPlay();
  moveMyListsToTop();

  function preventTrailerAutoPlay() {
    console.log('called traler');
    let counter = 0;
    let interval = setInterval(function () {
      counter++;

      let video = document.querySelector('video');
      if (video) {
        clearInterval(interval);

        // Should the video just be deleted? Not doing so allows the method calls not to fail (they just don't do anything)...
        video.muted = true;
        video.pause();
        video.play = function () {
        };

        let image = document.querySelector('.hero.static-image');
        if (image) {
          image.style.opacity = '1';
        }
      } else if (counter > 30) {
        clearInterval(interval);
      }
    }, 100);
  }

  function moveMyListsToTop(){
    console.log('called lists');
    [].forEach.call(document.querySelectorAll('.lolomo > :not(.billboard-row)'), row => {row.style.opacity = 0;});

    let counter = 0;
    let interval = setInterval(function(){
      counter++;

      let billboard = document.querySelector('.billboard-row');
      let queue = document.querySelector('[data-list-context=queue]');
      let continueWatching = document.querySelector('[data-list-context=continueWatching]');

      if(billboard && queue && continueWatching) {
        clearInterval(interval);

        billboard.insertAdjacentElement('afterend', queue);
        billboard.insertAdjacentElement('afterend', continueWatching);

        [].forEach.call(document.querySelectorAll('.lolomo > :not(.billboard-row)'), row => {row.style.opacity = 1;});
      } else if(counter > 20) {
        clearInterval(interval);
      }
    }, 100);
  }

})();
