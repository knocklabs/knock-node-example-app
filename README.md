# **Knock + Node.js example app**

## Archive notice
As of March 2024, this repository has been moved to a read-only archive. It's still usable and contains useful information, but we'll be porting this application to a newer version of Next.js in the very near future. In the meantime, you can check out the [example apps section](https://docs.knock.app/getting-started/example-app) of the Knock docs for a list of our example apps.

This example app uses [Knock](https://knock.app) to power cross channel notifications via email, an in-app feed, and Slack inside of a full-stack Node application, written in [Blitz.js](https://blitzjs.com/). It uses the [Knock Node SDK](https://github.com/knocklabs/knock-node) and [React in-app feed components](https://github.com/knocklabs/react-notification-feed).

You can read more about this example app [in the Knock documentation](https://docs.knock.app/getting-started/example-app#nodejs-example-app).

## Set up

### In the Knock dashboard

[Sign up for a Knock account](https://dashboard.knock.app/signup) to configure channels and workflows for the app to work as expected. Once you've created your Knock account you will need to create channels and workflows to work with your application.

1. Create an email channel and an in-app feed channel.
   - You'll need to use an existing email provider like [Postmark](https://postmark.com/) to use in your email channel in the Knock dashboard.
2. A workflow in Knock with the key `welcome`. It should include an email step for your welcome email template.
3. A workflow in Knock with the key `new-comment`. It should include: an in-app feed step and an email step. On these step's templates you can use the following variables which the example app is already configured to send as arguments on the workflow trigger call:
   1. `comment_content`: The content of the created comment.
   2. `asset_name`: The name of the commented asset.
   3. `asset_url`: The url of the commented asset.
   4. `project_name`: The name of the project that the comment asset belongs to.
4. A workflow in Knock with the key `new-asset`. It should include: an in-app feed step and an email step. On these step's templates you can use the following variables which the example app is already configured to send as arguments on the workflow trigger call:
   1. `asset_url`: The url of the commented asset.
   2. `project_name`: The name of the project that the comment asset belongs to.

> **🚀 Tip: auto-create workflows with the CLI 🚀** <br> The example app repo contains a `knock/workflows` directory with the three workflows listed above. You can use the [Knock CLI](https://docs.knock.app/cli) to push these workflows into your Knock account using the `knock workflow push --all` command.

### On your machine

**1. Clone project**

```
git clone git@github.com:knocklabs/knock-node-example-app.git
cd knock-node-example-app
```

**2. Install dependencies**

```
yarn
```

**3. Create your `.env` file and copy the content from `.env.sample`**

Set the necessary environment variables. To get started with triggering workflows and the in-app feed, you must have variables set for the following:

- `DATABASE_URL`
- `KNOCK_API_KEY`
- `BLITZ_PUBLIC_KNOCK_CLIENT_ID`
- `BLITZ_PUBLIC_KNOCK_FEED_ID`

Here's more context on where to find the Knock variables:

- [Knock API keys](https://docs.knock.app/developer-tools/api-keys)
- [Knock in-app feed channel ID](https://docs.knock.app/in-app-ui/react/feed#getting-started)
- [Knock Slack channel ID](https://docs.knock.app/integrations/chat/slack/building-oauth-flow#how-to-set-slack-channel-data-in-knock)

**4. If necessary, install and start postgres**

```
brew install postgresql
brew services start postgresql

# Verify postgres is running
pg_isready
> /tmp:5432 - accepting connections
```

**5. Migrate and seed database**

```
# Migrate
yarn blitz prisma migrate dev

# Seed
yarn blitz db seed
```

## Running locally

After you complete the setup steps, you can start running the app.

```
yarn blitz dev
```

This will start your application at http://localhost:3000. You can log in with these credentials:

- email: `jhammond@ingen.net`
- pw: `password`

You can take a look at the users credentials in the seed file in order to log in as a different account; all passwords are `password`.

## Next steps

This example app showcases a few features you can use with Knock. You'll want to explore:

1. Triggering workflows when a user adds a comment
2. Adjusting user preferences
3. Using the notification feed
4. Integrating Slack or Segment

### Slack notifications

In order for Slack notifications to work, you will need to expose an endpoint that Slack can access
as part of the OAuth workflow. An easy way of doing this is installing [ngrok](https://ngrok.com/) and creating a public tunnel
to your local web server.

### Segment integration

In order to send events to Segment, you'll need to the the write key from [a source you create](https://segment.com/docs/connections/sources/#create-a-source) in Segment and set it in your `.env` file as the `BLITZ_PUBLIC_SEGMENT_WRITE_KEY`, as well as setting `ENABLE_SEGMENT` to `true`. Check out the `app/lib/analytics.tsx` file to see how you can use [track, page and identify](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#basic-tracking-methods) events throughout your code to send events from this app to Segment.

## Connect with us

❤️ **Knock community Slack**

Join the community, ask questions, and request new features in the [Slack community](https://knockcustomers.slack.com/).

🤲 **Knock support**

Email us at [support@knock.app](mailto:support@knock.app).

## Practice adding Knock

If you want to use this application to follow along adding Knock to an existing application, you can switch to the `sans-knock` branch which has a limited set of features and does not include a Knock integration yet. Follow the instructions in the README to see how to add Knock from scratch.
