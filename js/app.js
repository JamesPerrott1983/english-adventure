/* English Adventure — core namespace, configuration and shared helpers.
   Classic scripts (no modules) so the app also runs from file:// . */

window.EA = window.EA || {};

/* ---------- Configuration (change the app name here) ---------- */
EA.config = {
  appName: "English Adventure",
  appNameShort: "Adventure",
  defaultLanguageVariant: "en-GB",
  builtInLessonIds: ["hello-goodbye-001"]
};

/* ---------- Settings ---------- */
EA.defaultSettings = {
  soundEnabled: true,
  czechSupportEnabled: true,
  reducedMotion: false,
  languageVariant: "en-GB",
  teacherPin: "",          // empty = no PIN
  randomSeed: ""           // empty = truly random; teachers may fix a seed
};

EA.settings = null;

EA.loadSettings = function () {
  EA.settings = Object.assign({}, EA.defaultSettings, EA.storage.get("ea.settings", {}));
  return EA.settings;
};
EA.saveSettings = function () { EA.storage.set("ea.settings", EA.settings); };

EA.applySettingsToPage = function () {
  document.body.classList.toggle("cs-on", !!EA.settings.czechSupportEnabled);
  document.body.classList.toggle("reduce-motion", !!EA.settings.reducedMotion);
};

/* ---------- Seeded random (mulberry32) ---------- */
EA.rand = (function () {
  var fn = Math.random;
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  return {
    init: function (seed) {
      if (seed) {
        var h = 0; String(seed).split("").forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) | 0; });
        fn = mulberry32(h);
      } else { fn = Math.random; }
    },
    next: function () { return fn(); },
    int: function (n) { return Math.floor(fn() * n); },
    pick: function (arr) { return arr[Math.floor(fn() * arr.length)]; },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(fn() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }
  };
})();

/* ---------- Small helpers ---------- */
EA.qs = function (sel, el) { return (el || document).querySelector(sel); };
EA.qsa = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
EA.el = function (tag, attrs, children) {
  var node = document.createElement(tag);
  if (attrs) Object.keys(attrs).forEach(function (k) {
    if (k === "text") node.textContent = attrs[k];
    else if (k === "html") node.innerHTML = attrs[k];
    else if (k.indexOf("on") === 0) node.addEventListener(k.slice(2), attrs[k]);
    else node.setAttribute(k, attrs[k]);
  });
  (children || []).forEach(function (c) { if (c) node.appendChild(c); });
  return node;
};
EA.param = function (name) {
  var m = new RegExp("[?&]" + name + "=([^&]*)").exec(location.search);
  return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
};

EA.positiveMessages = ["Great!", "Well done!", "Fantastic!", "Super!", "You did it!", "Brilliant!", "Nice work!", "Keep going!"];
EA.positiveMessagesCs = ["Skvěle!", "Výborně!", "Jen tak dál!"];
EA.retryMessages = ["Try again!", "Almost!", "Have another go!", "Look carefully."];
EA.retryListenMessages = ["Listen again.", "Almost!", "Have another go!"];

EA.toast = function (msg, ms) {
  var t = EA.el("div", { class: "ea-toast", role: "status", text: msg });
  document.body.appendChild(t);
  setTimeout(function () { t.remove(); }, ms || 1600);
};

EA.praise = function () {
  var msg = EA.rand.pick(EA.positiveMessages);
  if (EA.settings.czechSupportEnabled && EA.rand.next() < 0.25) {
    msg += " " + EA.rand.pick(EA.positiveMessagesCs);
  }
  return msg;
};

/* ---------- Page bootstrap (run on every page) ---------- */
EA.initPage = function () {
  EA.loadSettings();
  EA.rand.init(EA.settings.randomSeed);
  EA.applySettingsToPage();
  document.body.classList.add("ea-sky");
  if (EA.nav) EA.nav.build();
  EA.registerServiceWorker();
};

EA.registerServiceWorker = function () {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol !== "http:" && location.protocol !== "https:") return; // file:// — skip quietly
  var base = window.EA_BASE || "";
  navigator.serviceWorker.register(base + "sw.js").catch(function () { /* offline caching unavailable */ });
};

/* Detect file:// so pages can adjust behaviour (fetch of JSON is blocked). */
EA.isFileProtocol = location.protocol === "file:";
