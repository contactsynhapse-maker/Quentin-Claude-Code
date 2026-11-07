/* =====================================================================
   TOUT'NET — RÉSERVATION EN LIGNE
   ---------------------------------------------------------------------
   Étape 1 : un ou plusieurs véhicules (un onglet par véhicule)
             type, formule (prix affiché), options → récapitulatif chiffré
   Étape 2 : adresse d'intervention + calendrier des disponibilités
   Étape 3 : coordonnées du client
   Étape 4 : récapitulatif complet et « Valider ma demande »
   → page de confirmation

   Modes (config.reservation) :
   - apiUrl renseignée : vraies disponibilités de Quentin (Google Agenda),
     demande enregistrée et envoyée par e-mail à Tout'Net ;
   - apiUrl vide et demo: true : aperçu avec des créneaux d'EXEMPLE,
     aucune demande n'est envoyée.
   ===================================================================== */
(function () {
  "use strict";

  var Site = window.Site;
  if (!Site) return;
  var C = Site.config, R = C.reservation || {};
  var el = Site.el, filled = Site.filled, byId = Site.byId, euros = Site.euros;
  var API = filled(R.apiUrl) ? R.apiUrl.trim() : "";
  var DEMO = !API && R.demo !== false;
  var MAX = R.maxVehicules || 10;
  var NIVEAUX = C.niveaux || [];
  var TEL = (C.contact || {}).telephoneAffiche || "";

  var root = document.querySelector("[data-booking]");
  if (!root) return;
  var form = root.querySelector("[data-form]");
  var $ = function (sel) { return root.querySelector(sel); };
  var stepsNav = root.querySelectorAll(".steps__item");
  var btnPrev = $("[data-prev]"), btnNext = $("[data-next]"), errorBox = $("[data-error]"), navBox = $("[data-nav]");

  /* ---------- État ---------- */
  var uid = 0;
  function nouveauVehicule() { return { uid: ++uid, type: null, formule: null, niveau: null, options: [] }; }
  var state = {
    step: 1,
    vehicules: [nouveauVehicule()],
    actif: 0,
    durees: R.durees || null,
    dispo: { cle: null, loading: false, erreur: false, data: null },
    jour: null, heure: null, page: 0,
    envoi: false,
  };

  /* ---------- Outils ---------- */
  function vehiculeComplet(v) { return !!(v.type && v.formule && (!NIVEAUX.length || v.niveau)); }
  function signature() {
    return state.vehicules.filter(vehiculeComplet).map(function (v) {
      return { type: v.type, formule: v.formule, niveau: v.niveau || "", options: v.options.slice() };
    });
  }
  function dureeLocale() {
    if (!state.durees) return null;
    var total = 0, ok = true;
    signature().forEach(function (v) {
      var d = state.durees[v.type + "|" + v.formule];
      if (typeof d !== "number") ok = false; else total += d;
      v.options.forEach(function (o) { total += state.durees["option|" + o] || 0; });
      if (v.niveau) total += state.durees["etat|" + v.niveau] || 0;
    });
    return ok && total ? total : null;
  }
  function formatDuree(min) {
    if (!min) return "";
    var h = Math.floor(min / 60), m = min % 60;
    return h ? h + " h" + (m ? " " + String(m).padStart(2, "0") : "") : m + " min";
  }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function dateObj(s) { return new Date(s + "T12:00:00Z"); }
  function fmtDate(s, opts) { return dateObj(s).toLocaleDateString("fr-FR", Object.assign({ timeZone: "UTC" }, opts)); }
  function dateLongue(s) { return fmtDate(s, { weekday: "long", day: "numeric", month: "long" }); }
  function heureFr(h) { return h ? h.replace(/^0/, "").replace(":", " h ").replace(/ h 00$/, " h") : ""; }
  function val(name) { var f = form.elements[name]; return f ? String(f.value || "").trim() : ""; }
  function adresse() { return val("rue") + ", " + val("cp") + " " + val("ville"); }
  function adresseComplete() { return !!(val("rue") && /^\d{5}$/.test(val("cp")) && val("ville")); }
  function plusOuPrix(n) { return (n > 0 ? "+" : "") + euros(n); }

  /* =================================================================
     RÉCAPITULATIF CHIFFRÉ (étape 1 et étape 4)
     ================================================================= */
  function renderDetail(box) {
    var e = Site.estimer(state.vehicules);
    box.textContent = "";
    box.className = "estimate" + (e.nb ? "" : " estimate--empty");
    if (!e.nb) {
      box.appendChild(el("div", { class: "estimate__top" }, [
        el("span", { class: "estimate__label", text: "Prix estimé" }),
        el("span", { class: "estimate__total", text: "Choisissez un type de véhicule" }),
      ]));
      return e;
    }
    e.details.forEach(function (d) {
      var bloc = el("div", { class: "estimate__vehicle" }, [el("p", { class: "estimate__vtitle", text: d.titre })]);
      var ul = el("ul", { class: "estimate__lines" });
      d.lignes.forEach(function (l) {
        ul.appendChild(el("li", { class: l.option ? "is-option" : "" }, [el("span", { text: l.label }), el("span", { text: l.option ? plusOuPrix(l.prix) : euros(l.prix) })]));
      });
      if (d.lignes.length > 1) ul.appendChild(el("li", { class: "is-subtotal" }, [el("span", { text: "Sous-total" }), el("span", { text: (d.partiel ? "dès " : "") + euros(d.sousTotal) })]));
      bloc.appendChild(ul);
      box.appendChild(bloc);
    });
    var foot = el("ul", { class: "estimate__lines estimate__foot" });
    if (e.pack) {
      foot.appendChild(el("li", { class: "is-discount" }, [
        el("span", { text: "Pack " + e.pack.nom + " (" + e.nb + " véhicules) −" + e.pack.remise + " %" }),
        el("span", { text: "− " + euros(e.remise) }),
      ]));
    }
    var d = dureeLocale();
    if (d) foot.appendChild(el("li", null, [el("span", { text: "Durée estimée de l'intervention" }), el("span", { text: formatDuree(d) })]));
    if (foot.children.length) box.appendChild(foot);
    box.appendChild(el("div", { class: "estimate__top estimate__total-row" }, [
      el("span", { class: "estimate__label", text: "Prix estimé" }),
      el("span", { class: "estimate__total", text: Site.prixTexte(e) }),
    ]));
    if (filled(R.mentionEstimation)) box.appendChild(el("p", { class: "estimate__note", text: R.mentionEstimation }));
    return e;
  }

  /* =================================================================
     ÉTAPE 1 — VÉHICULES
     ================================================================= */
  var tabsBox = $("[data-vtabs]"), panelBox = $("[data-vpanel]"), estimateBox = $("[data-estimate]");

  function renderTabs() {
    tabsBox.textContent = "";
    state.vehicules.forEach(function (v, i) {
      var t = byId(C.vehicules, v.type);
      tabsBox.appendChild(el("button", { type: "button", class: "vtab" + (i === state.actif ? " is-active" : ""), role: "tab",
        "aria-selected": String(i === state.actif), "data-tab": String(i) }, [
        el("span", { class: "vtab__dot" + (vehiculeComplet(v) ? " is-ok" : ""), "aria-hidden": "true" }),
        "Véhicule " + (i + 1) + (t ? " · " + t.nom : ""),
      ]));
    });
    if (state.vehicules.length < MAX) {
      tabsBox.appendChild(el("button", { type: "button", class: "vtab vtab--add", "data-add": "" }, ["+ Ajouter un véhicule"]));
    }
  }

  function choice(type, name, value, checked, title, desc, price) {
    return el("label", { class: "choice choice--" + type }, [
      el("input", { type: type, name: name, value: value, checked: checked }),
      el("span", { class: "choice__box" }, [
        el("span", { class: "choice__mark", "aria-hidden": "true" }),
        el("span", { class: "choice__body" }, [
          el("span", { class: "choice__name", text: title }),
          desc ? el("span", { class: "choice__desc", text: desc }) : null,
        ]),
        price ? el("span", { class: "choice__price", text: price }) : null,
      ]),
    ]);
  }

  function renderPanel() {
    var v = state.vehicules[state.actif];
    var type = byId(C.vehicules, v.type);
    panelBox.textContent = "";
    panelBox.appendChild(el("div", { class: "vpanel__head" }, [
      el("h3", { text: "Véhicule " + (state.actif + 1) }),
      state.vehicules.length > 1 ? el("button", { type: "button", class: "link-btn link-btn--danger", "data-remove": "" }, ["Retirer ce véhicule"]) : null,
    ]));

    panelBox.appendChild(el("span", { class: "group-label", text: "Type de véhicule" }));
    panelBox.appendChild(el("div", { class: "choices", "data-field": "type" }, (C.vehicules || []).map(function (t) {
      return choice("radio", "type-" + v.uid, t.id, v.type === t.id, t.nom, t.note || "", Site.fourchette(t.prixMin, t.prixMax));
    })));

    panelBox.appendChild(el("span", { class: "group-label" }, ["Formule ", type ? null : el("small", { text: "(choisissez d'abord le type pour voir les prix)" })]));
    panelBox.appendChild(el("div", { class: "choices choices--2", "data-field": "formule" }, (C.formules || []).map(function (f, i) {
      var prix = "";
      if (type) prix = i === 0 ? euros(Site.prixFormule(type, f.id)) : plusOuPrix(Site.supplementFormule(type, f.id));
      return choice("radio", "formule-" + v.uid, f.id, v.formule === f.id, f.nom, (f.etiquette || "") + (f.sousTitre ? " — " + f.sousTitre : ""), prix);
    })));

    if (NIVEAUX.length) {
      panelBox.appendChild(el("span", { class: "group-label", text: "État du véhicule" }));
      panelBox.appendChild(el("div", { class: "choices", "data-field": "niveau" }, NIVEAUX.map(function (n) {
        return choice("radio", "niveau-" + v.uid, n.id, v.niveau === n.id, n.nom, n.description || "");
      })));
    }

    if ((C.options || []).length) {
      panelBox.appendChild(el("span", { class: "group-label" }, ["Options ", el("small", { text: "(facultatif)" })]));
      panelBox.appendChild(el("div", { class: "choices", "data-field": "options" }, C.options.map(function (o) {
        return choice("checkbox", "options-" + v.uid, o.id, v.options.indexOf(o.id) > -1, o.nom, o.description || "", o.prix ? "+" + euros(o.prix) : "");
      })));
    }

    if (state.vehicules.length < MAX) {
      panelBox.appendChild(el("p", { style: "margin:18px 0 0" }, [
        el("button", { type: "button", class: "link-btn", "data-add": "" }, ["+ Ajouter un autre véhicule (famille, flotte…)"]),
      ]));
    }
  }

  function renderStep1(full) {
    renderTabs();
    if (full !== false) renderPanel();
    renderDetail(estimateBox);
  }

  tabsBox.addEventListener("click", function (e) {
    var t = e.target.closest("[data-tab]");
    if (t) { state.actif = Number(t.getAttribute("data-tab")); errorBox.textContent = ""; renderStep1(); }
  });
  root.addEventListener("click", function (e) {
    if (e.target.closest("[data-add]") && state.vehicules.length < MAX) {
      state.vehicules.push(nouveauVehicule());
      state.actif = state.vehicules.length - 1;
      errorBox.textContent = "";
      renderStep1();
      tabsBox.scrollLeft = tabsBox.scrollWidth;
    }
    if (e.target.closest("[data-remove]") && state.vehicules.length > 1) {
      state.vehicules.splice(state.actif, 1);
      state.actif = Math.max(0, state.actif - 1);
      renderStep1();
    }
  });
  panelBox.addEventListener("change", function (e) {
    var field = e.target.closest("[data-field]");
    if (!field) return;
    var v = state.vehicules[state.actif];
    var f = field.getAttribute("data-field");
    if (f === "options") {
      // une seule option par groupe (ex. « sale » ou « très sale »)
      var o = byId(C.options, e.target.value);
      if (e.target.checked && o && o.groupe) {
        C.options.forEach(function (x) {
          if (x.id !== o.id && x.groupe === o.groupe) {
            var inp = field.querySelector('input[value="' + x.id + '"]');
            if (inp) inp.checked = false;
          }
        });
      }
      v.options = Array.prototype.map.call(field.querySelectorAll("input:checked"), function (i) { return i.value; });
      errorBox.textContent = "";
      renderStep1(false);
      return;
    }
    v[f] = e.target.value;
    errorBox.textContent = "";
    renderStep1(f === "type"); // le type change les prix affichés des formules
  });

  // Boutons « Choisir cette formule » de la section Formules
  document.querySelectorAll("[data-formule]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (state.step !== 1) return;
      state.vehicules[state.actif].formule = a.getAttribute("data-formule");
      renderStep1();
    });
  });

  function validerStep1() {
    for (var i = 0; i < state.vehicules.length; i++) {
      var v = state.vehicules[i];
      if (!vehiculeComplet(v)) {
        state.actif = i;
        renderStep1();
        var manque = !v.type ? "le type de véhicule" : !v.formule ? "la formule" : "l'état du véhicule";
        return "Véhicule " + (i + 1) + " : choisissez " + manque + ".";
      }
    }
    return "";
  }

  /* =================================================================
     ÉTAPE 2 — ADRESSE & CALENDRIER
     ================================================================= */
  var slotsBox = $("[data-slots]");

  function api(params) {
    var qs = Object.keys(params).map(function (k) { return k + "=" + encodeURIComponent(params[k]); }).join("&");
    return fetch(API + (API.indexOf("?") > -1 ? "&" : "?") + qs, { method: "GET", redirect: "follow" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }

  /* Créneaux d'exemple pour l'aperçu (aucune vraie disponibilité). */
  function disposDemo(duree) {
    var jours = [], now = new Date();
    for (var n = 1; n <= 28; n++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + n);
      var wd = d.getDay();
      var creneaux = [];
      [[8 * 60, 18 * 60]].forEach(function (w) { // tous les jours, 8 h – 18 h
        for (var m = w[0]; m + duree <= w[1]; m += 30) {
          if ((n * 7 + m / 30) % 5 === 0) continue; // quelques créneaux déjà pris
          creneaux.push(String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"));
        }
      });
      if (creneaux.length) jours.push({ date: iso(d), creneaux: creneaux });
    }
    return { ok: true, duree: duree, jours: jours, demo: true };
  }

  function chargerDispos(force) {
    if (!adresseComplete()) { state.dispo = { cle: null, loading: false, erreur: false, data: null }; renderSlots(); return; }
    var cle = JSON.stringify([signature(), adresse()]);
    if (!force && state.dispo.cle === cle && (state.dispo.data || state.dispo.loading)) { renderSlots(); return; }
    state.dispo = { cle: cle, loading: true, erreur: false, data: null };
    state.jour = null; state.heure = null; state.page = 0;
    renderSlots();
    var req = API
      ? api({ action: "disponibilites", vehicules: JSON.stringify(signature()), adresse: adresse() })
      : new Promise(function (res) { setTimeout(function () { res(disposDemo(dureeLocale() || 120)); }, 250); });
    req.then(function (data) {
      if (state.dispo.cle !== cle) return;
      if (!data || !data.ok) throw new Error((data && data.message) || "Réponse invalide");
      state.dispo.data = data;
      state.dispo.loading = false;
      state.page = 0;
      renderSlots();
    }).catch(function (err) {
      console.error(err);
      if (state.dispo.cle !== cle) return;
      state.dispo.loading = false;
      state.dispo.erreur = true;
      renderSlots();
    });
  }

  function colonnes() {
    var w = slotsBox.clientWidth || root.clientWidth || 800;
    return w >= 760 ? 7 : w >= 520 ? 5 : 4;
  }

  function joursCalendrier(data) {
    // jours consécutifs, de la semaine du premier créneau au dernier jour avec créneaux
    var map = {};
    (data.jours || []).forEach(function (j) { map[j.date] = j.creneaux; });
    if (!data.jours || !data.jours.length) return { liste: [], map: map };
    var start = dateObj(data.jours[0].date), end = dateObj(data.jours[data.jours.length - 1].date);
    var lundi = new Date(start); lundi.setUTCDate(lundi.getUTCDate() - ((lundi.getUTCDay() + 6) % 7));
    var liste = [];
    for (var d = new Date(lundi); d <= end; d.setUTCDate(d.getUTCDate() + 1)) liste.push(d.toISOString().slice(0, 10));
    var demain = iso(new Date(Date.now() + 864e5));
    liste = liste.filter(function (x) { return x >= demain; });
    return { liste: liste, map: map };
  }

  function renderSlots() {
    slotsBox.textContent = "";
    if (DEMO) slotsBox.appendChild(el("p", { class: "demo-banner", text: "Aperçu : créneaux d'exemple. Les vraies disponibilités de Quentin s'afficheront ici une fois son agenda connecté." }));
    if (!API && !DEMO) {
      slotsBox.appendChild(el("p", { class: "slots__msg", text: "La réservation en ligne arrive bientôt. En attendant, contactez Tout'Net" + (TEL ? " au " + TEL : "") + "." }));
      return;
    }
    if (!adresseComplete()) {
      slotsBox.appendChild(el("p", { class: "slots__msg", text: "Renseignez votre adresse ci-dessus pour afficher les disponibilités (le temps de trajet est pris en compte)." }));
      return;
    }
    var d = state.dispo;
    if (d.loading) {
      slotsBox.appendChild(el("p", { class: "slots__msg" }, [el("span", { class: "spinner", "aria-hidden": "true" }), "Recherche des disponibilités…"]));
      return;
    }
    if (d.erreur || !d.data) {
      slotsBox.appendChild(el("div", { class: "slots__msg" }, [
        el("p", { text: "Impossible de charger les disponibilités pour le moment." + (TEL ? " Vous pouvez aussi appeler Tout'Net au " + TEL + "." : "") }),
        el("button", { type: "button", class: "btn btn--outline btn--small", "data-retry": "" }, ["Réessayer"]),
      ]));
      return;
    }
    var data = d.data;
    var cal = joursCalendrier(data);
    if (!cal.liste.length) {
      slotsBox.appendChild(el("p", { class: "slots__msg", text: "Aucune disponibilité en ligne pour cette durée (" + formatDuree(data.duree) + ") dans les semaines à venir." + (TEL ? " Appelez Tout'Net au " + TEL + " pour trouver un créneau." : "") }));
      return;
    }

    var cols = colonnes();
    var maxPage = Math.max(0, Math.ceil(cal.liste.length / cols) - 1);
    state.page = Math.min(state.page, maxPage);
    var visibles = cal.liste.slice(state.page * cols, state.page * cols + cols);

    var head = el("div", { class: "cal__head" }, [
      el("button", { type: "button", class: "cal__nav", "data-page": "-1", "aria-label": "Jours précédents", disabled: state.page === 0 }, ["‹"]),
      el("p", { class: "cal__range", text: fmtDate(visibles[0], { day: "numeric", month: cols > 5 ? "long" : "short" }) + " – " + fmtDate(visibles[visibles.length - 1], { day: "numeric", month: cols > 5 ? "long" : "short" }) }),
      el("button", { type: "button", class: "cal__nav", "data-page": "1", "aria-label": "Jours suivants", disabled: state.page >= maxPage }, ["›"]),
    ]);
    var grid = el("div", { class: "cal__grid", style: "grid-template-columns:repeat(" + cols + ",minmax(0,1fr))" });
    var duree = data.duree || 0;
    visibles.forEach(function (date) {
      var cr = cal.map[date] || [];
      var bloc = {}, fin = "";
      if (state.jour === date && state.heure && duree) {
        // toutes les demi-heures couvertes par l'intervention s'affichent en bleu
        var debutMin = minutes(state.heure);
        for (var m = debutMin; m < debutMin + duree; m += 30) bloc[hhmm(m)] = true;
        fin = hhmm(debutMin + duree);
        cr = cr.concat(Object.keys(bloc)).filter(function (h, i, a) { return a.indexOf(h) === i; }).sort();
      }
      var rang = 0;
      grid.appendChild(el("div", { class: "cal__col" }, [
        el("p", { class: "cal__day" }, [
          el("span", { class: "cal__wd", text: fmtDate(date, { weekday: cols > 5 ? "long" : "short" }).replace(".", "") }),
          el("span", { class: "cal__dt", text: fmtDate(date, { day: "numeric", month: "short" }).replace(".", "") }),
        ]),
        el("div", { class: "cal__slots" }, cr.length ? cr.map(function (h) {
          var on = state.jour === date && state.heure === h;
          var dansBloc = !!bloc[h];
          var dispo = (cal.map[date] || []).indexOf(h) > -1;
          var cls = "cal__slot" + (on ? " is-active" : dansBloc ? " is-block" : "") + (dansBloc && h === hhmm(minutes(fin) - 30) ? " is-last" : "");
          var b = el("button", { type: "button", class: cls, "data-date": dispo ? date : null, "data-time": dispo ? h : null, disabled: !dispo && !dansBloc ? true : null,
            tabindex: dansBloc && !on && !dispo ? "-1" : null,
            "aria-label": dateLongue(date) + " à " + heureFr(h) + (dansBloc && !on ? " (intervention en cours)" : ""), "aria-pressed": String(on) }, [h]);
          if (dansBloc) b.style.animationDelay = (rang++ * 45) + "ms";
          return b;
        }).concat(fin ? [el("span", { class: "cal__end", text: "Fin ≈ " + heureFr(fin) })] : []) : [el("span", { class: "cal__none", text: "—" })]),
      ]));
    });
    slotsBox.appendChild(el("div", { class: "cal" }, [
      el("p", { class: "slots__info", text: "Durée estimée de l'intervention : " + formatDuree(data.duree) + ". Choisissez votre heure de début." }),
      head, grid,
    ]));
    if (state.jour && state.heure) {
      var f = hhmm(minutes(state.heure) + (data.duree || 0));
      slotsBox.appendChild(el("p", { class: "slots__chosen", text: "Créneau choisi : " + dateLongue(state.jour) + ", de " + heureFr(state.heure) + " à " + heureFr(f) + " environ (" + formatDuree(data.duree) + ")" }));
    }
  }
  function minutes(h) { var p = h.split(":"); return Number(p[0]) * 60 + Number(p[1]); }
  function hhmm(m) { return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); }

  slotsBox.addEventListener("click", function (e) {
    var nav = e.target.closest("[data-page]");
    if (nav && !nav.disabled) { state.page += Number(nav.getAttribute("data-page")); renderSlots(); return; }
    var s = e.target.closest("[data-time]");
    if (s) { state.jour = s.getAttribute("data-date"); state.heure = s.getAttribute("data-time"); errorBox.textContent = ""; renderSlots(); return; }
    if (e.target.closest("[data-retry]")) chargerDispos(true);
  });
  ["rue", "cp", "ville"].forEach(function (n) {
    form.elements[n].addEventListener("change", function () { if (state.step === 2) chargerDispos(); });
  });
  var largeur = window.innerWidth;
  window.addEventListener("resize", function () {
    if (Math.abs(window.innerWidth - largeur) > 40 && state.step === 2) { largeur = window.innerWidth; renderSlots(); }
  });

  function marquer(names) {
    var first = null;
    names.forEach(function (n) {
      var f = form.elements[n];
      if (!f || !f.classList) return;
      f.classList.add("is-invalid");
      if (!first) first = f;
    });
    if (first) first.focus();
  }

  function validerStep2() {
    var bad = [];
    if (!val("rue")) bad.push("rue");
    if (!/^\d{5}$/.test(val("cp"))) bad.push("cp");
    if (!val("ville")) bad.push("ville");
    if (bad.length) { marquer(bad); return "Indiquez l'adresse complète où intervenir (code postal à 5 chiffres)."; }
    if (!API && !DEMO) return "La réservation en ligne n'est pas encore disponible.";
    if (!state.jour || !state.heure) {
      if (!state.dispo.data && !state.dispo.loading) chargerDispos();
      return state.dispo.loading ? "Patientez, chargement des disponibilités…" : "Choisissez un créneau dans le calendrier.";
    }
    return "";
  }

  /* =================================================================
     ÉTAPE 3 — COORDONNÉES
     ================================================================= */
  function validerStep3() {
    var bad = [];
    if (!val("prenom")) bad.push("prenom");
    if (!val("nom")) bad.push("nom");
    if (val("telephone").replace(/[^\d]/g, "").length < 10) bad.push("telephone");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("email"))) bad.push("email");
    if (bad.length) { marquer(bad); return "Vérifiez les champs en rouge (téléphone à 10 chiffres, e-mail valide)."; }
    return "";
  }
  form.addEventListener("input", function (e) { if (e.target.classList.contains("is-invalid")) e.target.classList.remove("is-invalid"); });
  form.addEventListener("change", function (e) { if (e.target.name === "accepte") e.target.closest(".accept").classList.remove("is-invalid"); });

  /* =================================================================
     ÉTAPE 4 — RÉCAPITULATIF & VALIDATION
     ================================================================= */
  var recapBox = $("[data-recap]"), submitBox = $("[data-submit]");

  function recapBlock(title, step, children) {
    var edit = el("button", { type: "button", class: "link-btn", text: "Modifier" });
    edit.addEventListener("click", function () { goTo(step); });
    return el("div", { class: "recap__block" }, [el("div", { class: "recap__head" }, [el("h4", { text: title }), edit])].concat(children));
  }

  function renderRecap() {
    recapBox.textContent = "";
    var vehBlock = recapBlock("Votre formule", 1, []);
    var est = el("div");
    vehBlock.appendChild(est);
    recapBox.appendChild(vehBlock);
    renderDetail(est);
    recapBox.appendChild(recapBlock("Adresse & créneau", 2, [
      el("p", { text: adresse() }),
      el("p", { style: "font-weight:700", text: dateLongue(state.jour) + " à " + heureFr(state.heure) }),
    ]));
    recapBox.appendChild(recapBlock("Vos coordonnées", 3, [
      el("p", { text: val("prenom") + " " + val("nom") }),
      el("p", { text: val("telephone") + " · " + val("email") }),
      val("remarques") ? el("p", { style: "color:var(--c-muted)", text: val("remarques") }) : null,
    ]));

    submitBox.textContent = "";
    var btn = el("button", { type: "button", class: "btn btn--accent btn--large btn--block", "data-confirm": "" }, ["Valider ma demande"]);
    btn.addEventListener("click", function () { envoyer(btn); });
    var accept = el("label", { class: "accept" }, [
      el("input", { type: "checkbox", name: "accepte", id: "accepte" }),
      el("span", null, ["J'accepte les ", el("a", { href: "mentions-legales.html#conditions", target: "_blank", rel: "noopener" }, ["conditions de réservation"]),
        " et je demande que la prestation soit réalisée à la date choisie, y compris avant la fin du délai de rétractation de 14 jours."]),
    ]);
    submitBox.appendChild(el("div", { class: "submit" }, [
      accept,
      btn,
      el("p", { class: "consent" }, ["Votre demande est transmise à Tout'Net. Quentin la vérifie puis vous confirme le rendez-vous rapidement. Vos informations servent uniquement au traitement de votre demande (",
        el("a", { href: "mentions-legales.html#confidentialite", target: "_blank", rel: "noopener" }, ["politique de confidentialité"]), ")."]),
      DEMO ? el("p", { class: "demo-banner", text: "Aperçu : aucune demande ne sera réellement envoyée." }) : null,
    ]));
  }

  function resumeVehicule(d) {
    var parts = d.lignes.map(function (l, i) { return (i ? "+ " : "") + l.label + " " + (l.option ? plusOuPrix(l.prix) : euros(l.prix)); });
    return parts.join(" ") + (d.lignes.length > 1 ? " = " + euros(d.sousTotal) : "");
  }

  function envoyer(btn) {
    if (state.envoi) return;
    var acc = form.elements.accepte;
    if (acc && !acc.checked) {
      acc.closest(".accept").classList.add("is-invalid");
      errorBox.textContent = "Cochez la case pour accepter les conditions de réservation.";
      acc.focus();
      return;
    }
    state.envoi = true;
    btn.disabled = true;
    btn.textContent = "";
    btn.appendChild(el("span", { class: "spinner", "aria-hidden": "true" }));
    btn.appendChild(document.createTextNode("Envoi en cours…"));
    errorBox.textContent = "";

    var e = Site.estimer(state.vehicules);
    var payload = {
      action: "reserver",
      vehicules: state.vehicules.map(function (v, i) {
        var t = byId(C.vehicules, v.type), f = byId(C.formules, v.formule);
        var d = e.details.filter(function (x) { return x.index === i; })[0];
        return {
          type: v.type, typeNom: t ? t.nom : "", formule: v.formule, formuleNom: f ? f.nom : "",
          niveau: v.niveau || "", options: v.options.slice(),
          optionsNoms: v.options.map(function (id) { var o = byId(C.options, id); return o ? o.nom : id; }),
          prix: d ? d.sousTotal : null, resume: d ? resumeVehicule(d) : "",
        };
      }),
      adresse: { rue: val("rue"), cp: val("cp"), ville: val("ville") },
      creneau: { date: state.jour, heure: state.heure },
      client: { prenom: val("prenom"), nom: val("nom"), telephone: val("telephone"), email: val("email") },
      remarques: val("remarques"),
      estimation: { prix: e.total, pack: e.pack ? e.pack.nom + " −" + e.pack.remise + " %" : "",
        texte: euros(e.total) + (e.pack ? " (pack " + e.pack.nom + " −" + e.pack.remise + " % inclus)" : "") },
      website: val("website"),
      conditionsAcceptees: true,
    };

    var envoi = API
      ? fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), redirect: "follow" }).then(function (r) { return r.json(); })
      : new Promise(function (res) { setTimeout(function () { res({ ok: true, demo: true }); }, 500); });

    envoi.then(function (res) {
      state.envoi = false;
      if (res && res.ok) return afficherConfirmation(res);
      if (res && res.erreur === "creneau_indisponible") {
        state.dispo.cle = null;
        goTo(2);
        errorBox.textContent = "Ce créneau vient d'être pris. Merci d'en choisir un autre.";
        return;
      }
      throw new Error((res && res.message) || "Erreur");
    }).catch(function (err) {
      console.error(err);
      state.envoi = false;
      renderRecap();
      errorBox.textContent = "L'envoi n'a pas abouti. Réessayez dans un instant" + (TEL ? " ou appelez Tout'Net au " + TEL : "") + ".";
    });
  }

  /* ---------- Page de confirmation ---------- */
  var overlay = document.querySelector("[data-confirmation]");

  function afficherConfirmation(res) {
    var e = Site.estimer(state.vehicules);
    var box = overlay.querySelector("[data-confirmation-body]");
    box.textContent = "";
    box.appendChild(el("div", { class: "done__icon", html: Site.icons.ok, "aria-hidden": "true" }));
    box.appendChild(el("h2", { id: "confirmation-titre", text: "Votre demande a bien été envoyée !" }));
    box.appendChild(el("p", { class: "done__lead", text: "Merci " + val("prenom") + ". Votre demande pour le " + dateLongue(state.jour) + " à " + heureFr(state.heure) + " a été transmise à Quentin." }));
    box.appendChild(el("p", { text: "Il la vérifie et vous recontacte très rapidement pour confirmer le rendez-vous (heure d'arrivée) ou vous proposer un autre horaire. Un e-mail récapitulatif vous est envoyé à " + val("email") + "." }));
    box.appendChild(el("ul", { class: "done__recap" }, [
      el("li", null, [el("span", { text: "Véhicule" + (e.nb > 1 ? "s" : "") }), el("strong", { text: e.details.map(function (d) { return d.type.nom + (d.formule ? " · " + d.formule.nom : ""); }).join(" / ") })]),
      el("li", null, [el("span", { text: "Adresse" }), el("strong", { text: adresse() })]),
      el("li", null, [el("span", { text: "Prix estimé" }), el("strong", { text: euros(e.total) })]),
      res.reference ? el("li", null, [el("span", { text: "Référence" }), el("strong", { text: res.reference })]) : null,
    ]));
    if (res.demo) box.appendChild(el("p", { class: "demo-banner", text: "Aperçu : cette demande n'a pas été envoyée." }));
    box.appendChild(el("div", { class: "done__actions" }, [
      el("a", { href: "#accueil", class: "btn btn--accent btn--large", "data-close": "" }, ["Retour au site"]),
      el("a", { href: "#formules", class: "btn btn--outline btn--large", "data-close": "" }, ["Voir les formules"]),
    ]));
    overlay.hidden = false;
    overlay.scrollTop = 0;
    document.documentElement.classList.add("no-scroll");
    var first = overlay.querySelector("[data-close]");
    if (first) first.focus({ preventScroll: true });
  }
  if (overlay) overlay.addEventListener("click", function (e) {
    if (!e.target.closest("[data-close]")) return;
    overlay.hidden = true;
    document.documentElement.classList.remove("no-scroll");
    reinitialiser();
  });

  function reinitialiser() {
    state.vehicules = [nouveauVehicule()];
    state.actif = 0; state.jour = null; state.heure = null;
    state.dispo = { cle: null, loading: false, erreur: false, data: null };
    form.reset();
    goTo(1, { noScroll: true });
  }

  /* =================================================================
     NAVIGATION ENTRE ÉTAPES
     ================================================================= */
  var VALIDATION = { 1: validerStep1, 2: validerStep2, 3: validerStep3 };

  function goTo(step, opts) {
    state.step = step;
    root.querySelectorAll("[data-step]").forEach(function (p) { p.hidden = p.getAttribute("data-step") !== String(step); });
    stepsNav.forEach(function (s, i) {
      s.classList.toggle("is-active", i + 1 === step);
      s.classList.toggle("is-done", i + 1 < step);
      if (i + 1 === step) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current");
    });
    btnPrev.hidden = step === 1;
    btnNext.hidden = step === 4;
    navBox.hidden = false;
    errorBox.textContent = "";

    if (step === 1) renderStep1();
    if (step === 2) chargerDispos();
    if (step === 4) renderRecap();

    if (!opts || !opts.noScroll) {
      var top = root.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.5) window.scrollTo({ top: window.scrollY + top - 90, behavior: "smooth" });
    }
  }

  btnNext.addEventListener("click", function () {
    var v = VALIDATION[state.step];
    var err = v ? v() : "";
    if (err) { errorBox.textContent = err; return; }
    goTo(state.step + 1);
  });
  btnPrev.addEventListener("click", function () { goTo(state.step - 1); });
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  /* ---------- Démarrage ---------- */
  if (API) {
    api({ action: "durees" }).then(function (d) { if (d && d.ok) { state.durees = d.durees; renderDetail(estimateBox); } }).catch(function () {});
  }
  goTo(1, { noScroll: true });
})();
