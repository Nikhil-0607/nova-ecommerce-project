import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useStore } from "../context/StoreContext"
import { productService } from "../services/productService"
import { getSizeChart } from "../services/sizeChartService"
import type { Product, ProductVariant } from "../types/product"
import ProductBadge from "../components/product/ProductBadge"
import ProductImageGallery from "../components/product/ProductImageGallery"
import ProductPrice from "../components/product/ProductPrice"
import ProductRating from "../components/product/ProductRating"
import ProductVariantSelector from "../components/product/ProductVariantSelector"
import SizeChart from "../components/product/SizeChart"
import DeliveryChecker from "../components/product/DeliveryChecker"
import Skeleton from "../components/common/Skeleton"
import ProductReviews from "../components/review/ProductReviews"
import RecommendationSection from "../components/recommendation/RecommendationSection"
import RecentlyViewedSection from "../components/recommendation/RecentlyViewedSection"
import { useRecentlyViewed } from "../hooks/useRecentlyViewed"
import { recommendationService } from "../services/recommendationService"
import SEO from "../components/seo/SEO"
import { getWishlistItemKey } from "../utils/wishlistIdentity"

export default function ProductPage() {
  const { productId = "" } = useParams()
  const { addToCart, toggleWishlist, wishlist, notify } = useStore()
  const [product, setProduct] = useState<Product>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>()
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [selectionError, setSelectionError] = useState("")
  const { products: recentlyViewed, addViewedProduct } = useRecentlyViewed(product?.id)

  const loadSimilarProducts = useCallback(
    () => recommendationService.getSimilarProducts(productId),
    [productId],
  )
  const loadRecommendedProducts = useCallback(
    () => recommendationService.getRecommendedProducts(productId),
    [productId],
  )

  useEffect(() => {
    if (product) void addViewedProduct(product.id)
  }, [addViewedProduct, product])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    void productService.getProductById(productId).then((result) => {
      if (active) {
        setProduct(result)
        setSelectedVariant(undefined)
      }
    }).catch(() => {
      if (active) setError(true)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [productId])

  const sizeChart = useMemo(() => product ? getSizeChart(product.categoryId) : undefined, [product])

  if (loading) return <><SEO title="Loading product | NOVA" description="Loading product details." robots="noindex,follow" /><section className="section container"><div className="pdp-skeleton"><Skeleton className="skeleton-media" /><div><Skeleton className="skeleton-line" /><Skeleton className="skeleton-line skeleton-line-short" /><Skeleton className="skeleton-line skeleton-line-price" /></div></div></section></>
  if (error) return <><SEO title="Product unavailable | NOVA" description="This product is temporarily unavailable." robots="noindex,follow" /><section className="section container"><div className="empty" role="alert"><h1>Unable to load product</h1><p>Please try again shortly.</p></div></section></>
  if (!product) return <><SEO title="Product not found | NOVA" description="This product is not available." robots="noindex,follow" /><section className="section container"><div className="empty"><h1>Product not found</h1><p>This product may no longer be available.</p></div></section></>

  const activeVariant = selectedVariant
  const wishlistKey = getWishlistItemKey(product.id, activeVariant?.id)
  const liked = wishlist.some((item) => getWishlistItemKey(item.id, item.selectedVariant?.id) === wishlistKey)
  const displayPrice = activeVariant?.price ?? product.price
  const displayStock = activeVariant?.stockStatus ?? product.stockStatus
  const hasRequiredVariant = product.variants.length === 0 || Boolean(activeVariant)
  const cartProduct: Product = activeVariant ? { ...product, price: activeVariant.price, stockStatus: activeVariant.stockStatus, availability: activeVariant.stockStatus, selectedVariant: activeVariant } : product
  const addToBag = () => {
    if (!hasRequiredVariant) {
      setSelectionError("Select a color and size before adding this item.")
      return
    }
    if (displayStock === "out-of-stock" || displayStock === "coming-soon") {
      setSelectionError("This variant is currently unavailable.")
      return
    }
    setSelectionError("")
    addToCart(cartProduct)
  }

  return (
    <section className="section container">
      <SEO
        title={`${product.name} | ${product.brand} | NOVA`}
        description={`${product.brand} ${product.name}. ${product.description.slice(0, 155)}`}
        canonicalPath={`/product/${product.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          sku: product.sku,
          image: product.images,
          brand: { "@type": "Brand", name: product.brand },
          category: product.category,
          ...(product.reviewCount > 0 ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
          } : {}),
          offers: {
            "@type": "Offer",
            priceCurrency: product.currency,
            price: displayPrice,
            availability: displayStock === "out-of-stock"
              ? "https://schema.org/OutOfStock"
              : displayStock === "coming-soon"
                ? "https://schema.org/PreOrder"
              : "https://schema.org/InStock",
            url: new URL(`/product/${product.slug}`, window.location.origin).toString(),
          },
        }}
      />
      <div className="breadcrumb">Home / {product.category} / {product.name}</div>
      <div className="pdp">
        <ProductImageGallery images={product.images} alt={product.name} />
        <div className="pdp-info">
          <span className="eyebrow">{product.brand}</span>
          <div className="pdp-badges">{product.badges.map((badge) => <ProductBadge key={badge} badge={badge} />)}</div>
          <h1>{product.name}</h1>
          <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
          <ProductPrice price={displayPrice} mrp={product.mrp} discountPercentage={product.discountPercentage} currency={product.currency} />
          <p className="muted">Inclusive of all taxes</p>
          <p className="pdp-stock">{displayStock === "in-stock" ? "In stock" : displayStock === "low-stock" ? "Only a few left" : displayStock === "coming-soon" ? "Coming soon" : "Currently unavailable"}</p>
          <ProductVariantSelector product={product} selectedVariant={selectedVariant} onSelect={(variant) => { setSelectedVariant(variant); setSelectionError("") }} />
          <div className="pdp-support-links">{sizeChart && <SizeChart rows={sizeChart} />}</div>
          {selectionError && <p className="selection-error" role="alert">{selectionError}</p>}
          <div className="pdp-actions">
            {displayStock === "out-of-stock" ? <button className="btn" onClick={() => notify(`We'll notify you when ${product.name} is back.`)}>NOTIFY ME</button> : <button className="btn" onClick={addToBag} disabled={displayStock === "coming-soon"}>{displayStock === "coming-soon" ? "COMING SOON" : "ADD TO BAG"}</button>}
            <button className="btn secondary" aria-pressed={liked} onClick={() => toggleWishlist(activeVariant ? { ...product, selectedVariant: activeVariant } : product)}>{liked ? "♥ WISHLISTED" : "♡ WISHLIST"}</button>
          </div>
          <DeliveryChecker productId={product.id} />
          <div className="details">
            <h3>Product details</h3>
            <p>{descriptionExpanded || product.description.length < 180 ? product.description : `${product.description.slice(0, 180)}…`}</p>
            {product.description.length >= 180 && <button type="button" className="text-btn" onClick={() => setDescriptionExpanded((expanded) => !expanded)}>{descriptionExpanded ? "Show less" : "Show more"}</button>}
            <p>✓ 100% authentic · ✓ Easy returns · ✓ Secure checkout</p>
            {product.specifications.length > 0 && <div className="specifications"><h3>Specifications</h3>{product.specifications.map((specification) => <div className="specification-row" key={specification.name}><span>{specification.name}</span><strong>{specification.value}</strong></div>)}</div>}
          </div>
        </div>
      </div>
      <ProductReviews productId={product.id} />
      <RecommendationSection
        title="Similar Products"
        subtitle="More styles with a similar feel."
        loadProducts={loadSimilarProducts}
      />
      <RecommendationSection
        title="Recommended For You"
        subtitle="Popular picks from this collection."
        loadProducts={loadRecommendedProducts}
      />
      <RecentlyViewedSection products={recentlyViewed} />
    </section>
  )
}
