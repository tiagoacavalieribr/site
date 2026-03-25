/* ============================================================
   LEILA & TIAGO — main.js
   Funcionalidades: Countdown · Navegação · Scroll Reveal
                    Galeria Lightbox · Formulário RSVP
   ============================================================ */

/* ── 1. COUNTDOWN TIMER ── */
(function initCountdown() {
  // Data do casamento: 13 de Novembro de 2027 às 19h00
  const WEDDING = new Date('2027-11-13T19:00:00');

  const elDays    = document.getElementById('days');
  const elHours   = document.getElementById('hours');
  const elMinutes = document.getElementById('minutes');
  const elSeconds = document.getElementById('seconds');

  if (!elDays) return;

  function pad(n) {
    return String(Math.max(0, Math.floor(n))).padStart(2, '0');
  }

  function tick() {
    const now  = new Date();
    const diff = WEDDING - now;

    if (diff <= 0) {
      elDays.textContent    = '00';
      elHours.textContent   = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      // Trocar texto quando o dia chegar!
      const eyebrow = document.querySelector('.hero-eyebrow');
      if (eyebrow) eyebrow.textContent = '🎉 Hoje é o grande dia!';
      return;
    }

    const totalSeconds = diff / 1000;
    const days         = Math.floor(totalSeconds / 86400);
    const hours        = Math.floor((totalSeconds % 86400) / 3600);
    const minutes      = Math.floor((totalSeconds % 3600) / 60);
    const seconds      = Math.floor(totalSeconds % 60);

    elDays.textContent    = String(days);
    elHours.textContent   = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
})();


/* ── 2. NAVEGAÇÃO (scroll + hamburger mobile) ── */
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  // Adiciona classe "scrolled" ao rolar
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // executar ao carregar

  // Hamburger toggle
  hamburger && hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Marcar link ativo ao scrollar (Intersection Observer por seção)
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  if (sections.length && navItems.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));
  }
})();


/* ── 3. SCROLL REVEAL (Intersection Observer) ── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // anima só uma vez
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
})();


/* ── 4. GALERIA COM LIGHTBOX ── */
(function initGallery() {
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const btnClose     = document.getElementById('lightboxClose');
  const btnPrev      = document.getElementById('lightboxPrev');
  const btnNext      = document.getElementById('lightboxNext');
  const galleryGrid  = document.getElementById('galleryGrid');

  if (!lightbox || !galleryGrid) return;

  // Coletar apenas itens reais (não placeholder)
  let images = [];
  let current = 0;

  function buildImageList() {
    images = Array.from(
      galleryGrid.querySelectorAll('.gallery-item:not(.placeholder) img')
    );
  }

  function openLightbox(index) {
    buildImageList();
    if (!images.length) return;
    current = index;
    lightboxImg.src = images[current].src;
    lightboxImg.alt = images[current].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateNavButtons();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  function showPrev() {
    if (!images.length) return;
    current = (current - 1 + images.length) % images.length;
    lightboxImg.src = images[current].src;
    lightboxImg.alt = images[current].alt;
    updateNavButtons();
  }

  function showNext() {
    if (!images.length) return;
    current = (current + 1) % images.length;
    lightboxImg.src = images[current].src;
    lightboxImg.alt = images[current].alt;
    updateNavButtons();
  }

  function updateNavButtons() {
    if (btnPrev) btnPrev.style.display = images.length > 1 ? '' : 'none';
    if (btnNext) btnNext.style.display = images.length > 1 ? '' : 'none';
  }

  // Clique nas fotos da galeria
  galleryGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item:not(.placeholder)');
    if (!item) return;
    buildImageList();
    const img = item.querySelector('img');
    if (!img) return;
    const idx = images.indexOf(img);
    openLightbox(idx >= 0 ? idx : 0);
  });

  // Controles do lightbox
  btnClose && btnClose.addEventListener('click', closeLightbox);
  btnPrev  && btnPrev.addEventListener('click', showPrev);
  btnNext  && btnNext.addEventListener('click', showNext);

  // Fechar ao clicar fora da imagem
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  // Swipe touch (mobile)
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 50) {
      delta < 0 ? showNext() : showPrev();
    }
  }, { passive: true });
})();


/* ── 5. FORMULÁRIO RSVP ── */
(function initRSVP() {
  const form       = document.getElementById('rsvpForm');
  const btnSubmit  = document.getElementById('btnSubmit');
  const successDiv = document.getElementById('rsvpSuccess');
  const errorDiv   = document.getElementById('rsvpError');

  if (!form) return;

  // Validação simples
  function validateForm() {
    let valid = true;

    const fields = [
      { id: 'fname',       errId: 'err-fname',       msg: 'Por favor informe seu nome.' },
      { id: 'femail',      errId: 'err-femail',      msg: 'Por favor informe um e-mail válido.' },
      { id: 'fattendance', errId: 'err-fattendance', msg: 'Por favor selecione uma opção.' },
    ];

    fields.forEach(({ id, errId, msg }) => {
      const el  = document.getElementById(id);
      const err = document.getElementById(errId);
      if (!el || !err) return;

      const isEmpty = !el.value.trim();
      const isEmailInvalid = (id === 'femail') && !/^\S+@\S+\.\S+$/.test(el.value);

      if (isEmpty || isEmailInvalid) {
        el.classList.add('invalid');
        err.textContent = msg;
        valid = false;
      } else {
        el.classList.remove('invalid');
        err.textContent = '';
      }
    });

    return valid;
  }

  // Limpar erro ao digitar
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('invalid');
      const errId = `err-${el.id}`;
      const err = document.getElementById(errId);
      if (err) err.textContent = '';
    });
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // UI: loading
    const btnText    = btnSubmit.querySelector('.btn-text');
    const btnLoading = btnSubmit.querySelector('.btn-loading');
    btnSubmit.disabled = true;
    if (btnText)    btnText.style.display    = 'none';
    if (btnLoading) btnLoading.style.display = '';

    try {
      const data = new FormData(form);
      const json = {};
      data.forEach((value, key) => {
        if (!key.startsWith('_') && key !== '_honey') {
          json[key] = value;
        }
      });

      const action = form.getAttribute('action');

      // Se o e-mail ainda não foi configurado, só simular
      if (action.includes('SEU-EMAIL')) {
        // Modo demonstração — mostra sucesso sem enviar de verdade
        await new Promise(r => setTimeout(r, 1200)); // simular delay
        form.style.display = 'none';
        if (successDiv) successDiv.style.display = '';
        if (errorDiv)   errorDiv.style.display   = 'none';
        return;
      }

      const resp = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(json),
      });

      if (resp.ok) {
        form.style.display = 'none';
        if (successDiv) successDiv.style.display = '';
        if (errorDiv)   errorDiv.style.display   = 'none';
      } else {
        throw new Error('Resposta não-ok: ' + resp.status);
      }
    } catch (err) {
      console.error('RSVP error:', err);
      if (errorDiv) errorDiv.style.display = '';
      btnSubmit.disabled = false;
      if (btnText)    btnText.style.display    = '';
      if (btnLoading) btnLoading.style.display = 'none';
    }
  });
})();


/* ── 6. SCROLL SUAVE para âncoras (fallback para browsers antigos) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
