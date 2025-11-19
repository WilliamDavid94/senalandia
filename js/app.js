// ====== ELEMENTOS ======
const app = document.getElementById('app');
const loginBackdrop = document.getElementById('loginBackdrop');
const loginButton = document.getElementById('loginButton');
const loginButtonText = document.getElementById('loginButtonText');
const correoInput = document.getElementById('loginCorreo');
const claveInput = document.getElementById('loginClave');
const clave2Field = document.getElementById('loginClave2Field');
const clave2Input = document.getElementById('loginClave2');
const correoError = document.getElementById('loginCorreoError');
const claveError = document.getElementById('loginClaveError');
const clave2Error = document.getElementById('loginClave2Error');
const loginToggleText = document.getElementById('loginToggleText');
const headerUser = document.getElementById('headerUser');

// secciones
const menuItems = document.querySelectorAll('.menu-item');
const tiles = document.querySelectorAll('.tile');
const sections = {
  home: document.getElementById('section-home'),
  abecedario: document.getElementById('section-abecedario'),
  vocabulario: document.getElementById('section-vocabulario'),
  numeros: document.getElementById('section-numeros'),
  juegos: document.getElementById('section-juegos'),
  evaluacion: document.getElementById('section-evaluacion'),
};

// ====== OCULTAR APP Y MOSTRAR LOGIN AL CARGAR ======
window.addEventListener('load', () => {
  app.style.display = 'none';
  loginBackdrop.style.display = 'flex';
  app.setAttribute('aria-hidden', 'true');
});

// ====== UTIL ======
function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('senalandia_users') || '[]');
  } catch {
    return [];
  }
}
function saveUsers(u) {
  localStorage.setItem('senalandia_users', JSON.stringify(u));
}
function findUser(email) {
  return getUsers().find(
    (x) => x.email.toLowerCase() === email.toLowerCase()
  );
}

// MODO register?
let isRegisterMode = false;

// ====== CAMBIAR ENTRE LOGIN / REGISTRO ======
function attachToggleListener() {
  const toggle = document.getElementById('toggleToRegister');
  if (!toggle) return;
  toggle.onclick = () => {
    setMode(!isRegisterMode);
  };
}

function setMode(register) {
  isRegisterMode = register;

  // limpiar errores
  correoError.style.display = 'none';
  claveError.style.display = 'none';
  clave2Error.style.display = 'none';

  if (register) {
    loginButtonText.textContent = 'Crear usuario';
    loginToggleText.innerHTML =
      '¿Ya tienes cuenta? <strong id="toggleToRegister">Iniciar sesión</strong>';
    clave2Field.style.display = 'block';
  } else {
    loginButtonText.textContent = 'Ingresar';
    loginToggleText.innerHTML =
      '¿No tienes cuenta? <strong id="toggleToRegister">Crear usuario</strong>';
    clave2Field.style.display = 'none';
  }

  // volver a enganchar el listener al nuevo <strong>
  attachToggleListener();
}

// inicializar en modo login
setMode(false);

// ====== LOGIN / REGISTRO ======
loginButton.addEventListener('click', () => {
  const correo = correoInput.value.trim();
  const clave = claveInput.value.trim();
  const clave2 = clave2Input ? clave2Input.value.trim() : '';

  correoError.style.display = 'none';
  claveError.style.display = 'none';
  clave2Error.style.display = 'none';

  let hasError = false;

  // Validación básica
  if (!isValidEmail(correo)) {
    correoError.style.display = 'block';
    correoError.textContent = 'Correo inválido';
    hasError = true;
  }
  if (!clave) {
    claveError.style.display = 'block';
    claveError.textContent = 'Clave obligatoria';
    hasError = true;
  }

  if (isRegisterMode) {
    // MODO CREAR USUARIO
    if (!clave2) {
      clave2Error.style.display = 'block';
      clave2Error.textContent = 'Confirma la clave';
      hasError = true;
    } else if (clave !== clave2) {
      clave2Error.style.display = 'block';
      clave2Error.textContent = 'Las claves no coinciden';
      hasError = true;
    }

    if (findUser(correo)) {
      correoError.style.display = 'block';
      correoError.textContent = 'Ya existe un usuario con este correo';
      hasError = true;
    }

    if (!hasError) {
      const users = getUsers();
      users.push({ email: correo, password: clave, role: 'student' });
      saveUsers(users);
      alert('Usuario creado correctamente. Ahora inicia sesión.');
      // cambiar automáticamente a modo login
      setMode(false);
      // limpiar claves
      claveInput.value = '';
      if (clave2Input) clave2Input.value = '';
    }
  } else {
    // MODO INICIAR SESIÓN
    const user = findUser(correo);
    if (!user || user.password !== clave) {
      claveError.style.display = 'block';
      claveError.textContent = 'Correo o clave incorrectos';
      hasError = true;
    }

    if (!hasError) {
      // LOGIN CORRECTO → mostrar app
      loginBackdrop.style.display = 'none';
      app.style.display = 'flex';
      app.setAttribute('aria-hidden', 'false');
      headerUser.innerHTML = `
        <span class="name">${correo}</span>
        <span class="role">Usuario</span>
      `;
      // Inicio por defecto
      showSection('home');
      document
        .querySelectorAll('.menu-item')
        .forEach((i) => i.classList.remove('active'));
      const homeItem = document.querySelector('.menu-item[data-section="home"]');
      if (homeItem) homeItem.classList.add('active');
    }
  }
});

// ====== NAVEGACIÓN ENTRE MÓDULOS ======
function showSection(name) {
  Object.keys(sections).forEach((k) => {
    sections[k].hidden = k !== name;
  });
}

menuItems.forEach((mi) =>
  mi.addEventListener('click', () => {
    menuItems.forEach((i) => i.classList.remove('active'));
    mi.classList.add('active');
    const target = mi.getAttribute('data-section');
    showSection(target);
  })
);

tiles.forEach((t) =>
  t.addEventListener('click', () => {
    const s = t.getAttribute('data-section');
    const menu = document.querySelector(`.menu-item[data-section="${s}"]`);
    if (menu) menu.click();
  })
);

// ====== DEMO JUEGOS / EVALUACIÓN ======
const memoryBtn = document.getElementById('startMemory');
const memoryResult = document.getElementById('memoryResult');
if (memoryBtn && memoryResult) {
  memoryBtn.addEventListener('click', () => {
    memoryResult.textContent =
      'Demo: aquí irá el juego de memoria (asociar seña con imagen).';
  });
}

const quizBtn = document.getElementById('startQuiz');
const quizResult = document.getElementById('quizResult');
if (quizBtn && quizResult) {
  quizBtn.addEventListener('click', () => {
    quizResult.innerHTML =
      '<p>Demo: sistema de preguntas y puntaje para el niño.</p>';
  });
}
