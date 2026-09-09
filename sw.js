/* English Adventure — offline service worker.
   Network-first for code and pages (fresh on every online visit),
   cache-first for assets; the cache is the offline fallback.
   Registered only on http/https; skipped on file:// . */
var CACHE = "english-adventure-v55";
var SHELL = [
  "index.html", "lessons.html", "lesson.html", "progress.html", "teacher.html",
  "teacher-edit.html", "games/picture-match.html", "games/sentence-train.html",
  "games/word-match.html", "games/conversation-comic.html", "games/listen-and-choose.html",
  "css/global.css", "css/games.css",
  "js/app.js", "js/storage.js", "js/images.js", "js/audio.js", "js/art.js", "js/navigation.js",
  "js/lesson-data.js", "js/curriculum-data.js", "js/custom-lessons.js", "js/lesson-loader.js", "js/scoring.js",
  "js/games/game-common.js", "js/games/picture-match.js", "js/games/sentence-train.js", "js/games/word-match.js",
  "js/games/conversation-comic.js", "js/games/listen-and-choose.js", "js/games/spelling-bee.js", "games/spelling-bee.html",
  "data/example-lesson.json", "data/lessons.json",
  "assets/backgrounds/map.jpg", "assets/icons/icon.svg", "assets/icons/logo.png", "assets/icons/banner-logo.png", "manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = e.request.url;

  /* Heavy, rarely-changing files (pictures, sounds): cache-first. */
  var isAsset = url.indexOf("/assets/") >= 0;

  if (isAsset) {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
        return hit || fetch(e.request).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          return res;
        });
      })
    );
    return;
  }

  /* Everything else (pages, scripts, styles, lesson data): NETWORK-FIRST,
     so every online visit gets the newest version straight away; the cache
     only answers when the network is unavailable (offline still works). */
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
        return hit || caches.match("index.html");
      });
    })
  );
});
