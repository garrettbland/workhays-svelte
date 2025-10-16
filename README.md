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

## Developing

Run the following below to start the project. It will display the host and URL in the output of the command. We use netlifys CLI to run to test locally running functions.

```bash
npx netlify dev
```

## Scheduled Functions

Scheduled functions are defined in `netlify.toml`. It currently only runs one at 8:00 or 9:00 am depending on daylight savings time. It uses crontab expressions, not regular so it's more readable but not exactly the same.

Scheduled functions can be tested by running `npx netlify dev`, and then going to the locally running host and adding `/.netlify/functions/xxx`. Example...

```
http://localhost:8888/.netlify/functions/check-job-expiration
```
