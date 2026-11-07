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
- **Formules** : Formule 1 (Aspiration à sec) et Formule 2 (Nettoyage complet par extraction, recommandée), avec leur prix indicatif ; options Véhicule très sale +20 € (supplément ajusté sur place) et Poils d'animaux +15 €.
- **Tarifs** : fourchettes de prix selon le véhicule (dont Véhicule commercial 90–120 €), packs Famille −10 % et Flotte entreprise −15 %.
- **Avant / Après** : curseur de comparaison sur des photos recalées (banquette, coffre).
- **Réservation**, en 4 étapes :
  1. **Véhicules** : un onglet par véhicule (type, formule avec le prix ou le supplément affiché, options), et un récapitulatif chiffré ligne par ligne (formule, chaque option, sous-total, remise Famille, durée, prix estimé) ;
  2. **Adresse et créneau** : un calendrier façon Planity (un jour par colonne) qui ne montre que les heures où Quentin est disponible, trajet compris ; l'heure choisie et toute la durée de l'intervention s'affichent en bleu ;
  3. **Coordonnées** : prénom, nom, téléphone, e-mail, précisions ;
  4. **Récapitulatif** complet, puis **Valider ma demande** : le client arrive sur une page de confirmation (« Quentin vous recontacte rapidement »), avec un bouton « Retour au site ». Quentin reçoit la demande par e-mail sur tout.net81@gmail.com.
- **Contact** : appel, WhatsApp, SMS, e-mail, Instagram (tout.net81).

Tant que le service Google n'est pas installé (`apiUrl` vide dans `config.js`), le site est en **mode aperçu** : le calendrier montre des créneaux d'exemple (signalés comme tels) et aucune demande n'est envoyée.

### Calcul du prix estimé
Pour chaque véhicule : prix de la formule choisie (`vehicules[].prix` dans `config.js`), plus les options cochées. Puis la remise Famille (−10 %, de 2 à 4 véhicules) ou Flotte (−15 %, à partir de 5 véhicules). Les frais de déplacement ne sont jamais affichés.

## Informations légales
La page `site/mentions-legales.html` regroupe les mentions légales, la politique de confidentialité et les conditions de réservation. Les champs surlignés en jaune **[À COMPLÉTER]** doivent être remplis avant la mise en ligne publique : nom de l'entrepreneur, adresse, SIRET, régime de TVA, conditions d'annulation et de paiement, médiateur de la consommation. Avant d'envoyer sa demande, le client coche une case d'acceptation des conditions.

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

- D'autres photos avant/après (même endroit, même angle, même lumière).
- Le texte de présentation de Quentin (section masquée tant qu'il est vide), et une photo si possible.
- La validation des prix de la formule 2 par véhicule (`vehicules[].prix`).
- Les durées 7 places, camion et options (onglet **Durées**).
- Les frais de déplacement (jamais affichés au client, ajoutés plus tard).
- Le devis téléchargeable : à définir ensemble.
