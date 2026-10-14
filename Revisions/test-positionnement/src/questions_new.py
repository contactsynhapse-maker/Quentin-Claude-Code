# -*- coding: utf-8 -*-
"""Questions ajoutées à partir des cours : changements de base, trains épicycloïdaux,
matrices et calcul vectoriel, électronique de puissance (semi-conducteurs, redressement, hacheur)."""
import math
from common import single, multi, tf, num, text, match

SRC = {"src": "cours"}

BASES_INTRO = (
    r"On enchaîne trois rotations (figures ci-dessous) : \(\mathcal B_0\to\mathcal B_1\) d'angle \(\theta\) autour de "
    r"\(\vec z_0=\vec z_1\) ; \(\mathcal B_1\to\mathcal B_2\) d'angle \(\varphi\) autour de \(\vec x_1=\vec x_2\) ; "
    r"\(\mathcal B_2\to\mathcal B_3\) d'angle \(\psi\) autour de \(\vec y_2=\vec y_3\).<br>"
)
EPI_INTRO = (
    r"Train épicycloïdal simple : planétaire <b>1</b> (\(Z_1=20\)), satellites <b>2</b> (\(Z_2=30\)), couronne <b>3</b> "
    r"à denture intérieure, porte-satellites <b>PS</b>. Vitesses en tr/min, comptées positivement dans le même sens.<br>"
)
WILLIS = r"\(\dfrac{\omega_{3}-\omega_{PS}}{\omega_{1}-\omega_{PS}}=-\dfrac{Z_1}{Z_3}=-\dfrac14\)"


def bases():
    kw = dict(fig="bases", **SRC)
    single("CB1", "base", BASES_INTRO + r"Calculer \(\vec x_0\cdot\vec x_1\).",
           [r"\(\cos\theta\)", r"\(\sin\theta\)", r"\(-\sin\theta\)", r"\(0\)"], 0,
           r"Figure 1 : \(\vec x_1=\cos\theta\,\vec x_0+\sin\theta\,\vec y_0\), donc \(\vec x_0\cdot\vec x_1=\cos\theta\). "
           r"Règle : deux vecteurs unitaires qui font l'angle \(\alpha\) ont un produit scalaire \(\cos\alpha\).", **kw)
    single("CB2", "base", BASES_INTRO + r"Calculer \(\vec y_0\cdot\vec x_1\).",
           [r"\(\cos\theta\)", r"\(\sin\theta\)", r"\(-\sin\theta\)", r"\(0\)"], 1,
           r"\(\vec x_1=\cos\theta\,\vec x_0+\sin\theta\,\vec y_0\) → la composante sur \(\vec y_0\) vaut \(\sin\theta\). "
           r"(Angle entre \(\vec y_0\) et \(\vec x_1\) : \(\frac\pi2-\theta\), et \(\cos(\frac\pi2-\theta)=\sin\theta\).)", **kw)
    single("CB3", "base", BASES_INTRO + r"Calculer \(\vec x_0\cdot\vec y_1\).",
           [r"\(\sin\theta\)", r"\(-\sin\theta\)", r"\(\cos\theta\)", r"\(-\cos\theta\)"], 1,
           r"\(\vec y_1=-\sin\theta\,\vec x_0+\cos\theta\,\vec y_0\), donc \(\vec x_0\cdot\vec y_1=-\sin\theta\). "
           r"Sur la figure, \(\vec y_1\) « part » du côté des \(x\) négatifs : le signe est −.", **kw)
    single("CB4", "base", BASES_INTRO + r"Calculer \(\vec z_0\cdot\vec y_2\).",
           [r"\(\cos\varphi\)", r"\(\sin\varphi\)", r"\(-\sin\varphi\)", r"\(0\)"], 1,
           r"\(\vec z_0=\vec z_1\). Figure 2 : \(\vec y_2=\cos\varphi\,\vec y_1+\sin\varphi\,\vec z_1\) → \(\vec z_1\cdot\vec y_2=\sin\varphi\).", **kw)
    single("CB5", "base", BASES_INTRO + r"Calculer \(\vec x_1\cdot\vec z_3\).",
           [r"\(\cos\psi\)", r"\(\sin\psi\)", r"\(-\sin\psi\)", r"\(\cos\varphi\sin\psi\)"], 1,
           r"Astuce : \(\vec x_1=\vec x_2\) (axe de la 2e rotation). On travaille donc dans la figure 3 : "
           r"\(\vec z_3=\cos\psi\,\vec z_2+\sin\psi\,\vec x_2\), d'où \(\vec x_1\cdot\vec z_3=\vec x_2\cdot\vec z_3=\sin\psi\).", **kw)
    single("CB6", "base", BASES_INTRO + r"Calculer \(\vec z_1\cdot\vec z_3\).",
           [r"\(\cos\varphi\cos\psi\)", r"\(\cos\psi\)", r"\(\sin\varphi\sin\psi\)", r"\(\cos(\varphi+\psi)\)"], 0,
           r"On projette \(\vec z_3\) dans \(\mathcal B_2\) : \(\vec z_3=\cos\psi\,\vec z_2+\sin\psi\,\vec x_2\). "
           r"Puis \(\vec z_1\cdot\vec z_2=\cos\varphi\) et \(\vec z_1\cdot\vec x_2=\vec z_1\cdot\vec x_1=0\). Résultat : \(\cos\varphi\cos\psi\).", **kw)
    single("CB7", "base", BASES_INTRO + r"Calculer \(\vec y_1\cdot\vec z_3\).",
           [r"\(\sin\varphi\cos\psi\)", r"\(-\sin\varphi\cos\psi\)", r"\(-\sin\varphi\sin\psi\)", r"\(\cos\varphi\cos\psi\)"], 1,
           r"\(\vec z_3=\cos\psi\,\vec z_2+\sin\psi\,\vec x_2\). Figure 2 : \(\vec z_2=\cos\varphi\,\vec z_1-\sin\varphi\,\vec y_1\) → \(\vec y_1\cdot\vec z_2=-\sin\varphi\) ; "
           r"\(\vec y_1\cdot\vec x_2=0\). Donc \(\vec y_1\cdot\vec z_3=-\sin\varphi\cos\psi\).", **kw)
    single("CB8", "base", BASES_INTRO + r"Calculer \(\vec x_0\cdot\vec z_3\) (trois bases à relier).",
           [r"\(\cos\theta\sin\psi+\sin\theta\sin\varphi\cos\psi\)", r"\(\sin\theta\sin\psi+\cos\theta\sin\varphi\cos\psi\)",
            r"\(\cos\theta\cos\psi\)", r"\(\cos\theta\sin\psi-\sin\theta\sin\varphi\cos\psi\)"], 0,
           r"1) \(\vec z_3=\cos\psi\,\vec z_2+\sin\psi\,\vec x_2\). 2) \(\vec x_0\cdot\vec x_2=\vec x_0\cdot\vec x_1=\cos\theta\). "
           r"3) \(\vec z_2=\cos\varphi\,\vec z_1-\sin\varphi\,\vec y_1\) et \(\vec x_0\cdot\vec y_1=-\sin\theta\), \(\vec x_0\cdot\vec z_1=0\) → \(\vec x_0\cdot\vec z_2=\sin\theta\sin\varphi\). "
           r"Total : \(\cos\psi\sin\theta\sin\varphi+\sin\psi\cos\theta\).", **kw)
    single("CB9", "base", BASES_INTRO + r"Calculer \(\vec x_1\cdot\vec y_2\).",
           [r"\(\cos\varphi\)", r"\(\sin\varphi\)", r"\(0\)", r"\(1\)"], 2,
           r"\(\vec x_1=\vec x_2\) et \(\vec x_2\perp\vec y_2\) (même base orthonormée) : le produit scalaire est nul. "
           r"Piège classique : un vecteur porté par l'axe de rotation est orthogonal à tout le plan de la figure.", **kw)
    single("CB10", "base", BASES_INTRO + r"Calculer \(\vec z_0\cdot\vec x_3\).",
           [r"\(-\cos\varphi\sin\psi\)", r"\(\cos\varphi\sin\psi\)", r"\(\sin\psi\)", r"\(\cos\varphi\cos\psi\)"], 0,
           r"Figure 3 : \(\vec x_3=\cos\psi\,\vec x_2-\sin\psi\,\vec z_2\). Or \(\vec z_0\cdot\vec x_2=\vec z_1\cdot\vec x_1=0\) et "
           r"\(\vec z_0\cdot\vec z_2=\vec z_1\cdot\vec z_2=\cos\varphi\). Donc \(\vec z_0\cdot\vec x_3=-\sin\psi\cos\varphi\).", **kw)
    single("CV1", "base", BASES_INTRO + r"Calculer \(\vec x_0\wedge\vec x_1\).",
           [r"\(\sin\theta\,\vec z_0\)", r"\(-\sin\theta\,\vec z_0\)", r"\(\cos\theta\,\vec z_0\)", r"\(\vec 0\)"], 0,
           r"\(\vec x_0\wedge(\cos\theta\,\vec x_0+\sin\theta\,\vec y_0)=\sin\theta\,(\vec x_0\wedge\vec y_0)=\sin\theta\,\vec z_0\). "
           r"Règle : si \(\vec v\) s'obtient en tournant \(\vec u\) de \(\alpha\) autour de \(\vec n\), alors \(\vec u\wedge\vec v=\sin\alpha\,\vec n\).", **kw)
    single("CV2", "base", BASES_INTRO + r"Calculer \(\vec x_1\wedge\vec y_0\).",
           [r"\(\sin\theta\,\vec z_0\)", r"\(\cos\theta\,\vec z_0\)", r"\(-\cos\theta\,\vec z_0\)", r"\(\vec z_0\)"], 1,
           r"\((\cos\theta\,\vec x_0+\sin\theta\,\vec y_0)\wedge\vec y_0=\cos\theta\,(\vec x_0\wedge\vec y_0)=\cos\theta\,\vec z_0\). "
           r"(Angle de \(\vec x_1\) vers \(\vec y_0\) : \(\frac\pi2-\theta\), et \(\sin(\frac\pi2-\theta)=\cos\theta\).)", **kw)
    single("CV3", "base", BASES_INTRO + r"Calculer \(\vec z_1\wedge\vec z_2\).",
           [r"\(\sin\varphi\,\vec x_1\)", r"\(-\sin\varphi\,\vec x_1\)", r"\(\cos\varphi\,\vec x_1\)", r"\(\sin\varphi\,\vec y_1\)"], 0,
           r"\(\vec z_2\) s'obtient en tournant \(\vec z_1\) de \(\varphi\) autour de \(\vec x_1\) : \(\vec z_1\wedge\vec z_2=\sin\varphi\,\vec x_1\). "
           r"Par le calcul : \(\vec z_1\wedge(\cos\varphi\,\vec z_1-\sin\varphi\,\vec y_1)=-\sin\varphi\,(\vec z_1\wedge\vec y_1)=\sin\varphi\,\vec x_1\).", **kw)
    single("CV4", "base", BASES_INTRO + r"Calculer \(\vec y_1\wedge\vec z_2\).",
           [r"\(\sin\varphi\,\vec x_1\)", r"\(\cos\varphi\,\vec x_1\)", r"\(-\cos\varphi\,\vec x_1\)", r"\(\vec x_1\)"], 1,
           r"\(\vec y_1\wedge(\cos\varphi\,\vec z_1-\sin\varphi\,\vec y_1)=\cos\varphi\,(\vec y_1\wedge\vec z_1)=\cos\varphi\,\vec x_1\).", **kw)
    single("CV5", "base", BASES_INTRO + r"Calculer \(\vec x_2\wedge\vec z_3\).",
           [r"\(\cos\psi\,\vec y_2\)", r"\(-\cos\psi\,\vec y_2\)", r"\(\sin\psi\,\vec y_2\)", r"\(-\sin\psi\,\vec y_2\)"], 1,
           r"\(\vec x_2\wedge(\cos\psi\,\vec z_2+\sin\psi\,\vec x_2)=\cos\psi\,(\vec x_2\wedge\vec z_2)=-\cos\psi\,\vec y_2\) "
           r"car \(\vec z_2\wedge\vec x_2=\vec y_2\) (ordre circulaire x → y → z → x).", **kw)
    single("CV6", "base", BASES_INTRO + r"Calculer \(\vec z_0\wedge\vec x_2\).",
           [r"\(\vec y_1\)", r"\(\vec y_0\)", r"\(-\vec y_1\)", r"\(\cos\varphi\,\vec y_1\)"], 0,
           r"\(\vec z_0=\vec z_1\) et \(\vec x_2=\vec x_1\) : \(\vec z_1\wedge\vec x_1=\vec y_1\) (base \(\mathcal B_1\) directe). "
           r"Toujours chercher d'abord à exprimer les deux vecteurs dans une <b>même base</b>.", **kw)
    single("CV7", "base", BASES_INTRO + r"Calculer \(\vec y_0\wedge\vec z_2\), exprimé dans \(\mathcal B_0\).",
           [r"\(\cos\varphi\,\vec x_0-\sin\theta\sin\varphi\,\vec z_0\)", r"\(\cos\varphi\,\vec x_0+\sin\theta\sin\varphi\,\vec z_0\)",
            r"\(\cos\varphi\,\vec x_0\)", r"\(\sin\varphi\,\vec x_0-\cos\theta\cos\varphi\,\vec z_0\)"], 0,
           r"\(\vec z_2=\cos\varphi\,\vec z_1-\sin\varphi\,\vec y_1\). \(\vec y_0\wedge\vec z_1=\vec y_0\wedge\vec z_0=\vec x_0\). "
           r"\(\vec y_0\wedge\vec y_1=\vec y_0\wedge(-\sin\theta\,\vec x_0+\cos\theta\,\vec y_0)=-\sin\theta(\vec y_0\wedge\vec x_0)=\sin\theta\,\vec z_0\). "
           r"Donc \(\cos\varphi\,\vec x_0-\sin\varphi\sin\theta\,\vec z_0\).", **kw)
    single("CK1", "base", BASES_INTRO + r"Le vecteur rotation \(\vec\Omega(3/0)\) (solide 3 lié à \(\mathcal B_3\), solide 0 à \(\mathcal B_0\)) vaut :",
           [r"\(\dot\theta\,\vec z_0+\dot\varphi\,\vec x_1+\dot\psi\,\vec y_2\)", r"\(\dot\theta\,\vec x_0+\dot\varphi\,\vec y_1+\dot\psi\,\vec z_2\)",
            r"\(\dot\theta\,\vec z_0+\dot\varphi\,\vec z_1+\dot\psi\,\vec z_2\)", r"\(\theta\,\vec z_0+\varphi\,\vec x_1+\psi\,\vec y_2\)"], 0,
           r"Composition : \(\vec\Omega(3/0)=\vec\Omega(3/2)+\vec\Omega(2/1)+\vec\Omega(1/0)\). Chaque rotation donne « dérivée de l'angle × axe de rotation » : "
           r"\(\dot\theta\,\vec z_0\), \(\dot\varphi\,\vec x_1\), \(\dot\psi\,\vec y_2\).", **kw)
    multi("CM1", "base", r"Deux vecteurs unitaires \(\vec u\) et \(\vec v\) d'une même figure plane de normale \(\vec n\) (sens direct), avec \(\vec v\) obtenu en tournant \(\vec u\) de \(\alpha\). Cochez les relations justes.",
          [r"\(\vec u\cdot\vec v=\cos\alpha\)", r"\(\vec u\wedge\vec v=\sin\alpha\,\vec n\)", r"\(\vec v\wedge\vec u=\sin\alpha\,\vec n\)",
           r"\(\vec u\cdot\vec n=0\)", r"\(\vec u\cdot\vec v=\sin\alpha\)"], [0, 1, 3],
          r"Produit scalaire = cosinus de l'angle ; produit vectoriel = sinus de l'angle × la normale. Inverser l'ordre change le signe : "
          r"\(\vec v\wedge\vec u=-\sin\alpha\,\vec n\). La normale (axe de rotation) est orthogonale à tout vecteur du plan.", **SRC)


def epicycloidal():
    kw = dict(fig="epi", **SRC)
    single("TE1", "epi", EPI_INTRO + "Comment s'appelle l'élément qui porte les axes des satellites ?",
           ["Le porte-satellites", "Le planétaire", "La couronne", "Le pignon fou"], 0,
           "Le <b>porte-satellites</b> (PS) tourne autour de l'axe principal et porte les axes des satellites. Planétaire et couronne "
           "sont coaxiaux avec lui.", **kw)
    num("TE2", "epi", EPI_INTRO + r"Calculer le nombre de dents \(Z_3\) de la couronne pour que le train puisse être monté.", 80, 0, "dents",
        r"Condition de coaxialité : \(R_3=R_1+2R_2\). Toutes les roues ont le même module, donc \(Z_3=Z_1+2Z_2=20+60=80\).", **kw)
    single("TE3", "epi", EPI_INTRO + "Quelle est la formule de Willis pour ce train ?",
           [r"\(\dfrac{\omega_3-\omega_{PS}}{\omega_1-\omega_{PS}}=-\dfrac{Z_1}{Z_3}\)", r"\(\dfrac{\omega_3}{\omega_1}=-\dfrac{Z_1}{Z_3}\)",
            r"\(\dfrac{\omega_3-\omega_{PS}}{\omega_1-\omega_{PS}}=-\dfrac{Z_3}{Z_1}\)", r"\(\dfrac{\omega_3+\omega_{PS}}{\omega_1+\omega_{PS}}=\dfrac{Z_1}{Z_3}\)"], 0,
           r"On se place dans le repère du porte-satellites : les axes sont alors fixes (train simple). "
           r"\(\dfrac{\omega_{3/PS}}{\omega_{1/PS}}=(-1)^n\dfrac{\prod Z_{menantes}}{\prod Z_{menées}}=(-1)^1\dfrac{Z_1Z_2}{Z_2Z_3}=-\dfrac{Z_1}{Z_3}\) "
           r"(1 seul contact extérieur, entre 1 et 2). Le satellite se simplifie.", **kw)
    num("TE4", "epi", EPI_INTRO + r"Calculer la raison basique \(\lambda=\dfrac{\omega_3-\omega_{PS}}{\omega_1-\omega_{PS}}\) (avec \(Z_3=80\)).", -0.25, 0.001, "",
        r"\(\lambda=-\dfrac{Z_1}{Z_3}=-\dfrac{20}{80}=-0{,}25\). Elle est négative car il y a un seul contact extérieur.", **kw)
    num("TE5", "epi", EPI_INTRO + WILLIS + r"<br>La couronne est <b>fixe</b> (\(\omega_3=0\)). Le planétaire tourne à 1500 tr/min. Vitesse du porte-satellites ?", 300, 0.5, "tr/min",
        r"\(\dfrac{0-\omega_{PS}}{1500-\omega_{PS}}=-\dfrac14\) → \(4\omega_{PS}=1500-\omega_{PS}\) → \(\omega_{PS}=\dfrac{1500}{5}=300\) tr/min "
        r"(même sens que le planétaire, réduction de 5).", **kw)
    single("TE6", "epi", EPI_INTRO + r"Couronne fixe : que vaut le rapport \(\dfrac{\omega_{PS}}{\omega_1}\) ?",
           [r"\(\dfrac{Z_1}{Z_1+Z_3}\)", r"\(\dfrac{Z_3}{Z_1+Z_3}\)", r"\(-\dfrac{Z_1}{Z_3}\)", r"\(\dfrac{Z_1+Z_3}{Z_1}\)"], 0,
           r"Avec \(\omega_3=0\) : \(-\omega_{PS}=-\frac{Z_1}{Z_3}(\omega_1-\omega_{PS})\) → \(\omega_{PS}(Z_3+Z_1)=Z_1\omega_1\) → \(\dfrac{\omega_{PS}}{\omega_1}=\dfrac{Z_1}{Z_1+Z_3}=\dfrac{20}{100}=0{,}2\).", **kw)
    num("TE7", "epi", EPI_INTRO + WILLIS + r"<br>Le planétaire est <b>fixe</b> (\(\omega_1=0\)). La couronne tourne à 500 tr/min. Vitesse du porte-satellites ?", 400, 0.5, "tr/min",
        r"\(\dfrac{500-\omega_{PS}}{0-\omega_{PS}}=-\dfrac14\) → \(500-\omega_{PS}=\dfrac{\omega_{PS}}{4}\) → \(\omega_{PS}=\dfrac{500}{1{,}25}=400\) tr/min.", **kw)
    num("TE8", "epi", EPI_INTRO + WILLIS + r"<br>Le porte-satellites est <b>fixe</b>. Le planétaire tourne à 1000 tr/min. Vitesse de la couronne (avec son signe) ?", -250, 0.5, "tr/min",
        r"Avec \(\omega_{PS}=0\) : \(\dfrac{\omega_3}{\omega_1}=-\dfrac14\) → \(\omega_3=-250\) tr/min. Train simple : la couronne tourne en <b>sens inverse</b>.", **kw)
    num("TE9", "epi", EPI_INTRO + WILLIS + r"<br>Deux entrées : \(\omega_1=1000\) tr/min et \(\omega_3=200\) tr/min (même sens). Vitesse du porte-satellites ?", 360, 0.5, "tr/min",
        r"\(\omega_3-\omega_{PS}=-\frac14(\omega_1-\omega_{PS})\) → \(4\omega_3-4\omega_{PS}=-\omega_1+\omega_{PS}\) → \(\omega_{PS}=\dfrac{\omega_1+4\omega_3}{5}=\dfrac{1000+800}{5}=360\) tr/min.", **kw)
    single("TE10", "epi", EPI_INTRO + "Combien de degrés de mobilité possède un train épicycloïdal simple (planétaire, couronne, porte-satellites libres) ?",
           ["1 : une entrée suffit", "2 : il faut imposer deux vitesses (ou bloquer un élément) pour connaître la troisième", "3", "0"], 1,
           "La formule de Willis est une seule équation à 3 inconnues (ω<sub>1</sub>, ω<sub>3</sub>, ω<sub>PS</sub>) : il faut en fixer deux. "
           "En pratique on bloque un élément (souvent la couronne) pour obtenir un réducteur, ou on utilise deux entrées (différentiel).", **kw)
    single("TE11", "epi", r"Dans la formule de Willis, le signe de la raison est donné par \((-1)^n\). Que compte n ?",
           ["Le nombre de contacts extérieurs entre roues", "Le nombre total d'engrènements", "Le nombre de satellites", "Le nombre de roues menantes"], 0,
           "Un engrènement <b>extérieur</b> inverse le sens de rotation, un engrènement intérieur (avec une couronne) le conserve. "
           "n = nombre de contacts extérieurs dans le train rendu « simple » (PS fixe). Le nombre de satellites montés en parallèle ne compte pas.",
           **SRC)
    single("TE12", "epi", r"Train à satellites doubles : planétaire 1 (\(Z_1\)) engrène avec \(Z_2\) ; \(Z_{2'}\), solidaire de \(Z_2\), engrène avec le planétaire extérieur 4 (\(Z_4\)). Raison \(\dfrac{\omega_4-\omega_{PS}}{\omega_1-\omega_{PS}}\) ?",
           [r"\(+\dfrac{Z_1\,Z_{2'}}{Z_2\,Z_4}\)", r"\(-\dfrac{Z_1\,Z_{2'}}{Z_2\,Z_4}\)", r"\(+\dfrac{Z_2\,Z_4}{Z_1\,Z_{2'}}\)", r"\(-\dfrac{Z_1}{Z_4}\)"], 0,
           r"Roues menantes : \(Z_1\) et \(Z_{2'}\) ; menées : \(Z_2\) et \(Z_4\). Deux contacts extérieurs → \((-1)^2=+1\). "
           r"Raison \(=+\dfrac{Z_1Z_{2'}}{Z_2Z_4}\).", **SRC)
    num("TE13", "epi", EPI_INTRO + r"Couronne fixe, \(\omega_1=1500\) tr/min, donc \(\omega_{PS}=300\) tr/min. Vitesse absolue d'un satellite \(\omega_{2/0}\) (avec son signe) ?",
        -500, 0.5, "tr/min",
        r"Dans le repère du PS (contact extérieur 1-2) : \(\dfrac{\omega_2-\omega_{PS}}{\omega_1-\omega_{PS}}=-\dfrac{Z_1}{Z_2}\) → "
        r"\(\omega_2-300=-\dfrac{20}{30}\times1200=-800\) → \(\omega_2=-500\) tr/min. Vérif avec 2-3 (intérieur, signe +) : "
        r"\(\dfrac{0-300}{-500-300}=\dfrac{30}{80}\) ✓.", **kw)
    multi("TE14", "epi", "Quels sont les intérêts d'un train épicycloïdal ?",
          ["Grand rapport de réduction sous un faible encombrement", "Entrée et sortie coaxiales",
           "Possibilité d'avoir deux entrées (différentiel, boîte automatique)", "Effort réparti sur plusieurs satellites",
           "Il ne nécessite aucune lubrification", "Son rapport est toujours positif"], [0, 1, 2, 3],
          "Compacité, coaxialité, effort partagé entre plusieurs satellites et fonctionnement à deux entrées (différentiel, boîte de "
          "vitesses automatique). Il se lubrifie comme tout engrenage, et le signe du rapport dépend de l'élément bloqué.", **SRC)
    single("TE15", "epi", EPI_INTRO + WILLIS + "<br>On rend le planétaire solidaire du porte-satellites (ω<sub>1</sub> = ω<sub>PS</sub>). Que se passe-t-il ?",
           ["Le train tourne en bloc : ω<sub>3</sub> = ω<sub>1</sub> = ω<sub>PS</sub> (rapport 1)", "La couronne s'arrête", "La couronne tourne en sens inverse", "Le train se bloque complètement"], 0,
           r"Si \(\omega_1=\omega_{PS}\), le dénominateur est nul ; l'équation \(\omega_3-\omega_{PS}=\lambda(\omega_1-\omega_{PS})=0\) impose \(\omega_3=\omega_{PS}\). "
           r"Les satellites ne tournent plus sur eux-mêmes : tout l'ensemble tourne en bloc (prise directe, rapport 1).", **kw)


def maths():
    single("M1", "maths", r"A est une matrice \(2\times3\) et B une matrice \(3\times4\). Quelle est la taille de \(A\times B\) ?",
           [r"\(3\times3\)", r"\(2\times4\)", r"\(4\times2\)", "Le produit est impossible"], 1,
           "Le produit A×B existe si (colonnes de A) = (lignes de B) : 3 = 3 ✓. Le résultat a les <b>lignes de A</b> et les <b>colonnes de B</b> : 2×4.", **SRC)
    single("M2", "maths", r"A est une matrice \(3\times2\) et B une matrice \(3\times2\). Le produit \(A\times B\) :",
           [r"est une matrice \(3\times3\)", r"est une matrice \(2\times2\)", "est impossible", r"est une matrice \(3\times2\)"], 2,
           "A a 2 colonnes, B a 3 lignes : 2 ≠ 3, le produit n'existe pas. Règle : (n×<b>p</b>) × (<b>p</b>×q) → n×q.", **SRC)
    single("M3", "maths", r"Calculer \(\begin{pmatrix}1&2\\3&4\end{pmatrix}\times\begin{pmatrix}0&1\\1&0\end{pmatrix}\).",
           [r"\(\begin{pmatrix}2&1\\4&3\end{pmatrix}\)", r"\(\begin{pmatrix}3&4\\1&2\end{pmatrix}\)", r"\(\begin{pmatrix}0&2\\3&0\end{pmatrix}\)", r"\(\begin{pmatrix}1&3\\2&4\end{pmatrix}\)"], 0,
           r"Ligne × colonne : \(c_{11}=1\cdot0+2\cdot1=2\), \(c_{12}=1\cdot1+2\cdot0=1\), \(c_{21}=3\cdot0+4\cdot1=4\), \(c_{22}=3\cdot1+4\cdot0=3\). "
           r"(La 2e proposition est \(B\times A\) : l'ordre compte !)", **SRC)
    tf("M4", "maths", r"Pour deux matrices carrées A et B de même taille, on a toujours \(A\times B=B\times A\).", False,
       "Le produit matriciel n'est <b>pas commutatif</b> en général (voir la question précédente). Il est associatif et distributif.", **SRC)
    single("M5", "maths", r"Dans \(A=\begin{pmatrix}1&2&3\\4&5&6\\7&8&9\\10&11&12\end{pmatrix}\), que vaut \(a_{23}\) ?", ["6", "8", "11", "5"], 0,
           r"Premier indice = ligne, second = colonne : ligne 2, colonne 3 → 6. (\(a_{42}=11\), \(a_{32}=8\).)", **SRC)
    single("M6", "maths", r"Quelle est l'inverse de \(A=\begin{pmatrix}5&-1\\-9&2\end{pmatrix}\) ?",
           [r"\(\begin{pmatrix}2&1\\9&5\end{pmatrix}\)", r"\(\begin{pmatrix}2&-1\\-9&5\end{pmatrix}\)", r"\(\begin{pmatrix}\frac15&-1\\-\frac19&\frac12\end{pmatrix}\)", r"\(\begin{pmatrix}5&9\\1&2\end{pmatrix}\)"], 0,
           r"Pour \(\begin{pmatrix}a&b\\c&d\end{pmatrix}\) : \(A^{-1}=\dfrac1{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}\). Ici \(\det=10-9=1\), donc \(A^{-1}=\begin{pmatrix}2&1\\9&5\end{pmatrix}\). "
           r"Vérif : \(A\times A^{-1}=I_2\). On n'inverse jamais coefficient par coefficient.", **SRC)
    num("M7", "maths", r"Résoudre \(\begin{cases}5x-y=7\\-9x+2y=8\end{cases}\) (indice : utiliser l'inverse de la question précédente). Donner \(x\).", 22, 0, "",
        r"\(AX=B\Rightarrow X=A^{-1}B=\begin{pmatrix}2&1\\9&5\end{pmatrix}\begin{pmatrix}7\\8\end{pmatrix}=\begin{pmatrix}22\\103\end{pmatrix}\). "
        r"Donc \(x=22\), \(y=103\). Attention à l'ordre : \(A^{-1}\) se place à <b>gauche</b>.", **SRC)
    single("M8", "maths", r"Soit \(M=\begin{pmatrix}3&2\\4&5\end{pmatrix}\). Quelle affirmation est juste ?",
           [r"\(\det M=7\), M est inversible", r"\(\det M=23\), M est inversible", r"\(\det M=-7\), M n'est pas inversible", r"\(\det M=7\), M n'est pas inversible"], 0,
           r"\(\det M=3\times5-2\times4=7\neq0\) → M est inversible (ses colonnes ne sont pas colinéaires).", **SRC)
    single("M9", "maths", r"Quelle est l'inverse de \(\begin{pmatrix}2&1\\1&1\end{pmatrix}\) ?",
           [r"\(\begin{pmatrix}1&-1\\-1&2\end{pmatrix}\)", r"\(\begin{pmatrix}\frac12&1\\1&1\end{pmatrix}\)", r"\(\begin{pmatrix}1&1\\1&2\end{pmatrix}\)", r"\(\begin{pmatrix}-1&1\\1&-2\end{pmatrix}\)"], 0,
           r"\(\det=2-1=1\) → \(\begin{pmatrix}d&-b\\-c&a\end{pmatrix}=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}\). Vérif : \(\begin{pmatrix}2&1\\1&1\end{pmatrix}\begin{pmatrix}1&-1\\-1&2\end{pmatrix}=I_2\).", **SRC)
    single("M10", "maths", "Méthode du pivot de Gauss : laquelle n'est <b>pas</b> une opération élémentaire autorisée sur les lignes ?",
           ["Multiplier une ligne par un réel non nul", "Ajouter à une ligne un multiple d'une autre ligne", "Échanger deux lignes", "Multiplier une ligne par 0"], 3,
           "Multiplier par 0 efface une équation : le système n'est plus équivalent. Les trois autres opérations conservent les solutions.", **SRC)
    single("V1", "maths", r"Soient \(A(2;-1)\) et \(B(1;-3)\). Coordonnées de \(\overrightarrow{AB}\) et du milieu I de [AB] ?",
           [r"\(\overrightarrow{AB}(-1;-2)\), \(I\left(\frac32;-2\right)\)", r"\(\overrightarrow{AB}(1;2)\), \(I\left(\frac32;-2\right)\)",
            r"\(\overrightarrow{AB}(-1;-2)\), \(I\left(-\frac12;-1\right)\)", r"\(\overrightarrow{AB}(3;-4)\), \(I(3;-4)\)"], 0,
           r"\(\overrightarrow{AB}(x_B-x_A;y_B-y_A)=(-1;-2)\). \(I\left(\frac{x_A+x_B}2;\frac{y_A+y_B}2\right)=\left(\frac32;-2\right)\). "
           r"Attention : I n'est pas la moitié des coordonnées de \(\overrightarrow{AB}\).", **SRC)
    single("V2", "maths", r"Les vecteurs \(\vec u(2;-3)\) et \(\vec v(-6;9)\) sont-ils colinéaires ?",
           [r"Oui, car \(xy'-x'y=2\times9-(-6)(-3)=0\)", r"Non, car \(xx'+yy'\neq0\)", "Non, car leurs coordonnées n'ont pas le même signe", "On ne peut pas savoir"], 0,
           r"Critère : \(xy'-x'y=18-18=0\) → colinéaires. On a d'ailleurs \(\vec v=-3\vec u\). Le critère \(xx'+yy'=0\) sert à l'orthogonalité.", **SRC)
    single("V3", "maths", r"Dans un repère orthonormé, \(\vec u(3;-2)\) et \(\vec v(4;6)\) sont-ils orthogonaux ?",
           [r"Oui : \(xx'+yy'=12-12=0\)", r"Non : \(xy'-x'y=26\neq0\)", "Non : ils n'ont pas la même norme", r"Oui : \(xy'-x'y=0\)"], 0,
           r"Orthogonaux ⇔ produit scalaire nul : \(3\times4+(-2)\times6=0\) ✓.", **SRC)
    num("V4", "maths", r"Norme du vecteur \(\vec u(1;2;2)\) dans un repère orthonormé ?", 3, 0.001, "",
        r"\(\|\vec u\|=\sqrt{1^2+2^2+2^2}=\sqrt9=3\).", **SRC)
    single("V5", "maths", r"Le point A a pour coordonnées polaires \(\left(3;\dfrac{2\pi}3\right)\). Ses coordonnées cartésiennes sont :",
           [r"\(\left(-\dfrac32;\dfrac{3\sqrt3}2\right)\)", r"\(\left(\dfrac32;\dfrac{3\sqrt3}2\right)\)", r"\(\left(\dfrac{3\sqrt3}2;-\dfrac32\right)\)", r"\(\left(-\dfrac12;\dfrac{\sqrt3}2\right)\)"], 0,
           r"\(x=r\cos\theta=3\cos\frac{2\pi}3=-\frac32\), \(y=r\sin\theta=3\cdot\frac{\sqrt3}2\). La dernière proposition oublie de multiplier par r = 3.", **SRC)
    single("V6", "maths", r"Le point B a pour coordonnées cartésiennes \((1;\sqrt3)\). Ses coordonnées polaires sont :",
           [r"\(\left(2;\dfrac\pi3\right)\)", r"\(\left(2;\dfrac\pi6\right)\)", r"\(\left(4;\dfrac\pi3\right)\)", r"\(\left(\sqrt3;\dfrac\pi3\right)\)"], 0,
           r"\(r=\sqrt{1+3}=2\), \(\cos\theta=\frac12\), \(\sin\theta=\frac{\sqrt3}2\) → \(\theta=\frac\pi3\).", **SRC)
    num("V7", "maths", r"Calculer le produit scalaire \(\vec u\cdot\vec v\) avec \(\vec u(1;2;3)\) et \(\vec v(4;-5;2)\).", 0, 0.001, "",
        r"\(xx'+yy'+zz'=4-10+6=0\) : les vecteurs sont orthogonaux.", **SRC)
    single("V8", "maths", r"Calculer le produit vectoriel \(\vec u\wedge\vec v\) avec \(\vec u(1;2;3)\) et \(\vec v(4;5;6)\).",
           [r"\((-3;6;-3)\)", r"\((3;-6;3)\)", r"\((4;10;18)\)", r"\((-3;-6;-3)\)"], 0,
           r"\(\vec u\wedge\vec v=(y z'-z y';\ z x'-x z';\ x y'-y x')=(12-15;\ 12-6;\ 5-8)=(-3;6;-3)\). "
           r"Vérif : \((-3;6;-3)\cdot\vec u=-3+12-9=0\) ✓. La 2e proposition est \(\vec v\wedge\vec u\).", **SRC)
    multi("V9", "maths", r"Cochez les propriétés vraies du produit vectoriel (\(\alpha\) = angle entre \(\vec u\) et \(\vec v\)).",
          [r"\(\vec u\wedge\vec v=-\vec v\wedge\vec u\)", r"\(\vec u\wedge\vec v\) est orthogonal à \(\vec u\) et à \(\vec v\)", r"\(\|\vec u\wedge\vec v\|=\|\vec u\|\,\|\vec v\|\,|\sin\alpha|\)",
           r"\(\vec u\wedge\vec v=\vec 0\) si \(\vec u\) et \(\vec v\) sont colinéaires", r"\(\vec u\wedge\vec v=\vec v\wedge\vec u\)", r"\(\|\vec u\wedge\vec v\|=\|\vec u\|\,\|\vec v\|\cos\alpha\)"],
          [0, 1, 2, 3],
          "Le produit vectoriel est <b>antisymétrique</b>, orthogonal aux deux vecteurs, de norme ‖u‖‖v‖|sin α| (nulle si colinéaires). "
          "Le cosinus correspond au produit scalaire.", **SRC)
    single("V10", "maths", r"Dans une base orthonormée directe \((\vec x,\vec y,\vec z)\), que vaut \(\vec z\wedge\vec y\) ?",
           [r"\(-\vec x\)", r"\(\vec x\)", r"\(\vec 0\)", r"\(-\vec z\)"], 0,
           r"Ordre circulaire direct : \(\vec x\wedge\vec y=\vec z\), \(\vec y\wedge\vec z=\vec x\), \(\vec z\wedge\vec x=\vec y\). Dans l'ordre inverse, on met un signe − : \(\vec z\wedge\vec y=-\vec x\).", **SRC)
    single("V11", "maths", r"Les vecteurs \(\vec u(1;1;1)\), \(\vec v(-1;1;0)\) et \(\vec w(1;0;1)\) forment-ils une base de l'espace ?",
           ["Oui, ils sont linéairement indépendants", "Non, ils sont coplanaires", "Non, car ils ne sont pas orthogonaux", "Non, car ils ne sont pas unitaires"], 0,
           r"\(a\vec u+b\vec v+c\vec w=\vec 0\) donne \(a-b+c=0\), \(a+b=0\), \(a+c=0\) → \(a=b=c=0\). Trois vecteurs indépendants forment une base "
           r"(une base n'a pas besoin d'être orthonormée).", **SRC)
    single("V12", "maths", r"Une équation paramétrique de la droite (AB) avec \(A(1;2)\) et \(B(4;5)\) est :",
           [r"\(\begin{cases}x=3\lambda+1\\y=3\lambda+2\end{cases}\)", r"\(\begin{cases}x=\lambda+4\\y=2\lambda+5\end{cases}\)",
            r"\(\begin{cases}x=3\lambda+4\\y=3\lambda+2\end{cases}\)", r"\(\begin{cases}x=\lambda+1\\y=\lambda+5\end{cases}\)"], 0,
           r"\(\overrightarrow{AM}=\lambda\overrightarrow{AB}\) avec \(\overrightarrow{AB}(3;3)\) : \(x=1+3\lambda\), \(y=2+3\lambda\). "
           r"Une droite a une infinité d'équations paramétriques.", **SRC)
    num("V13", "maths", r"Distance AB avec \(A(1;-1;2)\) et \(B(3;1;-4)\) (au centième).", round(math.sqrt(44), 2), 0.01, "",
        r"\(AB=\sqrt{2^2+2^2+(-6)^2}=\sqrt{44}=2\sqrt{11}\approx6{,}63\).", **SRC)
    single("V14", "maths", r"\(A(1;1)\), \(B(1;3)\), \(C(7;4)\), \(D(5;5)\). Que peut-on dire de \(\overrightarrow{AC}\) et \(\overrightarrow{BD}\) ?",
           ["Ils sont colinéaires : (AC) et (BD) sont parallèles", "Ils sont orthogonaux", "Ils sont égaux : ABDC est un parallélogramme", "Rien de particulier"], 0,
           r"\(\overrightarrow{AC}(6;3)\), \(\overrightarrow{BD}(4;2)\) : \(6\times2-3\times4=0\) → colinéaires, mais pas égaux. ABDC est un trapèze.", **SRC)


def puissance():
    p = lambda *a, **k: single(*a, **dict(SRC, **k))
    p("P1", "puis", "On dope du silicium avec des atomes possédant 5 électrons sur leur couche externe. On obtient un semi-conducteur :",
      ["de type N : porteurs majoritaires = électrons", "de type P : porteurs majoritaires = trous", "intrinsèque", "isolant"], 0,
      "4 électrons forment les liaisons covalentes avec le silicium, le 5e est quasi libre → porteurs majoritaires négatifs = type <b>N</b>. "
      "Avec 3 électrons (bore), il manque un électron : des trous → type P.")
    p("P2", "puis", "Une diode idéale est passante lorsque :", [r"\(V_{AK}\geq0\)", r"\(V_{AK}<0\)", "on envoie un courant de gâchette", r"\(V_{AK}\geq V_Z\)"], 0,
      "Diode idéale = interrupteur unidirectionnel non commandé : fermé si V<sub>AK</sub> ≥ 0, ouvert si V<sub>AK</sub> < 0.")
    num("P3", "puis", r"Une diode de seuil \(V_s=0{,}7\ \text{V}\) (modèle sans résistance) est en série avec \(R=100\ \Omega\) sous \(E=5\ \text{V}\), en sens direct. Courant (en mA) ?",
        43, 0.5, "mA", r"\(I=\dfrac{E-V_s}{R}=\dfrac{5-0{,}7}{100}=0{,}043\ \text{A}=43\ \text{mA}\).", **SRC)
    p("P4", "puis", "Une diode Zener polarisée en inverse au-delà de sa tension Zener se comporte comme :",
      ["une source de tension quasi idéale V<sub>Z</sub>", "un interrupteur ouvert", "une résistance très grande", "une source de courant"], 0,
      "En inverse, l'effet Zener / avalanche (non destructif) maintient V<sub>Z</sub> quasi constante : générateur de tension à très faible "
      "résistance interne. Utilisation : régulation de tension.")
    multi("P5", "puis", "Pour amorcer un thyristor, il faut (cochez les conditions nécessaires) :",
          [r"une tension \(V_{AK}\) positive", "un courant de gâchette suffisant", r"une tension \(V_{AK}\) négative", "annuler le courant anode-cathode"], [0, 1],
          "Amorçage : V<sub>AK</sub> > 0 <b>et</b> impulsion de gâchette. Un courant de gâchette envoyé quand V<sub>AK</sub> < 0 ne fait rien. "
          "Annuler i<sub>AK</sub> sert à le <b>bloquer</b>.", **SRC)
    p("P6", "puis", "Comment bloque-t-on un thyristor ?",
      ["En annulant le courant anode-cathode", "En supprimant le courant de gâchette", "En envoyant une impulsion négative sur la gâchette", "En augmentant V<sub>AK</sub>"], 0,
      "Le thyristor n'est commandable qu'à la fermeture : une fois amorcé, il reste passant tant que i<sub>AK</sub> ne s'annule pas "
      "(alternance négative, commutation par le reste du circuit).")
    num("P7", "puis", r"Transistor NPN en régime linéaire : \(\beta=150\), \(i_B=0{,}2\ \text{mA}\). Courant de collecteur \(i_C\) (en mA) ?", 30, 0.05, "mA",
        r"\(i_C=\beta\,i_B=150\times0{,}2=30\ \text{mA}\). (Et \(i_E=i_B+i_C=30{,}2\ \text{mA}\approx i_C\).)", **SRC)
    num("P8", "puis", r"Transistor en commutation : \(i_{C\,sat}=0{,}5\ \text{A}\), \(\beta=100\). Courant de base minimal pour saturer (en mA) ?", 5, 0.05, "mA",
        r"\(i_{B\,sat}=\dfrac{i_{C\,sat}}{\beta}=\dfrac{0{,}5}{100}=5\ \text{mA}\). En pratique on prend \(i_B\) un peu au-dessus pour garantir la saturation.", **SRC)
    p("P9", "puis", "En régime de commutation, un transistor bipolaire se comporte comme :",
      ["un interrupteur commandable à la fermeture et à l'ouverture", "un interrupteur commandable seulement à la fermeture",
       "un amplificateur de courant", "un interrupteur non commandable"], 0,
      "i<sub>B</sub> = 0 → bloqué (interrupteur ouvert) ; i<sub>B</sub> ≥ i<sub>B sat</sub> → saturé (fermé). La base commande les deux états, "
      "contrairement au thyristor (fermeture seulement) et à la diode (aucune commande).")
    p("P10", "puis", "Un triac est équivalent à :", ["deux thyristors montés tête-bêche", "deux diodes en série", "un transistor et une diode", "un thyristor et une diode Zener"], 0,
      "Deux thyristors en antiparallèle avec une gâchette commune : il conduit dans les deux sens et commande les deux alternances (gradateur).")
    num("P11", "puis", r"Pont de Graëtz à diodes parfaites alimenté par \(V=230\ \text{V}\) efficaces, charge résistive. Valeur moyenne de la tension redressée (en V) ?",
        round(2 * 230 * math.sqrt(2) / math.pi, 1), 1, "V",
        r"\(\hat V=230\sqrt2\approx325{,}3\ \text{V}\). \(\langle u\rangle=\dfrac{2\hat V}{\pi}=\dfrac{2\times325{,}3}{\pi}\approx207\ \text{V}\).", **SRC)
    num("P12", "puis", "Le réseau est à 50 Hz. Quelle est la fréquence de la tension redressée double alternance (pont de Graëtz) ?", 100, 0, "Hz",
        "Chaque alternance donne une arche : T' = T/2, donc <b>f' = 2f = 100 Hz</b>.", **SRC)
    p("P13", "puis", "Pour un bon lissage de la tension par un condensateur C en parallèle sur la charge R, il faut :",
      [r"\(RC\gg T\)", r"\(RC\ll T\)", r"\(RC=T\)", r"\(C\) le plus petit possible"], 0,
      "La constante de décharge RC doit être grande devant la période : le condensateur n'a pas le temps de se décharger, l'ondulation Δu reste faible. "
      "Ce lissage est réservé aux faibles courants (sinon on lisse le courant avec une bobine).")
    p("P14", "puis", "En régime périodique établi, la valeur moyenne de la tension aux bornes d'une bobine parfaite vaut :",
      ["0", "L·⟨i⟩", "U<sub>max</sub>/2", "elle dépend de L"], 0,
      r"\(u_L=L\dfrac{di}{dt}\) ; sur une période \(i(T)=i(0)\), donc \(\langle u_L\rangle=\dfrac LT\,[i(T)-i(0)]=0\). C'est ce qui donne \(\langle u\rangle=\langle u_C\rangle=R\langle i\rangle\).")
    num("P15", "puis", r"Redressement commandé à 2 thyristors, débit sur charge très inductive (conduction ininterrompue) : \(\langle u\rangle=\dfrac{2\hat V}{\pi}\cos\alpha\). "
        r"Avec \(\hat V=325\ \text{V}\) et \(\alpha=60°\), calculer \(\langle u\rangle\) (en V).", round(2 * 325 / math.pi * 0.5, 1), 1, "V",
        r"\(\langle u\rangle=\dfrac{2\times325}{\pi}\times\cos60°=206{,}9\times0{,}5\approx103{,}5\ \text{V}\).", **SRC)
    p("P16", "puis", r"Même montage (charge inductive, conduction continue), mais avec \(\alpha=120°\). Que vaut le signe de \(\langle u\rangle\) ?",
      ["Négatif : le montage peut renvoyer de l'énergie vers le réseau", "Positif", "Nul", "Le montage ne fonctionne pas"], 0,
      r"\(\cos120°=-0{,}5\) → \(\langle u\rangle<0\). Le courant reste positif grâce à la bobine : la puissance moyenne est négative, le pont fonctionne en onduleur assisté.")
    num("P17", "puis", r"Pont mixte (2 thyristors + 2 diodes) : \(\langle u\rangle=\dfrac{\hat V}{\pi}(1+\cos\alpha)\). Avec \(\hat V=325\ \text{V}\) et \(\alpha=60°\), calculer \(\langle u\rangle\) (en V).",
        round(325 / math.pi * 1.5, 1), 1, "V",
        r"\(\langle u\rangle=\dfrac{325}{\pi}(1+0{,}5)\approx155{,}2\ \text{V}\). Avec le pont mixte, u ne devient jamais négative (phases de roue libre par les diodes).", **SRC)
    num("P18", "puis", r"Hacheur série : \(U=48\ \text{V}\), rapport cyclique \(\alpha=0{,}25\). Valeur moyenne de la tension de sortie (en V) ?", 12, 0.01, "V",
        r"\(\langle v\rangle=\alpha U=0{,}25\times48=12\ \text{V}\). Hacheur dévolteur (abaisseur) : \(\langle v\rangle\leq U\).", **SRC)
    p("P19", "puis", "Dans un hacheur série alimentant une charge inductive, à quoi sert la diode de roue libre ?",
      ["À laisser passer le courant imposé par la bobine quand l'interrupteur s'ouvre", "À redresser la tension", "À augmenter la tension moyenne", "À commander le transistor"], 0,
      "La bobine impose la continuité du courant. Sans chemin, l'ouverture de K créerait une surtension (arc) qui détruirait le transistor. "
      "La diode conduit pendant (1 − α)T : la charge n'est alors pas alimentée.")
    num("P20", "puis", r"Hacheur série, courant de charge constant \(I=5\ \text{A}\), \(\alpha=0{,}6\). Courant moyen dans la diode de roue libre (en A) ?", 2, 0.01, "A",
        r"La diode conduit pendant \((1-\alpha)T\) : \(\langle i_D\rangle=(1-\alpha)I=0{,}4\times5=2\ \text{A}\). Le transistor, lui, voit \(\alpha I=3\ \text{A}\).", **SRC)
    num("P21", "puis", r"Un hacheur série commande un moteur à courant continu (résistances négligées, excitation constante). À \(\alpha=1\) le moteur tourne à 3000 tr/min. Vitesse pour \(\alpha=0{,}4\) ?",
        1200, 0.5, "tr/min", r"\(E=\alpha U\) et \(E=K'n\) → \(n=\alpha\,n_M=0{,}4\times3000=1200\) tr/min.", **SRC)
    p("P22", "puis", r"Pour diminuer l'ondulation \(\Delta i\) du courant dans la charge d'un hacheur, on peut :",
      ["augmenter L et/ou la fréquence de hachage", "diminuer L", "diminuer la fréquence de hachage", "augmenter U"], 0,
      "La bobine lisse le courant : plus L est grande et plus la période de hachage est courte, moins le courant a le temps de varier.")
    num("P23", "puis", r"Hacheur réversible en tension (T1 et T2 commandés simultanément) : \(\langle u_C\rangle=(2\alpha-1)U\). Avec \(U=100\ \text{V}\) et \(\alpha=0{,}3\), calculer \(\langle u_C\rangle\) (en V).",
        -40, 0.01, "V", r"\((2\times0{,}3-1)\times100=-40\ \text{V}\). Pour \(\alpha<0{,}5\) la tension moyenne est négative : la source de courant (MCC) renvoie de l'énergie.", **SRC)
    p("P24", "puis", "Hacheur réversible en courant : le moteur à courant continu est entraîné par la charge (fonctionnement en génératrice, i<sub>C</sub> < 0). Quels composants conduisent ?",
      ["D1 et T2 : fonctionnement en hacheur parallèle (survolteur)", "T1 et D2 : fonctionnement en hacheur série (dévolteur)", "T1 et T2", "D1 et D2"], 0,
      "Avec i<sub>C</sub> < 0, ce sont D1 et T2 qui conduisent : l'énergie va de la machine vers la source de tension (qui doit être réversible en courant). "
      "En moteur (i<sub>C</sub> > 0) : T1 et D2, hacheur série.")
    p("P25", "puis", "Quel convertisseur transforme une tension continue fixe en une tension de valeur moyenne réglable ?",
      ["Le hacheur", "Le redresseur", "L'onduleur", "Le gradateur"], 0,
      "Hacheur : continu → continu. Redresseur : alternatif → continu. Onduleur : continu → alternatif. Gradateur : alternatif → alternatif (même fréquence).")
    p("P26", "puis", "Dans un pont de Graëtz à diodes parfaites, pendant l'alternance positive de v, quelles diodes conduisent ?",
      ["D1 et D3", "D2 et D4", "D1 et D2", "Les quatre diodes"], 0,
      "Alternance positive : D1 et D3 passantes, u = v. Alternance négative : D2 et D4 passantes, u = −v. Chaque diode ne conduit qu'une alternance sur deux.")
    p("P27", "puis", r"Que définit le rapport \(\dfrac{\Delta u}{U_{max}}\) pour une tension redressée et filtrée ?",
      ["Le taux d'ondulation", "Le rapport cyclique", "Le facteur de puissance", "Le rendement"], 0,
      "C'est le <b>taux d'ondulation</b> : plus il est faible, meilleur est le lissage. Le rapport cyclique α concerne le hacheur.")
    num("P28", "puis", r"Transistor NPN : \(i_B=0{,}4\ \text{mA}\), \(i_C=48\ \text{mA}\). Calculer le gain en courant \(\beta\).", 120, 0.5, "",
        r"\(\beta=\dfrac{i_C}{i_B}=\dfrac{48}{0{,}4}=120\). Ordre de grandeur habituel : quelques dizaines à quelques centaines.", **SRC)


def build():
    bases()
    epicycloidal()
    maths()
    puissance()
