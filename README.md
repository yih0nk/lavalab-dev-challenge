# SHOPALL

A modern e-commerce platform for athletic footwear built with Next.js 16 and Supabase.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth + Email/Password)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Email**: Resend
- **Deployment**: Vercel

## Features

- **Product Catalog**: Browse new arrivals and trending products with real-time stock updates
- **Shopping Cart**: Persistent cart with size/color selection, synced across devices
- **Wishlist**: Save favorite items, share wishlists via unique links
- **User Authentication**: Sign in with Google or email/password
- **Order Management**: Checkout flow with order confirmation emails
- **Reviews**: Product reviews fetched from database with ratings
- **Responsive Design**: Mobile-first design matching Figma specifications

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Resend account (for emails)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lavalab-dev-challenge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   RESEND_API_KEY=your-resend-api-key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

Run the SQL scripts in the Supabase SQL Editor in order:

1. `supabase/schema.sql` - Create tables and RLS policies
2. `supabase/seed-products.sql` - Seed product data
3. `supabase/fix-product-images.sql` - Update product images
4. `supabase/reviews-schema.sql` - Create reviews table with sample data

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Auth callbacks
│   ├── product/[id]/      # Product detail page
│   ├── wishlist/          # Wishlist pages
│   ├── account/           # Account pages
│   └── checkout/          # Checkout page
├── components/
│   ├── auth/              # Auth modal and forms
│   ├── cart/              # Cart drawer
│   ├── home/              # Homepage sections
│   ├── layout/            # Header, Footer
│   └── ui/                # Reusable components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configs
│   └── supabase/          # Supabase client setup
├── store/                 # Zustand stores
├── data/                  # Static product data
└── types/                 # TypeScript types
```

## Deployment

The project is configured for Vercel deployment:

1. Push to your GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

For Google OAuth in production, update the authorized redirect URI in Google Cloud Console to your production domain.

## License

MIT
