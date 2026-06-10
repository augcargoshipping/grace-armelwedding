# Grâce & Armel — Invitation de Mariage

Site d'invitation de mariage luxueux en français pour **Grâce & Armel** — Samedi 11 Juillet 2026.

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

> Sur Windows, les scripts utilisent Webpack (`--webpack`) pour éviter les problèmes Turbopack/SWC.

## Images placeholder

```bash
npm run placeholders
```

Remplacez ensuite les fichiers dans `public/images/` par vos photos.

**Séparateur floral entre sections :** remplacez `public/images/floral-divider.png` par votre fichier PNG (fond transparent recommandé, format horizontal).

## RSVP (Supabase)

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez `supabase/schema.sql` dans l'éditeur SQL
3. Copiez `.env.example` vers `.env.local` et renseignez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Où vont les réponses RSVP ?

Les soumissions sont enregistrées dans **Supabase**, table `rsvp_submissions`.

### Accès admin (recommandé)

1. Définissez `RSVP_ADMIN_PASSWORD` dans `.env.local` (et sur Vercel)
2. Ouvrez **`/admin/rsvp`** sur le site
3. Connectez-vous pour voir la liste, actualiser et exporter en CSV

### Accès direct Supabase

Dans le [tableau de bord Supabase](https://supabase.com/dashboard) → **Table Editor** → `rsvp_submissions`.

## Déploiement (Vercel)

1. Importez le dépôt
2. Ajoutez les variables d'environnement Supabase + `RSVP_ADMIN_PASSWORD`
3. Déployez

## Stack

- Next.js 16 · Tailwind CSS 4 · Framer Motion · GSAP · TypeScript
