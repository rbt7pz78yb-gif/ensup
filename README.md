# Skänk en sup

Julkampanj från Round Table 71 Ljungby.

Live just nu: https://ensup.grok.me
Domän: ensup.se (Loopia)

## Köra lokalt

```bash
npm install
npm run dev
```

## Publicera utan Grok (Vercel + ensup.se)

1. Gå till https://vercel.com och logga in med GitHub.
2. Add New Project och välj `ensup`.
3. Deploy (standard, inget extra).
4. När den är live: Settings → Domains → Add `ensup.se` och `www.ensup.se`.
5. Vercel visar DNS-rader. I Loopia Kundzon, för ensup.se:
   - www → CNAME till det Vercel visar (ofta cname.vercel-dns.com)
   - @ → A till den IP Vercel visar
6. Spara. Vänta tills det slår igenom.

Rör inte MX-poster om ni har mejl på namnet.

## Swish

Nummer: 123 018 38 63
Meddelande: Skänk en sup
