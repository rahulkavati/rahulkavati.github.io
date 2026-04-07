const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const yearEl = document.getElementById("year");

yearEl.textContent = new Date().getFullYear();

function getSavedTheme() {
  return localStorage.getItem("theme");
}

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const iconEl = themeBtn.querySelector("i[data-lucide]");
  if (iconEl) {
    iconEl.setAttribute("data-lucide", theme === "light" ? "sun" : "moon");
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }
}

const saved = getSavedTheme();
if (saved) {
  setTheme(saved);
} else {
  setTheme("dark");
}

themeBtn.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
});

// Scroll reveal animations
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.card, .section__head, .titem');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 50);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
}

// Staggered animation for skill tags
function initSkillTagAnimations() {
  const skillCards = document.querySelectorAll('.skill-card');
  
  skillCards.forEach(card => {
    const tags = card.querySelectorAll('.skill-tag');
    tags.forEach((tag, index) => {
      tag.style.animationDelay = `${index * 0.05}s`;
    });
  });
}

// Parallax effect for cards on mouse move
function initParallaxCards() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// Cursor glow effect
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animate() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

// Magnetic effect for buttons
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// Typing effect for hero title (optional enhancement)
function initTypingEffect() {
  const heroTitle = document.querySelector('h1');
  if (!heroTitle) return;
  
  heroTitle.style.opacity = '1';
}

// Smooth scroll for navigation links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Paper Preview Panel (Desktop shows preview, mobile opens directly)
function initPaperPreview() {
  const preview = document.getElementById('paperPreview');
  if (!preview) return;

  const links = document.querySelectorAll('.doi-link');
  const titleEl = preview.querySelector('.paper-preview__title');
  const typeEl = preview.querySelector('.paper-preview__type');
  const openBtn = preview.querySelector('.paper-preview__open');
  const closeBtn = preview.querySelector('.paper-preview__close');
  const iframe = preview.querySelector('.paper-preview__iframe');
  const loading = preview.querySelector('.paper-preview__loading');

  let currentUrl = '';

  function showPreview(link) {
    // Store current URL
    currentUrl = link.href;

    // Populate content
    titleEl.textContent = link.dataset.title;
    typeEl.textContent = link.dataset.type;
    openBtn.href = currentUrl;

    // Reset loading state
    loading.classList.remove('hidden');
    loading.innerHTML = `
      <i data-lucide="loader-2" class="icon spin"></i>
      <span>Loading paper...</span>
    `;
    iframe.src = '';

    // Show preview panel
    preview.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Load paper in iframe after a short delay
    setTimeout(() => {
      iframe.src = currentUrl;
    }, 100);

    // Re-initialize lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Handle "Open in New Tab" button click
  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentUrl) {
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    }
  });

  function hidePreview() {
    preview.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear iframe after animation
    setTimeout(() => {
      iframe.src = '';
      loading.classList.remove('hidden');
    }, 300);
  }

  // Hide loading when iframe loads
  iframe.addEventListener('load', () => {
    loading.classList.add('hidden');
  });

  // Handle iframe load errors (many sites block embedding)
  iframe.addEventListener('error', () => {
    loading.innerHTML = `
      <i data-lucide="alert-circle" class="icon"></i>
      <span>Preview unavailable - site blocks embedding</span>
      <a class="btn btn--primary btn--sm" href="${currentUrl}" target="_blank" rel="noopener" style="margin-top: 12px;" onclick="window.open('${currentUrl}', '_blank'); return false;">
        <i data-lucide="external-link" class="icon-sm"></i> Open in New Tab
      </a>
    `;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      // Check if preview panel exists and is visible (CSS hides on mobile)
      const isPreviewHidden = window.getComputedStyle(preview).display === 'none';
      
      // If preview is hidden by CSS (mobile), let link work normally
      if (isPreviewHidden) {
        return;
      }
      
      // On desktop, show preview panel
      e.preventDefault();
      showPreview(link);
    });
  });

  // Close button
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hidePreview();
  });

  // Close on backdrop click
  preview.addEventListener('click', (e) => {
    if (e.target === preview) {
      hidePreview();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && preview.classList.contains('active')) {
      hidePreview();
    }
  });
}

// Resume Preview Panel
function initResumePreview() {
  const preview = document.getElementById('resumePreview');
  if (!preview) return;

  const resumeLink = document.querySelector('.resume-link');
  if (!resumeLink) return;

  const closeBtn = preview.querySelector('.resume-preview__close');
  const iframe = preview.querySelector('.resume-preview__iframe');
  const openBtn = preview.querySelector('.resume-preview__open');
  const downloadBtn = preview.querySelector('.resume-preview__download');

  const resumeUrl = resumeLink.href;

  function showPreview() {
    // Load PDF in iframe
    iframe.src = resumeUrl;
    
    // Show preview panel
    preview.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Re-initialize lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function hidePreview() {
    preview.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear iframe after animation
    setTimeout(() => {
      iframe.src = '';
    }, 300);
  }

  // Handle resume link click
  resumeLink.addEventListener('click', (e) => {
    // Check if preview panel is visible (CSS hides on mobile)
    const isPreviewHidden = window.getComputedStyle(preview).display === 'none';
    
    if (isPreviewHidden) {
      return; // Let link work normally on mobile
    }
    
    e.preventDefault();
    showPreview();
  });

  // Open in new tab button
  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  });

  // Download button
  downloadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Download attribute handles this, but ensure it works
  });

  // Close button
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hidePreview();
  });

  // Close on backdrop click
  preview.addEventListener('click', (e) => {
    if (e.target === preview) {
      hidePreview();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && preview.classList.contains('active')) {
      hidePreview();
    }
  });
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSkillTagAnimations();
  initParallaxCards();
  initTypingEffect();
  initSmoothScroll();
  initCursorGlow();
  initMagneticButtons();
  initPaperPreview();
  initResumePreview();
});

// Opens user's email client with prefilled message (no backend)
function sendEmail(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:rahulkavati.us@gmail.com?subject=${subject}&body=${body}`;
  return false;
}
