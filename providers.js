async function bookProvider(providerId) {
  const customerName = window.prompt('Enter your name for the booking:');
  if (!customerName) return;

  const service = window.prompt('What service do you need from this provider?');
  if (!service) return;

  const date = window.prompt('Enter the preferred date (YYYY-MM-DD):');
  if (!date) return;

  try {
    const response = await fetch(`/api/providers/${providerId}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerName,
        service,
        date,
        note: 'Booked via HomeConnect app'
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Booking failed');
    }

    window.alert(`Booking made with ${result.booking.providerName} for ${result.booking.service}.`);
  } catch (error) {
    window.alert(error.message);
  }
}

async function loadProviders() {
  const providerGrid = document.getElementById('providerGrid');
  if (!providerGrid) return;

  try {
    const response = await fetch('/api/providers');
    if (!response.ok) throw new Error('Failed to load providers');
    const providers = await response.json();

    providerGrid.innerHTML = providers
      .map(
        (provider) => `
          <article class="provider-card">
            <div class="provider-head">
              <h3>${provider.name}</h3>
              <span class="status-pill">${provider.availability}</span>
            </div>
            <p class="meta-line"><strong>${provider.role}</strong></p>
            <p class="meta-line">📍 ${provider.location}</p>
            <p class="meta-line">⭐ ${provider.rating} rating</p>
            <button class="button button-primary" data-provider-id="${provider.id}" type="button">Book this provider</button>
          </article>
        `
      )
      .join('');

    const bookingButtons = document.querySelectorAll('[data-provider-id]');
    bookingButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const providerId = button.getAttribute('data-provider-id');
        if (providerId) {
          bookProvider(providerId);
        }
      });
    });
  } catch (error) {
    providerGrid.innerHTML = '<p>Unable to load provider data.</p>';
  }
}

loadProviders();
