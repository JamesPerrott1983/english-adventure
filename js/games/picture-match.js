/* English Adventure — Picture Match engine.
   Reads rounds from lesson.games.pictureMatch. Supports drag-and-drop AND
   tap-word-then-tap-picture. After two wrong tries the correct target glows. */

(function () {
  var ctx = EA.game.boot("pictureMatch");
  if (!ctx) return;

  var rounds = ctx.data.rounds || [];
  var totalItems = rounds.reduce(function (n, r) { return n + r.items.length; }, 0);
  EA.scoring.start(ctx.lesson.id, "pictureMatch", totalItems);

  var roundIndex = 0;
  var board = ctx.board;

  function startRound() {
    var round = rounds[roundIndex];
    board.innerHTML = "";
    board.appendChild(EA.el("p", { class: "ea-round-label", text: "Round " + (roundIndex + 1) + " of " + rounds.length }));
    board.appendChild(EA.game.instruction(round.instruction || "Match the words to the pictures.", round.instructionCs));

    var items = EA.rand.shuffle(round.items);       // picture positions randomised
    var words = EA.rand.shuffle(round.items.map(function (it) { return it.answer; })); // word order randomised

    var grid = EA.el("div", { class: "pm-board" });
    var targets = {};
    items.forEach(function (it) {
      var target = EA.el("div", { class: "pm-target", "data-answer": it.answer, tabindex: "0", role: "button", "aria-label": it.alt || it.answer });
      var img = EA.el("div", { class: "pm-img" });
      img.appendChild(EA.art.imgNode(it.image, it.alt));
      target.appendChild(img);
      target.appendChild(EA.el("div", { class: "pm-slot", text: "?" }));
      grid.appendChild(target);
      targets[it.answer] = target;
    });
    board.appendChild(grid);

    var tray = EA.el("div", { class: "pm-tray" });
    var state = { selected: null, remaining: words.length, attempts: {} };
    words.forEach(function (w) { state.attempts[w] = 0; });

    words.forEach(function (w) {
      var card = EA.el("button", { class: "pm-word", text: w, "aria-label": "Word card: " + w });
      tray.appendChild(card);

      /* Tap interaction */
      card.addEventListener("click", function () {
        EA.audio.tap();
        EA.qsa(".pm-word", tray).forEach(function (c) { c.classList.remove("pm-selected"); });
        if (state.selected === card) { state.selected = null; return; }
        state.selected = card;
        card.classList.add("pm-selected");
      });

      /* Drag interaction (pointer events cover mouse + touch) */
      card.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        var startX = e.clientX, startY = e.clientY, dragging = false;
        var rect = card.getBoundingClientRect();

        function move(ev) {
          if (!dragging && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 8) {
            dragging = true;
            card.classList.add("pm-dragging");
            card.style.width = rect.width + "px";
          }
          if (dragging) {
            card.style.left = (ev.clientX - rect.width / 2) + "px";
            card.style.top = (ev.clientY - 28) + "px";
          }
        }
        function up(ev) {
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerup", up);
          if (!dragging) return; // it was a tap; click handler deals with it
          card.classList.remove("pm-dragging");
          card.style.left = card.style.top = card.style.width = "";
          card.style.visibility = "hidden";
          var under = document.elementFromPoint(ev.clientX, ev.clientY);
          card.style.visibility = "";
          var target = under && under.closest ? under.closest(".pm-target") : null;
          if (target && !target.classList.contains("pm-done")) tryMatch(card, target);
        }
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
      });
    });
    board.appendChild(tray);

    /* Tap a picture after selecting a word */
    grid.addEventListener("click", function (e) {
      var target = e.target.closest(".pm-target");
      if (!target || target.classList.contains("pm-done") || !state.selected) return;
      tryMatch(state.selected, target);
    });
    grid.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && state.selected) {
        var target = e.target.closest(".pm-target");
        if (target && !target.classList.contains("pm-done")) { e.preventDefault(); tryMatch(state.selected, target); }
      }
    });

    function tryMatch(card, target) {
      var word = card.textContent;
      if (target.getAttribute("data-answer") === word) {
        state.attempts[word] += 1;
        EA.scoring.answer(state.attempts[word] === 1);
        target.classList.remove("pm-hint");
        target.classList.add("pm-done");
        target.querySelector(".pm-slot").textContent = word;
        target.appendChild(EA.el("span", { class: "pm-tick", text: "✅", "aria-hidden": "true" }));
        card.remove();
        state.selected = null;
        EA.feedback.correct(target);
        EA.audio.speak(word);
        state.remaining -= 1;
        if (state.remaining === 0) setTimeout(nextRound, 900);
      } else {
        state.attempts[word] += 1;
        card.classList.remove("pm-selected");
        state.selected = null;
        EA.feedback.retry(card);
        if (state.attempts[word] >= 2) {
          var correct = targets[word];
          if (correct && !correct.classList.contains("pm-done")) {
            correct.classList.add("pm-hint"); // visual hint after two tries
          }
        }
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
