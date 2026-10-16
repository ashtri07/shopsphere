import { useEffect, useMemo, useState } from "react";

const PRODUCT_API = import.meta.env.VITE_PRODUCT_API_URL || "http://localhost:8080";
const ORDER_API = import.meta.env.VITE_ORDER_API_URL || "http://localhost:8081";

const money = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch(`${PRODUCT_API}/api/products`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load the product catalog.");
        return response.json();
      })
      .then(setProducts)
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  const cartItems = useMemo(
    () => products.filter((product) => cart[product.id] > 0),
    [products, cart]
  );
  const total = cartItems.reduce((sum, product) => sum + Number(product.price) * cart[product.id], 0);
  const itemCount = cartItems.reduce((sum, product) => sum + cart[product.id], 0);

  function changeQuantity(productId, delta) {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[productId] || 0) + delta;
      if (quantity <= 0) delete next[productId];
      else next[productId] = Math.min(quantity, 10);
      return next;
    });
    setNotice("");
  }

  async function placeOrder(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Add at least one product before placing an order.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`${ORDER_API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          items: cartItems.map((product) => ({ productId: product.id, quantity: cart[product.id] }))
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "Order could not be placed.");
      setOrders((current) => [payload, ...current]);
      setCart({});
      setNotice(`Order ${payload.id.slice(0, 8)} created successfully.`);
    } catch (reason) {
      setError(`${reason.message} Check that both backend services are running.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="ShopSphere home"><span className="brand-mark">S</span> ShopSphere</a>
        <span className="topbar-note">Thoughtful picks for everyday life</span>
        <a className="cart-link" href="#checkout">Bag <span>{itemCount}</span></a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">THE EVERYDAY EDIT</p>
            <h1>Good things.<br /><em>Better days.</em></h1>
            <p className="hero-description">Useful essentials, picked to make the everyday feel a little more considered.</p>
            <a className="primary-link" href="#catalog">Explore the collection <span aria-hidden="true">↘</span></a>
          </div>
          <div className="hero-art" role="img" aria-label="Abstract warm-toned product still life">
            <div className="sun-shape" />
            <div className="art-card art-card-back" />
            <div className="art-bottle"><div className="bottle-cap" /></div>
            <div className="art-bag"><div className="bag-handle" /></div>
            <div className="art-shadow" />
            <span className="art-caption">LESS, BUT LOVELY.</span>
          </div>
        </section>

        <section className="section-heading" id="catalog">
          <div><p className="eyebrow">CURATED FOR YOU</p><h2>The essentials</h2></div>
          <p>Small upgrades. Daily favourites.</p>
        </section>

        {error && <div className="message error" role="alert">{error}<button onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
        {notice && <div className="message success" role="status">{notice}</div>}
        {loading ? <p className="loading">Finding the good stuff…</p> : (
          <div className="product-grid">
            {products.map((product, index) => (
              <article className="product-card" key={product.id}>
                <div className={`product-art product-art-${index % 3}`}>
                  <span className="product-number">0{index + 1}</span>
                  {index === 0 ? <div className="illustration backpack"><span /></div> :
                    index === 1 ? <div className="illustration bottle"><span /></div> :
                      <div className="illustration lamp"><span /></div>}
                  <span className="art-tag">{index === 1 ? "ON THE GO" : index === 2 ? "WORKSPACE" : "BESTSELLER"}</span>
                </div>
                <div className="product-details">
                  <div><h3>{product.name}</h3><p>{product.description}</p></div>
                  <strong>{money(product.price, product.currency)}</strong>
                </div>
                <div className="product-actions">
                  <span className="sku">{product.id}</span>
                  <div className="quantity-control" aria-label={`Quantity for ${product.name}`}>
                    <button onClick={() => changeQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}>−</button>
                    <span>{cart[product.id] || 0}</span>
                    <button onClick={() => changeQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}>+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="checkout" id="checkout">
          <div className="checkout-intro">
            <p className="eyebrow">YOUR LITTLE LINEUP</p>
            <h2>Make it yours.</h2>
            <p>Your bag is held just for this session. This learning app does not process payments.</p>
          </div>
          <form className="checkout-panel" onSubmit={placeOrder}>
            <label htmlFor="customer-name">Your name</label>
            <input id="customer-name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="e.g. Asha" maxLength={80} />
            <div className="checkout-summary">
              <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
              <strong>{money(total)}</strong>
            </div>
            <button className="checkout-button" disabled={busy || loading || itemCount === 0}>
              {busy ? "Creating order…" : "Place demo order"} <span aria-hidden="true">→</span>
            </button>
            <p className="fine-print">Demo only · No payment collected</p>
          </form>
        </section>

        {orders.length > 0 && <section className="orders">
          <p className="eyebrow">JUST PLACED</p><h2>Your demo orders</h2>
          {orders.map((order) => <article className="order-row" key={order.id}>
            <div><strong>Order {order.id.slice(0, 8)}</strong><span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {new Date(order.createdAt).toLocaleString()}</span></div>
            <strong>{money(order.total, order.currency)}</strong>
            <span className="status-pill">{order.status}</span>
          </article>)}
        </section>}
      </main>

      <footer className="footer"><a className="brand" href="/"><span className="brand-mark">S</span> ShopSphere</a><span>A small shop built to learn big things.</span><span>© 2026 ShopSphere Lab</span></footer>
    </div>
  );
}