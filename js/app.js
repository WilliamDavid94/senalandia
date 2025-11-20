document.addEventListener('DOMContentLoaded', () => {
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
  const logoutButton = document.getElementById('logoutButton');

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

  // ====== FUNCIONES UTIL LOGIN ======
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
  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem('senalandia_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('senalandia_current_user');
    }
  }
  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('senalandia_current_user') || 'null');
    } catch {
      return null;
    }
  }
  function showSection(name) {
    Object.keys(sections).forEach((k) => {
      sections[k].hidden = k !== name;
    });
  }

  // ====== ESTADO LOGIN / REGISTER ======
  let isRegisterMode = false;

  function attachToggleListener() {
    const toggle = document.getElementById('toggleToRegister');
    if (!toggle) return;
    toggle.onclick = () => {
      setMode(!isRegisterMode);
    };
  }

  function setMode(register) {
    isRegisterMode = register;

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

    attachToggleListener();
  }

  function renderLoggedUser(user) {
    headerUser.innerHTML = `
      <span class="name">${user.email}</span>
      <span class="role">Usuario</span>
    `;
  }

  function showAppForUser(user) {
    loginBackdrop.style.display = 'none';
    app.style.display = 'flex';
    app.setAttribute('aria-hidden', 'false');
    renderLoggedUser(user);
    showSection('home');

    document
      .querySelectorAll('.menu-item')
      .forEach((i) => i.classList.remove('active'));
    const homeItem = document.querySelector('.menu-item[data-section="home"]');
    if (homeItem) homeItem.classList.add('active');
  }

  // ====== INICIO: ¿HAY SESIÓN GUARDADA? ======
  const existingUser = getCurrentUser();
  if (existingUser) {
    showAppForUser(existingUser);
  } else {
    app.style.display = 'none';
    app.setAttribute('aria-hidden', 'true');
    loginBackdrop.style.display = 'flex';
  }

  setMode(false); // por defecto: modo login

  // ====== LOGIN / REGISTRO ======
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      const correo = correoInput.value.trim();
      const clave = claveInput.value.trim();
      const clave2 = clave2Input ? clave2Input.value.trim() : '';

      correoError.style.display = 'none';
      claveError.style.display = 'none';
      clave2Error.style.display = 'none';

      let hasError = false;

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
        // REGISTRO
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
          const newUser = { email: correo, password: clave, role: 'student' };
          users.push(newUser);
          saveUsers(users);
          alert('Usuario creado correctamente. Ahora inicia sesión.');
          setMode(false);
          claveInput.value = '';
          if (clave2Input) clave2Input.value = '';
        }
      } else {
        // LOGIN
        const user = findUser(correo);
        if (!user || user.password !== clave) {
          claveError.style.display = 'block';
          claveError.textContent = 'Correo o clave incorrectos';
          hasError = true;
        }

        if (!hasError) {
          setCurrentUser(user);
          showAppForUser(user);
        }
      }
    });
  }

  // ====== CERRAR SESIÓN (LOGOUT) ======
  window.senalandiaLogout = function () {
    setCurrentUser(null);

    app.style.display = 'none';
    app.setAttribute('aria-hidden', 'true');
    loginBackdrop.style.display = 'flex';

    if (correoInput) correoInput.value = '';
    if (claveInput) claveInput.value = '';
    if (clave2Input) clave2Input.value = '';

    headerUser.innerHTML = `
      <span class="name">Invitado</span>
      <span class="role">No autenticado</span>
    `;

    setMode(false);
  };

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      window.senalandiaLogout();
    });
  }

  // ====== NAVEGACIÓN ======
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

  // ====== JUEGO DE MEMORIA: LETRA + SEÑA ======
  const memoryBtn = document.getElementById('startMemory');
  const memoryBoard = document.getElementById('memoryBoard');
  const memoryStatus = document.getElementById('memoryStatus');
  const memoryMovesSpan = document.getElementById('memoryMoves');
  const memoryMatchesSpan = document.getElementById('memoryMatches');

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;

  // Cada pareja tiene un "id" y dos tipos: "letra" y "seña"
  const pairs = [
    { id: 'A', type: 'letra', text: 'Letra: A' },
    { id: 'A', type: 'seña',  text: 'Seña de A ✋' },
    { id: 'B', type: 'letra', text: 'Letra: B' },
    { id: 'B', type: 'seña',  text: 'Seña de B ✋' },
    { id: 'C', type: 'letra', text: 'Letra: C' },
    { id: 'C', type: 'seña',  text: 'Seña de C ✋' },
  ];

  function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createMemoryBoard(){
    if (!memoryBoard) return;
    memoryBoard.innerHTML = '';
    const shuffled = shuffle([...pairs]);
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matches = 0;
    if (memoryMovesSpan) memoryMovesSpan.textContent = moves;
    if (memoryMatchesSpan) memoryMatchesSpan.textContent = matches;
    if (memoryStatus)
      memoryStatus.textContent = 'Encuentra la pareja: letra + seña correspondiente.';

    shuffled.forEach((data, index) => {
      const card = document.createElement('button');
      card.className = 'memory-card';
      card.setAttribute('data-id', data.id);
      card.setAttribute('data-type', data.type);
      card.setAttribute('data-index', index);

      const inner = document.createElement('div');
      inner.className = 'memory-card-inner';
      inner.textContent = '?';
      card.appendChild(inner);

      card.dataset.text = data.text; // para mostrar al revelar
      card.addEventListener('click', () => handleCardClick(card));
      memoryBoard.appendChild(card);
    });
  }

  function handleCardClick(card){
    if(lockBoard) return;
    if(card.classList.contains('revealed')) return;
    if(card === firstCard) return;

    revealCard(card);

    if(!firstCard){
      firstCard = card;
    }else{
      secondCard = card;
      lockBoard = true;
      moves++;
      if (memoryMovesSpan) memoryMovesSpan.textContent = moves;

      const id1 = firstCard.getAttribute('data-id');
      const id2 = secondCard.getAttribute('data-id');
      const type1 = firstCard.getAttribute('data-type');
      const type2 = secondCard.getAttribute('data-type');

      // Coinciden si tienen el mismo id y tipos distintos (letra vs seña)
      const isMatch = id1 === id2 && type1 !== type2;

      if(isMatch){
        matches++;
        if (memoryMatchesSpan) memoryMatchesSpan.textContent = matches;
        disablePair();
        if(matches === pairs.length / 2){
          if (memoryStatus)
            memoryStatus.textContent =
              `¡Excelente! Emparejaste todas las letras con sus señas en ${moves} intentos.`;
        }else{
          if (memoryStatus)
            memoryStatus.textContent = '¡Muy bien! Sigue emparejando letras con señas.';
        }
      }else{
        if (memoryStatus)
          memoryStatus.textContent = 'No es la seña correcta, inténtalo de nuevo.';
        setTimeout(hidePair, 900);
      }
    }
  }

  function revealCard(card){
    card.classList.add('revealed');
    const inner = card.querySelector('.memory-card-inner');
    if (inner) inner.textContent = card.dataset.text || '';
  }

  function hidePair(){
    if(firstCard) {
      firstCard.classList.remove('revealed');
      const inner1 = firstCard.querySelector('.memory-card-inner');
      if (inner1) inner1.textContent = '?';
    }
    if(secondCard) {
      secondCard.classList.remove('revealed');
      const inner2 = secondCard.querySelector('.memory-card-inner');
      if (inner2) inner2.textContent = '?';
    }
    resetTurn();
  }

  function disablePair(){
    if(firstCard) firstCard.classList.add('disabled');
    if(secondCard) secondCard.classList.add('disabled');
    resetTurn();
  }

  function resetTurn(){
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  if(memoryBtn && memoryBoard){
    memoryBtn.addEventListener('click', () => {
      createMemoryBoard();
    });
  }

  // ====== DEMO EVALUACIÓN ======
  const quizBtn = document.getElementById('startQuiz');
  const quizResult = document.getElementById('quizResult');
  if (quizBtn && quizResult) {
    quizBtn.addEventListener('click', () => {
      quizResult.innerHTML =
        '<p>Demo: aquí puedes agregar preguntas tipo selección múltiple sobre el abecedario y vocabulario en señas.</p>';
    });
  }
});

