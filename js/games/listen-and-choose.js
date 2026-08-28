/* English Adventure — Listen and Choose engine.
   Types: picture | phrase | response | gap.
   Audio preference: item.audioSrc (recorded file) → speech synthesis (en-GB).
   If neither is available, the written prompt is shown so no child is blocked. */

(function () {
  var ctx = EA.game.boot("listenAndChoose");
  if (!ctx) return;

  /* Rounds are optional: a flat "items" list plays as one round. */
  var rounds = (ctx.data.rounds && ctx.data.rounds.length)
    ? ctx.data.rounds
    : [{ items: ctx.data.items || [] }];
  var totalItems = rounds.reduce(function (n, r) { return n + (r.items || []).length; }, 0);
  EA.scoring.start(ctx.lesson.id, "listenAndChoose", totalItems);

  var board = ctx.board;
  var roundIndex = 0;
  var index = 0;
  var speechOk = EA.audio.speechAvailable();

  EA.audio.init();

  function startItem() {
    var round = rounds[roundIndex];
    var items = round.items;
    var item = items[index];
    var attempts = 0;
    var played = false;
    var playing = false;
    var noAudio = !item.audioSrc && !speechOk;

    board.innerHTML = "";
    if (rounds.length > 1) {
      board.appendChild(EA.el("p", { class: "ea-round-label", text: "Round " + (roundIndex + 1) + " of " + rounds.length }));
    }
    board.appendChild(EA.game.dots(items.length, index));
    board.appendChild(EA.game.instruction(
      item.type === "response" ? "Listen. Choose the best answer." : "Listen. What do you hear?",
      item.type === "response" ? "Poslouchej a vyber nejlepší odpověď." : "Poslouchej. Co slyšíš?"
    ));

    /* Audio row */
    var row = EA.el("div", { class: "lc-audio-row" });
    var playBtn = EA.el("button", { class: "lc-play", "aria-label": "Play the audio", text: "🔊" });
    var wave = EA.el("div", { class: "lc-wave", "aria-hidden": "true", html: "<span></span><span></span><span></span><span></span><span></span>" });
    var slowBtn = EA.el("button", { class: "lc-small-btn", text: "🐢 Slow" });
    row.appendChild(playBtn); row.appendChild(wave); row.appendChild(slowBtn);
    board.appendChild(row);

    var optionsWrap = EA.el("div");
    board.appendChild(optionsWrap);

    if (noAudio) {
      // Accessibility fallback: sound is not available on this device.
      var note = EA.el("p", { class: "ea-note", text: "We can\u2019t play sound on this device, so here is the sentence to read: \u201C" + item.audio + "\u201D" });
      board.insertBefore(note, row);
      played = true;
      renderOptions();
    }

    function play(slow) {
      if (playing) return;
      playing = true;
      wave.classList.add("playing");
      optionsWrap.style.pointerEvents = "none";   // answers stay locked while audio plays
      optionsWrap.setAttribute("aria-hidden", "true");
      var finished = function () {
        playing = false;
        wave.classList.remove("playing");
        optionsWrap.style.pointerEvents = "";
        optionsWrap.removeAttribute("aria-hidden");
        if (!played) { played = true; renderOptions(); }
      };
      var ok = EA.audio.speak(item.audio, { slow: slow, src: item.audioSrc, onend: finished });
      if (!ok) finished();
      // Safety net in case onend never fires (some browsers)
      setTimeout(function () { if (playing) finished(); }, 6000);
    }
    playBtn.addEventListener("click", function () { play(false); });
    slowBtn.addEventListener("click", function () { play(true); });

    function renderOptions() {
      optionsWrap.innerHTML = "";
      if (item.type === "gap" && item.display) {
        optionsWrap.appendChild(EA.el("p", { class: "lc-gap", text: item.display }));
      }

      // Shuffle options while remembering which is correct.
      var opts = item.options.map(function (o, i) { return { value: o, correct: i === item.answerIndex }; });
      opts = EA.rand.shuffle(opts);

      var isPicture = item.type === "picture";
      var grid = EA.el("div", { class: "lc-options" + (isPicture ? "" : " lc-text-options") });
      opts.forEach(function (o) {
        var b = EA.el("button", { class: "lc-option" });
        if (isPicture) {
          var img = EA.el("div", { class: "lc-img" });
          img.appendChild(EA.art.imgNode(o.value.image, o.value.alt));
          b.appendChild(img);
          b.setAttribute("aria-label", o.value.alt || "Picture option");
        } else {
          b.textContent = o.value;
        }
        b.addEventListener("click", function () {
          if (o.correct) {
            attempts += 1;
            EA.scoring.answer(attempts === 1);
            b.classList.add("lc-correct");
            EA.feedback.correct(b);
            grid.style.pointerEvents = "none";
            setTimeout(nextItem, 1000);
          } else {
            attempts += 1;
            b.classList.add("lc-wrong");
            b.disabled = true;
            EA.feedback.retry(b, EA.rand.pick(EA.retryListenMessages));
          }
        });
        grid.appendChild(b);
      });
      optionsWrap.appendChild(grid);
    }
  }

  function nextItem() {
    index += 1;
    if (index < rounds[roundIndex].items.length) { startItem(); return; }
    roundIndex += 1;
    index = 0;
    if (roundIndex < rounds.length) {
      EA.toast("Round " + roundIndex + " done! " + EA.praise(), 1500);
      setTimeout(startItem, 600);
    } else {
      EA.scoring.finish();
    }
  }

  startItem();
})();
