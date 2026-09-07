# NOVA E-Commerce — Phase 1

A runnable React + TypeScript + Vite frontend foundation for a premium fashion/lifestyle e-commerce platform.

## Run in VS Code

1. Extract the ZIP.
2. Open the extracted `nova-ecommerce-phase1` folder in VS Code.
3. Open Terminal in VS Code.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL shown by Vite (usually `http://localhost:5173`).

## Build check

```bash
npm run build
```

## Included

- Premium responsive homepage
- Sticky global header + mobile nav
- Search routing and search results
- Category/product listing routes
- Product details
- Mock wishlist and cart state with toasts
- Checkout placeholder
- Offers and brands
- Account/mock login
- Orders + order detail route
- Help center
- Seller portal shell
- Admin dashboard shell
- Mock product service abstraction and 36 mock products
- Responsive desktop/mobile styling

## Phase 1 note

This project intentionally uses mock frontend state and mock services. It is structured so a future Spring Boot REST API can replace the mock service layer without rewriting UI components.
