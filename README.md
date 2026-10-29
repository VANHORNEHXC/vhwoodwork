# VH Woodwork

Next.js storefront and administration for Dario VanHorne. Shipping and studio pickup originate in Coral Springs, Florida.

## Local setup

Install dependencies with `npm install`. Configure `.env.local` with:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PIN_SALT` | Random salt for the PIN hash |
| `ADMIN_PIN_HASH` | Hex encoded scrypt hash of the PIN |
| `ADMIN_SESSION_SECRET` | Random secret of at least 32 characters for signed sessions |

Generate a salt and PIN hash with Node's `crypto.scryptSync`. Keep the plain PIN outside source control and share it only with the owner. `.env.local` is ignored by Git. The production host needs the same five variables configured in its environment.

Run the committed migration with `npx drizzle-kit migrate`, then `npm run db:seed` to insert the initial catalog without overwriting existing inventory. Start the site with `npm run dev`. The dashboard is at `/admin`.

## Store operations

The dashboard shows order activity, lets the owner update payment and fulfillment status, tracking, and notes, and supports adding, editing, and deleting inventory. Inventory changes are saved in Postgres and appear in the public catalog.

Order forms save pending requests. Customers are **not charged** at submission. The displayed amount is an estimate before applicable sales tax; the studio must confirm the destination, final tax, and payment before marking an order paid. Stripe and PayPal are recorded as payment preferences. Configure a tax calculation and invoicing workflow before enabling automatic charging.

The customer review section is ready for real testimonials; no reviews are invented. The owner's portrait should be added to the project once the supplied image file is available.
