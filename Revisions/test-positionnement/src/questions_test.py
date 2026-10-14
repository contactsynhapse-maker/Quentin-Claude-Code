# -*- coding: utf-8 -*-
r"""Questions reprises du test de positionnement A2 (31/08/2023).

Chaque question garde son numéro d'origine (id "T<numéro>").
Les maths sont écrites en TeX entre \( \) (rendu MathJax).
Quand la correction surlignée du test d'origine était discutable,
la bonne réponse est retenue et une note l'explique.
"""
from common import single, multi, tf, num, text, match, kmap

SYMB_OPTS = [
    "Contact de relai de commande",
    "Commande mécanique manuelle par poussoir",
    "Commande mécanique manuelle par levier",
    "Commande mécanique manuelle rotative",
    "Commande mécanique manuelle « coup de poing »",
]
SYMB_EXPL = (
    "Le type de commande manuelle se lit sur le petit signe placé devant le trait pointillé : "
    "<b>créneau en « F »</b> = rotative ; <b>crochet [</b> = poussoir ; <b>demi-cercle (</b> = coup de poing "
    "(arrêt d'urgence) ; <b>trait oblique terminé par un rond</b> = levier."
)
RELAIS_OPTS = [
    "Relai de commande",
    "Relai de commande à action retardée",
    "Relai de commande à repos retardé",
    "Contact de relai de commande",
    "Contact de relai de commande à action retardée",
    "Contact de relai de commande à repos retardé",
]
RELAIS_EXPL = (
    "Bobine (rectangle avec A1/A2) = <b>relai</b> ; trait de contact avec NO = <b>contact</b>. "
    "Bobine simple = relai ordinaire ; case <b>noircie</b> = relai temporisé <b>au repos</b> (retombée retardée) ; "
    "case avec une <b>croix</b> = relai temporisé <b>à l'action</b> (appel retardé). Sur un contact, le petit "
    "demi-cercle (« parachute ») indique la temporisation : il freine le contact dans un seul sens, "
    "à la fermeture (action retardée) ou à l'ouverture (repos retardé)."
)
CAPT_OPTS = [
    "Détecteur de proximité capacitif",
    "Codeur optique de position angulaire",
    "Capteur de position électromécanique",
    "Détecteur photoélectrique « barrage »",
    "Détecteur photoélectrique « reflex »",
    "Détecteur de proximité inductif",
]
DISJ_OPTS = [
    "Un disjoncteur thermique tripolaire",
    "Un disjoncteur magnétique tripolaire",
    "Un disjoncteur magnétothermique tripolaire",
    "Un disjoncteur magnétothermique bipolaire",
    "Un disjoncteur magnétique bipolaire",
    "Un disjoncteur thermique bipolaire",
]
DISJ_EXPL = (
    "Nombre de pôles = nombre de lignes de puissance (3 → tripolaire). Le <b>demi-cercle</b> sur chaque pôle "
    "symbolise le déclencheur <b>magnétique</b> (court-circuit) ; le <b>créneau rectangulaire</b> symbolise le "
    "déclencheur <b>thermique</b> (surcharge). Les deux ensemble → magnétothermique."
)


def build():
    # ---------------- 1 à 30 ----------------
    single("T1", "maths", r"Parmi les fonctions suivantes, laquelle est une primitive de \(\dfrac{\cos(3x)}{3}\) ?",
           [r"\(\dfrac{\sin(3x)}{9}\)", r"\(-3\sin(3x)\)", r"\(-\dfrac{\sin(3x)}{3}\)", r"\(\sin(3x)\)"], 0,
           r"Une primitive de \(\cos(ax)\) est \(\dfrac{\sin(ax)}{a}\). Donc \(\dfrac13\cdot\dfrac{\sin(3x)}{3}=\dfrac{\sin(3x)}{9}\). "
           r"Vérification : \(\left(\dfrac{\sin 3x}{9}\right)'=\dfrac{3\cos 3x}{9}=\dfrac{\cos 3x}{3}\).")
    single("T2", "constr", "L'épaulement est la combinaison de :",
           ["Profilage et dressage", "Chariotage et profilage", "Chariotage et dressage", "Dressage et rainurage"], 2,
           "Un épaulement = un cylindre obtenu par <b>chariotage</b> (outil parallèle à l'axe) + une face plane "
           "perpendiculaire obtenue par <b>dressage</b> (outil perpendiculaire à l'axe).")
    text("T3", "meca", "Un solide en équilibre soumis à 3 efforts (non parallèles) voit les directions de ces efforts… <i>(un seul mot)</i>",
         ["concourantes", "concourante", "concourants", "concourant", "concourent", "concourir"],
         "Elles sont <b>concourantes</b> : 3 forces non parallèles qui maintiennent un solide en équilibre sont "
         "coplanaires, leurs droites d'action passent par un même point, et leur somme vectorielle est nulle "
         "(triangle des forces fermé).", hint="concourantes")
    single("T4", "maths", r"Soit \(u(x)\) dérivable sur \(\mathbb R\). La dérivée de \(\cos(u(x))\) est :",
           [r"\(\sin(u(x))\)", r"\(\cos(u'(x))\)", r"\(u'(x)\sin(u(x))\)", r"\(-u'(x)\sin(u(x))\)"], 3,
           r"Dérivée d'une composée : \((\cos u)' = u'\times\cos'(u) = -u'\sin u\).")
    single("T5", "auto", "Donner le nom du symbole :", SYMB_OPTS, 3, SYMB_EXPL, img=["q005.png"])
    tf("T6", "fr", "L'annonce du plan de l'écriture personnelle se fait au conditionnel.", False,
       "On annonce le plan au présent ou au futur (« nous verrons d'abord… puis… »). Le conditionnel exprime "
       "une hypothèse et affaiblit l'annonce.")
    single("T7", "maths", r"On considère le complexe \(z=\dfrac{1-i\sqrt3}{2i}\). Quelles sont ses coordonnées dans le plan complexe ?",
           [r"\(\left(\dfrac{\sqrt3}{2};\dfrac12\right)\)", r"\(\left(-\dfrac{\sqrt3}{2};-\dfrac12\right)\)",
            r"\(\left(-\dfrac12;-\dfrac{\sqrt3}{2}\right)\)", r"\(\left(-\dfrac12;\dfrac{\sqrt3}{2}\right)\)"], 1,
           r"\(\dfrac{1}{2i}=\dfrac{-i}{2}\) (car \(i\times(-i)=1\)). Donc \(z=\dfrac{(1-i\sqrt3)(-i)}{2}=\dfrac{-i+i^2\sqrt3}{2}=\dfrac{-\sqrt3-i}{2}\). "
           r"Partie réelle \(-\frac{\sqrt3}{2}\), partie imaginaire \(-\frac12\).")
    multi("T8", "auto", r"Cochez la ou les bonnes réponses : \((a+b+c)\cdot\overline{c}=\)",
          [r"\((a+b)\cdot\overline c+c\)", r"\(a\cdot\overline c+b\cdot\overline c\)", r"\(a+b\)", r"\(\overline c\cdot(a+b)\)"], [1, 3],
          r"On développe : \(a\overline c+b\overline c+c\,\overline c\). Or \(c\cdot\overline c=0\). Il reste \(a\overline c+b\overline c=\overline c\,(a+b)\) : les deux écritures sont équivalentes.")
    single("T9", "auto", "Donner le type de capteur ou détecteur ci-contre :", CAPT_OPTS, 1,
           "On voit un <b>disque gradué</b>, une DEL, un réticule et un axe avec accouplement : c'est un <b>codeur optique</b> "
           "qui mesure une position angulaire (incrémental ou absolu).", img=["q009.jpg"])
    single("T10", "auto", "Ce symbole d'un schéma électrique représente :", DISJ_OPTS, 1,
           DISJ_EXPL + " Ici il n'y a que des demi-cercles → <b>magnétique tripolaire</b>.", img=["q010.png"])
    single("T11", "maths", r"Une solution de l'équation différentielle \(y'+2y=-\dfrac43\) est :",
           [r"\(-e^{2x}+\dfrac43\)", r"\(e^{-2x}-\dfrac23\)", r"\(-\dfrac12e^{x^2}+\dfrac23\)", r"\(e^{-2x}-\dfrac43\)"], 1,
           r"Solutions : \(y=Ce^{-2x}+y_p\), avec \(y_p\) constante : \(2y_p=-\frac43\Rightarrow y_p=-\frac23\). "
           r"Avec \(C=1\) : \(e^{-2x}-\frac23\). Vérif : \(y'+2y=-2e^{-2x}+2e^{-2x}-\frac43\) ✓.")
    single("T12", "elec", "Un réseau linéaire de bornes A et B est modélisé par un générateur de Thévenin (E<sub>Th</sub>, R<sub>Th</sub>). Quelle affirmation est <b>erronée</b> ?",
           ["Pour trouver E<sub>Th</sub>, on détermine U<sub>AB</sub> lorsque le circuit est ouvert en A ou B (donc I = 0).",
            "Pour trouver R<sub>Th</sub>, on détermine la résistance équivalente du réseau, toutes les sources indépendantes étant éteintes.",
            "Pour trouver E<sub>Th</sub>, on détermine U<sub>AB</sub> lorsque l'on court-circuite A et B (donc U<sub>AB</sub> = 0)."], 2,
           "E<sub>Th</sub> est la <b>tension à vide</b> (I = 0). En court-circuit, U<sub>AB</sub> = 0 par définition : "
           "on y mesure le courant de Norton I<sub>N</sub> = E<sub>Th</sub>/R<sub>Th</sub>, pas E<sub>Th</sub>.", img=["q012.png"])
    single("T13", "maths", r"Le discriminant du polynôme \(P(x)=x^2-4x+5\) vaut :", ["−36", "−4", "4", "0"], 1,
           r"\(\Delta=b^2-4ac=16-20=-4\) (négatif : pas de racine réelle).")
    tf("T14", "fr", "Une conclusion d'écriture personnelle répond obligatoirement à la problématique.", True,
       "La conclusion apporte une réponse claire à la problématique posée en introduction, puis peut ouvrir.")
    single("T15", "maths", r"Soit \(g(x)=\dfrac{3x+4}{7-2x}\). Sa dérivée est :",
           [r"\(\dfrac{-27x-7}{(7-2x)^2}\)", r"\(\dfrac{13}{(7-2x)^2}\)", r"\(-\dfrac32\)", r"\(\dfrac{29}{(7-2x)^2}\)"], 3,
           r"\(\left(\dfrac uv\right)'=\dfrac{u'v-uv'}{v^2}\) avec \(u'=3\), \(v'=-2\) : \(3(7-2x)+2(3x+4)=21-6x+6x+8=29\).")
    multi("T16", "gestion", "Parmi ces caractéristiques de Bouygues Construction, cochez les <b>menaces</b> du diagnostic externe.",
          ["L'affaire de la cyberattaque de Bouygues en 2020 n'est pas encore réglée.",
           "Pour les nouveaux permis de construire, il faut créer des bâtiments à énergie positive, ce qui augmente énormément les coûts de construction.",
           "Les taux d'intérêt (d'emprunt) augmentent.",
           "Bouygues affiche une perte de 134 millions d'euros au premier semestre 2023.",
           "Bouygues va réaliser la plus haute tour de Grèce."], [1, 2],
          "Le diagnostic externe (opportunités / menaces) porte sur l'<b>environnement</b> : réglementation, taux "
          "d'intérêt, marché. La cyberattaque et la perte semestrielle concernent l'entreprise elle-même "
          "(diagnostic interne → faiblesses) ; la tour en Grèce est une force.")
    match("T17", "auto", "Associez le vocabulaire du Grafcet aux repères 1 à 9 de la figure.",
          [("Étape initiale", "Repère 5"), ("Étape", "Repère 1"), ("Convergence en OU", "Repère 7"),
           ("Divergence en OU", "Repère 4"), ("Convergence en ET", "Repère 2"), ("Action", "Repère 8"),
           ("Divergence en ET", "Repère 3"), ("Transition", "Repère 6"), ("Réceptivité", "Repère 9")],
          ["Repère %d" % i for i in range(1, 10)],
          "Étape initiale = <b>double carré</b> (5). Divergence / convergence en OU = <b>trait simple</b> qui se sépare (4) "
          "ou se rejoint (7). Divergence / convergence en ET = <b>double trait</b> (3 et 2). L'action est le rectangle "
          "à droite d'une étape (8), la transition le petit trait horizontal (6), la réceptivité la condition écrite à côté (9).",
          img=["q017.png"],
          note="La flèche 1 vise l'étape 50 avec son action ; la correction du test l'associe à « Étape » et garde 8 pour « Action ».")
    num("T18", "constr", "Donner, en mm, l'ajustement <b>minimal</b> 10 H9 f8 (valeur exacte, signe + = jeu, signe − = serrage).<br>"
        "Écarts pour un diamètre de 6 à 10 mm : <b>H9</b> = +36 / 0 µm ; <b>f8</b> = −13 / −35 µm.",
        0.013, 0.0005, "mm",
        "Jeu mini = alésage mini − arbre maxi = (10 + 0) − (10 − 0,013) = <b>+0,013 mm</b>. "
        "(Jeu maxi = 0,036 + 0,035 = 0,071 mm.)")
    multi("T19", "gestion", "La SARL, c'est :",
          ["Une société à responsabilité limitée que l'on appelle aussi société hybride",
           "Une société dont les associés sont responsables sur leurs biens personnels",
           "Une société dont les règles de fonctionnement sont définies dans des statuts",
           "Une société dont le responsable est le gérant",
           "Une société avec au moins 2 associés et sans maximum d'associés"], [0, 2, 3],
          "SARL : responsabilité <b>limitée aux apports</b>, société « hybride » (entre société de personnes et de "
          "capitaux), fonctionnement fixé par des <b>statuts</b>, dirigée par un ou plusieurs <b>gérants</b>, "
          "de 1 (EURL) à 100 associés.",
          note="La correction du test ne retenait que a et c. La SARL est pourtant bien dirigée par un gérant (d).")
    single("T20", "anglais", "Next year I ______ at Airbus.", ["have worked", "will be working", "work"], 1,
           "Action en cours à un moment du futur → futur progressif <b>will be working</b>.")
    multi("T21", "auto", "Grafcet : cochez les bonnes cases.",
          ["L'état initial remet le système en condition initiale", "L'étape initiale est toujours en début de grafcet",
           "Une étape initiale ne peut être forcée", "Il peut y avoir plusieurs étapes initiales dans un même grafcet",
           "L'étape initiale garantit l'état initial"], [1, 2, 4],
          "Réponses attendues par la correction : b, c et e. L'étape initiale (double carré) est active au démarrage "
          "et garantit l'état initial du système.",
          note="Selon la norme Grafcet (IEC 60848), un grafcet peut en fait contenir plusieurs étapes initiales (d) ; la correction du test ne la retenait pas.")
    single("T22", "maths", r"Quel est le DL à l'ordre 3 en 0 de \(\exp(x)\) ?",
           [r"\(x+\dfrac{x^2}{2}+\dfrac{x^3}{3!}+x^3\varepsilon(x)\)", r"\(1+x+\dfrac{x^2}{2}+\dfrac{x^3}{6}+x^3\varepsilon(x)\)",
            r"\(1-x+\dfrac{x^2}{2}-\dfrac{x^3}{3!}+x^3\varepsilon(x)\)", r"\(1+x-\dfrac{x^2}{2}+\dfrac{x^3}{6}+x^3\varepsilon(x)\)"], 1,
           r"\(e^x=\sum \dfrac{x^k}{k!}=1+x+\dfrac{x^2}{2}+\dfrac{x^3}{6}+x^3\varepsilon(x)\) : tous les signes sont +, et le terme constant vaut 1.")
    single("T23", "elec", r"On dispose de l'ALI ci-contre alimenté par \(\pm V_{alim}\). Quelle propriété est <b>erronée</b> ?",
           [r"\(i_{S\max}\simeq i^++i^-\simeq 20\ \text{mA}\)", r"\(V_{alim^-}<V_S<V_{alim^+}\)", r"\(i^-\simeq i^+\simeq 0\ (\simeq 10\ \text{pA})\)"], 0,
           "Les courants d'entrée sont quasi nuls (pA) : ils ne peuvent pas fournir le courant de sortie. Le courant de sortie "
           "(quelques dizaines de mA au maximum) vient des alimentations (i<sub>p+</sub>, i<sub>p−</sub>).", img=["q023.png"])
    text("T24", "constr", "Un matériau qui ne possède pas les mêmes propriétés dans toutes les directions de l'espace est dit :",
         ["anisotrope", "non isotrope", "nonisotrope", "pas isotrope"],
         "<b>Anisotrope</b> (non isotrope) : bois, composites à fibres, tôles laminées. Isotrope = mêmes propriétés dans toutes les directions.",
         hint="anisotrope")
    tf("T25", "fr", "Le langage familier est un des niveaux de langue.", True,
       "Trois niveaux de langue : familier, courant, soutenu.")
    match("T26", "auto", "Bascule JK (front montant) : complétez la sortie Q<sub>n+1</sub>.",
          [("J = x, K = x, H = ↓ (front descendant)", "État précédent"), ("J = x, K = x, H = x (pas de front)", "État précédent"),
           ("J = 0, K = 0, H = ↑", "État précédent"), ("J = 0, K = 1, H = ↑", "0"), ("J = 1, K = 0, H = ↑", "1"),
           ("J = 1, K = 1, H = ↑", "Q̄n (basculement)")],
          ["État précédent", "0", "1", "Qn", "Q̄n (basculement)", "État interdit"],
          "Sans front montant, Q garde son état. Sur ↑ : J = K = 0 → mémoire ; J = 0, K = 1 → mise à 0 ; J = 1, K = 0 → mise à 1 ; "
          "J = K = 1 → <b>basculement</b> (Q prend Q̄n). Pas d'état interdit, contrairement à la bascule RS.", img=["q026.png"])
    single("T27", "constr", "Le nom commercial Inconel fait référence à une famille :",
           ["d'alliages d'aluminium", "de superalliages", "de fontes", "d'alliages d'acier"], 1,
           "L'Inconel est un <b>superalliage</b> base nickel-chrome, utilisé à haute température (turbines, échappements).")
    single("T28", "auto", "Donner le nom du symbole :", RELAIS_OPTS, 4, RELAIS_EXPL, img=["q028.png"])
    single("T29", "elec", "La fonction de transfert harmonique du circuit RC ci-contre (sortie u aux bornes de C) est :",
           [r"\(\underline H(j\omega)=\dfrac{R}{R+jC\omega}\)", r"\(\underline H(j\omega)=\dfrac{1}{1+jRC\omega}\)", r"\(\underline H(j\omega)=\dfrac{jC\omega}{R+jC\omega}\)"], 1,
           r"Diviseur de tension : \(\underline H=\dfrac{Z_C}{R+Z_C}\) avec \(Z_C=\dfrac{1}{jC\omega}\). On multiplie par \(jC\omega\) : \(\underline H=\dfrac{1}{1+jRC\omega}\) (passe-bas du 1er ordre).",
           img=["q029.png"])
    single("T30", "maths", r"Quel complexe est le résultat du produit de \(5e^{i\frac{4\pi}{9}}\), \(1{,}8e^{-i\frac{\pi}{3}}\) et \(e^{i\frac{2\pi}{9}}\) ?",
           [r"\(9e^{i\frac{\pi}{3}}\)", r"\(9e^{i\frac{\pi}{9}}\)", r"\(6{,}8e^{i\frac{\pi}{9}}\)", r"\(6{,}8e^{i\frac{\pi}{3}}\)"], 0,
           r"On multiplie les modules : \(5\times1{,}8\times1=9\). On additionne les arguments : \(\frac{4\pi}{9}-\frac{3\pi}{9}+\frac{2\pi}{9}=\frac{3\pi}{9}=\frac{\pi}{3}\).")

    # ---------------- 31 à 60 ----------------
    single("T31", "elec", "Dans le circuit ci-contre :",
           ["D'après la loi des nœuds, I<sub>1</sub> = I<sub>2</sub>.", "D'après la loi des nœuds, I − I<sub>1</sub> − I<sub>2</sub> = 0.",
            "D'après la loi des mailles, U<sub>AB</sub> = R<sub>1</sub>·I<sub>1</sub>."], 1,
           "Loi des nœuds : somme des courants entrants = somme des courants sortants, donc I = I<sub>1</sub> + I<sub>2</sub>. "
           "I<sub>1</sub> = I<sub>2</sub> seulement si R<sub>1</sub> = R<sub>2</sub>. U<sub>AB</sub> = R<sub>1</sub>I<sub>1</sub> est la loi d'Ohm, pas la loi des mailles.",
           img=["q031.png"])
    match("T32", "constr", "Identifier les différents éléments filetés (repères 1 à 4).",
          [("Repère 1", "Vis"), ("Repère 2", "Goujon"), ("Repère 3", "Boulon"), ("Repère 4", "Écrou")],
          ["Vis", "Goujon", "Boulon", "Écrou", "Tige filetée"],
          "<b>Vis</b> : une tête + une tige filetée. <b>Goujon</b> : tige filetée aux deux bouts, sans tête. "
          "<b>Boulon</b> : vis + écrou. <b>Écrou</b> : pièce hexagonale taraudée.", img=["q032.png"])
    single("T34", "meca", "Une liaison réalisée par un contact cylindrique de courte portée est une liaison :",
           ["rotule", "linéaire annulaire", "pivot", "linéaire rectiligne", "pivot glissant"], 1,
           "Un cylindre <b>court</b> dans un alésage ne bloque que les 2 translations radiales : il reste 3 rotations + la "
           "translation axiale = <b>linéaire annulaire</b> (sphère-cylindre). Un contact cylindrique <b>long</b> donne un pivot glissant.")
    single("T35", "maths", r"Soit \(f(x)=2x+3+\dfrac9x\). Sa dérivée est :",
           [r"\(f'(x)=2+3+9\)", r"\(f'(x)=2-\dfrac{9}{x^2}\)", r"\(f'(x)=2+\dfrac{9}{x^2}\)", r"\(f'(x)=2+\dfrac91\)"], 1,
           r"\((2x)'=2\), \((3)'=0\), \(\left(\dfrac1x\right)'=-\dfrac1{x^2}\). Donc \(f'(x)=2-\dfrac9{x^2}\).")
    single("T36", "anglais", "I enjoyed my summer ______ at Airbus very much.", ["internment", "internship", "stage"], 1,
           "Un stage en entreprise = <b>an internship</b>. « Internment » = internement ; « stage » = scène.")
    single("T37", "elec", "L'ARQS est vérifiée pour un régime variable si :",
           ["les dimensions du circuit sont grandes (≫ 1 m).",
            "l'intensité du courant est la même en tout point d'une branche du circuit.",
            "le temps caractéristique de sa variation (τ pour un condensateur, T pour un signal du GBF) est petit devant le temps de propagation."], 1,
           "ARQS = approximation des régimes quasi stationnaires. Elle est valable quand le <b>temps de propagation</b> du signal "
           "dans le circuit est négligeable devant le <b>temps caractéristique</b> de variation (τ, T). Conséquence : à chaque "
           "instant, le courant est le même en tout point d'une branche. La 3e proposition inverse l'inégalité.",
           note="La correction du test surlignait la 3e proposition, mais elle est écrite à l'envers : c'est le temps de propagation qui doit être petit devant τ ou T.")
    single("T38", "anglais", "The company's ______ are on strike because they want a salary increase.", ["employed", "employees", "employers"], 1,
           "Les salariés = <b>employees</b>. Employers = employeurs ; employed = participe passé.")
    single("T39", "constr", "Quelle est la nature de l'ajustement 10 H9 f8 ?", ["Jeu", "Serrage", "Incertain"], 0,
           "Avec un alésage H (EI = 0), les arbres <b>a à h</b> donnent du <b>jeu</b>, js à n un ajustement incertain, p à z du serrage. "
           "Ici l'arbre f8 est toujours plus petit que l'alésage (jeu de 0,013 à 0,071 mm).")
    tf("T40", "auto", "Une transition est franchie si : toutes les étapes qui la précèdent immédiatement sont actives ET la réceptivité associée est vraie.", True,
       "Règle 2 du Grafcet : la transition est <b>validée</b> quand toutes les étapes amont sont actives ; elle est <b>franchie</b> si, en plus, sa réceptivité est vraie.")
    single("T41", "constr", "Un acier qui comporte la lettre X au début de sa désignation fait partie des :",
           ["Aciers faiblement alliés", "Aciers au carbone", "Aciers fortement alliés", "Aciers purs", "Aciers superalliages"], 2,
           "X = au moins un élément d'addition ≥ 5 % (ex. X5CrNi18-10, un inox). Sans X avec teneurs codées (42CrMo4) = faiblement allié. "
           "C45 = acier non allié.")
    single("T42", "elec", r"ALI alimenté en \(\pm V_{sat}\), \(\varepsilon=v^+-v^-\). Quelle propriété est <b>erronée</b> ?",
           [r"En régime saturé, \(v_S=+V_{sat}\) ou \(v_S=-V_{sat}\).", r"En régime linéaire, \(v_S=\mu_0\varepsilon\) avec \(\mu_0\) de l'ordre de \(10^5\).",
            r"Lorsque l'ALI est idéal, son impédance d'entrée est nulle, ce qui implique \(i^+=i^-=0\)."], 2,
           "L'ALI idéal a une impédance d'entrée <b>infinie</b> : c'est pour cela que i<sup>+</sup> = i<sup>−</sup> = 0. "
           "Une impédance nulle donnerait au contraire des courants très grands.", img=["q023.png"])
    single("T43", "elec", "Dans le circuit ci-contre, identifier la relation <b>erronée</b> :",
           [r"\(I=I_1+I_2\)", r"\(I_2=\dfrac{R_1}{R_1+R_2}I\)", r"\(I_1=\dfrac{R_1}{R_1+R_2}I\)"], 2,
           r"Diviseur de courant : le courant d'une branche est proportionnel à la résistance de l'<b>autre</b> branche : "
           r"\(I_1=\dfrac{R_2}{R_1+R_2}I\) et \(I_2=\dfrac{R_1}{R_1+R_2}I\).", img=["q043.png"])
    single("T44", "maths", r"La dérivée de \(f(x)=x^2e^x\) vaut :",
           [r"\(x^2e^x\)", r"\(2xe^x+x^2\)", r"\(xe^x(2+x)\)", r"\(2xe^x\)"], 2,
           r"\((uv)'=u'v+uv'\) : \(2xe^x+x^2e^x=xe^x(2+x)\).")
    tf("T45", "gestion", "La marge libre est une partie de la marge totale.", True,
       "Marge libre ≤ marge totale. Marge totale : retard possible sans retarder la fin du projet. Marge libre : retard possible "
       "sans retarder le début des tâches suivantes.")
    single("T46", "anglais", "The Burj Khalifa is ______ building in the world.", ["the tallest", "the most tall", "the taller"], 0,
           "Superlatif d'un adjectif court : <b>the + adjectif-est</b> → the tallest.")
    tf("T47", "fr", "Dans un corpus de synthèse, la thèse de chaque document est la même.", False,
       "Les documents traitent le même thème mais avec des points de vue différents, parfois opposés : c'est ce qui permet de les confronter.")
    single("T48", "auto", "L'étape initiale est active. On effectue la séquence : appui momentané sur e1, action momentanée sur e2, "
           "action maintenue sur e3, action momentanée sur e2. Quel est l'état du système ?",
           ["Seule l'étape 20 est active", "Les étapes 10 et 20 sont actives", "Seule l'étape 10 est active",
            "L'étape 0 est active", "Les étapes 10 et 30 sont actives", "Seule l'étape 30 est active"], 3,
           "e1 → divergence en ET : <b>10 et 20</b> actives. e2 seul (e3 = 0) : e2·ē3 vrai → 20 laisse place à <b>30</b>. "
           "On relâche e2 : ē2 vrai → retour à <b>20</b> (10 toujours active). e3 maintenu : rien ne se passe. e2 avec e3 : "
           "e2·e3 vrai et 10, 20 actives → convergence en ET franchie → <b>étape 0</b>.", img=["q048.png"])
    tf("T49", "gestion", "Les micro-arrêts sont des arrêts trop courts pour que cela vaille la peine de les prendre en compte.", False,
       "Très fréquents, les micro-arrêts pèsent lourd sur le TRS (perte de performance) : on les mesure et on les traite.")
    match("T50", "auto", "Identifier les types de capteurs : photos A, B, C et symboles 1, 2, 3.",
          [("Photo A", "Optique de proximité (direct)"), ("Photo B", "Optique barrage"), ("Photo C", "Optique reflex"),
           ("Symbole 1", "Optique barrage"), ("Symbole 2", "Optique reflex"), ("Symbole 3", "Optique de proximité (direct)")],
          ["Optique de proximité (direct)", "Optique barrage", "Optique reflex"],
          "<b>Barrage</b> : émetteur et récepteur dans deux boîtiers face à face (symbole en deux parties). <b>Reflex</b> : E/R dans "
          "le même boîtier + un réflecteur. <b>Proximité (direct)</b> : E/R dans le même boîtier, c'est l'objet qui renvoie la lumière.",
          img=["q050.jpg"])
    single("T51", "anglais", "The invention of ______ made realistic painting obsolete.", ["photograph", "photography", "photographer"], 1,
           "La technique / l'art = <b>photography</b>. A photograph = une photo ; a photographer = un photographe.")
    single("T52", "elec", "La plaque d'un réfrigérateur indique W = 216 kWh/an. Quelle est l'énergie absorbée à l'année ?",
           ["60 000 kJ", "60 kJ", "777 600 kJ", "777 600 J"], 2,
           "1 kWh = 1000 W × 3600 s = 3 600 kJ. Donc 216 × 3 600 = <b>777 600 kJ</b>.")
    tf("T53", "gestion", "La standardisation est un élément essentiel du taylorisme.", False,
       "Réponse attendue : <b>Faux</b>. Le taylorisme (OST) repose sur la division du travail (verticale et horizontale), "
       "le chronométrage et le salaire au rendement. La standardisation des produits est associée au <b>fordisme</b>.")
    num("T54", "auto", "Bascule RS synchrone (front montant de H). À t = 0, Q = 1. Au bout de combien de secondes la sortie Q "
        "repassera-t-elle au niveau logique 1 ? (1 carreau = 1 s)", 6, 0, "s",
        "Fronts montants de H à t = 2, 6, 10, 14 s. À t = 2 : R = 1, S = 0 → Q passe à 0. À t = 6 : R = 0, S = 1 → "
        "Q repasse à <b>1</b>. Les impulsions de R et S entre deux fronts ne comptent pas : la bascule est synchrone.", img=["q054.png"])
    tf("T55", "gestion", "On utilise le réseau PERT pour trouver le chemin critique.", True,
       "Le PERT ordonne les tâches et donne le chemin critique : la suite de tâches à marge nulle qui fixe la durée du projet.")
    tf("T56", "meca", "Un mégapascal équivaut à un newton divisé par un centimètre carré.", False,
       "1 MPa = 10<sup>6</sup> N/m² = <b>1 N/mm²</b>. 1 N/cm² = 10<sup>4</sup> Pa = 0,01 MPa.")
    single("T57", "auto", "Ce symbole d'un schéma électrique représente :",
           ["Un disjoncteur thermique tripolaire", "Un disjoncteur magnétique tripolaire",
            "Un disjoncteur magnétothermique tripolaire", "Un disjoncteur à fusibles tripolaire"], 3,
           "Les petits rectangles traversés par le trait sur chaque pôle sont des <b>fusibles</b>, intégrés à l'appareil de coupure "
           "à 3 pôles (sectionneur porte-fusibles tripolaire).", img=["q057.png"])
    single("T58", "auto", "Donner l'équation de S à partir du tableau de Karnaugh :" + kmap(
        ["1111", "1111", "0000", "0011"]),
           [r"\(S=\overline a\,b+\overline b\,c\)", r"\(S=\overline a+\overline b\,c\)", r"\(S=\overline a\,d+\overline b\,c\)",
            r"\(S=a\,\overline c+b\)", r"\(S=a\,\overline c+b\,c\)"], 1,
           r"Lignes ab = 00 et 01 (a = 0) entièrement à 1 → terme \(\overline a\). Ligne ab = 10 : 1 pour cd = 11 et 10, soit \(c=1\) ; "
           r"on regroupe avec la ligne 00 (b = 0) → terme \(\overline b\,c\). Donc \(S=\overline a+\overline b\,c\).")
    single("T59", "anglais", "He works hard at this job, and he ______ a good salary.", ["gains", "wins", "earns"], 2,
           "On <b>earns</b> money / a salary (gagner en travaillant). Win = gagner un match ; gain = prendre (du poids, de l'expérience).")
    single("T60", "auto", "Donner le type de capteur ou détecteur ci-contre :", CAPT_OPTS, 3,
           "Émetteur et récepteur dans deux boîtiers face à face, l'objet coupe le faisceau : détecteur <b>barrage</b>.", img=["q060.jpg"])

    # ---------------- 61 à 90 ----------------
    single("T61", "elec", "La puissance moyenne d'un dipôle (régime sinusoïdal) est donnée par :",
           [r"\(P=\dfrac12U_{eff}I_{eff}\cos\Delta\varphi\)", r"\(P=U_{eff}I_{eff}\)", r"\(P=\dfrac12U_mI_m\cos\Delta\varphi\)"], 2,
           r"\(P=U_{eff}I_{eff}\cos\varphi\), et comme \(U_{eff}=\frac{U_m}{\sqrt2}\), \(I_{eff}=\frac{I_m}{\sqrt2}\) : \(P=\frac12U_mI_m\cos\varphi\). "
           r"\(U_{eff}I_{eff}\) seul est la puissance apparente S (en VA).")
    single("T62", "maths", r"Quelles sont les racines du polynôme \(P(x)=2x^2+3x-5\) ?", ["−1 et −2,5", "1 et −2,5", "−1 et 2,5", "2,5 et 1"], 1,
           r"\(\Delta=9+40=49\), \(x=\dfrac{-3\pm7}{4}\) → 1 et −2,5. Astuce : \(a+b+c=0\) donc 1 est racine, et l'autre vaut \(\frac ca=-\frac52\).")
    single("T63", "auto", "Donner l'équation de S à partir du tableau de Karnaugh :" + kmap(
        ["1111", "0111", "0011", "0001"]),
           [r"\(S=\overline a\,\overline b+c\,\overline d+\overline a\,d+b\,c\)", r"\(S=\overline a\,\overline b+c\,\overline d+\overline a\,d+a\,c\)",
            r"\(S=\overline a\,\overline b+a\,\overline d+\overline c\,d+b\,c\)", r"\(S=\overline a\,\overline b+\overline c\,d+a\,d+\overline b\,c\)",
            r"\(S=\overline a\,\overline b+c\,d+\overline a\,\overline d+b\,c\)"], 0,
           r"Ligne 00 → \(\overline a\,\overline b\). Colonne cd = 10 entièrement à 1 → \(c\,\overline d\). Carré rows 00-01 × colonnes 01-11 → \(\overline a\,d\). "
           r"Carré rows 01-11 × colonnes 11-10 → \(b\,c\). Toutes les cases à 1 sont couvertes, aucune case à 0.")
    tf("T64", "gestion", "L'intégration, c'est le contraire de l'externalisation.", True,
       "Intégration = faire soi-même (internaliser). Externalisation = confier l'activité à un prestataire.")
    tf("T65", "fr", "Un plan Causes / Conséquences / Solutions est un plan analytique.", True,
       "Le plan analytique analyse un fait : constat ou causes, conséquences, solutions.")
    num("T66", "meca", r"Degré d'hyperstatisme du mécanisme ci-contre, avec \(h=n_s-6(n-1)+m_u+m_i\) "
        r"(\(n_s\) : inconnues statiques, \(n\) : ensembles bâti inclus, \(m_u=1\), \(m_i=3\)).", 0, 0, "",
        "Ensembles : bâti, bras bleu, axe vert, pistons jaune et violet → n = 5. Liaisons : pivot vert/bleu (5), pivot bleu/bâti (5), "
        "deux sphère-plan (1 + 1), deux pivots glissants (4 + 4) → n<sub>s</sub> = 20. h = 20 − 6×4 + 1 + 3 = <b>0</b> : mécanisme isostatique.",
        img=["q066.png"])
    tf("T67", "gestion", "La division parallèle du travail fait partie du taylorisme.", True,
       "Réponse attendue : <b>Vrai</b>. Le taylorisme divise le travail horizontalement (tâches parcellisées réalisées en parallèle) "
       "et verticalement (conception / exécution).")
    single("T68", "meca", "Quel est le torseur cinématique de la liaison appui plan de normale \\(\\vec z\\) ci-contre ?",
           [r"\(\begin{Bmatrix}0&V_{Ox}\\ \omega_y&V_{Oy}\\ \omega_z&0\end{Bmatrix}_{O,\mathcal R}\)",
            r"\(\begin{Bmatrix}0&V_{Ox}\\ 0&V_{Oy}\\ \omega_z&0\end{Bmatrix}_{O,\mathcal R}\)",
            r"\(\begin{Bmatrix}0&V_{Ox}\\ 0&0\\ 0&0\end{Bmatrix}_{O,\mathcal R}\)",
            r"\(\begin{Bmatrix}\omega_x&V_{Ox}\\ \omega_y&V_{Oy}\\ \omega_z&0\end{Bmatrix}_{O,\mathcal R}\)"], 1,
           "Appui plan : 3 degrés de liberté → les 2 translations dans le plan (V<sub>x</sub>, V<sub>y</sub>) et la rotation autour "
           "de la normale (ω<sub>z</sub>).", img=["q068.png"])
    single("T69", "auto", "Donner le nom du symbole :", RELAIS_OPTS, 2, RELAIS_EXPL, img=["q069.png"])
    text("T70", "meca", "Quelle est la liaison réalisée par un contact cylindrique de courte portée ? <i>(seul le nom de la liaison est attendu)</i>",
         ["lineaire annulaire", "linéaire annulaire", "sphere cylindre", "sphère-cylindre", "annulaire"],
         "<b>Linéaire annulaire</b> (sphère-cylindre), comme à la question 34. La rotule correspond à un contact sphérique.",
         hint="linéaire annulaire",
         note="Sur ton corrigé, « Rotule » était écrit pour cette question : ce n'est pas cohérent avec la question 34 du même test.")
    multi("T71", "auto", r"En logique, \(\overline A+\overline B=\) ?",
          [r"\(A\cdot B\)", r"\(\overline{A\cdot B}\)", r"\(A+B\)", r"\(\overline{A+B}\)"], [1],
          r"Théorème de De Morgan : \(\overline A+\overline B=\overline{A\cdot B}\) et \(\overline A\cdot\overline B=\overline{A+B}\).")
    text("T72", "constr", "Identifier la chaîne de cotes permettant d'installer la cote condition b. <i>(un mot : la couleur)</i>",
         ["bleu", "bleue"],
         "Une chaîne de cotes part d'une surface terminale de la cote condition, traverse chaque pièce par ses surfaces de contact "
         "(une seule cote par pièce) et revient à l'autre surface terminale. C'est la chaîne <b>bleue</b>.", img=["q072.png"], hint="bleu")
    single("T73", "elec", "Comment calcule-t-on la valeur efficace d'un signal sinusoïdal ?",
           ["En prenant la racine carrée de l'amplitude.", "En multipliant l'amplitude par 2π.",
            "En prenant la racine carrée de la moyenne des carrés des valeurs instantanées sur une période.",
            "En multipliant l'amplitude par la fréquence."], 2,
           r"\(U_{eff}=\sqrt{\langle u^2\rangle}\) (RMS : root mean square). Pour une sinusoïde : \(U_{eff}=\dfrac{U_{max}}{\sqrt2}\).")
    single("T74", "elec", "On dispose du diagramme de Bode en gain ci-contre. Quelle affirmation est <b>erronée</b> ?",
           ["Le filtre correspondant est un filtre du second ordre.", "Le filtre correspondant est un filtre passe-haut.",
            r"La bande passante à −3 dB correspond aux pulsations telles que \(\log\frac{\omega}{\omega_c}>0\)."], 0,
           "Pente : de −60 dB (log = −3) à 0 dB (log = 0), soit <b>+20 dB/décade</b> → filtre du <b>1er ordre</b> (un 2nd ordre "
           "donnerait 40 dB/décade). C'est bien un passe-haut, de bande passante ω > ω<sub>c</sub>.", img=["q074.png"])
    num("T75", "constr", "Montage de la bielle 2 : la cote condition a est comprise entre 0,1 et 0,15 mm et la cote a2 vaut 15 H7 "
        r"(\(15^{+0{,}018}_{\ 0}\)). Calculer la valeur <b>minimale</b> de la cote a3 (au millième).", 15.118, 0.0005, "mm",
        "a = a3 − a2. a<sub>min</sub> = a3<sub>min</sub> − a2<sub>max</sub> → a3<sub>min</sub> = 0,1 + 15,018 = <b>15,118 mm</b>.", img=["q075.png"])
    match("T76", "auto", "Associez les désignations aux symboles 1 à 6 (ou « Non représenté »).",
          [("Distributeur 4/2", "Symbole 3"), ("Distributeur 2/3", "Non représenté"), ("Distributeur 4/3", "Symbole 4"),
           ("Distributeur 5/4", "Non représenté"), ("Distributeur 2/2", "Symbole 5"), ("Distributeur 1/1", "Non représenté"),
           ("Distributeur 2/1", "Symbole 1"), ("Distributeur 3/2", "Symbole 6"), ("Distributeur 5/2", "Symbole 2")],
          ["Symbole %d" % i for i in range(1, 7)] + ["Non représenté"],
          "Désignation x/y : <b>x = nombre d'orifices</b> (comptés sur une case), <b>y = nombre de positions</b> (nombre de cases). "
          "1 : 1 case, 2 orifices → 2/1. 2 : 2 cases, 5 orifices → 5/2. 3 : 4/2. 4 : 3 cases, 4 orifices → 4/3. 5 : 2/2. 6 : 3/2.",
          img=["q076.png"])
    tf("T77", "gestion", "Un TRS trop bas signifie que les machines de l'entreprise ne sont pas rapides.", False,
       "TRS = disponibilité × performance × qualité. Un TRS bas peut venir des pannes et réglages, des ralentissements ou des rebuts, "
       "pas seulement de la vitesse.")
    single("T78", "gestion", "Stock final d'une marchandise : livraison de 150 unités, stock initial avant livraison de 30 unités, sorties de "
           "140 unités, stock de sécurité de 10 unités.", ["20 unités", "10 unités", "40 unités", "30 unités"], 2,
           "Stock final = stock initial + entrées − sorties = 30 + 150 − 140 = <b>40</b>. Le stock de sécurité est un seuil, il ne s'ajoute pas.")
    single("T79", "maths", r"Quel est le DL à l'ordre 3 en 0 de \(\sin(2x)\) ?",
           [r"\(2x-\dfrac{8x^3}{3!}+x^3\varepsilon(x)\)", r"\(2x+\dfrac{8x^3}{3}+x^3\varepsilon(x)\)", r"\(2x-\dfrac{8x^3}{6}\)", r"\(2x-\dfrac{2x^3}{3}+x^3\varepsilon(x)\)"], 0,
           r"\(\sin u=u-\dfrac{u^3}{6}+u^3\varepsilon(u)\). Avec \(u=2x\) : \(2x-\dfrac{8x^3}{6}+x^3\varepsilon(x)\). La 3e proposition oublie le reste \(x^3\varepsilon(x)\) : un DL s'écrit toujours avec son reste.")
    T = r"\(\left\{T_{1\to2}\right\}=\begin{Bmatrix}%s\end{Bmatrix}_{%s,(\vec x,\vec y,\vec z)}\)"
    match("T80", "meca", "Attribuer à chaque torseur des actions mécaniques transmissibles la liaison correspondante.",
          [(T % (r"0&0\\ 0&M_{A}\\ Z&0", "A"), "Linéaire rectiligne"),
           (T % (r"0&L_{A}\\ Y&M_{A}\\ Z&N_{A}", "A"), "Glissière"),
           (T % (r"X&0\\ Y&0\\ Z&0", "O"), "Rotule"),
           (T % (r"0&L_{A}\\ 0&M_{A}\\ Z&0", "A"), "Appui plan")],
          ["Linéaire rectiligne", "Glissière", "Rotule", "Appui plan", "Pivot", "Linéaire annulaire"],
          "Une composante nulle = un mouvement possible. 1 : seuls Z et M → linéaire rectiligne (normale z, droite de contact selon x). "
          "2 : seul X est nul → translation selon x → glissière. 3 : moment nul en O → 3 rotations → rotule. 4 : Z, L, M → appui plan de normale z.")
    tf("T81", "constr", "Un matériau déformé plastiquement revient à sa forme initiale après avoir relâché la contrainte.", False,
       "Déformation <b>élastique</b> = réversible. Déformation <b>plastique</b> = permanente.")
    match("T82", "constr", "Attribuer la nature de trait à chaque type d'élément représenté.",
          [("Filetage (fond de filet)", "Trait continu fin"), ("Axe de révolution ou de symétrie", "Trait mixte fin"),
           ("Plan de coupe", "Trait mixte fin à extrémités en trait fort"), ("Forme réelle vue", "Trait continu fort"),
           ("Forme réelle cachée", "Trait interrompu fin")],
          ["Trait continu fin", "Trait mixte fin", "Trait mixte fin à extrémités en trait fort", "Trait continu fort", "Trait interrompu fin"],
          "Arêtes vues : continu fort. Arêtes cachées : interrompu (pointillé) fin. Axes : mixte fin. Plan de coupe : mixte fin "
          "renforcé aux extrémités. Fond de filet, hachures, cotes : continu fin.")
    single("T83", "elec", "P est la puissance absorbée par un système (W) et W l'énergie absorbée pendant un temps t (J). Quelle est la bonne affirmation ?",
           ["P·W = t", "t = P/W", "P = W/t"], 2, "La puissance est une énergie par unité de temps : <b>P = W / t</b> (W = P·t).")
    single("T84", "auto", "Donner le nom du symbole :", RELAIS_OPTS, 0, RELAIS_EXPL, img=["q084.png"])
    tf("T85", "fr", "La neutralité est obligatoire en synthèse.", True,
       "La synthèse restitue objectivement les idées des documents, sans donner son avis.")
    single("T86", "maths", r"Une primitive de \(\dfrac{x}{1+3x^2}\) est :",
           [r"\(\dfrac{3}{1+3x}\)", r"\(-3\ln(1+x^2)\)", r"\(\dfrac16\ln(1+3x^2)\)", r"\(\dfrac13\arctan(3x^2)\)", r"\(\dfrac13\ln(1+x^2)\)"], 2,
           r"Forme \(\frac{u'}{u}\) : avec \(u=1+3x^2\), \(u'=6x\), donc \(\dfrac{x}{1+3x^2}=\dfrac16\cdot\dfrac{u'}{u}\) → primitive \(\dfrac16\ln(1+3x^2)\).")
    multi("T87", "gestion", "La stratégie de diversification présente les caractéristiques suivantes :",
          ["Une entreprise doit absolument se diversifier pour assurer sa pérennité.",
           "Elle pourrait permettre de réaliser des économies d'échelle.", "Elle pourrait entraîner des effets de synergie.",
           "Elle permet d'augmenter la notoriété même en cas d'échec de la nouvelle activité.", "Une meilleure répartition des risques."],
          [1, 2, 3, 4],
          "La diversification (nouveaux produits / marchés) répartit les risques et peut créer synergies et économies d'échelle. "
          "Elle n'est pas obligatoire : beaucoup d'entreprises pérennes restent spécialisées.")
    single("T88", "gestion", "La structure qui permet à certains managers de combiner une responsabilité opérationnelle et une responsabilité fonctionnelle ou géographique, c'est :",
           ["la structure hiérarchico-fonctionnelle", "la structure fonctionnelle", "la structure matricielle", "la structure divisionnelle", "la structure hiérarchique"], 2,
           "Structure <b>matricielle</b> : double rattachement (par projet / produit et par fonction ou zone).")
    multi("T89", "gestion", "Concernant la Société par Actions Simplifiée (SAS), cochez les réponses justes :",
          ["Créer une société dont le statut est souple et la responsabilité limitée aux apports.",
           "Créer une société dont le capital social est libre.",
           "Créer une société dont les associés sont responsables solidairement et indéfiniment.",
           "Créer une société avec un Président pour la gérer.", "Créer une société avec 5 associés minimum."], [0, 1, 3],
          "SAS : statuts très libres, responsabilité limitée aux apports, capital librement fixé, dirigée obligatoirement par un "
          "<b>Président</b>, 1 associé minimum (SASU).")
    single("T90", "anglais", "I wanted to take an Excel course, but the ______ fee was too expensive.", ["enrolling", "enroll", "enrollment"], 2,
           "Il faut un nom devant « fee » : <b>enrollment fee</b> = frais d'inscription.")

    # ---------------- 91 à 120 ----------------
    num("T91", "constr", "Même montage (a entre 0,1 et 0,15 mm, a2 = 15 H7). Calculer la valeur <b>maximale</b> de la cote a3 (au millième).",
        15.150, 0.0005, "mm",
        "a<sub>max</sub> = a3<sub>max</sub> − a2<sub>min</sub> → a3<sub>max</sub> = 0,15 + 15,000 = <b>15,150 mm</b>.", img=["q075.png"])
    single("T92", "auto", "Donner le nom du symbole :", SYMB_OPTS, 4, SYMB_EXPL, img=["q092.png"])
    single("T93", "elec", "Dans le spectre ci-contre, quelle affirmation est <b>erronée</b> ?",
           ["La première harmonique a une fréquence de 1000 Hz.", "La composante continue est nulle.", "La fondamentale a une fréquence de 500 Hz."], 0,
           "Fondamentale = 1re harmonique = raie non nulle de plus basse fréquence = <b>500 Hz</b>. 1000 Hz est l'harmonique 2. "
           "Aucune raie à 0 Hz → composante continue nulle.", img=["q093.png"])
    single("T94", "auto", "Donner le type de capteur ou détecteur ci-contre :", CAPT_OPTS, 5,
           "Oscillateur + bobine qui détecte un <b>objet métallique</b> sans contact : détecteur de proximité <b>inductif</b>.", img=["q094.jpg"])
    single("T95", "elec", "Quelle est la fonction réalisée par ce montage ?", ["Comparateur à hystérésis", "Dérivateur", "Amplificateur inverseur"], 0,
           "La résistance R<sub>2</sub> renvoie la sortie sur l'entrée <b>+</b> : réaction positive → l'ALI sature. Avec V<sub>e</sub> sur l'entrée −, "
           "c'est un <b>comparateur à hystérésis</b> (trigger de Schmitt inverseur), de seuils ± R<sub>1</sub>/(R<sub>1</sub>+R<sub>2</sub>)·V<sub>sat</sub>.",
           img=["q095.png"])
    single("T96", "elec", "On dispose du diagramme de Bode en gain ci-contre. Quelle affirmation est <b>erronée</b> ?",
           ["Le filtre correspondant est un filtre coupe-bande.", "Le filtre correspondant est un filtre passif.",
            r"La bande passante à −3 dB est \(]-\infty;\log x_1[\,\cup\,]\log x_2;+\infty[\)."], 1,
           "Le gain maximal G<sub>0</sub> est <b>au-dessus de 0 dB</b> (gain > 1) : un filtre passif ne peut pas amplifier, il faut un "
           "filtre <b>actif</b>. Le creux central en fait bien un coupe-bande.", img=["q096.png"])
    single("T97", "maths", r"Le module du produit des complexes \(z_1=-2+2i\), \(z_2=-1+2i\), \(z_3=-1+3i\) est :",
           [r"\(4\sqrt{10}\)", r"\(3\sqrt{10}\)", r"\(20\)", r"\(10\sqrt2\)"], 2,
           r"Module d'un produit = produit des modules : \(|z_1|=\sqrt8\), \(|z_2|=\sqrt5\), \(|z_3|=\sqrt{10}\) → \(\sqrt{8\times5\times10}=\sqrt{400}=20\).")
    tf("T98", "gestion", "La méthode des cinq zéros est d'origine américaine.", False,
       "Elle est d'origine <b>japonaise</b> (toyotisme) : zéro panne, zéro défaut, zéro stock, zéro délai, zéro papier.")
    single("T99", "gestion", "Quel est le temps requis si le TRS est égal à 80 % et le temps utile à 6,75 heures ?",
           ["512 minutes", "500 minutes", "518 minutes", "506 minutes"], 3,
           "TRS = temps utile / temps requis → temps requis = 6,75 / 0,8 = 8,4375 h = 506,25 min ≈ <b>506 min</b>.")
    match("T100", "meca", "Complétez les mouvements relatifs possibles de chaque liaison.",
          [("Pivot glissant d'axe y", "Ry, Ty"), ("Rotule de centre O", "Rx, Ry, Rz"), ("Linéaire annulaire d'axe y", "Rx, Ry, Rz, Ty")],
          ["Ry, Ty", "Rx, Ry, Rz", "Rx, Ry, Rz, Ty", "Ty", "Ry"],
          "Pivot glissant : rotation + translation le long de l'axe. Rotule : 3 rotations. Linéaire annulaire : 3 rotations + translation selon l'axe.")
    single("T101", "meca", r"Comment définit-on le moment au point O d'une force appliquée au point A ?",
           [r"\(\overrightarrow{M_O}(\vec F_A)=\vec F_A\wedge\overrightarrow{AO}\)", r"\(\overrightarrow{M_O}(\vec F_A)=\vec F_A\cdot\overrightarrow{OA}\)",
            r"\(\overrightarrow{M_O}(\vec F_A)=\vec F_A\cdot\overrightarrow{AO}\)", r"\(\overrightarrow{M_O}(\vec F_A)=\vec F_A\wedge\overrightarrow{OA}\)"], 0,
           r"\(\overrightarrow{M_O}=\overrightarrow{OA}\wedge\vec F=\vec F\wedge\overrightarrow{AO}\) (le produit vectoriel change de signe quand on inverse l'ordre). "
           r"Un moment est un vecteur : ce n'est jamais un produit scalaire.")
    single("T102", "maths", r"À quelle courbe correspond la fonction \(f_2(x)=x^2+x+3\) ?", ["C1", "C2", "C3", "C4", "C5"], 0,
           r"\(f_2(0)=3\) : la courbe passe par (0 ; 3). Coefficient de \(x^2\) positif → parabole ouverte vers le haut. "
           r"Sommet en \(x=-\frac{b}{2a}=-0{,}5\), \(f_2(-0{,}5)=2{,}75\) → <b>C1</b>.", img=["q102.png"])
    match("T103", "auto", "Grafcet : faites correspondre les débuts de phrase et les fins.",
          [("Une étape peut être…", "active ou inactive"), ("Une transition peut être…", "validée puis franchie"),
           ("Une réceptivité peut être…", "vraie ou fausse"), ("Une étape active permet à la transition suivante d'être…", "validée"),
           ("Le franchissement d'une transition rend les étapes précédentes…", "inactives")],
          ["active ou inactive", "validée puis franchie", "vraie ou fausse", "validée", "inactives"],
          "Une étape est active ou inactive ; une transition est validée (étapes amont actives) puis franchie (réceptivité vraie) ; "
          "une réceptivité est vraie ou fausse ; le franchissement désactive les étapes amont et active les étapes aval.",
          note="Question reformulée : l'énoncé d'origine utilisait plusieurs fois les mêmes débuts de phrase.")
    multi("T104", "meca", "Les informations présentes sur un schéma cinématique sont :",
          ["les formes des pièces", "l'orientation des liaisons", "la dimension des pièces", "les positions relatives des centres de contact"], [1, 3],
          "Le schéma cinématique est une représentation simplifiée : il montre les liaisons, leur orientation et leurs positions "
          "relatives, sans forme ni dimension réelle des pièces.")
    single("T105", "anglais", "Thank you for taking time to answer our questions. We now have all the ______ we need.", ["information", "informations", "informed"], 0,
           "<b>Information</b> est indénombrable en anglais : jamais de « s ».")
    single("T106", "elec", r"L'application du théorème de Millman au potentiel \(V_0\) dans le circuit ci-contre donne :",
           [r"\(V_0=\dfrac{\frac1{R_1}+\frac1{R_2}+\frac1{R_3}}{\frac{V_1}{R_1}+\frac{V_2}{R_2}+\frac{V_3}{R_3}}\)",
            r"\(V_0=\dfrac{\frac{V_1}{R_1}+\frac{V_2}{R_2}+\frac{V_3}{R_3}}{\frac1{R_1}+\frac1{R_2}+\frac1{R_3}}\)", r"\(V_0=\dfrac{R_1}{R_1+R_2}V_1\)"], 1,
           r"Millman : \(V_0=\dfrac{\sum V_i/R_i}{\sum 1/R_i}\), une moyenne des potentiels pondérée par les conductances. Vérif d'unité : V au numérateur.",
           img=["q106.png"])
    single("T107", "auto", "Donner le nom du symbole :", SYMB_OPTS, 1, SYMB_EXPL, img=["q107.png"])
    match("T108", "auto", "Identifier les types de capteurs (images 1 à 4).",
          [("Capteur inductif", "Image 3"), ("Capteur ILS", "Image 4"), ("Capteur optique à barrage", "Image 2"), ("Capteur capacitif", "Image 1")],
          ["Image 1", "Image 2", "Image 3", "Image 4"],
          "Le losange signale un détecteur de proximité : le dessin à l'intérieur précise le principe (condensateur → capacitif, "
          "bobine → inductif). Barrage : émetteur et récepteur séparés (E / R). ILS : contact sous ampoule actionné par un aimant.",
          img=["q108.jpg"])
    single("T109", "gestion", "Quel type de management permet l'empowerment des salariés ?",
           ["le management directif", "le management persuasif", "le management consultatif", "le management paternaliste", "le management participatif"], 4,
           "Le management <b>participatif</b> délègue et associe les salariés aux décisions (empowerment = responsabilisation).")
    match("T110", "auto", r"Faites les bonnes associations (\(\overline a\) = complément de a).",
          [(r"\(\overline a+a\)", "1"), (r"\(\overline a\cdot a\)", "0"), (r"\(a+0\)", "a"), (r"\(a\cdot1\)", "a"), (r"\(a\cdot0\)", "0"),
           (r"\(a\cdot a\cdot\overline a\)", "0"), (r"\(a+1\)", "1"), (r"\(a\cdot a\)", "a")],
          ["0", "1", "a", "ā"],
          "Règles de base de l'algèbre de Boole : a + ā = 1, a·ā = 0, a + 0 = a, a·1 = a, a·0 = 0, a + 1 = 1, a·a = a (idempotence).")
    single("T111", "maths", r"Une primitive de la fonction \(x^n\) (\(n\neq-1\)) est :",
           [r"\(\dfrac{1}{n+1}x^{n+1}\)", r"\(\dfrac1nx^{n+1}\)", r"\(x^{n+1}\)", r"\(x^{n+1}+x\)"], 0,
           r"On augmente l'exposant de 1 et on divise par le nouvel exposant. Vérif : \(\left(\dfrac{x^{n+1}}{n+1}\right)'=x^n\).")
    single("T112", "meca", "Dans le calcul d'un moment provoqué par une force en un point, quelle est l'orientation du bras de levier par rapport à la force ?",
           ["confondu", "perpendiculaire", "parallèle", "sécant", "aligné"], 1,
           "M = F × d, où le bras de levier d est la distance du point à la droite d'action de la force, mesurée <b>perpendiculairement</b> à celle-ci.")
    single("T113", "elec", "W = 216 kWh/an. Le réfrigérateur fonctionne à 100 % pendant 2 h 30 par jour (365 jours). Sa puissance électrique en fonctionnement vaut :",
           ["237 W", "864 W", "237 kW", "864 kW"], 0,
           "Durée annuelle : 2,5 h × 365 = 912,5 h. P = W / t = 216 000 Wh / 912,5 h ≈ <b>237 W</b>.")
    match("T114", "constr", "Définir les différents types de dessin (images 1 à 4, de gauche à droite).",
          [("Image 1", "Dessin d'assemblage"), ("Image 2", "Dessin de définition"), ("Image 3", "Perspective"), ("Image 4", "Dessin d'ensemble")],
          ["Dessin d'ensemble", "Dessin de définition", "Perspective", "Dessin d'assemblage"],
          "Dessin de <b>définition</b> : une seule pièce, entièrement cotée. Dessin d'<b>ensemble</b> : toutes les pièces repérées avec "
          "une nomenclature. <b>Perspective</b> : vue en 3D. Dessin d'<b>assemblage</b> : montre comment les pièces s'assemblent.", img=["q114.jpg"])
    single("T115", "maths", r"On considère le complexe \(z=2+i(3-7i)\). Quelle est sa partie imaginaire ?", ["7", "3 − 7i", "−7", "3"], 3,
           r"\(z=2+3i-7i^2=2+3i+7=9+3i\). La partie imaginaire est le réel <b>3</b> (sans le i).")
    tf("T116", "gestion", "Le bureau des méthodes a besoin de connaître les moyens de production disponibles au sein de l'entreprise.", True,
       "Il prépare les gammes de fabrication : il doit savoir sur quelles machines et avec quels outillages on peut produire.")
    tf("T117", "gestion", "Il n'est pas nécessaire de maximiser le TRS de toutes les ressources pour maximiser le TRS d'une ligne de production.", True,
       "Le débit d'une ligne est fixé par son <b>goulot</b> d'étranglement : c'est son TRS qu'il faut améliorer en priorité.")
    single("T118", "auto", "Donner le nom du symbole :", RELAIS_OPTS, 3, RELAIS_EXPL, img=["q118.png"])
    single("T119", "auto", "Donner le nom du symbole :", RELAIS_OPTS, 1, RELAIS_EXPL, img=["q119.png"])
    single("T120", "constr", "La MIP signifie :", ["Aucune des réponses proposées", "Maintien indirect de position", "Maintien indifférencié de position", "Mise en position"], 3,
           "<b>MIP = mise en position</b> (placer la pièce de façon isostatique) ; MAP = maintien en position (la serrer).")

    # ---------------- 121 à 150 ----------------
    single("T121", "elec", r"Dans le circuit RC ci-contre (régime sinusoïdal imposé par \(e(t)=E\cos\omega t\)), quelle est l'équation différentielle vérifiée par \(u(t)\) ?",
           [r"\(\dfrac{du}{dt}+\dfrac{1}{RC}u(t)=\dfrac{e(t)}{RC}\)", r"\(\dfrac{du}{dt}+\dfrac{1}{RC}u(t)=0\)",
            r"\(u(t)+\dfrac1{RC}\dfrac{du}{dt}=e(t)\)", r"\(\dfrac{du}{dt}+\dfrac{1}{RC}u(t)=e(t)\)"], 0,
           r"Loi des mailles : \(e=Ri+u\) avec \(i=C\dfrac{du}{dt}\), donc \(RC\dfrac{du}{dt}+u=e\), soit \(\dfrac{du}{dt}+\dfrac{u}{RC}=\dfrac{e}{RC}\).",
           img=["q121.png"],
           note="Dans le test d'origine, la réponse surlignée était du/dt + u/RC = e(t), sans 1/RC devant e : c'est une coquille. L'équation exacte est RC·du/dt + u = e(t).")
    single("T122", "maths", r"Une solution de l'équation différentielle \(-\dfrac13y'-3y=0\) est :",
           [r"\(-\dfrac13e^{3x}\)", r"\(e^{-9x}\)", r"\(e^{-3x}\)", r"\(-e^{3x}\)"], 1,
           r"On multiplie par \(-3\) : \(y'+9y=0\), donc \(y=Ce^{-9x}\).")
    single("T123", "elec", "Un dipôle est traversé par un courant i, de charge q pendant un temps t avec une différence de potentiel U. Quelle est la bonne affirmation ?",
           ["U = di/dt", "q = dU/dt", "i = dq/dt", "i = dU/dt"], 2, "Le courant est le débit de charges : <b>i = dq/dt</b>.")
    single("T124", "auto", "Donner le nom du symbole :", RELAIS_OPTS, 5, RELAIS_EXPL, img=["q124.png"])
    match("T125", "meca", "Attribuer à chaque effort le calcul correspondant.",
          [("Force de ressort", "F = k·x"), ("Couple de force", "C = F·d"), ("Poids", "P = m·g"), ("Force de pression", "F = p·S")],
          ["F = k·x", "C = F·d", "P = m·g", "F = p·S", "P = m/g", "F = p/S"],
          "Ressort : F = k·x (k en N/m). Couple : C = F·d. Poids : P = m·g. Pression : p = F/S, donc F = p·S.",
          note="Le test d'origine proposait « P = m/g » et « F = p/S » : ce sont des coquilles, les formules exactes sont P = m·g et F = p·S.")
    single("T126", "maths", r"Quelle est la forme trigonométrique de \(-7+7i\) ?",
           [r"\(7\sqrt2\left(\cos\frac{5\pi}4+i\sin\frac{5\pi}4\right)\)", r"\(7\sqrt2\left(\cos\frac{3\pi}4+i\sin\frac{3\pi}4\right)\)",
            r"\(7\sqrt2\left(\cos\left(-\frac{\pi}4\right)+i\sin\left(-\frac{\pi}4\right)\right)\)"], 1,
           r"Module : \(\sqrt{49+49}=7\sqrt2\). \(\cos\theta=-\frac{\sqrt2}2\), \(\sin\theta=+\frac{\sqrt2}2\) → 2e quadrant : \(\theta=\frac{3\pi}4\).")
    multi("T127", "maths", r"Quel complexe est le résultat du quotient de \(2{,}5e^{-i\pi/3}\) par \(e^{i\,11\pi/3}\) ? <i>(plusieurs réponses possibles)</i>",
          [r"\(2{,}5e^{-i\frac{12\pi}{3}}\)", r"\(2{,}5e^{i\frac{13\pi}{12}}\)", r"\(\dfrac52e^{i\frac{10\pi}{3}}\)", r"\(\dfrac52\)"], [0, 3],
          r"On divise les modules (2,5 / 1) et on soustrait les arguments : \(-\frac{\pi}3-\frac{11\pi}3=-\frac{12\pi}3=-4\pi\). Or \(e^{-4i\pi}=1\) : le quotient vaut 2,5 = 5/2. Les écritures a et d sont égales.",
          note="La correction du test ne surlignait que la première écriture ; la dernière (5/2) est le même nombre.")
    tf("T128", "auto", "« ET » est un connecteur logique.", True, "ET, OU, NON (et leurs combinaisons NAND, NOR, XOR) sont les opérateurs logiques de base.")
    match("T129", "auto", "Associer les mots aux images A à E.",
          [("Capteur", "D"), ("Bouton poussoir", "C"), ("Distributeur", "A"), ("Nourrice", "E"), ("Vérin", "B")],
          ["A", "B", "C", "D", "E"],
          "A : électrodistributeur (bobines aux extrémités). B : vérins. C : bouton poussoir (tête de commande). D : capteur de position "
          "à galet. E : nourrice (bloc de distribution d'air avec raccords).", img=["q129.jpg"])
    single("T130", "constr", "La MIP/MAP est une opération réalisée :",
           ["En tournage et en fraisage", "En MOCN uniquement", "En tournage conventionnel uniquement", "En fraisage numérique uniquement", "En conventionnel uniquement"], 0,
           "Toute pièce usinée doit être mise et maintenue en position, quel que soit le procédé ou la machine.")
    single("T131", "auto", "Donner le type de capteur ou détecteur ci-contre :", CAPT_OPTS, 4,
           "Émetteur et récepteur dans le même boîtier, faisceau renvoyé par un <b>réflecteur</b>, l'objet coupe le faisceau : détecteur <b>reflex</b>.",
           img=["q131.jpg"])
    num("T133", "constr", "Identifier la représentation orthogonale (1 à 12) correspondant à la pièce illustrée en perspective.", 7, 0, "",
        "Méthode européenne : vue de face, vue de gauche placée à droite, vue de dessus placée en dessous. On vérifie la cohérence "
        "des arêtes (vues et cachées) d'une vue à l'autre : seule la représentation <b>7</b> convient.", img=["q133a.png", "q133b.jpg"])
    single("T134", "elec", "Dans le spectre ci-contre, quelle affirmation est <b>erronée</b> ?",
           ["La deuxième harmonique a une fréquence double de la fondamentale.", "La quatrième harmonique a une fréquence nulle.",
            "La troisième harmonique a une fréquence triple de la première harmonique."], 1,
           "La 4e harmonique a pour fréquence 4 × 500 = 2000 Hz. C'est son <b>amplitude</b> qui est nulle (pas de raie), pas sa fréquence.",
           img=["q093.png"])
    tf("T135", "gestion", "Un projet peut avoir plusieurs chemins critiques.", True,
       "Si deux chemins ont la même durée maximale, ils sont tous les deux critiques (marges nulles).",
       note="La correction du test indiquait « Faux ». En planification (PERT), plusieurs chemins critiques sont pourtant possibles.")
    single("T136", "meca", "Quel calcul vectoriel permet de déplacer un moment de force d'un point Q vers un point P ?",
           [r"\(\overrightarrow{M_P}=\overrightarrow{M_Q}+\vec F\cdot\overrightarrow{PQ}\)", r"\(\overrightarrow{M_P}=\overrightarrow{M_Q}+\vec F\wedge\overrightarrow{PQ}\)",
            r"\(\overrightarrow{M_P}=\overrightarrow{M_Q}+\vec F\cdot\overrightarrow{QP}\)", r"\(\overrightarrow{M_P}=\overrightarrow{M_Q}+\vec F\wedge\overrightarrow{QP}\)"], 3,
           r"Formule de transport (« BABAR ») : \(\overrightarrow{M_P}=\overrightarrow{M_Q}+\overrightarrow{PQ}\wedge\vec F=\overrightarrow{M_Q}+\vec F\wedge\overrightarrow{QP}\).")
    single("T137", "auto", "Ce symbole d'un schéma électrique représente :",
           ["Un relai magnétique tripolaire", "Un relai magnétothermique bipolaire", "Un relai magnétique bipolaire",
            "Un relai magnétothermique tripolaire", "Un relai thermique bipolaire", "Un relai thermique tripolaire"], 5,
           "Le <b>créneau rectangulaire</b> sur chacun des 3 pôles est l'élément thermique (bilame) : <b>relai thermique tripolaire</b> "
           "(protection contre les surcharges).", img=["q137.png"])
    tf("T138", "fr", "En écriture personnelle, « Pourtant » en début de phrase de transition révèle un plan concessif.", True,
       "« Pourtant », « cependant », « certes… mais » marquent la concession : on admet une idée puis on la nuance.")
    single("T139", "auto", "Ce symbole d'un schéma électrique représente :", DISJ_OPTS, 2,
           DISJ_EXPL + " Ici on a les créneaux <b>et</b> les demi-cercles sur 3 pôles → <b>magnétothermique tripolaire</b>.", img=["q139.png"])
    match("T141", "constr", "Dénommer chacune de ces perspectives (de gauche à droite).",
          [("Perspective 1", "Cavalière"), ("Perspective 2", "Isométrique"), ("Perspective 3", "Dimétrique redressée")],
          ["Cavalière", "Isométrique", "Dimétrique redressée"],
          "<b>Cavalière</b> : face avant en vraie grandeur, fuyantes inclinées. <b>Isométrique</b> : 3 axes à 120°, même réduction. "
          "<b>Dimétrique</b> : deux axes avec la même réduction, le troisième différent.", img=["q141.jpg"])
    single("T142", "maths", r"La dérivée de \(f(x)=\sin(x)e^{-3x}\) est :",
           [r"\((\cos x-3\sin x)e^{-3x}\)", r"\(3\cos(x)e^{-3x}\)", r"\(-3\cos(x)e^{-3x}\)", r"\(-(\cos x-3\sin x)e^{-3x}\)"], 0,
           r"\((uv)'=u'v+uv'\) : \(\cos x\,e^{-3x}+\sin x\cdot(-3e^{-3x})=(\cos x-3\sin x)e^{-3x}\).")
    match("T143", "gestion", "Reliez les caractéristiques à chaque circuit de distribution.",
          [("Un intermédiaire unique vend les produits aux consommateurs ; l'entreprise se concentre sur la production.", "Circuit court"),
           ("L'entreprise vend directement au client, sans intermédiaire ; marge plus forte, efforts marketing plus importants.", "Circuit direct"),
           ("Plusieurs intermédiaires : l'entreprise vend à un grossiste qui vend à un détaillant.", "Circuit long")],
          ["Circuit direct", "Circuit court", "Circuit long"],
          "Direct : 0 intermédiaire. Court : 1 intermédiaire (détaillant). Long : au moins 2 (grossiste + détaillant).")
    tf("T144", "gestion", "Le Lean est un concept qui vise à réduire les gaspillages.", True,
       "Le Lean chasse les gaspillages (muda) : surproduction, attentes, stocks, transports, défauts, gestes inutiles…")
    single("T145", "anglais", "I am taking Spanish lessons ______ be able to speak with my work colleagues from Madrid.", ["to", "can", "for"], 0,
           "But d'une action → <b>to</b> + verbe (« in order to »). « For » ne s'emploie pas devant un verbe à l'infinitif.")
    single("T146", "elec", "On décrit l'évolution temporelle d'un signal V<sub>E</sub> (noir) et d'un signal V<sub>S</sub> (rouge). Quelle affirmation est <b>erronée</b> ?",
           ["Le déphasage entre les signaux est positif.", r"La valeur absolue du déphasage est \(|\Delta\varphi|=d\times\dfrac{2\pi}{D}\).",
            r"\(V_E\) est en avance de phase sur \(V_S\)."], 2,
           r"V<sub>S</sub> (rouge) passe par son maximum <b>avant</b> V<sub>E</sub> : c'est V<sub>S</sub> qui est en avance. "
           r"\(|\Delta\varphi|=2\pi\dfrac dD\) avec d le décalage temporel et D la période.", img=["q146.png"])
    multi("T147", "auto", r"On note \(L=\overline a+b\,(c+\overline d)\). Cochez les affirmations vraies.",
          ["L est alimenté si j'appuie sur a et b simultanément", "L est alimenté si j'appuie sur c et d simultanément",
           "L n'est pas alimenté si j'actionne le contact a uniquement", "L est toujours alimenté", "L est alimenté si je n'actionne aucun contact"],
          [0, 1, 2, 4],
          r"a et b (c = d = 0) : \(0+1\cdot(0+1)=1\) ✓. c et d (a = 0) : \(\overline a=1\) ✓. a seul : \(0+0=0\) → pas alimenté ✓. "
          r"Aucun contact : \(\overline a=1\) ✓. L n'est donc pas toujours alimenté (cas « a seul »).",
          note="La correction du test ne cochait pas c, mais le calcul montre que c est vraie.")
    single("T148", "maths", r"On considère \(z=\dfrac{1-i\sqrt3}{2i}\). Quel est son module ?",
           [r"\(1\)", r"\(\sqrt{\sqrt3}\)", "On ne peut pas le calculer", r"\(\sqrt{\dfrac{\sqrt3}2+\dfrac12}\)"], 0,
           r"\(|z|=\dfrac{|1-i\sqrt3|}{|2i|}=\dfrac{\sqrt{1+3}}{2}=\dfrac22=1\).")
    single("T149", "elec", "Dans le circuit ci-contre :",
           [r"D'après la loi des mailles, \(U_{AB}+U_{BC}+U_{CD}+U_{DA}=0\).", r"D'après la loi des nœuds, \(V_A=V_D\).",
            r"D'après la loi des nœuds, \(U_{AB}+U_{CB}+U_{DC}+U_{AD}=0\)."], 0,
           "Loi des mailles : en parcourant la maille A → B → C → D → A, la somme des tensions fléchées dans le sens du parcours est nulle. "
           "La loi des nœuds porte sur des courants, pas des tensions.", img=["q149.png"])
    single("T150", "elec", "On souhaite appliquer le théorème de superposition au circuit ci-contre. Quelle proposition décrit le mieux la méthode ?",
           ["On allume toutes les sources indépendantes sauf une, on calcule les courants, on recommence pour chaque source, puis on somme.",
            "On allume toutes les sources dépendantes sauf une, on calcule les courants, on recommence pour chaque source, puis on somme.",
            "On éteint toutes les sources indépendantes sauf une, on calcule les courants, on recommence pour chaque source, puis on somme."], 2,
           "On garde <b>une seule</b> source indépendante allumée à la fois (sources de tension éteintes = court-circuit, sources de courant "
           "éteintes = circuit ouvert), puis on additionne les contributions.", img=["q150.png"])

    # ---------------- 151 à 180 ----------------
    single("T151", "auto", "Donner le type de capteur ou détecteur ci-contre :", CAPT_OPTS, 2,
           "Levier à galet qui actionne un contact : capteur de position <b>électromécanique</b> (fin de course).", img=["q151.jpg"])
    match("T152", "auto", "Installation de piscine : faites les bonnes associations.",
          [("Sonde pH", "Capteur"), ("Bassin", "Effecteur"), ("Coffret électrique", "Partie commande"), ("Filtre", "Effecteur"),
           ("Cellule d'électrolyse", "Actionneur"), ("Pompe", "Actionneur")],
          ["Capteur", "Actionneur", "Effecteur", "Partie commande"],
          "<b>Capteur</b> : prélève une information (sonde pH). <b>Partie commande</b> : traite les informations (coffret). "
          "<b>Actionneur</b> : convertit l'énergie électrique en énergie utile (pompe, cellule). <b>Effecteur</b> : agit sur la "
          "matière d'œuvre, ici l'eau (filtre, bassin).", img=["q152.jpg"])
    single("T153", "anglais", "The Empire State Building is ______ the Eiffel Tower.", ["tallest than", "tall as", "taller than"], 2,
           "Comparatif d'un adjectif court : <b>adjectif-er + than</b> → taller than.")
    multi("T154", "gestion", "La société anonyme (SA), c'est :",
          ["Une société dont le dirigeant est responsable tant au niveau civil qu'au niveau pénal",
           "Une société dans laquelle il faut créer un conseil d'administration",
           "Une société dont il faut au moins 10 associés si elle est cotée en bourse",
           "Une société dont le capital est d'au moins 30 000 euros",
           "On l'appelle société anonyme et pourtant tous les associés se connaissent"], [0, 1],
          "SA : dirigeants responsables civilement et pénalement, conseil d'administration (ou directoire + conseil de surveillance), "
          "2 actionnaires minimum (7 si cotée), capital minimum <b>37 000 €</b>. « Anonyme » : les actionnaires ne sont pas nommés dans les statuts.")
    multi("T155", "auto", "Cochez les bonnes cases.",
          ["Le tableau de Karnaugh est construit avec le binaire naturel", "Le tableau de Karnaugh est construit avec le binaire réfléchi",
           "Le tableau de Karnaugh est construit avec le code Gray"], [1, 2],
          "Code Gray = binaire réfléchi : un seul bit change entre deux cases voisines (00, 01, 11, 10). C'est ce qui permet les regroupements.")
    single("T156", "elec", "La puissance instantanée est donnée par la relation :",
           [r"\(p(t)=\dfrac12u(t)\times i(t)\)", r"\(p(t)=\dfrac1{T}\int_0^{T}p(t)\,dt\)", r"\(p(t)=u(t)\times i(t)\)"], 2,
           r"Puissance instantanée : \(p(t)=u(t)\,i(t)\). L'intégrale sur une période donne la puissance <b>moyenne</b> P.")
    single("T157", "maths", r"On considère \(z=2+i(3-7i)\). Quelle est sa forme algébrique ?", ["2 − 4i", "9 + 3i", "−5 + 3i", "C'est déjà sous forme algébrique"], 1,
           r"\(i\times(-7i)=-7i^2=+7\) : \(z=2+7+3i=9+3i\).")
    single("T158", "auto", "Donner le nom du symbole :", SYMB_OPTS, 2, SYMB_EXPL, img=["q158.png"])
    single("T159", "constr", "L'opération de dressage consiste à déplacer l'outil coupant :", ["Parallèlement à l'axe de rotation", "Perpendiculairement à l'axe de rotation"], 1,
           "Dressage : outil perpendiculaire à l'axe → face plane. Chariotage : outil parallèle à l'axe → cylindre.")
    multi("T160", "gestion", "En ce qui concerne la gamme de produits :",
          ["La gamme de produits fait partie des 4 P", "L'extension de gamme, c'est quand l'entreprise étoffe la gamme existante en ajoutant un ou plusieurs produits",
           "Il faut éviter d'innover au niveau de la gamme de produits", "La gamme se caractérise par sa largeur, sa profondeur et sa longueur",
           "La gamme doit être identique sur une année civile"], [0, 1, 3],
          "La gamme relève du P « Produit » (produit, prix, place, promotion). Largeur = nombre de lignes, profondeur = nombre de produits "
          "par ligne, longueur = total. Elle évolue (innovation, extension) et n'est pas figée.")
    single("T161", "elec", "Dans le circuit ci-contre, identifier la relation <b>erronée</b> :",
           [r"\(E=U_{R1}+U_{R2}\)", r"\(U_{R1}=\dfrac{R_1}{R_1+R_2}E\)", r"\(U_{R2}=\dfrac{R_1}{R_1+R_2}E\)"], 2,
           r"Diviseur de tension : la tension aux bornes d'une résistance est proportionnelle à <b>cette</b> résistance : \(U_{R2}=\dfrac{R_2}{R_1+R_2}E\).",
           img=["q161.png"])
    single("T162", "elec", "L'admittance complexe d'une capacité est donnée par :", [r"\(Y=jC\omega\)", r"\(Y=-j\dfrac1{C\omega}\)", r"\(Y=j\dfrac1{C\omega}\)"], 0,
           r"Impédance \(Z_C=\dfrac1{jC\omega}=-\dfrac{j}{C\omega}\) ; l'admittance est son inverse : \(Y=jC\omega\).")
    tf("T163", "fr", "Une problématique peut être formulée en deux questions.", False, "La problématique se formule en <b>une</b> question claire.")
    tf("T165", "meca", "Le mégapascal est une unité de mesure de la force.", False,
       "Le MPa mesure une <b>pression</b> ou une <b>contrainte</b> (N/mm²). La force s'exprime en newtons.")
    single("T166", "auto", "Cochez la bonne case.", ["Les bascules sont des circuits séquentiels", "Les bascules sont des circuits combinatoires"], 0,
           "Une bascule <b>mémorise</b> un état : sa sortie dépend des entrées et de l'état précédent → circuit séquentiel.")
    single("T167", "elec", "Une batterie de téléphone de 8,5 Wh sous 3,8 V se recharge complètement en 10 h. Intensité fournie par le chargeur (en mA, à 0,5 mA près) :",
           ["22", "2,2", "224", "2240", "2250"], 2,
           "Capacité Q = W / U = 8,5 / 3,8 = 2,237 Ah. Sur 10 h : I = 0,2237 A ≈ <b>224 mA</b>.")
    single("T168", "elec", "Dans le spectre du signal carré ci-contre, quelle affirmation est <b>erronée</b> ?",
           [r"La fréquence de la cinquième harmonique vaut \(5\omega\).", r"L'amplitude de la troisième harmonique vaut \(\dfrac{4E}{3\pi}\).",
            "Les harmoniques paires ont des amplitudes nulles."], 0,
           r"\(5\omega\) est une <b>pulsation</b> (rad/s). La fréquence de la 5e harmonique vaut \(5f\).", img=["q168.png"])
    single("T169", "auto", "Quel est l'état de la sortie de la fonction logique ci-contre (entrées à 1 et 1) ?", ["1", "Indéterminé", "0"], 2,
           "« =1 » est un OU exclusif (XOR) : sortie à 1 si une seule entrée est à 1. Avec 1 et 1 → <b>0</b>.", img=["q169.png"])
    single("T170", "maths", r"Une primitive de \(x\mapsto\dfrac{-1}{1+x}\) sur \(]-\infty;-1[\) est :",
           [r"\(\dfrac{-x}{1+\frac{x^2}{2}}\)", r"\(\dfrac{2}{(1+x)^2}\)", r"\(x\ln(-(1+x))\)", r"\(\dfrac{-1}{(1+x)^2}\)", r"\(-\ln(-(1+x))\)"], 4,
           r"Sur \(]-\infty;-1[\), \(1+x<0\), donc la primitive de \(\frac1{1+x}\) est \(\ln|1+x|=\ln(-(1+x))\). D'où \(-\ln(-(1+x))\). "
           r"Vérif : \(\left(-\ln(-(1+x))\right)'=-\dfrac{-1}{-(1+x)}=\dfrac{-1}{1+x}\) ✓.",
           note="Sur ton corrigé, tu avais noté « aucune » : la dernière proposition est bien correcte.")
    single("T171", "elec", "Quelle est la fonction réalisée par ce montage ?", ["Intégrateur", "Amplificateur inverseur", "Amplificateur non inverseur"], 1,
           r"Réaction sur l'entrée − par \(R_2\) → régime linéaire. \(V_e\) arrive sur l'entrée − via \(R_1\), l'entrée + est à la masse : "
           r"\(V_s=-\dfrac{R_2}{R_1}V_e\). Un intégrateur aurait un condensateur à la place de \(R_2\).", img=["q171.png"])
    multi("T172", "auto", r"Cochez les cases dont le résultat est \(a\) (\(\overline a\) = complément de a).",
          [r"\(a+0\)", r"\(1\cdot1+\overline a\)", r"\(1+1\cdot\overline a\)", r"\(1\cdot0\cdot a\)", r"\(1+0\cdot a\)", r"\(a\cdot0\)",
           r"\(a\cdot a\)", r"\(a+a\)", r"\(a+1+\overline a\)", r"\(a\cdot1\)"], [0, 6, 7, 9],
          "a + 0 = a ; a·a = a ; a + a = a ; a·1 = a. Les autres valent 1 (tout ce qui contient « + 1 ») ou 0 (tout ce qui contient « · 0 »).")
    match("T173", "meca", "À l'aide de la perspective et du dessin d'ensemble du capteur pneumatique, complétez le graphe des liaisons.",
          [("Liaison 5 – 2", "Pivot d'axe (C, z)"), ("Liaison 2 – 1", "Pivot d'axe (A, z)"),
           ("Liaison 2 – 6", "Ponctuelle de normale (D, n)"), ("Liaison 1 – 6", "Pivot glissant d'axe (B, y)")],
          ["Pivot d'axe (C, z)", "Pivot d'axe (A, z)", "Ponctuelle de normale (D, n)", "Pivot glissant d'axe (B, y)", "Rotule de centre A", "Glissière d'axe y"],
          "Le galet 5 tourne autour de son axe sur le levier 2 (pivot en C). Le levier 2 pivote sur le corps 1 (pivot en A). "
          "Le levier appuie en un point sur la tige 6 (ponctuelle en D). La tige 6 coulisse et peut tourner dans le corps 1 (pivot glissant d'axe y).",
          img=["q173a.jpg", "q173b.jpg", "q173c.png"])
    multi("T174", "auto", "Cochez la ou les bonne(s) case(s) pour le logigramme ci-contre.",
          [r"\(G=\overline{E+F}\)", r"\(G=\overline A+\overline B+\overline C+\overline D\)", r"\(G=\overline E+\overline F\)",
           "Aucune : toutes ces équations sont fausses", r"\(G=\overline{A\cdot B}+\overline{C+D}\)"], [2, 4],
          r"La dernière porte est un ET avec inversion en sortie (NAND) : \(G=\overline{E\cdot F}=\overline E+\overline F\) (De Morgan). "
          r"Avec \(E=A\cdot B\) et \(F=C+D\) : \(G=\overline{A\cdot B}+\overline{C+D}\). La proposition b est fausse car \(\overline{C+D}=\overline C\cdot\overline D\).",
          img=["q174.png"])
    multi("T176", "auto", "Lesquelles de ces affirmations sont correctes ?",
          ["La sortie d'une porte OU-exclusif-NON est à 1 si les entrées sont dans le même état",
           "La sortie d'une porte OU-exclusif-NON est à 1 si une seule entrée est à 1",
           "La sortie d'une porte OU-exclusif-NON est à 1 si les entrées sont égales",
           "La sortie d'une porte OU-exclusif est à 0 si les entrées sont dans le même état",
           "La sortie d'une porte OU-exclusif est à 1 si les entrées ne sont pas égales",
           "La sortie d'une porte OU-exclusif est à 0 si une seule entrée est à 1"], [0, 2, 3, 4],
          "XOR (OU exclusif) : 1 si les entrées sont <b>différentes</b>, 0 si elles sont égales. XNOR : l'inverse, 1 si les entrées sont égales.",
          note="La correction du test ne cochait pas d, qui est pourtant vraie (XOR à 0 quand les entrées sont identiques).")
    single("T177", "constr", "L'acronyme MOCN signifie :",
           ["Machine opérationnelle à commande numérisée", "Machine-outil à commande numérique", "Machine-outil à console numérique",
            "Machine opérative à commande numérique", "Machine opérative à console numérique"], 1,
           "MOCN = <b>Machine-Outil à Commande Numérique</b> (tour ou fraiseuse pilotés par programme).")
    single("T178", "auto", "Donner le type de capteur ou détecteur ci-contre :", CAPT_OPTS, 0,
           "Électrodes formant un <b>condensateur</b> dont la capacité change à l'approche de l'objet : détecteur de proximité <b>capacitif</b> "
           "(détecte aussi les matériaux non métalliques).", img=["q178.jpg"])
    single("T179", "maths", r"Une primitive de \(\dfrac{6e^{-3x}}{5}\) est :",
           [r"\(\dfrac{2e^{-3x}}{5}\)", r"\(\dfrac{-18e^{-3x}}{5}\)", r"\(\dfrac{-2e^{-3x}}{15}\)", r"\(\dfrac{-2e^{-3x}}{5}\)"], 3,
           r"Primitive de \(e^{-3x}\) : \(-\dfrac{e^{-3x}}{3}\). Donc \(\dfrac65\times\left(-\dfrac{e^{-3x}}{3}\right)=-\dfrac{2e^{-3x}}{5}\).")
    tf("T180", "constr", "Le moulage au sable est un procédé de moulage permanent.", False,
       "Le moule en sable est détruit pour sortir chaque pièce : moule <b>non permanent</b>. Moule permanent = coquille métallique.")
