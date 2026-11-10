/* =====================================================================
   TOUT'NET — AFFICHAGE DU SITE À PARTIR DE config.js
   Pas besoin de modifier ce fichier pour changer le contenu.
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
        else node.setAttribute(k, v === true ? "" : v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }
  function filled(v) { return typeof v === "string" ? v.trim() !== "" : !!v; }
  function setText(node, value, fallback) {
    if (!node) return;
    if (filled(value)) { node.textContent = value; node.classList.remove("tbd", "tbd-muted"); }
    else { node.textContent = fallback || ""; if (fallback) node.classList.add("tbd", "tbd-muted"); }
  }
  function euros(n) { return Math.round(n) + " €"; }
  function fourchette(min, max) { return Math.round(min) === Math.round(max) ? euros(min) : Math.round(min) + " – " + euros(max); }
  function byId(list, id) { for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }

  /* ---------- Icônes ---------- */
  var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var ICONS = {
    mobile: '<svg ' + S + '><path d="M3 13l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5"/><rect x="2" y="13" width="20" height="5" rx="1.5"/><path d="M6 18v2M18 18v2"/></svg>',
    formules: '<svg ' + S + '><path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"/></svg>',
    remise: '<svg ' + S + '><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>',
    calendrier: '<svg ' + S + '><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/></svg>',
    goutte: '<svg ' + S + '><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>',
    etoile: '<svg ' + S + '><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5L19 19M5 19l2.5-2.5M16.5 7.5L19 5"/></svg>',
    phone: '<svg ' + S + '><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.2z"/></svg>',
    sms: '<svg ' + S + '><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    email: '<svg ' + S + '><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
    instagram: '<svg ' + S + '><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>',
    copy: '<svg ' + S + '><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    ok: '<svg ' + S + ' stroke-width="3"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  };
  function icon(name) { return el("span", { html: ICONS[name] || "", "aria-hidden": "true", style: "display:contents" }); }

  /* ---------- Moyens de contact ---------- */
  function digits(v) { return String(v || "").replace(/[^\d]/g, ""); }

  /** Liens de contact disponibles ; `message` = texte pré-rempli (optionnel). */
  function contactLinks(message) {
    var c = C.contact || {};
    var links = [];
    var msg = message ? encodeURIComponent(message) : "";
    if (filled(c.telephone)) {
      links.push({ id: "tel", label: "Appeler", icon: "phone", href: "tel:+" + digits(c.telephone) });
    }
    if (filled(c.whatsapp)) {
      links.push({ id: "whatsapp", label: "WhatsApp", icon: "whatsapp", external: true,
        href: "https://wa.me/" + digits(c.whatsapp) + (msg ? "?text=" + msg : "") });
    }
    if (filled(c.telephone)) {
      links.push({ id: "sms", label: "SMS", icon: "sms", href: "sms:+" + digits(c.telephone) + (msg ? "?&body=" + msg : "") });
    }
    if (filled(c.email)) {
      var subject = encodeURIComponent(message ? "Demande de réservation — Tout'Net" : "Demande d'information — Tout'Net");
      links.push({ id: "email", label: "E-mail", icon: "email",
        href: "mailto:" + c.email.trim() + "?subject=" + subject + (msg ? "&body=" + msg : "") });
    }
    if (filled(c.instagram)) {
      links.push({ id: "instagram", label: "Instagram", icon: "instagram", external: true,
        href: "https://instagram.com/" + c.instagram.trim().replace(/^@/, "") });
    }
    return links;
  }
  function linkButton(link, cls) {
    var a = el("a", { class: "btn " + (cls || "btn--primary"), href: link.href,
      target: link.external ? "_blank" : null, rel: link.external ? "noopener" : null, "data-channel": link.id });
    a.appendChild(icon(link.icon));
    a.appendChild(document.createTextNode(link.label));
    return a;
  }

  /* ---------- Estimation de prix ----------
     Pour chaque véhicule : prix de la formule choisie (vehicules[].prix)
     + prix des options cochées ; puis remise pack (packs `appliquer: true`).
     Chaque ligne est détaillée pour le récapitulatif.
     Aucun frais de déplacement n'est affiché.                            */
  function prixFormule(type, formuleId) {
    if (!type) return null;
    if (type.prix && typeof type.prix[formuleId] === "number") return type.prix[formuleId];
    return type.prixMin;
  }
  function supplementFormule(type, formuleId) {
    var base = prixFormule(type, (C.formules[0] || {}).id), p = prixFormule(type, formuleId);
    return base == null || p == null ? null : p - base;
  }
  function estimer(vehicules) {
    var details = [], total = 0, n = 0, partiel = false;
    vehicules.forEach(function (v, i) {
      var type = byId(C.vehicules, v.type);
      if (!type) return;
      n++;
      var f = byId(C.formules, v.formule);
      var lignes = [];
      var base = f ? prixFormule(type, f.id) : prixFormule(type, (C.formules[0] || {}).id);
      if (!f) partiel = true;
      lignes.push({ label: type.nom + (f ? " · " + f.nom : " · formule à choisir"), prix: base, base: true });
      (v.options || []).forEach(function (id) {
        var o = byId(C.options, id);
        if (o) lignes.push({ label: o.nom, prix: o.prix || 0, option: true });
      });
      var sous = lignes.reduce(function (s, l) { return s + l.prix; }, 0);
      total += sous;
      details.push({ index: i, titre: "Véhicule " + (i + 1), type: type, formule: f, lignes: lignes, sousTotal: sous, partiel: !f });
    });
    var pack = null;
    (C.packs || []).forEach(function (p) {
      if (p.appliquer !== false && n >= p.min && (!p.max || n <= p.max)) pack = p;
    });
    var remise = pack ? Math.round(total * pack.remise / 100) : 0;
    return { details: details, nb: n, sousTotal: total, pack: pack, remise: remise, total: total - remise, partiel: partiel };
  }
  function prixTexte(e) { return (e.partiel ? "à partir de " : "") + euros(e.total); }

  /* ---------- Rendu des sections ---------- */
  function renderIdentity() {
    var id = C.identite || {};
    var brand = $("[data-brand]");
    brand.textContent = "";
    if (filled(id.logo)) brand.appendChild(el("img", { src: id.logo, alt: "", width: "52", height: "46" }));
    brand.appendChild(el("span", { text: id.nom || "" }));

    setText($("[data-badge]"), id.badge);
    setText($("[data-accroche]"), id.accroche);
    setText($("[data-sous-accroche]"), id.sousAccroche);

    var logoBox = $("[data-hero-logo]");
    if (filled(id.logoComplet)) {
      logoBox.appendChild(el("div", { class: "hero__logo-badge" }, [el("img", { src: id.logoComplet, alt: "Logo " + (id.nom || "") })]));
    }
    var prixMin = Math.min.apply(null, (C.vehicules || []).map(function (v) { return v.prixMin; }));
    var from = $("[data-hero-prix]");
    if (isFinite(prixMin)) {
      from.appendChild(document.createTextNode("À partir de "));
      from.appendChild(el("strong", { text: euros(prixMin) }));
      from.appendChild(document.createTextNode(" · " + ((C.contact || {}).zone || "")));
    }

    var slogan = $("[data-slogan]");
    if (filled(id.slogan)) {
      // Met en valeur la fin du slogan après « c'est »
      var m = id.slogan.match(/^(.*c[’']est\s)(.+)$/i);
      if (m) { slogan.appendChild(document.createTextNode(m[1])); slogan.appendChild(el("em", { text: m[2] })); }
      else slogan.textContent = id.slogan;
    }
    $("[data-footer-nom]").textContent = "© " + new Date().getFullYear() + " " + (id.nom || "");
    setText($("[data-footer-zone]"), (C.contact || {}).zone);
  }

  function renderAvantages() {
    var box = $("[data-avantages]");
    (C.avantages || []).forEach(function (a) {
      box.appendChild(el("div", { class: "perk" }, [
        el("div", { class: "perk__icon", html: ICONS[a.icone] || ICONS.goutte, "aria-hidden": "true" }),
        el("h3", { text: a.titre }),
        el("p", { text: a.texte }),
      ]));
    });
    if (!box.children.length) box.parentNode.hidden = true;
  }

  function renderPresentation() {
    var p = C.presentation || {};
    if (!filled(p.texte)) return; // section masquée tant qu'il n'y a pas de texte
    $("[data-presentation]").hidden = false;
    setText($("[data-presentation-titre]"), p.titre);
    setText($("[data-presentation-texte]"), p.texte);
    var media = $("[data-presentation-photo]");
    if (filled(p.photo)) media.appendChild(el("img", { src: p.photo, alt: p.titre || "", loading: "lazy" }));
    else media.hidden = true;
  }

  function prixParVehicule(f) {
    return el("ul", { class: "formula__prices", "aria-label": "Prix par véhicule" }, (C.vehicules || []).map(function (v) {
      var p = prixFormule(v, f.id);
      return typeof p === "number" ? el("li", null, [el("span", { text: v.nom }), el("strong", { text: euros(p) })]) : null;
    }));
  }
  function renderFormules() {
    var box = $("[data-formules]");
    (C.formules || []).forEach(function (f) {
      box.appendChild(el("article", { class: "formula" + (f.miseEnAvant ? " formula--featured" : "") }, [
        f.badge ? el("span", { class: "formula__badge", text: f.badge }) : null,
        el("p", { class: "formula__tag", text: f.etiquette || "" }),
        el("h3", { text: f.nom }),
        f.sousTitre ? el("p", { class: "formula__sub", text: f.sousTitre }) : null,
        f.accroche ? el("p", { class: "formula__pitch", text: f.accroche }) : null,
        el("ul", { class: "formula__list" }, (f.inclus || []).map(function (i) { return el("li", null, [el("span", { class: "check", "aria-hidden": "true" }), i]); })),
        prixParVehicule(f),
        el("a", { class: "btn " + (f.miseEnAvant ? "btn--accent" : "btn--primary"), href: "#reserver", "data-formule": f.id, text: "Choisir cette formule" }),
      ]));
    });
    var opt = $("[data-options]");
    if ((C.options || []).length) opt.appendChild(el("p", { class: "extras__title", text: "Options : leur prix s'ajoute à celui de la formule choisie. Par exemple, un SUV en formule 2 (140 €) très sale revient à 140 € + 20 € = 160 €." }));
    (C.options || []).forEach(function (o) {
      opt.appendChild(el("div", { class: "extra" }, [
        el("span", { class: "extra__price", text: o.nom + (o.prix ? " +" + euros(o.prix) : "") }),
        o.description ? el("p", { text: o.description }) : null,
      ]));
    });
  }

  function renderTarifs() {
    var table = $("[data-tarifs]");
    table.appendChild(el("div", { class: "price-table__head", text: "Tarif selon le véhicule" }));
    (C.vehicules || []).forEach(function (v) {
      table.appendChild(el("div", { class: "price-row" }, [
        el("span", { class: "price-row__name" }, [v.nom, v.note ? el("small", { text: v.note }) : null]),
        el("span", { class: "price-row__price", text: fourchette(v.prixMin, v.prixMax) }),
      ]));
    });
    var packs = $("[data-packs]");
    if ((C.packs || []).length) {
      packs.appendChild(el("div", { class: "packs__title", text: "Packs" }));
      C.packs.forEach(function (p, i) {
        packs.appendChild(el("div", { class: "pack" + (i === C.packs.length - 1 ? " pack--strong" : "") }, [
          el("div", { class: "pack__value", text: "−" + p.remise + "%" }),
          el("div", { class: "pack__name", text: p.nom }),
          el("div", { class: "pack__desc", text: p.description || "" }),
        ]));
      });
    }
  }

  function renderContact() {
    var c = C.contact || {};
    var infos = $("[data-contact-infos]");
    var parts = [];
    if (filled(c.telephoneAffiche || c.telephone)) parts.push(el("a", { href: "tel:+" + digits(c.telephone), text: c.telephoneAffiche || c.telephone }));
    if (filled(c.email)) parts.push(el("a", { href: "mailto:" + c.email, text: c.email }));
    parts.forEach(function (p, i) { if (i) infos.appendChild(document.createTextNode("  ·  ")); infos.appendChild(p); });
    if (filled(c.horaires)) { infos.appendChild(el("br")); infos.appendChild(document.createTextNode(c.horaires)); }

    var box = $("[data-contact-buttons]");
    contactLinks().forEach(function (l, i) { box.appendChild(linkButton(l, i === 0 ? "btn--accent btn--large" : "btn--white btn--large")); });
  }

  /* ---------- Galerie avant / après ---------- */
  function renderGalerie() {
    var box = $("[data-galerie]");
    var items = (C.galerie && C.galerie.length) ? C.galerie : [{}];
    items.forEach(function (g, i) {
      var titre = filled(g.titre) ? g.titre : "";
      var name = titre || "Comparaison " + (i + 1);
      var ba = el("div", { class: "ba" }, [
        el("img", { class: "ba__after", src: filled(g.apres) ? g.apres : "assets/placeholder-apres.svg", alt: name + " — après nettoyage", loading: i ? "lazy" : null, draggable: "false" }),
        el("img", { class: "ba__before", src: filled(g.avant) ? g.avant : "assets/placeholder-avant.svg", alt: name + " — avant nettoyage", loading: i ? "lazy" : null, draggable: "false" }),
        el("span", { class: "ba__label ba__label--before", text: "Avant" }),
        el("span", { class: "ba__label ba__label--after", text: "Après" }),
        el("input", { class: "ba__range", type: "range", min: "0", max: "100", value: "50", step: "0.1", "aria-label": "Comparer avant et après — " + name }),
        el("span", { class: "ba__handle", "aria-hidden": "true" }),
      ]);
      var imgA = ba.querySelector(".ba__after");
      var ratio = function () {
        if (!imgA.naturalWidth) return;
        ba.style.aspectRatio = imgA.naturalWidth + " / " + imgA.naturalHeight;
        if (ba.parentNode) ba.parentNode.style.setProperty("--r", (imgA.naturalWidth / imgA.naturalHeight).toFixed(3));
      };
      if (imgA.complete) ratio(); else imgA.addEventListener("load", ratio);
      initSlider(ba);
      box.appendChild(el("figure", null, [ba, el("figcaption", { class: titre ? "" : "tbd tbd-muted", text: titre || "Photos à venir" })]));
      ratio();
    });
  }

  function initSlider(ba) {
    var range = ba.querySelector(".ba__range");
    function set(p) { p = Math.max(0, Math.min(100, p)); ba.style.setProperty("--pos", p + "%"); range.value = p; }
    range.addEventListener("input", function () { set(parseFloat(range.value)); });
    var dragging = false, startX = 0, startY = 0, decided = false;
    function posFromEvent(e) { var r = ba.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * 100; }
    ba.addEventListener("pointerdown", function (e) {
      dragging = true; decided = e.pointerType === "mouse"; startX = e.clientX; startY = e.clientY;
      if (decided) { set(posFromEvent(e)); ba.setPointerCapture(e.pointerId); }
      e.preventDefault();
    });
    ba.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      if (!decided) {
        var dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) { dragging = false; return; }
        decided = true;
        try { ba.setPointerCapture(e.pointerId); } catch (_) {}
      }
      set(posFromEvent(e));
    });
    function end(e) { if (dragging && !decided && e.type === "pointerup") set(posFromEvent(e)); dragging = false; }
    ba.addEventListener("pointerup", end);
    ba.addEventListener("pointercancel", end);
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    var header = $("#header"), toggle = $(".nav-toggle"), nav = $("#nav");
    function close() { header.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
    toggle.addEventListener("click", function () {
      var open = !header.classList.contains("is-open");
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    var cta = $("[data-sticky-cta]"), hero = $("#accueil"), resa = $("#reserver"), contact = $("#contact");
    function onScroll() {
      var y = window.scrollY, vh = window.innerHeight;
      header.classList.toggle("is-scrolled", y > 20);
      var r = resa.getBoundingClientRect(), c = contact.getBoundingClientRect();
      var onTarget = (r.top < vh && r.bottom > 0) || c.top < vh;
      cta.classList.toggle("is-visible", y > hero.offsetHeight - 80 && !onTarget);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ---------- Démarrage ---------- */
  if (C.afficherReperes) document.documentElement.classList.add("reperes");
  renderIdentity();
  renderAvantages();
  renderPresentation();
  renderFormules();
  renderTarifs();
  renderGalerie();
  renderContact();
  initNav();

  window.Site = {
    config: C, el: el, filled: filled, icons: ICONS, icon: icon, byId: byId,
    euros: euros, fourchette: fourchette, estimer: estimer, prixTexte: prixTexte,
    prixFormule: prixFormule, supplementFormule: supplementFormule,
    contactLinks: contactLinks, linkButton: linkButton,
  };
})();
