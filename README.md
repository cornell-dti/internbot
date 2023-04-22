# YASS BOT

## Also known as Yet Another Simple Slackbot.

YASS BOT is a simple Slackbot used for internal tooling purposes at [Cornell DTI](https://cornelldti.org/).

## Development

Interested in contributing? Clone/fork the repo, run `npm i` to install dependencies, and `npm run dev` to start the development server.

You'll also need some environment variables. You can find them in the Vercel project settings, or you can DM me on Slack.

Once you're ready, just open a PR and I'll review it!

For a more low-commitment way to contribute, file an issue and I'll try to get to it as soon as I can.

### Technologies

I aimed to make the bot leverage the latest (and hopefully greatest) technologies in web development. That means it's serverless, with a fully managed low-latency **Redis** database on Upstash, globally available **serverless functions** on Vercel's edge network, Vercel's **cron jobs** and **Vercel hosting**, a frontend built with the extremely trendy server-side-rendered **SvelteKit** JS framework, and continuous testing using **Vitest** and automated via **GitHub Actions**.

- [Vite](https://vitejs.dev/) for bundling and serving the app.
- [Vitest](https://vitest.dev/) for inline testing for the serverless functions.
- [SvelteKit](https://kit.svelte.dev/) for the frontend.
- [Vercel](https://vercel.com/) for hosting, serverless function deployment, and cron jobs.
- [Upstash](https://upstash.com/) for a fully managed Redis database.
- [Github Actions](https://github.com/features/actions) for continuous testing.

## Roadmap

- [x] Weekly coffee-chat pairings for everyone in the #coffee-chat channel that is also in this semester's roster.
- [x] Web-based admin dashboard to manually update the semesterly roster, trigger a pairing, or turn on/off the bot.
- [x] Ensures no pairs are ever repeated.

- [ ] Password protection for the admin dashboard.
- [ ] Birthdays!
- [ ] A better admin dashboard UI.

## License

[MIT](LICENSE)

## Contributors

- Daniel Wei (DevLead SP23)
- Michelle Li (DevLead SP23)
