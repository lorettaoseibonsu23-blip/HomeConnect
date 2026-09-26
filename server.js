const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'bookings.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/services.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/providers.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'providers.html'));
});

app.get('/tasks.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'tasks.html'));
});

app.get('/invoices.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'invoices.html'));
});

app.get('/wallet.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'wallet.html'));
});

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function readBookings() {
  ensureDataFile();
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeBookings(bookings) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf8');
}

function readInvoices() {
  const invoicePath = path.join(__dirname, 'invoices.json');
  try {
    const content = fs.readFileSync(invoicePath, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeInvoices(invoices) {
  const invoicePath = path.join(__dirname, 'invoices.json');
  fs.writeFileSync(invoicePath, JSON.stringify(invoices, null, 2), 'utf8');
}

function readWallet() {
  const walletPath = path.join(__dirname, 'wallet.json');
  try {
    if (!fs.existsSync(walletPath)) {
      const defaultWallet = {
        balance: 2500,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(walletPath, JSON.stringify(defaultWallet, null, 2), 'utf8');
      return defaultWallet;
    }

    const content = fs.readFileSync(walletPath, 'utf8');
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === 'object' ? parsed : { balance: 2500, currency: 'USD', lastUpdated: new Date().toISOString() };
  } catch (error) {
    return { balance: 2500, currency: 'USD', lastUpdated: new Date().toISOString() };
  }
}

function writeWallet(wallet) {
  const walletPath = path.join(__dirname, 'wallet.json');
  fs.writeFileSync(walletPath, JSON.stringify(wallet, null, 2), 'utf8');
}

function readQuotes() {
  const quotePath = path.join(__dirname, 'quotes.json');
  try {
    if (!fs.existsSync(quotePath)) {
      const defaultQuotes = [
        {
          id: 'Q-2041',
          customer: 'Daniel Okafor',
          service: 'House cleaning',
          amount: 980,
          status: 'pending',
          date: '2026-09-26',
          createdAt: new Date().toISOString()
        },
        {
          id: 'Q-2042',
          customer: 'Aisha Bello',
          service: 'Plumbing repair',
          amount: 1450,
          status: 'approved',
          date: '2026-09-26',
          createdAt: new Date().toISOString()
        }
      ];
      fs.writeFileSync(quotePath, JSON.stringify(defaultQuotes, null, 2), 'utf8');
      return defaultQuotes;
    }

    const content = fs.readFileSync(quotePath, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeQuotes(quotes) {
  const quotePath = path.join(__dirname, 'quotes.json');
  fs.writeFileSync(quotePath, JSON.stringify(quotes, null, 2), 'utf8');
}

app.get('/api/services', (req, res) => {
  res.json([
    {
      id: 'plumbing',
      name: 'Plumbing',
      description: 'Leak repairs, pipe replacement, bathroom installations, and emergency fixes.',
      category: 'repair',
      icon: '🔧'
    },
    {
      id: 'carpentry',
      name: 'Carpentry',
      description: 'Custom furniture, door fittings, cupboards, repair work, and wood restoration.',
      category: 'maintenance',
      icon: '🪵'
    },
    {
      id: 'masonry',
      name: 'Masonry',
      description: 'Wall construction, tiling, concrete repairs, and structural improvements.',
      category: 'repair',
      icon: '🧱'
    },
    {
      id: 'cleaning',
      name: 'Cleaning',
      description: 'Routine cleaning, deep sanitizing, kitchen detailing, and move-in refreshes.',
      category: 'care',
      icon: '🧼'
    },
    {
      id: 'laundry',
      name: 'Laundry',
      description: 'Wash, fold, ironing, stain removal, and tailored household apparel care.',
      category: 'care',
      icon: '🧺'
    },
    {
      id: 'security',
      name: 'Security',
      description: 'CCTV setup, alarm maintenance, access control, and home monitoring support.',
      category: 'security',
      icon: '🔒'
    },
    {
      id: 'electrical',
      name: 'Electrical',
      description: 'Wiring assistance, lighting upgrades, fan installation, and fault repair.',
      category: 'repair',
      icon: '💡'
    },
    {
      id: 'painting',
      name: 'Painting',
      description: 'Interior refreshes, exterior coating, wall prep, and color consultation.',
      category: 'maintenance',
      icon: '🎨'
    },
    {
      id: 'maintenance',
      name: 'General Maintenance',
      description: 'Routine upkeep, checks, and small home repairs to prevent bigger problems.',
      category: 'maintenance',
      icon: '🛠️'
    }
  ]);
});

app.get('/api/bookings', (req, res) => {
  const bookings = readBookings();
  res.json(bookings);
});

app.get('/api/providers', (req, res) => {
  const providers = JSON.parse(fs.readFileSync(path.join(__dirname, 'providers.json'), 'utf8'));
  res.json(providers);
});

app.get('/api/tasks', (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'tasks.json'), 'utf8'));
  res.json(tasks);
});

app.get('/api/invoices', (req, res) => {
  const invoices = readInvoices();
  res.json(invoices);
});

app.get('/api/wallet', (req, res) => {
  const wallet = readWallet();
  res.json(wallet);
});

app.post('/api/wallet/topup', (req, res) => {
  const { amount } = req.body || {};
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: 'Please provide a valid top-up amount.' });
  }

  const wallet = readWallet();
  wallet.balance = Number((wallet.balance + numericAmount).toFixed(2));
  wallet.lastUpdated = new Date().toISOString();
  writeWallet(wallet);

  return res.status(200).json({
    message: 'Wallet topped up successfully.',
    wallet
  });
});

app.get('/api/quotes', (req, res) => {
  const quotes = readQuotes();
  res.json(quotes);
});

app.post('/api/quotes/:id/approve', (req, res) => {
  const { id } = req.params;
  const quotes = readQuotes();
  const quote = quotes.find((entry) => String(entry.id) === String(id));

  if (!quote) {
    return res.status(404).json({ message: 'Quote not found.' });
  }

  if (quote.status === 'approved') {
    return res.status(200).json({
      message: 'Quote already approved.',
      quote
    });
  }

  quote.status = 'approved';
  quote.approvedAt = new Date().toISOString();
  writeQuotes(quotes);

  const invoices = readInvoices();
  const existingInvoice = invoices.find((entry) => String(entry.id) === String(id));

  if (!existingInvoice) {
    invoices.unshift({
      id: quote.id,
      client: quote.customer,
      service: quote.service,
      amount: quote.amount,
      status: 'Pending',
      date: quote.date || new Date().toISOString().slice(0, 10)
    });
  } else {
    existingInvoice.status = 'Pending';
    existingInvoice.amount = quote.amount;
    existingInvoice.service = quote.service;
    existingInvoice.client = quote.customer;
  }

  writeInvoices(invoices);

  return res.status(200).json({
    message: 'Quote approved successfully.',
    quote,
    invoice: invoices.find((entry) => String(entry.id) === String(id))
  });
});

app.post('/api/invoices/:id/pay', (req, res) => {
  const { id } = req.params;
  const { paymentMethod } = req.body || {};
  const invoices = readInvoices();
  const invoice = invoices.find((entry) => String(entry.id) === String(id));

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found.' });
  }

  if (invoice.status === 'Paid') {
    return res.status(200).json({
      message: 'Invoice already paid.',
      invoice
    });
  }

  const wallet = readWallet();

  if (wallet.balance < invoice.amount) {
    return res.status(400).json({
      message: 'Insufficient wallet balance. Top up your wallet to complete this payment.'
    });
  }

  wallet.balance = Number((wallet.balance - invoice.amount).toFixed(2));
  wallet.lastUpdated = new Date().toISOString();
  writeWallet(wallet);

  invoice.status = 'Paid';
  invoice.paidAt = new Date().toISOString();
  invoice.paymentMethod = paymentMethod || 'App wallet';

  writeInvoices(invoices);

  return res.status(200).json({
    message: 'Payment received successfully.',
    invoice,
    wallet
  });
});

app.post('/api/bookings', (req, res) => {
  const { name, phone, service, date, location, details } = req.body || {};

  if (!name || !phone || !service || !date || !location) {
    return res.status(400).json({ message: 'Please provide name, phone, service, date, and location.' });
  }

  const booking = {
    id: Date.now(),
    name,
    phone,
    service,
    date,
    location,
    details: details || '',
    createdAt: new Date().toISOString()
  };

  const bookings = readBookings();
  bookings.unshift(booking);
  writeBookings(bookings);

  return res.status(201).json({
    message: `Request received for ${service}.`,
    booking
  });
});

app.listen(PORT, () => {
  console.log(`HomeConnect app running on http://localhost:${PORT}`);
});
