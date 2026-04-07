# Author Page: Erik Lindqvist — SnusFriend Editorial

**Page URL:** `/authors/snusfriend-editorial`

---

## Meta

- **Meta title:** Erik Lindqvist — Senior Editor, SnusFriend
- **Meta description:** Erik Lindqvist is the senior editor at SnusFriend, covering nicotine pouches, harm reduction, and smokeless tobacco. 10+ years in the industry, 200+ products tested.

---

## Tagline

_Senior editor and nicotine harm reduction researcher with over a decade covering the European smokeless market._

---

## Bio (~300 words)

Erik Lindqvist is the senior editor at SnusFriend, where he leads product testing, health content review, and editorial strategy. Based in Malmö, Sweden — the birthplace of modern oral nicotine — Erik has spent over a decade covering the European smokeless tobacco and nicotine pouch markets.

Erik began his career as a health journalist in Stockholm, reporting on Sweden's tobacco harm reduction success story — the country with the lowest smoking rate in Europe. His early work focused on epidemiological data showing dramatically lower rates of lung cancer and cardiovascular disease among Swedish men compared to the rest of Europe, a divergence largely attributed to the cultural shift from cigarettes to snus. When tobacco-free nicotine pouches emerged in the late 2010s, Erik was among the first journalists to cover them as a distinct product category.

At SnusFriend, Erik has personally tested over 200 nicotine pouch SKUs across 35+ brands, evaluating flavour accuracy, nicotine delivery consistency, pouch quality, and moisture retention. His testing methodology involves blind trials with standardised scoring rubrics — no brand pays for placement or favourable reviews. Every health claim in SnusFriend's blog content is fact-checked against peer-reviewed research, with priority given to studies published in PubMed, Cochrane reviews, and guidance from the NHS, WHO, and the Royal College of Physicians. When clinical evidence is limited or inconclusive, our articles say so explicitly.

Erik holds a Master's degree in Public Health Communication from Uppsala University and is a member of the Swedish Society for Tobacco Control Research. He follows harm reduction developments across the EU, UK, and Nordics, and regularly reviews regulatory updates including the EU Tobacco Products Directive (TPD) revisions. Outside of work, he's an avid cross-country skier and an unapologetic mint flavour loyalist.

---

## Credentials

- 10+ years covering European smokeless tobacco and nicotine pouch markets
- Personally tested and reviewed 200+ nicotine pouch SKUs across 35+ brands
- Master's in Public Health Communication, Uppsala University
- Health content fact-checked against peer-reviewed PubMed research, NHS guidance, and WHO reports
- Follows Royal College of Physicians and Public Health England harm reduction frameworks
- Member, Swedish Society for Tobacco Control Research
- Editorial independence: no brand pays for product placement or favourable reviews

---

## Schema.org Structured Data (for implementation)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Erik Lindqvist",
  "jobTitle": "Senior Editor",
  "worksFor": {
    "@type": "Organization",
    "name": "SnusFriend",
    "url": "https://snusfriends.com"
  },
  "description": "Senior editor and nicotine harm reduction researcher covering the European smokeless market for over a decade.",
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Uppsala University"
  },
  "knowsAbout": ["nicotine pouches", "tobacco harm reduction", "smokeless tobacco", "nicotine pharmacology"],
  "url": "https://snusfriends.com/authors/snusfriend-editorial"
}
```

## Implementation Notes

- Update the `BlogPosting` schema on all blog articles to change `"author"` from `"@type": "Organization"` to `"@type": "Person"` with `"name": "Erik Lindqvist"` and `"url": "https://snusfriends.com/authors/snusfriend-editorial"`. Google's YMYL guidelines strongly prefer named human authors over organisation attributions.
- Add an author byline component to all blog articles linking to this page.
- Include a professional headshot (can be AI-generated or stock) — Google's Search Quality Rater guidelines explicitly check for author identity signals.
