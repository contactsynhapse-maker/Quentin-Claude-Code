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
    instagram: "",            // À DÉFINIR — identifiant du compte, sans @
    zone: "Service mobile sur plusieurs villes", // À PRÉCISER — liste des villes
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
     TYPES DE VÉHICULES & FOURCHETTES DE PRIX (TTC)
     ------------------------------------------------------------------ */
  vehicules: [
    { id: "citadine",   nom: "Citadine",       prixMin: 90,  prixMax: 130 },
    { id: "break-suv",  nom: "Break · SUV",    prixMin: 90,  prixMax: 140 },
    { id: "7-places",   nom: "7 places (van)", prixMin: 100, prixMax: 150 },
    { id: "camion",     nom: "Camion",         prixMin: 100, prixMax: 150 },
    { id: "utilitaire", nom: "Utilitaire",     prixMin: 100, prixMax: 150, note: "Prix en fonction du véhicule" },
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
     ------------------------------------------------------------------ */
  options: [
    { id: "poils-animaux", nom: "Poils d'animaux", prix: 15, description: "Supplément pour les véhicules de nos compagnons à poils." },
  ],

  /* ------------------------------------------------------------------
     ÉTAT DU VÉHICULE (niveau de saleté)
     Liste vide = question non posée. Format : { id: "", nom: "", description: "" }
     ------------------------------------------------------------------ */
  niveaux: [
    // À DÉFINIR
  ],

  /* ------------------------------------------------------------------
     PACKS (remise selon le nombre de véhicules d'une même réservation)
     ------------------------------------------------------------------ */
  packs: [
    { nom: "Famille",           remise: 10, min: 2, max: 4, description: "2 à 4 véhicules" },
    { nom: "Flotte entreprise", remise: 15, min: 5,         description: "À partir de 5 véhicules" },
  ],

  /* ------------------------------------------------------------------
     GALERIE AVANT / APRÈS
     Format : { titre: "", avant: "assets/photos/xxx-avant.jpg", apres: "assets/photos/xxx-apres.jpg" }
     ------------------------------------------------------------------ */
  galerie: [
    { titre: "", avant: "", apres: "" },  // À DÉFINIR — photos à fournir
    { titre: "", avant: "", apres: "" },
    { titre: "", avant: "", apres: "" },
  ],

  /* ------------------------------------------------------------------
     RÉSERVATION
     ------------------------------------------------------------------ */
  reservation: {
    // Adresse du service Google Apps Script (voir toutnet/reservation/GUIDE.md).
    // Tant qu'elle est vide, le site fonctionne en mode « demande » :
    // le client indique une date souhaitée et envoie sa demande par
    // e-mail / WhatsApp / SMS, sans réservation automatique.
    apiUrl: "",

    maxVehicules: 10,

    // Texte affiché sous l'estimation de prix.
    mentionEstimation: "Estimation indicative TTC, établie à partir des fourchettes de prix. Le tarif définitif vous est confirmé par Tout'Net.",

    // Frais de déplacement — À DÉFINIR. Tant que null, rien n'est ajouté.
    deplacement: null,
  },
};
