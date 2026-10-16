# ShopSphere Frontend

A React + Vite storefront with product browsing, a small client-side bag, and a demo order form.

## Requirements

Node.js 22 or a currently supported LTS release, plus npm.

## Run locally

In this directory:

```bash
npm install
npm run dev
```

Vite prints the local URL after startup (normally `http://localhost:5173`).

The backend services must be running separately. By default, the frontend calls Product Service at `http://localhost:8080` and Order Service at `http://localhost:8081`. Override these with Vite environment variables:

```bash
VITE_PRODUCT_API_URL=http://localhost:8080 VITE_ORDER_API_URL=http://localhost:8081 npm run dev
```

These URLs are public client-side configuration, not secrets. Do not put credentials in `VITE_*` variables because they are bundled into browser code.

## Production build

```bash
npm run build
npm run preview
```

## Current limitations

- No authentication, payment processing, or persistent cart.
- Orders and products are demo data held by backend processes.
- Backend CORS configuration and a same-origin production routing layer will be added in the container/deployment milestone.