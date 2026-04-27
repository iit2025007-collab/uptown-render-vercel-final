const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf-8');

// 1. Add page state
code = code.replace(
  "const [cartOpen, setCartOpen] = useState(false);",
  "const [cartOpen, setCartOpen] = useState(false);\n  const [page, setPage] = useState('feed');"
);

// 2. Wrap main feed and add checkout page
code = code.replace(
  "<main>",
  "{page === 'feed' && (\n      <main>"
);
code = code.replace(
  "</main>",
  "</main>\n      )}\n      {page === 'checkout' && <CheckoutPage items={cartItems} setItems={setCartItems} user={user} setPage={setPage} />}"
);

// 3. Update CartDrawer call
code = code.replace(
  "user={user} />}",
  "user={user} setPage={setPage} />}"
);

// 4. Replace CartDrawer and add CheckoutPage
const cartDrawerStart = code.indexOf('function CartDrawer');
const accountDrawerStart = code.indexOf('function AccountDrawer');
const beforeCart = code.slice(0, cartDrawerStart);
const afterCart = code.slice(accountDrawerStart);

const newCartAndCheckout = `
function CartDrawer({ onClose, items, setItems, user, setPage }) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);

  async function saveCart(next) {
    setItems(next);
    await api('/cart', { method: 'PUT', body: JSON.stringify({ items: next }) });
  }

  function proceed() {
    onClose();
    setPage('checkout');
  }

  return <div className="sideOverlay"><aside className="drawer"><button className="close" onClick={onClose}><X size={18}/></button><h2>Your bag</h2>{items.length === 0 && <p className="muted">Your bag is empty.</p>}{items.map((item, idx) => <div className="bagItem" key={\`\${item.key}-\${idx}\`}><img src={item.image} alt={item.title}/><div><strong>{item.brand}</strong><p>{item.title}</p><span>{item.size} · {item.color}</span><div className="row"><b>{money(item.price)}</b><div className="qtyBox mini"><button onClick={() => saveCart(items.map((x, i) => i === idx ? { ...x, qty: Math.max(1, Number(x.qty || 1) - 1) } : x))}>-</button><span>{item.qty}</span><button onClick={() => saveCart(items.map((x, i) => i === idx ? { ...x, qty: Number(x.qty || 1) + 1 } : x))}>+</button></div></div><button className="textOnly" onClick={() => saveCart(items.filter((_, i) => i !== idx))}>Remove</button></div></div>)}<div className="checkoutBox"><div className="bill"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><button className="primary full" onClick={proceed} disabled={items.length === 0}>Proceed to checkout</button></div></aside></div>;
}

function CheckoutPage({ items, setItems, user, setPage }) {
  const [address, setAddress] = useState({ name: user?.name || '', phone: '', line1: '', city: '', pincode: '' });
  const [message, setMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPct, setDiscountPct] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);
  const discountAmount = Math.floor(subtotal * discountPct);
  const total = subtotal - discountAmount;
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  function loadRazorpay() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function checkout() {
    setMessage('');
    if (!items.length) return setMessage('Your bag is empty.');
    if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) return setMessage('Please fill delivery details.');
    const created = await api('/payments/create-order', { method: 'POST', body: JSON.stringify({ address, coupon: discountPct > 0 ? couponCode : '' }) });

    if (created.demo || !keyId) {
      const data = await api('/payments/verify', { method: 'POST', body: JSON.stringify({ demo: true, paymentId: created.order.id, address }) });
      setItems([]);
      setMessage(\`Order placed: \${data.order.id}. Redirecting...\`);
      setTimeout(() => setPage('feed'), 2000);
      return;
    }

    const loaded = await loadRazorpay();
    if (!loaded) return setMessage('Razorpay could not load. Check internet connection.');
    const options = {
      key: keyId,
      amount: created.order.amount,
      currency: created.order.currency,
      name: 'Uptown',
      description: 'Fashion order payment',
      order_id: created.order.id,
      prefill: { name: user?.name, email: user?.email, contact: address.phone },
      handler: async function (response) {
        const data = await api('/payments/verify', { method: 'POST', body: JSON.stringify({ ...response, address }) });
        setItems([]);
        setMessage(\`Order placed: \${data.order.id}. Redirecting...\`);
        setTimeout(() => setPage('feed'), 2000);
      },
      theme: { color: '#2b1d18' }
    };
    new window.Razorpay(options).open();
  }

  function applyCoupon() {
    if (couponCode.toUpperCase() === 'WELCOME20') {
      setDiscountPct(0.2);
      setMessage('Coupon applied! 20% off.');
    } else {
      setDiscountPct(0);
      setMessage('Invalid coupon code.');
    }
  }

  if (items.length === 0 && !message.includes('Order placed')) {
    return <main className="checkoutPage" style={{ padding: '60px 5%', textAlign: 'center' }}>
      <h2>Your bag is empty</h2>
      <button className="primary" onClick={() => setPage('feed')} style={{ marginTop: '20px' }}>Back to shopping</button>
    </main>;
  }

  return (
    <main className="checkoutPage" style={{ padding: '40px 5%', maxWidth: '1000px', margin: '0 auto' }}>
      <button className="textOnly" onClick={() => setPage('feed')} style={{ marginBottom: '20px' }}>&larr; Back to shopping</button>
      <h2>Secure Checkout</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }}>
        <div className="checkoutForm">
          <h3>Delivery details</h3>
          {['name','phone','line1','city','pincode'].map((field) => <input key={field} placeholder={field === 'line1' ? 'Address line' : field[0].toUpperCase() + field.slice(1)} value={address[field]} onChange={(e) => setAddress({ ...address, [field]: e.target.value })} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd' }} />)}
        </div>
        <div className="checkoutSummary" style={{ background: '#f9f9f9', padding: '30px', borderRadius: '12px' }}>
          <h3>Order Summary</h3>
          <div style={{ margin: '20px 0', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
            {items.map(i => <div key={i.key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>{i.qty}x {i.title}</span>
              <span>{money(i.price * i.qty)}</span>
            </div>)}
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input placeholder="Promo code (try WELCOME20)" value={couponCode} onChange={e => setCouponCode(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <button className="secondary" onClick={applyCoupon}>Apply</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span>Subtotal</span><span>{money(subtotal)}</span></div>
          {discountPct > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'green' }}><span>Discount (20%)</span><span>-{money(discountAmount)}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd', fontSize: '1.2em', fontWeight: 'bold' }}><span>Total</span><span>{money(total)}</span></div>
          
          <button className="primary full" onClick={checkout} style={{ marginTop: '30px', padding: '15px', fontSize: '1.1em' }}>Pay Securely</button>
          {message && <p className="notice" style={{ marginTop: '15px', color: message.includes('Order placed') ? 'green' : 'red' }}>{message}</p>}
        </div>
      </div>
    </main>
  );
}

`;

fs.writeFileSync('frontend/src/App.jsx', beforeCart + newCartAndCheckout + afterCart);
console.log('Done rewriting App.jsx');
