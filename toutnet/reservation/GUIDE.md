# Réservation en ligne Tout'Net — guide d'installation

Le système tourne **gratuitement** sur le compte Google de Tout'Net (`tout.net81@gmail.com`) :

| Outil Google | Rôle |
|---|---|
| **Google Agenda** « Tout'Net — Disponibilités » | Quentin y crée ses plages libres (ex. samedi 9h–18h) |
| **Google Agenda** « Tout'Net — Rendez-vous » | Les réservations y apparaissent automatiquement (jaune = à confirmer, vert = confirmé) |
| **Google Sheets** « Tout'Net — Réservations » | Historique de tous les clients + réglages (durées, battement…) |
| **Gmail** | Notification à chaque demande, avec les boutons **Accepter / Refuser** |

Comptez environ 15 minutes, une seule fois.

---

## 1. Créer la feuille et coller le script

1. Se connecter à Google avec **tout.net81@gmail.com**.
2. Créer une nouvelle feuille sur [sheets.new](https://sheets.new) et la nommer **Tout'Net — Réservations**.
3. Menu **Extensions → Apps Script**.
4. Dans l'éditeur, effacer le contenu de `Code.gs` et coller tout le contenu du fichier [`Code.gs`](Code.gs) de ce dossier.
5. Cliquer sur ⚙️ **Paramètres du projet**, cocher **« Afficher le fichier manifeste appsscript.json »**, revenir à l'éditeur, ouvrir `appsscript.json` et remplacer son contenu par celui du fichier [`appsscript.json`](appsscript.json).
6. Enregistrer (💾).

## 2. Lancer l'installation

1. En haut de l'éditeur, choisir la fonction **`installer`** puis cliquer sur **Exécuter**.
2. Google demande des autorisations : **Examiner les autorisations**, choisir le compte, puis **Paramètres avancés** et **Accéder à … (non sécurisé)**, et enfin **Autoriser**.
   *C'est normal : le script est le vôtre, Google ne l'a simplement pas « vérifié ».*
3. Résultat :
   - trois onglets dans la feuille : **Réservations**, **Réglages**, **Durées** ;
   - deux nouveaux agendas dans Google Agenda : **Tout'Net — Disponibilités** et **Tout'Net — Rendez-vous**.

## 3. Publier le service

1. Cliquer sur **Déployer → Nouveau déploiement**.
2. Cliquer sur ⚙️ à côté de « Type », puis choisir **Application Web**.
3. **Exécuter en tant que : Moi** · **Qui a accès : Tout le monde**.
4. Cliquer sur **Déployer** et copier l'**URL de l'application Web** (elle se termine par `/exec`).
5. Coller cette URL dans le site, fichier `toutnet/site/js/config.js` :
   ```js
   reservation: {
     apiUrl: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ```
6. Publier la modification du site (commit). La réservation en ligne est active.

> Test rapide : ouvrir l'URL `/exec` dans un navigateur doit afficher `{"ok":true,"service":"Tout'Net — réservation"}`.

## 4. Régler les durées (important)

Dans l'onglet **Durées**, la colonne **Minutes** indique le temps d'intervention pour chaque type de véhicule et chaque formule, ainsi que le temps ajouté par chaque option.
**Les valeurs de départ sont provisoires : Quentin doit les ajuster** selon son expérience.

Dans l'onglet **Réglages** :

| Réglage | Rôle |
|---|---|
| `battement_minutes` | Temps libre minimum entre deux rendez-vous (trajet). Par défaut 30. |
| `pas_minutes` | Écart entre deux heures proposées (30 → 9h00, 9h30…) |
| `delai_minimum_heures` | Délai minimum avant un rendez-vous (par défaut 24 h) |
| `horizon_jours` | Nombre de jours à l'avance où l'on peut réserver (par défaut 45) |
| `email_notification` | Adresse qui reçoit les demandes |
| `bloquer_agenda_principal` | `oui` = les événements de l'agenda Google personnel bloquent aussi les créneaux |
| `site_web` | Adresse du site, citée dans les e-mails envoyés aux clients |

Les modifications sont prises en compte immédiatement, sans redéployer.

## 5. Au quotidien (Quentin)

### Donner ses disponibilités
Dans l'appli **Google Agenda** du téléphone, créer un événement dans l'agenda **Tout'Net — Disponibilités** (par exemple « Dispo », samedi de 9h à 18h). On peut le rendre **récurrent** (tous les samedis…).
- Le site ne propose que les heures où **toute la durée de l'intervention tient dans la plage**, sans chevaucher un autre rendez-vous, en respectant le temps de battement.
- Pour bloquer un moment : réduire ou supprimer la plage, ou ajouter un événement « Indisponible » dans **Tout'Net — Rendez-vous**.
- Les événements « journée entière » ne comptent pas comme disponibilités : il faut indiquer des heures.

### Recevoir et valider les demandes
1. À chaque réservation, le créneau est **bloqué aussitôt** (en jaune dans l'agenda) et Quentin reçoit un e-mail avec tous les détails : véhicules, formule, adresse (lien Google Maps), téléphone, estimation.
2. Il clique sur **✅ Accepter** ou **❌ Refuser**, puis confirme sur la page qui s'ouvre.
   - **Accepter** : l'événement passe au vert et le client reçoit un e-mail de confirmation.
   - **Refuser** : le créneau est libéré et le client est prévenu.
3. Depuis un ordinateur, on peut aussi sélectionner une ligne de l'onglet **Réservations**, puis utiliser le menu **Tout'Net → Accepter / Refuser**.

Pour être notifié instantanément, activer les notifications de l'appli **Gmail** sur le téléphone.

### SMS (option)
Si Quentin est abonné **Free Mobile** : dans l'Espace abonné, aller dans **Mes options → Notifications par SMS**, activer l'option et copier l'identifiant et la clé dans `free_sms_user` / `free_sms_pass` (onglet Réglages). Il recevra alors un SMS à chaque demande.
Pour les autres opérateurs, il faut un service payant (Twilio, Brevo…) : à voir ensemble si besoin.

Pour vérifier les notifications, utiliser le menu **Tout'Net → Envoyer un e-mail de test**.

## 6. Accès à deux

Partager avec le compte Google de l'autre administrateur, en mode **éditeur** :
- la feuille **Tout'Net — Réservations** (bouton Partager) ;
- les deux agendas (Google Agenda → ⋮ à côté de l'agenda → Paramètres et partage → « Partager avec des personnes » → « Apporter des modifications »).

## 7. Mettre à jour le script

Après avoir modifié `Code.gs` : **Déployer → Gérer les déploiements → ✏️ → Version : Nouvelle version → Déployer**.
L'URL `/exec` reste la même, il n'y a rien à changer sur le site.

## Limites à connaître

- Un compte Gmail gratuit peut envoyer **100 e-mails par jour**, soit environ 30 réservations par jour (3 e-mails chacune).
- Si le service ne répond pas, le site propose automatiquement au client d'envoyer sa demande par e-mail, WhatsApp ou SMS.
