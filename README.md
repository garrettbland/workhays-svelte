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
