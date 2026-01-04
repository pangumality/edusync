I will fix the "Invalid Prisma invocation" error which is causing the logout issue.

The root cause is likely that `process.env.DATABASE_URL` is undefined in `authMiddleware.js` because imports are evaluated before `dotenv.config()` runs in `app.js`. This causes the database connection to fail when verifying the user's session.

Plan:
1.  Check `src/index.js` to see how the application boots and if environment variables are loaded there.
2.  Create a dedicated `src/config/db.js` file to handle the Prisma client initialization centrally. This prevents multiple instances and ensures cleaner code.
3.  Update `src/middleware/authMiddleware.js` to import the shared `prisma` instance from `src/config/db.js` instead of creating its own.
4.  Update `src/app.js` to also use the shared `prisma` instance and ensure `dotenv` is configured correctly (using `import 'dotenv/config'` or ensuring it runs before other imports).
5.  Restart the backend server.

This will ensure the database connection is correctly established before the authentication middleware tries to use it.