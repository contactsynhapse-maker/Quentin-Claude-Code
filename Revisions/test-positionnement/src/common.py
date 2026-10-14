# -*- coding: utf-8 -*-
"""Petits constructeurs de questions partagés par les fichiers de données."""

QUESTIONS = []


def _add(qid, sec, kind, q, ans, expl, opts=None, img=None, note=None, src="test", fig=None, **extra):
    item = {"id": qid, "sec": sec, "kind": kind, "q": q, "ans": ans, "expl": expl, "src": src}
    if opts is not None:
        item["opts"] = opts
    if img:
        item["img"] = img
    if note:
        item["note"] = note
    if fig:
        item["fig"] = fig
    item.update(extra)
    QUESTIONS.append(item)


def single(qid, sec, q, opts, ans, expl, **kw):
    _add(qid, sec, "single", q, ans, expl, opts=opts, **kw)


def multi(qid, sec, q, opts, ans, expl, **kw):
    _add(qid, sec, "multi", q, sorted(ans), expl, opts=opts, **kw)


def tf(qid, sec, q, value, expl, **kw):
    _add(qid, sec, "tf", q, 0 if value else 1, expl, opts=["Vrai", "Faux"], **kw)


def num(qid, sec, q, ans, tol, unit, expl, **kw):
    _add(qid, sec, "num", q, ans, expl, tol=tol, unit=unit, **kw)


def text(qid, sec, q, accept, expl, hint=None, **kw):
    _add(qid, sec, "text", q, accept, expl, shown=hint or accept[0], **kw)


def match(qid, sec, q, pairs, pool, expl, **kw):
    items = [p[0] for p in pairs]
    ans = [pool.index(p[1]) for p in pairs]
    _add(qid, sec, "match", q, ans, expl, opts=pool, items=items, **kw)


def kmap(rows):
    """Tableau de Karnaugh 4x4 : rows = valeurs pour ab = 00, 01, 11, 10 ; colonnes cd = 00, 01, 11, 10."""
    gray = ["00", "01", "11", "10"]
    head = "".join("<th>%s</th>" % g for g in gray)
    body = "".join(
        "<tr><th>%s</th>%s</tr>" % (gray[i], "".join("<td>%s</td>" % c for c in row)) for i, row in enumerate(rows)
    )
    return ('<div class="kmap-wrap"><table class="kmap"><caption>S (lignes : a b, colonnes : c d)</caption>'
            '<tr><th class="corner">ab \\ cd</th>%s</tr>%s</table></div>' % (head, body))
