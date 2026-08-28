/* English Adventure — shared navigation, identical on every page.
   Pages set window.EA_BASE ("" at root, "../" inside /games/) before this runs. */

window.EA = window.EA || {};

EA.nav = {
  items: [
    { href: "index.html", icon: "🏠", label: "Home", id: "home" },
    { href: "lessons.html", icon: "📚", label: "Lessons", id: "lessons" },
    { href: "progress.html", icon: "⭐", label: "Progress", id: "progress" }
  ],

  build: function () {
    var base = window.EA_BASE || "";
    var active = document.body.getAttribute("data-page") || "";
    var header = EA.el("header", { class: "ea-header" });
    var inner = EA.el("div", { class: "ea-header-inner" });

    var logo = EA.el("a", { class: "ea-logo", href: base + "index.html", "aria-label": EA.config.appName + " home" });
    logo.innerHTML = '<img src="' + base + 'assets/icons/banner-logo.png" alt="' + EA.config.appName + '">';

    var toggle = EA.el("button", {
      class: "ea-menu-toggle", "aria-label": "Open menu", "aria-expanded": "false", text: "☰",
      onclick: function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      }
    });

    var nav = EA.el("nav", { class: "ea-nav", "aria-label": "Main menu" });
    this.items.forEach(function (item) {
      var a = EA.el("a", { href: base + item.href, class: active === item.id ? "is-active" : "" });
      a.innerHTML = '<span class="ea-nav-icon" aria-hidden="true">' + item.icon + "</span><span>" + item.label + "</span>";
      nav.appendChild(a);
    });

    // Sound toggle
    var sound = EA.el("button", { "aria-pressed": String(!!EA.settings.soundEnabled) });
    function paintSound() {
      sound.innerHTML = '<span class="ea-nav-icon" aria-hidden="true">' + (EA.settings.soundEnabled ? "🔊" : "🔇") +
        "</span><span>Sound</span>";
      sound.setAttribute("aria-label", EA.settings.soundEnabled ? "Turn sound off" : "Turn sound on");
    }
    paintSound();
    sound.addEventListener("click", function () {
      EA.settings.soundEnabled = !EA.settings.soundEnabled;
      EA.saveSettings(); paintSound();
      if (!EA.settings.soundEnabled) EA.audio.stop(); else EA.audio.tap();
      sound.setAttribute("aria-pressed", String(!!EA.settings.soundEnabled));
    });
    nav.appendChild(sound);

    // Fullscreen toggle
    if (document.documentElement.requestFullscreen) {
      var fs = EA.el("button", { "aria-label": "Full screen" });
      fs.innerHTML = '<span class="ea-nav-icon" aria-hidden="true">⛶</span><span>Full</span>';
      fs.addEventListener("click", function () {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen().catch(function () {});
      });
      nav.appendChild(fs);
    }

    // Teacher link, less prominent
    var teacher = EA.el("a", { href: base + "teacher.html", class: "ea-nav-teacher" + (active === "teacher" ? " is-active" : "") });
    teacher.innerHTML = '<span class="ea-nav-icon" aria-hidden="true">⚙️</span><span>Teacher</span>';
    nav.appendChild(teacher);

    inner.appendChild(logo);
    inner.appendChild(toggle);
    inner.appendChild(nav);
    header.appendChild(inner);
    document.body.insertBefore(header, document.body.firstChild);
  }
};
