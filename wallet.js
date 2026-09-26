async function loadWallet() {
  const walletBalance = document.getElementById('walletBalance');
  const walletCurrency = document.getElementById('walletCurrency');
  const walletUpdated = document.getElementById('walletUpdated');
  const walletStatus = document.getElementById('walletStatus');

  if (!walletBalance || !walletCurrency || !walletUpdated || !walletStatus) return;

  try {
    const response = await fetch('/api/wallet');
    if (!response.ok) throw new Error('Unable to load wallet');
    const wallet = await response.json();

    walletBalance.textContent = `$${Number(wallet.balance || 0).toLocaleString()}`;
    walletCurrency.textContent = wallet.currency || 'USD';
    walletUpdated.textContent = wallet.lastUpdated ? new Date(wallet.lastUpdated).toLocaleDateString() : '--';
    walletStatus.textContent = Number(wallet.balance || 0) > 0 ? 'Ready' : 'Low balance';
  } catch (error) {
    walletBalance.textContent = '$0';
    walletCurrency.textContent = 'USD';
    walletUpdated.textContent = '--';
    walletStatus.textContent = 'Unavailable';
  }
}

async function handleTopUp(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const amountInput = document.getElementById('topupAmount');
  const message = document.getElementById('topupMessage');

  if (!amountInput || !message) return;

  const amount = Number(amountInput.value);

  if (!Number.isFinite(amount) || amount <= 0) {
    message.textContent = 'Please enter a valid amount greater than zero.';
    return;
  }

  try {
    const response = await fetch('/api/wallet/topup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Top-up failed');
    }

    message.textContent = `Wallet topped up successfully by $${amount.toLocaleString()}.`;
    form.reset();
    await loadWallet();
  } catch (error) {
    message.textContent = error.message;
  }
}

const topupForm = document.getElementById('topupForm');
if (topupForm) {
  topupForm.addEventListener('submit', handleTopUp);
}

loadWallet();
