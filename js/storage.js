/* English Adventure — storage utilities.
   localStorage: settings, progress, imported lessons (JSON only, < 500 KB each).
   Schema is versioned so future releases can migrate. */

window.EA = window.EA || {};

EA.storage = {
  available: (function () {
    try { localStorage.setItem("ea.test", "1"); localStorage.removeItem("ea.test"); return true; }
    catch (e) { return false; }
  })(),
  _mem: {},
  get: function (key, fallback) {
    try {
      var raw = this.available ? localStorage.getItem(key) : this._mem[key];
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  },
  set: function (key, value) {
    try {
      var raw = JSON.stringify(value);
      if (this.available) localStorage.setItem(key, raw); else this._mem[key] = raw;
      return true;
    } catch (e) { return false; }
  },
  remove: function (key) {
    if (this.available) localStorage.removeItem(key); else delete this._mem[key];
  }
};

/* ---------- Progress ----------
   {
     schemaVersion: 1,
     lessons: { [lessonId]: {
        games: { [gameKey]: { stars, bestScore, attempts, completed } },
        completed: bool, lastOpened: iso, badges: [..]
     }},
     badges: [ globalBadges ]
   } */
EA.progress = {
  key: "ea.progress",
  load: function () {
    var p = EA.storage.get(this.key, null);
    if (!p || p.schemaVersion !== 1) p = { schemaVersion: 1, lessons: {}, badges: [] };
    return p;
  },
  save: function (p) { EA.storage.set(this.key, p); },

  lesson: function (lessonId) {
    var p = this.load();
    return p.lessons[lessonId] || { games: {}, completed: false, badges: [] };
  },

  recordGame: function (lessonId, gameKey, result) {
    // result: { score, maxScore, stars, perfect, badge }
    var p = this.load();
    var L = p.lessons[lessonId] = p.lessons[lessonId] || { games: {}, completed: false, badges: [] };
    var g = L.games[gameKey] = L.games[gameKey] || { stars: 0, bestScore: 0, attempts: 0, completed: false };
    g.attempts += 1;
    g.completed = true;
    g.bestScore = Math.max(g.bestScore, result.score);
    g.stars = Math.max(g.stars, result.stars);
    if (result.badge && L.badges.indexOf(result.badge) < 0) L.badges.push(result.badge);
    L.lastOpened = new Date().toISOString();

    // Lesson completion: all enabled games completed
    var lesson = EA.lessons.byId(lessonId);
    if (lesson) {
      var keys = EA.lessons.enabledGameKeys(lesson);
      var all = keys.length > 0 && keys.every(function (k) { return L.games[k] && L.games[k].completed; });
      if (all && !L.completed) {
        L.completed = true;
        if (L.badges.indexOf("Lesson Star") < 0) L.badges.push("Lesson Star");
      }
    }
    this.save(p);
    return L;
  },

  touchLesson: function (lessonId) {
    var p = this.load();
    var L = p.lessons[lessonId] = p.lessons[lessonId] || { games: {}, completed: false, badges: [] };
    L.lastOpened = new Date().toISOString();
    this.save(p);
  },

  totalStars: function () {
    var p = this.load(), total = 0;
    Object.keys(p.lessons).forEach(function (id) {
      var L = p.lessons[id];
      Object.keys(L.games).forEach(function (k) { total += L.games[k].stars || 0; });
    });
    return total;
  },

  allBadges: function () {
    var p = this.load(), out = [];
    Object.keys(p.lessons).forEach(function (id) {
      (p.lessons[id].badges || []).forEach(function (b) { if (out.indexOf(b) < 0) out.push(b); });
    });
    return out;
  },

  reset: function () { EA.storage.remove(this.key); },

  exportJson: function () { return JSON.stringify(this.load(), null, 2); },
  importJson: function (text) {
    var data = JSON.parse(text);
    if (!data || data.schemaVersion !== 1 || typeof data.lessons !== "object") {
      throw new Error("This is not a valid progress file.");
    }
    this.save(data);
  }
};

/* ---------- Imported lessons (Teacher Area) ---------- */
EA.importedLessons = {
  key: "ea.importedLessons",
  all: function () { return EA.storage.get(this.key, []); },
  save: function (list) { return EA.storage.set(this.key, list); },
  add: function (lesson) {
    var list = this.all();
    if (list.some(function (l) { return l.id === lesson.id; })) {
      throw new Error("A lesson with the ID \"" + lesson.id + "\" already exists. Lesson IDs must be unique.");
    }
    list.push(lesson);
    if (!this.save(list)) throw new Error("Could not save the lesson. Browser storage may be full or unavailable.");
  },
  remove: function (id) { this.save(this.all().filter(function (l) { return l.id !== id; })); },
  update: function (lesson) {
    this.save(this.all().map(function (l) { return l.id === lesson.id ? lesson : l; }));
  }
};

/* ---------- Deactivated lesson ids ---------- */
EA.lessonFlags = {
  key: "ea.lessonFlags",
  get: function () {
    var f = EA.storage.get(this.key, {});
    return { deactivated: f.deactivated || [], hidden: f.hidden || [] };
  },
  isActive: function (id) { return this.get().deactivated.indexOf(id) < 0; },
  setActive: function (id, active) {
    var f = this.get();
    f.deactivated = f.deactivated.filter(function (x) { return x !== id; });
    if (!active) f.deactivated.push(id);
    EA.storage.set(this.key, f);
  },
  /* "Deleting" a built-in lesson hides it on this device (it ships in code). */
  isHidden: function (id) { return this.get().hidden.indexOf(id) >= 0; },
  hide: function (id) {
    var f = this.get();
    if (f.hidden.indexOf(id) < 0) f.hidden.push(id);
    EA.storage.set(this.key, f);
  },
  unhideAll: function () {
    var f = this.get();
    f.hidden = [];
    EA.storage.set(this.key, f);
  }
};
