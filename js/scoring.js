/* English Adventure — scoring, stars, badges and the end-of-game screen.
   Points per spec: first try = 2, after retry = 1, no penalties. */

window.EA = window.EA || {};

EA.scoring = {
  session: null,

  start: function (lessonId, gameKey, questionCount) {
    this.session = {
      lessonId: lessonId, gameKey: gameKey,
      questions: questionCount, answered: 0,
      score: 0, maxScore: questionCount * 2,
      mistakes: 0, done: false
    };
    EA.progress.touchLesson(lessonId);
    return this.session;
  },

  /* firstTry: true → 2 points, false → 1 point */
  answer: function (firstTry) {
    var s = this.session;
    s.answered += 1;
    s.score += firstTry ? 2 : 1;
    if (!firstTry) s.mistakes += 1;
    this._paint();
  },
  mistake: function () { this.session.mistakes += 1; },

  _paint: function () {
    var el = EA.qs("[data-score]");
    if (el) el.textContent = this.session.score + " ⭐";
  },

  starsFor: function (s) {
    var ratio = s.maxScore ? s.score / s.maxScore : 0;
    if (ratio >= 0.95) return 3;
    if (ratio >= 0.7) return 2;
    return 1;
  },

  gameBadges: {
    pictureMatch: "Picture Pro",
    sentenceTrain: "Sentence Builder",
    wordMatch: "Word Wizard",
    conversationComic: "Super Speaker",
    listenAndChoose: "Great Listener",
    spellingBee: "Spelling Star"
  },

  /* Call once at the end of a game. Shows the result overlay. */
  finish: function (opts) {
    opts = opts || {};
    var s = this.session;
    if (!s || s.done) return;
    s.done = true;

    var stars = this.starsFor(s);
    var perfect = s.score === s.maxScore && s.maxScore > 0;
    var badge = null;
    if (s.gameKey === "listenAndChoose") badge = this.gameBadges.listenAndChoose;      // for completing
    else if (perfect) badge = this.gameBadges[s.gameKey];                              // for a perfect run

    var lessonState = EA.progress.recordGame(s.lessonId, s.gameKey, {
      score: s.score, maxScore: s.maxScore, stars: stars, perfect: perfect, badge: badge
    });

    EA.audio.complete();
    this.showResults({
      stars: stars, score: s.score, maxScore: s.maxScore,
      badge: badge, perfect: perfect,
      lessonCompleted: lessonState.completed && opts.celebrateLesson !== false,
      lessonId: s.lessonId, gameKey: s.gameKey
    });
  },

  showResults: function (r) {
    var base = window.EA_BASE || "";
    var overlay = EA.el("div", { class: "ea-overlay", role: "dialog", "aria-modal": "true", "aria-label": "Game finished" });
    var card = EA.el("div", { class: "ea-card ea-pop" });

    var starsHtml = "";
    for (var i = 1; i <= 3; i++) starsHtml += '<span class="' + (i <= r.stars ? "" : "dim") + '">★</span>';

    card.innerHTML =
      '<div style="width:110px;margin:0 auto;">' + EA.art.mascot(r.stars >= 2 ? "cheer" : "wave") + "</div>" +
      "<h2>" + EA.praise() + "</h2>" +
      '<div class="ea-result-stars" aria-label="' + r.stars + ' of 3 stars">' + starsHtml + "</div>" +
      "<p>You earned <strong>" + r.stars + (r.stars === 1 ? " star" : " stars") + "</strong>! (" + r.score + " / " + r.maxScore + " points)</p>" +
      (r.badge ? '<div class="ea-badge-pill">🏅 ' + r.badge + "</div>" : "") +
      (r.lessonCompleted ? '<div class="ea-badge-pill" style="background:var(--colour-secondary);color:var(--colour-text)">🎉 Lesson complete!</div>' : "");

    var next = this._nextGame(r.lessonId, r.gameKey);
    var actions = EA.el("div", { class: "ea-overlay-actions" });
    actions.appendChild(EA.el("a", { class: "ea-btn ea-btn-soft", href: location.pathname + location.search, text: "Play Again" }));
    if (next) {
      actions.appendChild(EA.el("a", {
        class: "ea-btn ea-btn-green",
        href: base + "games/" + EA.lessons.GAME_META[next].page + "?lesson=" + encodeURIComponent(r.lessonId),
        text: "Next Game ▶"
      }));
    }
    actions.appendChild(EA.el("a", { class: "ea-btn", href: base + "lesson.html?id=" + encodeURIComponent(r.lessonId), text: "Back to Lesson" }));
    actions.appendChild(EA.el("a", { class: "ea-btn ea-btn-soft", href: base + "index.html", text: "Home" }));
    card.appendChild(actions);

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    var firstBtn = card.querySelector("a.ea-btn");
    if (firstBtn) firstBtn.focus();
  },

  _nextGame: function (lessonId, currentKey) {
    var lesson = EA.lessons.byId(lessonId);
    if (!lesson) return null;
    var keys = EA.lessons.enabledGameKeys(lesson);
    var L = EA.progress.lesson(lessonId);
    var idx = keys.indexOf(currentKey);
    // Prefer the next uncompleted game after this one, wrapping around.
    for (var i = 1; i <= keys.length; i++) {
      var k = keys[(idx + i) % keys.length];
      if (k !== currentKey && (!L.games[k] || !L.games[k].completed)) return k;
    }
    var after = keys[(idx + 1) % keys.length];
    return after !== currentKey ? after : null;
  }
};

/* Shared feedback helpers used by all games */
EA.feedback = {
  correct: function (node, msg) {
    EA.audio.correct();
    if (node) { node.classList.add("ea-pop"); setTimeout(function () { node.classList.remove("ea-pop"); }, 400); }
    EA.toast(msg || EA.praise(), 1300);
  },
  retry: function (node, msg) {
    EA.audio.retry();
    if (node) { node.classList.add("ea-shake"); setTimeout(function () { node.classList.remove("ea-shake"); }, 350); }
    EA.toast(msg || EA.rand.pick(EA.retryMessages), 1300);
  }
};
