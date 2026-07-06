/**
 * 175 Gallery - Interactive Application Logic
 * Handles 3-Step Accordion Form, Menu Filtering, Lightbox, Modals, and Scroll Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMenuFiltering();
  initModals();
  initMobileMenu();
  initScrollAnimations();
});

/* --- Navigation & Sticky Header --- */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, main > div');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Highlight active link on scroll
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --- 3-Step Accordion Form Wizard ("Curate Your Perfect Occasion") --- */
let currentStep = 1;

function toggleStep(stepIndex) {
  // Allow toggling back to previous completed steps or active step
  if (stepIndex <= currentStep || stepIndex === 1) {
    activateStep(stepIndex);
  }
}

function goToStep(nextStep) {
  if (nextStep === 2) {
    // Validate Step 1
    const dateInput = document.getElementById('eventDate');
    const guestsInput = document.getElementById('eventGuests');
    
    if (!dateInput.value) {
      alert('Please select your preferred event date.');
      dateInput.focus();
      return;
    }
    if (!guestsInput.value || guestsInput.value < 1) {
      alert('Please enter an estimated number of guests.');
      guestsInput.focus();
      return;
    }
    
    currentStep = Math.max(currentStep, 2);
    activateStep(2);
  } else if (nextStep === 3) {
    // Validate Step 2
    const nameInput = document.getElementById('contactName');
    const phoneInput = document.getElementById('contactPhone');
    const emailInput = document.getElementById('contactEmail');
    
    if (!nameInput.value.trim()) {
      alert('Please enter your full name.');
      nameInput.focus();
      return;
    }
    if (!phoneInput.value.trim() && !emailInput.value.trim()) {
      alert('Please provide either a phone number or email address so we can contact you.');
      return;
    }

    // Populate Summary on Step 3
    const selectedOccasion = document.querySelector('input[name="occasion"]:checked').value;
    const dateVal = document.getElementById('eventDate').value;
    const guestsVal = document.getElementById('eventGuests').value;
    const nameVal = document.getElementById('contactName').value;
    const emailVal = document.getElementById('contactEmail').value || 'Phone contact preferred';

    document.getElementById('summaryOccasion').textContent = selectedOccasion;
    document.getElementById('summaryDate').textContent = formatDate(dateVal);
    document.getElementById('summaryGuests').textContent = `${guestsVal} Guests`;
    document.getElementById('summaryContact').textContent = `${nameVal} (${emailVal})`;

    currentStep = 3;
    activateStep(3);
  }
}

function activateStep(stepIndex) {
  const steps = document.querySelectorAll('.accordion-step');
  steps.forEach((step, idx) => {
    if (idx + 1 === stepIndex) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });
}

function submitEventForm() {
  const selectedOccasion = document.querySelector('input[name="occasion"]:checked').value;
  const nameVal = document.getElementById('contactName').value;
  
  alert(`Thank you, ${nameVal}! Your inquiry for a ${selectedOccasion} has been received by our curator. We will contact you within 24 hours to finalize details.`);
  
  // Reset Accordion
  document.getElementById('eventDate').value = '';
  document.getElementById('eventGuests').value = '';
  document.getElementById('contactName').value = '';
  document.getElementById('contactPhone').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('specialNotes').value = '';
  
  currentStep = 1;
  activateStep(1);
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}

/* --- Menu Category Filtering --- */
function initMenuFiltering() {
  const tabs = document.querySelectorAll('.menu-tab');
  const cards = document.querySelectorAll('.menu-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCategory = tab.getAttribute('data-category');

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --- Modals & Lightbox --- */
function initModals() {
  const resModal = document.getElementById('reservationModal');
  const openResBtns = [document.getElementById('openReserveBtn'), document.getElementById('heroReserveBtn')];
  const closeResBtn = document.getElementById('closeReserveBtn');

  openResBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        resModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
  });

  if (closeResBtn) {
    closeResBtn.addEventListener('click', () => {
      resModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === resModal) {
      resModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    const lightboxModal = document.getElementById('lightboxModal');
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });
}

function submitReservation(event) {
  event.preventDefault();
  const name = document.getElementById('resName').value;
  const date = document.getElementById('resDate').value;
  const time = document.getElementById('resTime').value;
  const guests = document.getElementById('resGuests').value;

  alert(`Reservation Confirmed!\n\nWe look forward to welcoming you, ${name}.\nDate: ${formatDate(date)} at ${time}\nTable for: ${guests}\n\nA confirmation SMS has been sent to your phone.`);
  
  document.getElementById('reserveForm').reset();
  document.getElementById('reservationModal').classList.remove('active');
  document.body.style.overflow = '';
}

/* --- Gallery Lightbox --- */
function openLightbox(imageSrc, title) {
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  
  lightboxImage.src = imageSrc;
  lightboxImage.alt = title;
  lightboxModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  lightboxModal.classList.remove('active');
  document.body.style.overflow = '';
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply initial hidden state and attach observer to cards and section titles
  const animateElements = document.querySelectorAll('.menu-card, .voice-card, .story-content, .events-content, .gallery-item');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* --- Mobile Menu Drawer --- */
function initMobileMenu() {
  const openMenuBtn = document.getElementById('openMenuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileOverlay = document.getElementById('mobileMenuOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (openMenuBtn && mobileOverlay) {
    openMenuBtn.addEventListener('click', () => {
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeMenuBtn && mobileOverlay) {
    closeMenuBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        closeMobileMenu();
      }
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });
}

function closeMobileMenu() {
  const mobileOverlay = document.getElementById('mobileMenuOverlay');
  if (mobileOverlay) {
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}
