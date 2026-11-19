
# Haveje IF Booking

A React and Supabase booking application.

## First-time setup

1. Open the Supabase project SQL editor.
2. Run [supabase/schema.sql](supabase/schema.sql).
3. In Supabase Authentication, enable Email provider.
4. Create the first admin user through the app signup page, then set that user's `profiles.role` to `ADMIN` in the Supabase table editor.
5. Install dependencies and start the app:

```powershell
npm install
npm run dev
```

The Supabase URL and publishable key are configured in `.env.local`.