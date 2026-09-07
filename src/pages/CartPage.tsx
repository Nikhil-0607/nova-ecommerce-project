import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function CartPage() {
  const { cart, removeFromCart } = useStore();
  const total = cart.reduce((a, p) => a + p.price, 0);
  return (
    <section className="section container">
      <h1>Shopping Bag</h1>
      {!cart.length ? (
        <div className="empty">
          <h2>Your bag is empty</h2>
          <Link className="btn" to="/">
            START SHOPPING
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {cart.map((p, i) => (
              <div className="cart-item" key={`${p.id}-${i}`}>
                <img src={p.images[0]} alt={p.name} />
                <div>
                  <b>{p.brand}</b>
                  <p>{p.name}</p>
                  <p>Size: M · Qty: 1</p>
                  <strong>₹{p.price.toLocaleString()}</strong>
                  <br />
                  <button
                    className="text-btn"
                    onClick={() => removeFromCart(p.id)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="summary">
            <h3>PRICE DETAILS</h3>
            <p>
              Items <span>{cart.length}</span>
            </p>
            <p>
              Subtotal <span>₹{total.toLocaleString()}</span>
            </p>
            <p>
              Delivery <span>FREE</span>
            </p>
            <hr />
            <h3>
              Total <span>₹{total.toLocaleString()}</span>
            </h3>
            <Link className="btn full" to="/checkout">
              PROCEED TO CHECKOUT
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
