---
name: wedding-site
description: Manutenção e evolução do site de casamento Leila & Tiago (13/11/2027). Use quando o usuário quiser editar, adicionar fotos, atualizar informações (local, história, presentes, RSVP), ajustar o design, ou hospedar/configurar DNS do site em www.leilaetiago.com.br. Site estático em HTML/CSS/JS puro, sem build step.
---

# Site de Casamento — Leila & Tiago

Skill para retomar o trabalho no site de casamento. O site é **estático** (HTML + CSS + JS puro, sem framework, sem build). Basta abrir o `index.html` no navegador para ver tudo funcionando.

## Contexto do projeto

- **Noivos:** Leila & Tiago
- **Data:** 13 de Novembro de 2027, 19h00
- **Local:** Chácara Dona Anna — R. Paulo Eusébio da Silva, 324, Marília-SP
- **Domínio:** www.leilaetiago.com.br
- **Branch de desenvolvimento:** `claude/wedding-website-setup-3FX9Y`
- **Perfil do dono:** programa muito bem em Python e SQL, mas tem pouca familiaridade com web. Explique conceitos web de forma simples e direta; pode usar analogias com Python.

## Estrutura de arquivos

```
site/
├── index.html          # Página única com todas as seções
├── css/style.css       # Todo o estilo (variáveis CSS no topo, em :root)
├── js/main.js          # 6 módulos IIFE numerados (countdown, nav, reveal, galeria, rsvp, scroll)
├── images/             # Fotos do casal (vazio por enquanto, só .gitkeep)
└── README.md           # Instruções de personalização e hospedagem
```

### Seções do `index.html` (na ordem)
1. **Navbar** (`#navbar`) — fixa, fica opaca ao rolar, vira hambúrguer no mobile
2. **Hero** (`#hero`) — nomes, data e **countdown** ao vivo
3. **Nossa História** (`#historia`) — timeline com 4 cards (`.timeline-card`)
4. **A Celebração** (`#cerimonia`) — cards de cerimônia e recepção com link de mapa
5. **Galeria** (`#galeria`) — grid de fotos com lightbox
6. **Lista de Presentes** (`#presentes`) — cards de lista e fundo de lua de mel
7. **RSVP** (`#rsvp`) — formulário de confirmação com validação
8. **Footer** (`#footer`) — nomes, data e citação

### Paleta de cores (variáveis em `css/style.css` → `:root`)
`--cream`, `--rose`, `--rose-deep`, `--rose-dark`, `--gold`. Mude lá no topo para reestilizar o site inteiro de uma vez.

## Tarefas comuns

### Adicionar fotos à galeria
1. Copiar arquivos para `images/`
2. Em `index.html`, na `div.gallery-grid` (id `galleryGrid`): remover os `.gallery-item.placeholder` e adicionar para cada foto:
```html
<div class="gallery-item reveal">
  <img src="images/NOME.jpg" alt="DESCRIÇÃO" loading="lazy" />
</div>
```
O lightbox (zoom, setas, swipe, teclado) já funciona automaticamente — `js/main.js` módulo 4 detecta os `<img>` reais (ignora placeholders).

### Foto de fundo no Hero
Em `css/style.css`, no seletor `#hero`, trocar o `background:` gradiente pelo comentário já presente que usa `images/hero-bg.jpg` com overlay escuro.

### Editar a história do casal
Os 4 blocos `.timeline-card` na seção `#historia` (anos 2020/2021/2025/2027). Editar `.tl-year`, `<h3>` e `<p>`.

### Atualizar local / horário
Seção `#cerimonia`, classes `.ceremony-place`, `.ceremony-address`, `.ceremony-datetime`. Os botões "Ver no mapa" usam link do Google Maps (`https://maps.google.com/?q=...`).

### Configurar o formulário RSVP (importante!)
O form usa **FormSubmit** (serviço grátis, sem cadastro). Em `index.html`, na tag `<form id="rsvpForm">`, o atributo `action` contém `SEU-EMAIL@gmail.com` — **trocar pelo e-mail real** (sugestão: tiagoacavalieri@gmail.com). Enquanto contiver "SEU-EMAIL", o `js/main.js` (módulo 5) roda em **modo demonstração**: mostra sucesso mas NÃO envia de verdade. Após colocar o e-mail real, a primeira submissão dispara um e-mail de ativação do FormSubmit.

Alternativa em Python (caso queira backend próprio): há um exemplo FastAPI no `README.md`. Basta trocar o `action` do form pela URL da API.

### Lista de presentes
Seção `#presentes`, trocar os `href="#"` pelos links reais (lista de loja, vaquinha, PIX).

### Mudar a data do casamento (se necessário)
Em `js/main.js`, constante `WEDDING` no módulo 1 (countdown), formato ISO `'2027-11-13T19:00:00'`. Atualizar também os textos de data no HTML.

## Hospedagem e DNS

Site estático → hospedar grátis no **Netlify** (recomendado) ou GitHub Pages.

**Netlify (mais fácil):**
1. Conta em netlify.com → arrastar a pasta do projeto
2. Domain settings → Add custom domain → `leilaetiago.com.br` e `www.leilaetiago.com.br`
3. No **Registro.br**, configurar DNS:

| Tipo | Nome | Valor |
|---|---|---|
| A | @ | 75.2.60.5 |
| A | @ | 99.83.190.102 |
| CNAME | www | `<nome-gerado>.netlify.app` |

4. No Netlify: "Verify DNS configuration" → ativa HTTPS grátis
5. Propagação: 15 min a 48h (normal)

## Convenções e cuidados

- **Sem build step.** Não introduzir bundlers, npm, frameworks. Manter HTML/CSS/JS puro — é o que o dono consegue manter.
- **Comentários `✏️`** no código marcam pontos editáveis pelo usuário. Preservá-los ao editar.
- **`js/main.js`** está dividido em 6 IIFEs numeradas e comentadas. Cada uma é independente e checa se seus elementos existem antes de rodar.
- **Mobile-first / responsivo** — breakpoints em 768px e 480px no fim do CSS. Testar sempre os dois.
- **Git:** desenvolver no branch `claude/wedding-website-setup-3FX9Y`. Commitar com mensagens descritivas. Não criar PR até existir branch `main` (o repo ainda não tem). Só push quando o usuário pedir mudanças concretas.
- **Acentuação:** todo o conteúdo é em português — manter charset UTF-8 e acentos corretos.
