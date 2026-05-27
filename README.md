# 🍅 Pomode

https://www.pomode.com.br

Aplicativo web de Pomodoro minimalista, moderno e responsivo, desenvolvido com Angular.

**Versão atual:** 1.0.1

## 📋 Sobre o Projeto

Pomode é um timer Pomodoro criado para ajudar você a aumentar sua produtividade através da técnica Pomodoro. Com design minimalista, suporte a temas claro/escuro e interface responsiva, o aplicativo oferece uma experiência focada e sem distrações.

### 🎯 Objetivo

Criar um aplicativo web de Pomodoro real, utilizável e escalável, com Angular no front-end, que serve como:

- Portfólio técnico profissional
- Base para futuras versões monetizáveis (ex: premium features, integração com Google Tasks, etc.)
- Aplicação prática e funcional para uso diário

### ⚙️ Stack Tecnológica

- **Front-end**: Angular 19.2+ com TypeScript
- **Estilização**: SCSS com design tokens e CSS custom properties para temas
- **i18n**: ngx-translate com suporte a Português, Inglês e Espanhol
- **Hospedagem**: GitHub Pages
- **CI/CD**: GitHub Actions (build, deploy e versionamento automático)
- **Controle de versão**: Git + GitHub

### 🎨 Design

- Minimalista, moderno e responsivo (desktop e mobile)
- Paleta suave com foco em concentração e produtividade
- Suporte a tema claro e escuro
- Psicologia das cores aplicada

## ✅ Funcionalidades Implementadas

- ⏱️ Timer Pomodoro com iniciar, pausar e reiniciar
- 🔄 Ciclos automáticos: foco → pausa curta → pausa longa
- ⚙️ Configurações personalizáveis (duração dos ciclos, número de ciclos)
- 🌙 Alternância de tema claro/escuro
- 🌐 Suporte a múltiplos idiomas (PT, EN, ES)
- 🔔 Alertas sonoros ao fim dos ciclos
- 🎵 Player de música ambiente integrado com controle de volume
- 📊 Sidebar de estatísticas da sessão
- 📱 Layout responsivo com menu mobile
- 🧩 Página informativa sobre a técnica Pomodoro

## 🚀 Como Executar

### Pré-requisitos

- Node.js 22+ instalado
- npm 10+ instalado
- Angular CLI 19+ instalado

### Instalação

```bash
# Clone o repositório
git clone https://github.com/JhonCodari/Pomode.git

# Entre na pasta do projeto
cd Pomode/pomode-app

# Instale as dependências
npm install

# Execute o projeto
npm start
```

Acesse `http://localhost:4200/` no navegador.

## 📦 Build e Deploy

### Build de Produção

```bash
npm run build:prod
```

O script `prebuild` é executado automaticamente antes de qualquer build, sincronizando a versão do `package.json` nos arquivos de ambiente e nas traduções.

### Deploy no GitHub Pages

O deploy de produção é feito automaticamente via GitHub Actions a cada push na branch `main`.

Também é possível disparar manualmente a mesma esteira no GitHub pela opção `workflow_dispatch` do workflow `Deploy to GitHub Pages`.

Para gerar apenas o build local de validação (sem publicar):

```bash
npm run deploy:preview
```

O comando `npm run deploy` local foi bloqueado para evitar publicação acidental fora da esteira oficial.

## 🤖 CI/CD

| Workflow | Gatilho | Ação |
|---|---|---|
| Deploy to GitHub Pages | Push em `main` | Build + deploy automático |
| Tag Release | Push em `main` | Cria tag Git `vX.Y.Z` a partir do `package.json` |

## 📂 Estrutura do Projeto

```
Pomode/
├── .github/
│   └── workflows/       # Pipelines de CI/CD
├── pomode-app/          # Aplicação Angular
│   ├── scripts/         # Scripts de build (versionamento)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Componentes reutilizáveis
│   │   │   ├── pages/       # Páginas da aplicação
│   │   │   ├── services/    # Lógica de negócio e estado
│   │   │   ├── models/      # Interfaces e tipos
│   │   │   └── workers/     # Web Workers (timer)
│   │   ├── assets/
│   │   │   └── i18n/        # Arquivos de tradução (PT, EN, ES)
│   │   ├── environments/    # Configurações de ambiente
│   │   └── styles/          # Design tokens e mixins globais
│   └── ...
├── docs/                # Documentação adicional
└── README.md
```


## 📝 Licença

Este projeto está sob licença privada. Todos os direitos reservados.

## 👤 Autor

**Jhon Codari**
- GitHub: [@JhonCodari](https://github.com/JhonCodari)

---

Desenvolvido com ❤️ e ☕ para aumentar a produtividade
