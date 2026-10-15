# Indicateurs TradingView

| Fichier | Rôle |
|---|---|
| `pbb_mtf.pine` | Indicateur « PB Blake — Pré-session MTF » (Pine Script v6) |
| `BRIEF.md` | Règles de la stratégie et définitions validées |

## Installation dans TradingView

1. Ouvrir un graphique **MNQ1!** (en 1m, 3m ou 5m pour la séance NY).
2. En bas de l'écran, ouvrir l'onglet **Éditeur Pine**.
3. Menu du nom du script → **Créer un nouveau → Indicateur**, puis tout sélectionner (Ctrl+A) et supprimer.
4. Coller tout le contenu de `pbb_mtf.pine`.
5. **Enregistrer** (Ctrl+S), nom : `PBB MTF`.
6. **Ajouter au graphique**.
7. En cas d'erreur : copier le message rouge de la console (avec le numéro de ligne) et l'envoyer pour correction.

## Alerte CISD

Icône réveil → **Créer une alerte** → Condition : `PBB MTF` → **N'importe quel appel de fonction alert()** → Créer.

## Notes

- Les TF inférieurs au graphique affichent « n/a » et ne comptent pas dans le biais.
- Pas de repaint : les données HTF n'utilisent que des bougies clôturées.

## Affichage (version épurée)

- **FVG** : une ligne fine noire au début de la FVG, avec le texte centré dessus (ex. « 5m fvg »).
- **ITL / ITH** : même style (ex. « 1h ITL »). Dès qu'un ITL/ITH se forme sur une FVG, la FVG n'est plus affichée : c'est l'ITL qui devient le niveau à surveiller. Un ITL/ITH cassé par une clôture disparaît.
- **Tableau** : biais du jour + score, puis pour chaque TF coché « Tableau » : structure (HH/HL, LH/LL) et dernier signal FVG.
- **Options (désactivées par défaut)** : IFVG et CISD pour les entrées, rejection blocks, liquidité (PDH/PDL, PWH/PWL, Asie, Londres), fond de la fenêtre NY.
- Par TF : « Tracer » = dessiner ses FVG/ITL/ITH, « Tableau » = l'afficher dans le tableau, « Poids » = son poids dans le biais.

## Détection des ranges (marché choppy)

Réglages : groupe « Range / marché choppy ».

- **Par TF** : sur les 6 derniers événements FVG, si des FVG ↑ **et** ↓ ont été cassées avec au moins 3 changements de sens, le TF affiche `Range ↔`. Il ne compte plus dans le biais.
- **Global** : si au moins 40 % du poids est en range, le biais du jour affiche `RANGE ↔` et l'alerte CISD est coupée.
- **Conviction** : si |score| est inférieur à 30 % du score max, le biais affiche « NEUTRE » au lieu d'un biais léger.

Ces seuils sont des valeurs de départ, à ajuster sur l'historique.
