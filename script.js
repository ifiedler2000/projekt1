/* ============================================================
   Skriveni Šibenik — script.js
   - Category filtering + live search (combined)
   - Accessible form validation (no raw user input echoed into DOM)
   - GA4 events: cta_click, form_submit (guarded if gtag is undefined)
   - All DOM lookups guarded to avoid console errors
   ============================================================ */

(function () {
  "use strict";

  /* Safe GA4 helper: never throws if gtag is missing/blocked. */
  function track(eventName, params) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params || {});
      }
    } catch (err) {
      /* analytics must never break the UI */
    }
  }

  /* ---------- Hero CTA event ---------- */
  var heroCta = document.getElementById("hero-cta");
  if (heroCta) {
    heroCta.addEventListener("click", function () {
      track("cta_click", { location: "hero", label: "Pošalji upit" });
    });
  }

  /* ---------- Filtering + search ---------- */
  var filterButtons = Array.prototype.slice.call(
    document.querySelectorAll(".filter-btn")
  );
  var searchInput = document.getElementById("search-input");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
  var noResults = document.getElementById("no-results");

  var activeFilter = "sve";

  function applyFilters() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var visibleCount = 0;

    cards.forEach(function (card) {
      var category = card.getAttribute("data-category") || "";
      var haystack = (card.getAttribute("data-search") || "").toLowerCase();

      var matchesCategory = activeFilter === "sve" || category === activeFilter;
      var matchesQuery = query === "" || haystack.indexOf(query) !== -1;

      var show = matchesCategory && matchesQuery;
      card.hidden = !show;
      if (show) visibleCount++;
    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  }

  if (filterButtons.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeFilter = btn.getAttribute("data-filter") || "sve";

        filterButtons.forEach(function (b) {
          var isActive = b === btn;
          b.classList.toggle("is-active", isActive);
          b.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        applyFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  /* Initialise state on load */
  applyFilters();

  /* ---------- Form validation ---------- */
  var form = document.getElementById("kontakt-form");

  if (form) {
    var successMsg = document.getElementById("form-success");

    var fields = [
      {
        input: document.getElementById("ime"),
        error: document.getElementById("ime-error"),
        validate: function (value) {
          if (!value) return "Unesite svoje ime.";
          return "";
        }
      },
      {
        input: document.getElementById("email"),
        error: document.getElementById("email-error"),
        validate: function (value) {
          if (!value) return "Unesite e-mail adresu.";
          /* Simple, robust email shape check. */
          var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRe.test(value)) return "Unesite ispravnu e-mail adresu.";
          return "";
        }
      },
      {
        input: document.getElementById("poruka"),
        error: document.getElementById("poruka-error"),
        validate: function (value) {
          if (!value) return "Upišite poruku.";
          if (value.length < 10) return "Poruka mora imati barem 10 znakova.";
          return "";
        }
      }
    ];

    function setFieldError(field, message) {
      if (!field.input) return;
      var row = field.input.closest(".form__row");
      var hasError = Boolean(message);

      if (row) row.classList.toggle("has-error", hasError);
      field.input.setAttribute("aria-invalid", hasError ? "true" : "false");

      /* textContent only — never innerHTML — so user input can't inject markup */
      if (field.error) field.error.textContent = message;
    }

    function validateField(field) {
      if (!field.input) return true;
      var message = field.validate(field.input.value.trim());
      setFieldError(field, message);
      return message === "";
    }

    /* Clear an error as the user fixes the field. */
    fields.forEach(function (field) {
      if (!field.input) return;
      field.input.addEventListener("input", function () {
        if (field.input.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", function (event) {
      var allValid = true;
      var firstInvalid = null;

      fields.forEach(function (field) {
        var ok = validateField(field);
        if (!ok && !firstInvalid) firstInvalid = field.input;
        if (!ok) allValid = false;
      });

      if (!allValid) {
        event.preventDefault();
        if (successMsg) successMsg.hidden = true;
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /*
        Valid form → pošalji podatke Netlify Formsu preko fetch (AJAX).
        Tako se submission STVARNO zabilježi na Netlifyju, a korisnik
        ostaje na stranici i vidi poruku uspjeha.
        VAŽNO: radi SAMO na objavljenoj Netlify stranici. Lokalno
        (Live Preview / localhost) POST nema backend pa se izvrši catch() —
        to je očekivano.
      */
      event.preventDefault();

      track("form_submit", { form: "kontakt" });

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      // Serijaliziraj sva polja forme (uključuje i skriveni "form-name").
      var body = new URLSearchParams(new FormData(form)).toString();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
      })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          form.reset();
          fields.forEach(function (field) {
            setFieldError(field, "");
          });
          if (successMsg) {
            successMsg.hidden = false;
            successMsg.focus && successMsg.focus();
          }
        })
        .catch(function () {
          if (successMsg) successMsg.hidden = true;
          window.alert(
            "Slanje trenutno nije moguće. Napomena: obrazac radi tek na objavljenoj Netlify stranici, ne lokalno."
          );
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();