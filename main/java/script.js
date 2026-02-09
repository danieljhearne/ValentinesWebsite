const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const status = document.getElementById("status");
const reset  = document.getElementById("reset");

let noCount = 0;

const noPhrases = [
  "Bro, really?",
  "Twice??",
  "Just say yes lol",
  "...",
  "3 Years in and you are saying no??",
];

function setStatus(html) {
  status.innerHTML = html;
}

/* Confetti (robust fallback if animate isn't supported) */
function confettiBurst() {
  const colors = ["#ff4fa3", "#ff9fcd", "#ffd1e6", "#ffffff", "#c93a7d"];

  const waves = 10;          // how many bursts
  const piecesPerWave = 35; // how much confetti per burst
  const waveDelay = 500;    // ms between bursts

  for (let w = 0; w < waves; w++) {
    setTimeout(() => {
      for (let i = 0; i < piecesPerWave; i++) {
        const piece = document.createElement("span");

        piece.style.position = "fixed";
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.top = "-16px";
        piece.style.width = (5 + Math.random() * 6) + "px";
        piece.style.height = (8 + Math.random() * 14) + "px";
        piece.style.background = colors[(Math.random() * colors.length) | 0];
        piece.style.opacity = "0.95";
        piece.style.borderRadius = "2px";
        piece.style.zIndex = "9999";
        piece.style.pointerEvents = "none";

        const rot1 = Math.random() * 360;
        const rot2 = Math.random() * 360;
        const drift = (Math.random() - 0.5) * 40;
        const duration = 4200 + Math.random() * 2200; // ✨ longer fall

        document.body.appendChild(piece);

        piece.animate(
          [
            { transform: `translate(0,0) rotate(${rot1}deg)`, top: "-16px", offset: 0 },
            { transform: `translate(${drift}vw, 110vh) rotate(${rot2}deg)`, top: "110vh", offset: 1 }
          ],
          {
            duration,
            easing: "cubic-bezier(.15,.7,.2,1)",
            fill: "forwards"
          }
        );

        setTimeout(() => piece.remove(), duration + 200);
      }
    }, w * waveDelay);
  }
}


function lockInYes() {
  yesBtn.disabled = true;
  noBtn.disabled = true;
  setStatus(`💕💕💕<br>Watch this space!!`);
  confettiBurst();
}

/* True teleport within the card (stays inside) */
function teleportNoButton() {
  const card = noBtn.closest(".card");
  if (!card) return;

  // Make sure card can position children
  // (your CSS already has .card { position: relative; } but this doesn't hurt)
  card.style.position = "relative";

  const cardRect = card.getBoundingClientRect();
  const btnRect  = noBtn.getBoundingClientRect();

  // padding so it never touches edges/tape
  const padding = 18;

  // Compute max top-left positions inside the card
  const maxX = Math.max(padding, cardRect.width  - btnRect.width  - padding);
  const maxY = Math.max(padding, cardRect.height - btnRect.height - padding);

  // Random position
  const x = Math.floor(padding + Math.random() * (maxX - padding));
  const y = Math.floor(padding + Math.random() * (maxY - padding));

  // Switch to absolute positioning for real teleport
  // (only affects No button)
  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

function handleNo() {
  noCount++;

  // scale values
  const yesScale = Math.min(1 + noCount * 0.12, 2.1);
  const noScale  = Math.max(1 - noCount * 0.08, 0.55);

  // apply via CSS variables (your button CSS should use these)
  yesBtn.style.setProperty("--s", yesScale.toFixed(2));
  noBtn.style.setProperty("--s",  noScale.toFixed(2));

  // true teleport
  teleportNoButton();

  const phrase = noPhrases[(noCount - 1) % noPhrases.length];
  setStatus(phrase);

  if (noCount >= 8) {
    lockInYes();
  }
}

function resetAll() {
  noCount = 0;
  yesBtn.disabled = false;
  noBtn.disabled = false;

  // reset scaling vars
  yesBtn.style.setProperty("--s", "1");
  noBtn.style.setProperty("--s", "1");

  // put No button back into normal flow
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";

  setStatus("");
}

yesBtn.addEventListener("click", lockInYes);
noBtn.addEventListener("click", handleNo);

reset.addEventListener("click", (e) => {
  e.preventDefault();
  resetAll();
});

resetAll();
