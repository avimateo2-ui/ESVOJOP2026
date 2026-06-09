document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form[action*="formsubmit"]');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(this).entries());
    data._captcha = false;
    data._template = 'table';

    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      const res = await fetch('https://formsubmit.co/ajax/avimateo2@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        showToast('¡Mensaje enviado con éxito! Te contactaremos pronto.');
        this.reset();
      } else {
        throw new Error();
      }
    } catch {
      this.target = '_blank';
      HTMLFormElement.prototype.submit.call(this);
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
});
