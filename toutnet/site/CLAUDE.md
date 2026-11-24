# Fiche de passation — site Tout'Net

Ce fichier est destiné à Claude. Il résume tout ce qu'il faut savoir pour faire évoluer le site **https://toutnet-nettoyage.fr** à la demande de **Quentin Soulié**, le gérant de Tout'Net.

---

## 1. Qui, quoi

- **Tout'Net** : nettoyage **intérieur** de véhicules, au domicile ou sur le lieu de travail du client. L'entreprise est basée à **Lavaur (Tarn, 81)** et intervient jusqu'à Toulouse, Albi, Castres, Gaillac et Lacaune.
- **Entreprise** : Quentin Soulié EI (entreprise individuelle), micro-entreprise. **TVA non applicable** (art. 293 B du CGI) : tous les prix sont **nets**, sans mention HT/TTC.
- **Ton interlocuteur** : Quentin. Il n'est pas développeur.
  - Réponds-lui **toujours en français**, simplement, sans jargon technique (pas de « commit », « merge », « JSON »… sans explication).
  - Dis-lui ce qui a changé sur le site, concrètement, et où le voir.
  - Pour une manipulation à faire de son côté (Google Agenda, GitHub…), donne des étapes numérotées, courtes, avec le nom exact des boutons.
- **Coordonnées publiques** :
  - téléphone et WhatsApp : 06 47 59 06 73 ;
  - email : tout.net81@gmail.com ;
  - Instagram : tout.net81.
- **Dépôt GitHub** : `contactsynhapse-maker/toutnet`. Il appartient à un ami de Quentin qui a construit le site avec lui. Quentin y est collaborateur avec son compte `toutnet81-art`.

## 2. Règles à respecter absolument

1. **Ne jamais inventer** un prix, une prestation, une durée, une coordonnée, un avis client ou une information légale. Si une information manque, **pose la question à Quentin** avant de l'écrire.
2. **Style** : sobre, clair, professionnel, « pas trop en mode IA ». Garde-toi des formules creuses, des emojis dans les textes du site et des superlatifs à répétition. Garde l'identité visuelle : bleu Tout'Net + jaune d'accent, police Poppins.
3. **Mobile d'abord** : la plupart des clients arrivent depuis un téléphone, souvent via le navigateur intégré d'Instagram. Chaque modification doit rester parfaite en largeur 375–390 px.
4. **Ne pas toucher** :
   - au fichier `CNAME`, qui fait fonctionner le nom de domaine ;
   - aux identifiants `id` des véhicules, formules et options dans `js/config.js`, qui sont liés au système de réservation (voir §5) ;
   - à `apiUrl`.
5. **Les frais de déplacement ne sont jamais affichés au client.** C'est une décision de Quentin.
6. **Pas de nouvelles dépendances externes** (CDN, polices Google, traceurs, cookies publicitaires). Le site est volontairement autonome : polices et Leaflet sont hébergés dans le dépôt, il n'y a pas de bandeau cookies car il n'y a pas de traceurs. Ajouter Google Analytics, par exemple, imposerait un bandeau de consentement.

## 3. Comment le site est publié

- C'est un **site statique** (HTML, CSS, JavaScript sans framework ni étape de build), publié par **GitHub Pages** depuis la branche **`main`**, à la racine du dépôt. Le fichier `.nojekyll` désactive Jekyll.
- **Ce qui arrive sur `main` est en ligne 1 à 2 minutes plus tard**, sur https://toutnet-nettoyage.fr. Le nom de domaine est chez OVH et le HTTPS est géré par GitHub.
- Si ta session travaille sur une autre branche, la modification **n'est pas en ligne** tant qu'elle n'est pas sur `main`. Dans ce cas :
  - soit tu demandes à Quentin l'autorisation de pousser directement sur `main` ;
  - soit tu ouvres une pull request et tu lui expliques comment la fusionner (bouton vert **« Merge pull request »** puis **« Confirm merge »** sur GitHub).

  Dans tous les cas, dis-lui clairement si c'est en ligne ou pas encore.
- Après publication, invite Quentin à recharger la page sur son téléphone. Si l'ancienne version reste affichée, c'est le cache : tirer vers le bas pour recharger, ou attendre une minute.

## 4. Organisation des fichiers

```
index.html             page unique (sections : accueil, avantages, avant/après,
                       formules, tarifs, zone, réservation, contact) + SEO (balises
                       meta, JSON-LD « AutoWash »)
css/style.css          tout le style ; couleurs en variables en haut (--c-blue,
                       --c-navy, --c-yellow…)
js/config.js           ★ TOUT LE CONTENU : textes, prix, formules, options, packs,
                       zone, photos avant/après, réglages de la réservation
js/main.js             affichage des sections à partir de config.js, estimation
                       du prix, curseur avant/après
js/reservation.js      parcours de réservation (véhicules → adresse + créneau →
                       coordonnées → récapitulatif → « Valider ma demande »)
js/zone.js             carte de la zone (Leaflet, tuiles OpenStreetMap)
decision.html          page privée de Quentin pour Accepter / Refuser une demande
                       (ouverte depuis l'email ; exclue des moteurs via robots.txt)
mentions-legales.html  mentions légales + confidentialité + conditions de réservation
reservation/           code du serveur de réservation (Google Apps Script) :
                       Code.gs, appsscript.json, GUIDE.md
assets/                logo, favicon, photos avant/après (photos/),
                       photos de véhicules (vehicules/), polices (fonts/)
vendor/leaflet/        bibliothèque de carte, hébergée localement
sitemap.xml, robots.txt, CNAME
```

> Le `README.md` date de la construction du site et n'est plus entièrement à jour : par exemple, les mentions légales sont désormais remplies. En cas de doute, **ce fichier fait foi**.

**Dans 90 % des cas, une demande de Quentin se règle dans `js/config.js`.** Chaque rubrique y est commentée.

### Contenu actuel de `js/config.js`, pour s'y retrouver vite

- `identite` : nom, logo, accroche de l'accueil, slogan.
- `contact` : téléphone, WhatsApp, email, Instagram. Chaque moyen renseigné crée automatiquement un bouton dans la section Contact. Le numéro est au format international sans « + » (`33647590673`).
- `presentation` : section « Qui suis-je ? », **masquée tant que `texte` est vide**. Elle attend un texte et une photo de Quentin.
- `avantages` : les 4 encarts sous l'accueil.
- `vehicules` : types de véhicules et prix. Pour chacun, `prix["formule-1"]` est le bas de la fourchette et `prix["formule-2"]` le haut ; `prixMin` / `prixMax` alimentent le tableau Tarifs. **Si tu changes un prix, mets à jour les deux endroits.**

  | Véhicule (`id`) | Formule 1 | Formule 2 |
  |---|---|---|
  | Citadine (`citadine`) | 90 € | 130 € |
  | Break · SUV (`break-suv`) | 90 € | 140 € |
  | 7 places (`7-places`) | 100 € | 150 € |
  | Camion (`camion`) | 100 € | 150 € |
  | Utilitaire (`utilitaire`) | 100 € | 150 € |
  | Voiture commerciale (`commercial`) | 90 € | 120 € |

- `formules` : les deux formules.
  - Formule 1, **Aspiration à sec**, environ 2 h : aspiration complète, coffre, dépoussiérage de tous les plastiques, dégraissage des vitres et du pare-brise, contours de portières.
  - Formule 2, **Nettoyage complet par extraction**, environ 3 h : tout le contenu de la formule 1, plus le shampouinage des sièges par extraction. C'est la formule **recommandée** (`miseEnAvant: true`, badge).

  Champs disponibles : `etiquette`, `nom`, `sousTitre`, `duree`, `accroche`, `inclus` (liste à puces), `badge`.
- `options` : Véhicule très sale +20 € (ajusté sur place) et Poils d'animaux +15 €. Le prix des options **s'ajoute** à celui de la formule (exemple affiché sur le site : SUV formule 2 très sale = 140 + 20 = 160 €).
- `packs` : remise selon le nombre de véhicules d'une même réservation. Famille −10 % de 2 à 4 véhicules, Flotte entreprise −15 % dès 5 véhicules. Avec `appliquer: true`, la remise est déduite de l'estimation.
- `zone` : la carte. Elle montre un cercle de `rayonKm` (42 km) autour de Lavaur et une extension de 20 km autour de Lacaune, fusionnés en une seule forme, plus les villes repères. Quentin a demandé une liste de villes courte : Toulouse, Albi, Gaillac, Castres, Lacaune.
- `galerie` : photos avant/après, avec `titre`, `description` (phrase affichée sous le titre), `avant` et `apres`.
  - Les deux photos d'une paire doivent avoir **le même cadrage et les mêmes dimensions**, sinon le curseur décale l'image.
  - Format JPG, 1200–1600 px de large, moins de 500 Ko environ.
  - Si Quentin envoie des photos de téléphone (HEIC, très lourdes, pas alignées), convertis-les en JPG, redimensionne et recadre-les à l'identique avant de les ajouter dans `assets/photos/`.
- `reservation` : `apiUrl` (adresse du serveur Google, **ne pas modifier**), `mentionEstimation` (texte sous le prix estimé) et `durees` (durées de secours ; voir §5).

## 5. Réservation en ligne (Google)

Le serveur tourne sur le **compte Google de Tout'Net** (tout.net81@gmail.com), avec Google Apps Script. Le code est dans `reservation/Code.gs`. Le site l'interroge via `apiUrl`.

- **Disponibilités** : Quentin crée des événements, par exemple « dispo », dans l'agenda Google **« Tout'Net — Disponibilités »**. Le site ne propose que les heures de début où **toute la durée de l'intervention tient dans une plage de dispo**, sans chevaucher un rendez-vous existant, avec un battement de 30 min et le temps de trajet calculé par Google Maps.
  - Exemple réel : une dispo de 17 h 30 à 20 h (2 h 30) ne permet **pas** une formule 2 (3 h). Elle permet une formule 1 (2 h) à 17 h 30 ou 18 h.
  - Si Quentin dit « mes dispos n'apparaissent pas », vérifie d'abord ce point. Rappelle aussi le délai minimum de 24 h avant un rendez-vous et l'horizon de 45 jours (onglet « Réglages »).
- **Rendez-vous** : chaque demande crée un événement « ⏳ À CONFIRMER » dans l'agenda **« Tout'Net — Rendez-vous »** et une ligne dans la feuille Google Sheets **« Tout'Net — Réservations »**. Quentin reçoit un email avec **Accepter / Refuser**. Ces boutons ouvrent `decision.html`, où il peut ajouter un message personnel au client. Le client reçoit un email à chaque étape.
- **Réglages sans toucher au code** : dans la feuille Google, l'onglet **« Réglages »** contient le battement, la marge de trajet, le pas des créneaux, le délai minimum, l'horizon et l'email de notification. L'onglet **« Durées »** contient la durée de chaque véhicule × formule et des options. **Une fois le serveur installé, ce sont les durées de l'onglet « Durées » qui comptent**, pas celles de `config.js`.
- **Changer un prix ou un texte** : uniquement `js/config.js`. Le serveur ne calcule pas les prix : il reçoit l'estimation affichée au client.
- **Ajouter un type de véhicule, une formule ou une option** : il faut modifier trois endroits.
  1. Dans `js/config.js`, avec un nouvel `id` en minuscules et tirets.
  2. Dans `reservation/Code.gs`, les listes `VEHICULES` / `FORMULES` / `OPTIONS` et `DUREES_DEFAUT`, avec le même `id`.
  3. Côté Google, à faire **par Quentin**, guide-le :
     - ouvrir la feuille « Tout'Net — Réservations », puis **Extensions → Apps Script** ;
     - remplacer tout le contenu de `Code.gs` par la nouvelle version ;
     - enregistrer, puis **Déployer → Gérer les déploiements → ✏️ → Version : Nouvelle version → Déployer**. L'adresse `/exec` ne change pas ;
     - ajouter la ligne de durée correspondante dans l'onglet « Durées ».

     S'il a plusieurs comptes Google, il doit le faire dans une **fenêtre de navigation privée** connectée uniquement à tout.net81@gmail.com. Sinon Google affiche « Impossible d'ouvrir le fichier ».
- Toute modification de `Code.gs` dans le dépôt **n'a aucun effet** tant qu'elle n'a pas été recopiée et redéployée dans Apps Script. Dis-le toujours à Quentin.

## 6. Informations légales (`mentions-legales.html`)

Déjà en place :
- éditeur : Quentin Soulié EI, SIRET 130 691 470 00012, APE 4520A, TVA non applicable (art. 293 B du CGI) ;
- hébergeur : GitHub ;
- politique de confidentialité, dont les tuiles OpenStreetMap de la carte ;
- conditions de réservation : **annulation gratuite jusqu'à 24 h avant**, **paiement sur place à la fin de la prestation**.

Avant d'envoyer sa demande, le client coche une case d'acceptation des conditions.

**Reste à faire** : le **médiateur de la consommation**, obligatoire pour une entreprise qui vend à des particuliers. Un emplacement surligné en jaune (`<span class="todo">`) attend son **nom** et l'**adresse de son site**. Quand Quentin les donne, remplace le `<span class="todo">…</span>` par le texte final, avec un lien vers le site du médiateur. Supprime aussi la règle CSS `.todo` en haut du fichier si plus rien ne l'utilise.

Si une modification touche aux conditions (annulation, paiement, prix…), mets à jour cette page en cohérence, et préviens Quentin que c'est un engagement envers ses clients.

## 7. Référencement (SEO)

- Le site est déclaré dans **Google Search Console**, avec le sitemap `https://toutnet-nettoyage.fr/sitemap.xml`.
- Il existe une **fiche Google Business Profile** « Tout'Net », de catégorie « Service d'esthétique automobile », en zone desservie avec l'adresse masquée.
- Dans `index.html`, il y a la balise `<title>`, la `meta description`, les balises Open Graph et un bloc **JSON-LD** (`AutoWash`). Ce bloc contient notamment `priceRange` (90 € – 150 €), `areaServed` et les coordonnées. **Si les prix, la zone ou les coordonnées changent, mets aussi ces balises à jour.** La meta description mentionne « Dès 90 € ».
- Si une nouvelle page est créée, ajoute-la dans `sitemap.xml`. Les pages privées comme `decision.html` en sont exclues et restent bloquées dans `robots.txt`.

## 8. Idées et demandes en attente

- **Bouton « Laisser un avis Google »** : à ajouter dans la section Contact et en bas de page, dès que Quentin fournit son lien d'avis. Il le trouve sur sa fiche Google, bouton « Demander des avis », lien du type `https://g.page/r/…/review`. Ne fabrique pas ce lien toi-même.
- **Section « Qui suis-je ? »** : texte et photo de Quentin (`presentation` dans `config.js`).
- **Médiateur de la consommation** : voir §6.
- **Photos** : remplacer les photos de véhicules génériques (`assets/vehicules/`) par de vraies photos si Quentin en fournit, et ajouter de nouvelles paires avant/après au fil des prestations.
- **Horaires** : `contact.horaires` est vide. À remplir si Quentin le souhaite.

## 9. Vérifier avant de publier

1. Lancer un serveur local à la racine du dépôt : `python3 -m http.server 8000`, puis ouvrir `http://localhost:8000`.
2. Vérifier qu'il n'y a **aucune erreur JavaScript** dans la console. Une virgule oubliée dans `config.js` casse tout le site.
3. Vérifier le rendu en **largeur téléphone (390 px)** et ordinateur (1280 px), par exemple avec Playwright si disponible : faire une capture et la regarder.
4. Pour la réservation, aller jusqu'à l'étape du calendrier suffit. **Ne pas envoyer de vraie demande de test** sans prévenir Quentin : elle bloquerait un créneau dans son agenda et lui enverrait un email.
5. Résumer à Quentin, en quelques lignes, ce qui a changé, et préciser si c'est en ligne (voir §3).

## 10. Problèmes déjà rencontrés (pour ne pas les refaire)

- L'attribut `hidden` est forcé par `[hidden]{display:none!important}` dans le CSS, parce que `.btn` le surchargeait. Ne retire pas cette règle.
- La carte utilise les tuiles **OpenStreetMap**. Les tuiles CARTO demandent une clé API et affichent « API KEY REQUIRED ».
- Avec Leaflet, il faut appeler `fitBounds` **avant** d'ajouter les formes, sinon on obtient une erreur `layerPointToLatLng`.
- Sur mobile, les noms de villes de la carte se chevauchaient. Le réglage `etiquetteMobile` (sur Albi) place l'étiquette sur le côté.
- Les photos de véhicules ont un fond blanc et une ombre au sol douce et fondue. Une nouvelle photo doit être retouchée de la même façon pour rester homogène.
- Google refuse les photos HEIC pour la fiche Business : il faut les convertir en JPG.
