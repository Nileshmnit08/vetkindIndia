# VetKind Application

This is a [Next.js](https://nextjs.org) project bootstrapped with `create-next-app` for the VetKind Veterinary Solutions platform.

## Architecture & Features

### Solution Route Map
- **Solutions Catalogue**: `/solutions` - Displays all available solutions with debounced text and category filtering.
- **Solution Detail**: `/solutions/[slug]` - A context-rich page for each specific solution (e.g., `/solutions/milk-production`).
- **Product Catalogue**: `/products` - Displays all products.
- **Product Detail**: `/products/[slug]` - Specific product details.
- **Contact & Enquiries**: `/contact` - Context-aware form that accepts `?product=slug` or `?solution=slug` parameters.

### How to Add or Edit a Solution
Currently, the application relies on Supabase for production data and a local fallback (`MOCK_SOLUTIONS`) in development mode.
1. In development, open `lib/solutions/index.ts`.
2. Locate the `MOCK_SOLUTIONS` array.
3. Add a new object conforming to the `SolutionWithRelations` interface, ensuring a unique `id` and `slug`.

### How to Connect a Solution to Products and Articles
Inside a solution object in `lib/solutions/index.ts` (or the equivalent Supabase relational tables):
- **Products**: Map relevant products into the `products` array. The UI will automatically render product cards. If the array is empty, the UI will safely fallback to a "Speak with an expert for a recommendation" state.
- **Articles**: Map relevant research articles into the `articles` array. They will be rendered in the "Knowledge Center" sidebar.

### Contact / CRM Adapter Configuration
The contact form submits data to a Next.js Server Action located at `app/actions/contact.ts`.
- **Development**: The action currently simulates a network delay and logs the payload to the console without sending a real email.
- **Production Integration**: Before launch, locate the `TODO` inside `submitContactForm()` and integrate a CRM or Email provider SDK (e.g., SendGrid, HubSpot, or Resend). You can pass the validated `data` object directly to the provider's API.

### Pre-Launch Placeholder Checklist
The following business data placeholders MUST be replaced before going to production:
- **Contact Info**: Replace `[Insert Company Street Address]`, `[Insert Phone Number]`, and `[Insert Email Address]` in `app/contact/page.tsx`.
- **Google Maps**: Embed a real Google Maps iframe in the placeholder container within `app/contact/page.tsx`.
- **WhatsApp Number**: Ensure the `NEXT_PUBLIC_WHATSAPP_NUMBER` environment variable is set to the correct international format (e.g., `+911234567890`) in your production environment.
- **Legal & Disclaimer Copy**: Verify the accuracy of the veterinary disclaimers and ensure Privacy Policy/TOS links point to real documents.

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
