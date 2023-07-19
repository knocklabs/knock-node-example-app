# **Knock + Node.js example app**

This example app uses [Knock](https://knock.app) to power cross channel notifications via email, an in-app feed, and Slack inside of a full-stack Node application, written in [Blitz.js](https://blitzjs.com/). It uses the [Knock Node SDK](https://github.com/knocklabs/knock-node) and [React in-app feed components](https://github.com/knocklabs/react-notification-feed).

You can read more about this example app [in the Knock documentation](https://docs.knock.app/getting-started/example-app).

## Running locally

First, configure the environment variables properly (see the bottom of this README).

Then run:

```
yarn blitz prisma migrate dev
```

Then, let's get the database populated with seed data by running:

```
yarn blitz db seed
```

Finally, we can start the development server by running:

```
yarn blitz dev
```

You can take a look at the seed users credentials in the seed file in order to log in.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Ensure the `.env.local` file has required environment variables:

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/example-collaboration-app

# Required for triggering Knock workflows
KNOCK_API_KEY=<Knock secret API key>

# Required for Knock's notification React feed component to render correctly
BLITZ_PUBLIC_KNOCK_CLIENT_ID=<Knock public API key>
BLITZ_PUBLIC_KNOCK_FEED_ID=<Knock in-app feed channel ID>

# For Slack notifications
BLITZ_PUBLIC_SLACK_CLIENT_ID=<Slack client ID>
SLACK_CLIENT_SECRET=<Slack app client secret>
BLITZ_PUBLIC_SLACK_REDIRECT_URI=<Slack redirect URI>
KNOCK_SLACK_CHANNEL_ID=<Knock Slack channel ID>
```

Ensure the `.env.test.local` file has required environment variables:

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/example-collaboration-app_test
```


Here's more context on where to find the Knock variables you'll need above:
* [Knock API keys](https://docs.knock.app/developer-tools/api-keys)
* [Knock in-app feed channel ID](https://docs.knock.app/in-app-ui/react/feed#getting-started)
* [Knock Slack channel ID](https://docs.knock.app/integrations/chat/slack/building-oauth-flow#how-to-set-slack-channel-data-in-knock)

## Slack notifications

In order for Slack notifications to work, you will need to expose an endpoint that Slack can access
as part of the OAuth workflow. An easy way of doing this is installing [ngrok](https://ngrok.com/) and creating a public tunnel
to your local web server.
