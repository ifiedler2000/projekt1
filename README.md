# Skriveni Šibenik

Jednostranični (single-page) statički web vodič kroz manje poznata mjesta grada
Šibenika — tvrđave, samostanske vrtove i šetnice uz more. Izrađeno kao studentski
projekt iz kolegija digitalne pismenosti. Sav vidljivi sadržaj je na hrvatskom jeziku.

## Live demo
https://skriveni-sibenik.netlify.app *(placeholder — zamijeniti stvarnim URL-om nakon objave)*

## Datoteke
- `index.html` — struktura stranice (hero, filtri + pretraga, kartice, kontakt obrazac, izvori, footer)
- `styles.css` — stilovi (CSS varijable, mobile-first, responzivno, Grid/Flexbox)
- `script.js` — filtriranje po kategoriji, live pretraga, validacija obrasca, GA4 događaji
- `assets/images/` — izvorne SVG ilustracije (hero + 6 kartica)
- `project-brief.md` — sažetak projekta (tema, publika, cilj, CTA, ton)
- `research-brief.md` — istraživanje lokacija i anotirana bibliografija izvora
- `README.md` — ovaj dokument

## Tehnologije
- HTML5 (semantički elementi, Open Graph meta oznake, `lang="hr"`)
- CSS3 (custom properties / tokeni, CSS Grid, Flexbox, responzivni dizajn)
- Vanilla JavaScript (bez okvira; `defer`)
- Google Analytics 4 (gtag.js — placeholder `G-XXXXXXXXXX`)
- Netlify Forms (kontaktni obrazac s honeypot zaštitom)
- SVG (izvorne ilustrativne slike)

## Pokretanje (lokalno)
Stranica je u potpunosti statička — nije potreban server build korak.
- Najjednostavnije: dvostruki klik na `index.html` da se otvori u pregledniku.
- Alternativno, pokrenite jednostavan lokalni server u mapi projekta, npr.
  `python -m http.server` pa otvorite `http://localhost:8000`.

## Objava (deploy) na Netlify
1. Postavite mapu `projekt1/` kao izvor (drag-and-drop ili povezivanjem repozitorija).
2. Build komanda nije potrebna; "publish directory" je korijen projekta.
3. Kontaktni obrazac (Netlify Forms) radi tek nakon objave na Netlifyju — atributi
   `data-netlify="true"`, skriveni `form-name` input i honeypot polje aktiviraju se
   na Netlify infrastrukturi, ne lokalno.
4. Prije objave zamijenite `G-XXXXXXXXXX` stvarnim GA4 Measurement ID-om u `index.html`.

## Autor
Studentski projekt — kolegij "Digitalna pismenost". Autorica: Ivana Fiedler.
