/**
 * ARQUIVO DE CONFIGURAÇÃO DE IMAGENS DE FUNDO (HERO)
 * ---------------------------------------------------
 * Aqui você define as imagens de fundo para cada página da aplicação.
 * 
 * COMO USAR:
 * 1. URL Externa: Cole o link direto (ex: 'https://site.com/foto.jpg')
 * 2. Arquivo Local: 
 *    - Coloque sua imagem (png/jpg) na pasta 'public/assets/images/'
 *    - Use o caminho absoluto: '/assets/images/nome-do-arquivo.png'
 */

export const BACKGROUND_CONFIG = {
  // Página Principal (Booking/Home)
  // Tema: Rústico Escuro / Madeira / Couro
  HOME: {
    // Opção 1 (URL): 'https://images.unsplash.com/photo-...'
    // Opção 2 (Local): '/assets/images/home-bg.png'
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop',
    
    // Ajuste a opacidade da máscara preta para garantir leitura do texto (0.0 a 1.0)
    // Quanto maior, mais escuro o fundo fica na parte superior.
    opacityCheck: '40%' 
  },

  // Página de Perfil
  // Tema: Arquitetura / Linhas Modernas / Concreto
  PROFILE: {
    image: 'https://images.unsplash.com/photo-1503951914296-3a57f4750f0e?q=80&w=2070&auto=format&fit=crop',
    opacityCheck: '50%'
  },

  // Página Institucional (A Barbearia)
  // Tema: Clássico / Sepia / Vintage
  INSTITUTIONAL: {
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop',
    opacityCheck: '50%'
  },

  // Página de Avisos
  // Tema: Textura Limpa / Foco no Conteúdo
  ALERTS: {
    image: 'https://images.unsplash.com/photo-1634480532822-0df04dc54c6e?q=80&w=2069&auto=format&fit=crop',
    opacityCheck: '60%'
  }
};
