import type { Product } from "../types/product"
import type { ProductApprovalStatus, Seller, SellerApplication, SellerProduct, SellerStatus } from "../types/seller"
import { products } from "../mock/products"

const seller: Seller = { id: "seller-demo", name: "NOVA Studio Collective", email: "seller@nova.demo", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" }
const applications = new Map<string, SellerApplication>()
const catalog = new Map<string, SellerProduct>(products.map((product) => [product.id, {
  productId: product.id, sellerId: seller.id, approvalStatus: "APPROVED", variants: product.variants, updatedAt: product.updatedAt,
}]))

const wait = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))
const ensureSeller = (sellerId: string) => { if (sellerId !== seller.id) throw new Error("Seller access denied") }

export const sellerService = {
  async submitApplication(input: Pick<SellerApplication, "businessName" | "contactEmail">): Promise<SellerApplication> {
    await wait()
    if (!input.businessName.trim() || !input.contactEmail.trim()) throw new Error("Business name and contact email are required")
    const application: SellerApplication = { id: `seller-application-${Date.now()}`, ...input, status: "SUBMITTED", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    applications.set(application.id, application)
    return application
  },
  getApplications(): SellerApplication[] { return [...applications.values()] },
  async moderateSellerApplication(applicationId: string, status: "APPROVED" | "REJECTED", reason: string): Promise<SellerApplication> {
    if (!reason.trim()) throw new Error("A moderation reason is required")
    const application = applications.get(applicationId)
    if (!application) throw new Error("Seller application not found")
    const updated = { ...application, status, ...(status === "REJECTED" ? { rejectionReason: reason } : {}), updatedAt: new Date().toISOString() }
    applications.set(applicationId, updated)
    return updated
  },
  async getSeller(sellerId: string): Promise<Seller | undefined> { await wait(); return sellerId === seller.id ? seller : undefined },
  async getSellerProducts(sellerId: string): Promise<SellerProduct[]> { await wait(); ensureSeller(sellerId); return [...catalog.values()].filter((item) => item.sellerId === sellerId) },
  async submitProduct(sellerId: string, productId: string): Promise<SellerProduct> {
    await wait(); ensureSeller(sellerId)
    const existing = catalog.get(productId)
    if (!existing) throw new Error("Product not found")
    const updated = { ...existing, approvalStatus: "PENDING_REVIEW" as ProductApprovalStatus, updatedAt: new Date().toISOString() }
    catalog.set(productId, updated)
    return updated
  },
  async moderateProduct(actorRole: "ADMIN", productId: string, status: Exclude<ProductApprovalStatus, "DRAFT" | "PENDING_REVIEW">, reason: string): Promise<SellerProduct> {
    if (actorRole !== "ADMIN" || !reason.trim()) throw new Error("Approval permission or reason required")
    const existing = catalog.get(productId)
    if (!existing) throw new Error("Product not found")
    const updated = { ...existing, approvalStatus: status, ...(status === "REJECTED" ? { rejectionReason: reason } : {}), updatedAt: new Date().toISOString() }
    catalog.set(productId, updated)
    return updated
  },
  getPublicProducts(): Product[] {
    return products.filter((product) => catalog.get(product.id)?.approvalStatus === "APPROVED").map((product) => ({ ...product, sellerId: seller.id, sellerName: seller.name, approvalStatus: "APPROVED" }))
  },
  getStatus(): SellerStatus { return seller.status },
}
