/* English Adventure — Word Match engine.
   English words on the left, Czech words on the right. The child clicks a word
   on either side, then its partner on the other side. Matched pairs turn green
   and lock. The round ends when every pair is matched. */

(function () {
  var ctx = EA.game.boot("wordMatch");
  if (!ctx) return;

  var rounds = ctx.data.rounds || [];
  var totalPairs = rounds.reduce(function (n, r) { return n + r.pairs.length; }, 0);
  EA.scoring.start(ctx.lesson.id, "wordMatch", totalPairs);

  var roundIndex = 0;
  var board = ctx.board;

  function startRound() {
    var round = rounds[roundIndex];
    board.innerHTML = "";
    if (rounds.length > 1) {
      board.appendChild(EA.el("p", { class: "ea-round-label", text: "Round " + (roundIndex + 1) + " of " + rounds.length }));
    }
    board.appendChild(EA.game.instruction(
      round.instruction || "Match the English and Czech words.",
      round.instructionCs || "Spoj anglická a česká slova."
    ));

    var pairs = round.pairs;
    var csOf = {}, enOf = {};
    pairs.forEach(function (p) { csOf[p.en] = p.cs; enOf[p.cs] = p.en; });

    var grid = EA.el("div", { class: "wm-board" });
    var colEn = EA.el("div", { class: "wm-col", role: "list", "aria-label": "English words" });
    var colCs = EA.el("div", { class: "wm-col", role: "list", "aria-label": "Czech words", lang: "cs" });
    grid.appendChild(colEn); grid.appendChild(colCs);
    board.appendChild(grid);

    var state = { sel: null, remaining: pairs.length, attempts: {} };
    pairs.forEach(function (p) { state.attempts[p.en] = 0; });

    function makeButton(word, side) {
      var b = EA.el("button", {
        class: "wm-word wm-" + side, text: word,
        "aria-pressed": "false",
        "aria-label": (side === "en" ? "English word: " : "Czech word: ") + word
      });
      b.addEventListener("click", function () { pick(b, word, side); });
      return b;
    }

    EA.rand.shuffle(pairs.map(function (p) { return p.en; })).forEach(function (w) { colEn.appendChild(makeButton(w, "en")); });
    EA.rand.shuffle(pairs.map(function (p) { return p.cs; })).forEach(function (w) { colCs.appendChild(makeButton(w, "cs")); });

    function deselect() {
      if (state.sel) { state.sel.btn.classList.remove("wm-selected"); state.sel.btn.setAttribute("aria-pressed", "false"); }
      state.sel = null;
    }

    function pick(btn, word, side) {
      if (btn.disabled) return;
      EA.audio.tap();

      if (!state.sel) {
        state.sel = { btn: btn, word: word, side: side };
        btn.classList.add("wm-selected"); btn.setAttribute("aria-pressed", "true");
        return;
      }
      if (state.sel.btn === btn) { deselect(); return; }             // tap again to unselect
      if (state.sel.side === side) {                                  // switch selection within a column
        deselect();
        state.sel = { btn: btn, word: word, side: side };
        btn.classList.add("wm-selected"); btn.setAttribute("aria-pressed", "true");
        return;
      }

      /* One word from each side: check the pair */
      var en = side === "en" ? word : state.sel.word;
      var cs = side === "cs" ? word : state.sel.word;
      var selBtn = state.sel.btn;
      state.attempts[en] += 1;

      if (csOf[en] === cs) {
        EA.scoring.answer(state.attempts[en] === 1);
        [btn, selBtn].forEach(function (x) {
          x.classList.remove("wm-selected");
          x.classList.add("wm-done");
          x.disabled = true;
          x.setAttribute("aria-pressed", "false");
        });
        state.sel = null;
        EA.feedback.correct(btn);
        EA.audio.speak(en);
        state.remaining -= 1;
        if (state.remaining === 0) setTimeout(nextRound, 900);
      } else {
        EA.feedback.retry(btn);
        selBtn.classList.add("ea-shake");
        setTimeout(function () { selBtn.classList.remove("ea-shake"); }, 350);
        deselect();
      }
    }
  }

  function nextRound() {
    roundIndex += 1;
    if (roundIndex < rounds.length) {
      EA.toast("Round " + roundIndex + " done! " + EA.praise(), 1500);
      setTimeout(startRound, 600);
    } else {
      EA.scoring.finish();
    }
  }

  startRound();
})();
