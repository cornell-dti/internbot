# Internbot

Simple serverless Slack bot for DTI Coffee Chats.

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
    -   React, including the latest features (e.g. async components and Suspense)
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
-   [ ] Send out birthday messages whenever a user's birthday is today!
-   [ ] Send out coffee chat follow-up messages after 5 days.

### !Testing!

-   [x] Add Github Actions for testing.
-   [x] Add unit tests for pairing algorithm.
-   [ ] Add unit tests for populating the database.
-   [ ] Add unit tests for all components.
-   [ ] Add unit tests for changing user info (birthday, active/inactive).
-   [ ] Add unit tests for sending birthday messages, follow-up messages.

### Improvements

-   [ ] Polish up the UI.
    -   [ ] We should be able to instantly any specific user's birthday and activity.
    -   [ ] We should be able to see all such users in a single page.
    -   [ ] The entire aesthetic should be improved at least somewhat.
-   [ ] Separate out actions into separate components within `/gated` and `/nongated`.
-   [ ] Add migration scripts for clearing out old semesters, schema changes, etc.
