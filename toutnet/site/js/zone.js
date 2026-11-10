/* =====================================================================
   TOUT'NET — ZONE D'INTERVENTION
   Carte Leaflet (hébergée dans vendor/leaflet), fond OpenStreetMap.
   La zone est une seule forme qui englobe le cercle autour du point de
   départ et les cercles des « extensions » (ex. Lacaune).
   Réglages : SITE_CONFIG.zone (js/config.js).
   La carte n'est chargée que lorsque la section approche de l'écran.
   ===================================================================== */
(function () {
  "use strict";

  var Site = window.Site;
  var C = window.SITE_CONFIG || {};
  var Z = C.zone;
  var section = document.getElementById("zone");
  if (!Site || !Z || !section) return;
  var el = Site.el;
  var TEL = (C.contact || {}).telephoneAffiche || "";

  /* ---------- Textes ---------- */
  var noms = [Z.centre.nom].concat((Z.villes || []).map(function (v) { return v.nom; }))
    .filter(function (n, i, a) { return a.indexOf(n) === i; });
  function liste(a) { return a.length > 1 ? a.slice(0, -1).join(", ") + " et " + a[a.length - 1] : a.join(""); }

  section.querySelector("[data-zone-intro]").textContent =
    "Quentin est basé à " + Z.centre.nom + " et se déplace à l'adresse de votre choix entre " +
    liste((Z.villes || []).map(function (v) { return v.nom; })) + ", ainsi que dans les communes alentour.";
  section.querySelector("[data-zone-legende]").textContent = "Zone colorée : secteur d'intervention habituel (indicatif).";

  var box = section.querySelector("[data-zone-communes]");
  box.appendChild(el("p", { class: "zone__villes-titre", text: "Villes principales" }));
  box.appendChild(el("ul", { class: "zone__villes" }, noms.map(function (n) { return el("li", { text: n }); })
    .concat([el("li", { class: "zone__villes-plus", text: "et alentours" })])));

  var note = section.querySelector("[data-zone-note]");
  note.appendChild(document.createTextNode("Vous êtes à la limite de la zone ? "));
  if (TEL) {
    note.appendChild(document.createTextNode("Appelez Quentin au "));
    note.appendChild(el("a", { href: "tel:+" + String((C.contact || {}).telephone || "").replace(/\D/g, ""), text: TEL }));
    note.appendChild(document.createTextNode(" pour vérifier."));
  }

  /* ---------- Forme de la zone : enveloppe de plusieurs cercles ---------- */
  function enveloppe(cercles) {
    var lat0 = Z.centre.lat * Math.PI / 180, kx = 111.32 * Math.cos(lat0), ky = 110.57; // km par degré
    var pts = [];
    cercles.forEach(function (c) {
      for (var i = 0; i < 120; i++) {
        var a = (i / 120) * 2 * Math.PI;
        pts.push([c.lng * kx + c.r * Math.cos(a), c.lat * ky + c.r * Math.sin(a)]);
      }
    });
    // enveloppe convexe (chaîne monotone)
    pts.sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; });
    function cross(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var bas = [], haut = [];
    pts.forEach(function (p) { while (bas.length >= 2 && cross(bas[bas.length - 2], bas[bas.length - 1], p) <= 0) bas.pop(); bas.push(p); });
    pts.slice().reverse().forEach(function (p) { while (haut.length >= 2 && cross(haut[haut.length - 2], haut[haut.length - 1], p) <= 0) haut.pop(); haut.push(p); });
    return bas.slice(0, -1).concat(haut.slice(0, -1)).map(function (p) { return [p[1] / ky, p[0] / kx]; });
  }

  /* ---------- Chargement de Leaflet à la demande ---------- */
  function charger(cb) {
    if (window.L) return cb();
    var css = document.createElement("link");
    css.rel = "stylesheet"; css.href = "vendor/leaflet/leaflet.css";
    document.head.appendChild(css);
    var js = document.createElement("script");
    js.src = "vendor/leaflet/leaflet.js";
    js.onload = cb;
    js.onerror = function () { section.querySelector(".zone__map").classList.add("zone__map--erreur"); };
    document.head.appendChild(js);
  }

  function dessiner() {
    var L = window.L;
    var map = L.map("zone-carte", {
      scrollWheelZoom: false,        // ne bloque pas le défilement de la page
      dragging: !L.Browser.mobile,   // sur téléphone : un doigt fait défiler la page, deux doigts zooment
      tap: false,
      zoomSnap: 0.25,
    });
    // Fond de carte OpenStreetMap (gratuit, sans clé) — attribution obligatoire
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributeurs OpenStreetMap</a>',
    }).addTo(map);

    var cercles = [{ lat: Z.centre.lat, lng: Z.centre.lng, r: Z.rayonKm }].concat(
      (Z.extensions || []).map(function (e) { return { lat: e.lat, lng: e.lng, r: e.rayonKm }; }));
    var forme = enveloppe(cercles);
    var cadre = L.latLngBounds(forme);
    map.fitBounds(cadre, { padding: [14, 14] });   // la carte doit être positionnée avant d'y ajouter des formes

    L.polygon(forme, { color: "#1e6be6", weight: 2.5, fillColor: "#1e6be6", fillOpacity: 0.12, smoothFactor: 0.5 }).addTo(map);

    var centre = [Z.centre.lat, Z.centre.lng];
    // Petite carte (téléphone) : étiquettes plus courtes et placées au-dessus / en dessous des points
    var petit = document.getElementById("zone-carte").clientWidth < 600;
    var cls = "zone-label" + (petit ? " zone-label--petit" : "");
    L.marker(centre, {
      icon: L.divIcon({ className: "zone-pin", html: "<span></span>", iconSize: [26, 26], iconAnchor: [13, 13] }),
      keyboard: false, title: Z.centre.nom,
    }).addTo(map).bindTooltip(petit ? Z.centre.nom : Z.centre.nom + " · point de départ", { permanent: true, direction: petit ? "right" : "top", offset: petit ? [14, 0] : [0, -12], className: cls + " zone-label--base" });

    (Z.villes || []).forEach(function (v) {
      var est = v.lng >= Z.centre.lng;   // étiquette tournée vers le centre, pour rester dans la carte
      var dir = est ? "left" : "right", off = [est ? -8 : 8, 0];
      if (petit) {
        dir = v.etiquetteMobile || (v.lat >= Z.centre.lat ? "top" : "bottom");
        off = { top: [0, -6], bottom: [0, 6], left: [-6, 0], right: [6, 0] }[dir];
      }
      L.circleMarker([v.lat, v.lng], { radius: petit ? 5 : 6, color: "#ffffff", weight: 2, fillColor: "#0e2a5c", fillOpacity: 1 })
        .addTo(map).bindTooltip(v.nom, { permanent: true, direction: dir, offset: off, className: cls });
    });

    function cadrer() { map.fitBounds(cadre, { padding: [14, 14] }); }
    window.addEventListener("resize", function () { map.invalidateSize(); cadrer(); });
  }

  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { obs.disconnect(); charger(dessiner); }
    }, { rootMargin: "400px 0px" });
    obs.observe(section);
  } else {
    charger(dessiner);
  }
})();
