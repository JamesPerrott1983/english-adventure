/* English Adventure — original SVG cartoon art.
   All characters and scenes are drawn in code: no image files, works offline,
   recolourable, and guaranteed original. Lesson JSON references scenes with
   "svg:sceneName"; real image files (e.g. "assets/...png") also work. */

window.EA = window.EA || {};

EA.art = (function () {

  /* ---------- Character presets (original cast) ---------- */
  var CAST = {
    anna: { skin: "#FFD9B3", hair: "#E8743B", shirt: "#3FBFAD", girl: true },
    max:  { skin: "#F2C09A", hair: "#6B4226", shirt: "#4F8EF7", girl: false },
    lucy: { skin: "#FFE0C2", hair: "#F4C542", shirt: "#9B7EDE", girl: true },
    nora: { skin: "#F7D4B5", hair: "#C9CDD6", shirt: "#C76B6B", girl: true },
    tom:  { skin: "#E8B88A", hair: "#2E2E2E", shirt: "#42C983", girl: false },
    eva:  { skin: "#FFD9B3", hair: "#4A342E", shirt: "#FF6B6B", girl: true },
    ben:  { skin: "#FFE0C2", hair: "#D96C2C", shirt: "#FFCA3A", girl: false }
  };

  function face() {
    return '<circle cx="-7" cy="-2" r="2.3" fill="#263238"/>' +
           '<circle cx="7" cy="-2" r="2.3" fill="#263238"/>' +
           '<path d="M -7 6 Q 0 12 7 6" stroke="#263238" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
           '<circle cx="-12" cy="4" r="3" fill="#FF9E9E" opacity="0.55"/>' +
           '<circle cx="12" cy="4" r="3" fill="#FF9E9E" opacity="0.55"/>';
  }

  function hairFront(c) {
    var h = '<path d="M -17 -6 A 17 17 0 0 1 17 -6 L 17 -10 A 17 17 0 0 0 -17 -10 Z" fill="' + c.hair + '"/>' +
            '<path d="M -17 -6 Q -14 -12 -8 -13 L -17 -13 Z" fill="' + c.hair + '"/>';
    if (c.girl) {
      h += '<circle cx="-19" cy="2" r="6" fill="' + c.hair + '"/>' +
           '<circle cx="19" cy="2" r="6" fill="' + c.hair + '"/>';
    }
    return h;
  }

  /* A child, drawn around origin at the head centre. Poses:
     stand | wave | point (points to self) | back (walking away, waving) */
  function kid(name, pose, flip) {
    var c = CAST[name] || CAST.max;
    var armL, armR, head;
    var body = '<path d="M -13 18 L 13 18 L 16 48 L -16 48 Z" fill="' + c.shirt + '"/>' +
               '<rect x="-11" y="48" width="8" height="16" rx="4" fill="#3E5568"/>' +
               '<rect x="3" y="48" width="8" height="16" rx="4" fill="#3E5568"/>' +
               '<ellipse cx="-7" cy="66" rx="6.5" ry="4" fill="#263238"/>' +
               '<ellipse cx="7" cy="66" rx="6.5" ry="4" fill="#263238"/>';

    if (pose === "back") {
      head = '<circle r="17" fill="' + c.skin + '"/>' +
             '<path d="M -17 0 A 17 17 0 0 1 17 0 A 17 15 0 0 1 -17 0 Z" fill="' + c.hair + '"/>' +
             '<circle cy="-6" r="16" fill="' + c.hair + '"/>' +
             (c.girl ? '<circle cx="-19" cy="2" r="6" fill="' + c.hair + '"/><circle cx="19" cy="2" r="6" fill="' + c.hair + '"/>' : '');
      armL = '<path d="M -14 22 Q -26 10 -24 -4" stroke="' + c.skin + '" stroke-width="8" fill="none" stroke-linecap="round"/>'; // waving back
      armR = '<path d="M 14 22 Q 20 32 18 42" stroke="' + c.skin + '" stroke-width="8" fill="none" stroke-linecap="round"/>';
    } else {
      head = '<circle r="17" fill="' + c.skin + '"/>' + face() + hairFront(c);
      if (pose === "wave") {
        armL = '<path d="M -14 22 Q -28 12 -26 -6" stroke="' + c.skin + '" stroke-width="8" fill="none" stroke-linecap="round"/>' +
               '<circle cx="-26" cy="-8" r="5.5" fill="' + c.skin + '"/>';
        armR = '<path d="M 14 22 Q 20 32 18 44" stroke="' + c.skin + '" stroke-width="8" fill="none" stroke-linecap="round"/>';
      } else if (pose === "point") {
        armL = '<path d="M -14 22 Q -20 32 -18 44" stroke="' + c.skin + '" stroke-width="8" fill="none" stroke-linecap="round"/>';
        armR = '<path d="M 14 22 Q 16 30 4 30" stroke="' + c.skin + '" stroke-width="8" fill="none" stroke-linecap="round"/>' +
               '<circle cx="2" cy="30" r="5" fill="' + c.skin + '"/>';
      } else { // stand
        armL = '<path d="M -14 22 Q -20 32 -18 44" stroke="' + c.skin + '" stroke-width="8" fill="none" stroke-linecap="round"/>';
        armR = '<path d="M 14 22 Q 20 32 18 44" stroke="' + c.skin + '" stroke-width="8" fill="none" stroke-linecap="round"/>';
      }
    }
    return '<g transform="' + (flip ? 'scale(-1,1)' : '') + '">' + body + armL + armR + '<g>' + head + '</g></g>';
  }

  /* Small speech bubble prop with a symbol inside. */
  function bubble(x, y, symbol, flip) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
      '<ellipse rx="17" ry="13" fill="#FFFFFF" stroke="#DCEAF5" stroke-width="2.5"/>' +
      '<path d="M ' + (flip ? '10 10 L 16 20 L 4 12' : '-10 10 L -16 20 L -4 12') + ' Z" fill="#FFFFFF" stroke="#DCEAF5" stroke-width="2.5"/>' +
      '<text y="6" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="17" font-weight="700" fill="#4F8EF7">' + symbol + '</text></g>';
  }

  function backdrop() {
    return '<rect width="200" height="140" fill="#DFF1FF"/>' +
      '<circle cx="176" cy="18" r="13" fill="#FFCA3A"/>' +
      '<ellipse cx="40" cy="20" rx="18" ry="8" fill="#FFFFFF" opacity="0.9"/>' +
      '<ellipse cx="118" cy="12" rx="14" ry="6" fill="#FFFFFF" opacity="0.9"/>' +
      '<rect y="108" width="200" height="32" fill="#9FDF8F"/>' +
      '<ellipse cx="30" cy="112" rx="10" ry="3" fill="#7CC96C"/>' +
      '<ellipse cx="150" cy="116" rx="14" ry="3" fill="#7CC96C"/>';
  }

  function place(inner, x, y, scale) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + (scale || 0.7) + ')">' + inner + '</g>';
  }

  /* ---------- Scenes ---------- */
  var SCENES = {
    /* Two children meeting and waving to each other */
    "meeting": function () {
      return backdrop() +
        place(kid("anna", "wave", false), 60, 60) + place(kid("max", "wave", true), 140, 60) +
        bubble(84, 26, "!", false) + bubble(116, 26, "!", true);
    },
    "meeting2": function () {
      return backdrop() +
        place(kid("lucy", "wave", false), 60, 60) + place(kid("tom", "wave", true), 140, 60) +
        bubble(84, 26, "!", false);
    },
    /* A child walking away, waving back over their shoulder */
    "leaving": function () {
      return backdrop() +
        place(kid("eva", "stand", false), 48, 62) +
        place(kid("max", "back", true), 148, 60) +
        bubble(120, 24, "…", true);
    },
    "leaving2": function () {
      return backdrop() +
        place(kid("tom", "stand", false), 48, 62) +
        place(kid("lucy", "back", true), 148, 60) +
        bubble(120, 24, "…", true);
    },
    "leaving-girl": function () {
      return backdrop() +
        place(kid("ben", "wave", false), 48, 62) +
        place(kid("anna", "back", true), 148, 60);
    },
    /* A girl / boy pointing to themselves (introducing) */
    "introduce-girl": function () {
      return backdrop() + place(kid("anna", "point", false), 100, 58, 0.85) + bubble(140, 26, "A", true);
    },
    "introduce-girl2": function () {
      return backdrop() + place(kid("lucy", "point", false), 100, 58, 0.85) + bubble(140, 26, "L", true);
    },
    "introduce-boy": function () {
      return backdrop() + place(kid("max", "point", false), 100, 58, 0.85) + bubble(140, 26, "M", true);
    },
    "introduce-boy2": function () {
      return backdrop() + place(kid("tom", "point", false), 100, 58, 0.85) + bubble(140, 26, "T", true);
    },
    /* A single child waving hello */
    "wave-boy": function () {
      return backdrop() + place(kid("ben", "wave", false), 100, 58, 0.85);
    },
    "wave-boy2": function () {
      return backdrop() + place(kid("tom", "wave", false), 100, 58, 0.85);
    },
    "wave-girl": function () {
      return backdrop() + place(kid("eva", "wave", false), 100, 58, 0.85);
    },
    /* A child asking a question */
    "question": function () {
      return backdrop() + place(kid("max", "stand", false), 70, 60, 0.85) +
        place(kid("anna", "stand", true), 145, 62, 0.7) + bubble(100, 22, "?", false);
    },
    "question2": function () {
      return backdrop() + place(kid("lucy", "stand", false), 70, 60, 0.85) +
        place(kid("ben", "stand", true), 145, 62, 0.7) + bubble(100, 22, "?", false);
    },
    /* Playground backdrop used behind the comic */
    "school-playground": function () {
      return backdrop() +
        '<rect x="10" y="66" width="52" height="42" rx="4" fill="#FFE3B3" stroke="#E8B96A" stroke-width="3"/>' +
        '<path d="M 6 68 L 36 46 L 66 68 Z" fill="#FF8B7B"/>' +
        '<rect x="28" y="84" width="16" height="24" fill="#8ABDE8"/>';
    }
  };

  /* ---------- Mascot: a friendly mouse ---------- */
  function mascot(state) {
    var armUp = '<path d="M -16 30 Q -30 20 -28 4" stroke="#B9C4D6" stroke-width="7" fill="none" stroke-linecap="round"/>';
    var armDn = '<path d="M -16 30 Q -22 38 -20 46" stroke="#B9C4D6" stroke-width="7" fill="none" stroke-linecap="round"/>';
    var armUpR = armUp.replace(/-16/, "16").replace("-30 20 -28 4", "30 20 28 4");
    var armDnR = '<path d="M 16 30 Q 22 38 20 46" stroke="#B9C4D6" stroke-width="7" fill="none" stroke-linecap="round"/>';
    var arms = state === "cheer" ? armUp + armUpR : state === "wave" ? armUp + armDnR : armDn + armDnR;
    var mouth = state === "think"
      ? '<circle cx="0" cy="8" r="2.5" fill="#263238"/>'
      : '<path d="M -6 5 Q 0 11 6 5" stroke="#263238" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
    var extra = state === "think" ? '<circle cx="26" cy="-24" r="3" fill="#B9C4D6"/><circle cx="32" cy="-32" r="4.5" fill="#B9C4D6"/>' : "";
    return '<svg viewBox="-45 -45 90 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pip the mouse, the friendly mascot">' +
      '<ellipse cx="0" cy="38" rx="18" ry="22" fill="#CBD5E4"/>' +           // body
      '<ellipse cx="0" cy="42" rx="10" ry="13" fill="#EEF3FA"/>' +           // tummy
      arms +
      '<path d="M 16 50 Q 34 52 36 38" stroke="#F3A6B8" stroke-width="5" fill="none" stroke-linecap="round"/>' + // tail
      '<circle cx="-20" cy="-26" r="12" fill="#CBD5E4"/><circle cx="-20" cy="-26" r="6.5" fill="#F3A6B8"/>' +    // ears
      '<circle cx="20" cy="-26" r="12" fill="#CBD5E4"/><circle cx="20" cy="-26" r="6.5" fill="#F3A6B8"/>' +
      '<circle cx="0" cy="-8" r="22" fill="#CBD5E4"/>' +                     // head
      '<circle cx="-8" cy="-12" r="2.6" fill="#263238"/><circle cx="8" cy="-12" r="2.6" fill="#263238"/>' +
      '<ellipse cx="0" cy="-2" rx="4" ry="3" fill="#F37E9B"/>' + mouth + extra +
      '<path d="M -22 -4 L -32 -6 M -22 0 L -32 2 M 22 -4 L 32 -6 M 22 0 L 32 2" stroke="#9AA8BC" stroke-width="1.6"/>' + // whiskers
      '</svg>';
  }

  /* ---------- Train engine for Sentence Train ---------- */
  function loco() {
    return '<svg viewBox="0 0 96 84" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A cheerful cartoon train engine">' +
      '<rect x="6" y="30" width="52" height="34" rx="8" fill="#FF6B6B"/>' +
      '<rect x="52" y="16" width="34" height="48" rx="8" fill="#4F8EF7"/>' +
      '<rect x="58" y="24" width="22" height="16" rx="5" fill="#DFF1FF"/>' +
      '<rect x="14" y="14" width="12" height="20" rx="4" fill="#FFCA3A"/>' +
      '<circle cx="20" cy="8" r="6" fill="#FFFFFF" opacity="0.85"/><circle cx="30" cy="4" r="4" fill="#FFFFFF" opacity="0.7"/>' +
      '<rect x="2" y="60" width="90" height="7" rx="3.5" fill="#3E5568"/>' +
      '<circle cx="24" cy="72" r="9" fill="#263238"/><circle cx="24" cy="72" r="4" fill="#B9C4D6"/>' +
      '<circle cx="52" cy="72" r="9" fill="#263238"/><circle cx="52" cy="72" r="4" fill="#B9C4D6"/>' +
      '<circle cx="76" cy="72" r="9" fill="#263238"/><circle cx="76" cy="72" r="4" fill="#B9C4D6"/>' +
      '<circle cx="66" cy="30" r="2.2" fill="#263238"/><circle cx="74" cy="30" r="2.2" fill="#263238"/>' +
      '<path d="M 66 35 Q 70 38 74 35" stroke="#263238" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* Full-body standing figure (for the comic stage). */
  function figure(name, flip, pose) {
    return '<svg viewBox="-36 -34 72 108" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + name + '">' +
      kid(name, pose || "stand", !!flip) + '</svg>';
  }

  /* Avatar head-and-shoulders for the comic. */
  function avatar(name) {
    var c = CAST[name] || CAST.max;
    return '<svg viewBox="-30 -30 60 62" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + name + '">' +
      '<path d="M -20 32 Q 0 16 20 32 L 20 34 L -20 34 Z" fill="' + c.shirt + '"/>' +
      '<circle r="17" fill="' + c.skin + '"/>' + face() + hairFront(c) + '</svg>';
  }

  /* ---------- Public API ---------- */
  function sceneSvg(name, alt) {
    var fn = SCENES[name] || SCENES["meeting"];
    return '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' +
      (alt || name).replace(/"/g, "&quot;") + '">' + fn() + '</svg>';
  }

  /* Resolve an image reference from lesson JSON: "svg:name" → built-in art,
     "img:id" → teacher image library (IndexedDB), anything else → <img> path.
     Returns a DOM node. */
  function imgNode(ref, alt) {
    var wrap = document.createElement("div");
    if (ref && ref.indexOf("svg:") === 0) {
      wrap.innerHTML = sceneSvg(ref.slice(4), alt);
    } else if (ref && ref.indexOf("img:") === 0) {
      var im = document.createElement("img");
      im.alt = alt || "";
      wrap.appendChild(im);
      if (window.EA && EA.images && EA.images.available) {
        EA.images.url(ref.slice(4)).then(function (u) { im.src = u; })
          .catch(function () { wrap.innerHTML = sceneSvg("meeting", alt); });
      } else {
        wrap.innerHTML = sceneSvg("meeting", alt);
      }
    } else {
      var img = document.createElement("img");
      /* Relative paths must be resolved from the app root, not the current
         folder — game pages live in /games/ and set EA_BASE = "../". */
      var src = /^([a-z]+:|\/)/i.test(ref) ? ref : (window.EA_BASE || "") + ref;
      img.src = src; img.alt = alt || "";
      img.onerror = function () { wrap.innerHTML = sceneSvg("meeting", alt); }; // graceful fallback
      wrap.appendChild(img);
    }
    return wrap;
  }

  return { scene: sceneSvg, imgNode: imgNode, mascot: mascot, loco: loco, avatar: avatar, figure: figure, cast: CAST };
})();
