export type FeatureFlags = {
  enableGuestWishlist: boolean
  enableGuestCart: boolean
  enableCoupon: boolean
  enableSavedForLater: boolean
  enableSocialLogin: boolean
  enablePhoneAuth: boolean
  enableBackInStockAlerts: boolean
}

export const featureFlags: FeatureFlags = {
  enableGuestWishlist: true,
  enableGuestCart: true,
  enableCoupon: true,
  enableSavedForLater: true,
  enableSocialLogin: false,
  enablePhoneAuth: false,
  enableBackInStockAlerts: false,
}
