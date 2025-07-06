import { useState } from 'react';

// Example 1: Creating a Global Payment Link
const CreateGlobalPaymentLinkExample = () => {
  const [linkId, setLinkId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCreateGlobalLink = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Create a global payment link with ID: ${linkId}`,
          requiresPrivateKey: true,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error creating global payment link:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={linkId}
        onChange={(e) => setLinkId(e.target.value)}
        placeholder="Enter link ID"
      />
      <button onClick={handleCreateGlobalLink} disabled={loading}>
        {loading ? 'Creating...' : 'Create Global Payment Link'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

// Example 2: Creating and Paying a Fixed Payment Link
const FixedPaymentLinkExample = () => {
  const [linkId, setLinkId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCreateFixedLink = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Create a fixed payment link with ID: ${linkId} and amount: ${amount} XFI`,
          requiresPrivateKey: true,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error creating fixed payment link:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayFixedLink = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Pay the fixed payment link with ID: ${linkId}`,
          requiresPrivateKey: true,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error paying fixed payment link:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={linkId}
        onChange={(e) => setLinkId(e.target.value)}
        placeholder="Enter link ID"
      />
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in XFI"
      />
      <button onClick={handleCreateFixedLink} disabled={loading}>
        {loading ? 'Creating...' : 'Create Fixed Payment Link'}
      </button>
      <button onClick={handlePayFixedLink} disabled={loading}>
        {loading ? 'Paying...' : 'Pay Fixed Payment Link'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

// Example 3: Creating and Paying an Invoice
const InvoiceExample = () => {
  const [invoiceId, setInvoiceId] = useState('');
  const [productId, setProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCreateInvoice = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Create an invoice with ID: ${invoiceId}, product ID: ${productId}, and amount: ${amount} XFI`,
          requiresPrivateKey: true,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayInvoice = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Pay the invoice with ID: ${invoiceId}`,
          requiresPrivateKey: true,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error paying invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={invoiceId}
        onChange={(e) => setInvoiceId(e.target.value)}
        placeholder="Enter invoice ID"
      />
      <input
        type="text"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        placeholder="Enter product ID"
      />
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in XFI"
      />
      <button onClick={handleCreateInvoice} disabled={loading}>
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
      <button onClick={handlePayInvoice} disabled={loading}>
        {loading ? 'Paying...' : 'Pay Invoice'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

// Example 4: Checking Link Status and Balance
const StatusCheckExample = () => {
  const [id, setId] = useState('');
  const [type, setType] = useState<'global' | 'fixed' | 'invoice'>('global');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheckStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Check the status of ${type} with ID: ${id}`,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Enter ID"
      />
      <select value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="global">Global Payment Link</option>
        <option value="fixed">Fixed Payment Link</option>
        <option value="invoice">Invoice</option>
      </select>
      <button onClick={handleCheckStatus} disabled={loading}>
        {loading ? 'Checking...' : 'Check Status'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

// Example 5: Contributing to a Global Payment Link
const ContributeExample = () => {
  const [linkId, setLinkId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleContribute = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Contribute ${amount} XFI to global payment link with ID: ${linkId}`,
          requiresPrivateKey: true,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error contributing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={linkId}
        onChange={(e) => setLinkId(e.target.value)}
        placeholder="Enter link ID"
      />
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in XFI"
      />
      <button onClick={handleContribute} disabled={loading}>
        {loading ? 'Contributing...' : 'Contribute'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export {
  CreateGlobalPaymentLinkExample,
  FixedPaymentLinkExample,
  InvoiceExample,
  StatusCheckExample,
  ContributeExample,
}; 