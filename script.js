/* =========================================================
   1. कलर पैलेट सिस्टम
========================================================= */
const paletteColors = [
  '#a0c0d0', '#ff7eb6', '#ff3b4e', '#ffffff', '#ffe627', 
  '#ff9f43', '#00ff66', '#22d3ee', '#a855f7'
];

let activeHexColor = '#00ff66';

function initPalette() {
  const container = document.getElementById('paletteGroup');
  paletteColors.forEach(hex => {
    const circle = document.createElement('div');
    circle.className = 'theme-circle' + (hex === activeHexColor ? ' active' : '');
    circle.style.backgroundColor = hex;
    circle.onclick = () => setSiteTheme(hex, circle);
    container.appendChild(circle);
  });

  const customInput = document.getElementById('customColor');
  customInput.oninput = (e) => {
    setSiteTheme(e.target.value, null);
  };
}

function setSiteTheme(hex, activeTarget) {
  activeHexColor = hex;
  document.documentElement.style.setProperty('--theme', hex);
  document.documentElement.style.setProperty('--theme-glow', hex + '55');

  document.querySelectorAll('.theme-circle').forEach(c => c.classList.remove('active'));
  if (activeTarget) activeTarget.classList.add('active');
}

initPalette();

/* =========================================================
   2. बैकग्राउंड वॉलपेपर टॉगल (Cat Banner <-> GIF Mode)
========================================================= */
let isGifMode = false;

function toggleBackground() {
  isGifMode = !isGifMode;
  const layer = document.getElementById('wallpaperLayer');
  layer.classList.toggle('gif-mode', isGifMode);
  showToast(isGifMode ? 'Switched to Animated GIF 🎬' : 'Switched to Cat Banner 🌌');
}

/* =========================================================
   3. फॉर्म मोड टॉगल (Sign In <-> Sign Up)
========================================================= */
let isRegisterMode = false;

function swapFormMode() {
  isRegisterMode = !isRegisterMode;

  const heading = document.getElementById('portalHeading');
  const sub = document.getElementById('portalSub');
  const nameBox = document.getElementById('nameRow');
  const actionBtn = document.getElementById('actionBtn');
  const prompt = document.getElementById('promptTxt');
  const swapBtn = document.getElementById('swapBtn');
  const forgot = document.getElementById('forgotBtn');

  if (isRegisterMode) {
    heading.innerHTML = 'Create <span>Account</span>';
    sub.textContent = 'Join Eclipse today to access your secure workspace';
    nameBox.style.display = 'block';
    actionBtn.innerHTML = 'Create Account ➔';
    prompt.textContent = 'Already have an account?';
    swapBtn.textContent = 'Sign In';
    forgot.style.display = 'none';
  } else {
    heading.innerHTML = 'Welcome <span>Back</span>';
    sub.textContent = 'Enter your credentials to access your secure account';
    nameBox.style.display = 'none';
    actionBtn.innerHTML = 'Sign In ➔';
    prompt.textContent = "Don't have an account?";
    swapBtn.textContent = 'Sign Up';
    forgot.style.display = 'block';
  }
}

function togglePasswordVisibility() {
  const pwd = document.getElementById('passWord');
  pwd.type = pwd.type === 'password' ? 'text' : 'password';
}

function showToast(msg) {
  const toast = document.getElementById('toastPopup');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function sendResetLink() {
  showToast('Password reset link sent to your email.');
}

/* =========================================================
   4. फॉर्म सबमिशन और सोशल हुक्स
========================================================= */
function handleAuth(e) {
  e.preventDefault();

  const email = document.getElementById('emailAddr').value.trim();
  const password = document.getElementById('passWord').value;
  const name = document.getElementById('fullName').value.trim();

  const payload = {
    action: isRegisterMode ? 'signup' : 'login',
    email: email,
    password: password,
    name: isRegisterMode ? name : null
  };

  console.log('Sending Payload to Backend:', payload);
  showToast(isRegisterMode ? 'Account created locally!' : 'Signed in successfully!');
}

function socialAuth(provider) {
  console.log('Directing to ' + provider + ' Auth API...');
  showToast('Connecting with ' + provider + '…');
}

/* =========================================================
   5. बैकग्राउंड स्नो और फ्लोइंग वेव कैनवस
========================================================= */
const canvas = document.getElementById('animCanvas');
const ctx = canvas.getContext('2d');
let W, H, loopStep = 0;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const flakes = [];
for (let i = 0; i < 70; i++) {
  flakes.push({
    x: Math.random() * W,
    y: Math.random() * H,
    radius: Math.random() * 2 + 1,
    vy: Math.random() * 1.1 + 0.4,
    vx: Math.random() * 0.6 - 0.3,
    alpha: Math.random() * 0.7 + 0.2
  });
}

function animateScene() {
  loopStep += 0.015;
  ctx.clearRect(0, 0, W, H);

  // थीम कलर वेव
  ctx.beginPath();
  for (let x = -20; x <= W + 20; x += 20) {
    const y = H * 0.48 + 
              Math.sin(x * 0.003 + loopStep) * 55 + 
              Math.cos(x * 0.002 - loopStep) * 35;
    x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = activeHexColor + '44';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = activeHexColor;
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // स्नो पार्टिकल्स
  for (let f of flakes) {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
    ctx.fill();

    f.y += f.vy;
    f.x += f.vx;

    if (f.y > H) {
      f.y = -5;
      f.x = Math.random() * W;
    }
  }

  requestAnimationFrame(animateScene);
}

animateScene();
