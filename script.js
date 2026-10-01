const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width;
let height;
let progress = 0;
let isStarted = false;
let animId;


// ==============================
// RESIZE
// ==============================

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  initCosmos();
}

window.addEventListener('resize', resize);


// ==============================
// BINTANG & GALAXY
// ==============================

let stars = [];
let galaxies = [];

function initCosmos() {

  stars = [];

  for (let i = 0; i < 220; i++) {

    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.5,

      color: [
        '#fff',
        '#4cc9f0',
        '#ff758f',
        '#ffb703'
      ][Math.floor(Math.random() * 4)],

      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    });
  }

  galaxies = [
    {
      x: width * 0.15,
      y: height * 0.25,
      size: 85,
      angle: 0,
      color: '#4cc9f0'
    },

    {
      x: width * 0.85,
      y: height * 0.2,
      size: 105,
      angle: 1,
      color: '#7209b7'
    },

    {
      x: width * 0.18,
      y: height * 0.75,
      size: 95,
      angle: 2,
      color: '#ff4d6d'
    }
  ];
}


function drawGalaxy(g) {

  ctx.save();

  ctx.translate(g.x, g.y);

  g.angle += 0.002;

  ctx.rotate(g.angle);

  for (let i = 0; i < 140; i++) {

    const r = (i / 140) * g.size;
    const theta = i * 0.2;

    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);

    ctx.fillStyle = g.color;

    ctx.globalAlpha =
      (1 - i / 140) * 0.4;

    ctx.shadowBlur = 10;
    ctx.shadowColor = g.color;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      Math.random() * 2 + 0.5,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.restore();
}


// ==============================
// FIREWORK
// ==============================

let fireworks = [];

function createFirework(x, y) {

  const particleCount =
    45 + Math.floor(Math.random() * 25);

  const colors = [
    '#ff4d6d',
    '#ffb703',
    '#4cc9f0',
    '#7209b7',
    '#ffffff',
    '#ff758f',
    '#a2d2ff'
  ];

  const baseColor =
    colors[Math.floor(Math.random() * colors.length)];


  for (let i = 0; i < particleCount; i++) {

    const angle =
      (Math.PI * 2 / particleCount) * i +
      (Math.random() * 0.3 - 0.15);

    const speed =
      Math.random() * 5.5 + 2;

    fireworks.push({

      x: x,
      y: y,

      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,

      alpha: 1,

      decay:
        Math.random() * 0.018 + 0.01,

      color: baseColor,

      size:
        Math.random() * 2.8 + 1.2
    });
  }
}


function updateFireworks() {

  for (
    let i = fireworks.length - 1;
    i >= 0;
    i--
  ) {

    const p = fireworks[i];

    p.x += p.vx;
    p.y += p.vy;

    p.vy += 0.05;

    p.vx *= 0.98;
    p.vy *= 0.98;

    p.alpha -= p.decay;


    if (p.alpha <= 0) {

      fireworks.splice(i, 1);

    } else {

      ctx.save();

      ctx.globalAlpha =
        Math.max(0, p.alpha);

      ctx.fillStyle = p.color;

      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        p.size,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();
    }
  }
}


// ==============================
// BUNGA
// ==============================

const flowerConfigs = [

  {
    xRel: 0.50,
    yRel: 0.46,
    scale: 1.0,
    curveX: 0,
    delay: 0
  },

  {
    xRel: 0.36,
    yRel: 0.52,
    scale: 0.78,
    curveX: -50,
    delay: 0.12
  },

  {
    xRel: 0.64,
    yRel: 0.52,
    scale: 0.78,
    curveX: 50,
    delay: 0.18
  },

  {
    xRel: 0.26,
    yRel: 0.62,
    scale: 0.55,
    curveX: -90,
    delay: 0.28
  },

  {
    xRel: 0.74,
    yRel: 0.62,
    scale: 0.55,
    curveX: 90,
    delay: 0.32
  }
];


function drawStem(
  config,
  globalProgress,
  startX,
  startY
) {

  const localProgress =
    Math.max(
      0,
      Math.min(
        1,
        (globalProgress - config.delay) * 2
      )
    );

  if (localProgress <= 0) {

    return {
      currentX: startX,
      currentY: startY,
      p: 0
    };
  }


  const targetX =
    width * config.xRel;

  const targetY =
    height * config.yRel;

  const controlX =
    startX + config.curveX;

  const controlY =
    startY -
    (startY - targetY) * 0.5;


  ctx.save();

  ctx.lineWidth =
    3 * config.scale;

  ctx.strokeStyle =
    '#52b788';

  ctx.shadowColor =
    '#74c69d';

  ctx.shadowBlur = 15;


  ctx.beginPath();

  ctx.moveTo(startX, startY);


  const t = localProgress;


  const currentX =
    (1 - t) * (1 - t) * startX +
    2 * (1 - t) * t * controlX +
    t * t * targetX;

  const currentY =
    (1 - t) * (1 - t) * startY +
    2 * (1 - t) * t * controlY +
    t * t * targetY;


  ctx.quadraticCurveTo(
    controlX,
    controlY,
    currentX,
    currentY
  );

  ctx.stroke();


  if (localProgress > 0.1) {

    ctx.strokeStyle = '#4cc9f0';

    ctx.shadowColor = '#4cc9f0';

    ctx.lineWidth =
      1.5 * config.scale;

    ctx.beginPath();


    for (
      let i = 0;
      i <= 50 * localProgress;
      i++
    ) {

      const step = i / 50;

      const px =
        (1 - step) * (1 - step) * startX +
        2 * (1 - step) * step * controlX +
        step * step * targetX;

      const py =
        (1 - step) * (1 - step) * startY +
        2 * (1 - step) * step * controlY +
        step * step * targetY;

      const offsetX =
        Math.sin(step * 20) *
        (6 * config.scale);


      if (i === 0) {

        ctx.moveTo(
          px + offsetX,
          py
        );

      } else {

        ctx.lineTo(
          px + offsetX,
          py
        );
      }
    }

    ctx.stroke();
  }


  if (localProgress > 0.4) {

    const leafP =
      (localProgress - 0.4) * 1.6;

    drawLeaf(
      currentX,
      currentY + 20,
      config.curveX >= 0,
      leafP,
      config.scale
    );
  }


  ctx.restore();


  return {
    currentX,
    currentY,
    p: localProgress
  };
}


function drawLeaf(
  x,
  y,
  isRight,
  p,
  scale
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.scale(
    isRight ? p * scale : -p * scale,
    p * scale
  );

  ctx.rotate(0.3);


  ctx.fillStyle =
    'rgba(30, 215, 96, 0.15)';

  ctx.strokeStyle =
    '#52b788';

  ctx.shadowColor =
    '#4cc9f0';

  ctx.shadowBlur = 15;

  ctx.lineWidth = 2;


  ctx.beginPath();

  ctx.moveTo(0, 0);

  ctx.quadraticCurveTo(
    60,
    -30,
    100,
    -10
  );

  ctx.quadraticCurveTo(
    50,
    50,
    0,
    0
  );

  ctx.fill();
  ctx.stroke();

  ctx.restore();
}


function drawLotusPetal(
  centerX,
  centerY,
  radius,
  angle,
  color,
  p,
  scale
) {

  ctx.save();

  ctx.translate(
    centerX,
    centerY
  );

  ctx.rotate(angle);

  ctx.scale(
    p * scale,
    p * scale
  );


  ctx.beginPath();

  ctx.moveTo(0, 0);

  ctx.bezierCurveTo(
    -radius * 0.45,
    -radius * 0.5,
    -radius * 0.35,
    -radius * 1.25,
    0,
    -radius * 1.45
  );

  ctx.bezierCurveTo(
    radius * 0.35,
    -radius * 1.25,
    radius * 0.45,
    -radius * 0.5,
    0,
    0
  );


  ctx.fillStyle = color.fill;

  ctx.shadowColor = color.glow;

  ctx.shadowBlur = 22;

  ctx.fill();


  ctx.lineWidth = 1.6;

  ctx.strokeStyle = color.stroke;

  ctx.stroke();


  ctx.beginPath();

  ctx.arc(
    0,
    -radius * 1.4,
    2,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = '#fff';

  ctx.fill();


  ctx.restore();
}


function drawFlower(
  x,
  y,
  stemProgress,
  scale
) {

  const bloom =
    Math.max(
      0,
      Math.min(
        1,
        (stemProgress - 0.7) * 3.3
      )
    );

  if (bloom <= 0) return;


  // Kelopak luar
  for (let i = 0; i < 12; i++) {

    const angle =
      (i * Math.PI * 2) / 12;

    drawLotusPetal(
      x,
      y,
      120,
      angle,
      {
        fill: 'rgba(255, 0, 110, 0.12)',
        stroke: '#ff006e',
        glow: '#ff006e'
      },
      bloom,
      scale
    );
  }


  // Kelopak tengah
  for (let i = 0; i < 10; i++) {

    const angle =
      (i * Math.PI * 2) / 10 +
      Math.PI / 10;

    drawLotusPetal(
      x,
      y,
      90,
      angle,
      {
        fill: 'rgba(131, 56, 236, 0.2)',
        stroke: '#ff758f',
        glow: '#8338ec'
      },
      bloom * 0.95,
      scale
    );
  }


  // Kelopak dalam
  for (let i = 0; i < 8; i++) {

    const angle =
      (i * Math.PI * 2) / 8;

    drawLotusPetal(
      x,
      y,
      60,
      angle,
      {
        fill: 'rgba(58, 12, 163, 0.3)',
        stroke: '#4cc9f0',
        glow: '#4cc9f0'
      },
      bloom * 0.85,
      scale
    );
  }


  // Tengah bunga
  ctx.save();

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    16 * bloom * scale,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = '#fff';

  ctx.shadowColor = '#ffb703';

  ctx.shadowBlur = 30;

  ctx.fill();

  ctx.restore();
}


// ==============================
// BURUNG
// ==============================

const birds = [

  {
    x: 0,
    y: 0,
    scale: 0.65,
    offset: 0
  },

  {
    x: 0,
    y: 0,
    scale: 0.55,
    offset: 2.2
  }
];


function drawHummingbird(
  b,
  time,
  centerX,
  centerY
) {

  ctx.save();


  const radiusX =
    260 +
    Math.sin(time + b.offset) * 35;

  const radiusY =
    140 +
    Math.cos(time + b.offset) * 25;


  b.x =
    centerX +
    Math.cos(
      time * 0.8 + b.offset
    ) * radiusX;


  b.y =
    centerY -
    20 +
    Math.sin(
      time * 0.8 + b.offset
    ) * radiusY;


  ctx.translate(
    b.x,
    b.y
  );

  ctx.scale(
    b.scale,
    b.scale
  );


  const dx =
    Math.cos(
      time * 0.8 +
      b.offset +
      0.1
    ) * radiusX -
    (b.x - centerX);


  ctx.rotate(
    dx > 0 ? 0.2 : -3.3
  );


  ctx.shadowColor = '#4cc9f0';

  ctx.shadowBlur = 15;

  ctx.fillStyle = '#4cc9f0';

  ctx.strokeStyle = '#90e0ef';


  // Paruh
  ctx.beginPath();

  ctx.moveTo(-15, 0);

  ctx.lineTo(-30, -2);

  ctx.stroke();


  // Badan
  ctx.beginPath();

  ctx.ellipse(
    0,
    0,
    14,
    6,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  // Sayap
  const wingAngle =
    Math.sin(time * 25) * 0.8;

  ctx.save();

  ctx.rotate(wingAngle);

  ctx.beginPath();

  ctx.ellipse(
    -2,
    -10,
    16,
    5,
    -Math.PI / 4,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = '#ff758f';

  ctx.fill();

  ctx.restore();

  ctx.restore();
}


// ==============================
// ANIMASI UTAMA
// ==============================

function animate() {

  ctx.clearRect(
    0,
    0,
    width,
    height
  );

  const time =
    Date.now() * 0.0015;


  if (
    isStarted &&
    progress < 1.0
  ) {

    progress += 0.0035;

    if (progress > 1.0) {
      progress = 1.0;
    }
  }


  // Bintang
  stars.forEach(s => {

    s.alpha +=
      Math.sin(time * 3 + s.x) *
      s.speed;

    ctx.fillStyle = s.color;

    ctx.globalAlpha =
      Math.max(
        0.1,
        Math.min(1, s.alpha)
      );

    ctx.beginPath();

    ctx.arc(
      s.x,
      s.y,
      s.r,
      0,
      Math.PI * 2
    );

    ctx.fill();
  });


  galaxies.forEach(drawGalaxy);


  const baseStartX =
    width / 2;

  const baseStartY =
    height - 20;


  if (isStarted) {

    // Bunga
    flowerConfigs.forEach(cfg => {

      const stemRes =
        drawStem(
          cfg,
          progress,
          baseStartX,
          baseStartY
        );

      if (stemRes.p > 0) {

        drawFlower(
          stemRes.currentX,
          stemRes.currentY,
          stemRes.p,
          cfg.scale
        );
      }
    });


    // Burung
    if (progress > 0.6) {

      birds.forEach(b =>
        drawHummingbird(
          b,
          time,
          baseStartX,
          height * 0.5
        )
      );
    }


    // Kembang api
    if (progress >= 0.65) {

      if (Math.random() < 0.035) {

        const rx =
          Math.random() *
          (width * 0.8) +
          (width * 0.1);

        const ry =
          Math.random() *
          (height * 0.35) +
          (height * 0.1);

        createFirework(rx, ry);
      }
    }


    updateFireworks();
  }


  animId =
    requestAnimationFrame(animate);
}


// ==============================
// ANIMASI TEKS
// ==============================

function animateText() {

  const words =
    document.querySelectorAll('.word');

  words.forEach(w =>
    w.classList.remove('visible')
  );


  words.forEach(
    (word, index) => {

      setTimeout(() => {

        word.classList.add('visible');

        const wordRect =
          word.getBoundingClientRect();

        createFirework(
          wordRect.left +
          wordRect.width / 2,

          wordRect.top +
          wordRect.height / 2
        );

      }, 3200 + index * 550);
    }
  );
}


// ==============================
// TOMBOL BUKA
// ==============================

function openMagic() {

  document
    .getElementById('startOverlay')
    .classList.add('hidden');

  isStarted = true;

  progress = 0;

  fireworks = [];

  animateText();
}


// ==============================
// TOMBOL REPLAY
// ==============================

function resetAnimation() {

  progress = 0;

  fireworks = [];

  animateText();
}


// ==============================
// MULAI
// ==============================

resize();

animate();