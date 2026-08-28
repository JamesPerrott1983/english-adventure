/* English Adventure — the workbook curriculum, generated from the school's
   lesson list (English_Adventure.xlsx). Every lesson ships built-in with
   starter Word Match content so it is valid and playable immediately;
   teachers fill in the real games with "Edit games" or the JSON editor.
   The fully-built "Demo: Hello and Goodbye" lesson in js/lesson-data.js
   stays available under "Other lessons" as a reference. */

window.EA = window.EA || {};
EA.builtInLessons = EA.builtInLessons || [];

/* Placeholder content for all five games — valid, playable, and clearly meant
   to be replaced. Used for every curriculum lesson and every new lesson. */
EA.starterGames = function () {
  return JSON.parse(JSON.stringify({
    pictureMatch: {
      enabled: true,
      rounds: [{
        id: "pm-r1",
        instruction: "Match the words to the pictures.",
        instructionCs: "P\u0159i\u0159a\u010F slova k obr\u00E1zk\u016Fm.",
        items: [
          { answer: "Hello!", image: "svg:meeting", alt: "Two children meeting and waving" },
          { answer: "Goodbye!", image: "svg:leaving", alt: "A child walking away and waving back" },
          { answer: "Hi!", image: "svg:wave-boy", alt: "A boy waving happily" },
          { answer: "Bye!", image: "svg:leaving-girl", alt: "A girl leaving while a boy waves" }
        ]
      }]
    },
    sentenceTrain: {
      enabled: true,
      contractions: { "What's": "What is", "name's": "name is" },
      items: [
        { id: "st-01", level: 1, prompt: "Ask the girl her name.", promptCs: "Zeptej se d\u00EDvky na jm\u00E9no.",
          image: "svg:question", answer: ["What's", "your", "name?"], distractors: [] },
        { id: "st-02", level: 1, prompt: "The girl says her name.", promptCs: "D\u00EDvka \u0159\u00EDk\u00E1 sv\u00E9 jm\u00E9no.",
          image: "svg:introduce-girl", answer: ["My", "name's", "Anna."], distractors: [] }
      ]
    },
    wordMatch: {
      enabled: true,
      rounds: [{
        id: "wm-r1",
        instruction: "Match the English and Czech words.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 slova.",
        pairs: [
          { en: "hello", cs: "ahoj" },
          { en: "goodbye", cs: "na shledanou" }
        ]
      }]
    },
    conversationComic: {
      enabled: true,
      setting: "school-playground",
      characters: [
        { id: "anna", name: "Anna" },
        { id: "max", name: "Max" }
      ],
      scenes: [
        { speaker: "anna", text: "Hello!", responseSpeaker: "max",
          options: ["Hi!", "Goodbye!", "A red pencil."], answer: "Hi!" },
        { speaker: "anna", text: "What's your name?", responseSpeaker: "max",
          options: ["My name's Max.", "Bye!", "A dog."], answer: "My name's Max." }
      ]
    },
    listenAndChoose: {
      enabled: true,
      items: [
        { id: "lc-01", type: "phrase", audio: "Hello!",
          options: ["Hello!", "Goodbye!", "My name's Anna."], answerIndex: 0 },
        { id: "lc-02", type: "response", audio: "What's your name?",
          prompt: "Choose the best answer.", promptCs: "Vyber nejlep\u0161\u00ED odpov\u011B\u010F.",
          options: ["My name's Tom.", "I'm fine.", "Bye!"], answerIndex: 0 }
      ]
    },
    spellingBee: {
      enabled: true,
      items: [
        { id: "sb-01", answer: "hello", pattern: "h_ll_", image: "svg:wave-boy" },
        { id: "sb-02", answer: "goodbye", pattern: "g__db_e", image: "svg:leaving" }
      ]
    }
  }));
};

(function () {
  /* [theme, unit (number or name), title, first workbook page] */
  var ROWS = [
    [0, 1, "Hello! Hi!", 6],
    [0, 2, "English around us", 8],
    [0, 3, "Colours", 10],
    [0, 4, "How are you?", 12],
    [0, 5, "Numbers", 14],
    [0, 6, "English alphabet", 16],

    [1, 7, "A pen \u2013 two pens", 18],
    [1, 8, "What\u2019s this?", 20],
    [1, 9, "I\u2019m a boy. I\u2019m a girl.", 22],
    [1, "Have Fun with English 1", "A new friend", 24],

    [2, 10, "He\u2019s tall. She\u2019s slim.", 26],
    [2, 11, "How old are you? \u2013 I\u2019m nine.", 28],
    [2, 12, "You are my brother.", 30],
    [2, "Have Fun with English 2", "A haunted house", 32],

    [3, 13, "Our house, our flat", 34],
    [3, 14, "Our house is big. Their garden is small.", 36],
    [3, 15, "Where are you from?", 38],
    [3, "Have Fun with English 3", "Where\u2019s Click?", 40],

    [4, 16, "What\u2019s your favourite toy?", 42],
    [4, 17, "Where\u2019s the ball?", 44],
    [4, 18, "The same or different?", 46],
    [4, "Have Fun with English 4", "Where\u2019s David\u2019s car?", 48],

    [5, 19, "This is me!", 50],
    [5, 20, "This is my friend.", 52],
    [5, 21, "Personal factfiles", 54],
    [5, "Have Fun with English 5", "Click\u2019s friends", 56],

    [6, 22, "I\u2019ve got a pet.", 58],
    [6, 23, "Have you got a guinea pig?", 60],
    [6, 24, "Aaaagh! It\u2019s got eight legs!", 62],
    [6, "Have Fun with English 6", "I haven\u2019t got a pet.", 64],

    [7, 25, "Christmas is here!", 66],
    [7, 26, "Facts about Christmas", 68],

    [8, 27, "This is my new friend.", 70],
    [8, 28, "My dog is lost!", 72]
  ];

  var THEME_NAMES = ["Introduction", "My Classroom", "My Family", "My Home",
    "My Room", "Me and My Friends", "My Pets", "Christmas", "Final Revision"];
  var THUMBS = ["svg:meeting", "svg:wave-girl", "svg:question", "svg:introduce-boy",
    "svg:wave-boy", "svg:meeting2", "svg:introduce-girl", "svg:leaving-girl", "svg:question2"];

  ROWS.forEach(function (row, i) {
    var theme = row[0], unit = row[1], title = row[2], firstPage = row[3];
    var unitSlug = typeof unit === "number" ? "u" + unit
      : "u" + String(unit).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 16);
    var titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "lesson";

    /* One lesson per workbook page: the unit spans firstPage and firstPage+1 */
    [firstPage, firstPage + 1].forEach(function (page) {
    EA.builtInLessons.push({
      id: "t" + theme + "-" + unitSlug + "-" + titleSlug + "-p" + page,
      version: 1,
      schemaVersion: 1,
      title: title,
      titleCs: "",
      topic: THEME_NAMES[theme],
      theme: theme,
      unit: unit,
      page: page,
      description: "Practise the English from page " + page + " of the workbook.",
      descriptionCs: "",
      difficulty: 1,
      ageRange: "8-9",
      languageVariant: "en-GB",
      thumbnail: THUMBS[i % THUMBS.length],
      mascot: "mouse",
      learningObjectives: ["Practise the words and phrases from page " + page],
      targetVocabulary: [],
      targetPhrases: [],
      games: EA.starterGames()
    });
    });
  });
})();

/* ---- Real content: workbook page 7, "Learn new words" (Vocabulary + Grammar).
   The book gives Hello! and Hi! the same Czech (Ahoj / Nazdar), and Goodbye!
   and Bye! both map to Na shledanou — so the clashing words are split across
   two rounds, keeping every pair unambiguous while using only the book's own
   translations. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u1-hello-hi-p7") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  lesson.targetVocabulary = ["hello", "hi", "good morning", "goodbye", "bye"];
  lesson.targetPhrases = ["What's your name?", "My name's Tom.", "Stand up.", "Sit down.", "Come here."];
  lesson.games.wordMatch = {
    enabled: true,
    rounds: [
      {
        id: "wm-r1",
        instruction: "Match the English and Czech words.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 slova.",
        pairs: [
          { en: "Hello!", cs: "Ahoj!" },
          { en: "Good morning!", cs: "Dobr\u00E9 r\u00E1no!" },
          { en: "Goodbye!", cs: "Na shledanou!" },
          { en: "Stand up.", cs: "Postav se." },
          { en: "Sit down.", cs: "Posa\u010F se." }
        ]
      },
      {
        id: "wm-r2",
        instruction: "Match the English and Czech words.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 slova.",
        pairs: [
          { en: "Hi!", cs: "Nazdar!" },
          { en: "Bye!", cs: "Na shledanou!" },
          { en: "What's your name?", cs: "Jak se jmenuje\u0161?" },
          { en: "My name's Tom.", cs: "Jmenuji se Tom." },
          { en: "Come here.", cs: "Poj\u010F sem." }
        ]
      }
    ]
  };
})();

/* ---- Book, page 6, activity 2 (role play): Word Match for lesson P6.
   English lines from the book; Czech translations created for the app,
   with correct vocatives (Pavle, Lindo). Split into two rounds so the
   overlapping greetings stay unambiguous. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u1-hello-hi-p6") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  lesson.targetPhrases = ["Hello!", "What's your name?", "My name's Linda.", "Hi, Pavel.", "Goodbye, Pavel.", "Bye, Linda."];
  lesson.games.wordMatch = {
    enabled: true,
    rounds: [
      {
        id: "wm-r1",
        instruction: "Match the English and Czech sentences.",
        instructionCs: "Spoj anglick\u00E9 a \u010Desk\u00E9 v\u011Bty.",
        pairs: [
          { en: "Hello!", cs: "Ahoj!" },
          { en: "What's your name?", cs: "Jak se jmenuje\u0161?" },
          { en: "My name's Linda.", cs: "Jmenuji se Linda." },
          { en: "My name's Pavel.", cs: "Jmenuji se Pavel." }
        ]
      },
      {
        id: "wm-r2",
        instruction: "Match the English and Czech sentences.",
        instructionCs: "Spoj anglick\u00E9 a \u010Desk\u00E9 v\u011Bty.",
        pairs: [
          { en: "Hi, Pavel.", cs: "Ahoj, Pavle." },
          { en: "Hi, Linda.", cs: "Ahoj, Lindo." },
          { en: "Goodbye, Pavel.", cs: "Na shledanou, Pavle." },
          { en: "Bye, Linda.", cs: "Pa, Lindo." }
        ]
      }
    ]
  };
})();

/* ---- Book, page 7, activity 4: Picture Match for lesson P7.
   Three classroom commands; placeholder scenes stand in until the
   teacher's photos are added via the image library. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u1-hello-hi-p7") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  lesson.games.pictureMatch = {
    enabled: true,
    rounds: [
      {
        id: "pm-r1",
        instruction: "Match the words to the pictures.",
        instructionCs: "P\u0159i\u0159a\u010F slova k obr\u00E1zk\u016Fm.",
        items: [
          { answer: "Stand up.", image: "assets/lesson-images/p7/stand-up.webp", alt: "A boy standing up from his chair, an arrow pointing up" },
          { answer: "Sit down.", image: "assets/lesson-images/p7/sit-down.webp", alt: "A boy sitting down on his chair, an arrow pointing down" },
          { answer: "Come here.", image: "assets/lesson-images/p7/come-here.webp", alt: "A girl beckoning while a boy walks towards her" }
        ]
      }
    ]
  };
})();

/* ---- Book, page 8 (Unit 2, activity 1): Picture Match for lesson P8.
   The 25 vocabulary items in the book's own five groups, one round each;
   placeholder scenes until the photos are added. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u2-english-around-us-p8") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  var GROUPS = [
    ["a pizza", "a banana", "milk", "a hamburger", "Coca-Cola"],
    ["a restaurant", "a bar", "a hotel", "a disco", "a stadium"],
    ["a telephone", "a radio", "a television", "a satellite", "a computer"],
    ["a giraffe", "an alligator", "a zebra", "a gorilla", "a dolphin"],
    ["a bus", "a taxi", "a balloon", "a rocket", "a helicopter"]
  ];
  lesson.targetVocabulary = [];
  GROUPS.forEach(function (g) { g.forEach(function (w) { lesson.targetVocabulary.push(w.replace(/^an? /, "")); }); });
  /* Flashcard photos (label bands cropped off). Words without a photo yet
     fall back to a built-in scene until the next batch arrives. */
  var PHOTOS = {
    "a pizza": "pizza", "a banana": "banana", "milk": "milk", "a hamburger": "hamburger", "Coca-Cola": "coca-cola",
    "a restaurant": "restaurant", "a bar": "bar", "a hotel": "hotel", "a disco": "disco", "a stadium": "stadium",
    "a telephone": "telephone", "a radio": "radio", "a television": "television", "a satellite": "satellite", "a computer": "computer",
    "a giraffe": "giraffe", "an alligator": "alligator", "a zebra": "zebra", "a gorilla": "gorilla", "a dolphin": "dolphin",
    "a bus": "bus", "a taxi": "taxi", "a balloon": "balloon", "a rocket": "rocket", "a helicopter": "helicopter"
  };
  /* Word Match: the same 25 words, Czech translations by the app,
     in the same five groups as the picture rounds. */
  var CZECH = {
    "a pizza": "pizza", "a banana": "ban\u00E1n", "milk": "ml\u00E9ko", "a hamburger": "hamburger", "Coca-Cola": "Coca-Cola",
    "a restaurant": "restaurace", "a bar": "bar", "a hotel": "hotel", "a disco": "diskot\u00E9ka", "a stadium": "stadi\u00F3n",
    "a telephone": "telefon", "a radio": "r\u00E1dio", "a television": "televize", "a satellite": "satelit", "a computer": "po\u010D\u00EDta\u010D",
    "a giraffe": "\u017Eirafa", "an alligator": "alig\u00E1tor", "a zebra": "zebra", "a gorilla": "gorila", "a dolphin": "delf\u00EDn",
    "a bus": "autobus", "a taxi": "taxi", "a balloon": "bal\u00F3n", "a rocket": "raketa", "a helicopter": "vrtuln\u00EDk"
  };
  lesson.games.wordMatch = {
    enabled: true,
    rounds: GROUPS.map(function (group, gi) {
      return {
        id: "wm-r" + (gi + 1),
        instruction: "Match the English and Czech words.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 slova.",
        pairs: group.map(function (word) { return { en: word, cs: CZECH[word] }; })
      };
    })
  };

  /* Listen and Choose: the same 25 words. Alternating item types —
     hear the word and pick the photo, or hear it and pick the written word.
     Wrong options always come from the same group, so distractors stay fair. */
  var lcItems = [];
  GROUPS.forEach(function (group, gi) {
    group.forEach(function (word, wi) {
      var d1 = group[(wi + 1) % group.length];
      var d2 = group[(wi + 2) % group.length];
      var n = gi * 5 + wi;
      if (n % 2 === 0) {
        lcItems.push({
          id: "lc-" + (n + 1), type: "picture", audio: word,
          options: [word, d1, d2].map(function (x) {
            return { image: "assets/lesson-images/p8/" + PHOTOS[x] + ".webp", alt: "A picture of " + x };
          }),
          answerIndex: 0
        });
      } else {
        lcItems.push({
          id: "lc-" + (n + 1), type: "phrase", audio: word,
          options: [word, d1, d2],
          answerIndex: 0
        });
      }
    });
  });
  /* Sentence Train: the book's "What's this? \u2013 It's a ..." pattern.
     First the question, then answers using five activity-1 flashcards.
     Each answer's distractor is another flashcard noun \u2014 the child picks
     the word that matches the picture. */
  lesson.games.sentenceTrain = {
    enabled: true,
    contractions: { "What's": "What is", "It's": "It is" },
    items: [
      { id: "st-01", level: 1, prompt: "Ask what it is.", promptCs: "Zeptej se, co to je.",
        image: "assets/lesson-images/p8/whats-this.webp",
        answer: ["What's", "this?"], distractors: ["is", "that?"] },
      { id: "st-02", level: 1, prompt: "Say what you can see.", promptCs: "\u0158ekni, co vid\u00ED\u0161.",
        image: "assets/lesson-images/p8/balloon.webp",
        answer: ["It's", "a", "balloon."], distractors: ["alligator."] },
      { id: "st-03", level: 1, prompt: "Say what you can see.", promptCs: "\u0158ekni, co vid\u00ED\u0161.",
        image: "assets/lesson-images/p8/alligator.webp",
        answer: ["It's", "an", "alligator."], distractors: ["balloon."] },
      { id: "st-04", level: 1, prompt: "Say what you can see.", promptCs: "\u0158ekni, co vid\u00ED\u0161.",
        image: "assets/lesson-images/p8/bus.webp",
        answer: ["It's", "a", "bus."], distractors: ["taxi."] },
      { id: "st-05", level: 1, prompt: "Say what you can see.", promptCs: "\u0158ekni, co vid\u00ED\u0161.",
        image: "assets/lesson-images/p8/giraffe.webp",
        answer: ["It's", "a", "giraffe."], distractors: ["zebra."] },
      { id: "st-06", level: 1, prompt: "Say what you can see.", promptCs: "\u0158ekni, co vid\u00ED\u0161.",
        image: "assets/lesson-images/p8/computer.webp",
        answer: ["It's", "a", "computer."], distractors: ["telephone."] }
    ]
  };

  /* The listening game belongs to page 9 (the book's Learn-new-words page),
     so it is attached to the P9 lesson; P8 keeps its starter placeholder. */
  var p9 = null;
  for (var j = 0; j < EA.builtInLessons.length; j++) {
    if (EA.builtInLessons[j].id === "t0-u2-english-around-us-p9") { p9 = EA.builtInLessons[j]; break; }
  }
  if (p9) {
    p9.targetVocabulary = lesson.targetVocabulary.slice();
    p9.games.listenAndChoose = {
      enabled: true,
      rounds: GROUPS.map(function (group, gi) {
        return { id: "lc-r" + (gi + 1), items: lcItems.slice(gi * 5, gi * 5 + 5) };
      })
    };
  }

  lesson.games.pictureMatch = {
    enabled: true,
    rounds: GROUPS.map(function (group, gi) {
      return {
        id: "pm-r" + (gi + 1),
        instruction: "Match the words to the pictures.",
        instructionCs: "P\u0159i\u0159a\u010F slova k obr\u00E1zk\u016Fm.",
        items: group.map(function (word, wi) {
          var scenes = ["meeting", "wave-girl", "question", "introduce-boy", "wave-boy",
                        "meeting2", "introduce-girl", "leaving-girl", "question2", "leaving"];
          var photo = PHOTOS[word];
          return {
            answer: word,
            image: photo ? "assets/lesson-images/p8/" + photo + ".webp"
                         : "svg:" + scenes[(gi * 5 + wi) % scenes.length],
            alt: photo ? "A picture of " + word
                       : "A photo of " + word + " (placeholder until the real photo is added)"
          };
        })
      };
    })
  };
})();

/* ---- Book, page 9, activity 4 (commands) and activity 5 (sentence entries):
   Picture Match and Word Match for the P9 lesson. Classroom-command
   illustrations supplied by the school. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u2-english-around-us-p9") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  lesson.targetPhrases = ["What's this?", "It's a bus.", "Listen.", "Look.", "Open your book.", "Close your book."];
  lesson.games.pictureMatch = {
    enabled: true,
    rounds: [{
      id: "pm-r1",
      instruction: "Match the words to the pictures.",
      instructionCs: "P\u0159i\u0159a\u010F slova k obr\u00E1zk\u016Fm.",
      items: [
        { answer: "Listen.", image: "assets/lesson-images/p9/listen.webp", alt: "A boy cupping his hand behind his ear" },
        { answer: "Look.", image: "assets/lesson-images/p9/look.webp", alt: "A boy shading his eyes and looking into the distance" },
        { answer: "Open your book.", image: "assets/lesson-images/p9/open-your-book.webp", alt: "A boy holding an open book" },
        { answer: "Close your book.", image: "assets/lesson-images/p9/close-your-book.webp", alt: "A boy pressing a closed book on the desk" }
      ]
    }]
  };
  lesson.games.wordMatch = {
    enabled: true,
    rounds: [{
      id: "wm-r1",
      instruction: "Match the English and Czech sentences.",
      instructionCs: "Spoj anglick\u00E9 a \u010Desk\u00E9 v\u011Bty.",
      pairs: [
        { en: "What's this?", cs: "Co je to?" },
        { en: "It's a bus.", cs: "To je autobus." },
        { en: "Listen.", cs: "Poslouchej." },
        { en: "Look.", cs: "Pod\u00EDvej se." },
        { en: "Open your book.", cs: "Otev\u0159i knihu." },
        { en: "Close your book.", cs: "Zav\u0159i knihu." }
      ]
    }]
  };
})();

/* ---- Page 10 (Unit 3, Colours): Sentence Train.
   The book's activity 2 is a rhyme (a creative work), so these are original
   practice sentences using the unit's colour vocabulary and the objects from
   the book's "Colours around us" activity, with original artwork. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u3-colours-p10") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  lesson.targetVocabulary = ["red", "yellow", "blue", "green", "white", "black", "brown", "pink", "grey", "orange"];
  var P = "assets/lesson-images/p10/";
  function item(n, file, words, wrong, hintEn, hintCs, alt) {
    return { id: "st-" + n, level: 1, prompt: hintEn, promptCs: hintCs,
             image: P + file + ".svg", answer: words, distractors: wrong, alt: alt };
  }
  lesson.games.sentenceTrain = {
    enabled: true,
    contractions: {},
    items: [
      item("01", "sun",    ["The", "sun", "is", "yellow."],  ["blue."],   "What colour is the sun?",   "Jakou barvu m\u00E1 slunce?",  "A yellow sun in the sky"),
      item("02", "moon",   ["The", "moon", "is", "white."],  ["green."],  "What colour is the moon?",  "Jakou barvu m\u00E1 M\u011Bs\u00EDc?", "A white moon at night"),
      item("03", "grass",  ["The", "grass", "is", "green."], ["grey."],   "What colour is the grass?", "Jakou barvu m\u00E1 tr\u00E1va?", "Green grass in a meadow"),
      item("04", "cloud",  ["The", "cloud", "is", "grey."],  ["orange."], "What colour is the cloud?", "Jakou barvu m\u00E1 mrak?",    "A grey cloud"),
      item("05", "star",   ["The", "star", "is", "yellow."], ["brown."],  "What colour is the star?",  "Jakou barvu m\u00E1 hv\u011Bzda?", "A yellow star at night"),
      item("06", "orange", ["The", "orange", "is", "orange"], ["pink"], "What colour is the orange?", "Jakou barvu m\u00E1 pomeran\u010D?", "An orange fruit"),
      item("07", "sky",    ["The", "sky", "is", "blue."],    ["red."],    "What colour is the sky?",   "Jakou barvu m\u00E1 obloha?",  "A blue sky with white clouds"),
      (function () {
        var it = item("08", "egg", ["The", "egg", "is", "white", "and", "yellow"], ["black"], "What colours is the egg?", "Jak\u00E9 barvy m\u00E1 vejce?", "A white egg with a yellow yolk");
        it.altAnswers = [["The", "egg", "is", "yellow", "and", "white"]];
        return it;
      })()
    ]
  };
})();

/* ---- Page 10, activity 1 (the paint palette) and activity 3 (Colours
   around us): Picture Match and Listen and Choose. Swatches and object
   pictures are original artwork. Purple and violet sit in different rounds
   so similar-looking swatches never compete in the same round. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u3-colours-p10") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  var P = "assets/lesson-images/p10/";
  function pot(name) {
    return { answer: name, image: P + "colour-" + name + ".svg", alt: "A pot of " + name + " paint" };
  }
  lesson.games.pictureMatch = {
    enabled: true,
    rounds: [
      { id: "pm-r1",
        instruction: "Match the colours to the paints.",
        instructionCs: "P\u0159i\u0159a\u010F barvy k barvi\u010Dk\u00E1m.",
        items: ["yellow", "orange", "red", "pink", "purple", "white"].map(pot) },
      { id: "pm-r2",
        instruction: "Match the colours to the paints.",
        instructionCs: "P\u0159i\u0159a\u010F barvy k barvi\u010Dk\u00E1m.",
        items: ["green", "blue", "brown", "grey", "black", "violet"].map(pot) }
    ]
  };

  /* Listen and Choose: the seven labelled objects, picture type. */
  var OBJECTS = [
    { audio: "a yellow sun", img: "sun", alt: "A yellow sun in the sky" },
    { audio: "a white moon", img: "moon", alt: "A white moon at night" },
    { audio: "green grass", img: "grass", alt: "Green grass in a meadow" },
    { audio: "a grey cloud", img: "cloud", alt: "A grey cloud" },
    { audio: "a yellow star", img: "star", alt: "A yellow star at night" },
    { audio: "an orange orange", img: "orange", alt: "An orange fruit" },
    { audio: "a white and yellow egg", img: "egg", alt: "A white egg with a yellow yolk" }
  ];
  lesson.games.listenAndChoose = {
    enabled: true,
    items: OBJECTS.map(function (o, i) {
      var d1 = OBJECTS[(i + 2) % OBJECTS.length];
      var d2 = OBJECTS[(i + 4) % OBJECTS.length];
      return {
        id: "lc-" + (i + 1), type: "picture", audio: o.audio,
        options: [o, d1, d2].map(function (x) { return { image: P + x.img + ".svg", alt: x.alt }; }),
        answerIndex: 0
      };
    })
  };
})();

/* ---- Page 11: three games for the Colours unit's second page.
   Picture Match: the four classroom commands (school's illustrations).
   Sentence Train: "What colour is ...?" / "It's ..." for each activity-4
   picture, reusing the page-8 flashcards.
   Word Match: the full activity-6 vocabulary box; "orange" the colour and
   "orange" the fruit are kept in different rounds. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u3-colours-p11") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  var P11 = "assets/lesson-images/p11/";
  var P8 = "assets/lesson-images/p8/";

  lesson.games.pictureMatch = {
    enabled: true,
    rounds: [{
      id: "pm-r1",
      instruction: "Match the words to the pictures.",
      instructionCs: "P\u0159i\u0159a\u010F slova k obr\u00E1zk\u016Fm.",
      items: [
        { answer: "Write.", image: P11 + "write.webp", alt: "A boy writing in his notebook with a pencil" },
        { answer: "Colour.", image: P11 + "colour.webp", alt: "A boy colouring a picture of a house" },
        { answer: "Match.", image: P11 + "match.webp", alt: "A boy drawing lines to match pictures" },
        { answer: "Touch.", image: P11 + "touch.webp", alt: "A boy touching a picture on the board" }
      ]
    }]
  };

  /* Question + answer per picture. Answers carry one wrong-colour distractor. */
  var QA = [
    ["an", "alligator?", "alligator", ["It's", "green."], "red."],
    ["a", "zebra?", "zebra", ["It's", "black", "and", "white."], "pink."],
    ["a", "banana?", "banana", ["It's", "yellow."], "blue."],
    [null, "milk?", "milk", ["It's", "white."], "green."],
    ["a", "dolphin?", "dolphin", ["It's", "grey."], "orange."],
    ["a", "London", "bus?", "bus", ["It's", "red."], "grey."],
    ["a", "giraffe?", "giraffe", ["It's", "brown", "and", "yellow."], "violet."],
    ["a", "London", "taxi?", "taxi", ["It's", "black."], "white."],
    [null, "Coca-Cola?", "coca-cola", ["It's", "brown."], "purple."],
    ["a", "gorilla?", "gorilla", ["It's", "black."], "yellow."]
  ];
  var stItems = [];
  QA.forEach(function (row, i) {
    var hasThird = row.length === 6;               // "London bus" / "London taxi"
    var art = row[0], img = hasThird ? row[3] : row[2];
    var answer = hasThird ? row[4] : row[3];
    var wrong = hasThird ? row[5] : row[4];
    var q = ["What", "colour", "is"];
    if (art) q.push(art);
    if (hasThird) { q.push(row[1]); q.push(row[2]); } else { q.push(row[1]); }
    stItems.push({
      id: "st-q" + (i + 1), level: 1,
      prompt: "Ask about the colour.", promptCs: "Zeptej se na barvu.",
      image: P8 + img + ".webp", answer: q, distractors: []
    });
    stItems.push({
      id: "st-a" + (i + 1), level: 1,
      prompt: "Answer with the colour.", promptCs: "Odpov\u011Bz barvou.",
      image: P8 + img + ".webp", answer: answer, distractors: [wrong]
    });
  });
  lesson.games.sentenceTrain = {
    enabled: true,
    contractions: { "What's": "What is", "It's": "It is" },
    items: stItems
  };

  lesson.games.wordMatch = {
    enabled: true,
    rounds: [
      { id: "wm-r1", instruction: "Match the English and Czech words.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 slova.",
        pairs: [
          { en: "colour", cs: "barva" }, { en: "red", cs: "\u010Derven\u00FD" },
          { en: "blue", cs: "modr\u00FD" }, { en: "green", cs: "zelen\u00FD" },
          { en: "yellow", cs: "\u017Elut\u00FD" }, { en: "white", cs: "b\u00EDl\u00FD" }
        ] },
      { id: "wm-r2", instruction: "Match the English and Czech words.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 slova.",
        pairs: [
          { en: "black", cs: "\u010Dern\u00FD" }, { en: "brown", cs: "hn\u011Bd\u00FD" },
          { en: "pink", cs: "r\u016F\u017Eov\u00FD" }, { en: "purple", cs: "v\u00EDnov\u00FD" },
          { en: "violet", cs: "fialov\u00FD" }, { en: "grey", cs: "\u0161ed\u00FD" }
        ] },
      { id: "wm-r3", instruction: "Match the English and Czech words.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 slova.",
        pairs: [
          { en: "orange", cs: "oran\u017Eov\u00FD" }, { en: "moon", cs: "M\u011Bs\u00EDc" },
          { en: "star", cs: "hv\u011Bzda" }, { en: "sun", cs: "Slunce" },
          { en: "cloud", cs: "mrak" }, { en: "grass", cs: "tr\u00E1va" }
        ] },
      { id: "wm-r4", instruction: "Match the English and Czech words.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 slova.",
        pairs: [
          { en: "orange", cs: "pomeran\u010D" }, { en: "egg", cs: "vejce" },
          { en: "sky", cs: "obloha" }, { en: "London", cs: "Lond\u00FDn" },
          { en: "Write.", cs: "Pi\u0161." }, { en: "Colour.", cs: "Vybarvi." },
          { en: "What colour is it?", cs: "Jakou to m\u00E1 barvu?" }
        ] },
      { id: "wm-r5", instruction: "Match the English and Czech sentences.",
        instructionCs: "Spoj anglick\u00E9 a \u010Desk\u00E9 v\u011Bty.",
        pairs: [
          { en: "Match.", cs: "Spoj." }, { en: "Touch.", cs: "Dotkni se." },
          { en: "You are right!", cs: "M\u00E1\u0161 pravdu!" }, { en: "Yes!", cs: "Ano!" },
          { en: "Well done!", cs: "V\u00FDborn\u011B!" }, { en: "Perfect!", cs: "Perfektn\u00ED!" },
          { en: "OK!", cs: "Dob\u0159e!" }
        ] }
    ]
  };
})();

/* ---- Page 12 (Unit 4, How are you?): Conversation Comic with the three
   greeting exchanges from activity 1 (each pair of people takes the stage
   for their scenes), and Sentence Train from the activity-2 role play. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u4-how-are-you-p12") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  lesson.targetPhrases = ["How are you?", "I'm fine.", "Thank you.", "And you?", "Fine, thanks."];

  lesson.games.conversationComic = {
    enabled: true,
    setting: "school-playground",
    characters: [
      { id: "anna", name: "Mary" },
      { id: "tom", name: "Tom" },
      { id: "eva", name: "Mrs Green" },
      { id: "ben", name: "Mr Smith" },
      { id: "nora", name: "Mrs Novak" },
      { id: "lucy", name: "Lucy" }
    ],
    scenes: [
      /* Conversation 1: Mary and Tom */
      { speaker: "anna", text: "Hello, Tom.", responseSpeaker: "tom",
        options: ["Hello, Mary. How are you?", "It's a pencil.", "Goodbye."],
        answer: "Hello, Mary. How are you?" },
      { speaker: "tom", text: "Hello, Mary. How are you?", responseSpeaker: "anna",
        options: ["I'm fine, thank you.", "It's green.", "My name's Tom."],
        answer: "I'm fine, thank you." },
      /* Conversation 2: Mrs Green and Mr Smith */
      { speaker: "eva", text: "Hello, Mr Smith. How are you?", responseSpeaker: "ben",
        options: ["I'm fine. Thank you. And what about you?", "It's a bus.", "Bye, Lucy."],
        answer: "I'm fine. Thank you. And what about you?" },
      { speaker: "ben", text: "I'm fine. Thank you. And what about you?", responseSpeaker: "eva",
        options: ["I'm fine.", "Seven.", "Stand up."],
        answer: "I'm fine." },
      /* Conversation 3: Mrs Novak and Lucy */
      { speaker: "nora", text: "Hello, Lucy. How are you?", responseSpeaker: "lucy",
        options: ["I'm fine. Thank you. And you?", "Come here.", "It's a zebra."],
        answer: "I'm fine. Thank you. And you?" },
      { speaker: "lucy", text: "I'm fine. Thank you. And you?", responseSpeaker: "nora",
        options: ["Fine, thanks.", "Sit down.", "A yellow star."],
        answer: "Fine, thanks." }
    ]
  };

  lesson.games.sentenceTrain = {
    enabled: true,
    contractions: { "I'm": "I am" },
    items: [
      { id: "st-01", level: 1, prompt: "Say hello and ask Dita how she is.", promptCs: "Pozdrav Ditu a zeptej se, jak se m\u00E1.",
        image: "svg:wave-girl",
        answer: ["Hi,", "Dita,", "how", "are", "you?"], distractors: ["fine."] },
      { id: "st-02", level: 1, prompt: "Answer and ask back.", promptCs: "Odpov\u011Bz a zeptej se tak\u00E9.",
        image: "svg:question",
        answer: ["I'm", "fine.", "Thank", "you.", "And", "you?"], distractors: ["Thanks."] },
      { id: "st-03", level: 1, prompt: "Give a short answer.", promptCs: "Odpov\u011Bz kr\u00E1tce.",
        image: "svg:introduce-girl",
        answer: ["I'm", "fine,", "thanks."], distractors: ["you?"] }
    ]
  };
})();

/* ---- Page 13 (Unit 4, second page): four games.
   Sentence Train: the activity-4 jumbled-sentence puzzles (the puzzle pieces
   are exactly the word tiles, so no extra distractors are added).
   Listen and Choose: the activity-5 "th" pronunciation set.
   Picture Match: the activity-6 commands with the school's illustrations.
   Word Match: the activity-7 vocabulary box. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u4-how-are-you-p13") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  var P13 = "assets/lesson-images/p13/";
  var P8 = "assets/lesson-images/p8/";

  lesson.games.sentenceTrain = {
    enabled: true,
    contractions: { "What's": "What is" },
    items: [
      { id: "st-01", level: 1, prompt: "Put the puzzle words in order.", promptCs: "Slo\u017E slova ve spr\u00E1vn\u00E9m po\u0159ad\u00ED.",
        image: "svg:question", answer: ["How", "are", "you?"], distractors: [] },
      { id: "st-02", level: 1, prompt: "Put the puzzle words in order.", promptCs: "Slo\u017E slova ve spr\u00E1vn\u00E9m po\u0159ad\u00ED.",
        image: "svg:question2", answer: ["What's", "your", "name?"], distractors: [] },
      { id: "st-03", level: 1, prompt: "Put the puzzle words in order.", promptCs: "Slo\u017E slova ve spr\u00E1vn\u00E9m po\u0159ad\u00ED.",
        image: "svg:introduce-boy", answer: ["My", "name", "is", "Paul."], distractors: [] },
      { id: "st-04", level: 1, prompt: "Put the puzzle words in order.", promptCs: "Slo\u017E slova ve spr\u00E1vn\u00E9m po\u0159ad\u00ED.",
        image: P8 + "whats-this.webp", answer: ["What's", "this?"], distractors: [] },
      { id: "st-05", level: 1, prompt: "Put the puzzle words in order.", promptCs: "Slo\u017E slova ve spr\u00E1vn\u00E9m po\u0159ad\u00ED.",
        image: P8 + "zebra.webp", answer: ["This", "is", "a", "zebra."], distractors: [] }
    ]
  };

  lesson.games.listenAndChoose = {
    enabled: true,
    items: [
      { id: "lc-1", type: "phrase", audio: "thank you", options: ["thank you", "thanks", "this"], answerIndex: 0 },
      { id: "lc-2", type: "phrase", audio: "thanks", options: ["thanks", "that's", "thank you"], answerIndex: 0 },
      { id: "lc-3", type: "phrase", audio: "this", options: ["this", "that's", "thanks"], answerIndex: 0 },
      { id: "lc-4", type: "phrase", audio: "that's", options: ["that's", "this", "thank you"], answerIndex: 0 },
      { id: "lc-5", type: "phrase", audio: "Mrs Smith", options: ["Mrs Smith", "Mr Smith", "thanks"], answerIndex: 0 },
      { id: "lc-6", type: "phrase", audio: "This is Mrs Smith.",
        options: ["This is Mrs Smith.", "Thank you, Mrs Smith.", "That's Mr Smith."], answerIndex: 0 },
      { id: "lc-7", type: "phrase", audio: "Thank you, Mrs Smith.",
        options: ["Thank you, Mrs Smith.", "This is Mrs Smith.", "Thanks, Mr Smith."], answerIndex: 0 }
    ]
  };

  lesson.games.pictureMatch = {
    enabled: true,
    rounds: [{
      id: "pm-r1",
      instruction: "Match the words to the pictures.",
      instructionCs: "P\u0159i\u0159a\u010F slova k obr\u00E1zk\u016Fm.",
      items: [
        { answer: "Read.", image: P13 + "read.webp", alt: "A boy reading an open book at his desk" },
        { answer: "Say.", image: P13 + "say.webp", alt: "A boy waving and saying hello" }
      ]
    }]
  };

  lesson.games.wordMatch = {
    enabled: true,
    rounds: [{
      id: "wm-r1",
      instruction: "Match the English and Czech.",
      instructionCs: "Spoj anglick\u00E9 a \u010Desk\u00E9 v\u00FDrazy.",
      pairs: [
        { en: "How are you?", cs: "Jak se m\u00E1\u0161?" },
        { en: "I'm fine.", cs: "M\u00E1m se dob\u0159e." },
        { en: "Thanks.", cs: "D\u00EDky." },
        { en: "Thank you.", cs: "D\u011Bkuji ti." },
        { en: "What about you?", cs: "A co ty?" },
        { en: "Read.", cs: "\u010Cti." },
        { en: "Say.", cs: "\u0158ekni." }
      ]
    }]
  };
})();

/* ---- Page 13 (Unit 4, second page): four games.
   Sentence Train: the activity-4 jumbled sentences (the puzzle pieces are
   the tile set \u2014 no extra distractors, just like the workbook).
   Listen and Choose: the activity-5 "th" pronunciation set as minimal-pair
   listening. Picture Match: Read. / Say. with the school's illustrations.
   Word Match: the activity-7 vocabulary box. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u4-how-are-you-p13") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  lesson.targetPhrases = ["How are you?", "I'm fine.", "Thanks.", "Thank you.", "What about you?", "Read.", "Say."];

  lesson.games.sentenceTrain = {
    enabled: true,
    contractions: { "What's": "What is", "I'm": "I am" },
    items: [
      { id: "st-01", level: 1, prompt: "Put the words in order.", promptCs: "Se\u0159a\u010F slova.",
        image: "svg:question", answer: ["How", "are", "you?"], distractors: [] },
      { id: "st-02", level: 1, prompt: "Put the words in order.", promptCs: "Se\u0159a\u010F slova.",
        image: "svg:introduce-girl", answer: ["What's", "your", "name?"], distractors: [] },
      { id: "st-03", level: 1, prompt: "Put the words in order.", promptCs: "Se\u0159a\u010F slova.",
        image: "svg:introduce-boy", answer: ["My", "name", "is", "Paul."], distractors: [] },
      { id: "st-04", level: 1, prompt: "Put the words in order.", promptCs: "Se\u0159a\u010F slova.",
        image: "assets/lesson-images/p8/whats-this.webp", answer: ["What's", "this?"], distractors: [] },
      { id: "st-05", level: 1, prompt: "Put the words in order.", promptCs: "Se\u0159a\u010F slova.",
        image: "assets/lesson-images/p8/zebra.webp", answer: ["This", "is", "a", "zebra."], distractors: [] }
    ]
  };

  lesson.games.listenAndChoose = {
    enabled: true,
    items: [
      { id: "lc-1", type: "phrase", audio: "thank you", options: ["thank you", "this", "that's"], answerIndex: 0 },
      { id: "lc-2", type: "phrase", audio: "thanks", options: ["thanks", "that's", "this"], answerIndex: 0 },
      { id: "lc-3", type: "phrase", audio: "Mrs Smith", options: ["Mrs Smith", "this", "thanks"], answerIndex: 0 },
      { id: "lc-4", type: "phrase", audio: "this", options: ["this", "thanks", "that's"], answerIndex: 0 },
      { id: "lc-5", type: "phrase", audio: "that's", options: ["that's", "this", "thank you"], answerIndex: 0 },
      { id: "lc-6", type: "phrase", audio: "This is Mrs Smith.",
        options: ["This is Mrs Smith.", "Thank you, Mrs Smith.", "This is a zebra."], answerIndex: 0 },
      { id: "lc-7", type: "phrase", audio: "Thank you, Mrs Smith.",
        options: ["Thank you, Mrs Smith.", "This is Mrs Smith.", "Thanks."], answerIndex: 0 }
    ]
  };

  lesson.games.pictureMatch = {
    enabled: true,
    rounds: [{
      id: "pm-r1",
      instruction: "Match the words to the pictures.",
      instructionCs: "P\u0159i\u0159a\u010F slova k obr\u00E1zk\u016Fm.",
      items: [
        { answer: "Read.", image: "assets/lesson-images/p13/read.webp", alt: "A boy reading an open book at his desk" },
        { answer: "Say.", image: "assets/lesson-images/p13/say.webp", alt: "A boy waving and speaking" }
      ]
    }]
  };

  lesson.games.wordMatch = {
    enabled: true,
    rounds: [{
      id: "wm-r1",
      instruction: "Match the English and Czech.",
      instructionCs: "Spoj anglick\u00E9 a \u010Desk\u00E9 v\u00FDrazy.",
      pairs: [
        { en: "How are you?", cs: "Jak se m\u00E1\u0161?" },
        { en: "I'm fine.", cs: "M\u00E1m se dob\u0159e." },
        { en: "Thanks.", cs: "D\u00EDky." },
        { en: "Thank you.", cs: "D\u011Bkuji ti." },
        { en: "What about you?", cs: "A co ty?" },
        { en: "Read.", cs: "\u010Cti." },
        { en: "Say.", cs: "\u0158\u00EDkej." }
      ]
    }]
  };
})();

/* ---- Page 14 (Unit 5, Numbers): four games. Original number-card artwork
   (numeral + countable dots). The telephone sentence accepts the number
   groups in any order \u2014 any order is a valid phone number to say. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u5-numbers-p14") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  var P = "assets/lesson-images/p14/";
  var WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  var CZECH = ["jeden", "dva", "t\u0159i", "\u010Dty\u0159i", "p\u011Bt", "\u0161est", "sedm", "osm", "dev\u011Bt", "deset"];
  lesson.targetVocabulary = WORDS.concat(["zero", "number", "telephone number"]);

  function card(n) {
    return { answer: WORDS[n - 1], image: P + "n" + n + ".svg", alt: "The number " + n + " with " + n + " dots" };
  }
  lesson.games.pictureMatch = {
    enabled: true,
    rounds: [
      { id: "pm-r1", instruction: "Match the words to the numbers.",
        instructionCs: "P\u0159i\u0159a\u010F slova k \u010D\u00EDsl\u016Fm.",
        items: [1, 2, 3, 4, 5].map(card) },
      { id: "pm-r2", instruction: "Match the words to the numbers.",
        instructionCs: "P\u0159i\u0159a\u010F slova k \u010D\u00EDsl\u016Fm.",
        items: [6, 7, 8, 9, 10].map(card) }
    ]
  };

  /* Listen and point, app style: hear the number, tap the right card. */
  function lcItem(n) {
    var group = n <= 5 ? [1, 2, 3, 4, 5] : [6, 7, 8, 9, 10];
    var others = group.filter(function (x) { return x !== n; });
    var d1 = others[(n * 3) % others.length];
    var d2 = others.filter(function (x) { return x !== d1; })[(n * 5) % (others.length - 1)];
    return {
      id: "lc-" + n, type: "picture", audio: WORDS[n - 1],
      options: [n, d1, d2].map(function (x) {
        return { image: P + "n" + x + ".svg", alt: "The number " + x + " with " + x + " dots" };
      }),
      answerIndex: 0
    };
  }
  lesson.games.listenAndChoose = {
    enabled: true,
    rounds: [
      { id: "lc-r1", items: [1, 2, 3, 4, 5].map(lcItem) },
      { id: "lc-r2", items: [6, 7, 8, 9, 10].map(lcItem) }
    ]
  };

  lesson.games.wordMatch = {
    enabled: true,
    rounds: [
      { id: "wm-r1", instruction: "Match the English and Czech numbers.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 \u010D\u00EDsla.",
        pairs: [0, 1, 2, 3, 4].map(function (i) { return { en: WORDS[i], cs: CZECH[i] }; })
               .concat([{ en: "zero", cs: "nula" }]) },
      { id: "wm-r2", instruction: "Match the English and Czech numbers.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 \u010D\u00EDsla.",
        pairs: [5, 6, 7, 8, 9].map(function (i) { return { en: WORDS[i], cs: CZECH[i] }; }) }
    ]
  };

  /* "My telephone number is ..." \u2014 the three number groups may be said
     in any order, so every permutation is accepted. */
  function phoneItem(id, groups, img) {
    var base = ["My", "telephone", "number", "is"];
    var perms = [];
    groups.forEach(function (a) {
      groups.forEach(function (b) {
        groups.forEach(function (c) {
          if (a !== b && b !== c && a !== c) perms.push(base.concat([a, b, c]));
        });
      });
    });
    return {
      id: id, level: 1,
      prompt: "Say your telephone number.", promptCs: "\u0158ekni sv\u00E9 telefonn\u00ED \u010D\u00EDslo.",
      image: img,
      answer: perms[0], altAnswers: perms.slice(1), distractors: []
    };
  }
  lesson.games.sentenceTrain = {
    enabled: true,
    contractions: {},
    items: [
      phoneItem("st-01", ["342", "806", "157"], "assets/lesson-images/p8/telephone.webp"),
      phoneItem("st-02", ["723", "481", "596"], "assets/lesson-images/p8/computer.webp")
    ]
  };
})();

/* ---- Page 15 (Unit 5, second page): four games.
   Activity 6 in the book is a rhyme (a creative work), so the comic is an
   original counting conversation using the unit's language instead. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u5-numbers-p15") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  lesson.targetPhrases = ["What's your telephone number?", "Count.", "That's great!"];

  /* Activity 5: ask for a telephone number \u2014 then give one (any group order). */
  lesson.games.sentenceTrain = {
    enabled: true,
    contractions: { "What's": "What is" },
    items: [
      { id: "st-01", level: 1, prompt: "Ask your friend.", promptCs: "Zeptej se kamar\u00E1da.",
        image: "svg:question",
        answer: ["What's", "your", "telephone", "number?"], distractors: ["my"] },
      (function () {
        var base = ["My", "telephone", "number", "is"];
        var groups = ["605", "213", "978"];
        var perms = [];
        groups.forEach(function (a) { groups.forEach(function (b) { groups.forEach(function (cc) {
          if (a !== b && b !== cc && a !== cc) perms.push(base.concat([a, b, cc]));
        }); }); });
        return { id: "st-02", level: 1, prompt: "Answer with your number.", promptCs: "Odpov\u011Bz sv\u00FDm \u010D\u00EDslem.",
          image: "assets/lesson-images/p8/telephone.webp",
          answer: perms[0], altAnswers: perms.slice(1), distractors: [] };
      })()
    ]
  };

  /* Original counting comic (activity-6 slot). */
  lesson.games.conversationComic = {
    enabled: true,
    setting: "school-playground",
    characters: [
      { id: "anna", name: "Anna" },
      { id: "max", name: "Max" }
    ],
    scenes: [
      { speaker: "anna", text: "Count with me! One, two, three...", responseSpeaker: "max",
        options: ["Four, five, six!", "A blue bag.", "Goodbye!"],
        answer: "Four, five, six!" },
      { speaker: "max", text: "Seven, eight, nine...", responseSpeaker: "anna",
        options: ["Ten! That's great!", "It's a taxi.", "Hello, Tom."],
        answer: "Ten! That's great!" },
      { speaker: "anna", text: "What's your telephone number?", responseSpeaker: "max",
        options: ["My telephone number is 342 806 157.", "I'm fine, thanks.", "It's green."],
        answer: "My telephone number is 342 806 157." },
      { speaker: "max", text: "Close the door, please.", responseSpeaker: "anna",
        options: ["OK!", "Nine.", "It's a zebra."],
        answer: "OK!" }
    ]
  };

  /* Activity 7 (listen and write numbers): hear a sequence, pick the digits. */
  lesson.games.listenAndChoose = {
    enabled: true,
    items: [
      { id: "lc-1", type: "phrase", audio: "one, two, three, four, five",
        options: ["1 2 3 4 5", "5 4 3 2 1", "2 4 6 8 10"], answerIndex: 0 },
      { id: "lc-2", type: "phrase", audio: "seven, two",
        options: ["7 2", "2 7", "9 2"], answerIndex: 0 },
      { id: "lc-3", type: "phrase", audio: "three, six, ten",
        options: ["3 6 10", "3 9 10", "6 3 10"], answerIndex: 0 },
      { id: "lc-4", type: "phrase", audio: "nine, one, eight",
        options: ["9 1 8", "9 8 1", "1 9 8"], answerIndex: 0 },
      { id: "lc-5", type: "phrase", audio: "four, five, zero",
        options: ["4 5 0", "5 4 0", "4 0 5"], answerIndex: 0 },
      { id: "lc-6", type: "phrase", audio: "ten, nine, eight, seven",
        options: ["10 9 8 7", "7 8 9 10", "10 8 9 7"], answerIndex: 0 }
    ]
  };

  /* Activity 9: the vocabulary box. */
  var W = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  var CZ = ["jeden", "dva", "t\u0159i", "\u010Dty\u0159i", "p\u011Bt", "\u0161est", "sedm", "osm", "dev\u011Bt", "deset"];
  lesson.games.wordMatch = {
    enabled: true,
    rounds: [
      { id: "wm-r1", instruction: "Match the English and Czech numbers.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 \u010D\u00EDsla.",
        pairs: [0, 1, 2, 3, 4, 5].map(function (i) { return { en: W[i], cs: CZ[i] }; }) },
      { id: "wm-r2", instruction: "Match the English and Czech numbers.",
        instructionCs: "Spoj anglick\u00E1 a \u010Desk\u00E1 \u010D\u00EDsla.",
        pairs: [6, 7, 8, 9].map(function (i) { return { en: W[i], cs: CZ[i] }; })
               .concat([{ en: "zero", cs: "nula" }]) },
      { id: "wm-r3", instruction: "Match the English and Czech.",
        instructionCs: "Spoj anglick\u00E9 a \u010Desk\u00E9 v\u00FDrazy.",
        pairs: [
          { en: "number", cs: "\u010D\u00EDslo" },
          { en: "telephone number", cs: "telefonn\u00ED \u010D\u00EDslo" },
          { en: "Count.", cs: "Po\u010D\u00EDtej." },
          { en: "my", cs: "m\u016Fj" },
          { en: "your", cs: "tv\u016Fj" }
        ] }
    ]
  };
})();

/* ---- Page 16 (Unit 6, English Alphabet): three games.
   Listen and Choose: hear a letter, pick its Aa-style card (five rounds
   across the alphabet). Picture Match: the "Read the letters" abbreviations
   that have natural pictures (bare letters L/K/X are covered by the
   listening game). Sentence Train: the spelling dialogue. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u6-english-alphabet-p16") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  var P = "assets/lesson-images/p16/";
  lesson.targetVocabulary = ["alphabet", "spell", "surname"];
  lesson.targetPhrases = ["Spell it, please.", "What's your surname?"];

  var GROUPS = ["ABCDE", "FGHIJ", "KLMNO", "PQRST", "UVWXYZ"];
  function letterCard(ch) {
    return { image: P + "l-" + ch.toLowerCase() + ".svg", alt: "The letter " + ch + " in capital and small letters" };
  }
  lesson.games.listenAndChoose = {
    enabled: true,
    rounds: GROUPS.map(function (group, gi) {
      return {
        id: "lc-r" + (gi + 1),
        items: group.split("").map(function (ch, ci) {
          var others = group.split("").filter(function (x) { return x !== ch; });
          var d1 = others[ci % others.length];
          var d2 = others.filter(function (x) { return x !== d1; })[(ci + 2) % (others.length - 1)];
          return {
            id: "lc-" + ch, type: "picture", audio: ch,
            options: [ch, d1, d2].map(letterCard),
            answerIndex: 0
          };
        })
      };
    })
  };

  lesson.games.pictureMatch = {
    enabled: true,
    rounds: [{
      id: "pm-r1",
      instruction: "Read the letters.",
      instructionCs: "\u010Cti p\u00EDsmena.",
      items: [
        { answer: "U.S.A.", image: P + "usa.svg", alt: "The flag of the United States" },
        { answer: "G.B.", image: P + "gb.svg", alt: "The flag of Great Britain" },
        { answer: "UFO", image: P + "ufo.svg", alt: "A flying saucer in the night sky" },
        { answer: "PC", image: "assets/lesson-images/p8/computer.webp", alt: "A desktop computer" },
        { answer: "SMS", image: P + "sms.svg", alt: "A phone with a text message bubble" },
        { answer: "AM", image: P + "am.svg", alt: "A morning sun rising with a clock" }
      ]
    }]
  };

  lesson.games.sentenceTrain = {
    enabled: true,
    contractions: { "What's": "What is", "name's": "name is", "That's": "That is", "It's": "It is" },
    items: [
      { id: "st-01", level: 1, prompt: "Ask for a name.", promptCs: "Zeptej se na jm\u00E9no.",
        image: "svg:question", answer: ["What's", "your", "name?"], distractors: ["surname?"] },
      { id: "st-02", level: 1, prompt: "Say the name.", promptCs: "\u0158ekni jm\u00E9no.",
        image: "svg:introduce-boy", answer: ["My", "name's", "John."], distractors: [] },
      { id: "st-03", level: 1, prompt: "Ask him to spell it.", promptCs: "Popros ho, a\u0165 to hl\u00E1skuje.",
        image: "svg:question2", answer: ["Spell", "it,", "please."], distractors: [] },
      { id: "st-04", level: 1, prompt: "Spell the name, letter by letter.", promptCs: "Hl\u00E1skuj jm\u00E9no po p\u00EDsmenech.",
        image: P + "l-j.svg", answer: ["That's", "J", "O", "H", "N"], distractors: ["S"] },
      { id: "st-05", level: 1, prompt: "Ask for the surname.", promptCs: "Zeptej se na p\u0159\u00EDjmen\u00ED.",
        image: "svg:question", answer: ["And", "what's", "your", "surname?"], distractors: ["name?"] },
      { id: "st-06", level: 1, prompt: "Spell the surname, letter by letter.", promptCs: "Hl\u00E1skuj p\u0159\u00EDjmen\u00ED po p\u00EDsmenech.",
        image: P + "l-v.svg", answer: ["It's", "V", "E", "S", "E", "L", "Y"], distractors: ["H"] },
      { id: "st-07", level: 1, prompt: "Be polite.", promptCs: "Bu\u010F zdvo\u0159il\u00FD.",
        image: "svg:wave-girl", answer: ["Thank", "you."], distractors: ["please."] }
    ]
  };
})();

/* ---- Page 17 (Unit 6, second page), activity 7: Spelling Bee.
   The book's gap-fill words with its own underscore patterns. */
(function () {
  var lesson = null;
  for (var i = 0; i < EA.builtInLessons.length; i++) {
    if (EA.builtInLessons[i].id === "t0-u6-english-alphabet-p17") { lesson = EA.builtInLessons[i]; break; }
  }
  if (!lesson) return;
  lesson.games.spellingBee = {
    enabled: true,
    items: [
      { id: "sb-1", answer: "alligator", pattern: "_lli___or", image: "assets/lesson-images/p8/alligator.webp" },
      { id: "sb-2", answer: "eight", pattern: "_ig_t", image: "assets/lesson-images/p14/n8.svg" },
      { id: "sb-3", answer: "egg", pattern: "_gg", image: "assets/lesson-images/p10/egg.svg" },
      { id: "sb-4", answer: "introduction", pattern: "_ntrod___ion", image: "svg:meeting" },
      { id: "sb-5", answer: "orange", pattern: "_ran__", image: "assets/lesson-images/p10/orange.svg" },
      { id: "sb-6", answer: "unit", pattern: "_ni_", image: "assets/lesson-images/p17/unit.svg" }
    ]
  };
})();

/* ---- Spelling Bee across the Introduction pages: odd pages get six words
   from that page's Learn-new-words vocabulary, even pages hide the game by
   default (teachers can show it from the Edit Games hub). Page 17 keeps its
   own gap-fill activity words. */
(function () {
  function byId(id) {
    for (var i = 0; i < EA.builtInLessons.length; i++) {
      if (EA.builtInLessons[i].id === id) return EA.builtInLessons[i];
    }
    return null;
  }
  function bee(lessonId, words) {
    var lesson = byId(lessonId);
    if (!lesson) return;
    lesson.games.spellingBee = {
      enabled: true,
      items: words.map(function (w, i) {
        return { id: "sb-" + (i + 1), answer: w[0], pattern: w[1], image: w[2] };
      })
    };
  }
  var P8 = "assets/lesson-images/p8/", P10 = "assets/lesson-images/p10/",
      P13 = "assets/lesson-images/p13/", P14 = "assets/lesson-images/p14/",
      P7 = "assets/lesson-images/p7/";

  bee("t0-u1-hello-hi-p7", [
    ["hello", "h_ll_", "svg:wave-boy"],
    ["goodbye", "g__dby_", "svg:leaving"],
    ["morning", "m_rn_ng", P10 + "sun.svg"],
    ["name", "n_m_", "svg:introduce-girl"],
    ["stand", "_t_nd", P7 + "stand-up.webp"],
    ["come", "c_m_", P7 + "come-here.webp"]
  ]);
  bee("t0-u2-english-around-us-p9", [
    ["banana", "b_n_n_", P8 + "banana.webp"],
    ["computer", "c_mp_t_r", P8 + "computer.webp"],
    ["giraffe", "g_r_ff_", P8 + "giraffe.webp"],
    ["helicopter", "h_l_c_pt_r", P8 + "helicopter.webp"],
    ["telephone", "t_l_ph_n_", P8 + "telephone.webp"],
    ["zebra", "z_br_", P8 + "zebra.webp"]
  ]);
  bee("t0-u3-colours-p11", [
    ["yellow", "y_ll_w", P10 + "colour-yellow.svg"],
    ["green", "gr__n", P10 + "colour-green.svg"],
    ["purple", "p_rpl_", P10 + "colour-purple.svg"],
    ["grey", "gr__", P10 + "colour-grey.svg"],
    ["cloud", "cl__d", P10 + "cloud.svg"],
    ["grass", "gr_ss", P10 + "grass.svg"]
  ]);
  bee("t0-u4-how-are-you-p13", [
    ["thanks", "th_nks", "svg:meeting"],
    ["fine", "f_n_", "svg:wave-girl"],
    ["read", "r__d", P13 + "read.webp"],
    ["say", "s_y", P13 + "say.webp"],
    ["this", "th_s", P8 + "whats-this.webp"],
    ["that", "th_t", "svg:question2"]
  ]);
  bee("t0-u5-numbers-p15", [
    ["three", "thr__", P14 + "n3.svg"],
    ["four", "f__r", P14 + "n4.svg"],
    ["seven", "s_v_n", P14 + "n7.svg"],
    ["eight", "__ght", P14 + "n8.svg"],
    ["ten", "t_n", P14 + "n10.svg"],
    ["telephone", "t_l_ph_n_", P8 + "telephone.webp"]
  ]);

  /* Even pages: hide the starter Bee by default. */
  ["t0-u1-hello-hi-p6", "t0-u2-english-around-us-p8", "t0-u3-colours-p10",
   "t0-u4-how-are-you-p12", "t0-u5-numbers-p14", "t0-u6-english-alphabet-p16"
  ].forEach(function (id) {
    var lesson = byId(id);
    if (lesson && lesson.games.spellingBee) lesson.games.spellingBee.enabled = false;
  });
})();
