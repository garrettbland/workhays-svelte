# Work Hays

Work Hays using SvelteKit

# Environment Variables

Must create a `.env` file locally for some firebase admin functions to work

Example `.env` file that also needs uploaded to host

```txt
PROJECT_ID=""
PRIVATE_KEY=""
CLIENT_EMAIL=""
MAILGUN_API_KEY=""
MAILGUN_DOMAIN=""
```

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli)

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Scheduled Functions

Scheduled functions are defined in `vercel.json`, and the vercel function (different from sveltekit api endpoints) are in `/api/*`.

To test locally, run `npx tsx filename.ts`. We can't test them locally with sveltekit and being a scheduled function.

```text
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday=0)
│ │ │ │ │
0 9 * * *
```

```
0 → minute 0
9 → hour 9
* → every day of the month
* → every month
* → every day of the week
```

So for example, `check-job-expiration` runs once per day at 09:00 UTC with `0 9 * * *`. In our `vercel.json` file, I set it to `0 15 * * *` to run with the UTC offset, so it's 9:00 or 10:00 am depending on the time saving.
