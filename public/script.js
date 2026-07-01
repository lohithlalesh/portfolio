const root = document.documentElement;
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const hoverTargets = document.querySelectorAll("a, button, .magnetic, .work-card, .note-card, .mode-lane, .tool-dock img");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const portraitCard = document.querySelector(".portrait-card");
const photoTitle = document.querySelector("[data-photo-title]");
const photoNote = document.querySelector("[data-photo-note]");
const musicToggle = document.querySelector(".music-toggle");
const musicAudio = document.querySelector(".music-audio");
const modesSection = document.querySelector(".modes-section");
const modeCards = [...document.querySelectorAll("[data-mode-card]")];
const roleWire = document.querySelector("[data-role-wire]");

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

document.querySelectorAll(".split").forEach((node) => {
  const words = node.textContent.trim().split(/\s+/);
  node.textContent = "";
  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "word";
    span.style.setProperty("--word-index", index);
    span.textContent = word;
    node.append(span, document.createTextNode(index === words.length - 1 ? "" : " "));
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal, .split").forEach((node) => revealObserver.observe(node));

if (canHover) {
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let ringX = cursorX;
  let ringY = cursorY;

  const drawCursor = () => {
    ringX += (cursorX - ringX) * 0.18;
    ringY += (cursorY - ringY) * 0.18;
    cursorDot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(drawCursor);
  };

  window.addEventListener("pointermove", (event) => {
    document.body.classList.add("cursor-ready");
    cursorX = event.clientX;
    cursorY = event.clientY;
    root.style.setProperty("--pointer-x", `${event.clientX}px`);
    root.style.setProperty("--pointer-y", `${event.clientY}px`);
  });

  hoverTargets.forEach((target) => {
    target.addEventListener("pointerenter", () => cursorRing.classList.add("is-hovering"));
    target.addEventListener("pointerleave", () => cursorRing.classList.remove("is-hovering"));
  });

  document.querySelectorAll(".magnetic").forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      target.style.transform = `translate(${x}px, ${y}px)`;
    });
    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });

  drawCursor();
}

portraitCard?.addEventListener("pointerenter", () => {
  document.body.classList.add("is-portrait-hover");
});

portraitCard?.addEventListener("pointerleave", () => {
  document.body.classList.remove("is-portrait-hover");
});

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

portraitCard?.addEventListener("click", () => {
  const isReal = portraitCard.classList.toggle("is-real");
  photoTitle.textContent = isReal ? "That's the real me" : "A Cool Photo of Mine (AI)";
  photoNote.textContent = isReal ? "" : "click to see non AI pic";
});

musicToggle?.addEventListener("click", async () => {
  try {
    if (musicAudio.paused) {
      await musicAudio.play();
      musicToggle.classList.add("is-playing");
      musicToggle.setAttribute("aria-pressed", "true");
    } else {
      musicAudio.pause();
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-pressed", "false");
    }
  } catch (error) {
    musicToggle.classList.remove("is-playing");
    musicToggle.setAttribute("aria-pressed", "false");
  }
});

musicAudio?.addEventListener("ended", () => {
  musicToggle.classList.remove("is-playing");
  musicToggle.setAttribute("aria-pressed", "false");
});

const updateModes = () => {
  if (!modesSection || modeCards.length === 0) return;
  const rect = modesSection.getBoundingClientRect();
  const scrollable = Math.max(1, rect.height - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
  const activeIndex = Math.min(modeCards.length - 1, Math.floor(progress * modeCards.length));

  modeCards.forEach((card, index) => {
    const active = index <= activeIndex;
    card.classList.toggle("active", active);
    card.classList.toggle("current", index === activeIndex);
  });

  roleWire?.style.setProperty("--wire-progress", progress.toFixed(3));
  roleWire?.style.setProperty("--wire-rotation", `${(-130 + progress * 320).toFixed(2)}deg`);
  modesSection.dataset.mode = String(activeIndex + 1);
};

window.addEventListener("scroll", updateModes, { passive: true });
window.addEventListener("resize", updateModes);
updateModes();
