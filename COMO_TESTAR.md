# 🧪 Como Testar a Fase 1

## 🚀 Iniciando o Projeto

```bash
cd pomode-app
npm start
```

Acesse: `http://localhost:4200/`

---

## ✅ Checklist de Testes

### 1. **Tema Claro/Escuro**

- [ ] Clique no botão de tema no header
- [ ] Verifique a alternância suave entre temas
- [ ] Recarregue a página - tema deve persistir
- [ ] Verifique se todas as cores se adaptam corretamente

### 2. **Responsividade - Header**

#### Mobile (< 768px)
- [ ] Logo e subtítulo devem estar alinhados à esquerda
- [ ] Botão de tema à direita
- [ ] Padding reduzido
- [ ] Título menor

#### Tablet (768px - 991px)
- [ ] Logo e subtítulo em linha
- [ ] Espaçamento maior

#### Desktop (992px+)
- [ ] Layout completo e espaçoso

### 3. **Responsividade - Home**

#### Mobile
- [ ] Cards empilhados (1 coluna)
- [ ] Botões full-width
- [ ] Stats em coluna única
- [ ] Texto adaptado

#### Tablet
- [ ] Stats em grid de 3 colunas
- [ ] Botões lado a lado
- [ ] Espaçamentos maiores

#### Desktop
- [ ] Layout completo
- [ ] Todos os elementos visíveis
- [ ] Hover effects nos cards

### 4. **Componentes - Button**

- [ ] Hover: elevação e mudança de cor
- [ ] Active: pressionado
- [ ] Disabled: opaco e não clicável
- [ ] Primary: vermelho tomate
- [ ] Secondary: azul
- [ ] Success: verde
- [ ] Outline: borda colorida
- [ ] Ghost: sem background

### 5. **Componentes - Card**

- [ ] Sombra no card elevado
- [ ] Hover: elevação aumenta
- [ ] Header/Footer visíveis quando definidos
- [ ] Adapta ao tema

### 6. **Componentes - Container**

- [ ] Centralizado na página
- [ ] Padding lateral responsivo
- [ ] Max-width respeitado
- [ ] Diferentes tamanhos (sm, md, lg, xl)

### 7. **Animações**

- [ ] Fade-in ao carregar página
- [ ] Slide-up nas seções da home
- [ ] Botão de tema rotaciona ao clicar
- [ ] Cards têm transição suave ao hover

### 8. **Acessibilidade**

- [ ] Tab navigation funciona
- [ ] Focus ring visível
- [ ] ARIA labels nos botões
- [ ] Contraste de cores adequado

### 9. **Performance**

- [ ] Carregamento rápido
- [ ] Transições suaves
- [ ] Sem travamentos
- [ ] Scrolling fluido

---

## 🔍 Testes Específicos por Dispositivo

### Mobile (320px - 767px)

1. Abra o DevTools (F12)
2. Ative o modo responsivo (Ctrl+Shift+M)
3. Teste em:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - Samsung Galaxy S20 (412px)

**O que verificar:**
- [ ] Textos legíveis
- [ ] Botões clicáveis
- [ ] Nada cortado
- [ ] Scroll funciona

### Tablet (768px - 991px)

1. DevTools > Responsive
2. Teste em:
   - iPad Mini (768px)
   - iPad Air (820px)

**O que verificar:**
- [ ] Grid de 3 colunas nos stats
- [ ] Header otimizado
- [ ] Cards com bom espaçamento

### Desktop (992px+)

1. Tela normal ou maximizada
2. Teste em:
   - 1024px
   - 1280px
   - 1920px

**O que verificar:**
- [ ] Container centralizado
- [ ] Não muito largo
- [ ] Espaçamento confortável
- [ ] Hover effects

---

## 🎨 Teste de Temas

### Tema Claro

**Verificar:**
- [ ] Background: branco
- [ ] Texto: preto/cinza escuro
- [ ] Cards: branco com borda
- [ ] Botões: cores vibrantes

### Tema Escuro

**Verificar:**
- [ ] Background: preto/cinza muito escuro
- [ ] Texto: branco/cinza claro
- [ ] Cards: cinza escuro
- [ ] Botões: cores ajustadas
- [ ] Sombras mais pronunciadas

### Auto (Preferência do Sistema)

1. Mude a preferência do sistema
2. Verifique se o app se adapta automaticamente

---

## 🐛 Problemas Comuns e Soluções

### Tema não muda
- Limpe o localStorage
- Recarregue a página

### Layout quebrado
- Verifique o zoom do navegador (deve estar em 100%)
- Limpe o cache (Ctrl+F5)

### Componentes não aparecem
- Verifique o console (F12)
- Verifique se não há erros de importação

### Animações não funcionam
- Verifique se `prefers-reduced-motion` não está ativo
- Teste em outro navegador

---

## 📱 Navegadores para Testar

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (se disponível)
- [ ] Mobile Safari (iPhone)
- [ ] Chrome Mobile (Android)

---

## 🎯 Cenários de Teste

### Cenário 1: Novo Usuário
1. Limpe o localStorage
2. Acesse a página
3. Deve carregar com tema baseado na preferência do sistema
4. Alterne para tema oposto
5. Recarregue - tema escolhido deve persistir

### Cenário 2: Navegação Mobile
1. Abra no modo mobile (375px)
2. Verifique todo o layout
3. Alterne o tema
4. Scroll pela página
5. Clique nos botões

### Cenário 3: Redimensionamento
1. Comece em mobile (375px)
2. Aumente gradualmente até desktop (1920px)
3. Verifique se o layout se adapta suavemente
4. Sem quebras ou jumps

### Cenário 4: Dark Mode Automático
1. Configure o tema para 'auto'
2. Mude a preferência do sistema
3. Verifique se o app se adapta automaticamente

---

## ✅ Resultado Esperado

Ao final dos testes, você deve ter:

- [x] Tema alternando perfeitamente
- [x] Layout 100% responsivo
- [x] Todos os componentes funcionando
- [x] Animações suaves
- [x] Acessibilidade correta
- [x] Performance excelente
- [x] Sem erros no console

---

## 📸 Screenshots Recomendados

Tire screenshots de:

1. **Desktop - Tema Claro** (1920px)
2. **Desktop - Tema Escuro** (1920px)
3. **Tablet - Tema Claro** (768px)
4. **Mobile - Tema Escuro** (375px)
5. **Hover states** dos componentes
6. **DevTools** mostrando responsividade

---

## 🚨 Reportando Problemas

Se encontrar algum problema:

1. Anote o navegador e versão
2. Anote o tamanho da tela
3. Anote o tema ativo
4. Tire um screenshot
5. Verifique o console para erros

---

**Status**: Pronto para teste! 🎉
**Versão**: 0.1.0
**Última atualização**: 19 de outubro de 2025
