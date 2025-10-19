# 📘 Guia Rápido - Componentes e Sistema de Design

## 🎨 Como Usar os Componentes

### 1. Button

```typescript
import { ButtonComponent } from './components/button/button.component';

// No @Component
imports: [ButtonComponent]
```

```html
<!-- Variantes -->
<app-button [variant]="'primary'">Primary</app-button>
<app-button [variant]="'secondary'">Secondary</app-button>
<app-button [variant]="'success'">Success</app-button>
<app-button [variant]="'outline'">Outline</app-button>
<app-button [variant]="'ghost'">Ghost</app-button>

<!-- Tamanhos -->
<app-button [size]="'sm'">Small</app-button>
<app-button [size]="'md'">Medium</app-button>
<app-button [size]="'lg'">Large</app-button>

<!-- Full width -->
<app-button [fullWidth]="true">Full Width</app-button>

<!-- Botão ícone -->
<app-button [icon]="true" [size]="'md'">
  ⚙️
</app-button>

<!-- Desabilitado -->
<app-button [disabled]="true">Disabled</app-button>
```

---

### 2. Card

```typescript
import { CardComponent } from './components/card/card.component';

imports: [CardComponent]
```

```html
<!-- Card básico -->
<app-card>
  Conteúdo do card
</app-card>

<!-- Card com sombra -->
<app-card [elevated]="true">
  Card elevado
</app-card>

<!-- Card com hover -->
<app-card [hoverable]="true">
  Card interativo
</app-card>

<!-- Card completo -->
<app-card [elevated]="true" [hasHeader]="true" [hasFooter]="true">
  <div card-header>
    <h3>Título do Card</h3>
  </div>
  
  <p>Conteúdo principal</p>
  
  <div card-footer>
    <app-button [variant]="'primary'">Ação</app-button>
  </div>
</app-card>
```

---

### 3. Container

```typescript
import { ContainerComponent } from './components/container/container.component';

imports: [ContainerComponent]
```

```html
<!-- Container padrão (lg, centrado) -->
<app-container>
  Conteúdo centralizado
</app-container>

<!-- Diferentes tamanhos -->
<app-container [size]="'sm'">Small (640px)</app-container>
<app-container [size]="'md'">Medium (768px)</app-container>
<app-container [size]="'lg'">Large (1024px)</app-container>
<app-container [size]="'xl'">XL (1280px)</app-container>
<app-container [size]="'full'">Full Width</app-container>

<!-- Sem padding -->
<app-container [noPadding]="true">
  Sem padding lateral
</app-container>
```

---

### 4. Theme Toggle

```typescript
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

imports: [ThemeToggleComponent]
```

```html
<!-- Simples assim! -->
<app-theme-toggle></app-theme-toggle>
```

---

## 🎯 Theme Service

```typescript
import { ThemeService } from './services/theme.service';

constructor(private themeService: ThemeService) {}

// Alternar tema
toggleTheme() {
  this.themeService.toggleTheme();
}

// Verificar se está escuro
isDark() {
  return this.themeService.isDark();
}

// Definir tema específico
setLightTheme() {
  this.themeService.setTheme('light');
}

setDarkTheme() {
  this.themeService.setTheme('dark');
}

setAutoTheme() {
  this.themeService.setTheme('auto');
}
```

---

## 📐 Mixins SCSS

### Importar no seu componente

```scss
@use '../../styles/mixins' as *;
@use '../../styles/breakpoints' as *;
```

### Flexbox

```scss
.container {
  @include flex-center;        // Centraliza tudo
  @include flex-between;       // Space between
  @include flex-column;        // Coluna
  @include flex-center-column; // Coluna centralizada
}
```

### Responsividade

```scss
.element {
  font-size: 1rem;
  
  // A partir de 768px
  @include respond-to('md') {
    font-size: 1.25rem;
  }
  
  // Até 767px
  @include respond-below('md') {
    font-size: 0.875rem;
  }
  
  // Entre 576px e 767px
  @include respond-between('sm', 'md') {
    font-size: 1.125rem;
  }
}
```

### Componentes

```scss
.card {
  @include container(1024px);  // Container responsivo
  @include card-hover;         // Efeito hover
  @include glass-morphism;     // Efeito de vidro
}

.button {
  @include reset-button;       // Remove estilos padrão
}

.list {
  @include reset-list;         // Remove estilos de lista
}
```

### Texto

```scss
.text {
  @include truncate;           // Texto com ... no final
  @include line-clamp(3);      // Limita a 3 linhas
}
```

### Animações

```scss
.modal {
  @include fade-in;            // Fade in suave
  @include slide-up;           // Desliza para cima
}
```

### Scrollbar

```scss
.scrollable {
  @include custom-scrollbar;   // Scrollbar personalizada
}
```

---

## 🎨 Variáveis CSS

### Cores

```css
/* Principais */
var(--color-primary)          /* Vermelho tomate */
var(--color-primary-hover)
var(--color-secondary)         /* Azul */
var(--color-success)          /* Verde */

/* Backgrounds */
var(--bg-primary)
var(--bg-secondary)
var(--bg-tertiary)

/* Textos */
var(--text-primary)
var(--text-secondary)
var(--text-tertiary)
var(--text-inverse)

/* Borders */
var(--border-color)
var(--border-color-light)
```

### Espaçamento

```css
var(--spacing-xs)    /* 4px */
var(--spacing-sm)    /* 8px */
var(--spacing-md)    /* 16px */
var(--spacing-lg)    /* 24px */
var(--spacing-xl)    /* 32px */
var(--spacing-xxl)   /* 48px */
var(--spacing-xxxl)  /* 64px */
```

### Tipografia

```css
/* Tamanhos */
var(--font-size-xs)   /* 12px */
var(--font-size-sm)   /* 14px */
var(--font-size-base) /* 16px */
var(--font-size-lg)   /* 18px */
var(--font-size-xl)   /* 20px */
var(--font-size-2xl)  /* 24px */
var(--font-size-3xl)  /* 30px */
var(--font-size-4xl)  /* 36px */
var(--font-size-5xl)  /* 48px */
var(--font-size-6xl)  /* 64px */

/* Pesos */
var(--font-weight-light)     /* 300 */
var(--font-weight-normal)    /* 400 */
var(--font-weight-medium)    /* 500 */
var(--font-weight-semibold)  /* 600 */
var(--font-weight-bold)      /* 700 */
```

### Efeitos

```css
/* Sombras */
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--shadow-xl)

/* Border radius */
var(--radius-sm)    /* 4px */
var(--radius-md)    /* 8px */
var(--radius-lg)    /* 16px */
var(--radius-full)  /* 9999px */

/* Transições */
var(--transition-fast)  /* 150ms */
var(--transition-base)  /* 250ms */
var(--transition-slow)  /* 350ms */
```

---

## 🛠️ Classes Utilitárias

### Display

```html
<div class="d-flex">Flex</div>
<div class="d-none">Escondido</div>
<div class="d-block">Block</div>
```

### Flexbox

```html
<div class="d-flex flex-center">Centralizado</div>
<div class="d-flex flex-between">Space between</div>
<div class="d-flex flex-column">Coluna</div>
<div class="d-flex justify-center align-center">Centro</div>
```

### Espaçamento

```html
<div class="m-md">Margin 16px</div>
<div class="p-lg">Padding 24px</div>
<div class="mx-auto">Margin X auto</div>
<div class="my-sm">Margin Y 8px</div>
<div class="mt-xl">Margin top 32px</div>
```

### Tipografia

```html
<p class="text-center">Centralizado</p>
<p class="text-primary">Cor primária</p>
<p class="text-xl font-bold">Grande e negrito</p>
<p class="truncate">Texto longo que será truncado...</p>
```

### Visual

```html
<div class="rounded-md">Bordas arredondadas</div>
<div class="shadow-lg">Sombra grande</div>
<div class="w-full">Largura 100%</div>
<div class="bg-secondary">Background secundário</div>
```

---

## 📱 Breakpoints

```
xs:  0px
sm:  576px
md:  768px
lg:  992px
xl:  1200px
xxl: 1400px
```

### Exemplo Prático

```scss
.elemento {
  // Mobile (padrão)
  font-size: 1rem;
  padding: 1rem;
  
  // Tablet (768px+)
  @include respond-to('md') {
    font-size: 1.25rem;
    padding: 1.5rem;
  }
  
  // Desktop (992px+)
  @include respond-to('lg') {
    font-size: 1.5rem;
    padding: 2rem;
  }
}
```

---

## 🎯 Exemplo Completo

```typescript
// component.ts
import { Component } from '@angular/core';
import { ContainerComponent } from './components/container/container.component';
import { CardComponent } from './components/card/card.component';
import { ButtonComponent } from './components/button/button.component';

@Component({
  selector: 'app-example',
  imports: [ContainerComponent, CardComponent, ButtonComponent],
  template: `
    <app-container [size]="'lg'">
      <app-card [elevated]="true" [hasHeader]="true">
        <div card-header>
          <h3>Título</h3>
        </div>
        
        <p>Conteúdo do card</p>
        
        <div class="d-flex gap-md mt-lg">
          <app-button [variant]="'primary'">Confirmar</app-button>
          <app-button [variant]="'outline'">Cancelar</app-button>
        </div>
      </app-card>
    </app-container>
  `,
  styleUrl: './example.component.scss'
})
export class ExampleComponent {}
```

```scss
// component.scss
@use '../../styles/mixins' as *;
@use '../../styles/breakpoints' as *;

.custom-element {
  @include flex-center;
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  
  @include respond-to('md') {
    padding: var(--spacing-xl);
  }
  
  &:hover {
    @include card-hover;
  }
}
```

---

## 💡 Dicas

1. **Sempre use variáveis CSS** ao invés de valores fixos
2. **Mobile-first**: Escreva estilos base para mobile e adicione breakpoints para telas maiores
3. **Reuse componentes**: Sempre verifique se já existe um componente antes de criar novo
4. **Use mixins**: Evite repetir código, use os mixins disponíveis
5. **Classes utilitárias**: Para ajustes rápidos, use as classes utilitárias
6. **Acessibilidade**: Sempre adicione ARIA labels e suporte a teclado

---

**📚 Documentação completa**: `FASE_1_COMPLETA.md`
