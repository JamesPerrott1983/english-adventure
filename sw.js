/* English Adventure — offline service worker (cache-first app shell).
   Registered only on http/https; skipped on file:// . */
var CACHE = "english-adventure-v53";
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
  /* custom-lessons.js is the teacher-published file: always try the network
     first so a replaced file takes effect without a service-worker bump. */
  if (e.request.url.indexOf("custom-lessons.js") >= 0) {
    e.respondWith(
      fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      });
    }).catch(function () { return caches.match("index.html"); })
  );
});
