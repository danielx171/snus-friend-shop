# Nyehandel API Reference
> Source of truth for all Nyehandel integration work on snus-friend-shop.
> Read directly from the live docs at https://docs.nyapi.se

---

## Connection

| Key | Value |
|-----|-------|
| Base URL | `https://api.nyehandel.se/api/v2` |
| Default language | `sv` (Swedish) |
| Data format | JSON only |

**Required headers on every request:**
```
X-identifier: {identifier from Nyehandel}
Authorization: Bearer {API key from Nyehandel}
Content-Type: application/json
Accept: application/json
```

**Optional language header:**
```
X-Language: en
```

---

## Core Concept: Products vs Variants

This is fundamental to understanding the catalog:

- A **Product** holds shared data: name, description, slug, categories, brand, supplier, meta title/description, VAT rate, status
- A **Variant** holds SKU-specific data: SKU, GTIN, stock, weight, price, compare_price, purchase_price, options (colour/size/etc)
- Every product has **one or more variants** — always
- When you fetch a product via the API, all its variants are included in the response

**Product statuses:** `draft` | `published` | `inactive` | `pending_retirement` | `retired`

**Product types:** `standard` | `inventory_item` | `pre_order_item`

**VAT rates (integer, in basis points):** `2500` (25%) | `1200` (12%) | `600` (6%) | `0` (0%)

**Prices are integers in lowest currency unit** — e.g. 15000 = 150.00 SEK

---

## Orders

### Order Statuses
`open` | `approved` | `deliverable` | `shipped` | `partially-delivered` | `canceled` | `awaiting-delivery` | `awaiting-payment` | `backlisted` | `external`

---

### GET /orders/{order_id}
Fetch a single order.

**Path param:** `order_id` (string, required)

**Returns:** Full order object including:
- `id`, `status`, `currency_iso`, `locale`
- `order_items[]` — each with id, sku, gtin, name, type, quantity, delivered, vat_rate, unit_price, total_amount, image_url, variant_url
- `customer` — id, type, firstname, lastname, email, phone, billing_address, shipping_address
- `billing_address`, `shipping_address`
- `shipping` — id, name, identifier, vat_rate, total_amount
- `payment` — id, name, vat_rate, total_amount
- `shipments[]`
- `shipped_at`, `created_at`, `updated_at`
- `is_high_priority`, `reference`, `checkout_message`, `warehouse_note`

---

### GET /orders
List orders with pagination and filtering.

**Query params:**
- `per_page` — integer, 1–100, default 50
- `page` — integer, default 1
- `filters[field][operator]` — filter value

**Available filter fields:** `id` | `created_at` | `updated_at` | `shipped_at` | `canceled_at` | `status`

**Available operators:** `eq` | `lt` | `lte` | `gt` | `gte`

> Note: `status` only supports `eq` operator

**Example:** `GET /orders?filters[status][eq]=open&filters[created_at][gte]=2025-01-01`

---

### POST /orders
Full order creation with prices.

**Key body fields:**
```json
{
  "currency_iso": "SEK",
  "locale": "SV-se",
  "action": "approve",
  "reference": "string",
  "marking": "string",
  "checkout_message": "string (max 255)",
  "delivery_date": "2024-01-01",
  "warehouse_note": "string",
  "customer": {
    "type": "person | organization",
    "email": "required",
    "phone": "optional",
    "ssn": "optional",
    "organization_number": "optional"
  },
  "billing_address": { "firstname", "lastname", "address", "postcode", "city", "country" },
  "shipping_address": { "optional — same shape as billing" },
  "shipping": { "name": "required", "price_ex_vat": 0, "price_inc_vat": 0 },
  "payment": { "name": "required", "price_ex_vat": 0, "price_inc_vat": 0 },
  "items": [
    { "type": "product | discount", "sku": "required", "quantity": 1, "price_ex_vat": 0, "price_inc_vat": 0 }
  ]
}
```

---

### POST /orders/simple ⭐ (Used by CheckoutHandoff.tsx)
Simplified order creation — no prices needed. **This is the correct endpoint for headless B2C checkout.**

Only returns the generated `order_id` and `prefix`.

**Key differences from full create:**
- No prices on items — Nyehandel uses its own pricing
- Supports `delivery_callback_url` for tracking webhook callbacks
- `prefix` is a 2-character order number prefix

```json
{
  "prefix": "SF",
  "currency_iso": "GBP",
  "locale": "en-gb",
  "delivery_callback_url": "https://your-domain.com/webhooks/delivery",
  "customer": { "type": "person", "email": "required" },
  "billing_address": { "firstname", "lastname", "address", "postcode", "city", "country" },
  "shipping": { "name": "Postnord MyPack" },
  "payment": { "name": "Stripe" },
  "items": [
    { "type": "product", "sku": "ZYN-COOL-MINT-6", "quantity": 2 }
  ]
}
```

**Returns:** `{ "data": { "id": 12345, "prefix": "SF" } }`

---

### POST /orders/{order_id} — Update Order
Update status, items, addresses, shipping, payment, or customer on an existing order.

**Updatable fields:** `status`, `items[]`, `billing_address`, `shipping_address`, `shipping`, `payment`, `currency_iso`, `checkout_message`, `delivery_date`, `reference`, `marking`, `warehouse_note`

---

### POST /orders/{order_id}/deliver — Deliver Order
Mark order as shipped. Used by fulfilment systems.

**Body:**
```json
{
  "complete_delivery": false,
  "warehouse_id": 0,
  "items": [{ "id": "nyehandel_order_item_id", "delivered": 1 }],
  "pdf_paths": ["https://..."],
  "parcels": [{ "tracking_id": "string", "tracking_url": "https://..." }]
}
```

---

### POST /orders/{order_id}/cancel — Cancel Order
```
?refund_payment=true
?send_message=true
?send_custom_message=true&subject=...&message=...
```

---

### GET /orders/delivery-notes
Fetch delivery note PDFs.
```
?ids[]=42290&ids[]=42291
```

---

## Shipping Methods

### GET /shipping-methods
Returns all available shipping methods configured in your Nyehandel store. Use this to populate shipping options in checkout before calling `POST /orders/simple`.

---

## Products

### GET /products
List all products with pagination.

**Query params:**
- `per_page` — 1–100, default 50
- `page` — default 1
- `status` — `draft` | `published` | `inactive` | `pending_retirement` | `retired`

All variants are included in each product response.

---

### GET /products/find
Find a single product by SKU or internal ID. **Most useful endpoint for the sync process.**

```
GET /products/find?sku=ZYN-COOL-MINT-6
GET /products/find?id=36120
```

**Returns full product object** including all variants, categories, brand, supplier.

---

### POST /products — Create Product

**Required:** `name`, `variants[]` (each needs `sku`), `type`

**Optional but important:**
- `status` — defaults to draft
- `vat_rate` — 2500, 1200, 600, or 0
- `categories[]` — can create if not found (`update_on_exists: true/false`)
- `brand_name` — creates brand if not found
- `supplier_name` — creates supplier if not found
- `meta_title`, `meta_description`
- `images[]` — array of image URLs
- `filter_tags[]`
- `attributes[]` — key/value pairs
- `specifications[]` — structured spec data

**Variant fields:**
- `sku` (required), `gtin`, `stock`, `weight`, `purchase_price`, `stock_price`
- `prices[]` — `{ price, compare_price, currency_id, tier }`
- `options[]` — `{ type: "Colour", value: "Blue" }`
- `always_orderable` — boolean
- `inventories[]` — warehouse-specific stock

---

### POST /products/batch — Bulk Create
Same shape as single create, wrapped in `{ "products": [...] }`. Use for initial catalog import.

### PUT /products/batch — Bulk Update
Find products using `product_search_query` then update them in bulk.

```json
{
  "products": [
    {
      "product_search_query": { "field": "product_id", "value": "string" },
      "status": "published",
      "name": "optional",
      "description": "optional",
      "images": ["url1", "url2"],
      "categories": { "name": "string", "update_on_exists": true },
      "brand_name": "optional",
      "filter_tags": ["tag1"]
    }
  ]
}
```
> All update fields are optional — only send what you want to change.

### PUT /products/{id} — Update Product
Update any product fields individually.

### POST /products/{productId}/variants — Add Variant to Product
Add one or more variants to an existing product.

### DELETE /products/{id} — Delete Product

---

## Variants

### PUT /variants/batch — Bulk Update Variants
Update multiple variants at once by SKU.

**⚠️ CRITICAL — Price update behaviour:** When updating prices, **sibling prices are fully replaced**, not merged. A "sibling" = a price with the same currency AND customer group. Always send the complete price array you want, not just the changed price.

```json
{
  "variants": [
    {
      "sku": "ZYN-COOL-MINT-6",
      "stock": 150,
      "prices": [
        { "price": 499, "compare_price": 599, "currency_id": 1, "tier": 1 }
      ]
    }
  ]
}
```

### PUT /variants/{variantId} — Update Single Variant
**⚠️ CRITICAL — Stock vs inventories:** If you send `inventories` (warehouse-specific stock), the `stock` field is **completely ignored**. Only use one or the other.

Updatable fields: `sku`, `vat_rate`, `stock`, `weight`, `purchase_price`, `stock_price`, `package_size`, `supplier_sku`, `prices`, `gtin`, `storage_space`, `always_orderable`, `positive_inventory_status`, `negative_inventory_status`, `inventories[]`

### DELETE /variants/{variantId} — Delete Variant

### GET /variants/find — Find Variant
Search by any of: `id`, `sku`, or `gtin` (EAN barcode).
```
GET /variants/find?sku=ZYN-COOL-MINT-6
GET /variants/find?gtin=012345678905
```
Returns the variant with its parent product_id, stock, prices, weight, and all other variant fields.

---

## Payment Methods

### GET /payment-methods
Returns all payment methods configured in the store. Paginated (`page`, `limit` params).
Use to populate payment options in checkout. The `name` from this response is what you pass into `POST /orders/simple` as `payment.name`.

---

## Customers

### GET /customers/{customer_id}
Fetch a single customer by ID.

### GET /customers/
List all customers. Paginated.

### POST /customers — Create Customer
```json
{
  "customer_type": "person | organization",
  "email": "required (max 255 chars)",
  "invoice_email": "optional",
  "password": "optional (min 8 chars)",
  "organization_number": "required if organization",
  "billing_address": {
    "firstname": "required",
    "lastname": "required",
    "company_name": "required if organization",
    "address": "optional",
    "postcode": "optional",
    "city": "optional",
    "country": "required — 2-char ISO 3166-1 alpha-2 (e.g. SE, GB)"
  },
  "shipping_address": "optional — same shape as billing_address"
}
```

---

## Categories

### GET /categories/external/{external_identifier}
Look up a category by your own external reference ID — useful when syncing from an external system.

### POST /categories — Create Category
### PUT /categories/{id} — Update Category
### GET /categories/{id} — Get Single Category
### DELETE /categories/{id} — Delete Category
### GET /categories — List All Categories

**Category object fields:** id, parent_id, name, slug, description, image_url, meta_title, meta_description, active, show_in_menu, external_reference, created_at

> When creating/updating products, you can reference categories by `external_identifier` — Nyehandel will create the category if it doesn't exist (when `update_on_exists: false`).

---

## Currencies

### GET /currencies
Returns all currencies configured in your store. Use to validate `currency_iso` values before creating orders.

---

## Headless (CMS)

> ⚠️ Several Headless endpoints are marked **Developing** — treat as unstable/beta.

### GET /headless/pages/{slug} — Get Single Page *(Developing)*
### GET /headless/pages — List All Pages *(Developing)*
### GET /headless/categories — CMS Category Tree *(Developing)*
### GET /headless/categories/{slug} — Get CMS Category *(Developing)*
### GET /headless/pages/startpage — Get Startpage *(Developing)*
### GET /headless/system — Get System Config *(Developing)*

These endpoints serve CMS/storefront content from Nyehandel. Useful for category pages and the homepage if you want Nyehandel to manage content. Since they're marked developing, use with caution in production.

---

## Purchases

### GET /purchases
Returns purchase/wholesale orders. Paginated (per_page max 100, default 50).

**Same filtering system as orders:**
- Fields: `created_at`, `delivered_at`, `ordered_at`, `confirmed_at`, `delivery_date`, `status`
- Operators: `eq`, `lt`, `lte`, `gt`, `gte`
- Note: `status` only supports `eq`

Less relevant for B2C frontend but useful for back-office dashboards and inventory management tools.

---

## Suppliers

### GET /suppliers/{id} — Get Single Supplier
### GET /suppliers — List All Suppliers
Paginated (per_page max 100, default 50).

Suppliers are the wholesale sources for your products. When creating/updating products, you can assign a supplier by name using `supplier_name` — Nyehandel creates it if it doesn't exist.

---

## Webhooks

Nyehandel pushes events to your Supabase edge functions when things happen in the store.

**Setup:** Configure webhook URLs in the Nyehandel admin panel.

**Key webhook trigger:** The `delivery_callback_url` field on `POST /orders/simple` — when an order is shipped, Nyehandel POSTs tracking data to this URL. This is how your shop gets `tracking_id` and `tracking_url` per parcel.

---

## Filtering (Orders)

Available on `GET /orders` only.

**Fields:** `id` | `created_at` | `updated_at` | `shipped_at` | `canceled_at` | `status`

**Operators:** `eq` | `lt` | `lte` | `gt` | `gte`

> `status` only supports `eq`

**Example filters:**
```
filters[status][eq]=open
filters[created_at][gte]=2025-01-01
filters[shipped_at][lt]=2025-06-01
```

---

## Our Integration Architecture

```
Customer browses → React frontend (snus-friend-shop)
    ↓ adds to cart (CartContext)
    ↓ goes to CheckoutHandoff.tsx
    ↓ POST /orders/simple (SKUs + customer info)
    ↓ Nyehandel handles payment, fulfillment
    ↓ delivery_callback_url → Supabase Edge Function
    ↓ tracking info stored, customer notified

Product catalog sync:
    Nyehandel GET /products → Supabase Edge Function (sync-nyehandel)
    → products/variants upserted into Supabase DB by nyehandel_id
    → frontend reads from Supabase (fast, no API latency)

Webhook events (ops dashboard):
    Nyehandel → POST to Supabase Edge Function
    → stored in webhook_events table
    → visible in ops mock dashboard
```

---

## Support

For API questions: support@nyehandel.se

Docs: https://docs.nyapi.se
