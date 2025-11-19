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

// ====== UTIL ======
function isValidEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}
function getUsers(){try{return JSON.parse(localStorage.getItem('senalandia_users')||'[]')}catch{return[]}}
function saveUsers(u){localStorage.setItem('senalandia_users',JSON.stringify(u))}
function findUser(email){return getUsers().find(x=>x.email.toLowerCase()===email.toLowerCase())}

// MODO register?
let isRegisterMode=false;

function setMode(register){
  isRegisterMode = register;
  correoError.style.display='none'; claveError.style.display='none'; clave2Error.style.display='none';
  if(register){
    loginButtonText.textContent='Crear usuario';
    loginToggleText.innerHTML = '¿Ya tienes cuenta? <strong id="toggleToRegister">Iniciar sesión</strong>';
    clave2Field.style.display='block';
  } else {
    loginButtonText.textContent='Ingresar';
    loginToggleText.innerHTML = '¿No tienes cuenta? <strong id="toggleToRegister">Crear usuario</strong>';
    clave2Field.style.display='none';
  }
  // enlazar toggle
  document.getElementById('toggleToRegister').addEventListener('click',()=>setMode(!isRegisterMode));
}
setMode(false);

// LOGIN / REGISTER
loginButton.addEventListener('click',()=>{
  const correo = correoInput.value.trim();
  const clave = claveInput.value.trim();
  const clave2 = clave2Input ? clave2Input.value.trim() : '';

  correoError.style.display='none'; claveError.style.display='none'; clave2Error.style.display='none';
  let hasError=false;
  if(!isValidEmail(correo)){correoError.style.display='block'; correoError.textContent='Correo inválido'; hasError=true}
  if(!clave){claveError.style.display='block'; claveError.textContent='Clave obligatoria'; hasError=true}

  if(isRegisterMode){
    if(!clave2){clave2Error.style.display='block'; clave2Error.textContent='Confirma la clave'; hasError=true}
    else if(clave!==clave2){clave2Error.style.display='block'; clave2Error.textContent='No coinciden'; hasError=true}
    if(findUser(correo)){correoError.style.display='block'; correoError.textContent='Usuario ya existe'; hasError=true}
    if(!hasError){
      const users = getUsers(); users.push({email:correo,password:clave,role:'student'}); saveUsers(users);
      alert('Usuario creado. Ahora inicia sesión.');
      setMode(false);
    }
  } else {
    const user = findUser(correo);
    if(!user || user.password !== clave){claveError.style.display='block'; claveError.textContent='Correo o clave incorrectos'; hasError=true}
    if(!hasError){
      loginBackdrop.style.display='none'; app.style.display='flex'; app.setAttribute('aria-hidden','false');
      headerUser.innerHTML = `<span class="name">${correo}</span><span class="role">Usuario</span>`;
    }
  }
});

// NAVEGACIÓN
menuItems.forEach(mi=>mi.addEventListener('click',()=>{
  menuItems.forEach(i=>i.classList.remove('active')); mi.classList.add('active');
  const target = mi.getAttribute('data-section');
  Object.keys(sections).forEach(k=>sections[k].hidden = (k!==target));
}));

tiles.forEach(t=>{
  t.addEventListener('click',()=> {
    const s = t.getAttribute('data-section');
    document.querySelector(`.menu-item[data-section="${s}"]`).click();
  });
});

// DEMO: memory simple
document.getElementById('startMemory')?.addEventListener('click', ()=>{
  const area = document.getElementById('memoryResult');
  area.textContent = 'Juego demo: empareja la seña con la imagen (implementable). Pista: esto puede crecer con arrays y drag/drop.';
  setTimeout(()=> area.textContent = 'Listo: aquí se puede programar el juego completo.', 1200);
});

// DEMO: quiz
document.getElementById('startQuiz')?.addEventListener('click', ()=>{
  const q = document.getElementById('quizResult');
  q.innerHTML = '<p>Puntaje demo: <strong>3 / 5</strong></p><p>Los resultados se guardan en localStorage para seguimiento.</p>';
});

