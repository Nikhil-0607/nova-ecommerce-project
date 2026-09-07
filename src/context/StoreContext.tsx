import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types/product";
import type { Cart, CartItem } from "../types/cart";
import type { User, SessionStatus } from "../types/auth";
import { sessionService } from "../services/sessionService";
import { authService } from "../services/authService";
import { analytics } from "../services/analyticsService";
import { productService } from "../services/productService";
import { wishlistService, type WishlistScope } from "../services/wishlistService";
import { getWishlistItemKey } from "../utils/wishlistIdentity";
import type { WishlistItem } from "../types/wishlist";
import { cartService } from "../services/cartService";

type Toast = { id: number; message: string };
const emptyTypedCart: Cart = {
  id: "guest-cart",
  items: [],
  subtotal: 0,
  discount: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0,
  currency: "INR",
  createdAt: "",
  updatedAt: "",
};
type Store = {
  cart: Product[];
  cartItems: CartItem[];
  cartTotal: number;
  cartSubtotal: number;
  cartLoading: boolean;
  cartError: string;
  wishlist: Product[];
  toasts: Toast[];
  isAuthenticated: boolean;
  authStatus: SessionStatus;
  user?: User;
  addToCart: (p: Product) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (p: Product) => void;
  removeFromCart: (id: string) => void;
  notify: (message: string) => void;
  login: (user?: User) => void;
  updateUser: (user: User) => void;
  wishlistLoading: boolean;
  wishlistError: string;
  refreshWishlist: () => void;
  clearWishlist: () => void;
  logout: () => void;
};
const Ctx = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [typedCart, setTypedCart] = useState<Cart>(emptyTypedCart);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [authStatus, setAuthStatus] = useState<SessionStatus>("loading");
  const [user, setUser] = useState<User>();
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState("");
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const wishlistScope: WishlistScope = authStatus === "authenticated" && user ? { userId: user.id } : "guest";

  const resolveWishlist = async (items: WishlistItem[]): Promise<Product[]> => {
    const catalog = await productService.getAll();
    return items.flatMap((item) => {
      const product = catalog.find((candidate) => candidate.id === item.productId || candidate.slug === item.productId);
      if (!product) return [];
      const variant = item.variantId ? product.variants.find((candidate) => candidate.id === item.variantId) : undefined;
      if (item.variantId && !variant) return [];
      return [{ ...product, ...(variant ? { selectedVariant: variant } : {}) }];
    });
  };

  const resolveCart = async (cartData: Cart): Promise<Product[]> => {
    const catalog = await productService.getAll();
    return cartData.items.flatMap((item) => {
      const product = catalog.find((candidate) => candidate.id === item.productId);
      if (!product) return [];
      const variant = item.variantId
        ? product.variants.find((candidate) => candidate.id === item.variantId)
        : undefined;
      if (item.variantId && !variant) return [];
      return [{
        ...product,
        ...(variant ? {
          price: variant.price,
          stockStatus: variant.stockStatus,
          availability: variant.stockStatus,
          selectedVariant: variant,
        } : {}),
      }];
    });
  };

  const applyCart = async (cartData: Cart): Promise<void> => {
    const resolved = await resolveCart(cartData);
    setTypedCart(cartData);
    setCart(resolved);
  };

  useEffect(() => {
    const session = sessionService.initialize();
    if (session.sessionStatus === "authenticated" && session.user) {
      try {
        cartService.mergeGuestCart(session.user.id);
      } catch {
        setCartError("We couldn't merge your cart. Your guest cart was preserved.");
      }
    }
    setUser(session.user);
    setAuthStatus(session.sessionStatus);
    analytics.track("SESSION_RESTORED", { authenticated: session.sessionStatus === "authenticated" });
  }, []);
  useEffect(() => {
    if (authStatus === "loading") return;
    let active = true;
    setWishlistLoading(true);
    setWishlistError("");
    void Promise.resolve().then(() => wishlistService.getWishlist(wishlistScope)).then((stored) => resolveWishlist(stored.items)).then((resolved) => {
      if (active) setWishlist(resolved);
    }).catch(() => {
      if (active) {
        setWishlist([]);
        setWishlistError("We couldn't load your wishlist.");
      }
    }).finally(() => {
      if (active) setWishlistLoading(false);
    });
    return () => { active = false; };
  }, [authStatus, user?.id]);
  useEffect(() => {
    if (authStatus === "loading") return;
    let active = true;
    setCartLoading(true);
    setCartError("");
    void Promise.resolve().then(() => cartService.getCart(user?.id)).then((cartData) => resolveCart(cartData).then((resolved) => {
      if (!active) return;
      setTypedCart(cartData);
      setCart(resolved);
    })).catch(() => {
      if (active) {
        setCart([]);
        setTypedCart(emptyTypedCart);
        setCartError("We couldn't load your cart.");
      }
    }).finally(() => {
      if (active) setCartLoading(false);
    });
    return () => { active = false; };
  }, [authStatus, user?.id]);
  const toast = (message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  };
  const value = useMemo<Store>(
    () => ({
      cart,
      cartItems: typedCart.items,
      cartTotal: typedCart.total,
      cartSubtotal: typedCart.subtotal,
      cartLoading,
      cartError,
      wishlist,
      toasts,
      isAuthenticated: authStatus === "authenticated",
      authStatus,
      user,
      addToCart: (p) => {
        void cartService.addItem(p.id, p.selectedVariant?.id, 1, user?.id).then((next) => {
          void applyCart(next);
          toast("Added to bag");
        }).catch(() => {
          setCartError("We couldn't update your cart.");
          toast("We couldn't update your bag. Please try again.");
        });
      },
      updateCartQuantity: (itemId, quantity) => {
        const next = cartService.updateQuantity(itemId, quantity, user?.id);
        void applyCart(next).catch(() => setCartError("We couldn't update your cart."));
      },
      removeCartItem: (itemId) => {
        const next = cartService.removeItem(itemId, user?.id);
        void applyCart(next).catch(() => setCartError("We couldn't update your cart."));
      },
      clearCart: () => {
        const next = cartService.clearCart(user?.id);
        void applyCart(next).catch(() => setCartError("We couldn't clear your cart."));
      },
      toggleWishlist: (p) =>
        (() => {
          try {
            const variantId = p.selectedVariant?.id;
            const result = wishlistService.toggleItem(wishlistScope, p.id, variantId);
            const key = getWishlistItemKey(p.id, variantId);
            setWishlist((current) => result.added ? [...current, p] : current.filter((item) => getWishlistItemKey(item.id, item.selectedVariant?.id) !== key));
            analytics.track(result.added ? "WISHLIST_ITEM_ADDED" : "WISHLIST_ITEM_REMOVED", { productId: p.id, ...(variantId ? { variantId } : {}) });
            toast(result.added ? "Added to wishlist" : "Removed from wishlist");
          } catch {
            toast("We couldn't update your wishlist. Please try again.");
          }
        })(),
      removeFromCart: (id) => {
        const matchingItems = typedCart.items.filter((item) => item.productId === id);
        let next = cartService.getCart(user?.id);
        matchingItems.forEach((item) => {
          next = cartService.removeItem(item.id, user?.id);
        });
        void applyCart(next).catch(() => setCartError("We couldn't update your cart."));
      },
      notify: (message) => toast(message),
      login: (authenticatedUser) => {
        if (authenticatedUser) {
          try {
            cartService.mergeGuestCart(authenticatedUser.id);
          } catch {
            setCartError("We couldn't merge your cart. Your guest cart was preserved.");
          }
          try {
            const merged = wishlistService.mergeGuestWishlist(authenticatedUser.id);
            analytics.track("WISHLIST_MERGED", { itemCount: merged.items.length });
          } catch (error) {
            const code = typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" ? error.code : "SERVER_ERROR";
            analytics.track("WISHLIST_MERGE_FAILED", { code });
          }
          setUser(authenticatedUser);
        }
        setAuthStatus("authenticated");
        toast("Login successful");
      },
      updateUser: (updatedUser) => {
        if (authStatus === "authenticated") setUser(updatedUser);
      },
      wishlistLoading,
      wishlistError,
      refreshWishlist: () => {
        setWishlistLoading(true);
        setWishlistError("");
        void Promise.resolve().then(() => wishlistService.getWishlist(wishlistScope)).then((stored) => resolveWishlist(stored.items)).then(setWishlist).catch(() => {
            setWishlist([]);
            setWishlistError("We couldn't load your wishlist.");
          }).finally(() => setWishlistLoading(false));
      },
      clearWishlist: () => {
        try {
          wishlistService.clearWishlist(wishlistScope);
          setWishlist([]);
          analytics.track("WISHLIST_CLEARED", {});
          toast("Wishlist cleared");
        } catch {
          toast("We couldn't clear your wishlist. Please try again.");
        }
      },
      logout: () => {
        analytics.track("LOGOUT_STARTED", {});
        void authService.logout().then(() => {
          setCart([]);
          setTypedCart(emptyTypedCart);
          setCartError("");
          setUser(undefined);
          setAuthStatus("unauthenticated");
          setWishlist([]);
          analytics.track("LOGOUT_SUCCESS", {});
          toast("You have been signed out");
        }).catch(() => {
          analytics.track("LOGOUT_FAILED", { code: "SERVER_ERROR" });
          toast("We couldn't sign you out. Please try again.");
        });
      },
    }),
    [cart, typedCart, cartLoading, cartError, wishlist, toasts, authStatus, user, wishlistLoading, wishlistError],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
}
