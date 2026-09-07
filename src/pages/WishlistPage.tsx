import { Link } from "react-router-dom"
import ProductGrid from "../components/product/ProductGrid"
import SEO from "../components/seo/SEO"
import { useStore } from "../context/StoreContext"

export default function WishlistPage() {
  const { wishlist, wishlistLoading, wishlistError, refreshWishlist, clearWishlist } = useStore()

  return (
    <>
      <SEO title="Wishlist | NOVA" description="Your saved NOVA products." robots="noindex,nofollow" />
      <section className="section container" aria-labelledby="wishlist-title">
        <div className="listing-head">
          <div>
            <span className="eyebrow">SAVED FOR LATER</span>
            <h1 id="wishlist-title">Wishlist</h1>
          </div>
          {!wishlistLoading && !wishlistError && wishlist.length > 0 && <button className="btn secondary" type="button" onClick={clearWishlist}>CLEAR WISHLIST</button>}
        </div>
        {wishlistLoading && <div className="panel" aria-live="polite"><p>Loading your wishlist...</p></div>}
        {!wishlistLoading && wishlistError && <div className="panel auth-error" role="alert"><p>{wishlistError}</p><button className="btn secondary" type="button" onClick={refreshWishlist}>TRY AGAIN</button></div>}
        {!wishlistLoading && !wishlistError && wishlist.length > 0 && <ProductGrid products={wishlist} />}
        {!wishlistLoading && !wishlistError && wishlist.length === 0 && <div className="empty" role="status"><h2>YOUR WISHLIST IS EMPTY</h2><p>Save your favorite products here.</p><Link className="btn" to="/">START SHOPPING</Link></div>}
      </section>
    </>
  )
}
