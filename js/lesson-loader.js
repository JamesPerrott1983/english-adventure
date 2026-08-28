/* English Adventure — lesson loading and validation.
   Sources, in order: imported lessons (Teacher Area) → built-in lessons
   (embedded in js/lesson-data.js, mirrored by data/example-lesson.json). */

window.EA = window.EA || {};

EA.lessons = {
  THEMES: [
    { n: 0, name: "Introduction" },
    { n: 1, name: "My Classroom" },
    { n: 2, name: "My Family" },
    { n: 3, name: "My Home" },
    { n: 4, name: "My Room" },
    { n: 5, name: "Me and My Friends" },
    { n: 6, name: "My Pets" },
    { n: 7, name: "Christmas" },
    { n: 8, name: "Final Revision" }
  ],
  /* Stone positions on assets/backgrounds/map.jpg as [x,y] fractions,
     matching the nine shield shapes painted into the artwork. */
  THEME_STONES: [
    [0.167, 0.856], [0.319, 0.7], [0.504, 0.701],
    [0.763, 0.688], [0.683, 0.503], [0.497, 0.442],
    [0.357, 0.468], [0.38, 0.269], [0.689, 0.236]
  ],

  themeName: function (n) {
    var t = this.THEMES.filter(function (x) { return x.n === n; })[0];
    return t ? t.name : null;
  },

  /* "Unit 8 – What's This?" for numbered units, "Have Fun with English 1 – Title"
     for named units, else the plain title */
  displayTitle: function (lesson) {
    if (typeof lesson.unit === "number") return "Unit " + lesson.unit + " \u2013 " + lesson.title;
    if (typeof lesson.unit === "string" && lesson.unit.trim()) return lesson.unit.trim() + " \u2013 " + lesson.title;
    return lesson.title;
  },

  /* Teacher-facing title including the page: "Unit 1 – Hello! Hi! – P6" */
  displayTitleWithPage: function (lesson) {
    return this.displayTitle(lesson) + (typeof lesson.page === "number" ? " \u2013 P" + lesson.page : "");
  },

  /* { themes: {0:[...],...}, unassigned: [...] } using active lessons */
  byTheme: function (list) {
    var out = { themes: {}, unassigned: [] };
    this.THEMES.forEach(function (t) { out.themes[t.n] = []; });
    (list || this.active()).forEach(function (l) {
      if (typeof l.theme === "number" && out.themes[l.theme]) out.themes[l.theme].push(l);
      else out.unassigned.push(l);
    });
    Object.keys(out.themes).forEach(function (k) {
      out.themes[k].sort(function (a, b) {
        var an = typeof a.unit === "number", bn = typeof b.unit === "number";
        if (an && bn) return a.unit - b.unit || (a.page || 0) - (b.page || 0);
        if (an) return -1;            // numbered units first
        if (bn) return 1;
        return (a.page || 0) - (b.page || 0) || String(a.unit || "").localeCompare(String(b.unit || ""));
      });
    });
    return out;
  },

  SCENE_NAMES: ["meeting","meeting2","leaving","leaving2","leaving-girl","introduce-girl","introduce-girl2","introduce-boy","introduce-boy2","wave-boy","wave-boy2","wave-girl","question","question2","school-playground"],
  GAME_KEYS: ["pictureMatch", "sentenceTrain", "wordMatch", "conversationComic", "listenAndChoose", "spellingBee"],
  GAME_META: {
    pictureMatch:      { name: "Picture Match",      icon: "🖼️", page: "picture-match.html",      colour: "var(--colour-primary)" },
    sentenceTrain:     { name: "Sentence Train",     icon: "🚂", page: "sentence-train.html",     colour: "var(--colour-accent)" },
    wordMatch:         { name: "Word Match",         icon: "🔤", page: "word-match.html",         colour: "var(--colour-secondary)" },
    conversationComic: { name: "Conversation Comic", icon: "💬", page: "conversation-comic.html", colour: "var(--colour-success)" },
    listenAndChoose:   { name: "Listen and Choose",  icon: "👂", page: "listen-and-choose.html",  colour: "var(--colour-purple)" },
    spellingBee:       { name: "Spelling Bee",       icon: "🐝", page: "spelling-bee.html",       colour: "var(--colour-secondary)" }
  },

  all: function () {
    var imported = EA.importedLessons.all();
    var importedIds = imported.map(function (l) { return l.id; });
    var builtIn = (EA.builtInLessons || []).filter(function (l) {
      return importedIds.indexOf(l.id) < 0 && !EA.lessonFlags.isHidden(l.id);
    });
    return builtIn.concat(imported);
  },

  active: function () {
    return this.all().filter(function (l) { return EA.lessonFlags.isActive(l.id); });
  },

  byId: function (id) {
    return this.all().filter(function (l) { return l.id === id; })[0] || null;
  },

  isBuiltIn: function (id) {
    return (EA.builtInLessons || []).some(function (l) { return l.id === id; });
  },

  enabledGameKeys: function (lesson) {
    var self = this;
    return this.GAME_KEYS.filter(function (k) {
      var g = lesson.games && lesson.games[k];
      return g && g.enabled !== false && self._hasContent(k, g);
    });
  },

  _hasContent: function (key, g) {
    if (key === "pictureMatch") return (g.rounds || []).length > 0;
    if (key === "sentenceTrain") return (g.items || []).length > 0;
    if (key === "wordMatch") return (g.rounds || []).length > 0;
    if (key === "conversationComic") return (g.scenes || []).length > 0;
    if (key === "listenAndChoose") {
      return (g.items || []).length > 0 || (g.rounds || []).some(function (r) { return (r.items || []).length > 0; });
    }
    if (key === "spellingBee") return (g.items || []).length > 0;
    return false;
  },

  /* ---------- Validation (Teacher Area import, section 19.3) ----------
     Returns { ok: bool, errors: [], warnings: [] } */
  validate: function (lesson) {
    var errors = [], warnings = [], self = this;
    function err(m) { errors.push(m); }
    function warn(m) { warnings.push(m); }

    if (!lesson || typeof lesson !== "object") { return { ok: false, errors: ["The file does not contain a lesson object."], warnings: [] }; }
    if (!lesson.id || typeof lesson.id !== "string") err("The lesson needs an \"id\" (a short unique text value).");
    if (!lesson.title) err("The lesson needs a \"title\".");
    if (!lesson.learningObjectives || !lesson.learningObjectives.length) err("Add at least one entry in \"learningObjectives\".");
    if (lesson.theme != null && (typeof lesson.theme !== "number" || lesson.theme < 0 || lesson.theme > 8 || lesson.theme % 1 !== 0)) {
      err("\"theme\" must be a whole number from 0 to 8.");
    }
    if (lesson.unit != null) {
      if (typeof lesson.unit === "number") {
        if (lesson.unit < 1 || lesson.unit > 28 || lesson.unit % 1 !== 0) warn("Numbered units are usually whole numbers from 1 to 28.");
      } else if (typeof lesson.unit !== "string" || !lesson.unit.trim()) {
        warn("\"unit\" should be a number (1\u201328) or a short name like \u201CHave Fun with English 1\u201D.");
      }
    }
    if (lesson.page != null && (typeof lesson.page !== "number" || lesson.page < 1)) {
      warn("\"page\" should be a positive page number from the workbook.");
    }
    if (lesson.theme == null) warn("This lesson has no \"theme\" (0\u20138), so it will appear under \u201COther lessons\u201D instead of on the map.");
    if (lesson.schemaVersion !== 1) warn("schemaVersion is not 1 — this lesson may come from a newer version of the app.");
    if (!lesson.games || typeof lesson.games !== "object") { err("The lesson needs a \"games\" object."); return { ok: false, errors: errors, warnings: warnings }; }

    var enabled = this.GAME_KEYS.filter(function (k) {
      var g = lesson.games[k]; return g && g.enabled !== false && self._hasContent(k, g);
    });
    if (!enabled.length) err("At least one game must contain content.");

    function checkDuplicates(options, where) {
      var seen = {};
      options.forEach(function (o) {
        if (o == null) return; // a missing value is reported separately
        var v = typeof o === "string" ? o : (o.alt || o.image);
        if (!v) return;
        if (seen[v]) err(where + ": the option \"" + v + "\" appears twice, which makes the answer ambiguous.");
        seen[v] = true;
      });
    }

    var pm = lesson.games.pictureMatch;
    if (pm && pm.enabled !== false) (pm.rounds || []).forEach(function (r, i) {
      var where = "Picture Match round " + (i + 1);
      if (!r.items || r.items.length < 2) err(where + " needs at least 2 items.");
      (r.items || []).forEach(function (it, j) {
        if (!it.answer) err(where + ", item " + (j + 1) + " is missing an \"answer\".");
        if (!it.image) err(where + ", item " + (j + 1) + " is missing an \"image\".");
        if (!it.alt) warn(where + ", item " + (j + 1) + " has no \"alt\" text (needed for accessibility).");
        if (it.image && it.image.indexOf("svg:") !== 0 && it.image.indexOf("img:") !== 0 && !/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(it.image)) {
          err(where + ", item " + (j + 1) + ": \"" + it.image + "\" is not a supported image format.");
        }
      });
      if (r.items) checkDuplicates(r.items.map(function (it) { return it.answer; }), where);
    });

    var st = lesson.games.sentenceTrain;
    if (st && st.enabled !== false) (st.items || []).forEach(function (it, i) {
      var where = "Sentence Train item " + (i + 1);
      if (!it.answer || !it.answer.length) err(where + " is missing an \"answer\" word list.");
      (it.distractors || []).forEach(function (d) {
        if ((it.answer || []).indexOf(d) >= 0) err(where + ": the distractor \"" + d + "\" is also in the answer, which makes the sentence ambiguous.");
      });
      (it.altAnswers || []).forEach(function (alt, ai) {
        var a = (it.answer || []).slice().sort().join("\u0001");
        var b = (alt || []).slice().sort().join("\u0001");
        if (a !== b) warn(where + ": alternative answer " + (ai + 1) + " uses different words from the main answer, so it can never be built from the word tiles.");
      });
    });

    var wm = lesson.games.wordMatch;
    if (wm && wm.enabled !== false) (wm.rounds || []).forEach(function (r, i) {
      var where = "Word Match round " + (i + 1);
      if (!r.pairs || r.pairs.length < 2) err(where + " needs at least 2 word pairs.");
      (r.pairs || []).forEach(function (p, j) {
        if (!p.en) err(where + ", pair " + (j + 1) + " is missing the English word (\"en\").");
        if (!p.cs) err(where + ", pair " + (j + 1) + " is missing the Czech word (\"cs\").");
      });
      if (r.pairs) {
        checkDuplicates(r.pairs.map(function (p) { return p.en; }), where + " (English side)");
        checkDuplicates(r.pairs.map(function (p) { return p.cs; }), where + " (Czech side)");
      }
      if (r.pairs && r.pairs.length > 10) warn(where + " has more than 10 pairs — 5\u201310 works best for this age group.");
    });

    var cc = lesson.games.conversationComic;
    if (cc && cc.enabled !== false) (cc.scenes || []).forEach(function (s, i) {
      var where = "Conversation Comic scene " + (i + 1);
      if (!s.text) err(where + " is missing \"text\".");
      if (!s.options || s.options.length < 2) err(where + " needs at least 2 options.");
      if (s.options && s.options.indexOf(s.answer) < 0) err(where + ": the \"answer\" must be one of the \"options\".");
      if (s.options) checkDuplicates(s.options, where);
    });

    var sb = lesson.games.spellingBee;
    if (sb && sb.enabled !== false) (sb.items || []).forEach(function (it, i) {
      var where = "Spelling Bee word " + (i + 1);
      var answer = (it.answer || "").trim();
      var pattern = (it.pattern || "").trim();
      if (!answer) err(where + " is missing the \"answer\" word.");
      if (!pattern) err(where + " is missing the \"pattern\" (use _ for hidden letters).");
      if (answer && pattern) {
        if (pattern.length !== answer.length) {
          err(where + ": the pattern \"" + pattern + "\" must have exactly one character per letter of \"" + answer + "\" (" + answer.length + ").");
        } else {
          if (pattern.indexOf("_") < 0) warn(where + ": the pattern has no _ gaps, so there is nothing to spell.");
          for (var pi = 0; pi < pattern.length; pi++) {
            if (pattern[pi] !== "_" && pattern[pi].toLowerCase() !== answer[pi].toLowerCase()) {
              err(where + ": position " + (pi + 1) + " of the pattern is \"" + pattern[pi] + "\" but the word has \"" + answer[pi] + "\".");
              break;
            }
          }
        }
      }
      if (!it.image) warn(where + " has no picture.");
    });

    var lc = lesson.games.listenAndChoose;
    var lcRounds = lc ? (lc.rounds && lc.rounds.length ? lc.rounds : (lc.items ? [{ items: lc.items }] : [])) : [];
    if (lc && lc.enabled !== false) lcRounds.forEach(function (round, ri) {
      (round.items || []).forEach(function (it, i) {
      var where = "Listen and Choose" + (lcRounds.length > 1 ? " round " + (ri + 1) + "," : "") + " item " + (i + 1);
      if (!it.audio) err(where + " is missing \"audio\" text.");
      if (!it.options || it.options.length < 2) err(where + " needs at least 2 options.");
      if (typeof it.answerIndex !== "number" || !it.options || !it.options[it.answerIndex]) {
        err(where + ": \"answerIndex\" does not point at one of the options.");
      }
      if (it.audioSrc && !/\.(mp3|ogg|wav|m4a)$/i.test(it.audioSrc)) {
        err(where + ": \"" + it.audioSrc + "\" is not a supported audio format.");
      }
      if (it.options) checkDuplicates(it.options, where);
      });
    });

    return { ok: errors.length === 0, errors: errors, warnings: warnings };
  }
};
