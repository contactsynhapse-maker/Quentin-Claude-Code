/**
 * =====================================================================
 *  TOUT'NET — RÉSERVATION EN LIGNE (Google Apps Script)
 * ---------------------------------------------------------------------
 *  Ce script est lié à une feuille Google Sheets « Tout'Net — Réservations ».
 *  Installation pas à pas : voir GUIDE.md (même dossier).
 *
 *  Fonctionnement :
 *   - Quentin indique ses disponibilités en créant des événements dans
 *     l'agenda Google « Tout'Net — Disponibilités » (ex. samedi 9h–18h).
 *   - Le site propose uniquement les heures de début où toute la durée
 *     de l'intervention tient dans une disponibilité, sans chevaucher un
 *     rendez-vous existant (agenda « Tout'Net — Rendez-vous »), avec un
 *     temps de battement pour le trajet.
 *   - Chaque réservation bloque aussitôt le créneau (« ⏳ À CONFIRMER »),
 *     est enregistrée dans la feuille « Réservations », et Quentin reçoit
 *     un e-mail (et un SMS en option) avec les boutons Accepter / Refuser.
 *   - Le client reçoit un e-mail à chaque étape (reçue, confirmée, refusée).
 *
 *  Réglages modifiables sans toucher au code : onglets « Réglages » et
 *  « Durées » de la feuille.
 * =====================================================================
 */

var TZ = "Europe/Paris";
// Adresse du site (utilisée pour les boutons Accepter / Refuser des e-mails)
// si le réglage « site_web » est vide.
var SITE_DEFAUT = "https://contactsynhapse-maker.github.io/toutnet/";
var FEUILLE_RESA = "Réservations";
var FEUILLE_REGLAGES = "Réglages";
var FEUILLE_DUREES = "Durées";

var COLONNES = [
  "Référence", "Reçue le", "Statut", "Date", "Début", "Fin", "Durée (min)",
  "Prénom", "Nom", "Téléphone", "E-mail", "Adresse", "Code postal", "Ville",
  "Véhicules", "Nb véhicules", "Estimation", "Précisions", "ID agenda", "Jeton",
];
var COL = {}; COLONNES.forEach(function (c, i) { COL[c] = i + 1; });

var STATUT = { ATTENTE: "En attente", CONFIRMEE: "Confirmée", REFUSEE: "Refusée" };

var REGLAGES_DEFAUT = [
  ["email_notification", "", "Adresse qui reçoit les nouvelles demandes (vide = le compte Google qui a installé le script)."],
  ["nom_entreprise", "Tout'Net", ""],
  ["telephone_entreprise", "06 47 59 06 73", "Affiché dans les e-mails envoyés aux clients."],
  ["site_web", "", "Adresse du site (affichée dans les e-mails)."],
  ["agenda_disponibilites", "", "Rempli automatiquement par l'installation."],
  ["agenda_rendezvous", "", "Rempli automatiquement par l'installation."],
  ["bloquer_agenda_principal", "non", "oui = les événements de l'agenda Google principal bloquent aussi les créneaux."],
  ["battement_minutes", 30, "Temps libre minimum entre deux rendez-vous. À AJUSTER."],
  ["trajet_auto", "oui", "oui = le temps de trajet réel (Google Maps) entre deux rendez-vous est ajouté automatiquement."],
  ["marge_trajet_minutes", 10, "Minutes ajoutées au temps de trajet (stationnement, installation)."],
  ["pas_minutes", 30, "Écart entre deux heures de début proposées (30 = 9h00, 9h30, 10h00…)."],
  ["delai_minimum_heures", 24, "Délai minimum entre la réservation et le rendez-vous."],
  ["horizon_jours", 45, "Nombre de jours à l'avance où l'on peut réserver."],
  ["free_sms_user", "", "Optionnel — SMS de notification (abonnés Free Mobile) : identifiant."],
  ["free_sms_pass", "", "Optionnel — SMS Free Mobile : clé d'identification."],
];

// Doivent correspondre aux identifiants `id` de js/config.js du site.
var VEHICULES = [["citadine", "Citadine"], ["break-suv", "Break · SUV"], ["7-places", "7 places (van)"], ["camion", "Camion"], ["utilitaire", "Utilitaire"], ["commercial", "Voiture commerciale"]];
var FORMULES = [["formule-1", "Formule 1 — Aspiration à sec"], ["formule-2", "Formule 2 — Nettoyage complet par extraction"]];
var OPTIONS = [["vehicule-tres-sale", "Véhicule très sale"], ["poils-animaux", "Poils d'animaux"]];
// Durées de départ (minutes), d'après Quentin : citadine et break/SUV 2 h (formule 1)
// et 3 h (formule 2), utilitaire 3 h minimum, voiture commerciale 1 h 30 à 2 h.
// Les lignes « À CONFIRMER » sont provisoires.
// Ajustables ensuite dans l'onglet « Durées », sans toucher au code.
var DUREES_DEFAUT = {
  "citadine|formule-1": 120, "citadine|formule-2": 180,
  "break-suv|formule-1": 120, "break-suv|formule-2": 180,
  "7-places|formule-1": 120, "7-places|formule-2": 180,       // À CONFIRMER
  "camion|formule-1": 180, "camion|formule-2": 180,           // À CONFIRMER
  "utilitaire|formule-1": 180, "utilitaire|formule-2": 180,
  "commercial|formule-1": 90, "commercial|formule-2": 120,
  "option|vehicule-tres-sale": 30,
  "option|poils-animaux": 0,                                   // À CONFIRMER
};

/* =====================================================================
   POINTS D'ENTRÉE WEB
   ===================================================================== */

function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.action === "durees") return json({ ok: true, durees: lireDurees() });
    if (p.action === "disponibilites") return json(disponibilites(JSON.parse(p.vehicules || "[]"), p.adresse || ""));
    if (p.action === "demande") return json(infoDemande(p));
    if (p.action === "decider") return json(decider(p));
    if (p.action === "decision") return pageDecision(p);
    return json({ ok: true, service: "Tout'Net — réservation" });
  } catch (err) {
    console.error(err);
    if (p.action === "decision") return page("Erreur", "<p>" + esc(err.message) + "</p>");
    return json({ ok: false, message: err.message });
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.action === "reserver") return json(reserver(data));
    if (data.action === "decider") return json(decider(data));
    if (data.action === "message") return json(envoyerMessage(data));
    return json({ ok: false, message: "Action inconnue" });
  } catch (err) {
    console.error(err);
    return json({ ok: false, message: err.message });
  }
}

/* =====================================================================
   CALCUL DES CRÉNEAUX (fonction pure, testable)
   fenetres / occupes : [{ debut: ms, fin: ms }] ; un rendez-vous occupé
   peut porter sa propre marge `margeMin` (temps de trajet), sinon
   o.battementMin s'applique.
   o : { pasMin, battementMin, debutMin (ms, au plus tôt) }
   Renvoie la liste triée des heures de début possibles (ms).
   ===================================================================== */
function calculerCreneaux(fenetres, occupes, dureeMin, o) {
  var pas = o.pasMin * 60000, duree = dureeMin * 60000;
  var vus = {}, res = [];
  fenetres.forEach(function (f) {
    var s = Math.ceil(Math.max(f.debut, o.debutMin) / pas) * pas;
    for (; s + duree <= f.fin; s += pas) {
      if (vus[s]) continue;
      var libre = occupes.every(function (b) {
        var batt = (b.margeMin != null ? b.margeMin : o.battementMin) * 60000;
        return !(s < b.fin + batt && s + duree + batt > b.debut);
      });
      if (libre) { vus[s] = true; res.push(s); }
    }
  });
  return res.sort(function (a, b) { return a - b; });
}

/* =====================================================================
   DISPONIBILITÉS
   ===================================================================== */
function disponibilites(vehicules, adresseClient) {
  var R = lireReglages();
  var duree = dureeTotale(vehicules, lireDurees());
  var now = Date.now();
  var debut = now + Number(R.delai_minimum_heures) * 3600000;
  var fin = now + Number(R.horizon_jours) * 86400000;
  var starts = creneauxPossibles(R, duree, debut, fin, adresseClient);

  var jours = [], index = {};
  starts.forEach(function (s) {
    var d = new Date(s);
    var date = Utilities.formatDate(d, TZ, "yyyy-MM-dd");
    if (!index[date]) { index[date] = { date: date, creneaux: [] }; jours.push(index[date]); }
    index[date].creneaux.push(Utilities.formatDate(d, TZ, "HH:mm"));
  });
  return { ok: true, duree: duree, jours: jours };
}

function creneauxPossibles(R, duree, debutMs, finMs, adresseClient) {
  var calDispo = agenda(R.agenda_disponibilites, "disponibilités");
  var calRdv = agenda(R.agenda_rendezvous, "rendez-vous");
  var de = new Date(debutMs - 86400000), a = new Date(finMs + 86400000);

  var fenetres = calDispo.getEvents(new Date(debutMs), new Date(finMs))
    .filter(function (ev) { return !ev.isAllDayEvent(); })
    .map(function (ev) { return { debut: ev.getStartTime().getTime(), fin: Math.min(ev.getEndTime().getTime(), finMs) }; });

  var evts = calRdv.getEvents(de, a);
  if (String(R.bloquer_agenda_principal).toLowerCase() === "oui") {
    evts = evts.concat(CalendarApp.getDefaultCalendar().getEvents(de, a));
  }
  var battement = Number(R.battement_minutes) || 0;
  var trajetAuto = adresseClient && String(R.trajet_auto).toLowerCase() !== "non";
  var occupes = evts.map(function (ev) {
    var o = { debut: ev.getStartTime().getTime(), fin: ev.getEndTime().getTime() };
    var lieu = ev.getLocation && ev.getLocation();
    if (trajetAuto && lieu) {
      var t = tempsTrajet(lieu, adresseClient);
      if (t != null) o.margeMin = Math.max(battement, t + (Number(R.marge_trajet_minutes) || 0));
    }
    return o;
  });

  return calculerCreneaux(fenetres, occupes, duree, {
    pasMin: Number(R.pas_minutes) || 30,
    battementMin: battement,
    debutMin: debutMs,
  });
}

/* =====================================================================
   RÉSERVATION
   ===================================================================== */
function reserver(d) {
  if (d.website) return { ok: true, reference: "—" }; // robot (champ piège rempli)

  // --- Vérifications
  var c = d.client || {}, ad = d.adresse || {}, cr = d.creneau || {};
  var vehicules = (d.vehicules || []).slice(0, 20);
  if (!vehicules.length) throw new Error("Aucun véhicule.");
  if (!c.prenom || !c.nom) throw new Error("Nom manquant.");
  if (String(c.telephone || "").replace(/\D/g, "").length < 10) throw new Error("Téléphone invalide.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email || "")) throw new Error("E-mail invalide.");
  if (!ad.rue || !ad.cp || !ad.ville) throw new Error("Adresse incomplète.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cr.date || "") || !/^\d{2}:\d{2}$/.test(cr.heure || "")) throw new Error("Créneau invalide.");

  var R = lireReglages();
  var duree = dureeTotale(vehicules, lireDurees());
  var debut = Utilities.parseDate(cr.date + " " + cr.heure, TZ, "yyyy-MM-dd HH:mm");
  var fin = new Date(debut.getTime() + duree * 60000);

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var ref, jeton, ev;
  try {
    // Le créneau est-il toujours libre ?
    var limite = Date.now() + Number(R.delai_minimum_heures) * 3600000;
    var adresseClient = ad.rue + ", " + ad.cp + " " + ad.ville;
    var possibles = creneauxPossibles(R, duree, Math.max(limite, debut.getTime() - 86400000), debut.getTime() + 86400000, adresseClient);
    if (possibles.indexOf(debut.getTime()) === -1) {
      return { ok: false, erreur: "creneau_indisponible", message: "Ce créneau n'est plus disponible." };
    }

    ref = "TN-" + Utilities.formatDate(new Date(), TZ, "yyMMdd") + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    jeton = Utilities.getUuid();
    var resume = resumeVehicules(vehicules);
    var adresse = ad.rue + ", " + ad.cp + " " + ad.ville;

    ev = agenda(R.agenda_rendezvous, "rendez-vous").createEvent(
      "⏳ À CONFIRMER — " + c.prenom + " " + c.nom + " (" + vehicules.length + " véh.)", debut, fin,
      { location: adresse, description: descriptionAgenda(ref, c, adresse, resume, d, jeton) });
    ev.setColor(CalendarApp.EventColor.YELLOW);

    feuille(FEUILLE_RESA).appendRow([
      // Date et heures stockées en texte (évite les conversions automatiques de Sheets)
      ref, new Date(), STATUT.ATTENTE, "'" + cr.date, "'" + cr.heure, "'" + Utilities.formatDate(fin, TZ, "HH:mm"), duree,
      c.prenom, c.nom, "'" + c.telephone, c.email, ad.rue, "'" + ad.cp, ad.ville,
      resume.join("\n"), vehicules.length, (d.estimation && d.estimation.texte) || "", d.remarques || "", ev.getId(), jeton,
    ]);
  } finally {
    lock.releaseLock();
  }

  // --- Notifications (hors verrou)
  var resa = lireReservation(ref);
  try { notifierQuentin(R, resa); } catch (err) { console.error("Notification Quentin : " + err); }
  try { envoyerSms(R, "Tout'Net : nouvelle demande " + resa.prenom + " " + resa.nom + " le " + dateFr(resa.date) + " à " + resa.heure + " (" + resa.ville + "). Voir vos e-mails pour accepter."); } catch (err) { console.error("SMS : " + err); }
  try { emailClient(R, resa, "recue"); } catch (err) { console.error("E-mail client : " + err); }

  return { ok: true, reference: ref };
}

/* =====================================================================
   ACCEPTER / REFUSER
   ===================================================================== */
function pageDecision(p) {
  var resa = lireReservation(p.ref);
  if (!resa || resa.jeton !== p.jeton) return page("Lien invalide", "<p>Cette demande est introuvable ou le lien n'est pas valide.</p>");
  var choix = p.choix === "refuser" ? "refuser" : "accepter";

  if (resa.statut !== STATUT.ATTENTE) {
    return page("Déjà traitée", "<p>Cette demande a déjà été traitée : <strong>" + esc(resa.statut) + "</strong>.</p>" + blocResa(resa));
  }
  if (p.confirmer !== "1") {
    var url = urlDecisionScript(resa, choix) + "&confirmer=1";
    var couleur = choix === "accepter" ? "#12a150" : "#d92d20";
    var texte = choix === "accepter" ? "✅ Confirmer l'acceptation" : "❌ Confirmer le refus";
    return page(choix === "accepter" ? "Accepter ce rendez-vous ?" : "Refuser ce rendez-vous ?",
      blocResa(resa) + '<p style="margin-top:24px"><a target="_top" href="' + esc(url) + '" style="' + styleBouton(couleur) + '">' + texte + "</a></p>" +
      (choix === "refuser" ? "<p style=\"color:#5b6b8c;font-size:14px\">Le créneau sera libéré et le client prévenu par e-mail.</p>" : "<p style=\"color:#5b6b8c;font-size:14px\">Le client recevra un e-mail de confirmation.</p>"));
  }
  appliquerDecision(resa, choix);
  return page(choix === "accepter" ? "Rendez-vous confirmé ✅" : "Demande refusée",
    "<p>" + (choix === "accepter" ? "Le client a été prévenu par e-mail. Le rendez-vous apparaît en vert dans l'agenda." : "Le créneau est libéré et le client a été prévenu par e-mail.") + "</p>" + blocResa(resa));
}

/* Résumé d'une demande pour la page de décision du site (jeton obligatoire). */
function infoDemande(p) {
  var resa = lireReservation(p.ref);
  if (!resa || !p.jeton || resa.jeton !== p.jeton) return { ok: false, erreur: "lien_invalide", message: "Demande introuvable ou lien invalide." };
  return { ok: true, demande: {
    reference: resa.reference, statut: resa.statut, date: dateFr(resa.date), heure: resa.heure, fin: resa.fin,
    client: resa.prenom + " " + resa.nom, telephone: resa.telephone, email: resa.email,
    adresse: resa.rue + ", " + resa.cp + " " + resa.ville, vehicules: resa.vehicules,
    estimation: resa.estimation || "", remarques: resa.remarques || "",
  } };
}
function decider(p) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var resa = lireReservation(p.ref);
    if (!resa || !p.jeton || resa.jeton !== p.jeton) return { ok: false, erreur: "lien_invalide", message: "Demande introuvable ou lien invalide." };
    if (resa.statut !== STATUT.ATTENTE) return { ok: false, erreur: "deja_traitee", statut: resa.statut, message: "Demande déjà traitée : " + resa.statut + "." };
    var choix = p.choix === "refuser" ? "refuser" : "accepter";
    var message = String(p.message || "").trim().slice(0, 2000);   // mot personnel de Quentin (facultatif)
    appliquerDecision(resa, choix, message);
    return { ok: true, statut: resa.statut };
  } finally {
    lock.releaseLock();
  }
}

function appliquerDecision(resa, choix, message) {
  var R = lireReglages();
  var cal = agenda(R.agenda_rendezvous, "rendez-vous");
  var ev = null;
  try { ev = cal.getEventById(resa.idAgenda); } catch (e) {}
  var sh = feuille(FEUILLE_RESA);
  if (choix === "accepter") {
    if (ev) { ev.setTitle("✅ " + resa.prenom + " " + resa.nom + " (" + resa.nbVehicules + " véh.)"); ev.setColor(CalendarApp.EventColor.GREEN); }
    sh.getRange(resa.ligne, COL["Statut"]).setValue(STATUT.CONFIRMEE);
    resa.statut = STATUT.CONFIRMEE;
    emailClient(R, resa, "confirmee", message);
  } else {
    if (ev) ev.deleteEvent();
    sh.getRange(resa.ligne, COL["Statut"]).setValue(STATUT.REFUSEE);
    resa.statut = STATUT.REFUSEE;
    emailClient(R, resa, "refusee", message);
  }
}

/* Message d'un client quand aucun créneau n'est disponible en ligne */
function envoyerMessage(d) {
  if (d.website) return { ok: true };                                 // robot (champ piège rempli)
  var prenom = String(d.prenom || "").trim().slice(0, 80);
  var tel = String(d.telephone || "").trim().slice(0, 30);
  var email = String(d.email || "").trim().slice(0, 120);
  var texte = String(d.message || "").trim().slice(0, 3000);
  if (!prenom) throw new Error("Prénom manquant.");
  if (tel.replace(/\D/g, "").length < 10 && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new Error("Indiquez un téléphone ou un e-mail.");
  if (!texte) throw new Error("Message vide.");
  var R = lireReglages();
  var to = R.email_notification || Session.getEffectiveUser().getEmail();
  var ligne = function (k, v) { return v ? '<tr><td style="padding:6px 12px 6px 0;color:#5b6b8c;vertical-align:top">' + k + '</td><td style="padding:6px 0;font-weight:600">' + v + "</td></tr>" : ""; };
  var html = gabarit("Message d'un client (pas de créneau disponible)",
    "<p>Un client n'a trouvé aucun créneau disponible sur le site et vous a laissé ce message :</p>" +
    '<div style="margin:12px 0;padding:14px 16px;background:#eef4fe;border-radius:10px;white-space:pre-line">' + esc(texte) + "</div>" +
    '<table style="border-collapse:collapse;font-size:15px">' +
      ligne("Prénom", esc(prenom)) +
      ligne("Téléphone", tel ? '<a href="tel:' + esc(tel.replace(/\s/g, "")) + '">' + esc(tel) + "</a>" : "") +
      ligne("E-mail", esc(email)) +
      ligne("Formule", esc(d.formule || "")) +
      ligne("Adresse", esc(d.adresse || "")) +
    "</table><p style=\"color:#5b6b8c;font-size:13px\">Pensez à ajouter des disponibilités dans l'agenda « Tout'Net — Disponibilités ».</p>");
  var opts = { to: to, subject: "📩 Message de " + prenom + " — aucun créneau disponible", htmlBody: html, name: R.nom_entreprise || "Tout'Net" };
  if (email) opts.replyTo = email;
  MailApp.sendEmail(opts);
  try { envoyerSms(R, "Tout'Net : " + prenom + " vous a laissé un message (aucun créneau dispo). Voir vos e-mails."); } catch (e) {}
  return { ok: true };
}

/* Menu dans la feuille : accepter / refuser la ligne sélectionnée */
function onOpen() {
  SpreadsheetApp.getUi().createMenu("Tout'Net")
    .addItem("✅ Accepter la réservation sélectionnée", "menuAccepter")
    .addItem("❌ Refuser la réservation sélectionnée", "menuRefuser")
    .addSeparator()
    .addItem("Installer / réparer", "installer")
    .addItem("Envoyer un e-mail de test", "testerNotification")
    .addToUi();
}
function menuAccepter() { menuDecision("accepter"); }
function menuRefuser() { menuDecision("refuser"); }
function menuDecision(choix) {
  var ui = SpreadsheetApp.getUi();
  var sh = SpreadsheetApp.getActiveSheet();
  var ligne = sh.getActiveRange().getRow();
  if (sh.getName() !== FEUILLE_RESA || ligne < 2) return ui.alert("Sélectionnez une ligne de l'onglet « " + FEUILLE_RESA + " ».");
  var resa = lireReservation(sh.getRange(ligne, COL["Référence"]).getValue());
  if (!resa) return ui.alert("Réservation introuvable.");
  if (resa.statut !== STATUT.ATTENTE) return ui.alert("Déjà traitée : " + resa.statut);
  var ok = ui.alert((choix === "accepter" ? "Accepter" : "Refuser") + " la réservation de " + resa.prenom + " " + resa.nom + " le " + dateFr(resa.date) + " à " + resa.heure + " ?", ui.ButtonSet.YES_NO);
  if (ok === ui.Button.YES) { appliquerDecision(resa, choix); ui.alert("C'est fait. Le client a été prévenu par e-mail."); }
}

/* =====================================================================
   NOTIFICATIONS
   ===================================================================== */
function notifierQuentin(R, resa) {
  var to = R.email_notification || Session.getEffectiveUser().getEmail();
  var html = gabarit("Nouvelle demande de réservation",
    "<p><strong>" + esc(resa.prenom + " " + resa.nom) + "</strong> souhaite un rendez-vous :</p>" + blocResa(resa, true) +
    '<p style="margin:26px 0 8px">' +
      '<a href="' + esc(urlDecision(resa, "accepter")) + '" style="' + styleBouton("#12a150") + '">✅ Accepter</a> &nbsp; ' +
      '<a href="' + esc(urlDecision(resa, "refuser")) + '" style="' + styleBouton("#d92d20") + '">❌ Refuser</a></p>' +
    '<p style="color:#5b6b8c;font-size:13px">Le créneau est bloqué dans votre agenda (en jaune) en attendant votre réponse. Répondez à cet e-mail pour écrire directement au client.</p>');
  MailApp.sendEmail({ to: to, subject: "🧽 Nouvelle demande — " + resa.prenom + " " + resa.nom + " — " + dateFr(resa.date) + " " + resa.heure,
    htmlBody: html, name: R.nom_entreprise || "Tout'Net", replyTo: resa.email });
}

function emailClient(R, resa, type, message) {
  var nom = R.nom_entreprise || "Tout'Net";
  var site = String(R.site_web || SITE_DEFAUT);
  var contact = (R.telephone_entreprise ? "au " + esc(R.telephone_entreprise) : "") ;
  var titres = {
    recue: ["Votre demande a bien été reçue", "Bonjour " + esc(resa.prenom) + ",</p><p>Merci pour votre demande ! Votre créneau est réservé <strong>en attente de confirmation</strong>. Vous recevrez un e-mail dès qu'il sera validé."],
    confirmee: ["Votre rendez-vous est confirmé ✅", "Bonjour " + esc(resa.prenom) + ",</p><p>Bonne nouvelle : votre rendez-vous est <strong>confirmé</strong>. À bientôt !"],
    refusee: ["Votre créneau n'a pas pu être retenu", "Bonjour " + esc(resa.prenom) + ",</p><p>Le créneau du " + esc(dateFr(resa.date)) + " à " + esc(resa.heure) + " n'a malheureusement pas pu être retenu." +
      (message ? "" : " N'hésitez pas à choisir un autre créneau sur <a href=\"" + esc(site) + "#reserver\">notre site</a> ou à nous contacter" + (contact ? " " + contact : "") + ".")],
  };
  var t = titres[type];
  // Message personnel de Quentin, ajouté tel quel (texte simple)
  var mot = message ? '<div style="margin:18px 0;padding:14px 16px;background:#eef4fe;border-left:4px solid #1e6be6;border-radius:0 10px 10px 0">' +
    '<div style="font-size:13px;font-weight:bold;color:#1e6be6;margin-bottom:6px">Message de Quentin</div>' +
    '<div style="white-space:pre-line">' + esc(message) + "</div></div>" : "";
  if (type === "refusee" && message) mot += '<p>Vous pouvez aussi choisir un autre créneau sur <a href="' + esc(site) + '#reserver">notre site</a>.</p>';
  var html = gabarit(t[0], "<p>" + t[1] + "</p>" + mot + (type === "refusee" ? "" : blocResa(resa)) +
    "<p>Une question ? Répondez simplement à cet e-mail" + (contact ? " ou appelez-nous " + contact : "") + ".</p><p>L'équipe " + esc(nom) + "</p>");
  MailApp.sendEmail({ to: resa.email, subject: nom + " — " + t[0], htmlBody: html, name: nom,
    replyTo: R.email_notification || Session.getEffectiveUser().getEmail() });
}

function envoyerSms(R, texte) {
  if (!R.free_sms_user || !R.free_sms_pass) return;
  UrlFetchApp.fetch("https://smsapi.free-mobile.fr/sendmsg?user=" + encodeURIComponent(R.free_sms_user) +
    "&pass=" + encodeURIComponent(R.free_sms_pass) + "&msg=" + encodeURIComponent(texte), { muteHttpExceptions: true });
}

function testerNotification() {
  var R = lireReglages();
  var to = R.email_notification || Session.getEffectiveUser().getEmail();
  MailApp.sendEmail({ to: to, subject: "Tout'Net — test de notification", htmlBody: gabarit("Test réussi", "<p>Les notifications de réservation arriveront à cette adresse.</p>"), name: R.nom_entreprise || "Tout'Net" });
  envoyerSms(R, "Tout'Net : test de notification SMS réussi.");
  SpreadsheetApp.getUi().alert("E-mail de test envoyé à " + to + (R.free_sms_user ? " (et SMS)." : "."));
}

/* =====================================================================
   INSTALLATION (à lancer une fois depuis l'éditeur ou le menu)
   ===================================================================== */
function installer() {
  var ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone(TZ);

  var resa = ss.getSheetByName(FEUILLE_RESA) || ss.insertSheet(FEUILLE_RESA, 0);
  if (resa.getLastRow() === 0) {
    resa.appendRow(COLONNES);
    resa.getRange(1, 1, 1, COLONNES.length).setFontWeight("bold").setBackground("#0e2a5c").setFontColor("#ffffff");
    resa.setFrozenRows(1);
    resa.hideColumns(COL["Jeton"]);
    resa.hideColumns(COL["ID agenda"]);
  }

  var reg = ss.getSheetByName(FEUILLE_REGLAGES) || ss.insertSheet(FEUILLE_REGLAGES);
  if (reg.getLastRow() === 0) {
    reg.appendRow(["Réglage", "Valeur", "Explication"]);
    reg.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#ffd21f");
    REGLAGES_DEFAUT.forEach(function (r) { reg.appendRow(r); });
    reg.setFrozenRows(1);
    reg.autoResizeColumns(1, 3);
  } else {
    // Ajoute les réglages manquants (mise à jour du script)
    var existants = lireReglages();
    REGLAGES_DEFAUT.forEach(function (r) { if (!(r[0] in existants)) reg.appendRow(r); });
  }

  var dur = ss.getSheetByName(FEUILLE_DUREES) || ss.insertSheet(FEUILLE_DUREES);
  if (dur.getLastRow() === 0) {
    dur.appendRow(["Clé (ne pas modifier)", "Description", "Minutes"]);
    dur.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#ffd21f");
    VEHICULES.forEach(function (v) {
      FORMULES.forEach(function (f) { var k = v[0] + "|" + f[0]; dur.appendRow([k, v[1] + " · " + f[1], DUREES_DEFAUT[k]]); });
    });
    OPTIONS.forEach(function (o) { var k = "option|" + o[0]; dur.appendRow([k, "Option : " + o[1] + " (temps en plus)", DUREES_DEFAUT[k] || 0]); });
    dur.getRange("E1").setValue("Quentin : ajuste la colonne « Minutes » si besoin.").setFontWeight("bold").setFontColor("#d92d20");
    dur.setFrozenRows(1);
    dur.autoResizeColumns(1, 3);
  }

  var R = lireReglages();
  if (!R.agenda_disponibilites || !safeCal(R.agenda_disponibilites)) {
    var c1 = CalendarApp.createCalendar("Tout'Net — Disponibilités", { color: CalendarApp.Color.BLUE, summary: "Créez ici vos plages de disponibilité (ex. samedi 9h–18h)." });
    ecrireReglage("agenda_disponibilites", c1.getId());
  }
  if (!R.agenda_rendezvous || !safeCal(R.agenda_rendezvous)) {
    var c2 = CalendarApp.createCalendar("Tout'Net — Rendez-vous", { color: CalendarApp.Color.GREEN, summary: "Rendez-vous clients (créés automatiquement par le site)." });
    ecrireReglage("agenda_rendezvous", c2.getId());
  }
  if (!R.email_notification) ecrireReglage("email_notification", Session.getEffectiveUser().getEmail());

  // Message non bloquant (une alerte attendrait un clic dans la feuille quand on lance depuis l'éditeur)
  console.log("Installation terminée : onglets Réservations / Réglages / Durées et deux agendas Tout'Net créés.");
  try { ss.toast("Deux agendas « Tout'Net » ont été créés dans Google Agenda. Étape suivante : déployer l'application Web.", "Installation terminée ✅", 15); } catch (e) {}
}

/* =====================================================================
   OUTILS
   ===================================================================== */
function feuille(nom) {
  var sh = SpreadsheetApp.getActive().getSheetByName(nom);
  if (!sh) throw new Error("Onglet « " + nom + " » introuvable : lancez Tout'Net > Installer.");
  return sh;
}
function lireReglages() {
  var vals = feuille(FEUILLE_REGLAGES).getDataRange().getValues(), r = {};
  for (var i = 1; i < vals.length; i++) if (vals[i][0]) r[String(vals[i][0]).trim()] = typeof vals[i][1] === "string" ? vals[i][1].trim() : vals[i][1];
  return r;
}
function ecrireReglage(cle, valeur) {
  var sh = feuille(FEUILLE_REGLAGES), vals = sh.getDataRange().getValues();
  for (var i = 1; i < vals.length; i++) if (vals[i][0] === cle) { sh.getRange(i + 1, 2).setValue(valeur); return; }
  sh.appendRow([cle, valeur, ""]);
}
function lireDurees() {
  var vals = feuille(FEUILLE_DUREES).getDataRange().getValues(), d = {};
  for (var i = 1; i < vals.length; i++) if (vals[i][0] && vals[i][2] !== "") d[String(vals[i][0]).trim()] = Number(vals[i][2]);
  return d;
}
function dureeTotale(vehicules, D) {
  if (!vehicules || !vehicules.length) throw new Error("Aucun véhicule.");
  var total = 0;
  vehicules.forEach(function (v) {
    var d = D[v.type + "|" + v.formule];
    if (typeof d !== "number" || isNaN(d)) throw new Error("Durée inconnue pour " + v.type + " / " + v.formule + " (onglet Durées).");
    total += d;
    (v.options || []).forEach(function (o) { total += D["option|" + o] || 0; });
    if (v.niveau) total += D["etat|" + v.niveau] || 0;
  });
  return total;
}
/* Temps de trajet en voiture (minutes) entre deux adresses, via Google Maps.
   Résultat mis en cache 6 h. Renvoie null si l'itinéraire est introuvable. */
function tempsTrajet(a, b) {
  if (!a || !b) return null;
  var norm = function (x) { return String(x).toLowerCase().replace(/\s+/g, " ").trim(); };
  var cle = "trajet:" + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, [norm(a), norm(b)].sort().join("|")));
  var cache = CacheService.getScriptCache();
  var c = cache.get(cle);
  if (c !== null) return c === "" ? null : Number(c);
  var min = null;
  try {
    var r = Maps.newDirectionFinder().setOrigin(a).setDestination(b).setMode(Maps.DirectionFinder.Mode.DRIVING).getDirections();
    if (r && r.routes && r.routes.length) min = Math.ceil(r.routes[0].legs[0].duration.value / 60 / 5) * 5;
  } catch (e) { console.error("Trajet : " + e); }
  cache.put(cle, min == null ? "" : String(min), 21600);
  return min;
}

function agenda(id, nom) {
  var cal = id ? safeCal(id) : null;
  if (!cal) throw new Error("Agenda " + nom + " introuvable : lancez Tout'Net > Installer.");
  return cal;
}
function safeCal(id) { try { return CalendarApp.getCalendarById(id); } catch (e) { return null; } }

function lireReservation(ref) {
  if (!ref) return null;
  var sh = feuille(FEUILLE_RESA), vals = sh.getDataRange().getValues();
  for (var i = 1; i < vals.length; i++) {
    if (vals[i][0] === ref) {
      var v = vals[i], g = function (c) { return v[COL[c] - 1]; };
      var date = g("Date") instanceof Date ? Utilities.formatDate(g("Date"), TZ, "yyyy-MM-dd") : String(g("Date"));
      var hh = function (x) { return x instanceof Date ? Utilities.formatDate(x, TZ, "HH:mm") : String(x); };
      return {
        ligne: i + 1, reference: ref, statut: g("Statut"), date: date, heure: hh(g("Début")), fin: hh(g("Fin")), duree: g("Durée (min)"),
        prenom: g("Prénom"), nom: g("Nom"), telephone: String(g("Téléphone")), email: g("E-mail"),
        rue: g("Adresse"), cp: String(g("Code postal")), ville: g("Ville"), vehicules: String(g("Véhicules")),
        nbVehicules: g("Nb véhicules"), estimation: g("Estimation"), remarques: g("Précisions"), idAgenda: g("ID agenda"), jeton: g("Jeton"),
      };
    }
  }
  return null;
}

function resumeVehicules(vehicules) {
  return vehicules.map(function (v, i) {
    if (v.resume) return "Véhicule " + (i + 1) + " : " + v.resume;
    return "Véhicule " + (i + 1) + " : " + (v.typeNom || v.type) + " — " + (v.formuleNom || v.formule) +
      (v.niveauNom ? " — état : " + v.niveauNom : "") +
      ((v.optionsNoms && v.optionsNoms.length) ? " — options : " + v.optionsNoms.join(", ") : "");
  });
}
function descriptionAgenda(ref, c, adresse, resume, d, jeton) {
  return ["Référence : " + ref, "Client : " + c.prenom + " " + c.nom, "Téléphone : " + c.telephone, "E-mail : " + c.email,
    "Adresse : " + adresse, "", resume.join("\n"), "", "Estimation : " + ((d.estimation && d.estimation.texte) || "—"),
    d.remarques ? "Précisions : " + d.remarques : ""].join("\n");
}
/* Lien des boutons Accepter / Refuser : une page du site Tout'Net qui
   appelle ce service sans passer par le compte Google du navigateur
   (une page Google échoue quand plusieurs comptes Google sont connectés). */
function urlDecision(resa, choix) {
  var base = String(lireReglages().site_web || SITE_DEFAUT).trim();
  if (base.slice(-1) !== "/") base += "/";
  return base + "decision.html?ref=" + encodeURIComponent(resa.reference) +
    "&jeton=" + encodeURIComponent(resa.jeton) + "&choix=" + choix;
}
/* Ancienne page Google (secours) */
function urlDecisionScript(resa, choix) {
  return ScriptApp.getService().getUrl() + "?action=decision&ref=" + encodeURIComponent(resa.reference) +
    "&jeton=" + encodeURIComponent(resa.jeton) + "&choix=" + choix;
}
function dateFr(iso) {
  var d = Utilities.parseDate(iso + " 12:00", TZ, "yyyy-MM-dd HH:mm");
  var jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var j = Number(Utilities.formatDate(d, TZ, "u")) % 7;
  return jours[j] + " " + Number(Utilities.formatDate(d, TZ, "d")) + " " + mois[Number(Utilities.formatDate(d, TZ, "M")) - 1];
}
function blocResa(r, pourQuentin) {
  var adresse = r.rue + ", " + r.cp + " " + r.ville;
  var maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(adresse);
  var ligne = function (k, v) { return '<tr><td style="padding:6px 12px 6px 0;color:#5b6b8c;vertical-align:top;white-space:nowrap">' + k + '</td><td style="padding:6px 0;font-weight:600">' + v + "</td></tr>"; };
  return '<table style="border-collapse:collapse;font-size:15px;margin:8px 0">' +
    ligne("Référence", esc(r.reference)) +
    ligne("Date", esc(dateFr(r.date)) + " à " + esc(r.heure) + (r.fin ? " (fin estimée " + esc(r.fin) + ")" : "")) +
    ligne("Adresse", pourQuentin ? '<a href="' + maps + '">' + esc(adresse) + "</a>" : esc(adresse)) +
    ligne("Véhicules", esc(r.vehicules).replace(/\n/g, "<br>")) +
    ligne("Estimation", esc(r.estimation || "—")) +
    (pourQuentin ? ligne("Téléphone", '<a href="tel:' + esc(String(r.telephone).replace(/\s/g, "")) + '">' + esc(r.telephone) + "</a>") + ligne("E-mail", esc(r.email)) : "") +
    (r.remarques ? ligne("Précisions", esc(r.remarques)) : "") +
    "</table>";
}
function gabarit(titre, corps) {
  return '<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#0e2a5c">' +
    '<div style="background:#1e6be6;color:#fff;padding:20px 24px;border-radius:14px 14px 0 0"><div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#ffd21f;font-weight:bold">Tout\'Net</div>' +
    '<div style="font-size:21px;font-weight:bold;margin-top:4px">' + esc(titre) + "</div></div>" +
    '<div style="border:1px solid #d9e3f5;border-top:0;padding:20px 24px;border-radius:0 0 14px 14px;line-height:1.5">' + corps + "</div></div>";
}
function styleBouton(couleur) {
  return "display:inline-block;background:" + couleur + ";color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px;font-family:Arial,sans-serif";
}
function page(titre, corps) {
  return HtmlService.createHtmlOutput(gabarit(titre, corps).replace('max-width:600px;margin:0 auto', 'max-width:600px;margin:24px auto;padding:0 12px'))
    .setTitle("Tout'Net — " + titre).addMetaTag("viewport", "width=device-width, initial-scale=1");
}
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
