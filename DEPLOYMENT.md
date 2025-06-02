# HomeShare Deployment Guide

This guide will help you deploy the HomeShare Next.js application to production.

## Prerequisites

- Node.js 18+ installed
- Git repository
- Vercel account (recommended) or other hosting platform
- PostgreSQL database (we recommend Neon, Supabase, or PlanetScale)

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Set up Database

1. **Create a PostgreSQL database:**
   - **Neon** (recommended): https://neon.tech
   - **Supabase**: https://supabase.com
   - **PlanetScale**: https://planetscale.com
   - **Railway**: https://railway.app

2. **Get your database connection string:**
   ```
   postgresql://username:password@host:port/database?schema=public
   ```

#### Step 2: Set up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or use existing one
3. Get your API keys from the dashboard
4. Set up webhook endpoint (we'll configure this after deployment)

#### Step 3: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy the application:**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel:**
   Go to your Vercel dashboard → Project → Settings → Environment Variables

   Add these variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   CLERK_WEBHOOK_SECRET=whsec_... (get this from Clerk webhook settings)
   ```

5. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

#### Step 4: Set up Clerk Webhook

1. In Clerk Dashboard, go to Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the webhook secret and add it to Vercel environment variables as `CLERK_WEBHOOK_SECRET`

#### Step 5: Initialize Database

After deployment, run database migrations:

1. **Using Vercel CLI:**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   npx prisma db seed
   ```

2. **Or using the deployed app:**
   The migrations will run automatically during the build process.

### Option 2: Deploy to Other Platforms

#### Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

#### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set environment variables in Netlify dashboard

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Configure environment variables

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook secret | `whsec_...` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign in URL | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign up URL | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect after sign in | `/` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect after sign up | `/` |

## Post-Deployment Checklist

- [ ] Database is connected and migrations are applied
- [ ] Clerk authentication is working
- [ ] Webhook endpoint is configured and receiving events
- [ ] Users can sign up and sign in
- [ ] Listings can be created and viewed
- [ ] Booking system is functional
- [ ] Token system is working

## Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Check DATABASE_URL format
   - Ensure database is accessible from your hosting platform
   - Verify SSL settings if required

2. **Clerk authentication not working:**
   - Verify API keys are correct
   - Check domain settings in Clerk dashboard
   - Ensure webhook endpoint is accessible

3. **Build failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

### Getting Help

- Check the application logs in your hosting platform
- Review Clerk dashboard for authentication issues
- Check database logs for connection problems
- Open an issue in the repository if needed

## Security Considerations

- Never commit `.env.local` or `.env` files to version control
- Use strong, unique secrets for production
- Enable HTTPS in production
- Regularly update dependencies
- Monitor for security vulnerabilities

## Performance Optimization

- Enable caching in your hosting platform
- Use CDN for static assets
- Optimize images and assets
- Monitor application performance
- Set up error tracking (e.g., Sentry)
