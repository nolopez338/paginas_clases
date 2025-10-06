// Navegación de secciones
const buttons = document.querySelectorAll('.nav-buttons button');
const sections = document.querySelectorAll('.section');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active'));
    btn.classList.add('active');
    const sectionId = btn.getAttribute('data-section');
    document.getElementById(sectionId).classList.add('active');
  });
});

// Datos centralizados de fichas técnicas
const fichasTecnicas = {
  'Amazonas': {
    nombre: 'Yuca',
    region: 'Amazonas',
    desc: 'La yuca es un cultivo básico en la región amazónica, resistente y de alto valor energético.',
    req: [
      '<strong>Clima:</strong> Cálido y húmedo',
      '<strong>Riego:</strong> Moderado',
      '<strong>Espacio:</strong> 1m entre plantas'
    ]
  },
  'Antioquia': {
    nombre: 'Café',
    region: 'Antioquia',
    desc: 'El café de Antioquia es reconocido mundialmente por su calidad y sabor.',
    req: [
      '<strong>Clima:</strong> Templado',
      '<strong>Riego:</strong> Regular, sin encharcar',
      '<strong>Espacio:</strong> 1.5m entre plantas'
    ]
  },
  'Arauca': {
    nombre: 'Arroz',
    region: 'Arauca',
    desc: 'El arroz es un cultivo fundamental en los llanos orientales, requiere suelos húmedos.',
    req: [
      '<strong>Clima:</strong> Cálido',
      '<strong>Riego:</strong> Abundante',
      '<strong>Espacio:</strong> 20cm entre plantas'
    ]
  },
  'Atlántico': {
    nombre: 'Algodón',
    region: 'Atlántico',
    desc: 'El algodón es tradicional en la región Caribe, usado en la industria textil.',
    req: [
      '<strong>Clima:</strong> Cálido y seco',
      '<strong>Riego:</strong> Bajo',
      '<strong>Espacio:</strong> 40cm entre plantas'
    ]
  },
  'Bolívar': {
    nombre: 'Caña de Azúcar',
    region: 'Bolívar',
    desc: 'La caña de azúcar es importante en Bolívar, base para panela y azúcar.',
    req: [
      '<strong>Clima:</strong> Cálido',
      '<strong>Riego:</strong> Moderado',
      '<strong>Espacio:</strong> 1m entre plantas'
    ]
  },
  'Boyacá': {
    nombre: 'Papa',
    region: 'Boyacá',
    desc: 'La papa es el cultivo insignia de Boyacá, ideal para climas fríos.',
    req: [
      '<strong>Clima:</strong> Frío',
      '<strong>Riego:</strong> Moderado',
      '<strong>Espacio:</strong> 30cm entre plantas'
    ]
  },
  'Caldas': {
    nombre: 'Plátano',
    region: 'Caldas',
    desc: 'El plátano es esencial en la dieta y economía de Caldas.',
    req: [
      '<strong>Clima:</strong> Templado-húmedo',
      '<strong>Riego:</strong> Regular',
      '<strong>Espacio:</strong> 2m entre plantas'
    ]
  },
  'Caquetá': {
    nombre: 'Cacao',
    region: 'Caquetá',
    desc: 'El cacao de Caquetá es apreciado por su aroma y sabor.',
    req: [
      '<strong>Clima:</strong> Húmedo',
      '<strong>Riego:</strong> Moderado',
      '<strong>Espacio:</strong> 3m entre plantas'
    ]
  },
  'Casanare': {
    nombre: 'Soya',
    region: 'Casanare',
    desc: 'La soya es un cultivo de alto valor en los llanos de Casanare.',
    req: [
      '<strong>Clima:</strong> Cálido',
      '<strong>Riego:</strong> Bajo',
      '<strong>Espacio:</strong> 40cm entre plantas'
    ]
  },
  'Cauca': {
    nombre: 'Maíz',
    region: 'Cauca',
    desc: 'El maíz es tradicional en Cauca, base de la alimentación local.',
    req: [
      '<strong>Clima:</strong> Templado',
      '<strong>Riego:</strong> Moderado',
      '<strong>Espacio:</strong> 30cm entre plantas'
    ]
  },
  'San Andrés y Providencia': {
    nombre: 'Coco',
    region: 'San Andrés y Providencia',
    desc: 'El coco es el cultivo más representativo de las islas.',
    req: [
      '<strong>Clima:</strong> Tropical',
      '<strong>Riego:</strong> Bajo',
      '<strong>Espacio:</strong> 5m entre plantas'
    ]
  }
};

// --- Mapa interactivo con imagen y áreas ---
const areas = document.querySelectorAll('area[data-region]');
const img = document.querySelector('img[usemap]');
const tooltip2 = document.getElementById('map-tooltip');
const modal2 = document.getElementById('map-modal');
const modalCultivo2 = document.getElementById('modal-cultivo');
const modalInfo2 = document.getElementById('modal-info');
const closeBtn2 = document.querySelector('.close-btn');

areas.forEach(area => {
  area.addEventListener('mousemove', function(e) {
    tooltip2.style.display = 'block';
    tooltip2.textContent = `${area.dataset.region}: ${area.dataset.cultivo}`;
    const imgRect = img.getBoundingClientRect();
    tooltip2.style.left = (e.clientX - imgRect.left + 12) + 'px';
    tooltip2.style.top = (e.clientY - imgRect.top - 10) + 'px';
  });
  area.addEventListener('mouseleave', function() {
    tooltip2.style.display = 'none';
  });
  area.addEventListener('click', function(e) {
    e.preventDefault();
    const region = area.dataset.region;
    const ficha = fichasTecnicas[region];
    if (ficha) {
      // Mostrar en el modal de ficha técnica
      cultivoNombre.textContent = ficha.nombre;
      cultivoDesc.textContent = ficha.desc;
      cultivoReq.innerHTML = ficha.req.map(r => `<li>${r}</li>`).join('');
      cultivoModal.style.display = 'flex';
    } else {
      // Fallback
      cultivoNombre.textContent = region;
      cultivoDesc.textContent = 'Sin información disponible.';
      cultivoReq.innerHTML = '';
      cultivoModal.style.display = 'flex';
    }
  });
});
closeBtn2.addEventListener('click', function() {
  modal2.style.display = 'none';
});
window.addEventListener('click', function(e) {
  if (e.target === modal2) {
    modal2.style.display = 'none';
  }
});

// Modal ficha técnica de cultivo
const cultivoModal = document.getElementById('cultivo-modal');
const closeCultivoBtn = document.querySelector('.close-cultivo-btn');
const cultivoNombre = document.getElementById('cultivo-nombre');
const cultivoDesc = document.getElementById('cultivo-desc');
const cultivoReq = document.getElementById('cultivo-req');

const fichaLechuga = {
  nombre: 'Lechuga',
  desc: 'La lechuga es una hortaliza de hoja verde, muy apreciada en ensaladas por su frescura y valor nutricional.',
  req: [
    '<strong>Clima:</strong> Templado, entre 15°C y 20°C',
    '<strong>Riego:</strong> Frecuente, sin encharcar',
    '<strong>Espacio:</strong> 20-30 cm entre plantas'
  ]
};
closeCultivoBtn.addEventListener('click', function() {
  cultivoModal.style.display = 'none';
});
window.addEventListener('click', function(e) {
  if (e.target === cultivoModal) {
    cultivoModal.style.display = 'none';
  }
});

// Test de Cultivos - funcionalidad básica
const cultivoForm = document.getElementById('cultivo-form');
const recomendacionesDiv = document.getElementById('recomendaciones');
const cultivosDemo = [
  { nombre: 'Lechuga', desc: 'Ideal para macetas y principiantes.' },
  { nombre: 'Tomate', desc: 'Requiere sol y espacio, fácil de cuidar.' },
  { nombre: 'Cilantro', desc: 'Crece rápido y se adapta a espacios pequeños.' }
];
cultivoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  recomendacionesDiv.innerHTML = '<h3>Recomendaciones:</h3>' +
    cultivosDemo.map(c => `
      <div class="cultivo-card">
        <h4>${c.nombre}</h4>
        <p>${c.desc}</p>
        <button class="add-dashboard-btn">Añadir a Mi Dashboard</button>
      </div>
    `).join('');
  recomendacionesDiv.style.display = 'block';
});
// Añadir cultivos a Mi Dashboard desde recomendaciones
recomendacionesDiv.addEventListener('click', function(e) {
  if (e.target.classList.contains('add-dashboard-btn')) {
    e.target.textContent = '¡Añadido!';
    e.target.disabled = true;
    // Añadir cultivo al dashboard del usuario autenticado
    const user = getSession();
    if (user) {
      const card = e.target.closest('.cultivo-card');
      const cultivoNombre = card ? card.querySelector('h4')?.textContent : null;
      if (cultivoNombre) {
        let data = getDashboardData(user);
        if (!data.includes(cultivoNombre)) {
          data.push(cultivoNombre);
          setDashboardData(user, data);
          // Si el dashboard está visible, actualizarlo
          if (dashboardContent && dashboardContent.style.display !== 'none') {
            renderDashboard(user);
          }
        }
      }
    }
  }
});

// --- IA: Subida y análisis de imagen ---
const iaForm = document.getElementById('ia-form');
const iaFile = document.getElementById('ia-file');
const iaPreviewContainer = document.getElementById('ia-preview-container');
const iaPreview = document.getElementById('ia-preview');
const iaAnalyzeBtn = document.getElementById('ia-analyze-btn');
const iaResultado = document.getElementById('ia-resultado');

if (iaForm && iaFile && iaPreview && iaAnalyzeBtn && iaResultado) {
  iaFile.addEventListener('change', function() {
    const file = iaFile.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        iaPreview.src = e.target.result;
        iaPreviewContainer.style.display = 'block';
        iaAnalyzeBtn.disabled = false;
        iaResultado.style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      iaPreviewContainer.style.display = 'none';
      iaAnalyzeBtn.disabled = true;
      iaResultado.style.display = 'none';
    }
  });
  iaForm.addEventListener('submit', function(e) {
    e.preventDefault();
    iaAnalyzeBtn.disabled = true;
    iaResultado.style.display = 'block';
    iaResultado.innerHTML = '<em>Analizando imagen con IA...</em>';
    setTimeout(() => {
      iaResultado.innerHTML = `
        <div class="cultivo-card" style="max-width:340px;margin:0 auto;">
          <h4>Planta detectada: Lechuga</h4>
          <p><strong>Estado:</strong> Saludable</p>
          <p><strong>Recomendación:</strong> Riego moderado y sombra parcial</p>
        </div>
      `;
      iaAnalyzeBtn.disabled = false;
    }, 2000);
  });
}

// Renderizar fichas técnicas en la sección correspondiente
const fichasLista = document.getElementById('fichas-lista');
function renderFichasTecnicas() {
  const user = getSession();
  fichasLista.innerHTML = Object.values(fichasTecnicas).map(ficha => {
    let addBtn = '';
    if (user) {
      // Verificar si ya está en el dashboard
      const data = getDashboardData(user);
      const yaAgregado = data.includes(ficha.nombre);
      addBtn = `<button class="add-dashboard-btn" data-cultivo="${ficha.nombre}" ${yaAgregado ? 'disabled' : ''}>${yaAgregado ? '¡Añadido!' : 'Añadir a Mi Dashboard'}</button>`;
    }
    return `
      <div class="cultivo-card" style="margin-bottom:18px;max-width:340px;">
        <h3>${ficha.nombre} <span style="font-size:0.8em;color:#888;">(${ficha.region})</span></h3>
        <p>${ficha.desc}</p>
        <h5>Requisitos básicos</h5>
        <ul>${ficha.req.map(r => `<li>${r}</li>`).join('')}</ul>
        ${addBtn}
      </div>
    `;
  }).join('');
}
if (fichasLista) {
  renderFichasTecnicas();
  fichasLista.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-dashboard-btn')) {
      const user = getSession();
      if (!user) return;
      const cultivo = e.target.getAttribute('data-cultivo');
      let data = getDashboardData(user);
      if (!data.includes(cultivo)) {
        data.push(cultivo);
        setDashboardData(user, data);
        e.target.textContent = '¡Añadido!';
        e.target.disabled = true;
        if (dashboardContent && dashboardContent.style.display !== 'none') {
          renderDashboard(user);
        }
      }
    }
  });
}
// Actualizar fichas técnicas al cambiar de sesión
function updateFichasOnSession() {
  if (fichasLista) renderFichasTecnicas();
}
// Llamar updateFichasOnSession en showDashboardUI, showLoginUI, showRegisterUI
const _showDashboardUI = showDashboardUI;
showDashboardUI = function(user) {
  _showDashboardUI(user);
  updateFichasOnSession();
};
const _showLoginUI = showLoginUI;
showLoginUI = function() {
  _showLoginUI();
  updateFichasOnSession();
};
const _showRegisterUI = showRegisterUI;
showRegisterUI = function() {
  _showRegisterUI();
  updateFichasOnSession();
};

// --- Autenticación y Dashboard de usuario ---
const dashboardLogin = document.getElementById('dashboard-login');
const dashboardRegister = document.getElementById('dashboard-register');
dashboardRegister.style.display = 'none';
const dashboardContent = document.getElementById('dashboard-content');
const dashboardUsername = document.getElementById('dashboard-username');
const dashboardData = document.getElementById('dashboard-data');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');

function getUsers() {
  return JSON.parse(localStorage.getItem('usuarios') || '{}');
}
function setUsers(users) {
  localStorage.setItem('usuarios', JSON.stringify(users));
}
function setSession(user) {
  localStorage.setItem('sesion', user);
}
function getSession() {
  return localStorage.getItem('sesion');
}
function clearSession() {
  localStorage.removeItem('sesion');
}
function getDashboardData(user) {
  return JSON.parse(localStorage.getItem('dashboard_' + user) || '[]');
}
function setDashboardData(user, data) {
  localStorage.setItem('dashboard_' + user, JSON.stringify(data));
}

function showLoginUI() {
  dashboardLogin.style.display = '';
  dashboardRegister.style.display = 'none';
  dashboardContent.style.display = 'none';
  loginError.style.display = 'none';
  registerError.style.display = 'none';
}
function showRegisterUI() {
  dashboardLogin.style.display = 'none';
  dashboardRegister.style.display = '';
  dashboardContent.style.display = 'none';
  loginError.style.display = 'none';
  registerError.style.display = 'none';
}
function showDashboardUI(user) {
  dashboardLogin.style.display = 'none';
  dashboardRegister.style.display = 'none';
  dashboardContent.style.display = '';
  dashboardUsername.textContent = user;
  renderDashboard(user);
}
function renderDashboard(user) {
  const data = getDashboardData(user);
  if (data.length === 0) {
    dashboardData.innerHTML = '<em>No tienes cultivos añadidos aún.</em>';
  } else {
    dashboardData.innerHTML = '<h4>Mis cultivos:</h4>' +
      data.map(c => `<div class="cultivo-card" style="margin-bottom:10px;">${c}</div>`).join('');
  }
}

// Cambiar entre login y registro
if (showRegister) showRegister.onclick = e => { e.preventDefault(); showRegisterUI(); };
if (showLogin) showLogin.onclick = e => { e.preventDefault(); showLoginUI(); };

// Registro
if (registerForm) registerForm.onsubmit = function(e) {
  e.preventDefault();
  const user = document.getElementById('register-user').value.trim();
  const pass = document.getElementById('register-pass').value;
  if (!user || !pass) return;
  let users = getUsers();
  if (users[user]) {
    registerError.textContent = 'El usuario ya existe.';
    registerError.style.display = 'block';
    return;
  }
  users[user] = btoa(pass); // Simple hash (no seguro, solo demo)
  setUsers(users);
  setSession(user);
  setDashboardData(user, []);
  showDashboardUI(user);
};
// Login
if (loginForm) loginForm.onsubmit = function(e) {
  e.preventDefault();
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value;
  let users = getUsers();
  if (!users[user] || users[user] !== btoa(pass)) {
    loginError.textContent = 'Usuario o contraseña incorrectos.';
    loginError.style.display = 'block';
    return;
  }
  setSession(user);
  showDashboardUI(user);
};
// Logout
if (logoutBtn) logoutBtn.onclick = function() {
  clearSession();
  showLoginUI();
};
// Al cargar, mostrar la UI correcta
(function() {
  const user = getSession();
  if (user && getUsers()[user]) {
    showDashboardUI(user);
  } else {
    showLoginUI();
  }
})(); 