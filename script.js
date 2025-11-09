/* ===========================
   Theme (dark / light) toggle
   =========================== */
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('pj_theme');

function applyTheme(theme){
  if(theme === 'dark'){
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }
}

// Init theme
if(savedTheme){
  applyTheme(savedTheme);
} else {
  applyTheme(prefersDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('pj_theme', next);
});

/* ===========================
   Scroll animations (IntersectionObserver)
   =========================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ===========================
   Project modal (Ver más)
   =========================== */
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

const projectData = {
  'freno': {
    title: 'Todo Freno y Guayas — Sistema de ventas',
    body: `<p><strong>Descripción:</strong> Sistema web para gestión de ventas, inventarios y facturación entre dos sucursales. Incluye control de stock, manejo de facturas y sincronización en tiempo real.</p>
           <p><strong>Tecnologías:</strong> Node.js, Express, MySQL, JavaScript, HTML/CSS</p>
           <p><strong>Responsabilidades:</strong> Diseño de la base de datos, API REST, interfaces de ventas y reportes.</p>`
  },
  'inventario': {
    title: 'Inventario Automotriz',
    body: `<p><strong>Descripción:</strong> Aplicación para registrar, consultar y administrar inventarios de repuestos automotrices con importación desde CSV/Excel y reportes de stock mínimo.</p>
           <p><strong>Tecnologías:</strong> MySQL, JavaScript, HTML/CSS</p>`
  },
  'portaldeportivo': {
    title: 'Portal Web Deportivo',
    body: `<p><strong>Descripción:</strong> Portal personal sobre ciclismo para publicación de artículos y recursos. Proyecto personal para practicar front-end.</p>
           <p><strong>Tecnologías:</strong> HTML, CSS, JavaScript</p>`
  }
};

document.querySelectorAll('.view-more').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.project;
    const info = projectData[key];
    if(!info) return;
    modalBody.innerHTML = `<h3>${info.title}</h3>${info.body}<p style="margin-top:.8rem;"><a class="btn" href="#" onclick="return false;">Ver código / Demo (añadir enlace)</a></p>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

modalClose.addEventListener('click', () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
});

modal.addEventListener('click', (e) => {
  if(e.target === modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
});

/* ===========================
   Contact form (demo)
   =========================== */
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target.nombre.value.trim();
  alert(`¡Gracias ${name}! Tu mensaje ha sido recibido. (Demo: integrar backend para envío real)`);
  e.target.reset();
});
