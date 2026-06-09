document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const data = Object.fromEntries(new FormData(this).entries());

    try {
      const res = await fetch('https://formsubmit.co/ajax/avimateo2@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        showToast('¡Formulario enviado con éxito! Te contactaremos pronto.');
        this.reset();
      } else {
        this.submit();
      }
    } catch {
      this.submit();
    }
  });
});
