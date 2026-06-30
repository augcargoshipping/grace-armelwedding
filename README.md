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

## RSVP (Vercel Blob)

Les nouvelles réponses sont enregistrées dans **Vercel Blob** (fichier privé JSON).

1. Dans le [tableau de bord Vercel](https://vercel.com/dashboard) → votre projet → **Storage** → créez un store **Blob**
2. Connectez-le au projet (Vercel ajoute `BLOB_READ_WRITE_TOKEN` automatiquement)
3. Copiez `.env.example` vers `.env.local` et renseignez :
   - `BLOB_READ_WRITE_TOKEN`
   - `RSVP_ADMIN_PASSWORD`

### Anciennes réponses Supabase

Si Supabase est encore accessible, l’admin fusionne automatiquement les anciennes réponses avec les nouvelles.

Si le projet Supabase est en pause :
1. Réactivez-le brièvement dans Supabase **ou** exportez la table `rsvp_submissions` en JSON
2. Dans **`/admin/rsvp`**, utilisez **Importer archive** pour fusionner l’export dans Vercel Blob

Variables Supabase optionnelles (lecture seule / fusion) :
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Accès admin (recommandé)

1. Définissez `RSVP_ADMIN_PASSWORD` dans `.env.local` (et sur Vercel)
2. Ouvrez **`/admin/rsvp`** sur le site
3. Connectez-vous pour voir la liste, actualiser et exporter en CSV

### Accès direct Supabase

Dans le [tableau de bord Supabase](https://supabase.com/dashboard) → **Table Editor** → `rsvp_submissions`.

## Déploiement (Vercel)

1. Importez le dépôt
2. Ajoutez les variables d'environnement Blob + `RSVP_ADMIN_PASSWORD` (Supabase optionnel pour archives)
3. Déployez

## Stack

- Next.js 16 · Tailwind CSS 4 · Framer Motion · GSAP · TypeScript
