const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const btn = document.getElementById("spin-btn");
const resultText = document.getElementById("result");

const segments = [
  "Free Lifetime Access",
  "10% Off",
  "Better Luck Next Time",
  "Free Merchandise",
  "5% Off",
  "Free Premium Upgrade"
];

const colors = ["#FF6333", "#FFBD33", "#33FF57", "#33C4FF", "#A833FF", "#FF3380"];
const size = 500;
const center = size / 2;
const numSegments = segments.length;

let angle = 0;

function drawWheel() {
  const arcSize = (2 * Math.PI) / numSegments;

  for (let i = 0; i < numSegments; i++) {
    const start = i * arcSize;
    const end = start + arcSize;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, center - 10, start, end);
    ctx.fillStyle = colors[i];
    ctx.fill();

    ctx.save();
    ctx.translate(
      center + Math.cos(start + arcSize / 2) * (center - 90),
      center + Math.sin(start + arcSize / 2) * (center - 90)
    );
    ctx.rotate(start + arcSize / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(segments[i], 0, 0);
    ctx.restore();
  }
}

function spin() {
  btn.disabled = true;
  const randomSpin = Math.random() * 5000 + 3000;
  const spinEase = randomSpin + angle;
  const duration = 4000;
  let start = null;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const eased = easeOutCubic(progress, angle, spinEase - angle, duration);

    angle = eased;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle * Math.PI / 180);
    ctx.translate(-center, -center);
    drawWheel();
    ctx.restore();

    if (progress < duration) requestAnimationFrame(animate);
    else endSpin();
  }

  requestAnimationFrame(animate);
}

function endSpin() {
  const rotated = (angle % 360) / (360 / numSegments);
  const index = Math.floor(numSegments - rotated) % numSegments;
  resultText.innerText = `Result: ${segments[index]}`;
  btn.disabled = false;
}

function easeOutCubic(t, b, c, d) {
  t /= d;
  t--;
  return c * (t * t * t + 1) + b;
}

drawWheel();
btn.addEventListener("click", spin);
