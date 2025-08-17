# Receivables App

A Next.js application for managing customer receivables and payments with Supabase backend.

## Features

- Customer management with receivables tracking
- Payment recording and history
- Real-time data updates
- Responsive design with Chakra UI

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **Set up the database**
   - Go to your Supabase Dashboard → SQL Editor
   - Run the `supabase-schema-with-auth.sql` script

4. **Disable RLS for development**
   - Go to your Supabase Dashboard → SQL Editor
   - Run the `fix-rls-policies.sql` script

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:3000`

## API Endpoints

### Receivables
- `GET /api/receivables` - Get all receivables
- `POST /api/receivables` - Create a new receivable
- `GET /api/receivables/[id]` - Get a specific receivable
- `PUT /api/receivables/[id]` - Update a receivable
- `DELETE /api/receivables/[id]` - Delete a receivable

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create a new payment
- `GET /api/payments/[id]` - Get a specific payment
- `PUT /api/payments/[id]` - Update a payment
- `DELETE /api/payments/[id]` - Delete a payment

## Database Schema

### Receivables Table
- `id` (uuid, primary key)
- `date` (date)
- `customer_name` (text)
- `amount` (numeric)
- `city` (text)
- `description` (text, nullable)
- `created_at` (timestamp)

### Payments Table
- `id` (uuid, primary key)
- `receivable_id` (uuid, foreign key)
- `payment_date` (date)
- `payment_amount` (numeric)
- `payment_type` (text)
- `notes` (text, nullable)
- `created_at` (timestamp)

## Technologies Used

- **Frontend**: Next.js 15, React, TypeScript
- **UI**: Chakra UI
- **Backend**: Supabase (PostgreSQL, Auth)
