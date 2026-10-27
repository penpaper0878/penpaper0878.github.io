/* Retires the offline worker this address had before the repository was
   renamed from "instatements". That worker kept answering here from its own
   cache, so the old address opened an old copy of the site, or GitHub's 404
   once that cache was gone.

   When a browser next checks for an update it finds this file, which takes
   over, removes itself, and reloads any open page. With no worker left, the
   page comes from the network, where 404.html sends it to the current site. */
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    self.clients.claim()
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (windows) {
        windows.forEach(function (w) {
          try { w.navigate(w.url); } catch (err) { /* the next visit gets there */ }
        });
      })
  );
});
