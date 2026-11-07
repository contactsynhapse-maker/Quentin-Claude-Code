# Tout'Net — site internet

Site de **Tout'Net**, service mobile de nettoyage intérieur de véhicules.
Le site est adapté aux ordinateurs, tablettes et téléphones, y compris le navigateur intégré d'Instagram.

```
toutnet/
├── site/                     ← le site publié en ligne
│   ├── index.html
│   ├── css/style.css         couleurs et polices (variables en haut du fichier)
│   ├── js/config.js          ★ TOUT LE CONTENU : tarifs, formules, options, contacts, photos…
│   ├── js/main.js            affichage des sections, curseur avant/après
│   ├── js/reservation.js     réservation en 4 étapes
│   └── assets/               logo, photos (dossier photos/)
└── reservation/              ← système de réservation (Google Apps Script)
    ├── Code.gs
    ├── appsscript.json
    └── GUIDE.md              installation pas à pas
```

## Contenu du site

- **Accueil** : logo, accroche du flyer, boutons « Réserver » et « Voir les tarifs ».
- **Avantages** : service mobile, deux formules, tarifs dégressifs, réservation en ligne.
- **Formules** : Formule 1 (Aspiration à sec) et Formule 2 (Nettoyage complet par extraction, recommandée), option Poils d'animaux +15 €.
- **Tarifs** : fourchettes de prix selon le véhicule, packs Famille −10 % et Flotte entreprise −15 %.
- **Avant / Après** : curseur de comparaison (photos à fournir).
- **Réservation**, en 4 étapes :
  1. **Véhicules** : un onglet par véhicule (type, formule, options), estimation du prix en direct avec la remise pack et la durée estimée ;
  2. **Adresse et créneau** : seuls les créneaux réellement libres de Quentin sont proposés ;
  3. **Coordonnées** : prénom, nom, téléphone, e-mail, précisions ;
  4. **Confirmation** : le créneau est bloqué, Quentin reçoit un e-mail pour accepter ou refuser, et le client est prévenu par e-mail à chaque étape.
- **Contact** : appel, WhatsApp, SMS, e-mail (et Instagram dès que l'identifiant est renseigné).

Tant que le service Google n'est pas installé (`apiUrl` vide dans `config.js`), la réservation fonctionne en **mode demande** : le client choisit une date souhaitée et envoie un récapitulatif déjà rédigé par e-mail, WhatsApp ou SMS.

## Modifier le site

Tout le contenu se trouve dans **`site/js/config.js`** : tarifs, formules, options, packs, coordonnées, photos avant/après, présentation.

- **Depuis GitHub (le plus simple, même sur téléphone)** : ouvrir le fichier sur github.com, cliquer sur ✏️, modifier, puis **Commit changes**. Le site se met à jour tout seul en 1 à 2 minutes.
- **Depuis un PC** : cloner le dépôt, modifier, puis `git commit` et `git push`.

### Ajouter des photos avant/après
1. Déposer les photos dans `site/assets/photos/`, en même cadrage, idéalement au format 4:3 et à moins de 500 Ko chacune.
2. Les référencer dans `config.js` :
   ```js
   galerie: [
     { titre: "SUV — sièges shampouinés", avant: "assets/photos/suv-avant.jpg", apres: "assets/photos/suv-apres.jpg" },
   ],
   ```

### Ajouter une option, un type de véhicule…
Ajouter une ligne dans la liste correspondante de `config.js`. Si la réservation en ligne est active, ajouter aussi la durée correspondante dans l'onglet **Durées** de la feuille Google, avec le même identifiant `id`.

## Accès à deux administrateurs

| Quoi | Comment donner l'accès |
|---|---|
| Code et contenu du site | GitHub : **Settings → Collaborators → Add people** (chacun a son compte GitHub) |
| Disponibilités, rendez-vous, clients | Partager la feuille Google et les deux agendas « Tout'Net » (voir `reservation/GUIDE.md`, §6) |

## Mise en ligne (GitHub Pages)

Le workflow `.github/workflows/deploy-toutnet.yml` publie le dossier `toutnet/site/` à chaque modification sur la branche `main`.

1. Sur GitHub, aller dans **Settings → Pages → Build and deployment → Source : GitHub Actions**.
2. Fusionner le travail dans `main` (ou lancer le workflow à la main, onglet **Actions**).
3. Le site est en ligne sur `https://<compte>.github.io/<dépôt>/`.

> Conseil : créer un **dépôt dédié** (ex. `toutnet`) plutôt que de garder le site dans un dépôt qui contient d'autres projets. Quentin y aura accès sans voir le reste, et l'adresse sera plus propre.

### Nom de domaine
1. Vérifier la disponibilité de `toutnet.fr` (ou `tout-net.fr`, `toutnet81.fr`…) chez un registraire : OVHcloud, Gandi, Ionos… Un `.fr` coûte quelques euros par an.
2. Chez le registraire, créer un enregistrement DNS `CNAME` : `www` → `<compte>.github.io`.
3. Sur GitHub, aller dans **Settings → Pages → Custom domain**, saisir `www.toutnet.fr`, puis cocher **Enforce HTTPS**.
4. Renseigner l'adresse du site dans l'onglet **Réglages** de la feuille Google (`site_web`).

## Ce qui reste à fournir

- Les photos avant/après.
- L'identifiant Instagram.
- Le texte de présentation de Quentin (section masquée tant qu'il est vide), et une photo si possible.
- La liste des villes desservies.
- Les durées réelles par formule et par véhicule (onglet **Durées**).
- Les règles des frais de déplacement, s'il y en a.
- Le devis téléchargeable : à définir ensemble.
