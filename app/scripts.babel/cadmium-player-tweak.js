(function () {
  'use strict';

  let cadmiumPlayerInterval = null;
  let waitForCadmiumCounter = 0;

  cadmiumPlayerInterval = setInterval(() => {
    waitForCadmiumCounter++;

    if (window['_cad_global'] && window['_cad_global']['controlProtocol'] && window['_cad_global']['controlProtocol'].start) {
      clearInterval(cadmiumPlayerInterval);
      cadmiumPlayerInterval = null;

      let _original_cadmium_start = window['_cad_global']['controlProtocol'].start;

      window['_cad_global']['controlProtocol'].start = function () {
        if(/netflix\.com\/watch\/.*/.test(window.location.href)) {
          return _original_cadmium_start.apply(null, arguments);
        } else {
          console.log(`%c  Netflix Tweaked -> Prevented another annoying auto-play trailer :D `, 'font-size:14px;color:white;background-color:#2E2E2E;');
        }
      };
    } else {
      if(waitForCadmiumCounter > 100) {
        clearInterval(cadmiumPlayerInterval);
        cadmiumPlayerInterval = null;
      }
    }
  }, 100);

})();