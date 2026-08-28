/* English Adventure — teacher image library.
   Pictures are stored in the browser (IndexedDB) and referenced from lesson
   JSON as "img:<id>". Built-in artwork keeps using "svg:<scene>" and plain
   file paths ("assets/lesson-images/x.png") still work too. */

window.EA = window.EA || {};

EA.images = {
  DB: "english-adventure",
  STORE: "images",
  _urlCache: {},

  available: typeof indexedDB !== "undefined",

  _open: function () {
    var self = this;
    return new Promise(function (resolve, reject) {
      if (!self.available) return reject(new Error("Image storage is not available in this browser."));
      var req = indexedDB.open(self.DB, 1);
      req.onupgradeneeded = function () {
        if (!req.result.objectStoreNames.contains(self.STORE)) {
          req.result.createObjectStore(self.STORE, { keyPath: "id" });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  },

  _tx: function (mode, fn) {
    var self = this;
    return this._open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(self.STORE, mode);
        var out = fn(tx.objectStore(self.STORE));
        tx.oncomplete = function () { resolve(out && out.result !== undefined ? out.result : out); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  },

  /* Add one File. Returns the stored record. */
  add: function (file) {
    var self = this;
    if (!/^image\/(png|jpeg|gif|webp|svg\+xml)$/.test(file.type)) {
      return Promise.reject(new Error("\u201C" + file.name + "\u201D is not a supported image format (use PNG, JPG, GIF, WebP or SVG)."));
    }
    if (file.size > 500 * 1024) {
      return Promise.reject(new Error("\u201C" + file.name + "\u201D is larger than 500 KB. Please resize it first."));
    }
    var slug = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "image";
    var record = { id: slug + "-" + Date.now().toString(36).slice(-4), name: file.name, type: file.type, blob: file, addedAt: new Date().toISOString() };
    return this._tx("readwrite", function (store) { store.put(record); }).then(function () { return record; });
  },

  all: function () {
    return this._tx("readonly", function (store) { return store.getAll(); })
      .catch(function () { return []; });
  },

  get: function (id) {
    return this._tx("readonly", function (store) { return store.get(id); });
  },

  remove: function (id) {
    var self = this;
    if (this._urlCache[id]) { URL.revokeObjectURL(this._urlCache[id]); delete this._urlCache[id]; }
    return this._tx("readwrite", function (store) { store.delete(id); });
  },

  /* Object URL for <img src>, cached per page load. */
  url: function (id) {
    var self = this;
    if (this._urlCache[id]) return Promise.resolve(this._urlCache[id]);
    return this.get(id).then(function (rec) {
      if (!rec || !rec.blob) throw new Error("Image not found: " + id);
      var u = URL.createObjectURL(rec.blob);
      self._urlCache[id] = u;
      return u;
    });
  },

  ids: function () {
    return this.all().then(function (list) { return list.map(function (r) { return r.id; }); });
  }
};
