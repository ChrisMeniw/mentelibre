// Tienda — se compra con monedas 🪙 ganadas jugando.

// Avatares premium (los 7 base siguen siendo gratis en AvatarPicker).
export const PREMIUM_AVATARS = [
  { id: 'av_unicornio', emoji: '🦄', name: 'Estela', color: '#EC4899', price: 80 },
  { id: 'av_tigre',     emoji: '🐯', name: 'Rayo',   color: '#F59E0B', price: 60 },
  { id: 'av_rex',       emoji: '🦖', name: 'Rex',    color: '#22C55E', price: 100 },
  { id: 'av_ballena',   emoji: '🐳', name: 'Marea',  color: '#0EA5E9', price: 70 },
  { id: 'av_aguila',    emoji: '🦅', name: 'Vento',  color: '#92400E', price: 90 },
  { id: 'av_pulpo',     emoji: '🐙', name: 'Octa',   color: '#A855F7', price: 50 },
  { id: 'av_lobo',      emoji: '🐺', name: 'Nieve',  color: '#64748B', price: 60 },
  { id: 'av_pavo',      emoji: '🦚', name: 'Iris',   color: '#14B8A6', price: 120 },
]

// Mascotas — te acompañan en el mapa y en tu perfil.
export const PETS = [
  { id: 'pet_perro',  emoji: '🐶', name: 'Cachorro',  price: 40 },
  { id: 'pet_gato',   emoji: '🐱', name: 'Michi',     price: 40 },
  { id: 'pet_pollito',emoji: '🐥', name: 'Pío',       price: 25 },
  { id: 'pet_conejo', emoji: '🐰', name: 'Saltarín',  price: 35 },
  { id: 'pet_tortuga',emoji: '🐢', name: 'Tuga',      price: 30 },
  { id: 'pet_abeja',  emoji: '🐝', name: 'Zumba',     price: 30 },
  { id: 'pet_zorro',  emoji: '🦦', name: 'Nutria',    price: 55 },
  { id: 'pet_dragon', emoji: '🐲', name: 'Chispa',    price: 150 },
]

// Marcos / auras — un anillo de color alrededor de tu avatar.
export const FRAMES = [
  { id: 'fr_oro',     name: 'Oro',      price: 50,  ring: 'linear-gradient(135deg,#FDE68A,#FBBF24)', glow: '#FBBF24' },
  { id: 'fr_fuego',   name: 'Fuego',    price: 70,  ring: 'linear-gradient(135deg,#FB923C,#EF4444)', glow: '#F97316' },
  { id: 'fr_hielo',   name: 'Hielo',    price: 70,  ring: 'linear-gradient(135deg,#A5F3FC,#38BDF8)', glow: '#38BDF8' },
  { id: 'fr_neon',    name: 'Neón',     price: 90,  ring: 'linear-gradient(135deg,#A3E635,#22D3EE)', glow: '#22D3EE' },
  { id: 'fr_arcoiris',name: 'Arcoíris', price: 130, ring: 'conic-gradient(#F43F5E,#FBBF24,#10B981,#0EA5E9,#A855F7,#F43F5E)', glow: '#A855F7' },
]

export function petById(id) { return PETS.find((p) => p.id === id) || null }
export function frameById(id) { return FRAMES.find((f) => f.id === id) || null }
export function premiumAvatarByEmoji(emoji) { return PREMIUM_AVATARS.find((a) => a.emoji === emoji) || null }
