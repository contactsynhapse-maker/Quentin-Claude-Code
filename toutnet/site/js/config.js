/* =====================================================================
   TOUT'NET — CONFIGURATION DU SITE
   ---------------------------------------------------------------------
   Tout le contenu du site est défini dans ce fichier : textes, tarifs,
   formules, options, packs, coordonnées, photos, réservation.

   Les informations proviennent du flyer « Formules Tout'Net ».
   Les éléments marqués  // À DÉFINIR  attendent une validation : tant
   qu'ils sont vides, le site les masque ou affiche un emplacement neutre.

   ⚠ Les prix sont des NOMBRES (90, pas "90 €"). Les identifiants `id`
   ne doivent pas être modifiés une fois la réservation en ligne active
   (ils servent au calcul des durées côté Google, onglet « Durées »).
   ===================================================================== */

window.SITE_CONFIG = {

  /* Soulignage en pointillés des contenus encore provisoires.
     Passer à `false` quand tout sera rempli. */
  afficherReperes: true,

  /* ------------------------------------------------------------------
     IDENTITÉ
     ------------------------------------------------------------------ */
  identite: {
    nom: "Tout'Net",
    logo: "assets/logo-embleme.png",
    logoComplet: "assets/logo.png",
    badge: "Nettoyage de véhicules · Mobile",
    accroche: "Service de nettoyage",
    sousAccroche: "Un intérieur de véhicule impeccable, sans vous déplacer.",
    slogan: "Tout'Net reste à votre service, car ce qui compte, c'est la propreté.",
  },

  /* ------------------------------------------------------------------
     COORDONNÉES
     Téléphone / WhatsApp : format international sans espaces ni « + ».
     Chaque moyen renseigné génère automatiquement un bouton.
     ------------------------------------------------------------------ */
  contact: {
    telephone: "33647590673",
    telephoneAffiche: "06 47 59 06 73",
    whatsapp: "33647590673",  // À CONFIRMER — même numéro que le téléphone ?
    email: "tout.net81@gmail.com",
    instagram: "tout.net81",
    zone: "Toulouse, Albi, Castres et alentours",
    horaires: "",             // À DÉFINIR (facultatif)
  },

  /* ------------------------------------------------------------------
     PRÉSENTATION DU PRESTATAIRE
     Section masquée tant que `texte` est vide.
     ------------------------------------------------------------------ */
  presentation: {
    titre: "Qui suis-je ?",
    texte: "",   // À DÉFINIR — quelques lignes de présentation de Quentin
    photo: "",   // À DÉFINIR — ex. "assets/photos/quentin.jpg"
  },

  /* ------------------------------------------------------------------
     AVANTAGES (bandeau sous l'accueil)
     Icônes : mobile, formules, remise, calendrier, goutte, etoile
     ------------------------------------------------------------------ */
  avantages: [
    { icone: "mobile",     titre: "On vient à vous",      texte: "Service mobile : votre véhicule est nettoyé sans que vous ayez à vous déplacer." },
    { icone: "formules",   titre: "Deux formules",        texte: "De l'aspiration rapide au nettoyage complet par extraction." },
    { icone: "remise",     titre: "Tarifs dégressifs",    texte: "−10 % de 2 à 4 véhicules, −15 % à partir de 5." },
    { icone: "calendrier", titre: "Réservation en ligne", texte: "Composez votre formule et choisissez votre créneau en quelques clics." },
  ],

  /* ------------------------------------------------------------------
     TYPES DE VÉHICULES & PRIX (nets, TVA non applicable)
     prixMin / prixMax : fourchette affichée dans « Tarifs » (flyer).
     prix : prix de chaque formule pour ce véhicule, utilisé pour
            l'estimation. La différence s'affiche à côté de la formule.
            Règle de départ : formule 2 = prixMax − 20 € (le « très sale »
            à +20 € complète la fourchette). À VALIDER / AJUSTER.
     ------------------------------------------------------------------ */
  vehicules: [
    { id: "citadine",   nom: "Citadine",            prixMin: 90,  prixMax: 130, prix: { "formule-1": 90,  "formule-2": 110 } },
    { id: "break-suv",  nom: "Break · SUV",         prixMin: 90,  prixMax: 140, prix: { "formule-1": 90,  "formule-2": 120 } },
    { id: "7-places",   nom: "7 places (van)",      prixMin: 100, prixMax: 150, prix: { "formule-1": 100, "formule-2": 130 } },
    { id: "camion",     nom: "Camion",              prixMin: 100, prixMax: 150, prix: { "formule-1": 100, "formule-2": 130 } },
    { id: "utilitaire", nom: "Utilitaire",          prixMin: 100, prixMax: 150, prix: { "formule-1": 100, "formule-2": 130 }, note: "Prix en fonction du véhicule" },
    { id: "commercial", nom: "Véhicule commercial", prixMin: 90,  prixMax: 120, prix: { "formule-1": 90,  "formule-2": 100 }, note: "Prix variable selon la propreté" },
  ],

  /* ------------------------------------------------------------------
     FORMULES
     ------------------------------------------------------------------ */
  formules: [
    {
      id: "formule-1",
      etiquette: "Formule 1 · La plus rapide",
      nom: "Aspiration à sec",
      sousTitre: "Nettoyage simple, sans shampouineuse",
      inclus: ["Aspiration complète", "Dépoussiérage"],
    },
    {
      id: "formule-2",
      etiquette: "Formule 2 · La plus qualitative",
      nom: "Nettoyage complet par extraction",
      sousTitre: "Avec shampouineuse",
      inclus: ["Tout de la formule 1", "Shampouinage des sièges", "Nettoyage approfondi"],
      badge: "La plus complète · Recommandée",
      miseEnAvant: true,
    },
  ],

  /* ------------------------------------------------------------------
     OPTIONS (cases à cocher, par véhicule)
     `groupe` (facultatif) : une seule option du même groupe peut être cochée.
     ------------------------------------------------------------------ */
  options: [
    { id: "vehicule-tres-sale", nom: "Véhicule très sale", prix: 20, description: "Supplément indicatif, ajusté sur place selon l'état réel." },
    { id: "poils-animaux",      nom: "Poils d'animaux",    prix: 15, description: "Supplément pour les véhicules de nos compagnons à poils." },
  ],

  /* ------------------------------------------------------------------
     ÉTAT DU VÉHICULE — question séparée (non utilisée : l'état est
     proposé en option « Véhicule sale / très sale »).
     ------------------------------------------------------------------ */
  niveaux: [],

  /* ESTIMATION affichée au client, pour chaque véhicule :
       prix de la formule choisie (vehicules[].prix) + options cochées,
     puis remise pack éventuelle. Les frais de déplacement ne sont
     jamais affichés au client. */

  /* ------------------------------------------------------------------
     PACKS (remise selon le nombre de véhicules d'une même réservation)
     `appliquer: false` = affiché dans les tarifs mais PAS déduit de
     l'estimation (remise décidée au cas par cas, sur la facture).
     ------------------------------------------------------------------ */
  packs: [
    { nom: "Famille",           remise: 10, min: 2, max: 4, description: "2 à 4 véhicules",        appliquer: true },
    { nom: "Flotte entreprise", remise: 15, min: 5,         description: "À partir de 5 véhicules", appliquer: true },
  ],

  /* ------------------------------------------------------------------
     GALERIE AVANT / APRÈS
     Format : { titre: "", avant: "assets/photos/xxx-avant.jpg", apres: "assets/photos/xxx-apres.jpg" }
     Les deux photos doivent avoir exactement le même cadrage et la même
     taille (elles sont superposées). Le format (portrait / paysage) est
     détecté automatiquement.
     ------------------------------------------------------------------ */
  galerie: [
    { titre: "Banquette arrière", avant: "assets/photos/banquette-avant.jpg", apres: "assets/photos/banquette-apres.jpg" },
    { titre: "Coffre",            avant: "assets/photos/coffre-avant.jpg",    apres: "assets/photos/coffre-apres.jpg" },
  ],

  /* ------------------------------------------------------------------
     RÉSERVATION
     ------------------------------------------------------------------ */
  reservation: {
    // Adresse du service Google Apps Script (voir toutnet/reservation/GUIDE.md).
    // Tant qu'elle est vide, le site fonctionne en mode « demande » :
    // le client indique une date souhaitée et envoie sa demande par
    // e-mail / WhatsApp / SMS, sans réservation automatique.
    apiUrl: "https://script.google.com/macros/s/AKfycbyVCNiqCCCizPIZSSZzECPHeixDhsVzsU8yQijoQPBfDQrzUivJ86G1B5UaT-itEkTPqg/exec",

    maxVehicules: 10,

    // Texte affiché sous l'estimation de prix.
    mentionEstimation: "Prix estimé, net de TVA (TVA non applicable, art. 293 B du CGI). Les suppléments liés à l'état du véhicule sont confirmés sur place par Quentin.",

    // Aperçu : si apiUrl est vide et demo: true, des créneaux d'EXEMPLE
    // sont affichés et aucune demande n'est envoyée. Ignoré quand apiUrl
    // est renseignée.
    demo: false,

    // Durées d'intervention (minutes), utilisées pour afficher la durée
    // estimée tant que le service Google n'est pas installé. Une fois
    // installé, ce sont les durées de l'onglet « Durées » qui comptent.
    durees: {
      "citadine|formule-1": 120,   "citadine|formule-2": 180,
      "break-suv|formule-1": 120,  "break-suv|formule-2": 180,
      "7-places|formule-1": 120,   "7-places|formule-2": 180,   // À CONFIRMER
      "camion|formule-1": 180,     "camion|formule-2": 180,     // À CONFIRMER
      "utilitaire|formule-1": 180, "utilitaire|formule-2": 180,
      "commercial|formule-1": 90,  "commercial|formule-2": 120,
      "option|vehicule-tres-sale": 30,   // À CONFIRMER — temps en plus si très sale
    },
  },
};
