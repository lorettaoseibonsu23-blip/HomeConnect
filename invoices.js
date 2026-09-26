async function payInvoice(invoiceId) {
  try {
    const response = await fetch(`/api/invoices/${invoiceId}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentMethod: 'App wallet' })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Payment failed');
    }

    await loadWallet();
    await loadQuotes();
    await loadInvoices();
    return result;
  } catch (error) {
    window.alert(error.message);
    return null;
  }
}

async function loadWallet() {
  const walletBalance = document.getElementById('walletBalance');
  const pendingQuoteCount = document.getElementById('pendingQuoteCount');
  const walletStatus = document.getElementById('walletStatus');

  if (!walletBalance || !pendingQuoteCount || !walletStatus) return;

  try {
    const response = await fetch('/api/wallet');
    if (!response.ok) throw new Error('Unable to load wallet');
    const wallet = await response.json();
    const quotesResponse = await fetch('/api/quotes');
    const quotes = quotesResponse.ok ? await quotesResponse.json() : [];
    const pendingQuotes = quotes.filter((quote) => quote.status === 'pending');

    walletBalance.textContent = `$${Number(wallet.balance || 0).toLocaleString()}`;
    pendingQuoteCount.textContent = String(pendingQuotes.length);
    walletStatus.textContent = wallet.balance > 0 ? 'Ready' : 'Low balance';
  } catch (error) {
    walletBalance.textContent = '$0';
    pendingQuoteCount.textContent = '0';
    walletStatus.textContent = 'Unavailable';
  }
}

async function approveQuote(quoteId) {
  try {
    const response = await fetch(`/api/quotes/${quoteId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Approval failed');
    }

    await loadWallet();
    await loadQuotes();
    await loadInvoices();
    return result;
  } catch (error) {
    window.alert(error.message);
    return null;
  }
}

async function loadQuotes() {
  const quoteTableWrap = document.getElementById('quoteTableWrap');
  if (!quoteTableWrap) return;

  try {
    const response = await fetch('/api/quotes');
    if (!response.ok) throw new Error('Unable to load quotes');
    const quotes = await response.json();

    quoteTableWrap.innerHTML = `
      <table class="quote-table">
        <thead>
          <tr>
            <th>Quote</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${quotes
            .map(
              (quote) => `
                <tr>
                  <td>${quote.id}</td>
                  <td>${quote.customer}</td>
                  <td>${quote.service}</td>
                  <td>$${Number(quote.amount).toLocaleString()}</td>
                  <td>${quote.status === 'pending' ? 'Pending approval' : 'Approved'}</td>
                  <td>
                    <button
                      class="quote-button"
                      data-quote-id="${quote.id}"
                      ${quote.status === 'approved' ? 'disabled' : ''}
                      type="button"
                    >
                      ${quote.status === 'approved' ? 'Approved' : 'Approve quote'}
                    </button>
                  </td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    `;

    const approveButtons = document.querySelectorAll('.quote-button');
    approveButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const quoteId = button.dataset.quoteId;
        if (quoteId) {
          await approveQuote(quoteId);
        }
      });
    });
  } catch (error) {
    quoteTableWrap.innerHTML = '<p>Unable to load quote requests.</p>';
  }
}

async function loadInvoices() {
  const invoiceTableWrap = document.getElementById('invoiceTableWrap');
  if (!invoiceTableWrap) return;

  try {
    const response = await fetch('/api/invoices');
    if (!response.ok) throw new Error('Unable to load invoices');
    const invoices = await response.json();

    invoiceTableWrap.innerHTML = `
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Client</th>
            <th>Service</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${invoices
            .map(
              (invoice) => `
                <tr>
                  <td>${invoice.id}</td>
                  <td>${invoice.client}</td>
                  <td>${invoice.service}</td>
                  <td>$${invoice.amount.toLocaleString()}</td>
                  <td><span class="invoice-status ${invoice.status.toLowerCase()}">${invoice.status}</span></td>
                  <td>${invoice.date}</td>
                  <td>
                    <button
                      class="pay-button"
                      data-invoice-id="${invoice.id}"
                      ${invoice.status === 'Paid' ? 'disabled' : ''}
                      type="button"
                    >
                      ${invoice.status === 'Paid' ? 'Paid' : 'Pay now'}
                    </button>
                  </td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    `;

    const payButtons = document.querySelectorAll('.pay-button');
    payButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const invoiceId = button.dataset.invoiceId;
        if (invoiceId) {
          await payInvoice(invoiceId);
        }
      });
    });
  } catch (error) {
    invoiceTableWrap.innerHTML = '<p>Unable to load invoice records.</p>';
  }
}

loadWallet();
loadQuotes();
loadInvoices();
