# 💍 Site de Casamento — Leila & Tiago

Site estático de casamento para **13 de Novembro de 2027**.

---

## ✏️ O que personalizar (passo a passo)

### 1. Nossa História (`index.html` → seção `#historia`)
Edite os quatro blocos `.timeline-card` com a história real de vocês.
Troque datas, títulos e textos.

### 2. Local da cerimônia e recepção (`index.html` → seção `#cerimonia`)
Quando confirmar o local, atualize:
- Nome do local
- Endereço completo
- Horário
- Link do Google Maps (nos atributos `href` dos botões "Ver no mapa")

### 3. Adicionar fotos (`index.html` → seção `#galeria`)
1. Copie suas fotos para a pasta `images/`
2. No HTML, **remova** os blocos `.gallery-item.placeholder`
3. **Adicione** um bloco para cada foto:
```html
<div class="gallery-item reveal">
  <img src="images/nome-da-foto.jpg" alt="Descrição da foto" loading="lazy" />
</div>
```
4. Para uma foto de fundo no topo (hero), salve como `images/hero-bg.jpg` e no `css/style.css` substitua o comentário indicado.

### 4. Formulário de confirmação de presença (RSVP)
O formulário usa o serviço **FormSubmit** (gratuito, sem cadastro).

1. No `index.html`, encontre a linha:
   ```
   action="https://formsubmit.co/ajax/SEU-EMAIL@gmail.com"
   ```
2. Substitua `SEU-EMAIL@gmail.com` pelo seu e-mail real
3. Envie uma confirmação de presença de teste — você receberá um e-mail pedindo ativação
4. Confirme e pronto! Todas as confirmações chegam no seu e-mail

### 5. Lista de presentes (`index.html` → seção `#presentes`)
Substitua os `href="#"` com os links reais da sua lista e da vaquinha/PIX.

### 6. Frase do rodapé
Edite o `<p class="footer-quote">` com a citação/frase que quiserem.

---

## 🌐 Como hospedar (DNS incluído)

### Opção A — Netlify (Recomendado — mais fácil)

1. Crie conta gratuita em **netlify.com**
2. Arraste a pasta do projeto para o painel ("Drag & drop your site folder here")
3. Em **Domain settings → Add custom domain**, digite `leilaetiago.com.br`
4. O Netlify vai mostrar os valores de DNS que você precisa configurar

**Configurar DNS no seu registrador de domínio** (ex: Registro.br, GoDaddy, Locaweb):
```
Tipo: A       Nome: @       Valor: 75.2.60.5
Tipo: CNAME   Nome: www     Valor: <seu-site>.netlify.app
```
*(Os valores exatos aparecem no painel do Netlify)*

### Opção B — GitHub Pages (também gratuito)

1. Crie repositório público no GitHub com o nome `leilaetiago`
2. Faça push deste projeto para o repositório
3. Vá em **Settings → Pages → Source: main branch / root**
4. Em **Custom domain**, digite `www.leilaetiago.com.br`
5. No registrador do domínio, configure:
```
Tipo: CNAME   Nome: www     Valor: <seu-usuario>.github.io
```

### ⏱️ Propagação do DNS
Após configurar, pode levar de 15 minutos a 48 horas para o domínio funcionar em todo o mundo. É normal.

---

## 📁 Estrutura do projeto

```
site/
├── index.html          # Página principal
├── css/
│   └── style.css       # Todo o estilo
├── js/
│   └── main.js         # Countdown, galeria, formulário
├── images/             # Coloque suas fotos aqui
│   └── .gitkeep        # (arquivo vazio — mantém a pasta no git)
└── README.md           # Este arquivo
```

---

## 🐍 Para o Tiago (que gosta de Python)

Se quiser no futuro ter controle total do formulário RSVP (guardar em banco de dados, enviar e-mail customizado, etc.), você pode criar uma API simples em Python:

```python
# Exemplo com FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["https://www.leilaetiago.com.br"])

class RSVP(BaseModel):
    nome: str
    email: str
    presenca: str
    acompanhantes: str = "Apenas eu"
    mensagem: str = ""

@app.post("/rsvp")
def receber_rsvp(data: RSVP):
    # salvar no banco, enviar e-mail, etc.
    print(data)
    return {"ok": True}
```

Depois é só trocar o `action` do formulário para a URL da sua API.

---

Feito com ♥
