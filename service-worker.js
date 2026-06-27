'use strict';



//********************      BASIC VANILLA SERVICE WORKER      //********************

// import Workbox
self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

// disable console logs
workbox.setConfig({ debug: false });   

// skipWaiting: activate the new version of service worker now, instead of waiting for the next session to do so
self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});

// apply the new service worker to all clients (tabs) immediately
self.addEventListener('activate', event => { 
    event.waitUntil(self.clients.claim());      
    console.debug('service worker activated', event);
});



//********************            CACHING STRATEGY            //********************

/** Cache only 2xx responses plugin (do not cache, for example, 303 redirection to login page) */
const cacheOnly2xxPlugin = {
    cacheWillUpdate: async ({ response }) => {
        if (response && (response.type === 'opaque' || (response.status >= 200 && response.status < 300))) {
            return response;
        }
        return null;
    }
};

// on everything (serve cached content fast, then refresh it in the background)
workbox.routing.registerRoute(
    new RegExp('.*'),   // everything
    new workbox.strategies.StaleWhileRevalidate({
        plugins: [cacheOnly2xxPlugin]
    })
); 