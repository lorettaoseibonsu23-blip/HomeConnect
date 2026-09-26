const checkoutForm = document.getElementById('checkoutForm');
const checkoutTotal = document.getElementById('checkoutTotal');
const amountInput = document.querySelector('input[name="amount"]');

if (amountInput && checkoutTotal) {
  amountInput.addEventListener('input', () => {
    const value = Number(amountInput.value || 0);
    checkoutTotal.textContent = `$${Number.isFinite(value) && value > 0 ? value.toFixed(2) : '0.00'}`;
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(checkoutForm);
    const payload = {
      customerName: formData.get('customerName'),
      email: formData.get('email'),
      service: formData.get('service'),
      amount: Number(formData.get('amount')),
      paymentMethod: formData.get('paymentMethod') || 'wallet',
      useWallet: formData.get('useWallet') === 'true',
      cardNumber: formData.get('cardNumber') || '',
      expiry: formData.get('expiry') || '',
      cvc: formData.get('cvc') || ''
    };

    const message = document.getElementById('checkoutMessage');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Checkout failed');
      }

      if (message) {
        message.textContent = `Payment successful for ${payload.service}. Invoice ${result.invoice.id} is now paid.`;
      }
      checkoutForm.reset();
      if (checkoutTotal) {
        checkoutTotal.textContent = '$0.00';
      }
    } catch (error) {
      if (message) {
        message.textContent = error.message;
      }
    }
  });
}
