document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     UTILITIES
  ================================ */
  const $ = selector => document.querySelector(selector);
  const $$ = selector => document.querySelectorAll(selector);

  /* ===============================
     PERFORMANCE UTILITIES
  ================================ */
  const throttle = (fn, limit = 16) => {
    let waiting = false;
    return (...args) => {
      if (!waiting) {
        fn(...args);
        waiting = true;
        setTimeout(() => (waiting = false), limit);
      }
    };
  };

  /* ===============================
     GLOBAL ELEMENTS
  ================================ */
  const navbar = $(".navbar");
  const loader = $("#loader");
  const progressBar = $("#scroll-progress");
  const scrollTopBtn = $("#scrollTopBtn");
  const cursor = $(".cursor");
  const hamburger = $("#hamburger");
  const navLinks = $(".nav-links");

  /* ===============================
     BUTTON CLICK FEEDBACK
  ================================ */
  $$("button").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.style.transform = "scale(0.95)";
      setTimeout(() => btn.style.transform = "scale(1)", 150);
    });
  });

  /* ===============================
     CURSOR GLOW + CUSTOM CURSOR
  ================================ */
  document.addEventListener("mousemove", e => {
    document.body.style.setProperty("--x", `${e.clientX}px`);
    document.body.style.setProperty("--y", `${e.clientY}px`);

    if (cursor) {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    }
  });

  /* ===============================
     REVEAL ON SCROLL
  ================================ */
  const reveals = $$(".reveal");

  function handleReveal() {
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) {
        el.classList.add("active");
      }
    });
  }

  /* ===============================
     NAVBAR + SCROLL LOGIC
  ================================ */
  function handleScroll() {
    const scrollY = window.scrollY;

    navbar?.classList.toggle("scrolled", scrollY > 50);

    if (progressBar) {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = `${(scrollY / docHeight) * 100}%`;
    }

    scrollTopBtn?.classList.toggle("show", scrollY > 400);

    handleReveal();
    triggerCounters();
  }

  window.addEventListener("scroll", handleScroll);

  /* ===============================
     SCROLL TO TOP
  ================================ */
  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ===============================
     MOBILE MENU
  ================================ */
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    $$(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });
  }

  /* ===============================
     AI LOADER
  ================================ */
  window.addEventListener("load", () => {
    handleReveal();
    setTimeout(() => loader?.classList.add("hidden"), 1200);
  });

  /* ===============================
     WAVE RING ANIMATION
  ================================ */
  const path = $("#wavePath");
  let t = 0;

  function generateWavePath() {
    if (!path) return;

    const cx = 100, cy = 100;
    const baseRadius = 60;
    const points = 180;
    const waveAmplitude = 4;
    const waveFrequency = 10;

    let d = "";

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const wave = Math.sin(angle * waveFrequency + t) * waveAmplitude;
      const r = baseRadius + wave;

      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }

    path.setAttribute("d", d + " Z");
    t += 0.05;

    requestAnimationFrame(generateWavePath);
  }

  generateWavePath();

  /* ===============================
     METRICS COUNTER
  ================================ */
  const counters = $$(".metric h3");
  let countersStarted = false;

  function triggerCounters() {
    if (countersStarted) return;

    const metrics = $(".metrics");
    if (!metrics) return;

    if (metrics.getBoundingClientRect().top < window.innerHeight - 120) {
      countersStarted = true;

      counters.forEach(counter => {
        const target = +counter.dataset.target;
        let count = 0;
        const step = target / 80;

        function update() {
          count += step;
          if (count < target) {
            counter.textContent = Math.ceil(count);
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        }
        update();
      });
    }
  }

});
