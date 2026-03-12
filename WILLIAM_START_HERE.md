# William Start Here

Hej William-kouhai 🌸

Stort grattis. Du har nu en riktigt stark grund att bygga vidare mot i vår delade integrationsyta. Bra jobbat med att driva B2B-logiken framåt.

## The Contract

Vi har nu låst ett tydligt kontrakt i backend som din Python-logik kan mappa mot:

- Ny tabell: `public.ops_alerts`
  - Fångar nattligt beräknade operations-alerts (rule, severity, order, context, status).
  - Byggd för idempotent upsert och dashboard-visualisering.
- Utökning av `public.orders`
  - Nytt fält: `nyehandel_order_status` (`text`, nullable).
  - Syfte: 1:1-parity med statussemantik från din B2B-logik i nästa steg.

Målet framåt: när vi översätter regler från din Python-kod ska de landa i detta kontrakt, så att våra system pratar samma språk.

## Security Rules (Friendly but Firm)

- Alla nycklar, tokens och hemligheter ska ligga i `.env`/Supabase secrets. Aldrig hårdkodat i kod.
- Inga JSON/CSV/XLSX-filer med riktig kunddata får sparas i Git.
- Om exempeldata behövs: använd anonymiserad testdata.

Tack för att du bygger detta med oss. Vi kör vidare, senpai-style, stabilt och stegvis. ✨
