# Gerenciamento de Imagens - DarkVeil

Esta pasta (`assets/images`) é o local destinado para os arquivos estáticos da aplicação (PNG, JPG, SVG, WEBP).

## Como substituir as imagens placeholder:

1. Adicione seus arquivos de imagem nesta pasta.
   - Exemplo: `hero-bg.jpg`, `logo.png`, `corte-degrade.jpg`.

2. Edite o arquivo `constants.ts` na raiz do projeto.
3. Atualize o objeto `ASSETS` apontando para o caminho local.

### Exemplo de Configuração em `constants.ts`:

```typescript
export const ASSETS = {
  // Antes (Remoto)
  // HERO_BG: 'https://picsum.photos/800/800?grayscale',

  // Depois (Local)
  HERO_BG: '/assets/images/hero-bg.jpg',
};
```

## Padrão de Nomenclatura Sugerido

Mantenha nomes em minúsculo e separados por hífen (kebab-case) para evitar problemas em diferentes sistemas operacionais.

- `hero-bg.jpg` (Fundo da tela de agendamento)
- `service-corte.jpg` (Imagem do serviço de corte)
- `barber-marcus.jpg` (Foto do barbeiro Marcus)
