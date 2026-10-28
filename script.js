function animateScene() {
  loopStep += 0.015;
  // पूरा कैनवस साफ़ करें ताकि पीछे का वॉलपेपर दिखे
  ctx.clearRect(0, 0, W, H);

  // ध्यान दें: यहाँ से bgGradient और fillRect पूरी तरह हटा दें!

  // थीम कलर वेव / रिबन
  ctx.beginPath();
  for (let x = -20; x <= W + 20; x += 20) {
    const y = H * 0.48 + 
              Math.sin(x * 0.003 + loopStep) * 55 + 
              Math.cos(x * 0.002 - loopStep) * 35;
    x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = activeHexColor + '66';
  ctx.lineWidth = 2.5;
  ctx.stroke();

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
