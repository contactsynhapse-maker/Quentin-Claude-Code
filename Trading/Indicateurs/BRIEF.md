# Brief pour Claude Code — Indicateur TradingView « PB Blake — Pré-session MTF »

## Ce que je te demande

1. Crée un dossier `Trading/Indicateurs/` sur mon PC et places-y `pbb_mtf.pine` (fourni avec ce brief).
2. Relis le script en entier et corrige toute erreur de syntaxe Pine Script v6. Il n'a encore jamais été compilé.
3. Aide-moi à l'installer dans TradingView : éditeur Pine → coller → « Enregistrer » → « Ajouter au graphique ». Si un message d'erreur apparaît, je te l'envoie et tu corriges.
4. Ne change pas la logique de trading décrite ci-dessous sans me demander. Ces règles sont validées.

## Mon contexte

- Compte Tradeify 50K (futures), exécution sur Tradovate, graphiques sur TradingView.
- Actif : MNQ (Micro E-mini Nasdaq-100).
- Méthode : PB Blake (ICT). Je trade uniquement à l'open de New York, de 9h30 à 11h00 heure de NY (15h30–17h00 à Paris, sauf pendant les semaines où les changements d'heure sont décalés).
- RR visé : 1,1 à 1,5, rarement 2–3. Stop au swing low/high 1 minute. Cible = la liquidité la plus évidente (« low hanging fruit »).
- Règles journalières : 1 stop loss = j'arrête la journée. 1 take profit = j'arrête. Un break-even = je peux retrader.

## Ma stratégie en 4 étapes

1. **Tendance HTF et Draw on Liquidity** (1D, 4H, 1H, 30m, 15m). Si le prix respecte les FVG haussières, le biais est haussier. S'il respecte les FVG baissières, il est baissier. La DOL est la liquidité la plus susceptible d'être prise.
2. **Niveaux clés** (4H, 1H, 30m, 15m, 5m) : FVG, IFVG, intermediate highs/lows, CISD, rejection blocks. **Règle d'or : toujours trader avec la tendance.**
3. **Entrée après confirmation** : retracement dans un niveau clé, puis IFVG ou « good displacement » (bougie englobante dans le sens du biais).
4. **Risque et exécution** : voir les règles ci-dessus.

## Définitions validées (codées dans le script)

- **FVG haussière** : écart entre le high de la bougie n-2 et le low de la bougie n. FVG baissière : l'inverse.
- **FVG respectée / invalidée** : une FVG haussière reste valide tant qu'aucune bougie ne **clôture** sous son bas. Une mèche en dessous ne compte pas. Une clôture en dessous la transforme en **IFVG** baissière. C'est symétrique pour les FVG baissières.
- **Biais d'un timeframe** : le dernier événement FVG sur ce timeframe (FVG respectée, cassée ou nouvelle). Le biais du jour est une moyenne pondérée : 4H et D ×3, 1H et 30m ×2, 15m et 5m ×1.
- **Intermediate low** : le prix mèche dans une FVG haussière et la respecte. Le bas de cette mèche devient l'intermediate low, **confirmé** quand le prix repasse au-dessus du plus haut d'avant le retracement. C'est un niveau où le prix revient souvent avant de repartir. Intermediate high : même logique inversée.
- **CISD haussier** : pendant un retracement dans une FVG haussière, les petits timeframes font des plus bas de plus en plus bas. Le CISD se déclenche quand une bougie **clôture** au-dessus de l'**open** de la première bougie de la série baissière qui a fait le plus bas. Ce niveau devient un support clé. CISD baissier : l'inverse.
- **Rejection block haussier** : dans une grosse FVG haussière 15m, 30m, 1H ou 4H, une bougie **haussière** (dans le sens de la tendance, c'est obligatoire) laisse une grande mèche basse. Le rejection block est la zone de la mèche, de l'open au low. Il est invalidé par une clôture sous le low. Rejection block baissier : une bougie **baissière** avec une grande mèche haute dans une FVG baissière, zone de l'open au high.
- **Range / marché choppy** : le prix ne respecte ni les FVG haussières ni les FVG baissières. Un TF est « en range » quand, sur ses derniers événements FVG, des FVG ↑ **et** des FVG ↓ ont été cassées et que le sens change sans arrêt. Un TF en range ne vote pas pour le biais. Si assez de poids est en range, le biais du jour est **RANGE** et on ne trade pas. Si le score est trop faible, le biais est « pas de biais » au lieu d'un faux haussier/baissier.

## Ce que fait l'indicateur

- Un tableau de bord avec le biais par timeframe, le biais du jour, la DOL ↑/↓ (PDH/PDL, PWH/PWL, highs/lows d'Asie et de Londres), la fenêtre NY en heure de Paris avec compte à rebours, et une checklist en 5 points.
- Sur le graphique : FVG/IFVG multi-timeframe, intermediate highs/lows, CISD, rejection blocks et lignes de liquidité.
- Une alerte sur CISD dans le sens du biais pendant la fenêtre NY.
- Pas de repaint : les données HTF utilisent uniquement les bougies clôturées.

## Idées pour la suite (ne pas faire sans mon accord)

- Détecter les « good displacements » (bougie englobante) comme 2e type de confirmation.
- Intégrer ces données à mon application de journal de trading.
