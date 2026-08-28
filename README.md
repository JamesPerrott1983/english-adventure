# English Adventure

Colourful, cartoon-themed English learning games for Czech children aged 8–9.
Five reusable game engines — **Picture Match**, **Sentence Train**, **Word Match**,
**Conversation Comic** and **Listen and Choose** — all driven entirely by lesson JSON. Adding a new lesson never
requires changing any JavaScript.

Everything is plain HTML, CSS and vanilla JavaScript. No build step, no Node.js, no backend.

---

## 1. How to run the application

**Option A — any static web server (recommended)**

Copy the `english-adventure` folder to a web server, or run one locally:

```bash
cd english-adventure
python3 -m http.server 8000        # then open http://localhost:8000
```

With a server you get everything, including offline caching (service worker) and
"install as app" (PWA).

**Option B — open from a local folder (file://)**

Double-click `index.html`. The whole demo lesson still plays, because the built-in lesson
is embedded in `js/lesson-data.js` and all artwork is inline SVG. Two things are
unavailable on `file://` (browsers block them for security): the offline service worker
and PWA installation. The Teacher Area shows a note explaining this.

## 2. How to host it

Upload the folder to any static host (school web space, GitHub Pages, Netlify, a shared
drive served over HTTP). No server-side code is needed. HTTPS is required for PWA
installation on most browsers.

## The built-in curriculum

The full workbook plan ships built in: 34 lessons across the nine themes — numbered
Units 1–28 plus the six named "Have Fun with English" units — each carrying its workbook
page numbers (generated from the school's English_Adventure.xlsx lesson list, defined in
`js/curriculum-data.js`). Unit 1 "Hello! Hi!" is the fully-built demonstration lesson;
every other lesson starts with placeholder Word Match content so it is valid and playable
from day one. Teachers replace the starter content lesson by lesson with 🛠 Edit games or
by generating full lessons with AI and pasting them into the JSON editor (keep the same
lesson "id" to replace a built-in lesson). Lessons a class isn't ready for can be
deactivated in the Teacher Area so they don't appear on the children's map.

## Themes and the adventure map

Lessons are organised into nine fixed themes (0 Introduction … 8 Final Revision). The
child-facing Lessons page is an adventure map: each theme is a shield stone on the path —
blue when in progress, gold when every lesson inside is completed, grey when empty — with
the theme number, name and a done/total counter. Tapping a shield opens that theme's
lessons. Each lesson carries a theme (0–8), unit (1–28) and workbook page number, shown
as "Unit 8 – What's This?" with a Page chip. In the Teacher Area, lessons are grouped by
theme, and **➕ New lesson** creates one from exactly those four facts (theme, unit,
title, page), seeds it with starter Word Match content so it is immediately valid, and
opens the visual editor. Theme, unit and page can be changed later in the editor's
"Lesson details" card; lessons without a theme appear under "Other lessons".

## 3. How to create a lesson

1. Copy `data/example-lesson.json` and give it a **new unique `id`** and title.
2. Fill in `learningObjectives`, `targetVocabulary`, `targetPhrases`.
3. Fill in the four game sections (any game can be disabled with `"enabled": false`).
4. Import it in the Teacher Area (see below). Validation runs automatically and reports
   problems in plain language (missing answers, duplicate options, unsupported formats…).

Key rules enforced by the validator:
- unique lesson `id`, required `title`, at least one learning objective
- at least one game with content
- every question has exactly one unambiguous correct answer
- Sentence Train distractors must not also appear in the answer
- Conversation Comic `answer` must be one of the `options`
- image/audio references must use supported formats

### Creating a lesson from a teacher-provided screenshot

Screenshots of textbooks or worksheets are **source material only**. Give the screenshot
to Claude and ask for an English Adventure lesson JSON. Claude will extract the topic,
vocabulary, phrases and level, then generate **original** exercises: different names,
different scenes, new sentence order, fresh distractors — never a copy of the worksheet
layout, wording or illustrations. Review the generated lesson in the Teacher Area
(Preview) before children use it. Never put a Claude API key into this app: the app is
static and any key in browser code would be public.

## 4. How to import a lesson

Teacher Area → *Import a lesson* → choose the JSON file. If validation passes, the lesson
appears immediately in the Lesson Library. Teachers can also **preview, activate/
deactivate, duplicate, export and delete** lessons from the same screen.

### Editing a lesson in the app

Teacher Area → *Edit a lesson (JSON)*: choose a lesson, then choose **which part** to
edit — lesson info, or one of the four games — so you only ever see a small, focused
piece of JSON instead of the whole file. On save the part is merged back into the full
lesson and everything is validated together. Saving a built-in lesson creates an
editable copy that replaces it on that device; **Export** always gives you the JSON as a
file. Invalid JSON or failed validation is reported in plain language and nothing is
saved until it's fixed. Lessons can also be **renamed** and given a **thumbnail** (from
the image library or built-in scenes) directly from the Lessons list.

### Visual editor (no JSON needed)

Teacher Area → Lessons → **🛠 Edit games** opens a friendly editor for that lesson:
every answer, hint and dialogue line is a text box you type over, the correct reply is
marked with a round tick button, and every picture has a 🖌️ ✎ button that opens the
picture picker. Changes save automatically (with the same validation as everywhere else —
a mistake like two identical answers shows "Not saved" with an explanation until fixed).
"Preview as a child" at the bottom jumps straight to the playable lesson.

### Picking pictures for answers

Below the editor is a thumbnail picker showing every uploaded picture and all built-in
scenes. Click inside the JSON where the `"image"` value belongs, then click a thumbnail —
its reference is inserted at the cursor (if the cursor is inside an existing "…" value,
the value is replaced).

## 5. How to add images

**Image library (recommended):** Teacher Area → *Images* → add PNG/JPG/GIF/WebP/SVG files
(under 500 KB each). Each picture appears as a thumbnail with a reference like
`img:dog-x4k2` to use in lesson JSON. Deleting a picture warns you if any lesson uses it;
those questions then fall back to a built-in scene instead of breaking. Library pictures
are stored in the browser (IndexedDB) on that device — to share pictures across devices,
use file paths as below.

The built-in art is inline SVG referenced as `"image": "svg:sceneName"` (available scenes:
`meeting`, `meeting2`, `leaving`, `leaving2`, `leaving-girl`, `introduce-girl`,
`introduce-girl2`, `introduce-boy`, `introduce-boy2`, `wave-boy`, `wave-boy2`,
`wave-girl`, `question`, `question2`, `school-playground`).

To use your own pictures instead, put PNG/JPG/WebP/SVG files in `assets/lesson-images/`
and reference them by path, e.g. `"image": "assets/lesson-images/dog.png"`. Always
provide `"alt"` text. Keep illustrations under ~500 KB and thumbnails under ~200 KB.
If an image fails to load, the app falls back to a built-in scene rather than breaking.

## 6. How to add audio

By default, spoken English uses the browser's speech synthesis (British English, slow,
clear). To use recorded audio instead, put MP3/OGG files in `assets/sounds/` and add
`"audioSrc": "assets/sounds/hello.mp3"` to a Listen and Choose item. Recorded audio is
preferred automatically; synthesis remains the fallback. If neither is available, the
written sentence is shown so no child is ever blocked.

## 7. How progress is stored

Everything stays on the device — no accounts, no tracking, no personal data.

- `localStorage` key `ea.settings` — sound, Czech support, reduced motion, seed, PIN
- `localStorage` key `ea.progress` — stars, scores, attempts, badges per lesson/game
- `localStorage` key `ea.importedLessons` — lessons imported in the Teacher Area
- Progress can be **exported and imported as JSON** from the Teacher Area.

## 8. How to reset progress

Teacher Area → *Progress tools* → **Reset all progress** (with confirmation).

## 9. How to change the global colours

Edit the CSS variables at the top of `css/global.css` (`--colour-primary`,
`--colour-secondary`, …). Every page and game reads from the same variables.

## 10. How to change the application name

Edit `EA.config.appName` in `js/app.js`. Also update `name`/`short_name` in
`manifest.webmanifest` and the `<title>` tags (titles are also set at runtime from the
config, so the config change is what users see).

---

## Folder structure

```
english-adventure/
├── index.html            Home
├── lessons.html          Lesson Library
├── lesson.html           Lesson overview (four game cards)
├── progress.html         Stars, badges, lesson path
├── teacher.html          Teacher Area (import, manage, settings)
├── games/                Four game pages (thin shells)
├── css/                  global.css (design system) + games.css
├── js/                   Shared modules + js/games/ engines
├── data/                 example-lesson.json (a complete import example)
├── assets/               icons, and folders for your images/sounds
├── sw.js                 Offline service worker
└── manifest.webmanifest  PWA manifest
```

## Scoring rules

First-try correct = 2 points, correct after retry = 1 point, wrong answers never subtract.
Stars per game: ≥95 % of points → ★★★, ≥70 % → ★★, otherwise ★. Badges: Picture Pro,
Sentence Builder and Super Speaker for a perfect run; Great Listener for completing the
listening game; Lesson Star when all games in a lesson are done.

## Teacher testing tip

Set a **fixed random seed** in Teacher Area → Settings to make question and answer order
reproducible while testing; leave it empty for normal randomised play.

## Accessibility

Keyboard navigation with visible focus, tap alternatives to all drag interactions,
alt text on all artwork, ARIA labels and live regions, sound toggle, reduced-motion
support (both the OS setting and a manual switch), no information carried by colour
alone, no flashing content, and audio never autoplays.
