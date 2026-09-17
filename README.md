# NOVA — Enterprise Fashion & Lifestyle Marketplace

NOVA is a full-stack-ready fashion and lifestyle marketplace prototype built with **React, TypeScript, and Vite**.

The project focuses on how a modern marketplace can connect **customers, sellers, administrators, commerce operations, and customer engagement** through shared domain models and service boundaries.

> **Current status:** Frontend prototype completed and build verified. Backend integration is planned for future phases.

---

## Features

### Customer
- Product discovery and search
- Categories, brands, filters, sorting, and pagination
- Product details, variants, reviews, and recommendations
- Cart and wishlist
- Checkout and delivery selection
- Orders and order details
- Returns, exchanges, refunds, invoices, and support foundations
- Customer preferences and notifications
- Loyalty, membership, and price/back-in-stock alerts

### Seller
- Seller onboarding
- Seller dashboard
- Product approval workflow
- SKU and inventory management foundations
- Warehouse concepts
- Seller-order splitting
- Fulfillment flow: reserve → pick → pack → ship
- Settlement foundations

### Admin
- Admin dashboard
- Role and permission checks
- Product moderation
- Seller governance
- Audit events
- Marketing management

### Marketing & Personalization
- Customer consent and preferences
- Recently viewed products
- Personalized recommendations
- Loyalty points
- Membership plans
- Campaigns, segments, journeys, and experiments
- Marketing analytics foundations

---

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **React Router**
- Context API for application state
- LocalStorage/mock services for persistence
- Responsive CSS

The frontend is structured so mock services can later be replaced with REST APIs without rewriting the UI architecture.

---

## Architecture

```text
Customer / Seller / Admin
          |
       React UI
          |
   Context + Services
          |
   Typed Domain Models
          |
     Mock Storage
          |
   Future REST APIs
          |
 Java / Spring Boot
          |
 PostgreSQL / Redis / Search / Kafka
```

The initial backend can be implemented as a **Spring Boot modular monolith**, with modules such as:

```text
Identity
Customer
Catalog
Seller
Inventory
Order
Checkout
Fulfillment
Marketing
Loyalty
Audit
```

Services can be separated later as the system grows.

---

## Main Domain Flow

```text
Product
   ↓
Cart
   ↓
Checkout
   ↓
Order
   ↓
Seller Order
   ↓
Inventory
   ↓
Fulfillment
   ↓
Shipment
   ↓
Delivery
   ↓
Return / Refund
```

Customer engagement is connected through:

```text
Customer
   ↓
Preferences / Consent
   ↓
Recommendations
   ↓
Alerts
   ↓
Loyalty / Membership
   ↓
Marketing
```

---

## Project Structure

```text
src/
├── app/              # Application and routes
├── components/       # Reusable UI components
├── contexts/         # Cart, checkout and application state
├── services/         # Business logic and persistence boundaries
├── models/           # Shared TypeScript domain models
├── pages/            # Application pages
└── styles/           # Responsive styling
```

The important design principle is keeping **UI, domain models, and services separated** so the application can evolve into a backend-driven system.

---

## Security & Governance

The prototype includes:

- Protected routes
- Customer, seller, and admin roles
- Permission checks
- Admin audit reasons
- Consent-aware personalization
- Seller/admin route protection

These frontend checks are intended for UX and architecture demonstration. **Production authorization and tenant isolation must be enforced by the backend.**

---

## Current Limitations

This is a prototype, not a production marketplace.

The following are currently mocked or planned:

- Real authentication
- Payment processing
- Database persistence
- Courier/shipping integration
- Notifications
- Refund processing
- KYC and seller banking
- Durable inventory reservations
- Kafka/event streaming
- Redis
- Search infrastructure
- ML-based recommendations
- Production monitoring and observability
- Automated tests and linting

---

## Running Locally

```bash
npm install
npm run build
npm run preview
```

The application runs on the Vite preview server.

### Demo Accounts

The prototype uses mock authentication:

```text
Customer → any non-empty email/password
Seller   → email containing "seller"
Admin    → email containing "admin"
```

---

## Future Backend

The planned production architecture is:

```text
React
  ↓
API Gateway / BFF
  ↓
Java + Spring Boot
  ↓
PostgreSQL
Redis
Elasticsearch / OpenSearch
Kafka
  ↓
Payment / Shipping / Notification Providers
```

Important backend concerns will include:

- JWT/OAuth authentication
- RBAC and tenant isolation
- DTO validation
- Idempotency
- Transactional inventory reservations
- Outbox/event publishing
- API versioning
- Structured error handling
- Audit logging
- Observability

---

## Development Status

- Build: **PASS**
- TypeScript: **PASS**
- Production build: **PASS**
- Git working tree: **CLEAN**
- Automated tests: **Not configured yet**
- ESLint: **Not configured yet**

---

## What This Project Demonstrates

NOVA demonstrates how a marketplace can be designed with **shared domain models, clear service boundaries, protected application areas, and a backend-ready architecture**.

The main goal is not just the storefront UI, but showing how **customer commerce, seller operations, inventory, fulfillment, administration, and engagement** can work together in one scalable application.

---
