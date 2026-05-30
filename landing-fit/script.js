const testimonials = [
  { name: 'María García', role: 'Miembro desde 2024', text: '"Desde que entré a FitZone mi vida cambió. Los entrenadores son increíbles y el ambiente motiva a dar lo mejor de ti cada día."', img: 'https://picsum.photos/seed/maria/200/200' },
  { name: 'Carlos López', role: 'Miembro desde 2023', text: '"Perdí 15 kg en 6 meses gracias al plan Premium. El entrenador personal marcó la diferencia. 100% recomendado."', img: 'https://picsum.photos/seed/carlos/200/200' },
  { name: 'Ana Martínez', role: 'Miembro desde 2025', text: '"Las clases grupales son lo mejor. Zumba, yoga y spinning todo incluido en un solo plan. ¡Me encanta!"', img: 'https://picsum.photos/seed/ana/200/200' },
  { name: 'Roberto Sánchez', role: 'Miembro desde 2024', text: '"El área de pesas tiene equipamiento nuevo y siempre limpio. El ambiente es respetuoso y profesional."', img: 'https://picsum.photos/seed/roberto/200/200' }
];

let currentTestimonial = 0;
let testimonialInterval;
let typingTimer;

function initTyping() {
  const words = ['cuerpo', 'mente', 'vida', 'rutina', 'metas'];
  let idx = 0;
  const target = document.getElementById('typingTarget');

  function typeWord(word) {
    target.textContent = '';
    let i = 0;
    clearInterval(typingTimer);
    typingTimer = setInterval(() => {
      target.textContent += word[i];
      i++;
      if (i >= word.length) {
        clearInterval(typingTimer);
        setTimeout(() => eraseWord(word), 2000);
      }
    }, 100);
  }

  function eraseWord(word) {
    let i = word.length;
    clearInterval(typingTimer);
    typingTimer = setInterval(() => {
      target.textContent = word.substring(0, i);
      i--;
      if (i < 0) {
        clearInterval(typingTimer);
        idx = (idx + 1) % words.length;
        setTimeout(() => typeWord(words[idx]), 300);
      }
    }, 50);
  }

  typeWord(words[0]);
}

function renderTestimonials() {
  const track = document.getElementById('testimonialTrack');
  const dots = document.getElementById('carouselDots');

  track.innerHTML = testimonials.map(t => `
    <div class="testimonial-card">
      <img class="avatar" src="${t.img}" alt="${t.name}">
      <blockquote>${t.text}</blockquote>
      <div class="author">${t.name}</div>
      <div class="role">${t.role}</div>
    </div>
  `).join('');

  dots.innerHTML = testimonials.map((_, i) =>
    `<button class="${i === 0 ? 'active' : ''}" onclick="goToTestimonial(${i})"></button>`
  ).join('');

  startCarousel();
}

function goToTestimonial(idx) {
  currentTestimonial = idx;
  updateCarousel();
  resetCarousel();
}

function updateCarousel() {
  const track = document.getElementById('testimonialTrack');
  track.style.transform = `translateX(-${currentTestimonial * 100}%)`;
  document.querySelectorAll('.carousel-dots button').forEach((btn, i) => {
    btn.classList.toggle('active', i === currentTestimonial);
  });
}

function startCarousel() {
  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateCarousel();
  }, 5000);
}

function resetCarousel() {
  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateCarousel();
  }, 5000);
}

function showPlanModal(plan, price) {
  document.getElementById('planModalText').innerHTML = `Has elegido el plan <strong>${plan}</strong> por ${price}`;
  document.getElementById('planModal').classList.add('active');
}

function closePlanModal() {
  document.getElementById('planModal').classList.remove('active');
  showToast('💪 ¡Bienvenido a FitZone! Demo visual');
}

function submitContact(e) {
  e.preventDefault();
  e.target.reset();
  showToast('✅ Mensaje enviado — te contactaremos pronto');
}

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('out'); setTimeout(() => toast.remove(), 400); }, 2500);
}

function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const part = document.createElement('div');
    part.className = 'part';
    part.style.left = Math.random() * 100 + '%';
    part.style.top = Math.random() * 100 + '%';
    part.style.animationDuration = (3 + Math.random() * 5) + 's';
    part.style.animationDelay = Math.random() * 5 + 's';
    part.style.width = part.style.height = (2 + Math.random() * 4) + 'px';
    part.style.background = `rgba(${Math.random() > .5 ? '34,197,94' : '251,146,60'},${.2 + Math.random() * .3})`;
    container.appendChild(part);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTyping();
  renderTestimonials();
  createParticles();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: .1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
