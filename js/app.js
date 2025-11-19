// Elementos de login
const loginBackdrop = document.getElementById("loginBackdrop");
const loginButton = document.getElementById("loginButton");
const correoInput = document.getElementById("loginCorreo");
const claveInput = document.getElementById("loginClave");
const correoError = document.getElementById("loginCorreoError");
const claveError = document.getElementById("loginClaveError");
const headerUser = document.getElementById("headerUser");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

// Validación simple de correo
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Manejo de login (solo front, sin backend)
loginButton.addEventListener("click", function () {
  const correo = correoInput.value.trim();
  const clave = claveInput.value.trim();

  let hasError = false;

  // Reset errores
  correoError.style.display = "none";
  claveError.style.display = "none";

  if (!isValidEmail(correo)) {
    correoError.style.display = "block";
    hasError = true;
  }

  if (!clave) {
    claveError.style.display = "block";
    hasError = true;
  }

  if (!hasError) {
    // Simula que inició sesión correctamente
    loginBackdrop.style.display = "none";
    headerUser.innerHTML =
      '<span class="name">' +
      correo +
      '</span><span class="role">Usuario autenticado</span>';
    btnCerrarSesion.style.display = "inline-flex";
  }
});

// Cerrar sesión básico
btnCerrarSesion.addEventListener("click", function () {
  loginBackdrop.style.display = "flex";
  headerUser.innerHTML =
    '<span class="name">Invitado</span><span class="role">No autenticado</span>';
  btnCerrarSesion.style.display = "none";
  correoInput.value = "";
  claveInput.value = "";
  correoError.style.display = "none";
  claveError.style.display = "none";
});

// Navegación entre secciones (sidebar)
const menuItems = document.querySelectorAll(".menu-item");
const sections = {
  dashboard: document.getElementById("section-dashboard"),
  afiliados: document.getElementById("section-afiliados"),
  directivos: document.getElementById("section-directivos"),
  documentos: document.getElementById("section-documentos"),
  reportes: document.getElementById("section-reportes"),
};

const sectionTitle = document.getElementById("sectionTitle");
const sectionDescription = document.getElementById("sectionDescription");

const sectionTexts = {
  dashboard: {
    title: "Panel general",
    description:
      "Visualiza el estado general de la Junta de Acción Comunal, afiliados y documentos registrados.",
  },
  afiliados: {
    title: "Afiliados",
    description:
      "Consulta y gestiona la información de los afiliados de la comunidad.",
  },
  directivos: {
    title: "Directivos",
    description:
      "Administra los cargos y datos de los directivos de la JAC.",
  },
  documentos: {
    title: "Documentos",
    description:
      "Organiza actas, reglamentos e informes cargados en Señalandia.",
  },
  reportes: {
    title: "Reportes",
    description:
      "Visualiza indicadores y estadísticas generales de la plataforma.",
  },
};

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.getAttribute("data-section");

    // Cambiar activo en el menú
    menuItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    // Mostrar/ocultar secciones
    Object.keys(sections).forEach((key) => {
      sections[key].style.display = key === target ? "block" : "none";
    });

    // Actualizar textos de encabezado
    sectionTitle.textContent = sectionTexts[target].title;
    sectionDescription.textContent = sectionTexts[target].description;
  });
});
