# -*- coding: utf-8 -*-
"""Assemble index.html à partir du gabarit et des banques de questions.

Usage : python3 src/build.py   (depuis le dossier test-positionnement)
"""
import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import common  # noqa: E402
import questions_test  # noqa: E402
import questions_new  # noqa: E402

SECTIONS = [
    ("base", "Changements de base"),
    ("epi", "Trains épicycloïdaux"),
    ("maths", "Mathématiques"),
    ("puis", "Électronique de puissance"),
    ("meca", "Mécanique"),
    ("elec", "Électricité et signaux"),
    ("auto", "Automatisme et logique"),
    ("constr", "Construction et fabrication"),
    ("gestion", "Organisation et gestion"),
    ("anglais", "Anglais"),
    ("fr", "Expression écrite"),
]


def _pt(cx, cy, r, deg):
    a = math.radians(deg)
    return cx + r * math.cos(a), cy - r * math.sin(a)


def _arrow(cx, cy, length, deg, cls):
    x2, y2 = _pt(cx, cy, length, deg)
    hx, hy = _pt(cx, cy, length - 9, deg)
    lx, ly = _pt(hx, hy, 4.2, deg + 90)
    rx, ry = _pt(hx, hy, 4.2, deg - 90)
    return ('<line class="%s" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>'
            '<polygon class="%s-h" points="%.1f,%.1f %.1f,%.1f %.1f,%.1f"/>'
            % (cls, cx, cy, hx, hy, cls, x2, y2, lx, ly, rx, ry))


def _arc(cx, cy, r, d0, d1):
    x0, y0 = _pt(cx, cy, r, d0)
    x1, y1 = _pt(cx, cy, r, d1)
    return '<path class="arc" d="M%.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f"/>' % (x0, y0, r, r, x1, y1)


def _label(x, y, txt, cls="lab", anchor="middle"):
    return '<text class="%s" x="%.1f" y="%.1f" text-anchor="%s">%s</text>' % (cls, x, y, anchor, txt)


def rotation_panel(ox, title, u0, v0, u1, v1, normal, ang):
    cx, cy, L, al = ox + 78, 100, 60, 30
    s = [_label(ox + 78, 18, title, "ttl")]
    s.append(_arrow(cx, cy, L, 0, "old"))
    s.append(_arrow(cx, cy, L, 90, "old"))
    s.append(_arrow(cx, cy, L, al, "new"))
    s.append(_arrow(cx, cy, L, 90 + al, "new"))
    s.append(_arc(cx, cy, 30, 0, al))
    s.append(_arc(cx, cy, 24, 90, 90 + al))
    for deg, txt, cls in ((0, u0, "lab"), (90, v0, "lab"), (al, u1, "lab new-t"), (90 + al, v1, "lab new-t")):
        x, y = _pt(cx, cy, L + 13, deg)
        s.append(_label(x, y + 5, txt, cls))
    x, y = _pt(cx, cy, 39, al / 2)
    s.append(_label(x, y + 4, ang, "ang"))
    x, y = _pt(cx, cy, 33, 90 + al / 2)
    s.append(_label(x, y + 4, ang, "ang"))
    s.append('<circle class="axis" cx="%.1f" cy="%.1f" r="6"/><circle class="dot" cx="%.1f" cy="%.1f" r="2"/>' % (cx, cy, cx, cy))
    s.append(_label(cx - 8, cy + 24, normal, "lab small", "end"))
    return "".join(s)


def fig_bases():
    panels = [
        rotation_panel(0, "Figure 1", "x₀", "y₀", "x₁", "y₁", "z₀ = z₁", "θ"),
        rotation_panel(175, "Figure 2", "y₁", "z₁", "y₂", "z₂", "x₁ = x₂", "φ"),
        rotation_panel(350, "Figure 3", "z₂", "x₂", "z₃", "x₃", "y₂ = y₃", "ψ"),
    ]
    return ('<svg class="fig fig-bases" viewBox="0 0 525 190" role="img" '
            'aria-label="Trois figures de changement de base : rotation theta autour de z0, phi autour de x1, psi autour de y2">'
            + "".join(panels) + "</svg>")


def _gear(cx, cy, r, teeth, cls, inner=False):
    pts = []
    n = teeth * 2
    for k in range(n):
        a = 2 * math.pi * k / n
        rr = (r + 2.2) if (k % 2 == 0) != inner else (r - 2.2)
        pts.append("%.1f,%.1f" % (cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return '<polygon class="%s" points="%s"/>' % (cls, " ".join(pts))


def fig_epi():
    cx, cy = 130, 130
    r1, r2, r3 = 25, 37.5, 100
    s = ['<circle class="ring" cx="%d" cy="%d" r="118"/>' % (cx, cy)]
    s.append(_gear(cx, cy, r3, 80, "ring-in", inner=True))
    sats = []
    for deg in (90, 210, 330):
        x, y = _pt(cx, cy, r1 + r2, deg)
        sats.append((x, y))
        s.append(_gear(x, y, r2, 30, "sat"))
    s.append(_gear(cx, cy, r1, 20, "sun"))
    for x, y in sats:
        s.append('<line class="carrier" x1="%d" y1="%d" x2="%.1f" y2="%.1f"/>' % (cx, cy, x, y))
        s.append('<circle class="pin" cx="%.1f" cy="%.1f" r="5"/>' % (x, y))
    s.append('<circle class="pin" cx="%d" cy="%d" r="6"/>' % (cx, cy))
    s.append(_label(cx + 15, cy - 6, "1", "num"))
    x, y = sats[0]
    s.append(_label(x + 16, y - 12, "2", "num"))
    s.append(_label(cx + 86, cy - 76, "3", "num"))
    x, y = sats[1]
    s.append(_label(cx - 2, cy + 50, "PS", "num"))
    legend = [("1", "planétaire, Z₁ = 20"), ("2", "satellites, Z₂ = 30"), ("3", "couronne (dents intérieures)"), ("PS", "porte-satellites")]
    for i, (k, v) in enumerate(legend):
        y = 60 + i * 30
        s.append(_label(272, y, k, "num", "start"))
        s.append(_label(302, y, v, "lab small", "start"))
    return ('<svg class="fig fig-epi" viewBox="0 0 500 260" role="img" '
            'aria-label="Train épicycloïdal simple vu de face : planétaire central, trois satellites, couronne extérieure et porte-satellites">'
            + "".join(s) + "</svg>")


def main():
    questions_test.build()
    questions_new.build()
    qs = common.QUESTIONS
    ids = [q["id"] for q in qs]
    assert len(ids) == len(set(ids)), "identifiants en double"
    secs = {k for k, _ in SECTIONS}
    for q in qs:
        assert q["sec"] in secs, q["id"]
        if q["kind"] in ("single", "tf"):
            assert 0 <= q["ans"] < len(q["opts"]), q["id"]
        if q["kind"] == "multi":
            assert all(0 <= i < len(q["opts"]) for i in q["ans"]), q["id"]
        for im in q.get("img", []):
            assert os.path.exists(os.path.join(HERE, "..", "img", im)), (q["id"], im)
    data = {
        "questions": qs,
        "sections": [{"id": k, "label": v} for k, v in SECTIONS],
        "figs": {"bases": fig_bases(), "epi": fig_epi()},
    }
    blob = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    with open(os.path.join(HERE, "template.html"), encoding="utf-8") as f:
        tpl = f.read()
    out = tpl.replace("/*__DATA__*/null", blob)
    with open(os.path.join(HERE, "..", "index.html"), "w", encoding="utf-8") as f:
        f.write(out)
    by = {}
    for q in qs:
        by.setdefault(q["sec"], [0, 0])[0 if q["src"] == "test" else 1] += 1
    print("questions :", len(qs))
    for k, v in SECTIONS:
        print("  %-28s test %3d  cours %3d" % (v, *by.get(k, [0, 0])))


if __name__ == "__main__":
    main()
