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
          </article>
        `
      )
      .join('');
  } catch (error) {
    providerGrid.innerHTML = '<p>Unable to load provider data.</p>';
  }
}

loadProviders();
