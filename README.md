# Velvetique Beauty Storefront

A responsive clean-beauty storefront inspired by the supplied visual reference. The project is implemented with browser-native HTML, CSS, and JavaScript. It has no framework, build step, package manifest, or server-side component.

## Features

- Hash-based single-page navigation. Route changes render in place without reloading the document.
- JSON-backed category, product, collection, and journal content rendered by JavaScript.
- Product catalog with category filtering, price sorting, and live search.
- Shopping bag with add, remove, and quantity controls. Bag contents persist in `localStorage`.
- Responsive navigation, product grids, forms, and page layouts for desktop and mobile.
- Client-side validation with inline feedback for contact and newsletter forms.
- Semantic page structure, accessible labels and status messages, and reduced-motion support.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Document shell, navigation, footer, search dialog, and JSON catalog data |
| `styles.css` | Visual design, responsive layouts, and motion preferences |
| `app.js` | Routing, rendering, search, product filters, cart state, and form handling |
| `README.md` | Project documentation and setup instructions |

## Run locally

No install or build step is required. The simplest option is to open `index.html` in a modern browser. A local static server is also supported; with Node.js installed, run this from the project directory:

```powershell
npx serve .
```

Open the local address printed by the command. The page uses Google Fonts and product/editorial photography hosted by Unsplash, so an internet connection is needed for those assets. The application itself has no runtime package dependencies.

## Routes

| Hash route | View |
| --- | --- |
| `#/` | Home, category links, promotion, and featured products |
| `#/shop` | Full product catalog, category filters, and sorting |
| `#/collections` | Curated collection list |
| `#/about` | Brand story |
| `#/journal` | Editorial article cards |
| `#/contact` | Contact form and customer-care details |
| `#/account` | Account placeholder |
| `#/cart` | Persistent shopping bag and order summary |

Category links can include a query parameter, for example `#/shop?category=Skincare`. Unknown route names fall back to the home view. The journal article links are presentation-only and currently return to the journal listing.

## Catalog data

The catalog is embedded as JSON in the `<script id="catalog-data" type="application/json">` element in `index.html`. On startup, `app.js` parses this data and uses it to render the store views. Update the JSON arrays there to change categories, products, collections, or journal cards. Product records include an ID, display name, category, price, image URL, and rating information; featured products also have a `featured` flag.

Images are external Unsplash URLs. Replace those URLs with your own hosted assets if the store needs to work without an internet connection or use branded product photography.

## Interactions and validation

- Product cards add items to the bag; quantity buttons and remove controls update the order summary immediately.
- Cart data is stored in browser `localStorage` under `velvetique-cart`. It is local to the current browser and is not shared across devices.
- Search matches product names, categories, and descriptions as the user types.
- Category chips filter the catalog, and the sort menu orders products by price.
- Favorites are temporary visual state and are not persisted.
- Contact validation checks required name, email, topic, and message fields; name and message also have minimum lengths. Newsletter validation checks for a valid email address.
- Form submissions only display local confirmation messages. They are not sent to a server and do not save customer information.
- Checkout is a placeholder interaction. No payment, tax, shipping calculation, user account, or order processing is connected.

Client-side validation improves feedback but is not a substitute for server-side validation in a production store. Do not collect real customer or payment details with this demo.

## Browser support and checks

Use a current version of Chrome, Edge, Firefox, or Safari. The project uses modern browser APIs including hash navigation, `localStorage`, the dialog element, and `Array.prototype.toSorted`.

There is no automated test suite or build command. A quick manual smoke test is:

1. Open the home page and navigate to Shop and Collections. The document should not reload when the hash changes.
2. Filter and sort the catalog, then search for a product.
3. Add a product to the bag, change its quantity, reload the page, and confirm the bag remains saved.
4. Submit the contact form empty and check for inline validation, then enter valid details and confirm the local success message.
5. Resize to a narrow mobile viewport and confirm the menu, product grid, and forms fit the screen.