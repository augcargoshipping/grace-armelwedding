export const COUPLE = {
  bride: "Grâce",
  groom: "Armel",
  full: "Grâce & Armel",
  initials: "G&A",
} as const;

export const WEDDING = {
  type: "Mariage Civil",
  dateDisplay: "11 Juillet 2026",
  dateLong: "Samedi 11 Juillet 2026",
  dateIso: "2026-07-11",
  countdown: new Date("2026-07-11T10:30:00+02:00"),
  dayContact: "+33 6 35 42 84 48",
} as const;

export const COPY = {
  heroSubtitle:
    "Nous avons l'immense joie de vous inviter à célébrer notre union.",
  bibleVerse:
    "Mais par-dessus tout cela,\nrevêtez-vous de l'amour,\nqui est le lien de la perfection.",
  bibleRef: "Colossiens 3:14",
  storyTitle: "Notre Histoire",
  storyText:
    "Deux destins, un même chemin. Entre rires partagés, regards complices et promesses murmurées, notre histoire s'est écrite page après page — jusqu'à ce jour où nous choisissons de dire oui, devant ceux que nous aimons.",
  programTitle: "Programme de la Journée",
  galleryTitle: "Galerie",
  gallerySubtitle: "Quelques instants avant le grand jour",
  rsvpTitle: "Confirmer ma présence",
  rsvpNotice: "INVITATION STRICTEMENT PERSONNELLE",
  rsvpLimited: "Nombre de places limité.",
  rsvpPrompt: "Merci de confirmer votre présence.",
  infoTitle: "Informations Importantes",
  footerThanks: "Merci de partager ce moment précieux avec nous.",
  openerTap: "Appuyez sur le sceau pour ouvrir",
  openerOpening: "Ouverture de votre invitation…",
} as const;

export const PROGRAM = [
  {
    id: "ceremony",
    time: "10:30 – 12:00",
    title: "Cérémonie Civile",
    venue: "Mairie de Villepinte",
    address: "Place de l'Hôtel de Ville",
    city: "93420 Villepinte",
    mapsQuery: "Mairie de Villepinte, Place de l'Hôtel de Ville, 93420 Villepinte",
  },
  {
    id: "photos",
    time: "12:00 – 13:30",
    title: "Séance Photo à la Roseraie",
    venue: "Parc Avenue Charles de Gaulle",
    address: "Parc Avenue Charles de Gaulle",
    city: "93420 Villepinte",
    mapsQuery: "Roseraie Parc Avenue Charles de Gaulle, 93420 Villepinte",
  },
  {
    id: "blessing",
    time: "13:30 – 16:00",
    title: "Bénédiction Nuptiale",
    venue: "Église Connexion",
    address: "53 Avenue Sully",
    city: "93190 Livry-Gargan",
    mapsQuery: "Église Connexion, 53 Avenue Sully, 93190 Livry-Gargan",
  },
  {
    id: "vin",
    time: "16:00 – 19:00",
    title: "Vin d'Honneur",
    venue: "Église Connexion",
    address: "53 Avenue Sully",
    city: "93190 Livry-Gargan",
    mapsQuery: "Église Connexion, 53 Avenue Sully, 93190 Livry-Gargan",
  },
  {
    id: "reception",
    time: "19:00",
    title: "Réception",
    venue: "Salle Joséphine Baker",
    address: "251 Avenue Jean Fourgeaud",
    city: "93420 Villepinte",
    mapsQuery: "Salle Joséphine Baker, 251 Avenue Jean Fourgeaud, 93420 Villepinte",
  },
] as const;

export const VENUES = [
  {
    id: "mairie",
    name: "Mairie de Villepinte",
    description: "Cérémonie civile",
    address: "Place de l'Hôtel de Ville, 93420 Villepinte",
    mapsUrl: "https://maps.google.com/?q=Mairie+de+Villepinte,+93420+Villepinte",
  },
  {
    id: "roseraie",
    name: "Roseraie de Villepinte",
    description: "Séance photo",
    address: "Parc Avenue Charles de Gaulle, 93420 Villepinte",
    mapsUrl: "https://maps.google.com/?q=Roseraie+Parc+Avenue+Charles+de+Gaulle,+93420+Villepinte",
  },
  {
    id: "eglise",
    name: "Église Connexion",
    description: "Bénédiction & vin d'honneur",
    address: "53 Avenue Sully, 93190 Livry-Gargan",
    mapsUrl: "https://maps.google.com/?q=Église+Connexion,+53+Avenue+Sully,+93190+Livry-Gargan",
  },
  {
    id: "reception",
    name: "Salle Joséphine Baker",
    description: "Réception",
    address: "251 Avenue Jean Fourgeaud, 93420 Villepinte",
    mapsUrl: "https://maps.google.com/?q=Salle+Joséphine+Baker,+251+Avenue+Jean+Fourgeaud,+93420+Villepinte",
  },
] as const;

export const GALLERY_IMAGES = [
  { src: "/images/gallery/01.jpg", alt: "Portrait de Grâce et Armel" },
  { src: "/images/gallery/02.jpg", alt: "Moment complice" },
  { src: "/images/gallery/03.jpg", alt: "Séance de fiançailles" },
  { src: "/images/gallery/04.jpg", alt: "Promenade romantique" },
  { src: "/images/gallery/05.jpg", alt: "Regard tendre" },
  { src: "/images/gallery/06.jpg", alt: "Préparatifs du grand jour" },
] as const;

export const WEDDING_IMAGES = {
  hero: "/images/hero.png",
  heroPhoto: "/images/hero-photo.png",
  story: "/images/story.jpg",
  storyAccent: "/images/story-accent.jpg",
} as const;

export const WEDDING_AUDIO = {
  src: "/audio/videoplayback%20(2).m4a",
} as const;
