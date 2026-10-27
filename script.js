/* =========================================================
   1. कलर पैलेट (10 रंग + कस्टम पिकर)
========================================================= */
const themeColors = [
  '#a0c0d0', '#ff7eb6', '#ff3b4e', '#ffffff', '#ffe627', 
  '#ff9f43', '#00ff66', '#22d3ee', '#a855f7'
];

let activeThemeHex = '#00ff66';

function initThemePalette() {
  const paletteBox = document.getElementById('themePalette');
  themeColors.forEach(hex => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (hex === activeThemeHex ? ' active' : '');
    dot.style.backgroundColor = hex;
    dot.onclick = () => updateTheme(hex, dot);
    paletteBox.appendChild(dot);
  });

  const customInput = document.getElementById('customColorInput');
  customInput.addEventListener('input', (event) => {
    updateTheme(event.target.value, null);
  });
}

function updateTheme(hex, selectedDot) {
  activeThemeHex = hex;
  document.documentElement.style.setProperty('--theme', hex);
  document.documentElement.style.setProperty('--theme-glow', hex + '55');

  document.querySelectorAll('.dot').forEach(el => el.classList.remove('active'));
  if (selectedDot) {
    selectedDot.classList.add('active');
  }
}

initThemePalette();

/* =========================================================
   2. फ़ॉर्म मोड टॉगल (लॉगिन <-> साइन-अप)
========================================================= */
let isSignupMode = false;

function toggleFormMode() {
  isSignupMode = !isSignupMode;
  
  const title = document.getElementById('titleText');
  const sub = document.getElementById('subText');
  const nameGroup = document.getElementById('nameGroup');
  const submitBtn = document.getElementById('submitBtn');
  const prompt = document.getElementById('switchPrompt');
  const link = document.getElementById('switchBtn');
  const forgot = document.getElementById('forgotBtn');

  if (isSignupMode) {
    title.innerHTML = 'Create <span>Account</span>';
    sub.textContent = 'Join Eclipse today to access your secure workspace';
    nameGroup.style.display = 'block';
    submitBtn.innerHTML = 'Create Account ➔';
    prompt.textContent = 'Already have an account?';
    link.textContent = 'Sign In';
    forgot.style.display = 'none';
  } else {
    title.innerHTML = 'Welcome <span>Back</span>';
    sub.textContent = 'Enter your credentials to access your secure account';
    nameGroup.style.display = 'none';
    submitBtn.innerHTML = 'Sign In ➔';
    prompt.textContent = "Don't have an account?";
    link.textContent = 'Sign Up';
    forgot.style.display = 'block';
  }
}

/* =========================================================
   3. यूटिलिटीज़ (पासवर्ड टॉगल & टोस्ट मैसेज)
========================================================= */
function togglePasswordVisibility(fieldId) {
  const input = document.getElementById(fieldId);
  input.type = input.type === 'password' ? 'text' : 'password';
}

function displayToast(message) {
  const toast = document.getElementById('toastBox');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function handleForgotPassword() {
  displayToast('Password reset link sent to your email.');
}

/* =========================================================
   4. एक्शन हैंडलर्स (फ़ॉर्म सबमिशन & सोशल क्लिक्स)
========================================================= */
function handleFormSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('userEmail').value.trim();
  const password = document.getElementById('userPassword').value;
  const name = document.getElementById('userName').value.trim();

  // ब्राउज़र के लोकल स्टोरेज में डेटा सेव करना (लोकल टेस्टिंग)
  const userData = {
    mode: isSignupMode ? 'signup' : 'login',
    email: email,
    name: isSignupMode ? name : 'User'
  };

  localStorage.setItem('currentUser', JSON.stringify(userData));
  displayToast(isSignupMode ? 'Account created locally!' : 'Signed in successfully!');

  // सफल लॉगिन के बाद मुख्य ऐप पर रीडायरेक्ट (वैकल्पिक)
  setTimeout(() => {
    // अगर index.html पर भेजना हो तो नीचे वाली लाइन अनकमेंट करें:
    // window.location.href = 'index.html';
  }, 1500);
}

function handleSocialClick(providerName) {
  displayToast('Connecting with ' + providerName + '…');
}

/* =========================================================
   5. बैकग्राउंड एनीमेशन (रिबन्स + गिरती बर्फ)
========================================================= */
const canvas = document.getElementById('canvasBg');
const ctx = canvas.getContext('2d');
let canvasWidth, canvasHeight, waveStep = 0;

function setupCanvasSize() {
  canvasWidth = canvas.width = window.innerWidth;
  canvasHeight = canvas.height = window.innerHeight;
}
window.addEventListener('resize', setupCanvasSize);
setupCanvasSize();

// गिरती बर्फ के पार्टिकल्स
const snowFlakes = [];
for (let i = 0; i < 70; i++) {
  snowFlakes.push({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    radius: Math.random() * 2 + 1,
    velocityY: Math.random() * 1.2 + 0.4,
    velocityX: Math.random() * 0.6 - 0.3,
    alpha: Math.random() * 0.7 + 0.2
  });
}

function drawBackground() {
  waveStep += 0.015;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // डार्क ग्रेडिएंट
  const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  gradient.addColorStop(0, '#040608');
  gradient.addColorStop(0.5, '#070a0e');
  gradient.addColorStop(1, '#030507');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // थीम कलर वाला फ्लोइंग रिबन
  ctx.beginPath();
  for (let x = -20; x <= canvasWidth + 20; x += 20) {
    const y = canvasHeight * 0.48 + 
              Math.sin(x * 0.003 + waveStep) * 55 + 
              Math.cos(x * 0.002 - waveStep) * 35;
    x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = activeThemeHex + '44';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = activeThemeHex;
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // बर्फ के गिरते कण
  for (let flake of snowFlakes) {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${flake.alpha})`;
    ctx.fill();

    flake.y += flake.velocityY;
    flake.x += flake.velocityX;

    if (flake.y > canvasHeight) {
      flake.y = -5;
      flake.x = Math.random() * canvasWidth;
    }
  }

  requestAnimationFrame(drawBackground);
}

drawBackground();
