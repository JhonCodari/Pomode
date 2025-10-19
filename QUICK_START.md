# 🚀 Quick Start - Pomode

## Comandos Rápidos

### Desenvolvimento
```bash
cd pomode-app
npm start
```
→ Abre em `http://localhost:4200/`

### Build
```bash
cd pomode-app
npm run build:prod
```

### Deploy
```bash
cd pomode-app
npm run deploy
```

## Gerar Componentes

### Timer
```bash
ng generate component components/timer
```

### Controles
```bash
ng generate component components/controls
```

### Serviço
```bash
ng generate service services/pomodoro
```

### Página
```bash
ng generate component pages/home
```

## Estrutura de Arquivos

```
pomode-app/
├── src/app/
│   ├── components/     → Componentes reutilizáveis
│   ├── pages/          → Páginas/Views
│   ├── services/       → Serviços
│   └── models/         → Interfaces/Modelos
```

## Variáveis de Ambiente

Editar: `src/environments/environment.ts`

```typescript
defaultWorkTime: 25,        // minutos
defaultShortBreak: 5,       // minutos  
defaultLongBreak: 15,       // minutos
cyclesBeforeLongBreak: 4
```

## Servidor Rodando

✅ Status: Ativo em `http://localhost:4200/`

Para parar: `Ctrl + C` no terminal

---

📚 Documentação completa: `SETUP_COMPLETO.md`
