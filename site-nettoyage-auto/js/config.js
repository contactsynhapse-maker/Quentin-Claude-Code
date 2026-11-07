/* =====================================================================
   CONFIGURATION DU SITE — fichier unique à modifier
   ---------------------------------------------------------------------
   Tout le contenu du site (textes, prestations, tarifs, formule
   personnalisée, coordonnées, photos) est défini ici.

   Règle : rien n'est inventé. Tant qu'une information n'a pas été
   validée, elle reste vide ("") ou sous forme d'emplacement neutre
   ("Catégorie 1", "Option 1"...). Le site s'adapte automatiquement :
     - un champ vide n'est pas affiché (ou affiche "à définir") ;
     - un moyen de contact vide ne génère pas de bouton ;
     - une liste vide affiche des emplacements réservés.

   Les éléments marqués  // À DÉFINIR  attendent une validation.
   ===================================================================== */

window.SITE_CONFIG = {

  /* ------------------------------------------------------------------
     Repères visuels : quand `true`, les contenus encore provisoires
     sont soulignés en pointillés pour les repérer facilement.
     Passer à `false` avant la mise en ligne définitive.
     ------------------------------------------------------------------ */
  afficherReperes: true,

  /* ------------------------------------------------------------------
     IDENTITÉ
     ------------------------------------------------------------------ */
  identite: {
    nom: "",          // À DÉFINIR — nom de l'activité (ex. affiché dans l'en-tête)
    logo: "",         // À DÉFINIR — chemin vers le logo, ex. "assets/logo.svg"
    accroche: "Nettoyage automobile à Toulouse et ses environs",
    sousAccroche: "", // À DÉFINIR — phrase d'introduction sous le titre principal
  },

  /* ------------------------------------------------------------------
     COORDONNÉES & MOYENS DE CONTACT
     Chaque moyen renseigné génère automatiquement un bouton.
     Format téléphone / WhatsApp : international sans espaces, ex. "33612345678"
     ------------------------------------------------------------------ */
  contact: {
    telephone: "",    // À DÉFINIR — ex. "33612345678"
    whatsapp: "",     // À DÉFINIR — ex. "33612345678"
    email: "",        // À DÉFINIR
    instagram: "",    // À DÉFINIR — identifiant sans @, ex. "mon_compte"
    zone: "Toulouse et ses environs", // À PRÉCISER — zone exacte d'intervention
    horaires: "",     // À DÉFINIR
  },

  /* ------------------------------------------------------------------
     PRÉSENTATION DU PRESTATAIRE
     ------------------------------------------------------------------ */
  presentation: {
    titre: "Qui suis-je ?",
    texte: "",        // À DÉFINIR — courte présentation du prestataire
    photo: "",        // À DÉFINIR — ex. "assets/photos/portrait.jpg"
  },

  /* ------------------------------------------------------------------
     PRESTATIONS
     Liste vide = emplacements réservés affichés.
     Format : { titre: "", description: "", icone: "interieur" }
     Icônes disponibles : interieur, exterieur, complet, etoile, goutte
     ------------------------------------------------------------------ */
  prestations: [
    // À DÉFINIR
  ],
  nbEmplacementsPrestations: 3,

  /* ------------------------------------------------------------------
     AVANTAGES DU SERVICE
     Format : { titre: "", texte: "" }
     ------------------------------------------------------------------ */
  avantages: [
    // À DÉFINIR
  ],
  nbEmplacementsAvantages: 4,

  /* ------------------------------------------------------------------
     GALERIE AVANT / APRÈS
     Format : { titre: "", avant: "chemin/photo-avant.jpg", apres: "chemin/photo-apres.jpg" }
     Conseil : photos de même cadrage et de même format (idéalement 4:3).
     Si `avant` ou `apres` est vide, une image provisoire est affichée.
     ------------------------------------------------------------------ */
  galerie: [
    { titre: "", avant: "", apres: "" },  // À DÉFINIR — comparaison 1
    { titre: "", avant: "", apres: "" },  // À DÉFINIR — comparaison 2
    { titre: "", avant: "", apres: "" },  // À DÉFINIR — comparaison 3
  ],

  /* ------------------------------------------------------------------
     TARIFS
     Format d'une formule :
       {
         nom: "",
         prix: "",            // texte libre, ex. "XX €" ou "à partir de XX €"
         description: "",
         inclus: ["", ""],    // liste des éléments compris
         miseEnAvant: false,  // true = formule mise en évidence
       }
     Liste vide = emplacements réservés "Tarif communiqué prochainement".
     ------------------------------------------------------------------ */
  tarifs: {
    introduction: "",  // À DÉFINIR
    formules: [
      // À DÉFINIR
    ],
    nbEmplacements: 3,
    mentions: "",      // À DÉFINIR — ex. conditions, frais de déplacement...
  },

  /* ------------------------------------------------------------------
     FORMULE PERSONNALISÉE (configurateur en 4 étapes)
     Les intitulés ci-dessous sont des EMPLACEMENTS NEUTRES, à remplacer
     par les catégories, niveaux et options définitifs.
     Chaque élément a un identifiant `id` unique (sans espace) et peut
     recevoir plus tard des données de tarification.
     ------------------------------------------------------------------ */
  formule: {
    // Étape 1 — À DÉFINIR : catégories de véhicules
    vehicules: [
      { id: "vehicule-1", nom: "Catégorie 1", description: "" },
      { id: "vehicule-2", nom: "Catégorie 2", description: "" },
      { id: "vehicule-3", nom: "Catégorie 3", description: "" },
    ],

    // Étape 2 — À DÉFINIR : niveaux de saleté
    niveaux: [
      { id: "niveau-1", nom: "Niveau 1", description: "" },
      { id: "niveau-2", nom: "Niveau 2", description: "" },
      { id: "niveau-3", nom: "Niveau 3", description: "" },
    ],

    // Étape 3 — À DÉFINIR : options supplémentaires (sélection multiple)
    options: [
      { id: "option-1", nom: "Option 1", description: "" },
      { id: "option-2", nom: "Option 2", description: "" },
      { id: "option-3", nom: "Option 3", description: "" },
    ],

    // Étape 4 — Prix estimatif.
    // Tant que `tarification` vaut null, aucun prix n'est calculé :
    // le récapitulatif affiche le texte ci-dessous.
    // Les règles de calcul seront ajoutées ici une fois définies.
    tarification: null, // À DÉFINIR
    texteSansPrix: "Le tarif de votre formule vous sera communiqué sur devis.",
  },
};
