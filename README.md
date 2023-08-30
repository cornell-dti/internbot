# Internbot

Simple serverless Slack bot for DTI Coffee Chats and Birthday messages!

Should pair up people in the `#coffee-chats` channel every week.

## Technology

Built with Vercel, PostgreSQL, Prisma, Next.js, Jest, and TypeScript.

Specifically,

-   Vercel Cron for scheduling
-   Vercel Serverless Functions for API
-   Vercel Serverless Database for PostgreSQL
-   Prisma for Object-Relational Mapping
-   TypeScript for type safety
-   Next.js for React Framework
    -   Experimental: React Server Components with Server Actions, to deliver
        server-side-rendered React components with server actions (e.g. database manipulations)
        co-located within the component.
    -   Experimental: App Directory for organizing Next.js pages, layouts, error handling and
        routing.
    -   And More Features! (Async components and Suspense; Parallel Routes, etc.)
-   Tailwind CSS for styling
-   Jest for testing
-   Clerk for authentication

## Development

```bash
pnpm install              # Install Dependencies
pnpm dlx prisma generate  # Generate Prisma type definitions
pnpm dev                  # Start Development Server
pnpm test                 # Run Tests
```

## Roadmap

### Features

-   [x] Populate database with Slack users biannually or manually.
-   [x] Send out coffee chat pairings on a weekly basis or manually.
-   [x] Authentication with Slack, limited to emails in the database.
-   [x] Edit user info: active/inactive, birthday.
-   [x] Global bot disable/enable.
-   [x] Send out birthday messages whenever a user's birthday is today!

### !Testing!

-   [x] Add Github Actions for testing.
-   [x] Add unit tests for pairing algorithm, including when bot is disabled.
-   [x] Add unit tests for birthday messaging, including when bot is disabled.
-   [ ] Add unit tests for populating the database correctly.
-   [ ] Add unit tests for all components.

### Improvements

-   [x] Polish up the UI.
    -   [ ] Bulk Editing ?
-   [ ] Add migration scripts for clearing out old semesters, schema changes, etc.
-   [ ] Add remaining cronjob in `oldvercel.json` to `vercel.json`.
