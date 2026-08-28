/* English Adventure — Conversation Comic engine (worksheet-style layout).
   Two characters face each other from the sides; speech bubbles stack in the
   middle, colour-coded with tails pointing to whoever is talking, and the
   listener dims slightly. Mechanics unchanged: the child picks the sentence
   (from three choices at the bottom) that fills the dashed reply bubble,
   then the whole comic replays with speech. */

(function () {
  var ctx = EA.game.boot("conversationComic");
  if (!ctx) return;

  var scenes = ctx.data.scenes || [];
  var chars = ctx.data.characters || [];
  if (!chars.length) chars = [{ id: "anna", name: "Anna" }, { id: "max", name: "Max" }];
  var names = {};
  chars.forEach(function (c) { names[c.id] = c.name; });

  /* Sides are assigned as characters first appear (the first two characters
     seed left/right, so classic two-person comics look exactly as before).
     Comics with several pairs of people swap the on-stage figures per scene. */
  var sideById = {};
  sideById[chars[0].id] = "left";
  if (chars[1]) sideById[chars[1].id] = "right";
  function sideOf(id) { return sideById[id] || "left"; }
  function ensureSides(scene) {
    var sp = scene.speaker, re = scene.responseSpeaker;
    if (!(sp in sideById)) sideById[sp] = (sideById[re] === "left") ? "right" : "left";
    if (!(re in sideById)) sideById[re] = (sideById[sp] === "left") ? "right" : "left";
  }
  function figureHtml(id, flip, side) {
    return EA.art.figure(id, flip, "stand") +
      '<div class="cc-name cc-name-' + side + '">' + (names[id] || id) + "</div>";
  }
  function updateFigures(aId, bId) {
    var leftId = sideOf(aId) === "left" ? aId : bId;
    var rightId = leftId === aId ? bId : aId;
    if (figLeft.dataset.who !== leftId) { figLeft.innerHTML = figureHtml(leftId, false, "left"); figLeft.dataset.who = leftId; }
    if (figRight.dataset.who !== rightId) { figRight.innerHTML = figureHtml(rightId, true, "right"); figRight.dataset.who = rightId; }
  }

  EA.scoring.start(ctx.lesson.id, "conversationComic", scenes.length);

  var board = ctx.board;
  board.appendChild(EA.game.instruction("Choose the best bubble!", "Vyber správnou bublinu!"));

  /* Stage: left figure | bubble column | right figure */
  var stage = EA.el("div", { class: "cc-stage" });
  var figLeft = EA.el("div", { class: "cc-fig" });
  var col = EA.el("div", { class: "cc-col", "aria-live": "polite" });
  var figRight = EA.el("div", { class: "cc-fig" });
  stage.appendChild(figLeft); stage.appendChild(col); stage.appendChild(figRight);
  updateFigures(chars[0].id, (chars[1] || chars[0]).id);
  board.appendChild(stage);

  var optionsArea = EA.el("div", { class: "cc-options" });
  board.appendChild(optionsArea);

  function setActive(speakerId) {
    var side = sideOf(speakerId);
    figLeft.classList.toggle("cc-listening", side !== "left");
    figRight.classList.toggle("cc-listening", side !== "right");
  }

  /* A bubble on the speaker's side. text=null → dashed "waiting" bubble. */
  function addBubble(speakerId, text) {
    var b = EA.el("div", {
      class: "cc-bub cc-b-" + sideOf(speakerId) + (text ? "" : " cc-empty"),
      "aria-label": (names[speakerId] || speakerId) + (text ? " says: " + text : " is thinking of a reply")
    });
    fillBubble(b, text);
    col.appendChild(b);
    b.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return b;
  }

  function fillBubble(b, text) {
    b.innerHTML = "";
    if (text) {
      b.classList.remove("cc-empty");
      var say = EA.el("button", { class: "cc-say", text: text, "aria-label": "Hear: " + text });
      say.addEventListener("click", function () { EA.audio.speak(text); });
      b.appendChild(say);
    } else {
      b.textContent = "…?";
    }
  }

  var sceneIndex = 0;
  var transcript = []; // { speakerId, text }

  function playScene() {
    var scene = scenes[sceneIndex];
    var attempts = 0;

    ensureSides(scene);
    updateFigures(scene.speaker, scene.responseSpeaker);

    /* If this scene continues straight on from the previous reply (same
       speaker, same line), don't repeat the bubble \u2014 just ask for the
       next reply. */
    var last = transcript[transcript.length - 1];
    var continuation = last && last.speakerId === scene.speaker && last.text === scene.text;
    if (!continuation) {
      addBubble(scene.speaker, scene.text);
      setActive(scene.speaker);
      transcript.push({ speakerId: scene.speaker, text: scene.text, pair: [scene.speaker, scene.responseSpeaker] });
      EA.audio.speak(scene.text);
    }

    var reply = addBubble(scene.responseSpeaker, null);

    optionsArea.innerHTML = "";
    EA.rand.shuffle(scene.options).forEach(function (opt) {
      var b = EA.el("button", { class: "cc-option", text: opt });
      b.addEventListener("click", function () {
        if (opt === scene.answer) {
          attempts += 1;
          EA.scoring.answer(attempts === 1);
          b.classList.add("cc-right-pick");
          fillBubble(reply, opt);
          reply.setAttribute("aria-label", (names[scene.responseSpeaker] || scene.responseSpeaker) + " says: " + opt);
          setActive(scene.responseSpeaker);
          EA.feedback.correct(reply);
          EA.audio.speak(opt);
          transcript.push({ speakerId: scene.responseSpeaker, text: opt, pair: [scene.speaker, scene.responseSpeaker] });
          optionsArea.innerHTML = "";
          sceneIndex += 1;
          setTimeout(sceneIndex < scenes.length ? playScene : replayMode, 1100);
        } else {
          attempts += 1;
          b.classList.add("cc-wrong");
          b.disabled = true;
          // A visual reaction, not a lecture: the character looks puzzled.
          if (!b.querySelector(".cc-reaction")) b.appendChild(EA.el("span", { class: "cc-reaction", text: "😕", "aria-hidden": "true" }));
          EA.feedback.retry(b, "Hmm, that doesn\u2019t fit. Try again!");
        }
      });
      optionsArea.appendChild(b);
    });
  }

  function replayMode() {
    figLeft.classList.remove("cc-listening");
    figRight.classList.remove("cc-listening");
    optionsArea.innerHTML = "";
    var head = EA.el("div", { class: "ea-center", style: "margin:14px 0" });
    var replayBtn = EA.el("button", { class: "ea-btn ea-btn-yellow", text: "▶ Replay the comic" });
    head.appendChild(replayBtn);
    board.appendChild(head);

    replayBtn.addEventListener("click", function () {
      replayBtn.disabled = true;
      var bubbles = EA.qsa(".cc-bub", col);
      var i = 0;
      (function speakNext() {
        if (i >= transcript.length) { replayBtn.disabled = false; return; }
        var line = transcript[i];
        if (line.pair) updateFigures(line.pair[0], line.pair[1]);
        setActive(line.speakerId);
        if (bubbles[i]) {
          bubbles[i].classList.add("ea-pop");
          (function (prev) { setTimeout(function () { if (prev) prev.classList.remove("ea-pop"); }, 700); })(bubbles[i]);
        }
        var spoke = EA.audio.speak(line.text, { onend: function () { i++; setTimeout(speakNext, 250); } });
        if (!spoke) { i++; setTimeout(speakNext, 700); } // sound off / unavailable: just animate
      })();
    });

    setTimeout(function () { EA.scoring.finish(); }, 400);
  }

  playScene();
})();
