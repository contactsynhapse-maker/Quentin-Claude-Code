/* =====================================================================
   TOUT'NET — RÉSERVATION EN LIGNE
   ---------------------------------------------------------------------
   Étape 1 : un ou plusieurs véhicules (un onglet par véhicule)
             type, formule, options → estimation de prix en direct
   Étape 2 : adresse d'intervention + créneau
   Étape 3 : coordonnées du client
   Étape 4 : récapitulatif et envoi

   Deux modes, selon config.reservation.apiUrl :
   - apiUrl renseignée : créneaux réels lus dans l'agenda de Quentin,
     réservation enregistrée automatiquement (voir toutnet/reservation/) ;
   - apiUrl vide : mode « demande » — date souhaitée + envoi par
     e-mail / WhatsApp / SMS.
   ===================================================================== */
(function () {
  "use strict";

  var Site = window.Site;
  if (!Site) return;
  var C = Site.config, R = C.reservation || {};
  var el = Site.el, filled = Site.filled, byId = Site.byId;
  var API = filled(R.apiUrl) ? R.apiUrl.trim() : "";
  var MAX = R.maxVehicules || 10;
  var NIVEAUX = C.niveaux || [];

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
    durees: R.durees || null,                         // durées (minutes) : config, puis API si installée
    dispo: { cle: null, loading: false, erreur: false, data: null },
    jour: null, heure: null,                          // créneau choisi (mode API)
    modeDemande: !API,                                // true = pas de réservation automatique
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
  function dateObj(iso) { return new Date(iso + "T12:00:00Z"); }
  function fmtDate(iso, opts) { return dateObj(iso).toLocaleDateString("fr-FR", Object.assign({ timeZone: "UTC" }, opts)); }
  function dateLongue(iso) { return fmtDate(iso, { weekday: "long", day: "numeric", month: "long" }); }
  function heureFr(h) { return h ? h.replace(/^0/, "").replace(":", " h ").replace(/ h 00$/, " h") : ""; }
  function val(name) { var f = form.elements[name]; return f ? String(f.value || "").trim() : ""; }

  /* =================================================================
     ÉTAPE 1 — VÉHICULES
     ================================================================= */
  var tabsBox = $("[data-vtabs]"), panelBox = $("[data-vpanel]"), estimateBox = $("[data-estimate]");

  function renderTabs() {
    tabsBox.textContent = "";
    state.vehicules.forEach(function (v, i) {
      var b = el("button", { type: "button", class: "vtab" + (i === state.actif ? " is-active" : ""), role: "tab",
        "aria-selected": String(i === state.actif), "data-tab": String(i) }, [
        el("span", { class: "vtab__dot" + (vehiculeComplet(v) ? " is-ok" : ""), "aria-hidden": "true" }),
        "Véhicule " + (i + 1),
      ]);
      tabsBox.appendChild(b);
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
    panelBox.textContent = "";
    panelBox.appendChild(el("div", { class: "vpanel__head" }, [
      el("h3", { text: "Véhicule " + (state.actif + 1) }),
      state.vehicules.length > 1 ? el("button", { type: "button", class: "link-btn link-btn--danger", "data-remove": "" }, ["Retirer ce véhicule"]) : null,
    ]));

    panelBox.appendChild(el("span", { class: "group-label", text: "Type de véhicule" }));
    panelBox.appendChild(el("div", { class: "choices", "data-field": "type" }, (C.vehicules || []).map(function (t) {
      return choice("radio", "type-" + v.uid, t.id, v.type === t.id, t.nom, t.note || "", Site.fourchette(t.prixMin, t.prixMax));
    })));

    panelBox.appendChild(el("span", { class: "group-label", text: "Formule" }));
    panelBox.appendChild(el("div", { class: "choices choices--2", "data-field": "formule" }, (C.formules || []).map(function (f) {
      return choice("radio", "formule-" + v.uid, f.id, v.formule === f.id, f.nom, (f.etiquette || "") + (f.sousTitre ? " — " + f.sousTitre : ""));
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
        return choice("checkbox", "options-" + v.uid, o.id, v.options.indexOf(o.id) > -1, o.nom, o.description || "", o.prix ? "+" + Site.euros(o.prix) : "");
      })));
    }

    if (state.vehicules.length < MAX) {
      panelBox.appendChild(el("p", { style: "margin:18px 0 0" }, [
        el("button", { type: "button", class: "link-btn", "data-add": "" }, ["+ Ajouter un autre véhicule (famille, flotte…)"]),
      ]));
    }
  }

  function renderEstimate() {
    var e = Site.estimer(state.vehicules);
    estimateBox.textContent = "";
    estimateBox.className = "estimate" + (e.nb ? "" : " estimate--empty");
    var top = el("div", { class: "estimate__top" }, [
      el("span", { class: "estimate__label", text: "Prix estimé" }),
      el("span", { class: "estimate__total", text: e.nb ? Site.prixTexte(e) : "Choisissez un type de véhicule" }),
    ]);
    estimateBox.appendChild(top);
    if (!e.nb) return;
    var lines = el("ul", { class: "estimate__lines" });
    e.lignes.forEach(function (l) { lines.appendChild(el("li", null, [el("span", { text: l.label }), el("span", { text: (l.partiel ? "dès " : "") + Site.euros(l.prix) })])); });
    if (e.pack) {
      lines.appendChild(el("li", { class: "is-discount" }, [
        el("span", { text: "Pack " + e.pack.nom + " −" + e.pack.remise + " %" }),
        el("span", { text: "− " + Site.euros(e.remise) }),
      ]));
    }
    var d = dureeLocale();
    if (d) lines.appendChild(el("li", null, [el("span", { text: "Durée estimée" }), el("span", { text: formatDuree(d) })]));
    estimateBox.appendChild(lines);
    if (filled(R.mentionEstimation)) estimateBox.appendChild(el("p", { class: "estimate__note", text: R.mentionEstimation }));
  }

  function renderStep1(full) {
    renderTabs();
    if (full !== false) renderPanel();
    renderEstimate();
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
      v.options = Array.prototype.map.call(field.querySelectorAll("input:checked"), function (i) { return i.value; });
    } else {
      v[f] = e.target.value;
    }
    errorBox.textContent = "";
    renderStep1(false);
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
     ÉTAPE 2 — ADRESSE & CRÉNEAU
     ================================================================= */
  var slotsBox = $("[data-slots]");

  function api(params) {
    var qs = Object.keys(params).map(function (k) { return k + "=" + encodeURIComponent(params[k]); }).join("&");
    return fetch(API + (API.indexOf("?") > -1 ? "&" : "?") + qs, { method: "GET", redirect: "follow" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }

  function chargerDispos(force) {
    var cle = JSON.stringify(signature());
    if (!force && state.dispo.cle === cle && (state.dispo.data || state.dispo.loading)) { renderSlots(); return; }
    state.dispo = { cle: cle, loading: true, erreur: false, data: null };
    state.jour = null; state.heure = null;
    renderSlots();
    api({ action: "disponibilites", vehicules: cle })
      .then(function (data) {
        if (state.dispo.cle !== cle) return;
        if (!data || !data.ok) throw new Error((data && data.message) || "Réponse invalide");
        state.dispo.data = data;
        state.dispo.loading = false;
        if (data.jours && data.jours.length) state.jour = data.jours[0].date;
        renderSlots();
      })
      .catch(function (err) {
        console.error(err);
        if (state.dispo.cle !== cle) return;
        state.dispo.loading = false;
        state.dispo.erreur = true;
        renderSlots();
      });
  }

  function renderSlots() {
    slotsBox.textContent = "";
    if (state.modeDemande) return renderDemande();

    var d = state.dispo;
    if (d.loading) {
      slotsBox.appendChild(el("p", { class: "slots__msg" }, [el("span", { class: "spinner", "aria-hidden": "true" }), "Recherche des créneaux disponibles…"]));
      return;
    }
    if (d.erreur || !d.data) {
      slotsBox.appendChild(el("div", { class: "slots__msg" }, [
        el("p", { text: "Impossible de charger les créneaux pour le moment." }),
        el("button", { type: "button", class: "btn btn--outline btn--small", "data-retry": "" }, ["Réessayer"]),
        " ",
        el("button", { type: "button", class: "btn btn--outline btn--small", "data-demande": "" }, ["Indiquer une date souhaitée"]),
      ]));
      return;
    }
    var data = d.data;
    if (data.duree) slotsBox.appendChild(el("p", { class: "slots__info", text: "Durée estimée de l'intervention : " + formatDuree(data.duree) + "." }));
    if (!data.jours || !data.jours.length) {
      slotsBox.appendChild(el("div", { class: "slots__msg" }, [
        el("p", { text: "Aucun créneau n'est disponible en ligne pour le moment pour cette durée." }),
        el("button", { type: "button", class: "btn btn--outline btn--small", "data-demande": "" }, ["Indiquer une date souhaitée"]),
      ]));
      return;
    }

    var days = el("div", { class: "slots__days", role: "listbox", "aria-label": "Jour" });
    data.jours.forEach(function (j) {
      days.appendChild(el("button", { type: "button", class: "day" + (j.date === state.jour ? " is-active" : ""), "data-day": j.date,
        "aria-label": dateLongue(j.date) }, [
        el("small", { text: fmtDate(j.date, { weekday: "short" }).replace(".", "") }),
        el("strong", { text: fmtDate(j.date, { day: "numeric" }) }),
        el("small", { text: fmtDate(j.date, { month: "short" }).replace(".", "") }),
      ]));
    });
    slotsBox.appendChild(days);

    var jour = data.jours.filter(function (j) { return j.date === state.jour; })[0];
    if (jour) {
      var times = el("div", { class: "slots__times", role: "listbox", "aria-label": "Heure" });
      jour.creneaux.forEach(function (h) {
        times.appendChild(el("button", { type: "button", class: "time" + (h === state.heure ? " is-active" : ""), "data-time": h, text: h.replace(":", "h") }));
      });
      slotsBox.appendChild(times);
    }
    if (state.jour && state.heure) {
      slotsBox.appendChild(el("p", { class: "slots__chosen", text: "Créneau choisi : " + dateLongue(state.jour) + " à " + heureFr(state.heure) }));
    }
  }

  function renderDemande() {
    var demain = new Date(Date.now() + 864e5);
    var min = demain.getFullYear() + "-" + String(demain.getMonth() + 1).padStart(2, "0") + "-" + String(demain.getDate()).padStart(2, "0");
    if (API) slotsBox.appendChild(el("p", { class: "step__hint", text: "Indiquez votre date souhaitée : Tout'Net vous recontacte pour fixer l'heure." }));
    else slotsBox.appendChild(el("p", { class: "step__hint", text: "Indiquez votre date et votre moment préférés : Tout'Net vous recontacte pour confirmer le créneau." }));
    var fields = el("div", { class: "fields" }, [
      el("label", { class: "field" }, [el("span", { text: "Date souhaitée" }), el("input", { type: "date", name: "dateSouhaitee", min: min, required: true, value: state.dateSouhaitee || null })]),
      el("div", { class: "field" }, [
        el("span", { text: "Moment de la journée" }),
        el("div", { class: "segmented" }, ["Matin", "Après-midi", "Indifférent"].map(function (m) {
          return choice("radio", "moment", m, (state.moment || "Indifférent") === m, m);
        })),
      ]),
    ]);
    slotsBox.appendChild(fields);
  }

  slotsBox.addEventListener("click", function (e) {
    var day = e.target.closest("[data-day]");
    if (day) { state.jour = day.getAttribute("data-day"); state.heure = null; renderSlots(); return; }
    var t = e.target.closest("[data-time]");
    if (t) { state.heure = t.getAttribute("data-time"); errorBox.textContent = ""; renderSlots(); return; }
    if (e.target.closest("[data-retry]")) { chargerDispos(true); return; }
    if (e.target.closest("[data-demande]")) { state.modeDemande = true; renderSlots(); }
  });
  slotsBox.addEventListener("change", function (e) {
    if (e.target.name === "dateSouhaitee") state.dateSouhaitee = e.target.value;
    if (e.target.name === "moment") state.moment = e.target.value;
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
    if (state.modeDemande) {
      if (!state.dateSouhaitee) { marquer(["dateSouhaitee"]); return "Indiquez votre date souhaitée."; }
    } else if (!state.jour || !state.heure) {
      return state.dispo.loading ? "Patientez, chargement des créneaux…" : "Choisissez un jour puis une heure.";
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

  /* =================================================================
     ÉTAPE 4 — RÉCAPITULATIF & ENVOI
     ================================================================= */
  var recapBox = $("[data-recap]"), submitBox = $("[data-submit]"), doneBox = $("[data-done]");

  function descVehicules() {
    return state.vehicules.map(function (v, i) {
      var t = byId(C.vehicules, v.type), f = byId(C.formules, v.formule), n = byId(NIVEAUX, v.niveau);
      var opts = v.options.map(function (id) { var o = byId(C.options, id); return o ? o.nom : id; });
      return {
        titre: "Véhicule " + (i + 1) + " — " + (t ? t.nom : "?"),
        formule: f ? (f.etiquette ? f.etiquette.split("·")[0].trim() + " · " : "") + f.nom : "?",
        niveau: n ? n.nom : "",
        options: opts,
        brut: { type: v.type, typeNom: t ? t.nom : "", formule: v.formule, formuleNom: f ? f.nom : "", niveau: v.niveau || "", niveauNom: n ? n.nom : "", options: v.options.slice(), optionsNoms: opts },
      };
    });
  }
  function texteCreneau() {
    if (state.modeDemande) return "Date souhaitée : " + (state.dateSouhaitee ? dateLongue(state.dateSouhaitee) : "?") + " (" + (state.moment || "Indifférent").toLowerCase() + ")";
    return dateLongue(state.jour) + " à " + heureFr(state.heure);
  }
  function texteEstimation() {
    var e = Site.estimer(state.vehicules);
    return Site.prixTexte(e) + (e.pack ? " (pack " + e.pack.nom + " −" + e.pack.remise + " % inclus)" : "");
  }
  function adresse() { return val("rue") + ", " + val("cp") + " " + val("ville"); }

  function recapBlock(title, step, children) {
    var edit = el("button", { type: "button", class: "link-btn", text: "Modifier" });
    edit.addEventListener("click", function () { goTo(step); });
    return el("div", { class: "recap__block" }, [el("div", { class: "recap__head" }, [el("h4", { text: title }), edit])].concat(children));
  }

  function renderRecap() {
    recapBox.textContent = "";
    recapBox.appendChild(recapBlock("Véhicules", 1, descVehicules().map(function (d) {
      return el("div", { class: "recap__vehicle" }, [
        el("strong", { text: d.titre }),
        el("span", { text: d.formule + (d.niveau ? " · " + d.niveau : "") + (d.options.length ? " · " + d.options.join(", ") : "") }),
      ]);
    })));
    recapBox.appendChild(recapBlock(state.modeDemande ? "Adresse & date souhaitée" : "Adresse & créneau", 2, [
      el("p", { text: adresse() }), el("p", { style: "font-weight:600", text: texteCreneau() }),
    ]));
    recapBox.appendChild(recapBlock("Coordonnées", 3, [
      el("p", { text: val("prenom") + " " + val("nom") }),
      el("p", { text: val("telephone") + " · " + val("email") }),
      val("remarques") ? el("p", { style: "color:var(--c-muted)", text: val("remarques") }) : null,
    ]));
    var est = el("div", { class: "estimate" });
    recapBox.appendChild(est);
    var save = estimateBox; estimateBox = est; renderEstimate(); estimateBox = save;

    renderSubmit();
  }

  function message() {
    var lines = ["Bonjour, je souhaite réserver un nettoyage Tout'Net.", ""];
    descVehicules().forEach(function (d) {
      lines.push("• " + d.titre);
      lines.push("  " + d.formule + (d.niveau ? " · " + d.niveau : "") + (d.options.length ? " · Options : " + d.options.join(", ") : ""));
    });
    lines.push("", "Prix estimé : " + texteEstimation());
    lines.push("Adresse : " + adresse());
    lines.push(texteCreneau().charAt(0).toUpperCase() + texteCreneau().slice(1));
    lines.push("", "Nom : " + val("prenom") + " " + val("nom"), "Téléphone : " + val("telephone"), "E-mail : " + val("email"));
    if (val("remarques")) lines.push("Précisions : " + val("remarques"));
    return lines.join("\n");
  }

  function renderSubmit() {
    submitBox.textContent = "";
    var box = el("div", { class: "submit" });
    submitBox.appendChild(box);
    var feedback = el("p", { class: "submit__feedback", "aria-live": "polite" });

    if (!state.modeDemande) {
      var btn = el("button", { type: "button", class: "btn btn--accent btn--large btn--block", "data-confirm": "" }, ["Confirmer ma demande de réservation"]);
      btn.addEventListener("click", function () { envoyer(btn); });
      box.appendChild(btn);
      box.appendChild(el("p", { class: "consent", text: "Votre créneau est réservé dès l'envoi. Tout'Net vous confirme le rendez-vous par e-mail. Vos informations servent uniquement au traitement de votre demande." }));
      return;
    }
    box.appendChild(el("p", { style: "font-weight:700;margin-bottom:10px", text: "Envoyer ma demande par :" }));
    box.appendChild(boutonsEnvoi(feedback, "btn--primary"));
    box.appendChild(feedback);
  }

  function boutonsEnvoi(feedback, firstCls) {
    var wrap = el("div", { class: "send-buttons" });
    Site.contactLinks("x").filter(function (l) { return l.id !== "tel"; }).forEach(function (link, i) {
      var a = Site.linkButton(link, i === 0 ? firstCls : "btn--outline");
      a.addEventListener("click", function () {
        var msg = message();
        var fresh = Site.contactLinks(msg).filter(function (l) { return l.id === link.id; })[0];
        if (fresh) a.href = fresh.href;
        if (link.id === "instagram") copier(msg, feedback, "Récapitulatif copié : collez-le dans votre message Instagram.");
      });
      wrap.appendChild(a);
    });
    var cp = el("button", { type: "button", class: "btn btn--outline" }, [Site.icon("copy"), "Copier le récapitulatif"]);
    cp.addEventListener("click", function () { copier(message(), feedback, "Récapitulatif copié."); });
    wrap.appendChild(cp);
    return wrap;
  }

  function copier(text, feedback, ok) {
    function done() { feedback.textContent = ok; }
    function fallback() {
      var ta = el("textarea", { style: "position:fixed;opacity:0;top:0;left:0" });
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { feedback.textContent = "Copie impossible sur cet appareil."; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  }

  function envoyer(btn) {
    if (state.envoi) return;
    state.envoi = true;
    btn.disabled = true;
    btn.textContent = "";
    btn.appendChild(el("span", { class: "spinner", "aria-hidden": "true" }));
    btn.appendChild(document.createTextNode("Envoi en cours…"));
    errorBox.textContent = "";

    var e = Site.estimer(state.vehicules);
    var payload = {
      action: "reserver",
      vehicules: descVehicules().map(function (d) { return d.brut; }),
      adresse: { rue: val("rue"), cp: val("cp"), ville: val("ville") },
      creneau: { date: state.jour, heure: state.heure },
      client: { prenom: val("prenom"), nom: val("nom"), telephone: val("telephone"), email: val("email") },
      remarques: val("remarques"),
      estimation: { prix: e.total, pack: e.pack ? e.pack.nom + " −" + e.pack.remise + " %" : "", texte: texteEstimation() },
      website: val("website"),
    };

    fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), redirect: "follow" })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        state.envoi = false;
        if (res && res.ok) return afficherSucces(res);
        if (res && res.erreur === "creneau_indisponible") {
          state.dispo.cle = null;
          goTo(2);
          errorBox.textContent = "Ce créneau vient d'être pris. Merci d'en choisir un autre.";
          return;
        }
        throw new Error((res && res.message) || "Erreur");
      })
      .catch(function (err) {
        console.error(err);
        state.envoi = false;
        renderSubmit();
        errorBox.textContent = "L'envoi n'a pas abouti. Réessayez, ou transmettez votre demande directement :";
        var feedback = el("p", { class: "submit__feedback", "aria-live": "polite" });
        submitBox.appendChild(el("div", { class: "submit__alt" }, [boutonsEnvoi(feedback, "btn--outline"), feedback]));
      });
  }

  function afficherSucces(res) {
    doneBox.textContent = "";
    doneBox.appendChild(el("div", { class: "done__icon", html: Site.icons.ok, "aria-hidden": "true" }));
    doneBox.appendChild(el("h3", { text: "Demande envoyée, merci " + val("prenom") + " !" }));
    doneBox.appendChild(el("p", { text: "Votre créneau du " + dateLongue(state.jour) + " à " + heureFr(state.heure) + " est réservé en attente de validation. Vous recevrez un e-mail de confirmation à " + val("email") + "." }));
    if (res.reference) doneBox.appendChild(el("p", { style: "font-weight:600;color:var(--c-navy)", text: "Référence : " + res.reference }));
    goTo("done");
  }

  /* =================================================================
     NAVIGATION ENTRE ÉTAPES
     ================================================================= */
  var VALIDATION = { 1: validerStep1, 2: validerStep2, 3: validerStep3 };

  function goTo(step) {
    state.step = step;
    root.querySelectorAll("[data-step]").forEach(function (p) { p.hidden = p.getAttribute("data-step") !== String(step); });
    var num = step === "done" ? 5 : step;
    stepsNav.forEach(function (s, i) {
      s.classList.toggle("is-active", i + 1 === num);
      s.classList.toggle("is-done", i + 1 < num);
      if (i + 1 === num) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current");
    });
    btnPrev.hidden = step === 1 || step === "done";
    btnNext.hidden = step === 4 || step === "done";
    navBox.hidden = step === "done";
    errorBox.textContent = "";

    if (step === 1) renderStep1();
    if (step === 2) { if (state.modeDemande) renderSlots(); else chargerDispos(); }
    if (step === 4) renderRecap();

    var top = root.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.5) window.scrollTo({ top: window.scrollY + top - 90, behavior: "smooth" });
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
    api({ action: "durees" }).then(function (d) { if (d && d.ok) { state.durees = d.durees; renderEstimate(); } }).catch(function () {});
  }
  renderStep1();
  state.step = 1;
  stepsNav[0].classList.add("is-active");
  btnPrev.hidden = true;
})();
