import { useState } from "react"

type ProductImageGalleryProps = {
  images: string[]
  alt: string
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const safeImages = images.length > 0 ? images : [""]
  const [activeIndex, setActiveIndex] = useState(0)
  const changeImage = (index: number) => setActiveIndex((index + safeImages.length) % safeImages.length)

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <img src={safeImages[activeIndex]} alt={`${alt}, view ${activeIndex + 1}`} />
        {safeImages.length > 1 && <>
          <button type="button" className="gallery-control gallery-prev" onClick={() => changeImage(activeIndex - 1)} aria-label="Previous product image">‹</button>
          <button type="button" className="gallery-control gallery-next" onClick={() => changeImage(activeIndex + 1)} aria-label="Next product image">›</button>
        </>}
      </div>
      {safeImages.length > 1 && <div className="gallery-thumbnails" aria-label="Product image views">
        {safeImages.map((image, index) => <button type="button" className={activeIndex === index ? "active" : ""} key={`${image}-${index}`} onClick={() => changeImage(index)} aria-label={`View ${index + 1}`} aria-pressed={activeIndex === index}><img src={image} alt="" /></button>)}
      </div>}
    </div>
  )
}
