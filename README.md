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

You can take a look at the seed users credentials in the seed file in order to log in; all starter passwords are "password".

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment variables

See the `.env.sample` and `.env.test.sample` files for the env variables needed.

Here's more context on where to find the Knock variables:

- [Knock API keys](https://docs.knock.app/developer-tools/api-keys)
- [Knock in-app feed channel ID](https://docs.knock.app/in-app-ui/react/feed#getting-started)
- [Knock Slack channel ID](https://docs.knock.app/integrations/chat/slack/building-oauth-flow#how-to-set-slack-channel-data-in-knock)

## Using the example app

Before you run the example app locally, you'll need to [sign up for a Knock account](https://dashboard.knock.app/signup) to configure channels and workflows for the app to work as expected.

Once you've created your Knock account you will need to create:

1. Email and in-app feed channels
2. A workflow in Knock with the key `welcome`. It should include an email step for your welcome email template.
3. A workflow in Knock with the key `new-comment`. It should include: an in-app feed step and an email step. On these step's templates you can use the following variables which the example app is already configured to send as arguments on the workflow trigger call:
   1. `comment_content`: The content of the created comment.
   2. `asset_name`: The name of the commented asset.
   3. `asset_url`: The url of the commented asset.
   4. `project_name`: The name of the project that the comment asset belongs to.
4. A workflow in Knock with the key `new-asset`. It should include: an in-app feed step and an email step. On these step's templates you can use the following variables which the example app is already configured to send as arguments on the workflow trigger call:
   1. asset_url: The url of the commented asset.
   2. project_name: The name of the project that the comment asset belongs to.

Once you've seeded your Knock account with `yarn blitz db seed` and created the above workflows in Knock, you can use the app locally and trigger Knock workflows to send notifications from the example app.

**🚀 Tip: auto-create workflows with the CLI 🚀** <br> The example app repo contains a `knock/workflows` directory with the three workflows listed above. You can use the [Knock CLI](https://docs.knock.app/cli) to push these workflows into your Knock account using the `knock workflow push --all` command.

## Slack notifications

In order for Slack notifications to work, you will need to expose an endpoint that Slack can access
as part of the OAuth workflow. An easy way of doing this is installing [ngrok](https://ngrok.com/) and creating a public tunnel
to your local web server.

## Segment integration

In order to send events to Segment, you'll need to expose an endpoint Segment can access as [a new source's](https://segment.com/docs/connections/sources/#create-a-source) website URL. Again, you can use [ngrok](https://ngrok.com/) to create a public tunnel to your local web server. Then check out the `app/lib/analytics.tsx` file to see how you can use [track, page and identify](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#basic-tracking-methods) events throughout your code to send events from this app to Segment.
