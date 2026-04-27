import { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Heart, Search, ShoppingBag, UserRound, Star, Truck, ShieldCheck, RotateCcw, X, Plus, Minus, Clock, Camera, LogOut } from 'lucide-react';
import { api, compactDate, getToken, money, setToken } from './api.js';

const googleReady = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

function App() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('All');
  const [segment, setSegment] = useState('');
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState('feed');
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [feedError, setFeedError] = useState('');
  const loadMoreRef = useRef(null);
  const loadingRef = useRef(false);

  async function refreshUserData() {
    if (!getToken()) return;
    try {
      const [me, cart, wish] = await Promise.all([api('/me'), api('/cart'), api('/wishlist')]);
      setUser(me.user);
      setCartItems(cart.items || []);
      setWishlist(wish.items || []);
    } catch {
      setToken('');
      setUser(null);
      setCartItems([]);
      setWishlist([]);
    }
  }

  useEffect(() => {
    api('/products/categories').then((data) => setCategories(data.categories || [])).catch(() => {});
    refreshUserData();
  }, []);

  async function loadProducts(reset = false) {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      setFeedError('');
      const start = reset ? 0 : cursor;
      const params = new URLSearchParams({ cursor: String(start), limit: '24', category, segment, q: activeQuery });
      const data = await api(`/products?${params.toString()}`);
      setProducts((prev) => reset ? data.items : [...prev, ...data.items]);
      setCursor(data.nextCursor || start + 24);
    } catch (err) {
      setFeedError(err.message || 'Could not load products right now.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }

  useEffect(() => {
    setCursor(0);
    setProducts([]);
    loadProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, segment, activeQuery]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadProducts(false);
    }, { rootMargin: '500px' });
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, category, segment, activeQuery]);

  const allSegments = useMemo(() => {
    const current = categories.find((c) => c.name === category);
    return current?.segments || [];
  }, [categories, category]);

  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.qty || 1), 0);

  async function submitSearch(e) {
    e.preventDefault();
    const text = query.trim();
    setActiveQuery(text);
    if (text && user) await api('/history/search', { method: 'POST', body: JSON.stringify({ query: text }) }).catch(() => {});
  }

  async function openProduct(product) {
    setSelectedProductId(product.id);
    if (user) await api('/history/views', { method: 'POST', body: JSON.stringify({ product }) }).catch(() => {});
  }

  function logout() {
    setToken('');
    setUser(null);
    setCartItems([]);
    setWishlist([]);
  }

  return (
    <div>
      <header className="topbar">
        <div className="brand" onClick={() => { setCategory('All'); setSegment(''); setActiveQuery(''); setQuery(''); }}>Uptown</div>
        <nav className="navLinks">
          <button className={category === 'All' ? 'active' : ''} onClick={() => { setCategory('All'); setSegment(''); }}>New In</button>
          {categories.map((cat) => <button key={cat.name} className={category === cat.name ? 'active' : ''} onClick={() => { setCategory(cat.name); setSegment(''); }}>{cat.name}</button>)}
        </nav>
        <form className="searchBox" onSubmit={submitSearch}>
          <Search size={18} />
          <input placeholder="Search dresses, sneakers, bags" value={query} onChange={(e) => setQuery(e.target.value)} />
        </form>
        <div className="actions">
          {user ? <button className="iconButton" onClick={() => setAccountOpen(true)}><UserRound size={19} /><span>{user.name?.split(' ')[0]}</span></button> : <button className="linkButton" onClick={() => { setAuthMode('login'); setAuthOpen(true); }}>Login</button>}
          {!user && <button className="solidSmall" onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}>Sign up</button>}
          <button className="iconButton" onClick={() => user ? setAccountOpen(true) : setAuthOpen(true)}><Heart size={19} /><span>{wishlist.length}</span></button>
          <button className="bagButton" onClick={() => user ? setCartOpen(true) : setAuthOpen(true)}><ShoppingBag size={19} /><span>{cartCount}</span></button>
        </div>
      </header>

      {page === 'feed' && (
      <main>
        <section className="hero">
          <div className="heroText">
            <p className="eyebrow">Fresh drops • easy checkout • saved history</p>
            <h1>Style that feels picked by a real person.</h1>
            <p className="heroCopy">Browse clothing, shoes, bags, accessories and beauty in a clean endless feed. Save your favourites, keep your bag synced, and checkout securely.</p>
            <div className="heroButtons">
              <button onClick={() => document.getElementById('shop-grid')?.scrollIntoView({ behavior: 'smooth' })}>Start shopping</button>
              <button className="ghost" onClick={() => { setCategory('Clothing'); setSegment('Dresses'); }}>See dresses</button>
            </div>
          </div>
          <div className="marqueeContainer">
            <div className="marqueeContent">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop" alt="Fashion editorial" />
              <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=900&auto=format&fit=crop" alt="Sneakers" />
              <img src="https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=900&auto=format&fit=crop" alt="Clothes on rack" />
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop" alt="Fashion model" />
              <img src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=900&auto=format&fit=crop" alt="Clothes" />
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop" alt="Fashion editorial" />
              <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=900&auto=format&fit=crop" alt="Sneakers" />
              <img src="https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=900&auto=format&fit=crop" alt="Clothes on rack" />
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop" alt="Fashion model" />
              <img src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=900&auto=format&fit=crop" alt="Clothes" />
            </div>
          </div>
        </section>

        <section className="categoryStrip">
          <button className={segment === '' ? 'selected' : ''} onClick={() => setSegment('')}>All {category === 'All' ? 'departments' : category}</button>
          {allSegments.map((s) => <button key={s} className={segment === s ? 'selected' : ''} onClick={() => setSegment(s)}>{s}</button>)}
        </section>

        <section className="sectionHead" id="shop-grid">
          <div>
            <p className="eyebrow">Shop</p>
            <h2>{activeQuery ? `Results for “${activeQuery}”` : category === 'All' ? 'Latest arrivals' : category}</h2>
          </div>
          <p>{products.length} styles loaded</p>
        </section>

        <section className="productGrid">
          {products.map((product) => (
            <ProductCard key={`${product.id}-${product.image}`} product={product} onOpen={() => openProduct(product)} wishlist={wishlist} onWishlist={async () => {
              if (!user) return setAuthOpen(true);
              const data = await api('/wishlist', { method: 'POST', body: JSON.stringify({ product }) });
              setWishlist(data.items || []);
            }} />
          ))}
        </section>
        {feedError && <p className="notice">{feedError}</p>}
        <div ref={loadMoreRef} className="loader">{loading ? 'Loading more styles…' : 'Scroll for more'}</div>
      </main>
      )}
      {page === 'checkout' && <CheckoutPage items={cartItems} setItems={setCartItems} user={user} setPage={setPage} />}

      {authOpen && <AuthModal mode={authMode} setMode={setAuthMode} onClose={() => setAuthOpen(false)} onDone={(auth) => { setToken(auth.token); setUser(auth.user); setAuthOpen(false); refreshUserData(); }} />}
      {selectedProductId && <ProductDetail id={selectedProductId} onClose={() => setSelectedProductId(null)} onOpenProduct={(p) => openProduct(p)} user={user} requireLogin={() => setAuthOpen(true)} refreshUserData={refreshUserData} wishlist={wishlist} setWishlist={setWishlist} />}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} items={cartItems} setItems={setCartItems} user={user} setPage={setPage} />}
      {accountOpen && <AccountDrawer onClose={() => setAccountOpen(false)} user={user} logout={logout} />}
    </div>
  );
}

function ProductCard({ product, onOpen, wishlist, onWishlist }) {
  const saved = wishlist.some((item) => item.id === product.id);
  return (
    <article className="productCard">
      <button className={`heartBtn ${saved ? 'saved' : ''}`} onClick={(e) => { e.stopPropagation(); onWishlist(); }}><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button>
      <div className="productImage" onClick={onOpen}><img src={product.image} alt={product.title} loading="lazy" /></div>
      <div className="productInfo" onClick={onOpen}>
        <div className="row"><strong>{product.brand}</strong><span className="rating"><Star size={13} fill="currentColor" /> {product.rating}</span></div>
        <p>{product.title}</p>
        <div className="price"><span>{money(product.price)}</span><del>{money(product.mrp)}</del><em>{product.discount}% off</em></div>
      </div>
    </article>
  );
}

function AuthModal({ mode, setMode, onClose, onDone }) {
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function start(e) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const data = await api('/auth/start', { method: 'POST', body: JSON.stringify({ ...form, mode }) });
      if (data.token) {
        onDone(data);
      } else {
        setMessage(data.message || 'Check your email for the code.');
        setStep('otp');
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const data = await api('/auth/verify', { method: 'POST', body: JSON.stringify({ email: form.email, otp: form.otp }) });
      onDone(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function googleLogin(credential) {
    setBusy(true);
    setMessage('');
    try {
      const data = await api('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) });
      onDone(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overlay">
      <div className="authModal">
        <button className="close" onClick={onClose}><X size={18} /></button>
        <div className="authTabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setStep('form'); }}>Login</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setStep('form'); }}>Sign up</button>
        </div>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="muted">We send a one-time code to your email every time you continue.</p>

        {step === 'form' ? (
          <form onSubmit={start} className="authForm">
            {mode === 'signup' && <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
            <input placeholder="Email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button disabled={busy}>{busy ? 'Please wait…' : 'Email my code'}</button>
          </form>
        ) : (
          <form onSubmit={verify} className="authForm">
            <input placeholder="6-digit OTP" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} />
            <button disabled={busy}>{busy ? 'Checking…' : 'Verify and continue'}</button>
            <button type="button" className="textOnly" onClick={() => setStep('form')}>Use another email</button>
          </form>
        )}

        {googleReady && (
          <div className="googleBox">
            <div className="divider"><span>or</span></div>
            <GoogleLogin onSuccess={(res) => googleLogin(res.credential)} onError={() => setMessage('Google login failed.')} width="100%" />
          </div>
        )}
        {message && <p className="notice">{message}</p>}
      </div>
    </div>
  );
}

function ProductDetail({ id, onClose, onOpenProduct, user, requireLogin, refreshUserData, wishlist, setWishlist }) {
  const [data, setData] = useState(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, title: '', text: '', photo: '' });

  useEffect(() => {
    api(`/products/${id}`).then((res) => {
      setData(res);
      setColorIndex(0);
      setImageIndex(0);
      setSize(res.product.sizes?.[0] || 'One Size');
    });
  }, [id]);

  if (!data) return <div className="overlay"><div className="panel loadingPanel">Opening style…</div></div>;
  const { product, related, reviews } = data;
  const color = product.colors[colorIndex];
  const currentImage = color.images[imageIndex];
  const saved = wishlist.some((item) => item.id === product.id);

  const bagItem = {
    key: `${product.id}-${size}-${color.name}`,
    id: product.id,
    title: product.title,
    brand: product.brand,
    price: product.price,
    mrp: product.mrp,
    image: currentImage,
    size,
    color: color.name,
    qty
  };

  async function addToBag() {
    if (!user) return requireLogin();
    await api('/cart', { method: 'POST', body: JSON.stringify({ item: bagItem }) });
    refreshUserData();
  }

  async function toggleWishlist() {
    if (!user) return requireLogin();
    const data = await api('/wishlist', { method: 'POST', body: JSON.stringify({ product: { ...product, image: currentImage } }) });
    setWishlist(data.items || []);
  }

  async function submitReview(e) {
    e.preventDefault();
    if (!user) return requireLogin();
    await api('/reviews', { method: 'POST', body: JSON.stringify({ ...review, productKey: product.baseKey }) });
    const fresh = await api(`/products/${id}`);
    setData(fresh);
    setReview({ rating: 5, title: '', text: '', photo: '' });
  }

  function pickPhoto(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReview((r) => ({ ...r, photo: reader.result }));
    reader.readAsDataURL(file);
  }

  return (
    <div className="overlay productOverlay">
      <div className="detailPanel">
        <button className="close" onClick={onClose}><X size={18} /></button>
        <div className="detailGrid">
          <div className="gallery">
            <div className="thumbs">{color.images.map((img, idx) => <button key={img} className={idx === imageIndex ? 'active' : ''} onClick={() => setImageIndex(idx)}><img src={img} alt={`${product.title} angle ${idx + 1}`} /></button>)}</div>
            <img className="mainImage" src={currentImage} alt={product.title} />
          </div>
          <div className="detailInfo">
            <p className="eyebrow">{product.category} • {product.segment}</p>
            <h2>{product.brand}</h2>
            <h1>{product.title}</h1>
            <p className="detailDesc">{product.description}</p>
            <div className="detailRating"><Star size={15} fill="currentColor" /> {product.rating} · {product.ratingCount} ratings</div>
            <div className="detailPrice"><strong>{money(product.price)}</strong><del>{money(product.mrp)}</del><span>{product.discount}% off</span></div>
            <p className="tax">MRP inclusive of all taxes</p>

            <div className="picker">
              <div className="pickerHead"><strong>Colour</strong><span>{color.name}</span></div>
              <div className="swatches">{product.colors.map((c, idx) => <button key={c.name} className={idx === colorIndex ? 'active' : ''} style={{ background: c.hex }} onClick={() => { setColorIndex(idx); setImageIndex(0); }} title={c.name}></button>)}</div>
            </div>

            <div className="picker">
              <div className="pickerHead"><strong>Size</strong><span>Size guide</span></div>
              <div className="sizes">{product.sizes.map((s) => <button key={s} className={size === s ? 'active' : ''} onClick={() => setSize(s)}>{s}</button>)}</div>
            </div>

            <div className="qtyBox"><button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={14}/></button><span>{qty}</span><button onClick={() => setQty(qty + 1)}><Plus size={14}/></button></div>
            <div className="buyButtons"><button className="primary" onClick={addToBag}>Add to bag</button><button className="secondary" onClick={toggleWishlist}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Wishlist'}</button></div>

            <div className="serviceGrid">
              <div><Truck size={18}/><strong>Delivery</strong><span>{product.shipping}</span></div>
              <div><RotateCcw size={18}/><strong>Returns</strong><span>Easy return and exchange on eligible items.</span></div>
              <div><ShieldCheck size={18}/><strong>Seller</strong><span>{product.seller}</span></div>
            </div>

            <div className="detailsBlock">
              <h3>Product details</h3>
              <ul>{product.details.map((d) => <li key={d}>{d}</li>)}</ul>
              <h3>Terms and conditions</h3>
              <p>{product.terms}</p>
            </div>
          </div>
        </div>

        <section className="reviewSection">
          <div className="sectionHead small"><div><p className="eyebrow">Reviews</p><h2>Customer notes</h2></div></div>
          <div className="reviewsGrid">
            <form className="reviewForm" onSubmit={submitReview}>
              <label>Rating</label>
              <select value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>{[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} stars</option>)}</select>
              <input placeholder="Short title" value={review.title} onChange={(e) => setReview({ ...review, title: e.target.value })} />
              <textarea placeholder="How did it fit? How was the quality?" value={review.text} onChange={(e) => setReview({ ...review, text: e.target.value })} />
              <label className="photoUpload"><Camera size={17}/> Upload your photo<input type="file" accept="image/*" onChange={(e) => pickPhoto(e.target.files?.[0])} /></label>
              {review.photo && <img className="reviewPreview" src={review.photo} alt="Review upload preview" />}
              <button>Post review</button>
            </form>
            <div className="reviewList">
              {reviews.length === 0 && <p className="muted">No reviews yet. Be the first to add one.</p>}
              {reviews.map((r) => <article key={r.id} className="reviewCard"><div className="row"><strong>{r.userName}</strong><span><Star size={13} fill="currentColor"/> {r.rating}</span></div><h4>{r.title}</h4><p>{r.text}</p>{r.photo && <img src={r.photo} alt="Customer upload"/>}<small>{compactDate(r.createdAt)}</small></article>)}
            </div>
          </div>
        </section>

        <section>
          <div className="sectionHead small"><div><p className="eyebrow">More like this</p><h2>Related picks</h2></div></div>
          <div className="relatedRow">{related.map((item) => <ProductCard key={item.id} product={item} onOpen={() => onOpenProduct(item)} wishlist={wishlist} onWishlist={async () => { if (!user) return requireLogin(); const data = await api('/wishlist', { method: 'POST', body: JSON.stringify({ product: item }) }); setWishlist(data.items || []); }} />)}</div>
        </section>
      </div>
    </div>
  );
}


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

  return <div className="sideOverlay"><aside className="drawer"><button className="close" onClick={onClose}><X size={18}/></button><h2>Your bag</h2>{items.length === 0 && <p className="muted">Your bag is empty.</p>}{items.map((item, idx) => <div className="bagItem" key={`${item.key}-${idx}`}><img src={item.image} alt={item.title}/><div><strong>{item.brand}</strong><p>{item.title}</p><span>{item.size} · {item.color}</span><div className="row"><b>{money(item.price)}</b><div className="qtyBox mini"><button onClick={() => saveCart(items.map((x, i) => i === idx ? { ...x, qty: Math.max(1, Number(x.qty || 1) - 1) } : x))}>-</button><span>{item.qty}</span><button onClick={() => saveCart(items.map((x, i) => i === idx ? { ...x, qty: Number(x.qty || 1) + 1 } : x))}>+</button></div></div><button className="textOnly" onClick={() => saveCart(items.filter((_, i) => i !== idx))}>Remove</button></div></div>)}<div className="checkoutBox"><div className="bill"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><button className="primary full" onClick={proceed} disabled={items.length === 0}>Proceed to checkout</button></div></aside></div>;
}

function CheckoutPage({ items, setItems, user, setPage }) {
  const [address, setAddress] = useState({ name: user?.name || '', phone: '', line1: '', city: '', pincode: '' });
  const [message, setMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPct, setDiscountPct] = useState(0);
  const [busy, setBusy] = useState(false);

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
    
    setBusy(true);
    setMessage('Connecting to secure payment gateway...');
    try {
      const created = await api('/payments/create-order', { method: 'POST', body: JSON.stringify({ address, coupon: discountPct > 0 ? couponCode : '' }) });

      if (created.demo || !keyId) {
        const data = await api('/payments/verify', { method: 'POST', body: JSON.stringify({ demo: true, paymentId: created.order.id, address }) });
        setItems([]);
        setMessage(`Order placed: ${data.order.id}. Redirecting...`);
        setTimeout(() => setPage('feed'), 2000);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        setBusy(false);
        return setMessage('Razorpay could not load. Check internet connection.');
      }
      
      const options = {
        key: keyId,
        amount: created.order.amount,
        currency: created.order.currency,
        name: 'Uptown',
        description: 'Fashion order payment',
        order_id: created.order.id,
        prefill: { name: user?.name, email: user?.email, contact: address.phone },
        handler: async function (response) {
          setMessage('Verifying payment...');
          const data = await api('/payments/verify', { method: 'POST', body: JSON.stringify({ ...response, address }) });
          setItems([]);
          setMessage(`Payment successful! Order: ${data.order.id}. Redirecting...`);
          setTimeout(() => setPage('feed'), 2000);
        },
        modal: {
          ondismiss: function() {
            setBusy(false);
            setMessage('Payment cancelled.');
          }
        },
        theme: { color: '#2b1d18' }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        setBusy(false);
        setMessage('Payment failed: ' + response.error.description);
      });
      rzp.open();
    } catch (err) {
      setBusy(false);
      setMessage('Error starting checkout. Please try again.');
    }
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
          
          <button className="primary full" onClick={checkout} disabled={busy} style={{ marginTop: '30px', padding: '15px', fontSize: '1.1em', opacity: busy ? 0.7 : 1 }}>
            {busy ? 'Processing...' : 'Pay Securely'}
          </button>
          {message && <p className="notice" style={{ marginTop: '15px', color: message.includes('successful') || message.includes('placed') || message.includes('applied') ? 'green' : (message.includes('Connecting') ? 'blue' : 'red') }}>{message}</p>}
        </div>
      </div>
    </main>
  );
}

function AccountDrawer({ onClose, user, logout }) {
  const [tab, setTab] = useState('search');
  const [searches, setSearches] = useState([]);
  const [views, setViews] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api('/history/search').then((d) => setSearches(d.items || [])).catch(() => {});
    api('/history/views').then((d) => setViews(d.items || [])).catch(() => {});
    api('/orders').then((d) => setOrders(d.orders || [])).catch(() => {});
  }, []);

  return <div className="sideOverlay"><aside className="drawer"><button className="close" onClick={onClose}><X size={18}/></button><div className="profileHead"><div className="avatar">{user?.name?.[0] || 'U'}</div><div><h2>{user?.name}</h2><p>{user?.email}</p></div></div><div className="drawerTabs"><button className={tab==='search'?'active':''} onClick={() => setTab('search')}>Searches</button><button className={tab==='views'?'active':''} onClick={() => setTab('views')}>Viewed</button><button className={tab==='orders'?'active':''} onClick={() => setTab('orders')}>Orders</button></div>{tab==='search' && <div className="historyList">{searches.length===0 && <p className="muted">No searches yet.</p>}{searches.map((s) => <div className="historyItem" key={s.id}><Search size={16}/><span>{s.query}</span><small>{compactDate(s.createdAt)}</small></div>)}</div>}{tab==='views' && <div className="historyList">{views.length===0 && <p className="muted">No viewed products yet.</p>}{views.map((v) => <div className="historyItem product" key={v.id}><img src={v.product.image}/><span>{v.product.title}</span><small>{compactDate(v.createdAt)}</small></div>)}</div>}{tab==='orders' && <div className="historyList">{orders.length===0 && <p className="muted">No orders yet.</p>}{orders.map((o) => <div className="orderCard" key={o.id}><div className="row"><strong>{o.status}</strong><span>{money(o.amount)}</span></div><p>{o.items.length} item(s)</p><small>{compactDate(o.createdAt)} · {o.paymentStatus}</small></div>)}</div>}<button className="logout" onClick={logout}><LogOut size={17}/> Log out</button></aside></div>;
}

export default App;
