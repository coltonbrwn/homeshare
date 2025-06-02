# HomeShare - Token-Based Home Sharing Platform

A modern home sharing platform built with Next.js 13, featuring a token-based economy, user authentication, and comprehensive booking management.

## ✨ Features

- **🏠 Property Listings**: Create and browse home listings with detailed information
- **🪙 Token Economy**: Token-based payment system for bookings
- **📅 Booking Management**: Complete booking flow with availability checking
- **👤 User Authentication**: Secure authentication with Clerk
- **💳 Token Purchasing**: In-app token purchase system
- **📱 Responsive Design**: Mobile-first responsive design
- **🔍 Search & Filters**: Advanced search and filtering capabilities
- **⭐ Reviews System**: User reviews and ratings
- **📊 Dashboard**: User dashboard for managing listings and bookings

## 🚀 Tech Stack

- **Framework**: Next.js 13 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- Clerk account for authentication

### 1. Clone and Install

```bash
git clone <repository-url>
cd homeshare-next-bolt
npm install
```

### 2. Database Setup

Choose one of these options for your PostgreSQL database:

- **Neon** (recommended): [neon.tech](https://neon.tech) - Free tier available
- **Supabase**: [supabase.com](https://supabase.com) - Free tier available  
- **Railway**: [railway.app](https://railway.app) - Simple setup
- **Local PostgreSQL**: Install locally

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.

### 3. Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Update `.env.local` with your values:
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 4. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📦 Deployment

### Quick Deploy

```bash
./deploy.sh
```

### Manual Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard
5. Configure Clerk webhook endpoint

## 📁 Project Structure

```
├── app/                    # Next.js 13 app directory
│   ├── actions.ts         # Server actions
│   ├── types.ts           # TypeScript types
│   ├── booking/           # Booking pages
│   ├── dashboard/         # User dashboard
│   ├── explore/           # Listing exploration
│   └── listing/           # Individual listing pages
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── BookingForm.tsx   # Booking form component
│   └── TokenPurchaseDialog.tsx
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Migration files
│   └── seed.ts          # Database seeding
├── lib/                  # Utility functions
└── docs/                 # Documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open database browser
- `npm run db:seed` - Seed database with sample data

## 🎯 Key Features Explained

### Token Economy
- Users start with 100 tokens
- Purchase additional tokens through in-app system
- Tokens are deducted when bookings are confirmed
- Transparent pricing with token-to-dollar conversion

### Booking Flow
1. User selects dates on listing page
2. System calculates total cost in tokens
3. Validates user has sufficient tokens
4. Prompts for token purchase if needed
5. Creates booking and deducts tokens
6. Shows confirmation page

### User Management
- Secure authentication with Clerk
- User profiles with token balances
- Dashboard for managing listings and bookings
- Review system for completed stays

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database issues
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- Open an issue for bugs or feature requests

## 🔗 Links

- [Live Demo](https://your-deployed-app.vercel.app)
- [Documentation](./docs/)
- [API Reference](./docs/api.md)
