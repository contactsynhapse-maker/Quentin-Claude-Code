/* =====================================================================
   TOUT'NET — ZONE D'INTERVENTION
   Carte Leaflet (hébergée dans vendor/leaflet), fond OpenStreetMap, avec un cercle autour du
   point de départ de Quentin. Réglages : SITE_CONFIG.zone (js/config.js).
   La carte n'est chargée que lorsque la section approche de l'écran.
   ===================================================================== */
(function () {
  "use strict";

  var Site = window.Site;
  var Z = (window.SITE_CONFIG || {}).zone;
  var section = document.getElementById("zone");
  if (!Site || !Z || !section) return;
  var el = Site.el;
  var TEL = ((window.SITE_CONFIG || {}).contact || {}).telephoneAffiche || "";

  /* ---------- Textes et liste des communes ---------- */
  var villes = (Z.villes || []).map(function (v) { return v.nom; });
  section.querySelector("[data-zone-intro]").textContent =
    "Quentin est basé à " + Z.centre.nom + " et se déplace à l'adresse de votre choix dans un rayon d'environ " +
    Z.rayonKm + " km : " + villes.join(", ").replace(/, ([^,]*)$/, " et $1") + ", et toutes les communes situées entre ces villes.";
  section.querySelector("[data-zone-legende]").textContent = "Rayon d'environ " + Z.rayonKm + " km autour de " + Z.centre.nom + ".";

  var box = section.querySelector("[data-zone-communes]");
  (Z.communes || []).forEach(function (g) {
    box.appendChild(el("div", { class: "zone__group" }, [
      el("h3", { text: g.departement }),
      el("ul", null, g.liste.map(function (c) { return el("li", { text: c }); })),
    ]));
  });

  var note = section.querySelector("[data-zone-note]");
  note.appendChild(document.createTextNode("Liste indicative : toutes les communes à l'intérieur du cercle sont desservies. Vous êtes à la limite de la zone ? "));
  if (TEL) {
    note.appendChild(document.createTextNode("Appelez Quentin au "));
    note.appendChild(el("a", { href: "tel:+" + String((window.SITE_CONFIG.contact || {}).telephone || "").replace(/\D/g, ""), text: TEL }));
    note.appendChild(document.createTextNode(" pour vérifier."));
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
    var mobile = L.Browser.mobile;
    var map = L.map("zone-carte", {
      scrollWheelZoom: false,     // ne bloque pas le défilement de la page
      dragging: !mobile,          // sur téléphone : un doigt fait défiler la page, deux doigts zooment
      tap: false,
      zoomSnap: 0.25,
    });
    // Fond de carte OpenStreetMap (gratuit, sans clé) — attribution obligatoire
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributeurs OpenStreetMap</a>',
    }).addTo(map);

    var centre = [Z.centre.lat, Z.centre.lng];
    // Cadre de départ : le carré qui contient le cercle (la carte doit être positionnée avant d'y ajouter des formes)
    var cadre = L.latLng(centre).toBounds(Z.rayonKm * 2000);
    map.fitBounds(cadre, { padding: [12, 12] });
    L.circle(centre, {
      radius: Z.rayonKm * 1000, color: "#1e6be6", weight: 2.5, fillColor: "#1e6be6", fillOpacity: 0.12,
    }).addTo(map);

    L.marker(centre, {
      icon: L.divIcon({ className: "zone-pin", html: "<span></span>", iconSize: [26, 26], iconAnchor: [13, 13] }),
      keyboard: false, title: Z.centre.nom,
    }).addTo(map).bindTooltip(Z.centre.nom + " · point de départ", { permanent: true, direction: "top", offset: [0, -12], className: "zone-label zone-label--base" });

    (Z.villes || []).forEach(function (v) {
      L.circleMarker([v.lat, v.lng], { radius: 6, color: "#ffffff", weight: 2, fillColor: "#0e2a5c", fillOpacity: 1 })
        // étiquette côté centre, pour ne pas sortir de la carte
        .addTo(map).bindTooltip(v.nom, { permanent: true, direction: v.lng > Z.centre.lng ? "left" : "right", offset: [v.lng > Z.centre.lng ? -8 : 8, 0], className: "zone-label" });
    });

    function cadrer() { map.fitBounds(cadre, { padding: [12, 12] }); }
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
