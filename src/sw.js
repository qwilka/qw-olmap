import { precacheAndRoute } from 'workbox-precaching';

const cacheName = 'cache-v1';
//const dynamicCacheName = 'dynamic-v1';
const resourcesToCache = [
//  '/vnol/',
//  '/vnol/index.html',
//  '/vnol/build.js',
//  '/assets/example.png',
  '/assets/vn-icon-152.png',
  '/assets/favicon.ico'
];

precacheAndRoute(self.__WB_MANIFEST);

// // cache size limit function
// const limitCacheSize = (name, size) => {
//   caches.open(name).then(cache => {
//     cache.keys().then(keys => {
//       if(keys.length > size){
//         cache.delete(keys[0]).then(limitCacheSize(name, size));
//       }
//     });
//   });
// };


// self.addEventListener('install', evt => {
//   console.log("sw.js «install» event.");
//   evt.waitUntil(
//     caches.open(cacheName)
//       .then(cache => {
//         cache.addAll(resourcesToCache);
//         //return cache.addAll(resourcesToCache);
//       })
//   );
// });


// self.addEventListener('activate', evt => {
//   console.log("sw.js «activate» event.");
//   evt.waitUntil(
//     // PWA Tutorial for Beginners #18 - Dynamic Caching
//     caches.keys().then(keys => {
//       //console.log("caches.keys", keys);
//       return Promise.all(keys
//         .filter(key => key !== cacheName) //&& key !== dynamicCacheName
//         .map(key => caches.delete(key))
//       );
//     })
//   );

// });



// self.addEventListener('fetch', evt => {
//   //console.log("sw.js «fetch» event:", evt);
//   evt.respondWith(
//     caches.match(evt.request).then(cacheRes => {
//       return cacheRes || fetch(evt.request)
//       // return cacheRes || fetch(evt.request).then(fetchRes => {
//       //   return caches.open(dynamicCacheName).then(cache => {
//       //     cache.put(evt.request.url, fetchRes.clone());
//       //     // check cached items size
//       //     limitCacheSize(dynamicCacheName, 15);
//       //     return fetchRes;
//       //   })
//       // });
//     }).catch((err) => {
//       console.log("'fetch': ERROR ", err);
//       // if(evt.request.url.indexOf('.html') > -1){
//       //   return caches.match('/fallback.html');
//       // } 
//     })
//   );
// });
