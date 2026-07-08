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
