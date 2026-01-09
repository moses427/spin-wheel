const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const editBtn = document.getElementById("edit-btn");

let segments = [
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
let angle = 0;

function drawWheel() {
  const arcSize = (2 * Math.PI) / segments.length;
  for (let i = 0; i < segments.length; i++) {
    const start = i * arcSize;
    const end = start + arcSize;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, center - 10, start, end);
    ctx.fillStyle = colors[i % colors.length];
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

function spinWheel() {
  spinBtn.disabled = true;
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
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-center, -center);
    drawWheel();
    ctx.restore();

    if (progress < duration) requestAnimationFrame(animate);
    else endSpin();
  }

  requestAnimationFrame(animate);
}

function endSpin() {
  const rotated = (angle % 360) / (360 / segments.length);
  const index = Math.floor(segments.length - rotated) % segments.length;
  alert(`🎉 You won: ${segments[index]} 🎉`);
  spinBtn.disabled = false;
}

function easeOutCubic(t, b, c, d) {
  t /= d;
  t--;
  return c * (t * t * t + 1) + b;
}

// Edit button functionality
editBtn.addEventListener("click", () => {
  const newPrizes = prompt(
    "Enter prizes separated by commas:",
    segments.join(", ")
  );
  if (newPrizes) {
    segments = newPrizes.split(",").map(s => s.trim()).filter(s => s);
    drawWheel();
  }
});

spinBtn.addEventListener("click", spinWheel);

drawWheel();
