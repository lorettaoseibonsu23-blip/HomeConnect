const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = (formData.get('username') || '').toString().trim();
    const password = (formData.get('password') || '').toString();

    if (username === 'admin' && password === 'homeconnect123') {
      sessionStorage.setItem('homeconnect-auth', 'true');
      window.location.href = 'dashboard.html';
      return;
    }

    loginMessage.textContent = 'Invalid username or password.';
  });
}

const isAuthenticated = sessionStorage.getItem('homeconnect-auth') === 'true';
if (window.location.pathname.endsWith('dashboard.html') && !isAuthenticated) {
  window.location.href = 'login.html';
}
