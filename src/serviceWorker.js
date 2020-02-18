/* eslint-disable no-restricted-globals */

import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { cacheNames, setCacheNameDetails } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { getCacheKeyForURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute, Router } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

const CONFIG = {};
const ENTRIES = [];

registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  }),
);

registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);

/**
 * @param {Event} event
 */
function onMessage(event) {
  const { data } = event;

  if (data?.type) {
    switch (data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      default:
        break;
    }
  }
}

self.addEventListener('message', onMessage);

setCacheNameDetails({ prefix: '@ljosberinn' });

if (CONFIG.precache) {
  precacheAndRoute(ENTRIES, {});
}

const router = new Router();

self.addEventListener('fetch', event => {
  const responsePromise = router.handleRequest(event);

  if (responsePromise) {
    event.respondWith(responsePromise);
  }
});

/**
 * Check if Service Worker is waiting for activation, but there is only one client
 */
async function isWaitingWithOneClient() {
  const clients = await self.clients.matchAll();

  return self.registration.waiting && clients.length <= 1;
}

async function getFromCacheOrNetwork(request) {
  try {
    const response = await caches.match(request, {
      cacheName: cacheNames.precache,
    });

    if (response) {
      return response;
    }

    // This shouldn't normally happen, but there are edge cases: https://github.com/GoogleChrome/workbox/issues/1441
    throw new Error(
      `The cache ${cacheNames.precache} did not have an entry for ${request}.`,
    );
  } catch (error) {
    // If there's either a cache miss, or the caches.match() call threw
    // an exception, then attempt to fulfill the navigation request with
    // a response from the network rather than leaving the user with a
    // failed navigation.
    console.log(
      `Unable to respond to navigation request with cached response. Falling back to network.`,
      error,
    );

    // This might still fail if the browser is offline...
    return fetch(request);
  }
}

router.registerRoute(
  new NavigationRoute(async ({ url }) => {
    if (await isWaitingWithOneClient()) {
      self.registration.waiting.postMessage({
        type: 'SKIP_WAITING',
        payload: undefined,
      });

      // refresh the tab by returning a blank response
      return new Response('', { headers: { Refresh: '0' } });
    }

    if (!CONFIG.precache) {
      return fetch(url.href);
    }

    const cachedUrlKey = getCacheKeyForURL('app-shell');
    if (!cachedUrlKey) {
      return fetch(url.href);
    }

    return getFromCacheOrNetwork(cachedUrlKey);
  }),
);
