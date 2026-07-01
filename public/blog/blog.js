const progress = document.querySelector("[data-read-progress]");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const postCards = [...document.querySelectorAll("[data-cat]")];
const accordionButtons = [...document.querySelectorAll(".acc-head")];
const statNumbers = [...document.querySelectorAll("[data-count]")];

const updateProgress = () => {
  if (!progress) return;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const amount = Math.min(1, Math.max(0, window.scrollY / max));
  progress.style.setProperty("--read-progress", amount.toFixed(3));
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    postCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.cat === filter;
      card.classList.toggle("is-hidden", !visible);
    });
  });
});

accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".acc-item");
    const open = !item.classList.contains("is-open");
    item.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
  });
});

const formatNumber = (node, value) => {
  const decimals = Number(node.dataset.decimals || 0);
  const prefix = node.dataset.prefix || "";
  const suffix = node.dataset.suffix || "";
  if (node.dataset.raw === "true") return `${prefix}${Math.round(value)}${suffix}`;
  return `${prefix}${value.toFixed(decimals)}${suffix}`;
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const node = entry.target;
    const target = Number(node.dataset.count || 0);
    const start = performance.now();
    const duration = 900;
    const tick = (now) => {
      const progressAmount = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progressAmount, 3);
      node.textContent = formatNumber(node, target * eased);
      if (progressAmount < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    statObserver.unobserve(node);
  });
}, { threshold: 0.35 });

statNumbers.forEach((node) => statObserver.observe(node));
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();
