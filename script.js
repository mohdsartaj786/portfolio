document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 250);
  });

  // 2. Scroll Progress Bar & Back to Top
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;

    if (scrollTop > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 3. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // 4. Typing Animation in Hero
  const roles = [
    'Web Developer',
    'Freelancer',
    'Frontend Engineer',
    'UI/UX Designer'
  ];
  const typedEl = document.getElementById('typed-role');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    typedEl.textContent = isDeleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);

    charIndex += isDeleting ? -1 : 1;

    let speed = isDeleting ? 55 : 95;
    if (!isDeleting && charIndex === current.length) {
      speed = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 350;
    }
    setTimeout(typeLoop, speed);
  }
  typeLoop();

  // 5. Scroll Reveal Animation
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // 6. Project Category Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // 7. Project Case Study Modal
  const caseStudies = {
    auranet: {
      title: 'AuraNet Digital — Agency & AI Platform',
      problem: 'Modern digital agencies need a fast, authoritative web presence that clearly showcases web engineering and AI automation services.',
      solution: 'Built a responsive, dark-themed web platform with modular service cards, interactive navigation, and cloud deployment on Vercel.',
      outcome: 'Live production deployment with fast first-contentful paint and streamlined client lead capture.',
      live: 'https://aura-net-digital-modern-web-solutio.vercel.app/',
      repo: 'https://github.com/mohdsartaj786/-Aura-net-Digital-.git'
    },
    travel: {
      title: 'Travel Bharat — Indian Tourism Platform',
      problem: 'Travelers exploring heritage destinations in India often face cluttered portals with slow mobile performance.',
      solution: 'Engineered a structured destination discovery interface with categorized itineraries and Express backend readiness.',
      outcome: 'Clean, mobile-friendly cultural exploration experience hosted on GitHub.',
      repo: 'https://github.com/mohdsartaj786/TravelBharat.git'
    },
    pixora: {
      title: 'PIXORA — Visual & Media Showcase',
      problem: 'Creators and photographers require a zero-distraction gallery that highlights high-resolution visuals without layout shifts.',
      solution: 'Designed an auto-adjusting CSS Grid showcase with smooth hover states and optimized aspect ratios.',
      outcome: 'Zero layout shift (CLS) responsive gallery compatible across all screen sizes.',
      repo: 'https://github.com/mohdsartaj786/PIXORA.git'
    },
    rewear: {
      title: 'ReWear — Sustainable Clothing Swap UI',
      problem: 'Peer-to-peer fashion exchange platforms need intuitive item discovery and trust-building product cards.',
      solution: 'Developed a multi-page dark-mode storefront in pure HTML5, CSS3, and Vanilla JavaScript without heavy framework overhead.',
      outcome: 'Ultra-fast page transitions and intuitive garment swap workflow.'
    },
    foodrush: {
      title: 'FoodRush — Food Ordering Interface',
      problem: 'Local restaurants need a lightweight ordering menu that works directly with WhatsApp without expensive app commissions.',
      solution: 'Built an interactive category menu with real-time cart total calculation and one-click order summary generation.',
      outcome: 'Streamlined mobile ordering flow reducing checkout steps.'
    },
    railway: {
      title: 'Railway Reservation System — Java & MySQL',
      problem: 'Manual seat allocation and PNR tracking lead to booking errors and slow passenger lookups.',
      solution: 'Built a desktop GUI application using Core Java, Java Swing, and JDBC connected to a normalized MySQL database with ER & DFD architecture.',
      outcome: 'Instant PNR status verification, ticket booking, and automated seat availability updates.'
    }
  };

  const modal = document.getElementById('case-modal');
  const modalClose = document.getElementById('modal-close');

  document.querySelectorAll('.case-study-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = caseStudies[btn.dataset.project];
      if (!data) return;

      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-problem').textContent = data.problem;
      document.getElementById('modal-solution').textContent = data.solution;
      document.getElementById('modal-outcome').textContent = data.outcome;

      const linksBox = document.getElementById('modal-links');
      linksBox.innerHTML = '';
      if (data.live) {
        linksBox.innerHTML += `<a href="${data.live}" target="_blank" rel="noopener" class="btn btn-primary">Live Demo</a>`;
      }
      if (data.repo) {
        linksBox.innerHTML += `<a href="${data.repo}" target="_blank" rel="noopener" class="btn btn-outline">GitHub Code</a>`;
      }

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  // 8. Pricing Plan Pre-fill to Contact Form
  const packageSelect = document.getElementById('project-package');
  document.querySelectorAll('.select-plan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      packageSelect.value = btn.dataset.plan;
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      showToast(`Selected: ${btn.dataset.plan}`);
    });
  });

  // 9. FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const isOpen = item.classList.toggle('open');
      button.setAttribute('aria-expanded', isOpen);
    });
  });

  // 10. Working Contact & Project Inquiry Form (Email + WhatsApp)
  const form = document.getElementById('inquiry-form');
  const feedback = document.getElementById('form-feedback');
  const whatsappBtn = document.getElementById('send-whatsapp-btn');

  function getValidatedFormData() {
    const name = document.getElementById('client-name').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const pkg = packageSelect.value;
    const message = document.getElementById('project-message').value.trim();

    if (!name || !email || !message) {
      feedback.style.color = '#f87171';
      feedback.textContent = 'Please fill in your Name, Email, and Project Details.';
      return null;
    }
    return { name, email, phone, pkg, message };
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = getValidatedFormData();
    if (!data) return;

    const subject = encodeURIComponent(`Website Inquiry: ${data.pkg} — ${data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\nPackage: ${data.pkg}\n\nProject Details:\n${data.message}`
    );

    feedback.style.color = '#4ade80';
    feedback.textContent = 'Opening Gmail compose with your inquiry details...';
    showToast('Inquiry ready — opening email!');
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=hashmisartaj07@gmail.com&su=${subject}&body=${body}`, '_blank');
  });

  whatsappBtn.addEventListener('click', () => {
    const data = getValidatedFormData();
    if (!data) return;

    const text = encodeURIComponent(
      `Hi Sartaj! I want to start a project.\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Package:* ${data.pkg}\n*Details:* ${data.message}`
    );

    feedback.style.color = '#4ade80';
    feedback.textContent = 'Redirecting to WhatsApp chat...';
    showToast('Opening WhatsApp chat...');
    window.open(`https://wa.me/917309130230?text=${text}`, '_blank');
  });

  // 11. Toast Helper
  const toast = document.getElementById('toast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }
});