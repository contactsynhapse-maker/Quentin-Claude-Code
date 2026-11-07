/* =====================================================================
   FORMULE PERSONNALISÉE — configurateur en 4 étapes
   1. Véhicule   2. Niveau de saleté   3. Options   4. Récapitulatif
   Les listes proviennent de SITE_CONFIG.formule (js/config.js).
   ===================================================================== */
(function () {
  "use strict";

  var S = window.Site;
  if (!S) return;
  var F = S.config.formule || {};
  var el = S.el, filled = S.filled;

  var root = document.querySelector("[data-configurator]");
  if (!root) return;

  var form = root.querySelector("[data-form]");
  var stepsNav = root.querySelectorAll(".steps__item");
  var panels = root.querySelectorAll("[data-step]");
  var btnPrev = root.querySelector("[data-prev]");
  var btnNext = root.querySelector("[data-next]");
  var errorBox = root.querySelector("[data-error]");
  var TOTAL = panels.length;
  var current = 1;

  var LISTS = { vehicules: F.vehicules || [], niveaux: F.niveaux || [], options: F.options || [] };
  var STEP_KEYS = { 1: "vehicules", 2: "niveaux", 3: "options" };
  var LABELS = { vehicules: "Véhicule", niveaux: "État", options: "Options" };

  /* ---------- Construction des choix ---------- */
  root.querySelectorAll("[data-choices]").forEach(function (box) {
    var key = box.getAttribute("data-choices");
    var type = box.getAttribute("data-type");
    var items = LISTS[key];
    if (!items.length) {
      box.appendChild(el("p", { class: "tbd-muted", text: "Aucun choix disponible pour le moment." }));
      return;
    }
    items.forEach(function (item) {
      var input = el("input", { type: type, name: key, value: item.id });
      var text = el("span", null, [
        el("span", { class: "choice__name", text: item.nom }),
        filled(item.description) ? el("span", { class: "choice__desc", text: item.description }) : null,
      ]);
      box.appendChild(el("label", { class: "choice choice--" + type }, [
        input,
        el("span", { class: "choice__box" }, [el("span", { class: "choice__mark", "aria-hidden": "true" }), text]),
      ]));
    });
  });

  /* ---------- Lecture de la sélection ---------- */
  function findItem(key, id) {
    for (var i = 0; i < LISTS[key].length; i++) if (LISTS[key][i].id === id) return LISTS[key][i];
    return null;
  }

  function selection() {
    var fd = new FormData(form);
    return {
      vehicule: findItem("vehicules", fd.get("vehicules")),
      niveau: findItem("niveaux", fd.get("niveaux")),
      options: fd.getAll("options").map(function (id) { return findItem("options", id); }).filter(Boolean),
      nom: (fd.get("nom") || "").trim(),
      coordonnees: (fd.get("coordonnees") || "").trim(),
      commune: (fd.get("commune") || "").trim(),
      message: (fd.get("message") || "").trim(),
    };
  }

  /**
   * Prix estimatif.
   * Aucune règle de calcul n'est définie pour l'instant : tant que
   * `formule.tarification` vaut null dans config.js, aucun prix n'est affiché.
   * Une fois les règles validées, `tarification` pourra être une fonction
   * recevant la sélection et renvoyant un texte (ex. "XX €") ou null.
   */
  function estimate(sel) {
    if (typeof F.tarification === "function") {
      try { return F.tarification(sel) || null; } catch (e) { console.error(e); }
    }
    return null;
  }

  /* ---------- Navigation entre étapes ---------- */
  function validate(step) {
    var key = STEP_KEYS[step];
    if ((step === 1 || step === 2) && LISTS[key].length) {
      if (!form.querySelector('input[name="' + key + '"]:checked')) {
        return step === 1 ? "Sélectionnez votre type de véhicule pour continuer." : "Indiquez l'état du véhicule pour continuer.";
      }
    }
    return "";
  }

  function goTo(step, opts) {
    current = Math.max(1, Math.min(TOTAL, step));
    panels.forEach(function (p) {
      var on = Number(p.getAttribute("data-step")) === current;
      p.hidden = !on;
      p.classList.toggle("is-active", on);
    });
    stepsNav.forEach(function (s, i) {
      s.classList.toggle("is-active", i + 1 === current);
      s.classList.toggle("is-done", i + 1 < current);
      if (i + 1 === current) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current");
    });
    btnPrev.hidden = current === 1;
    btnNext.hidden = current === TOTAL;
    errorBox.textContent = "";
    if (current === TOTAL) renderSummary();

    if (!opts || opts.scroll !== false) {
      var top = root.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.4) {
        window.scrollTo({ top: window.scrollY + top - 90, behavior: "smooth" });
      }
    }
  }

  btnNext.addEventListener("click", function () {
    var err = validate(current);
    if (err) { errorBox.textContent = err; return; }
    goTo(current + 1);
  });
  btnPrev.addEventListener("click", function () { goTo(current - 1); });

  // Choix unique : passage automatique à l'étape suivante.
  form.addEventListener("change", function (e) {
    errorBox.textContent = "";
    if (e.target.type === "radio" && current < 3) {
      setTimeout(function () { goTo(current + 1); }, 220);
    }
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  /* ---------- Récapitulatif ---------- */
  function buildMessage(sel, prix) {
    var lines = [
      "Bonjour, je souhaite demander une prestation de nettoyage automobile.",
      "",
      "Ma formule :",
      "- Véhicule : " + (sel.vehicule ? sel.vehicule.nom : "non précisé"),
      "- État : " + (sel.niveau ? sel.niveau.nom : "non précisé"),
      "- Options : " + (sel.options.length ? sel.options.map(function (o) { return o.nom; }).join(", ") : "aucune"),
    ];
    if (prix) lines.push("- Prix estimatif : " + prix);
    lines.push("");
    if (sel.nom) lines.push("Nom : " + sel.nom);
    if (sel.coordonnees) lines.push("Contact : " + sel.coordonnees);
    if (sel.commune) lines.push("Commune : " + sel.commune);
    if (sel.message) lines.push("Précisions : " + sel.message);
    return lines.join("\n");
  }

  var summaryBox = root.querySelector("[data-summary]");
  var priceBox = root.querySelector("[data-price]");
  var sendBox = root.querySelector("[data-send]");

  function row(label, value, step) {
    var btn = el("button", { type: "button", class: "summary__edit", text: "Modifier" });
    btn.addEventListener("click", function () { goTo(step); });
    return el("div", { class: "summary__row" }, [el("dt", { text: label }), el("dd", { text: value }), btn]);
  }

  function renderSummary() {
    var sel = selection();
    summaryBox.textContent = "";
    summaryBox.appendChild(el("dl", { style: "margin:0" }, [
      row(LABELS.vehicules, sel.vehicule ? sel.vehicule.nom : "—", 1),
      row(LABELS.niveaux, sel.niveau ? sel.niveau.nom : "—", 2),
      row(LABELS.options, sel.options.length ? sel.options.map(function (o) { return o.nom; }).join(", ") : "Aucune", 3),
    ]));

    var prix = estimate(sel);
    priceBox.textContent = "";
    if (prix) {
      priceBox.appendChild(el("span", { text: "Prix estimatif" }));
      priceBox.appendChild(el("strong", { text: prix }));
    } else {
      priceBox.appendChild(el("p", { text: F.texteSansPrix || "Tarif communiqué sur devis." }));
    }
    renderSend();
  }

  /* ---------- Transmission de la demande ---------- */
  var requiredFields = ["nom", "coordonnees"];

  function checkContactFields() {
    var ok = true;
    requiredFields.forEach(function (name) {
      var input = form.elements[name];
      var bad = !input.value.trim();
      input.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      errorBox.textContent = "Indiquez votre nom et un moyen de vous recontacter.";
      var first = form.querySelector(".is-invalid");
      if (first) first.focus();
    } else {
      errorBox.textContent = "";
    }
    return ok;
  }

  function renderSend() {
    sendBox.textContent = "";
    var links = S.contactLinks("x"); // détecte les canaux disponibles
    var feedback = el("p", { class: "send__feedback", "aria-live": "polite" });

    sendBox.appendChild(el("p", { class: "send__title", text: links.length ? "Envoyer ma demande par :" : "Envoyer ma demande" }));
    var buttons = el("div", { class: "send__buttons" });
    sendBox.appendChild(buttons);

    links.forEach(function (link, i) {
      var a = S.linkButton(link, i === 0 ? "btn--primary" : "btn--ghost-dark");
      a.addEventListener("click", function (e) {
        if (!checkContactFields()) { e.preventDefault(); return; }
        var sel = selection();
        var msg = buildMessage(sel, estimate(sel));
        var fresh = S.contactLinks(msg).filter(function (l) { return l.id === link.id; })[0];
        if (fresh) a.href = fresh.href;
        if (link.id === "instagram") {
          // Instagram ne permet pas de pré-remplir un message : on copie le récapitulatif.
          copy(msg, feedback, "Récapitulatif copié — collez-le dans votre message Instagram.");
        }
      });
      buttons.appendChild(a);
    });

    var copyBtn = el("button", { type: "button", class: "btn " + (links.length ? "btn--ghost-dark" : "btn--primary") });
    copyBtn.appendChild(el("span", { html: S.icons.copy, "aria-hidden": "true", style: "display:contents" }));
    copyBtn.appendChild(document.createTextNode("Copier le récapitulatif"));
    copyBtn.addEventListener("click", function () {
      if (!checkContactFields()) return;
      var sel = selection();
      copy(buildMessage(sel, estimate(sel)), feedback, "Récapitulatif copié.");
    });
    buttons.appendChild(copyBtn);

    if (!links.length) {
      sendBox.appendChild(el("p", { class: "send__note tbd", text: "Les moyens d'envoi (téléphone, WhatsApp, e-mail…) seront ajoutés prochainement." }));
    }
    sendBox.appendChild(feedback);
  }

  function copy(text, feedback, okMsg) {
    function done() { feedback.textContent = okMsg; }
    function fallback() {
      var ta = el("textarea", { style: "position:fixed;opacity:0;top:0;left:0" });
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { feedback.textContent = "Copie impossible sur cet appareil."; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  form.addEventListener("input", function (e) {
    if (e.target.classList.contains("is-invalid") && e.target.value.trim()) e.target.classList.remove("is-invalid");
  });

  goTo(1, { scroll: false });
})();
