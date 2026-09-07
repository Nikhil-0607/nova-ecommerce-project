import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types/product";

type Toast = { id: number; message: string };
type Store = {
  cart: Product[];
  wishlist: Product[];
  toasts: Toast[];
  isAuthenticated: boolean;
  addToCart: (p: Product) => void;
  toggleWishlist: (p: Product) => void;
  removeFromCart: (id: string) => void;
  login: () => void;
  logout: () => void;
};
const Ctx = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isAuthenticated, setAuth] = useState(false);
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
      isAuthenticated,
      addToCart: (p) => {
        setCart((c) => [...c, p]);
        toast("Added to bag");
      },
      toggleWishlist: (p) =>
        setWishlist((w) => {
          const exists = w.some((x) => x.id === p.id);
          toast(exists ? "Removed from wishlist" : "Added to wishlist");
          return exists ? w.filter((x) => x.id !== p.id) : [...w, p];
        }),
      removeFromCart: (id) => setCart((c) => c.filter((x) => x.id !== id)),
      login: () => {
        setAuth(true);
        toast("Login successful");
      },
      logout: () => setAuth(false),
    }),
    [cart, wishlist, toasts, isAuthenticated],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
}
