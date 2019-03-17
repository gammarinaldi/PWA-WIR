const cacheName1 = 'pwa-wir-news-static-assets';
const cacheName2 = 'pwa-wir-news-dynamic-assets';

const staticAssets = [
  './',
  './app.js',
  './styles.css',
  './fallback.json',
  './images/dc.png',
  './images/WIR-logo.png',
  './manifest.json'
];

self.addEventListener('install', async function () {
  const cache1 = await caches.open(cacheName1);
  cache1.addAll(staticAssets);
  console.log('pwa-wir-news-static-assets: Cached Successfully.');
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  console.log('Activated Successfully.');
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  event.respondWith(networkFirst(request));
  console.log(url.origin + ': Fetched Successfully.');
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const dynamicCache = await caches.open(cacheName2);
  try {
    const networkResponse = await fetch(request);
    dynamicCache.put(request, networkResponse.clone());
    console.log('This is networkResponse: '+networkResponse);
    return networkResponse;
  } catch (err) {
    const cachedResponse = await dynamicCache.match(request);
    console.log('This is cachedResponse: '+cachedResponse);
    return cachedResponse || await caches.match('./fallback.json');
  }
}