'use strict';

// Reload client for Chrome Apps & Extensions.
// The reload client has a compatibility with livereload.
// WARNING: only supports reload command.

const LIVERELOAD_HOST = 'localhost';
const LIVERELOAD_PORT = 35729;
const CONNECTION = new WebSocket(`ws://${LIVERELOAD_HOST}:${LIVERELOAD_PORT}/livereload`);
const RELOAD_COOLDOWN = 5000;

let lastReload = Date.now();

CONNECTION.onerror = error => {
  console.log('Reload connection got error:', error); // eslint-disable-line no-console
};

CONNECTION.onmessage = event => {
  if (event.data) {
    const data = JSON.parse(event.data);
    if (data && data.command === 'reload') {
      if (Date.now() - lastReload > RELOAD_COOLDOWN) {
        chrome.runtime.reload();
        chrome.developerPrivate.reload(chrome.runtime.id, {failQuietly: true});
      }
    }
  }
};

