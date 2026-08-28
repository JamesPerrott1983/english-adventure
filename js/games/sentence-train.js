/* English Adventure — Sentence Train engine.
   Words appear on carriages; the child taps (or drags) them into order behind
   the locomotive. Punctuation stays attached to words; contractions are one
   carriage with an optional "What's = What is" info note. */

(function () {
  var ctx = EA.game.boot("sentenceTrain");
  if (!ctx) return;

  var items = ctx.data.items || [];
  var contractions = ctx.data.contractions || {};
  EA.scoring.start(ctx.lesson.id, "sentenceTrain", items.length);

  var index = 0;
  var board = ctx.board;
  var COLOURS = ["", "c2", "c3", "c4", "c5"];

  function startItem() {
    var item = items[index];
    var attempts = 0;
    board.innerHTML = "";
    board.appendChild(EA.game.dots(items.length, index));
    board.appendChild(EA.game.instruction("Build the sentence!", "Sestav větu!"));
    if (item.prompt) {
      var p = EA.el("p", { class: "ea-round-label ea-center", text: item.prompt });
      board.appendChild(p);
      if (item.promptCs) board.appendChild(EA.el("p", { class: "ea-cs ea-center", text: item.promptCs, lang: "cs" }));
    }

    if (item.image) {
      var scene = EA.el("div", { class: "st-scene" });
      scene.appendChild(EA.art.imgNode(item.image, item.prompt || ""));
      board.appendChild(scene);
    }

    /* Track: locomotive + slot area */
    var track = EA.el("div", { class: "st-track" });
    var locoWrap = EA.el("div", { class: "st-loco", "aria-hidden": "true" });
    locoWrap.innerHTML = EA.art.loco();
    var slotArea = EA.el("div", { class: "st-slot-area", "aria-label": "Your sentence", role: "list" });
    track.appendChild(locoWrap);
    track.appendChild(slotArea);
    board.appendChild(track);

    /* Tray of shuffled carriages (answer words + distractors) */
    var all = item.answer.concat(item.distractors || []);
    var shuffled = EA.game.shuffleDifferent(all);
    var tray = EA.el("div", { class: "st-tray", "aria-label": "Word carriages" });
    shuffled.forEach(function (word, i) {
      tray.appendChild(makeCarriage(word, COLOURS[i % COLOURS.length]));
    });
    board.appendChild(tray);

    function makeCarriage(word, colour) {
      var b = EA.el("button", { class: "st-carriage " + colour, text: word, "aria-label": "Word: " + word });
      b.addEventListener("click", function () {
        EA.audio.tap();
        if (b.parentNode === tray) { slotArea.appendChild(b); b.classList.add("st-placed"); }
        else { tray.appendChild(b); b.classList.remove("st-placed"); }
        b.classList.remove("st-first-hint");
      });
      return b;
    }

    /* Controls */
    var controls = EA.el("div", { class: "st-controls" });
    var checkBtn = EA.el("button", { class: "ea-btn ea-btn-green", text: "Check ✓" });
    var resetBtn = EA.el("button", { class: "ea-btn ea-btn-soft", text: "Reset ↺" });
    var hintBtn = EA.el("button", { class: "ea-btn ea-btn-yellow", text: "Hint 💡", disabled: "disabled" });
    controls.appendChild(checkBtn); controls.appendChild(resetBtn); controls.appendChild(hintBtn);
    board.appendChild(controls);

    /* Optional contraction info ("What's = What is") */
    var infoWords = all.filter(function (w) { return contractions[w.replace(/[.,!?]$/, "")] || contractions[w]; });
    if (infoWords.length) {
      var infoBtn = EA.el("button", { class: "lc-small-btn", text: "ℹ️ What does it mean?" });
      var info = EA.el("p", { class: "st-info", hidden: "hidden" });
      info.textContent = infoWords.map(function (w) {
        var key = contractions[w] ? w : w.replace(/[.,!?]$/, "");
        return w + " = " + contractions[key];
      }).join("   •   ");
      infoBtn.addEventListener("click", function () { info.hidden = !info.hidden; });
      var wrap = EA.el("div", { class: "ea-center", style: "margin-top:10px" });
      wrap.appendChild(infoBtn);
      board.appendChild(wrap);
      board.appendChild(info);
    }

    resetBtn.addEventListener("click", function () {
      EA.qsa(".st-carriage", slotArea).forEach(function (c) { tray.appendChild(c); c.classList.remove("st-placed"); });
    });

    hintBtn.addEventListener("click", function () {
      // Highlight the first correct word wherever it is.
      var first = item.answer[0];
      var target = EA.qsa(".st-carriage", board).filter(function (c) { return c.textContent === first; })[0];
      if (target) target.classList.add("st-first-hint");
    });

    checkBtn.addEventListener("click", function () {
      var placed = EA.qsa(".st-carriage", slotArea).map(function (c) { return c.textContent; });
      if (placed.length === 0) { EA.toast("Put some words on the train first!"); return; }
      /* Some sentences have more than one correct order (e.g. "white and
         yellow" / "yellow and white") — any listed order is accepted. */
      var accepted = [item.answer].concat(item.altAnswers || []);
      var key = placed.join("\u0001");
      var isRight = accepted.some(function (seq) { return key === seq.join("\u0001"); });
      if (isRight) {
        attempts += 1;
        EA.scoring.answer(attempts === 1);
        checkBtn.disabled = resetBtn.disabled = hintBtn.disabled = true;
        EA.feedback.correct(track, EA.praise());
        var sentence = placed.join(" ");
        EA.audio.speak(sentence);
        track.classList.add("st-drive");
        track.style.transition = "transform 1.6s ease-in";
        requestAnimationFrame(function () { track.style.transform = "translateX(110vw)"; });
        setTimeout(nextItem, 1700);
      } else {
        attempts += 1;
        EA.scoring.mistake();
        // Gently highlight the first wrong position
        var firstWrong = 0;
        while (firstWrong < placed.length && placed[firstWrong] === item.answer[firstWrong]) firstWrong++;
        var node = EA.qsa(".st-carriage", slotArea)[firstWrong];
        EA.feedback.retry(node || slotArea, "Almost! Try again.");
        if (attempts >= 2) hintBtn.disabled = false;   // hint unlocks after two tries
      }
    });
  }

  function nextItem() {
    index += 1;
    if (index < items.length) startItem();
    else EA.scoring.finish();
  }

  startItem();
})();
