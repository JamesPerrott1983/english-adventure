/* English Adventure — Spelling Bee engine.
   A word with missing letters (the teacher's pattern uses _ for gaps), a
   picture, and the full A–Z letter bank. The child taps or drags letters
   into the empty slots. Wrong letters shake; the Hint button makes a
   usable letter buzz. */

(function () {
  var ctx = EA.game.boot("spellingBee");
  if (!ctx) return;

  var items = ctx.data.items || [];
  EA.scoring.start(ctx.lesson.id, "spellingBee", items.length);

  var board = ctx.board;
  var index = 0;

  function startWord() {
    var item = items[index];
    var answer = item.answer;
    var pattern = item.pattern;
    var attempts = 0;

    board.innerHTML = "";
    board.appendChild(EA.game.dots(items.length, index));
    board.appendChild(EA.game.instruction("Spell the word!", "Doplň slovo!"));

    var scene = EA.el("div", { class: "sb-picture" });
    scene.appendChild(EA.art.imgNode(item.image || "svg:meeting", "Picture for the word to spell"));
    board.appendChild(scene);

    /* The word: fixed letters + gap slots */
    var wordRow = EA.el("div", { class: "sb-word", role: "group", "aria-label": "The word with missing letters" });
    var slots = []; // { el, letter } for gaps, in order
    for (var i = 0; i < pattern.length; i++) {
      if (pattern[i] === "_") {
        var slot = EA.el("div", { class: "sb-slot", "aria-label": "Missing letter" });
        slot.dataset.letter = answer[i];
        slots.push(slot);
        wordRow.appendChild(slot);
      } else {
        wordRow.appendChild(EA.el("div", { class: "sb-slot sb-fixed", text: answer[i] }));
      }
    }
    board.appendChild(wordRow);

    function nextGap() {
      return slots.filter(function (s) { return !s.classList.contains("sb-filled"); })[0] || null;
    }

    /* Full A–Z bank: tap to place, or drag onto a slot */
    var bank = EA.el("div", { class: "sb-bank", "aria-label": "Letters to choose from" });
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (ch) {
      var b = EA.el("button", { class: "sb-letter", text: ch, draggable: "true", "aria-label": "Letter " + ch });
      b.addEventListener("click", function () { tryPlace(ch, b, nextGap()); });
      b.addEventListener("dragstart", function (e) {
        if (e.dataTransfer) e.dataTransfer.setData("text/plain", ch);
      });
      bank.appendChild(b);
    });
    board.appendChild(bank);
    slots.forEach(function (slot) {
      slot.addEventListener("dragover", function (e) { e.preventDefault(); });
      slot.addEventListener("drop", function (e) {
        e.preventDefault();
        var ch = e.dataTransfer ? e.dataTransfer.getData("text/plain") : "";
        if (ch) tryPlace(ch, null, slot);
      });
    });

    var controls = EA.el("div", { class: "ea-center", style: "margin-top:12px" });
    var hintBtn = EA.el("button", { class: "ea-btn ea-btn-yellow", text: "Hint \uD83D\uDCA1" });
    hintBtn.addEventListener("click", function () {
      var gap = nextGap();
      if (!gap) return;
      var want = gap.dataset.letter.toUpperCase();
      var letter = EA.qsa(".sb-letter", bank).filter(function (b) { return b.textContent === want; })[0];
      if (letter) {
        letter.classList.add("sb-hint");
        setTimeout(function () { letter.classList.remove("sb-hint"); }, 1600);
      }
      gap.classList.add("sb-hint-slot");
      setTimeout(function () { gap.classList.remove("sb-hint-slot"); }, 1600);
    });
    controls.appendChild(hintBtn);
    board.appendChild(controls);

    function tryPlace(ch, bankBtn, slot) {
      if (!slot) return;
      var want = slot.dataset.letter;
      if (ch.toLowerCase() === want.toLowerCase()) {
        slot.textContent = want;          // show the answer's own case
        slot.classList.add("sb-filled");
        EA.feedback.correct(slot);
        EA.audio.speak(ch);
        if (!nextGap()) {
          attempts += slots.length ? 0 : 0;
          EA.scoring.answer(attempts === 0);
          EA.audio.complete();
          setTimeout(function () {
            EA.audio.speak(answer);
            EA.toast(answer + "! " + EA.praise(), 1400);
            index += 1;
            setTimeout(index < items.length ? startWord : function () { EA.scoring.finish(); }, 1200);
          }, 350);
        }
      } else {
        attempts += 1;
        var target = bankBtn || slot;
        EA.feedback.retry(target, "Not that letter \u2014 try again!");
      }
    }
  }

  startWord();
})();
