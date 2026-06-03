---
name: wedding-site
description: Manutenção e evolução do site de casamento Leila & Tiago (13/11/2027). Use quando o usuário quiser editar conteúdo, adicionar fotos, ajustar design, configurar RSVP, lista de presentes ou hospedagem/DNS do site www.leilaetiago.com.br.
---

# Site de Casamento — Leila & Tiago

## Contexto geral

- **Noivos:** Leila & Tiago (Tiago é o dono — programa bem em Python/SQL, pouca familiaridade com web)
- **Data:** 13 de Novembro de 2027, 19h00
- **Local:** Chácara Dona Anna — R. Paulo Eusébio da Silva, 324, Marília-SP
- **Domínio:** www.leilaetiago.com.br
- **Repositório:** `tiagoacavalieribr/site` (GitHub)
- **Branch de desenvolvimento:** `claude/wedding-website-setup-3FX9Y` (não existe `main` ainda — não criar PR por enquanto)
- **Diretório local:** clonar o repositório e trabalhar na raiz (ex: `~/site`)

## Estrutura do projeto

Site **estático puro** — HTML + CSS + JS, zero dependências, zero build step. Abrir `index.html` no navegador já funciona.

```
site/
├── index.html          ← página única com todas as seções
├── css/style.css       ← todo o estilo; variáveis de cor em :root no topo
├── js/main.js          ← 6 módulos IIFE numerados e comentados
├── images/             ← colocar fotos aqui (está vazio, só .gitkeep)
├── README.md           ← instruções de personalização e hospedagem
└── .claude/skills/     ← skill de projeto (versão vinculada ao repo)
```

### Seções do `index.html` (ordem do documento)

| ID | Seção | O que tem |
|---|---|---|
| `#navbar` | Navegação | Fixa, fica opaca ao rolar, hambúrguer no mobile |
| `#hero` | Topo | Nomes, data, **countdown ao vivo** (atualiza a cada 1s) |
| `#historia` | Nossa História | Timeline com 4 cards editáveis |
| `#cerimonia` | A Celebração | Cards de cerimônia e recepção com link Google Maps |
| `#galeria` | Galeria | Grid de fotos com lightbox (teclado + swipe) |
| `#presentes` | Lista de Presentes | Cards de lista de loja e fundo de lua de mel |
| `#rsvp` | RSVP | Formulário de confirmação com validação JS |
| `#footer` | Rodapé | Nomes, data, citação bíblica |

### `js/main.js` — os 6 módulos

1. **Countdown** — `const WEDDING = new Date('2027-11-13T19:00:00')`, atualiza a cada segundo
2. **Navegação** — scroll + hambúrguer mobile + link ativo via IntersectionObserver
3. **Scroll Reveal** — `.reveal` vira `.visible` ao entrar na viewport (IntersectionObserver)
4. **Galeria Lightbox** — detecta `img` dentro de `.gallery-item:not(.placeholder)`; setas, teclado (←→ Esc), swipe touch
5. **RSVP** — validação de campos, fetch para FormSubmit; enquanto `action` contiver `"SEU-EMAIL"` roda em modo demo (mostra sucesso sem enviar)
6. **Scroll suave** — fallback para navegadores antigos, desconta a altura da navbar

## Tarefas comuns — passo a passo

### Adicionar fotos à galeria

1. Copiar arquivos de imagem para `images/`
2. Em `index.html`, dentro de `<div class="gallery-grid" id="galleryGrid">`:
   - Remover os blocos `<div class="gallery-item placeholder ...">` (os emojis 📷)
   - Adicionar um bloco por foto:
   ```html
   <div class="gallery-item reveal">
     <img src="images/NOME-DO-ARQUIVO.jpg" alt="Breve descrição" loading="lazy" />
   </div>
   ```
3. O lightbox já funciona automaticamente — nenhuma alteração no JS necessária.

### Foto de fundo no Hero

Em `css/style.css`, seletor `#hero`, trocar o `background:` gradiente por:
```css
background-image: linear-gradient(rgba(44,24,16,0.55), rgba(92,36,53,0.55)),
                  url('../images/hero-bg.jpg');
background-size: cover;
background-position: center;
```
Salvar a foto como `images/hero-bg.jpg`. Foto horizontal (paisagem), mínimo 1920×1080px.

### Editar a história do casal

Seção `#historia` → 4 blocos `.timeline-card`. Campos a editar: `.tl-year`, `<h3>`, `<p>`.

### Atualizar local / horário / link do mapa

Seção `#cerimonia` → classes `.ceremony-place`, `.ceremony-address`, `.ceremony-datetime`.  
Botões "Ver no mapa": atributo `href` no formato `https://maps.google.com/?q=ENDEREÇO`.  
Dados atuais: Chácara Dona Anna, R. Paulo Eusébio da Silva 324, Marília-SP, 19h00 (cerimônia) e 21h00 (recepção).

### Ativar o formulário RSVP (importante — ainda não configurado!)

1. Em `index.html`, encontrar a tag `<form id="rsvpForm" action="https://formsubmit.co/ajax/SEU-EMAIL@gmail.com" ...>`
2. Substituir `SEU-EMAIL@gmail.com` pelo e-mail real do Tiago
3. Fazer upload/deploy do site
4. Enviar uma confirmação de teste — chega um e-mail de ativação do FormSubmit
5. Confirmar e pronto — todas as confirmações chegam no e-mail

**Alternativa Python** (se quiser backend próprio): há um exemplo FastAPI no `README.md` do projeto. Trocar o `action` do form pela URL da API.

### Lista de presentes

Seção `#presentes` → dois `.gift-card`. Trocar `href="#"` pelos links reais (lista de loja, vaquinha ou PIX).

### Mudar cores do site

`css/style.css` → `:root` no topo. Variáveis principais: `--rose-deep`, `--rose-dark`, `--gold`. Mudar lá reestiliza o site inteiro.

## Hospedagem e DNS

**Netlify (recomendado — gratuito e mais simples):**

1. Conta em netlify.com → arrastar pasta do projeto para o painel
2. Domain settings → Add custom domain → `leilaetiago.com.br` e `www.leilaetiago.com.br`
3. Netlify mostra o subdomínio gerado (ex: `happy-flower-123.netlify.app`)
4. No **Registro.br**, configurar:

| Tipo | Nome | Valor |
|---|---|---|
| `A` | `@` | `75.2.60.5` |
| `A` | `@` | `99.83.190.102` |
| `CNAME` | `www` | `happy-flower-123.netlify.app` |

5. Netlify → "Verify DNS configuration" → HTTPS ativado automaticamente
6. Propagação: 15 min a 48h (normal)

## Convenções — respeitar sempre

- **Zero build step.** Não introduzir npm, bundlers, frameworks. Manter HTML/CSS/JS puro.
- **Comentários `✏️`** no HTML marcam pontos editáveis pelo usuário — preservar ao editar.
- **Português** em todo o conteúdo. Manter `charset="UTF-8"` e acentos corretos.
- **Mobile-first** — breakpoints em 768px e 480px no fim do CSS. Testar sempre os dois.
- **Git:** commitar no branch `claude/wedding-website-setup-3FX9Y`. Não criar PR sem `main`.
- **Tom:** o Tiago conhece Python/SQL muito bem. Ao explicar conceitos web, usar analogias com Python quando útil e evitar jargão desnecessário.
