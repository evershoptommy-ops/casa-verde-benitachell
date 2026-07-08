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

  // Photo gallery: a Booking.com/Airbnb-style slider — one large main
  // image, a thumbnail strip to jump between photos, and prev/next
  // arrows. Clicking the main image opens the full-screen PhotoSwipe
  // lightbox (v5, loaded from CDN, pinned to an exact version) at the
  // current photo, with pinch-to-zoom and swipe/arrow navigation.
  var galleryThumbs = document.getElementById("gallery-thumbs");
  if (galleryThumbs) {
    (function () {
      var thumbs = Array.prototype.slice.call(
        galleryThumbs.querySelectorAll(".gallery-thumb")
      );
      var mainBox = document.querySelector(".gallery-main");
      var mainImg = document.getElementById("gallery-main-img");
      var counterCurrent = document.getElementById("gallery-counter-current");
      var prevBtn = document.querySelector(".gallery-arrow--prev");
      var nextBtn = document.querySelector(".gallery-arrow--next");
      var currentIndex = 0;

      function setActive(index, skipScroll) {
        currentIndex = (index + thumbs.length) % thumbs.length;
        var thumb = thumbs[currentIndex];
        mainImg.src = thumb.dataset.full;
        mainImg.alt = thumb.dataset.alt;
        mainImg.width = thumb.dataset.w;
        mainImg.height = thumb.dataset.h;
        if (counterCurrent) counterCurrent.textContent = String(currentIndex + 1);
        thumbs.forEach(function (t, i) {
          t.classList.toggle("gallery-thumb--active", i === currentIndex);
        });
        if (!skipScroll) {
          thumb.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      }

      thumbs.forEach(function (thumb, i) {
        thumb.addEventListener("click", function () {
          setActive(i);
        });
      });

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          setActive(currentIndex - 1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          setActive(currentIndex + 1);
        });
      }

      // Touch swipe on the main image (left = next, right = previous).
      var touchStartX = null;
      mainBox.addEventListener(
        "touchstart",
        function (e) {
          touchStartX = e.touches[0].clientX;
        },
        { passive: true }
      );
      mainBox.addEventListener("touchend", function (e) {
        if (touchStartX === null) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          setActive(currentIndex + (dx < 0 ? 1 : -1));
        }
        touchStartX = null;
      });

      // Click/tap the main image to open the full-screen lightbox at
      // whichever photo is currently showing.
      mainImg.addEventListener("click", function () {
        var dataSource = thumbs.map(function (t) {
          return {
            src: t.dataset.full,
            width: parseInt(t.dataset.w, 10),
            height: parseInt(t.dataset.h, 10),
            alt: t.dataset.alt,
          };
        });
        import("https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.min.js")
          .then(function (module) {
            var PhotoSwipe = module.default;
            var pswp = new PhotoSwipe({
              dataSource: dataSource,
              index: currentIndex,
            });
            pswp.init();
          })
          .catch(function (err) {
            // Degraded but not broken: the slider itself still works
            // without the lightbox if the CDN fails to load.
            console.error("Gallery lightbox failed to load:", err);
          });
      });
    })();
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
