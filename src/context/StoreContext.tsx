import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types/product";
import type { User, SessionStatus } from "../types/auth";
import { sessionService } from "../services/sessionService";
import { authService } from "../services/authService";
import { analytics } from "../services/analyticsService";
import { productService } from "../services/productService";
import { wishlistService, type WishlistScope } from "../services/wishlistService";
import { getWishlistItemKey } from "../utils/wishlistIdentity";
import type { WishlistItem } from "../types/wishlist";

type Toast = { id: number; message: string };
type Store = {
  cart: Product[];
  wishlist: Product[];
  toasts: Toast[];
  isAuthenticated: boolean;
  authStatus: SessionStatus;
  user?: User;
  addToCart: (p: Product) => void;
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

  useEffect(() => {
    const session = sessionService.initialize();
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
  const toast = (message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  };
  const value = useMemo<Store>(
    () => ({
      cart,
      wishlist,
      toasts,
      isAuthenticated: authStatus === "authenticated",
      authStatus,
      user,
      addToCart: (p) => {
        setCart((c) => [...c, p]);
        toast("Added to bag");
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
      removeFromCart: (id) => setCart((c) => c.filter((x) => x.id !== id)),
      notify: (message) => toast(message),
      login: (authenticatedUser) => {
        if (authenticatedUser) {
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
    [cart, wishlist, toasts, authStatus, user, wishlistLoading, wishlistError],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
}
