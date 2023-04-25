# Intern Bot

InternalBot, or InternBot for short, is a simple Slackbot used for internal tooling purposes at [Cornell DTI](https://cornelldti.org/). It helps foster community culture within our team, and if you want to use it to foster team spirit for your own team as well, feel free to fork it!

## Development

Interested in contributing? Clone/fork the repo, run `npm i` to install dependencies, and `npm run dev` to start the development server.

You'll also need some environment variables. You can find them in the Vercel project settings, or you can DM me on Slack.

1. The frontend is in `src/routes/+page.svelte` . Svelte is quite simple: Typescript in `<script></script>`, css in `<style></style>` and `html` everywhere else. The fetch requests within will fetch from the middleware :arrow_down: . As the dashboard increases in complexity we can refactor some components out.
2. Middleware (serverless functions that automatically scale to demand!) are in `src/routes/api/[endpointName]/+server.ts` and are just regular POST/GET handlers. The big complex one is /coffeechat -- the others are mostly getters and setters for the Redis database :arrow_down: .
3. I went with Redis because Slack has apparently some pretty strict timeOut boundaries and I didn't want to run over (you're supposed to return 200 OK first, and then do your side effects, or something. I'd rather not.). It's just a super-fast key-value store that runs out of pure RAM so we'll never have many performance issues. It helps handle the fact that it spikes once a week a bit better too :arrow_down: .
4. The cron job config is in vercel.json in root. It just describes the path to the endpoint to hit, and the cron config for when to hit it. I set it to mondays at midnight currently.

On Github, just opening a PR should run `npm test` which uses Vitest under the hood.

Once you're ready, just open a PR and I'll review it!

For a more low-commitment way to contribute, file an issue and I'll try to get to it as soon as I can.

### Technologies

I aimed to make the bot leverage the latest (and hopefully greatest) technologies in web development. The goal is performance and ease of maintainability.

To accomplish this, I aimed for serverless architecture, with a fully managed low-latency **Redis** database on Upstash, globally available **serverless functions** on Vercel's edge network, Vercel's **cron jobs** and **Vercel hosting**, a frontend built with the extremely trendy server-side-rendered **SvelteKit** JS framework, and continuous testing using **Vitest** and automated via **GitHub Actions**.

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
- [x] Password protection for the admin dashboard.
- [ ] Better testing (see Issue #8)
- [ ] Authentication for DTI members in order to shorten and view shortened links -- rather than password protection.
- [ ] Password gate should redirect -- not hide.
- [ ] Rate limiting on the API (see PR #7)
- [ ] Birthdays!
- [ ] A better admin dashboard UI: modifying and storing constants such as the message template, and coffee-chats channel ID, as well as more intuitive roster management.

## License

[MIT](LICENSE)

## Contributors

- Daniel Wei (DevLead SP23)
