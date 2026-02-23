const form = document.querySelector('.signup-form');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = new FormData(form).get('email');

    // TODO: Replace with real submission endpoint or Shopify customer API call.
    alert(`Thanks for joining the Kingbird club, ${email || 'friend'}!`);
    form.reset();
  });
}
