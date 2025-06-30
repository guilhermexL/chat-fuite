# Chat Noir - Jogo do 'Pegue o Gato'

Um jogo de estratégia onde você deve cercar o gato antes que ele escape pelas bordas do tabuleiro. Desenvolvido com React, Next.js e TypeScript.

## Sobre o Jogo

Chat Noir é um jogo de estratégia baseado no clássico "Circle the Cat". O objetivo é simples: cerque o gato colocando cercas estrategicamente antes que ele consiga escapar pelas bordas do tabuleiro.

### Regras do Jogo

- **Objetivo**: Cercar completamente o gato 🐱 antes que ele escape
- **Sua vez**: Clique em células vazias para colocar cercas 🚧
- **Turno da CPU**: O gato se move automaticamente usando algoritmo de pathfinding
- **Vitória**: Você vence se o gato ficar completamente cercado
- **Derrota**: A CPU vence se o gato alcançar qualquer borda verde
- **Configuração inicial**: 12 cercas são colocadas aleatoriamente no tabuleiro

## Demonstração

[🎮 Jogar Online](https://chat-noir.vercel.app/)

## Tecnologias Utilizadas

### **Frontend Framework**
- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[React 18](https://reactjs.org/)** - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript

### **Estilização**
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI reutilizáveis
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones SVG

### **Gerenciamento de Estado**
- **React Hooks** - useState, useEffect, useCallback
- **Local Storage** - Persistência de dados do placar

### **Algoritmos Implementados**
- **BFS (Breadth-First Search)** - Pathfinding para movimento da IA
- **Algoritmo de Detecção de Cerco** - Verificação de vitória/derrota
- **Geração Procedural** - Posicionamento aleatório de cercas iniciais

### **Ferramentas de Desenvolvimento**
- **[ESLint](https://eslint.org/)** - Linting de código JavaScript/TypeScript
- **[Prettier](https://prettier.io/)** - Formatação automática de código
- **[PostCSS](https://postcss.org/)** - Processamento de CSS

### **Build e Deploy**
- **[Vercel](https://vercel.com/)** - Plataforma de deploy e hospedagem

## Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **yarn** >= 1.22.0

## Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/guilhermexL/xxxxx.git
cd chat-noir-game
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Execute o projeto
```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto

```
chat-noir-game/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal do jogo
├── components/            # Componentes React
│   └── ui/               # Componentes shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       └── badge.tsx
├── lib/                  # Utilitários
│   └── utils.ts         # Funções auxiliares
├── public/              # Arquivos estáticos
├── package.json         # Dependências e scripts
├── tailwind.config.js   # Configuração do Tailwind
├── tsconfig.json        # Configuração do TypeScript
└── next.config.js       # Configuração do Next.js
```

## Componentes Principais

### **GameBoard**
- Renderização do tabuleiro 11x11
- Gerenciamento de cliques do usuário
- Animações e transições visuais

### **GameLogic**
- Algoritmo BFS para pathfinding da IA
- Detecção de condições de vitória/derrota
- Gerenciamento de turnos

### **ScoreSystem**
- Persistência de dados no localStorage
- Cálculo de estatísticas de jogo
- Exibição de placar em tempo real

### **UI Components**
- Cards responsivos para placar
- Badges para status do jogo
- Botões com ícones e estados

## Algoritmos Implementados

### **Pathfinding (BFS)**
```typescript
// Encontra o caminho mais curto até a borda
const findPathToEdge = (start: Position): Position[] => {
  const queue = [{ pos: start, path: [start] }]
  const visited = new Set<string>()
  
  while (queue.length > 0) {
    const { pos, path } = queue.shift()!
    
    if (isEdge(pos)) return path
    
    // Explorar vizinhos válidos...
  }
  
  return [] // Sem caminho encontrado
}
```

### **Detecção de Movimento Hexagonal**
```typescript
// Simula movimento hexagonal em grade quadrada
const HEX_DIRECTIONS = [
  { row: -1, col: 0 },  // Norte
  { row: -1, col: 1 },  // Nordeste
  { row: 0, col: 1 },   // Sudeste
  { row: 1, col: 0 },   // Sul
  { row: 1, col: -1 },  // Sudoeste
  { row: 0, col: -1 },  // Noroeste
]
```

## Recursos Implementados

### **Funcionalidades Principais**
- [x] Tabuleiro hexagonal simulado (11x11)
- [x] IA inteligente usando BFS
- [x] Sistema de turnos alternados
- [x] Detecção automática de vitória/derrota
- [x] Placar persistente (localStorage)
- [x] Interface responsiva (mobile-first)

### **Recursos Adicionais**
- [x] Animações suaves
- [x] Contador de movimentos
- [x] Taxa de vitória
- [x] Compartilhamento de resultados
- [x] Instruções interativas
- [x] Temas visuais otimizados

### **Melhorias Futuras**
- [ ] Níveis de dificuldade
- [ ] Modo multiplayer local
- [ ] Sistema de conquistas
- [ ] Modo escuro
- [ ] Efeitos sonoros
- [ ] PWA (Progressive Web App)

## Performance

### **Otimizações Implementadas**
- **React.memo** para componentes puros
- **useCallback** para funções estáveis
- **Lazy loading** de componentes
- **CSS-in-JS** otimizado com Tailwind
- **Bundle splitting** automático (Next.js)

## Licença

Este projeto é destinado a fins educacionais e de aprendizado. Sinta-se à vontade para usar, modificar e distribuir, desde que os créditos sejam mantidos.

## Autor

**Me encontre em:**
- GitHub: [@GuilhermexL](https://github.com/guilhermexL)
- LinkedIn: [Guilherme S.](https://linkedin.com/in/guilhermee-santos)

<div align="center">
<b>Se você gostou do projeto, não esqueça de dar uma estrela!</b>
</div>
