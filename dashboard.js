const logoutButton = document.querySelector('.button-primary');
if (logoutButton && logoutButton.textContent.includes('Admin')) {
  logoutButton.addEventListener('click', (event) => {
    event.preventDefault();
    sessionStorage.removeItem('homeconnect-auth');
    window.location.href = 'login.html';
  });
}

:]\async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return response.json();
}

async function loadDashboard() {
  try {
    const bookings = await fetchJSON('/api/bookings');
    const requestSummary = document.getElementById('requestSummary');
    const bookingTable = document.getElementById('bookingTable');

    if (!requestSummary || !bookingTable) return;

    const totalRequests = bookings.length;
    const services = bookings.reduce((map, booking) => {
      map[booking.service] = (map[booking.service] || 0) + 1;
      return map;
    }, {});

    const topService = Object.entries(services).sort((a, b) => b[1] - a[1])[0];

    requestSummary.innerHTML = `
      <strong>${totalRequests}</strong>
      <p>Total requests</p>
      <small>${topService ? `Top demand: ${topService[0]}` : 'No requests yet'}</small>
    `;

    bookingTable.innerHTML = bookings.length
      ? `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align:left; padding:10px; border-bottom:1px solid #dfe7e9;">Name</th>
              <th style="text-align:left; padding:10px; border-bottom:1px solid #dfe7e9;">Service</th>
              <th style="text-align:left; padding:10px; border-bottom:1px solid #dfe7e9;">Location</th>
              <th style="text-align:left; padding:10px; border-bottom:1px solid #dfe7e9;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${bookings
              .slice(0, 5)
              .map(
                (booking) => `
                  <tr>
                    <td style="padding:10px; border-bottom:1px solid #dfe7e9;">${booking.name}</td>
                    <td style="padding:10px; border-bottom:1px solid #dfe7e9;">${booking.service}</td>
                    <td style="padding:10px; border-bottom:1px solid #dfe7e9;">${booking.location}</td>
                    <td style="padding:10px; border-bottom:1px solid #dfe7e9;">${booking.date}</td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
      `
      : '<p>No recent bookings yet.</p>';
  } catch (error) {
    document.getElementById('requestSummary').innerHTML = 'Unable to load request data.';
  }
}

loadDashboard();
