// --- Utilidad para usuarios en localStorage ---
const STORAGE_KEY = "senalandia_users";
const SESSION_KEY = "senalandia_session";

function getUsers() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function setSession(email) {
  localStorage.setItem(SESSION_KEY, email);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getSession() {
  return localStorage.getItem(SESSION_KEY);
}

// --- Referencias DOM ---
const authContainer = document.getElementById("auth-container");
const mainContainer = document.getElementById("main-container");

const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginError = document.getElementById("login-error");

const registerName = document.getElementById("register-name");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerError = document.getElementById("register-error");
const registerSuccess = document.getElementById("register-success");

const userInfo = document.getElementById("user-info");
const btnLogout = document.getElementById("btn-logout");

const navLinks = document.querySelectorAll(".nav-link");
const sections = {
  inicio: document.getElementById("section-inicio"),
  abecedario: document.getElementById("section-abecedario"),
  vocabulario: document.getElementById("section-vocabulario"),
  numeros: document.getElementById("section-numeros"),
  juegos: document.getElementById("section-juegos"),
  evaluacion: document.getElementById("section-evaluacion"),
};

// --- Cambio de pestañas (login / registro) ---
tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  loginForm.classList.add("visible");
  registerForm.classList.remove("visible");
  loginError.hidden = true;
});

tabRegister.addEventListener("click", () => {
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  registerForm.classList.add("visible");
  loginForm.classList.remove("visible");
  registerError.hidden = true;
  registerSuccess.hidden = true;
});

// --- Registro de usuario ---
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  registerError.hidden = true;
  registerSuccess.hidden = true;

  const name = registerName.value.trim();
  const email = registerEmail.value.trim().toLowerCase();
  const password = registerPassword.value.trim();

  if (!name || !email || !password) {
    registerError.textContent = "Por favor, completa todos los campos.";
    registerError.hidden = false;
    return;
  }

  if (password.length < 4) {
    registerError.textContent = "La contraseña debe tener mínimo 4 caracteres.";
    registerError.hidden = false;
    return;
  }

  const users = getUsers();
  const exists = users.some((u) => u.email === email);

  if (exists) {
    registerError.textContent = "Ya existe un usuario con este correo.";
    registerError.hidden = false;
    return;
  }

  users.push({ name, email, password });
  saveUsers(users);

  registerSuccess.textContent = "Usuario creado correctamente. Ahora puedes iniciar sesión.";
  registerSuccess.hidden = false;
  registerForm.reset();
});

// --- Login ---
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginError.hidden = true;

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value.trim();

  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    loginError.textContent = "Correo o contraseña incorrectos.";
    loginError.hidden = false;
    return;
  }

  setSession(user.email);
  showMainForUser(user);
});

// --- Mostrar contenido principal ---
function showMainForUser(user) {
  authContainer.hidden = true;
  mainContainer.hidden = false;
  userInfo.textContent = `Bienvenido, ${user.name}`;
  // Por defecto, sección Inicio
  showSection("inicio");
}

// --- Cerrar sesión ---
btnLogout.addEventListener("click", () => {
  clearSession();
  // Reinicia estado visual
  mainContainer.hidden = false;
  authContainer.hidden = false;

  // Oculta contenido principal
  mainContainer.hidden = true;
  authContainer.hidden = false;

  // Limpia formularios y mensajes
  loginForm.reset();
  registerForm.reset();
  loginError.hidden = true;
  registerError.hidden = true;
  registerSuccess.hidden = true;

  // Vuelve a la pestaña de Login
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  loginForm.classList.add("visible");
  registerForm.classList.remove("visible");
});

// --- Navegación entre secciones ---
function showSection(key) {
  Object.values(sections).forEach((sec) => sec.classList.remove("visible"));
  if (sections[key]) {
    sections[key].classList.add("visible");
  }

  navLinks.forEach((btn) => {
    if (btn.dataset.section === key) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

navLinks.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.section;
    showSection(key);
  });
});

// --- Recuperar sesión al recargar la página ---
window.addEventListener("DOMContentLoaded", () => {
  const email = getSession();
  if (!email) {
    // Sin sesión -> mostrar login
    authContainer.hidden = false;
    mainContainer.hidden = true;
    return;
  }

  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (user) {
    showMainForUser(user);
  } else {
    clearSession();
    authContainer.hidden = false;
    mainContainer.hidden = true;
  }

  // Inicializar juego
  initSignGame();
  // Inicializar evaluación
  initQuiz();
});

// --- Juego "Adivina la seña" ---
const words = [
  {
    word: "CASA",
    clue: "La seña muestra las manos formando el techo de una casa sobre la cabeza.",
    options: ["CASA", "ÁRBOL", "LIBRO"],
  },
  {
    word: "MAMÁ",
    clue: "La seña se realiza cerca de la boca, con la mano abierta, asociada a la persona que cuida.",
    options: ["MAMÁ", "PAPÁ", "AMIGO"],
  },
  {
    word: "ESCUELA",
    clue: "Las manos se juntan como si aplaudieran de forma suave, representando un lugar de estudio.",
    options: ["ESCUELA", "JUEGO", "PERRO"],
  },
  {
    word: "AMIGO",
    clue: "Las manos se entrelazan o se cruzan como símbolo de unión entre personas.",
    options: ["AMIGO", "COMIDA", "NIÑO"],
  },
  {
    word: "LIBRO",
    clue: "Las manos se abren y cierran como si se estuviera leyendo un objeto.",
    options: ["LIBRO", "CASA", "CARRO"],
  },
];

let currentRound = null;

function initSignGame() {
  const clueEl = document.getElementById("sign-clue");
  const optionsEl = document.getElementById("sign-options");
  const feedbackEl = document.getElementById("sign-feedback");
  const btnNewRound = document.getElementById("btn-new-round");

  function renderRound() {
    feedbackEl.textContent = "";
    optionsEl.innerHTML = "";

    currentRound = words[Math.floor(Math.random() * words.length)];

    clueEl.textContent = currentRound.clue;

    currentRound.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = "option-btn";
      btn.addEventListener("click", () => {
        if (opt === currentRound.word) {
          btn.classList.add("correct");
          feedbackEl.textContent = "¡Muy bien! Esa es la palabra correcta.";
        } else {
          btn.classList.add("incorrect");
          feedbackEl.textContent = "No es la palabra correcta. Intenta de nuevo.";
        }
      });
      optionsEl.appendChild(btn);
    });
  }

  btnNewRound.addEventListener("click", renderRound);
  renderRound();
}

// --- Evaluación ---
function initQuiz() {
  const quizForm = document.getElementById("quiz-form");
  const quizResult = document.getElementById("quiz-result");

  const correctAnswers = {
    q1: "b",
    q2: "a",
    q3: "b",
  };

  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let score = 0;
    let total = Object.keys(correctAnswers).length;

    Object.keys(correctAnswers).forEach((q) => {
      const selected = quizForm.querySelector(`input[name="${q}"]:checked`);
      if (selected && selected.value === correctAnswers[q]) {
        score++;
      }
    });

    quizResult.textContent = `Obtuviste ${score} de ${total} respuestas correctas. ${
      score === total
        ? "¡Excelente trabajo!"
        : score >= 2
        ? "¡Vas muy bien, sigue practicando!"
        : "Te invitamos a revisar nuevamente los recursos y volver a intentarlo."
    }`;
  });
}

// Inicialización si el DOM ya está listo antes del listener
if (document.readyState === "complete" || document.readyState === "interactive") {
  if (document.getElementById("sign-clue")) {
    initSignGame();
    initQuiz();
  }
}
