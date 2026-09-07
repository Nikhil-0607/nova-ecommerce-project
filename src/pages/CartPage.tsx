import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import type { CartItem } from "../types/cart";

const formatPrice = (value: number): string => `₹${value.toLocaleString()}`

function CartLineItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: CartItem
  onDecrease: () => void
  onIncrease: () => void
  onRemove: () => void
}) {
  const maximum = item.maxQuantity ?? item.availableQuantity
  const atMaximum = maximum !== undefined && item.quantity >= maximum
  const discountPercentage = item.mrp > item.unitPrice
    ? Math.round(((item.mrp - item.unitPrice) / item.mrp) * 100)
    : 0

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.productName} />
      <div>
        <b>{item.brandName}</b>
        <p>{item.productName}</p>
        {(item.size || item.color) && (
          <p>
            {item.size && `Size: ${item.size}`}
            {item.size && item.color && " · "}
            {item.color && `Color: ${item.color}`}
          </p>
        )}
        <div className="cart-price">
          <strong>{formatPrice(item.unitPrice)}</strong>
          {item.mrp > item.unitPrice && (
            <>
              <span className="muted">{formatPrice(item.mrp)}</span>
              {discountPercentage > 0 && <span className="discount">{discountPercentage}% OFF</span>}
            </>
          )}
        </div>
        <div className="cart-quantity" aria-label={`Quantity for ${item.productName}`}>
          <button
            type="button"
            className="text-btn"
            onClick={onDecrease}
            disabled={item.quantity <= 1}
            aria-label={`Decrease quantity of ${item.productName}`}
          >
            −
          </button>
          <span aria-live="polite">{item.quantity}</span>
          <button
            type="button"
            className="text-btn"
            onClick={onIncrease}
            disabled={atMaximum}
            aria-label={`Increase quantity of ${item.productName}`}
          >
            +
          </button>
        </div>
        <button type="button" className="text-btn" onClick={onRemove}>
          REMOVE
        </button>
      </div>
    </div>
  )
}

export default function CartPage() {
  const {
    cartItems,
    cartSubtotal,
    cartTotal,
    cartLoading,
    cartError,
    updateCartQuantity,
    removeCartItem,
    clearCart,
  } = useStore()

  if (cartLoading) {
    return (
      <section className="section container">
        <h1>Shopping Bag</h1>
        <p role="status">Loading your bag…</p>
      </section>
    )
  }

  if (cartError && cartItems.length === 0) {
    return (
      <section className="section container">
        <h1>Shopping Bag</h1>
        <div className="empty" role="alert">
          <h2>Unable to load your bag</h2>
          <p>{cartError}</p>
        </div>
      </section>
    )
  }

  if (!cartItems.length) {
    return (
      <section className="section container">
        <h1>Shopping Bag</h1>
        <div className="empty">
          <h2>Your bag is empty</h2>
          <Link className="btn" to="/">
            START SHOPPING
          </Link>
        </div>
      </section>
    )
  }

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  return (
    <section className="section container">
      <h1>Shopping Bag</h1>
      {cartError && <p role="alert">{cartError}</p>}
      <div className="cart-layout">
        <div>
          {cartItems.map((item) => (
            <CartLineItem
              key={item.id}
              item={item}
              onDecrease={() => updateCartQuantity(item.id, item.quantity - 1)}
              onIncrease={() => updateCartQuantity(item.id, item.quantity + 1)}
              onRemove={() => removeCartItem(item.id)}
            />
          ))}
          <button type="button" className="text-btn" onClick={clearCart}>
            CLEAR CART
          </button>
        </div>
        <aside className="summary">
          <h3>PRICE DETAILS</h3>
          <p>
            Items <span>{itemCount}</span>
          </p>
          <p>
            Subtotal <span>{formatPrice(cartSubtotal)}</span>
          </p>
          <p>
            Delivery <span>FREE</span>
          </p>
          <hr />
          <h3>
            Total <span>{formatPrice(cartTotal)}</span>
          </h3>
          <Link className="btn full" to="/checkout">
            PROCEED TO CHECKOUT
          </Link>
        </aside>
      </div>
    </section>
  )
}
