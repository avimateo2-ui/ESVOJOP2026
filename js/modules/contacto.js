document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    try {
      const res = await fetch('https://formsubmit.co/ajax/jorpeflo@gmail.com', {
        method: 'POST',
        body: new FormData(this)
      });
      if (res.ok) {
        showToast('¡Formulario enviado con éxito! Te contactaremos pronto.');
        this.reset();
      } else {
        showToast('Error al enviar. Intenta de nuevo.');
      }
    } catch {
      showToast('Error de conexión. Verifica tu internet.');
    }
    btn.disabled = false;
    btn.textContent = 'Enviar Mensaje';
  });
});
