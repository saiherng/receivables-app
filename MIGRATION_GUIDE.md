# Migration Guide: Server-Side to Client-Side Supabase

This guide will help you complete the migration from server-side API routes to client-side Supabase SDK.

## What Changed

1. **Removed server-side API routes** - All `/api/*` routes have been deleted
2. **Updated API service** - Now uses Supabase client directly instead of HTTP requests
3. **Removed server-side authentication** - No more `supabase-server.ts` or `auth-utils.ts`
4. **Updated dependencies** - Removed server-side authentication helpers

## Steps to Complete Migration

### 1. Update Database Schema

Run the migration script in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-migration.sql`
4. Execute the script

This will:
- Add `user_id` columns to all tables
- Enable Row Level Security (RLS)
- Create RLS policies for user isolation
- Add triggers to automatically set `user_id` on insert
- Create performance indexes

### 2. Update Environment Variables

Remove the service role key from your `.env.local` file:

```bash
# Remove this line
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Keep only:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Updated Dependencies

Run the following command to install the updated dependencies:

```bash
npm install --legacy-peer-deps
```

### 4. Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test the following functionality:
   - User authentication (login/logout)
   - Creating receivables
   - Viewing receivables
   - Creating payments
   - Viewing payments
   - Customer management

## How Security Now Works

### Row Level Security (RLS)
- Users can only see their own data
- RLS policies automatically filter data based on `auth.uid()`
- No manual filtering needed in the application code

### Authentication
- Uses Supabase client-side authentication
- Automatic token refresh
- Session management through Supabase

### Authorization
- Database-level security through RLS policies
- User isolation is enforced at the database level
- No need for manual permission checks in application code

## Benefits of This Approach

1. **Better Performance** - No server-side API overhead
2. **Simpler Architecture** - Fewer moving parts
3. **Better Security** - Database-level security with RLS
4. **Easier Maintenance** - Less code to maintain
5. **Real-time Capabilities** - Can easily add real-time subscriptions

## Troubleshooting

### "user_id column does not exist" Error
- Make sure you've run the database migration script
- Check that the migration completed successfully
- Verify RLS policies are in place

### Authentication Issues
- Ensure your environment variables are correct
- Check that Supabase Auth is properly configured
- Verify the user is signed in

### Data Not Loading
- Check browser console for errors
- Verify RLS policies are working
- Ensure the user has the correct permissions

## Rollback Plan

If you need to rollback:

1. Restore the server-side API routes from git history
2. Restore `supabase-server.ts` and `auth-utils.ts`
3. Add back the server-side dependencies
4. Disable RLS policies in the database

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Supabase configuration
3. Test with a fresh user account
4. Check the Supabase logs for database errors
