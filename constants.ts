import { Service, Barber, Announcement } from './types';

// --- Centralized Asset Management ---
// To use local images:
// 1. Place images in /assets/images/
// 2. Update these paths (e.g., '/assets/images/hero-bg.jpg')
export const ASSETS = {
  HERO_BG: 'assets/images/hero-bg.jpg',
  
  // Dynamic helpers to keep current mock logic or switch to static naming map
  getBarberAvatar: (id: string) => `https://picsum.photos/100/100?random=${id.replace(/\D/g,'')}`,
  getServiceImage: (id: string) => `https://picsum.photos/400/300?grayscale&blur=2&random=${id.replace(/\D/g,'')}`,
  getGalleryImage: (id: number) => `https://picsum.photos/400/300?random=${id}&grayscale`,
  getAnnouncementImage: (id: string) => `https://picsum.photos/600/300?random=${id.replace(/\D/g,'')}`
};

export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Corte de cabelo',
    description: 'Protocolo Italiano.',
    price: 60,
    durationMinutes: 45,
    imageUrl: ASSETS.getServiceImage('1')
  },
  {
    id: 's2',
    name: 'Cabelo e barba',
    description: 'Protocolo Italiano completo.',
    price: 100,
    durationMinutes: 75,
    imageUrl: ASSETS.getServiceImage('2')
  },
  {
    id: 's3',
    name: 'Barba',
    description: 'Protocolo Italiano com Lâmina Descartável.',
    price: 50,
    durationMinutes: 30,
    imageUrl: ASSETS.getServiceImage('3')
  },
   {
    id: 's4',
    name: 'Corte de Cabelo e hidratação',
    description: 'Renovação e estilo.',
    price: 90,
    durationMinutes: 60,
    imageUrl: ASSETS.getServiceImage('4')
  },
   {
    id: 's5',
    name: 'Corte de cabelo e Visagismo',
    description: 'Consultoria de imagem pessoal.',
    price: 120,
    durationMinutes: 90,
    imageUrl: ASSETS.getServiceImage('5')
  },
   {
    id: 's6',
    name: 'Barba e Visagismo',
    description: 'Design de barba harmonizado.',
    price: 90,
    durationMinutes: 60,
    imageUrl: ASSETS.getServiceImage('6')
  },
   {
    id: 's7',
    name: 'Hidratação capilar',
    description: 'Tratamento profundo.',
    price: 50,
    durationMinutes: 30,
    imageUrl: ASSETS.getServiceImage('7')
  },
   {
    id: 's8',
    name: 'Cabelo, Barba e Visagismo',
    description: 'Experiência completa DarkVeil.',
    price: 180,
    durationMinutes: 120,
    imageUrl: ASSETS.getServiceImage('8')
  },
];

export const BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Marcus "Fade" Aurelius',
    bio: 'Master of gradients and sharp lines.',
    avatarUrl: ASSETS.getBarberAvatar('1'),
    rating: 4.9,
    specialties: ['Fade', 'Beard']
  },
  {
    id: 'b2',
    name: 'Silas Vane',
    bio: 'Classic scissor cuts and styling.',
    avatarUrl: ASSETS.getBarberAvatar('2'),
    rating: 4.8,
    specialties: ['Scissor', 'Long Hair']
  },
  {
    id: 'b3',
    name: 'Elena Ray',
    bio: 'Texture expert and colorist.',
    avatarUrl: ASSETS.getBarberAvatar('3'),
    rating: 5.0,
    specialties: ['Texture', 'Color']
  }
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Holiday Hours',
    message: 'We will be closed on Dec 25th. Book your slot early!',
    date: '2023-12-01',
    imageUrl: ASSETS.getAnnouncementImage('10')
  },
  {
    id: 'a2',
    title: 'New Product Line',
    message: 'Check out our new beard oils available in store.',
    date: '2023-11-20'
  }
];

export const MOCK_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];