/* =====================================================================
   RENDU DU SITE À PARTIR DE config.js
   Ce fichier n'a normalement pas besoin d'être modifié pour changer
   le contenu : tout passe par js/config.js.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  /* ---------- Utilitaires ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "html") node.innerHTML = v; // réservé aux icônes internes
        else node.setAttribute(k, v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function filled(v) { return typeof v === "string" ? v.trim() !== "" : !!v; }

  /** Remplit un élément avec une valeur, ou un texte provisoire repéré. */
  function setText(node, value, fallback) {
    if (!node) return;
    if (filled(value)) {
      node.textContent = value;
      node.classList.remove("tbd", "tbd-muted");
    } else {
      node.textContent = fallback || "";
      if (fallback) node.classList.add("tbd", "tbd-muted");
    }
  }

  /* ---------- Icônes (SVG internes) ---------- */
  var ICONS = {
    interieur: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20v-6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6"/><path d="M8 11V6a4 4 0 0 1 8 0v5"/><path d="M4 20h16"/></svg>',
    exterieur: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16l1.5-5A2 2 0 0 1 8.4 9.5h7.2a2 2 0 0 1 1.9 1.5L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/><circle cx="7.5" cy="18" r=".5"/><circle cx="16.5" cy="18" r=".5"/></svg>',
    complet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9 5.5-.8z"/></svg>',
    etoile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5L19 19M5 19l2.5-2.5M16.5 7.5L19 5"/></svg>',
    goutte: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.2z"/></svg>',
    sms: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  };

  /* ---------- Moyens de contact ---------- */
  function digits(v) { return String(v || "").replace(/[^\d]/g, ""); }

  /**
   * Construit la liste des liens de contact disponibles.
   * @param {string} [message] texte pré-rempli (formule personnalisée)
   */
  function contactLinks(message) {
    var c = C.contact || {};
    var links = [];
    var msg = message ? encodeURIComponent(message) : "";

    if (filled(c.whatsapp)) {
      links.push({ id: "whatsapp", label: "WhatsApp", icon: "whatsapp",
        href: "https://wa.me/" + digits(c.whatsapp) + (msg ? "?text=" + msg : ""), external: true });
    }
    if (filled(c.telephone)) {
      if (message) {
        links.push({ id: "sms", label: "SMS", icon: "sms",
          href: "sms:+" + digits(c.telephone) + "?&body=" + msg });
      } else {
        links.push({ id: "tel", label: "Appeler", icon: "phone", href: "tel:+" + digits(c.telephone) });
      }
    }
    if (filled(c.email)) {
      var subject = encodeURIComponent(message ? "Demande de prestation — formule personnalisée" : "Demande d'information");
      links.push({ id: "email", label: "E-mail", icon: "email",
        href: "mailto:" + c.email.trim() + "?subject=" + subject + (msg ? "&body=" + msg : "") });
    }
    if (filled(c.instagram)) {
      links.push({ id: "instagram", label: "Instagram", icon: "instagram",
        href: "https://instagram.com/" + c.instagram.trim().replace(/^@/, ""), external: true });
    }
    return links;
  }

  function linkButton(link, cls) {
    var a = el("a", {
      class: "btn " + (cls || "btn--primary"),
      href: link.href,
      target: link.external ? "_blank" : null,
      rel: link.external ? "noopener" : null,
      "data-channel": link.id,
    });
    a.appendChild(el("span", { html: ICONS[link.icon] || "", "aria-hidden": "true", style: "display:contents" }));
    a.appendChild(document.createTextNode(link.label));
    return a;
  }

  /* ---------- Rendu des sections ---------- */
  function renderIdentity() {
    var id = C.identite || {};
    var nom = filled(id.nom) ? id.nom : "";

    var brand = $("[data-brand]");
    brand.textContent = "";
    if (filled(id.logo)) brand.appendChild(el("img", { src: id.logo, alt: nom || "Logo" }));
    if (nom || !filled(id.logo)) {
      brand.appendChild(el("span", { class: nom ? "" : "tbd", text: nom || "[Nom de l'activité]" }));
    }

    if (nom) document.title = nom + " — " + (id.accroche || "Nettoyage automobile");

    setText($("[data-zone]"), (C.contact || {}).zone);
    setText($("[data-accroche]"), id.accroche, "Nettoyage automobile");
    setText($("[data-sous-accroche]"), id.sousAccroche, "[Phrase d'introduction à définir]");

    setText($("[data-footer-nom]"), nom ? "© " + new Date().getFullYear() + " " + nom : "", "[Nom de l'activité]");
    setText($("[data-footer-zone]"), (C.contact || {}).zone);
  }

  function renderPresentation() {
    var p = C.presentation || {};
    setText($("[data-presentation-titre]"), p.titre, "Présentation");
    setText($("[data-presentation-texte]"), p.texte, "[Courte présentation du prestataire — texte à fournir]");
    var media = $("[data-presentation-photo]");
    media.textContent = "";
    if (filled(p.photo)) media.appendChild(el("img", { src: p.photo, alt: p.titre || "", loading: "lazy" }));
    else media.appendChild(el("div", { class: "placeholder-media", text: "Photo à fournir" }));
  }

  function renderCards(container, items, nbPlaceholders, build) {
    container.textContent = "";
    if (items && items.length) {
      items.forEach(function (item) { container.appendChild(build(item, false)); });
    } else {
      for (var i = 1; i <= (nbPlaceholders || 3); i++) container.appendChild(build({ _n: i }, true));
    }
  }

  function renderPrestations() {
    renderCards($("[data-prestations]"), C.prestations, C.nbEmplacementsPrestations, function (p, ph) {
      return el("article", { class: "card" }, [
        el("div", { class: "card__icon", html: ICONS[p.icone] || ICONS.goutte, "aria-hidden": "true" }),
        el("h3", { class: ph ? "tbd" : "", text: ph ? "Prestation " + p._n : p.titre }),
        el("p", { class: ph ? "tbd-muted" : "", text: ph ? "Description à définir." : (p.description || "") }),
      ]);
    });
  }

  function renderAvantages() {
    renderCards($("[data-avantages]"), C.avantages, C.nbEmplacementsAvantages, function (a, ph) {
      return el("article", { class: "card card--plain" }, [
        el("div", { class: "card__icon", html: ICONS.check, "aria-hidden": "true" }),
        el("h3", { class: ph ? "tbd" : "", text: ph ? "Avantage " + a._n : a.titre }),
        el("p", { class: ph ? "tbd-muted" : "", text: ph ? "Texte à définir." : (a.texte || "") }),
      ]);
    });
  }

  function renderTarifs() {
    var t = C.tarifs || {};
    setText($("[data-tarifs-intro]"), t.introduction);
    setText($("[data-tarifs-mentions]"), t.mentions);

    renderCards($("[data-tarifs]"), t.formules, t.nbEmplacements, function (f, ph) {
      var card = el("article", {
        class: "card price-card" + (f.miseEnAvant ? " price-card--featured" : "") + (ph ? " price-card--placeholder" : ""),
      });
      if (f.miseEnAvant) card.appendChild(el("span", { class: "price-card__badge", text: "Recommandée" }));
      card.appendChild(el("h3", { class: ph ? "tbd" : "", text: ph ? "Formule " + f._n : f.nom }));
      var hasPrice = !ph && filled(f.prix);
      card.appendChild(el("div", {
        class: "price-card__price" + (hasPrice ? "" : " tbd-muted"),
        text: hasPrice ? f.prix : "Tarif communiqué prochainement",
      }));
      if (!ph && filled(f.description)) card.appendChild(el("p", { text: f.description }));
      var inclus = (f.inclus || []).filter(filled);
      if (inclus.length) {
        card.appendChild(el("ul", null, inclus.map(function (i) { return el("li", { text: i }); })));
      } else if (ph) {
        card.appendChild(el("p", { class: "tbd-muted", text: "Contenu de la formule à définir." }));
      }
      if (!ph || !inclus.length) card.appendChild(el("div", { style: "height:20px" }));
      card.appendChild(el("a", { class: "btn btn--ghost-dark", href: "#formule", text: "Demander cette prestation" }));
      return card;
    });
  }

  function renderContact() {
    var c = C.contact || {};
    var infos = [c.zone, c.horaires].filter(filled).join(" · ");
    setText($("[data-contact-infos]"), infos);

    var box = $("[data-contact-buttons]");
    box.textContent = "";
    var links = contactLinks();
    if (!links.length) {
      box.appendChild(el("p", { class: "contact__empty", text: "Coordonnées de contact à venir." }));
      return;
    }
    links.forEach(function (l, i) { box.appendChild(linkButton(l, i === 0 ? "btn--primary btn--large" : "btn--light btn--large")); });
  }

  /* ---------- Galerie avant / après ---------- */
  function renderGalerie() {
    var box = $("[data-galerie]");
    box.textContent = "";
    var items = (C.galerie && C.galerie.length) ? C.galerie : [{}];
    items.forEach(function (g, i) {
      var titre = filled(g.titre) ? g.titre : "";
      var avant = filled(g.avant) ? g.avant : "assets/placeholder-avant.svg";
      var apres = filled(g.apres) ? g.apres : "assets/placeholder-apres.svg";
      var name = titre || "Comparaison " + (i + 1);

      var ba = el("div", { class: "ba" }, [
        el("img", { class: "ba__after", src: apres, alt: name + " — après nettoyage", loading: i ? "lazy" : null, draggable: "false" }),
        el("img", { class: "ba__before", src: avant, alt: name + " — avant nettoyage", loading: i ? "lazy" : null, draggable: "false" }),
        el("span", { class: "ba__label ba__label--before", text: "Avant" }),
        el("span", { class: "ba__label ba__label--after", text: "Après" }),
        el("input", { class: "ba__range", type: "range", min: "0", max: "100", value: "50", step: "0.1",
          "aria-label": "Comparer avant et après — " + name }),
        el("span", { class: "ba__handle", "aria-hidden": "true" }),
      ]);
      initSlider(ba);

      box.appendChild(el("figure", { class: "gallery__item", style: "margin:0" }, [
        ba,
        el("figcaption", { class: titre ? "" : "tbd tbd-muted", text: titre || "Véhicule " + (i + 1) + " — photos à fournir" }),
      ]));
    });
  }

  /**
   * Curseur avant/après. Le champ <input type="range"> gère clavier et
   * accessibilité ; les événements pointeur permettent de cliquer ou
   * glisser n'importe où sur l'image (souris et tactile).
   */
  function initSlider(ba) {
    var range = ba.querySelector(".ba__range");
    function set(p) {
      p = Math.max(0, Math.min(100, p));
      ba.style.setProperty("--pos", p + "%");
      range.value = p;
    }
    range.addEventListener("input", function () { set(parseFloat(range.value)); });

    var dragging = false, startX = 0, startY = 0, decided = false;
    function posFromEvent(e) {
      var r = ba.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    }
    ba.addEventListener("pointerdown", function (e) {
      dragging = true; decided = e.pointerType === "mouse";
      startX = e.clientX; startY = e.clientY;
      if (decided) { set(posFromEvent(e)); ba.setPointerCapture(e.pointerId); }
      e.preventDefault();
    });
    ba.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      if (!decided) {
        // Sur mobile : glissement horizontal = curseur ; vertical = défilement de la page.
        var dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) { dragging = false; return; }
        decided = true;
        try { ba.setPointerCapture(e.pointerId); } catch (_) {}
      }
      set(posFromEvent(e));
    });
    function end(e) {
      if (dragging && !decided && e.type === "pointerup") set(posFromEvent(e)); // simple tap
      dragging = false;
    }
    ba.addEventListener("pointerup", end);
    ba.addEventListener("pointercancel", end);
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    var header = $("#header");
    var toggle = $(".nav-toggle");
    var nav = $("#nav");

    function close() { header.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
    toggle.addEventListener("click", function () {
      var open = !header.classList.contains("is-open");
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    var cta = $("[data-sticky-cta]");
    var hero = $("#accueil");
    var formule = $("#formule");
    var contact = $("#contact");
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 20);
      // Le bouton fixe apparaît après l'accueil et se masque sur la formule / le contact.
      var vh = window.innerHeight;
      var afterHero = y > hero.offsetHeight - 80;
      var f = formule.getBoundingClientRect();
      var c = contact.getBoundingClientRect();
      var onTarget = (f.top < vh && f.bottom > 0) || (c.top < vh);
      cta.classList.toggle("is-visible", afterHero && !onTarget);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ---------- Démarrage ---------- */
  if (C.afficherReperes) document.documentElement.classList.add("reperes");
  renderIdentity();
  renderPresentation();
  renderPrestations();
  renderAvantages();
  renderGalerie();
  renderTarifs();
  renderContact();
  initNav();

  // Partagé avec formule.js
  window.Site = { config: C, el: el, filled: filled, icons: ICONS, contactLinks: contactLinks, linkButton: linkButton };
})();
