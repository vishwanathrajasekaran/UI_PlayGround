import { useEffect, useMemo, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['product-list', 'cart', 'checkout', 'order-confirmation']

const PRODUCTS = [
  { id: 'p1', name: 'Wireless Mouse', category: 'Electronics', price: 19.99 },
  { id: 'p2', name: 'Mechanical Keyboard', category: 'Electronics', price: 64.5 },
  { id: 'p3', name: 'Automation Testing 101', category: 'Books', price: 24.0 },
  { id: 'p4', name: 'Desk Lamp', category: 'Home', price: 15.75 },
  { id: 'p5', name: 'Notebook Set', category: 'Home', price: 8.25 },
  { id: 'p6', name: 'Clean Code', category: 'Books', price: 32.0 },
]

export default function Ecommerce() {
  const { isDone, toggle, completedCount, total } = useProgress('ecommerce', SPECIMEN_IDS)

  // --- Product list ---
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter((p) => (category === 'all' || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase())),
    [search, category],
  )

  // --- Cart (persisted server-side via Postgres, identified by an httpOnly cookie) ---
  const [cartItems, setCartItems] = useState([])
  const [cartLoading, setCartLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cart')
      .then((res) => res.json())
      .then((data) => setCartItems(data.items || []))
      .finally(() => setCartLoading(false))
  }, [])

  async function addToCart(id) {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, delta: 1 }),
    })
    const data = await res.json()
    setCartItems(data.items || [])
  }

  async function changeQty(id, delta) {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, delta }),
    })
    const data = await res.json()
    setCartItems(data.items || [])
  }

  async function removeFromCart(id) {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id }),
    })
    const data = await res.json()
    setCartItems(data.items || [])
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)

  // --- Checkout ---
  const [checkoutName, setCheckoutName] = useState('')
  const [checkoutAddress, setCheckoutAddress] = useState('')
  const [lastOrder, setLastOrder] = useState(null)
  const [orderError, setOrderError] = useState('')

  async function placeOrder(e) {
    e.preventDefault()
    if (cartItems.length === 0) return
    setOrderError('')
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: checkoutName, address: checkoutAddress }),
    })
    const data = await res.json()
    if (!res.ok) {
      setOrderError(data.error || 'Something went wrong placing the order.')
      return
    }
    setLastOrder(data)
    setCartItems([])
    setCheckoutName('')
    setCheckoutAddress('')
  }

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>EC — E-Commerce</h1>
          <p>
            A full search → filter → cart → checkout → confirmation flow. The cart and orders are
            genuinely persisted in Postgres, keyed to an anonymous httpOnly cookie — refresh the
            page and your cart is still there.
          </p>
        </div>
        <div className="title-block-fields">
          <div>
            <span className="field-label">Progress</span>
            {completedCount} / {total} marked done
          </div>
        </div>
      </div>

      <Specimen
        id="product-list"
        title="Product list — search + filter"
        done={isDone('product-list')}
        onToggleDone={toggle}
        annotations={[
          ['search id', 'ec-search'],
          ['category filter id', 'ec-category-filter'],
          ['add-to-cart buttons', 'data-testid="add-to-cart-{productId}"'],
        ]}
      >
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <input id="ec-search" data-testid="ec-search" type="text" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 220 }} />
          <select id="ec-category-filter" data-testid="ec-category-filter" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {filteredProducts.map((p) => (
            <div key={p.id} data-testid={`product-card-${p.id}`} style={{ border: '1px solid var(--color-grid)', borderRadius: 6, padding: 12 }}>
              <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>{p.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-soft)', marginBottom: 8 }}>
                {p.category} · ${p.price.toFixed(2)}
              </div>
              <button data-testid={`add-to-cart-${p.id}`} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => addToCart(p.id)}>
                Add to cart
              </button>
            </div>
          ))}
          {filteredProducts.length === 0 && <span data-testid="ec-no-results" style={{ color: 'var(--color-ink-soft)', fontSize: '0.85rem' }}>No products match.</span>}
        </div>
      </Specimen>

      <Specimen
        id="cart"
        title="Cart — quantity + remove"
        done={isDone('cart')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'ec-cart'],
          ['qty controls', 'data-testid="qty-plus-{id}" / "qty-minus-{id}"'],
          ['total id', 'ec-cart-total'],
        ]}
      >
        <div id="ec-cart" data-testid="ec-cart">
          {cartLoading && <div style={{ color: 'var(--color-ink-soft)', fontSize: '0.85rem' }}>Loading cart…</div>}
          {!cartLoading && cartItems.length === 0 && <div data-testid="ec-cart-empty" style={{ color: 'var(--color-ink-soft)', fontSize: '0.85rem' }}>Cart is empty.</div>}
          {cartItems.map((item) => (
            <div key={item.id} data-testid={`cart-item-${item.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--color-grid)' }}>
              <span style={{ flex: 1, fontSize: '0.86rem' }}>{item.name}</span>
              <button data-testid={`qty-minus-${item.id}`} className="btn btn-outline" style={{ padding: '2px 8px' }} onClick={() => changeQty(item.id, -1)}>
                −
              </button>
              <span data-testid={`qty-value-${item.id}`} style={{ minWidth: 20, textAlign: 'center' }}>
                {item.qty}
              </span>
              <button data-testid={`qty-plus-${item.id}`} className="btn btn-outline" style={{ padding: '2px 8px' }} onClick={() => changeQty(item.id, 1)}>
                +
              </button>
              <button data-testid={`remove-item-${item.id}`} className="btn btn-outline" style={{ padding: '2px 8px' }} onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}
          {cartItems.length > 0 && (
            <div id="ec-cart-total" data-testid="ec-cart-total" className="result-line" style={{ marginTop: 8 }}>
              Total: ${cartTotal.toFixed(2)}
            </div>
          )}
        </div>
      </Specimen>

      <Specimen
        id="checkout"
        title="Checkout"
        done={isDone('checkout')}
        onToggleDone={toggle}
        annotations={[
          ['form id', 'ec-checkout-form'],
          ['submit disabled when', 'cart is empty'],
        ]}
      >
        <form id="ec-checkout-form" data-testid="ec-checkout-form" onSubmit={placeOrder}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280 }}>
            <input id="ec-checkout-name" data-testid="ec-checkout-name" type="text" placeholder="Full name" value={checkoutName} onChange={(e) => setCheckoutName(e.target.value)} required />
            <input id="ec-checkout-address" data-testid="ec-checkout-address" type="text" placeholder="Shipping address" value={checkoutAddress} onChange={(e) => setCheckoutAddress(e.target.value)} required />
            <button id="ec-place-order-btn" data-testid="ec-place-order-btn" className="btn" type="submit" disabled={cartItems.length === 0}>
              Place order (${cartTotal.toFixed(2)})
            </button>
            {orderError && (
              <div id="ec-order-error" data-testid="ec-order-error" style={{ color: 'var(--color-fail)', fontSize: '0.82rem' }}>
                {orderError}
              </div>
            )}
          </div>
        </form>
      </Specimen>

      <Specimen
        id="order-confirmation"
        title="Order confirmation"
        done={isDone('order-confirmation')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'ec-order-confirmation'],
          ['order id field', 'ec-order-id'],
          ['note', 'populated only after Place order is submitted above'],
        ]}
      >
        {lastOrder ? (
          <div id="ec-order-confirmation" data-testid="ec-order-confirmation" className="result-line">
            ✓ Thank you, {lastOrder.name}! Order <span id="ec-order-id" data-testid="ec-order-id">{lastOrder.orderId}</span> placed for $
            {lastOrder.total.toFixed(2)} ({lastOrder.items.length} item{lastOrder.items.length !== 1 ? 's' : ''}).
          </div>
        ) : (
          <div style={{ color: 'var(--color-ink-soft)', fontSize: '0.85rem' }}>No order placed yet.</div>
        )}
      </Specimen>
    </>
  )
}
