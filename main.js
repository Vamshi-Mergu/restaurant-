// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuToggle.textContent = nav.classList.contains('open') ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.textContent = '☰';
  }));
}

// Smooth reveal-on-scroll animation
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Gallery lightbox
const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImage.src = item.querySelector('img').src;
      lightboxImage.alt = item.querySelector('img').alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });
  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  };
  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// Reservation form: prepares an email; connect a backend to store real bookings.
const bookingForm = document.querySelector('#bookingForm');
if (bookingForm) {
  const dateInput = bookingForm.querySelector('input[name="date"]');
  const today = new Date();
  dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const data = Object.fromEntries(new FormData(bookingForm).entries());
    const subject = encodeURIComponent('Table reservation request — ' + data.name);
    const body = encodeURIComponent(
      `Name: ${data.name}\\nPhone: ${data.phone}\\nDate: ${data.date}\\nTime: ${data.time}\\nGuests: ${data.guests}\\nMessage: ${data.message || 'None'}`
    );
    document.querySelector('.form-success').textContent = 'Your email app will open with the reservation details. Please send the email to complete your request.';
    window.location.href = `mailto:hello@saffrontable.example?subject=${subject}&body=${body}`;
  });
}
