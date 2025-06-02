# Database Setup Guide

This application uses PostgreSQL for both development and production environments.

## Quick Setup Options

### Option 1: Neon (Recommended for Development)

1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string from the dashboard
4. Update your `.env.local` file:
   ```
   DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb"
   ```

### Option 2: Supabase

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (URI format)
5. Update your `.env.local` file:
   ```
   DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
   ```

### Option 3: Railway

1. Go to [Railway](https://railway.app) and create an account
2. Create a new project and add PostgreSQL service
3. Copy the connection string from the Variables tab
4. Update your `.env.local` file:
   ```
   DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"
   ```

### Option 4: Local PostgreSQL

1. Install PostgreSQL locally:
   - **macOS**: `brew install postgresql`
   - **Ubuntu**: `sudo apt-get install postgresql`
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)

2. Start PostgreSQL service:
   - **macOS**: `brew services start postgresql`
   - **Ubuntu**: `sudo systemctl start postgresql`
   - **Windows**: Use Services app or pgAdmin

3. Create a database:
   ```bash
   createdb homeshare_dev
   ```

4. Update your `.env.local` file:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/homeshare_dev"
   ```

## After Setting Up Database

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Run Database Migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Seed the Database (Optional):**
   ```bash
   npm run db:seed
   ```

4. **Test the Connection:**
   ```bash
   npx prisma studio
   ```
   This will open Prisma Studio in your browser to view your database.

## Production Setup

For production, use the same database provider or a production-tier service:

- **Neon**: Upgrade to Pro for production features
- **Supabase**: Use production project
- **Railway**: Use production environment
- **PlanetScale**: Great for production with branching
- **AWS RDS**: Enterprise-grade PostgreSQL

## Environment Variables

Make sure to set these in your deployment platform (Vercel, Netlify, etc.):

```
DATABASE_URL="your_production_postgresql_connection_string"
```

## Troubleshooting

### Connection Issues

1. **Check connection string format:**
   ```
   postgresql://username:password@host:port/database
   ```

2. **Verify database exists and is accessible**

3. **Check firewall/network settings**

### Migration Issues

1. **Reset database (development only):**
   ```bash
   npx prisma migrate reset
   ```

2. **Deploy migrations to production:**
   ```bash
   npx prisma migrate deploy
   ```

### Common Errors

- **"database does not exist"**: Create the database first
- **"connection refused"**: Check if PostgreSQL is running
- **"authentication failed"**: Verify username/password
- **"SSL required"**: Add `?sslmode=require` to connection string

## Database Schema

The application uses these main tables:
- `User` - User accounts and token balances
- `Listing` - Property listings
- `Booking` - Booking records
- `Review` - User reviews
- `Availability` - Listing availability periods

All tables are automatically created when you run migrations.
