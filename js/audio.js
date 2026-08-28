/* English Adventure — audio.
   Order of preference per spec: recorded file (lesson asset) → speech synthesis (en-GB, slow).
   Never autoplays; the child always presses a button first. */

window.EA = window.EA || {};

EA.audio = {
  _voice: null,
  _voicesReady: false,

  speechAvailable: function () {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  },

  _pickVoice: function () {
    if (!this.speechAvailable()) return null;
    var variant = (EA.settings && EA.settings.languageVariant) || "en-GB";
    var voices = window.speechSynthesis.getVoices() || [];
    var exact = voices.filter(function (v) { return v.lang && v.lang.replace("_", "-").toLowerCase() === variant.toLowerCase(); });
    var anyEn = voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf("en") === 0; });
    this._voice = exact[0] || anyEn[0] || null;
    return this._voice;
  },

  init: function () {
    var self = this;
    if (!this.speechAvailable()) return;
    this._pickVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = function () { self._pickVoice(); };
    }
  },

  /* Speak text. opts: { slow: bool, src: "audio file url", onend: fn } */
  speak: function (text, opts) {
    opts = opts || {};
    if (!EA.settings.soundEnabled) { if (opts.onend) opts.onend(); return false; }

    if (opts.src) {
      var a = new Audio(opts.src);
      a.onended = function () { if (opts.onend) opts.onend(); };
      a.onerror = function () { EA.audio._speakSynth(text, opts); }; // fall through to synthesis
      a.play().catch(function () { EA.audio._speakSynth(text, opts); });
      return true;
    }
    return this._speakSynth(text, opts);
  },

  _speakSynth: function (text, opts) {
    if (!this.speechAvailable()) { if (opts.onend) opts.onend(); return false; }
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = (EA.settings && EA.settings.languageVariant) || "en-GB";
    if (!this._voice) this._pickVoice();
    if (this._voice) u.voice = this._voice;
    u.rate = opts.slow ? 0.62 : 0.82;  // slow, clear beginner speed
    u.pitch = 1.05;
    if (opts.onend) u.onend = opts.onend;
    window.speechSynthesis.speak(u);
    return true;
  },

  stop: function () {
    if (this.speechAvailable()) window.speechSynthesis.cancel();
  },

  /* ---------- Sound effects (tiny WebAudio jingles, no files needed) ---------- */
  _ctx: null,
  _fx: function (notes) {
    if (!EA.settings.soundEnabled) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this._ctx = this._ctx || new AC();
      var ctx = this._ctx, t = ctx.currentTime;
      notes.forEach(function (n) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "triangle"; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t + n[1]);
        g.gain.exponentialRampToValueAtTime(0.18, t + n[1] + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + n[1] + n[2]);
        o.connect(g); g.connect(ctx.destination);
        o.start(t + n[1]); o.stop(t + n[1] + n[2] + 0.05);
      });
    } catch (e) { /* sound is optional */ }
  },
  correct: function () { this._fx([[523, 0, 0.15], [659, 0.12, 0.15], [784, 0.24, 0.25]]); },
  retry: function () { this._fx([[330, 0, 0.18], [294, 0.15, 0.22]]); },
  complete: function () { this._fx([[523, 0, 0.12], [659, 0.1, 0.12], [784, 0.2, 0.12], [1047, 0.3, 0.4]]); },
  tap: function () { this._fx([[600, 0, 0.06]]); }
};
