# **Knock + Node.js example app**

This example app uses [Knock](https://knock.app) to power cross channel notifications via email, an in-app feed, and Slack inside of a full-stack Node  application, written in [Blitz.js](https://blitzjs.com/). It uses the [Knock Node SDK](https://github.com/knocklabs/knock-node) and [React in-app feed components](https://github.com/knocklabs/react-notification-feed).

You can read more about this example app [in the Knock documentation](https://docs.knock.app/getting-started/example-app).

## Running locally

First, configure the environment variables properly.

Then run:

```
blitz prisma migrate dev
```

Then, lets get the database populated with seed data by running:

```
blitz db seed
```

Finally, we can start the development server by running:

```
blitz dev
```

You can take a look at the seed users credentials on the seed file in order to log in.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Ensure the `.env.local` file has required environment variables:

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/example-collaboration-app

# Required for triggering Knock workflows
KNOCK_API_KEY=<Knock server api key>

# Required for Knock's notification React feed component to render correctly
BLITZ_PUBLIC_KNOCK_CLIENT_ID=<Knock client key>
BLITZ_PUBLIC_KNOCK_FEED_ID=<Knock in app feed channel id>

# For Slack notifications
BLITZ_PUBLIC_SLACK_CLIENT_KEY=<Slack client id>
SLACK_CLIENT_SECRET=<Slack app client secrent>
BLITZ_PUBLIC_SLACK_REDIRECT_URI=<Slack redirect URI>
KNOCK_SLACK_CHANNEL_ID=<id of a Slack channel in Knock>
```

Ensure the `.env.test.local` file has required environment variables:

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/example-collaboration-app_test
```

## Slack notifications

In order for Slack notifications to work, you will need to expose an endpoint that Slack can access
as part of the OAuth workflow. An easy way of doing this is installing [ngrok](https://ngrok.com/) and creating a public tunnel
to your local web server.
