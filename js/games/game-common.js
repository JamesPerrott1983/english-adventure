/* English Adventure — shared bootstrap for the four game pages. */

window.EA = window.EA || {};

EA.game = {
  /* Loads the lesson from ?lesson=, renders the shared top bar into <main>,
     and returns { lesson, data, board } — or null after showing a friendly error. */
  boot: function (gameKey) {
    var main = EA.qs("main");
    var lessonId = EA.param("lesson");
    var lesson = lessonId ? EA.lessons.byId(lessonId) : null;
    var meta = EA.lessons.GAME_META[gameKey];

    if (!lesson || !lesson.games || !lesson.games[gameKey] || lesson.games[gameKey].enabled === false) {
      main.innerHTML = "";
      var card = EA.el("div", { class: "ea-card ea-center" });
      card.innerHTML = '<div style="width:110px;margin:0 auto;">' + EA.art.mascot("think") + "</div>" +
        "<h2>This game is taking a break!</h2>" +
        "<p>Let\u2019s choose a lesson and try again.</p>";
      card.appendChild(EA.el("a", { class: "ea-btn", href: (window.EA_BASE || "") + "lessons.html", text: "My Lessons" }));
      main.appendChild(card);
      return null;
    }

    document.title = meta.name + " — " + lesson.title + " — " + EA.config.appName;

    var top = EA.el("div", { class: "ea-game-top" });
    top.appendChild(EA.el("a", {
      class: "ea-btn ea-btn-soft", href: (window.EA_BASE || "") + "lesson.html?id=" + encodeURIComponent(lesson.id),
      "aria-label": "Back to lesson", text: "◀ Back"
    }));
    top.appendChild(EA.el("h1", { text: meta.icon + " " + meta.name }));
    top.appendChild(EA.el("div", { class: "ea-game-score", "data-score": "", text: "0 ⭐", "aria-live": "polite" }));
    main.appendChild(top);

    var board = EA.el("div", { id: "game-board" });
    main.appendChild(board);

    return { lesson: lesson, data: lesson.games[gameKey], board: board };
  },

  /* Progress dots for question sequences. */
  dots: function (total, current) {
    var wrap = EA.el("div", { class: "ea-progress-dots", "aria-label": "Question " + (current + 1) + " of " + total });
    for (var i = 0; i < total; i++) {
      var s = document.createElement("span");
      if (i < current) s.className = "done"; else if (i === current) s.className = "now";
      wrap.appendChild(s);
    }
    return wrap;
  },

  /* Shuffle that guarantees the result differs from the input order
     (important so Sentence Train never starts already solved). */
  shuffleDifferent: function (arr) {
    if (arr.length < 2) return arr.slice();
    var out, tries = 0;
    do { out = EA.rand.shuffle(arr); tries++; }
    while (tries < 12 && out.join("\u0001") === arr.join("\u0001"));
    if (out.join("\u0001") === arr.join("\u0001")) { var t = out[0]; out[0] = out[1]; out[1] = t; }
    return out;
  },

  instruction: function (en, cs) {
    var d = EA.el("div");
    d.appendChild(EA.el("p", { class: "ea-instruction", text: en }));
    if (cs) d.appendChild(EA.el("p", { class: "ea-cs", text: cs, lang: "cs" }));
    return d;
  }
};
