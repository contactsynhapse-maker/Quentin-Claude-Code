# Site de nettoyage automobile — Toulouse

Version 0.1 : la structure du site est en place. **Aucun contenu commercial n'a été inventé** (pas de nom, de prestations, de tarifs ni de coordonnées). Chaque information qui n'est pas encore validée apparaît sous forme d'emplacement neutre (« Prestation 1 », « Catégorie 1 », « Tarif communiqué prochainement »…).

## Aperçu

Ouvrir `index.html` dans un navigateur : aucune installation n'est nécessaire.

## Structure

```
site-nettoyage-auto/
├── index.html          Structure de la page
├── css/style.css       Styles (couleurs et polices regroupées en haut du fichier)
├── js/config.js        ★ TOUT LE CONTENU DU SITE — le seul fichier à modifier
├── js/main.js          Affichage des sections, curseur avant/après, menu
├── js/formule.js       Configurateur « Composez votre formule »
└── assets/
    ├── photos/         Photos avant/après, portrait, logo… (à ajouter)
    └── placeholder-*.svg  Images provisoires
```

## Modifier le contenu

Tout se fait dans **`js/config.js`**. Les éléments en attente sont marqués `// À DÉFINIR`.

| Élément | Où | Comportement tant que c'est vide |
|---|---|---|
| Nom, logo, accroche | `identite` | « [Nom de l'activité] » affiché |
| Téléphone, WhatsApp, e-mail, Instagram | `contact` | Pas de bouton pour ce moyen de contact |
| Présentation du prestataire | `presentation` | Texte et photo provisoires |
| Prestations | `prestations` | 3 cartes provisoires |
| Avantages | `avantages` | 4 blocs provisoires |
| Photos avant/après | `galerie` | Images provisoires (curseur fonctionnel) |
| Formules et prix | `tarifs.formules` | « Tarif communiqué prochainement » |
| Catégories de véhicules | `formule.vehicules` | Catégorie 1, 2, 3 |
| Niveaux de saleté | `formule.niveaux` | Niveau 1, 2, 3 |
| Options supplémentaires | `formule.options` | Option 1, 2, 3 |
| Calcul du prix estimatif | `formule.tarification` | Le texte « sur devis » s'affiche |

Pour ajouter, retirer ou renommer une option (ou une catégorie, un niveau), il suffit de modifier la liste correspondante : le configurateur s'adapte tout seul.

Les contenus provisoires sont soulignés en pointillés pour qu'on les repère facilement. Avant la mise en ligne définitive, passer `afficherReperes` à `false`.

### Ajouter une comparaison avant/après

1. Déposer les deux photos dans `assets/photos/`. Elles doivent avoir le même cadrage et le même format, idéalement 4:3.
2. Dans `config.js` :
   ```js
   galerie: [
     { titre: "Citadine — intérieur", avant: "assets/photos/citadine-avant.jpg", apres: "assets/photos/citadine-apres.jpg" },
   ],
   ```

## Fonctionnement de la formule personnalisée

1. **Véhicule** : un seul choix possible, obligatoire.
2. **État** : un seul choix possible, obligatoire.
3. **Options** : plusieurs choix possibles, facultatif.
4. **Récapitulatif** : rappel des choix (chacun avec un bouton « Modifier »), emplacement du prix, puis un formulaire : nom, téléphone ou e-mail, commune, précisions.

Envoi de la demande : il n'y a pas de serveur. Le récapitulatif est transmis par les moyens de contact renseignés dans `config.js` :
- **WhatsApp**, **SMS** et **e-mail** : le message est déjà rédigé, le client n'a plus qu'à l'envoyer ;
- **Instagram** : le récapitulatif est copié, puis le profil s'ouvre (Instagram ne permet pas de pré-remplir un message) ;
- **Copier le récapitulatif** : bouton toujours disponible.

Le mode d'envoi définitif reste à valider. On peut aussi ajouter un formulaire avec envoi automatique par e-mail (Formspree, Netlify Forms…) ou un outil de réservation.

## Mise en ligne

Le site est statique, il peut donc être hébergé gratuitement :
- **Netlify** ou **Cloudflare Pages** : déposer le dossier `site-nettoyage-auto/`. Une adresse est fournie aussitôt et on peut brancher un nom de domaine ensuite.
- **GitHub Pages** : publier ce dossier depuis le dépôt.

Le lien obtenu se place dans la bio Instagram. Le site est conçu d'abord pour le mobile et fonctionne dans le navigateur intégré d'Instagram : menu mobile, bouton d'action fixe en bas de l'écran, curseur tactile, champs qui ne déclenchent pas le zoom sur iPhone.

À prévoir pour soigner l'aperçu du lien partagé : une image 1200×630 (balise `og:image` dans `index.html`).
