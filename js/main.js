// Casa Verde — Benitachell, Costa Blanca
// Small, unobtrusive functional layer: dynamic footer year + a nicer
// (progressively-enhanced) Netlify Forms submission experience.
// Nothing here changes what the page looks like.

(function () {
  "use strict";

  // Footer year — avoids a stale copyright year on every page load.
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Photo gallery: a single static cover photo on the page — browsing
  // through all 27 photos only happens inside the full-screen PhotoSwipe
  // lightbox (v5, loaded from CDN, pinned to an exact version), which
  // has its own arrow/swipe/pinch-zoom navigation. The page itself never
  // scrolls or paginates; clicking the cover photo is the only entry
  // point. The hidden buttons in #gallery-thumbs aren't shown (see
  // css/style.css) — they just carry the data (data-full/-w/-h/-alt)
  // used to build the lightbox's photo list.
  var galleryThumbs = document.getElementById("gallery-thumbs");
  var mainImg = document.getElementById("gallery-main-img");
  if (galleryThumbs && mainImg) {
    mainImg.addEventListener("click", function () {
      var dataSource = Array.prototype.map.call(
        galleryThumbs.querySelectorAll(".gallery-thumb"),
        function (t) {
          return {
            src: t.dataset.full,
            width: parseInt(t.dataset.w, 10),
            height: parseInt(t.dataset.h, 10),
            alt: t.dataset.alt,
          };
        }
      );
      import("https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.min.js")
        .then(function (module) {
          var PhotoSwipe = module.default;
          var pswp = new PhotoSwipe({ dataSource: dataSource, index: 0 });
          pswp.init();
        })
        .catch(function (err) {
          // Degraded but not broken: the cover photo is still visible
          // without the lightbox if the CDN fails to load.
          console.error("Gallery lightbox failed to load:", err);
        });
    });
  }

  // Netlify Forms: submit via fetch and show an inline confirmation
  // instead of a full page redirect. If fetch/JS isn't available,
  // the form's own action="/success.html" still works natively.
  // Selector is class-based (not form[name=...]) because each language
  // page uses its own form name (contact-en, contact-nl, contact-de,
  // contact-es) so Netlify can tell submissions apart per language.
  var form = document.querySelector(".contact-form");
  if (!form) return;

  // Status text is read from data attributes so this one shared script
  // can show the message in whichever language the page is in.
  var msgSending = form.dataset.msgSending || "Sending your inquiry…";
  var msgSuccess =
    form.dataset.msgSuccess ||
    "Thank you — your inquiry has been sent. We'll be in touch shortly.";

  var statusEl = form.querySelector(".contact-form-status");
  var submitBtn = form.querySelector(".contact-submit");

  function encode(data) {
    return Object.keys(data)
      .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
      })
      .join("&");
  }

  function setStatus(message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.display = "block";
    statusEl.style.color = isError ? "#b3423a" : "#5E6347";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(form);
    var payload = {};
    formData.forEach(function (value, key) {
      payload[key] = value;
    });

    if (submitBtn) submitBtn.disabled = true;
    setStatus(msgSending, false);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode(payload),
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Network response was not ok");
        form.reset();
        setStatus(msgSuccess, false);
      })
      .catch(function () {
        // Fall back to a real form submission if the AJAX request fails
        // (e.g. offline, ad blocker). form.submit() bypasses the "submit"
        // event entirely, so this reaches Netlify Forms natively.
        form.submit();
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
