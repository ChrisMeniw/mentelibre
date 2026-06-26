// Tienda — se compra con monedas 🪙 ganadas jugando.

// Avatares premium tipo "skins" (los 7 base siguen siendo gratis en AvatarPicker).
export const PREMIUM_AVATARS = [
  { id: 'av_pixel',   emoji: '👾',   name: 'Pixel',    color: '#7C3AED', price: 80 },
  { id: 'av_ghost',   emoji: '👻',   name: 'Espectro', color: '#64748B', price: 60 },
  { id: 'av_genie',   emoji: '🧞',   name: 'Genio',    color: '#06B6D4', price: 100 },
  { id: 'av_heroine', emoji: '🦸‍♀️', name: 'Aurora',   color: '#EC4899', price: 70 },
  { id: 'av_villain', emoji: '🦹‍♀️', name: 'Hiedra',   color: '#7E22CE', price: 90 },
  { id: 'av_fae',     emoji: '🧚',   name: 'Lumina',   color: '#14B8A6', price: 50 },
  { id: 'av_fencer',  emoji: '🤺',   name: 'Florete',  color: '#475569', price: 60 },
  { id: 'av_elf',     emoji: '🧝',   name: 'Élfico',   color: '#22C55E', price: 120 },
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
