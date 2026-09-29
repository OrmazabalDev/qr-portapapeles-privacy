(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("#theme-toggle");
  const header = document.querySelector(".site-header");
  const progress = document.querySelector("#scroll-progress");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const savedTheme = localStorage.getItem("qrcero-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  setTheme(savedTheme || preferredTheme);

  function setTheme(theme) {
    root.dataset.theme = theme;
    themeToggle?.setAttribute("aria-pressed", String(theme === "light"));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f7faff" : "#07111f");
  }

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("qrcero-theme", nextTheme);
  });

  function onScroll() {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
    if (progress) progress.style.width = `${amount}%`;
    header?.classList.toggle("is-scrolled", scrollTop > 18);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const revealElements = [...document.querySelectorAll(".reveal")];
  revealElements.forEach((element) => {
    const delay = element.dataset.delay;
    if (delay) element.style.setProperty("--delay", `${delay}ms`);
  });

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5%" });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  function hashText(text) {
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function randomFromSeed(seed) {
    let state = seed || 1;
    return () => {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function drawFinder(context, x, y, cell, color) {
    context.fillStyle = color;
    context.fillRect(x * cell, y * cell, 7 * cell, 7 * cell);
    context.fillStyle = "#ffffff";
    context.fillRect((x + 1) * cell, (y + 1) * cell, 5 * cell, 5 * cell);
    context.fillStyle = color;
    context.fillRect((x + 2) * cell, (y + 2) * cell, 3 * cell, 3 * cell);
  }

  function inFinderZone(x, y, size) {
    const topLeft = x < 8 && y < 8;
    const topRight = x >= size - 8 && y < 8;
    const bottomLeft = x < 8 && y >= size - 8;
    return topLeft || topRight || bottomLeft;
  }

  function drawVisualCode(canvas, text, animate = false) {
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const size = 29;
    const pixelRatio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const cssSize = canvas.clientWidth || 320;
    canvas.width = Math.round(cssSize * pixelRatio);
    canvas.height = Math.round(cssSize * pixelRatio);
    const cell = canvas.width / size;
    const random = randomFromSeed(hashText(text));

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#07111f";

    const modules = [];
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (!inFinderZone(x, y, size) && random() > 0.53) modules.push([x, y]);
      }
    }

    const renderModules = (limit) => {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      drawFinder(context, 1, 1, cell, "#07111f");
      drawFinder(context, size - 8, 1, cell, "#07111f");
      drawFinder(context, 1, size - 8, cell, "#07111f");
      context.fillStyle = "#07111f";
      for (let index = 0; index < limit; index += 1) {
        const [x, y] = modules[index];
        const inset = cell * 0.08;
        context.fillRect(x * cell + inset, y * cell + inset, cell - inset * 2, cell - inset * 2);
      }
    };

    if (!animate || reducedMotion.matches) {
      renderModules(modules.length);
      return;
    }

    const started = performance.now();
    const duration = 520;
    const frame = (time) => {
      const percentage = Math.min(1, (time - started) / duration);
      const eased = 1 - Math.pow(1 - percentage, 3);
      renderModules(Math.floor(modules.length * eased));
      if (percentage < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  const heroCanvas = document.querySelector("#hero-qr");
  const demoCanvas = document.querySelector("#demo-qr");
  const demoText = document.querySelector("#demo-text");
  const demoTrigger = document.querySelector("#demo-trigger");
  const byteCount = document.querySelector("#byte-count");
  const demoZero = document.querySelector("#demo-zero");

  const updateBytes = () => {
    if (!demoText || !byteCount) return;
    const bytes = new TextEncoder().encode(demoText.value).length;
    byteCount.textContent = `${bytes} ${bytes === 1 ? "byte" : "bytes"}`;
  };

  const renderDemo = (animate = false) => {
    const value = demoText?.value.trim() || "QRCero";
    drawVisualCode(demoCanvas, value, animate);
    demoZero?.classList.remove("is-visible");
    window.setTimeout(() => demoZero?.classList.add("is-visible"), reducedMotion.matches ? 0 : 360);
  };

  drawVisualCode(heroCanvas, "QRCero · privacidad local · cero rastreo");
  updateBytes();
  renderDemo();

  demoText?.addEventListener("input", updateBytes);
  demoTrigger?.addEventListener("click", () => {
    renderDemo(true);
    demoTrigger.animate?.([
      { transform: "translateY(0) scale(1)" },
      { transform: "translateY(0) scale(.985)" },
      { transform: "translateY(0) scale(1)" }
    ], { duration: 240, easing: "ease-out" });
  });

  let resizeFrame;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      drawVisualCode(heroCanvas, "QRCero · privacidad local · cero rastreo");
      renderDemo();
    });
  });
})();
