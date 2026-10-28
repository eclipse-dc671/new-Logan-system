const colors = [
  '#a0c0d0', '#ff7eb6', '#ff3b4e', '#ffffff', '#ffe627', 
  '#ff9f43', '#00ff66', '#22d3ee', '#a855f7'
];

let currentHex = '#00ff66';

function initColors() {
  const box = document.getElementById('themePalette');
  box.innerHTML = '';
  colors.forEach(hex => {
    const d = document.createElement('div');
    d.className = 'dot' + (hex === currentHex ? ' active' : '');
    d.style.backgroundColor = hex;
    d.onclick = () => applyTheme(hex, d);
    box.appendChild(d);
  });

  document.getElementById('customColorInput').oninput = (e) => {
    applyTheme(e.target.value, null);
  };
}

function applyTheme(hex, targetDot) {
  currentHex = hex;
  document.documentElement.style.setProperty('--theme', hex);
  document.documentElement.style.setProperty('--theme-glow', hex + '55');

  document.querySelectorAll('.dot').forEach(el => el.classList.remove('active'));
  if (targetDot) targetDot.classList.add('active');
}

initColors();

let isSignup = false;

function toggleMode() {
  isSignup = !isSignup;
  
  const title = document.getElementById('titleText');
  const sub = document.getElementById('subText');
  const nameGrp = document.getElementById('nameGroup');
  const submitBtn = document.getElementById('submitBtn');
  const prompt = document.getElementById('switchPrompt');
  const link = document.getElementById('switchBtn');
  const forgot = document.getElementById('forgotBtn');

  if (isSignup) {
    title.innerHTML = 'Create <span>Account</span>';
    sub.textContent = 'Join Eclipse today to access your secure workspace';
    nameGrp.style.display = 'block';
    submitBtn.innerHTML = 'Create Account ➔';
    prompt.textContent = 'Already have an account?';
    link.textContent = 'Sign In';
    forgot.style.display = 'none';
  } else {
    title.innerHTML = 'Welcome <span>Back</span>';
    sub.textContent = 'Enter your credentials to access your secure account';
    nameGrp.style.display = 'none';
    submitBtn.innerHTML = 'Sign In ➔';
    prompt.textContent = "Don't have an account?";
    link.textContent = 'Sign Up';
    forgot.style.display = 'block';
  }
}

function togglePass(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

function showToast(msg) {
  const t = document.getElementById('toastBox');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function forgotPassword() {
  showToast('Password reset link sent to your email.');
}

function submitForm(e) {
  e.preventDefault();
  showToast(isSignup ? 'Account created successfully!' : 'Signed in successfully!');
}

function connectSocial(platform) {
  showToast('Connecting with ' + platform + '…');
}

/* एनीमेशन कैनवस */
const cv = document.getElementById('canvasBg');
const cx = cv.getContext('2d');
let W, H, step = 0;

function resize() {
  W = cv.width = window.innerWidth;
  H = cv.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const snowList = [];
for (let i = 0; i < 75; i++) {
  snowList.push({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 1,
    vy: Math.random() * 1.2 + 0.4,
    vx: Math.random() * 0.6 - 0.3,
    a: Math.random() * 0.7 + 0.2
  });
}

function renderCanvas() {
  step += 0.015;
  cx.clearRect(0, 0, W, H);

  const grad = cx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#040608');
  grad.addColorStop(0.5, '#070a0e');
  grad.addColorStop(1, '#030507');
  cx.fillStyle = grad;
  cx.fillRect(0, 0, W, H);

  cx.beginPath();
  for (let x = -20; x <= W + 20; x += 20) {
    const y = H * 0.48 + Math.sin(x * 0.003 + step) * 55 + Math.cos(x * 0.002 - step) * 35;
    x === -20 ? ctx.moveTo(x, y) : cx.lineTo(x, y);
  }
  cx.strokeStyle = currentHex + '44';
  cx.lineWidth = 2.5;
  cx.shadowColor = currentHex;
  cx.shadowBlur = 10;
  cx.stroke();
  cx.shadowBlur = 0;

  for (let s of snowList) {
    cx.beginPath();
    cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    cx.fillStyle = `rgba(255, 255, 255, ${s.a})`;
    cx.fill();

    s.y += s.vy;
    s.x += s.vx;

    if (s.y > H) {
      s.y = -5;
      s.x = Math.random() * W;
    }
  }

  requestAnimationFrame(renderCanvas);
}
renderCanvas();
