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

In order to send events to Segment, you'll need to the the write key from [a source you create](https://segment.com/docs/connections/sources/#create-a-source) in Segment and set it in your `.env` file as the `BLITZ_PUBLIC_SEGMENT_WRITE_KEY`, as well as setting `ENABLE_SEGMENT` to `true`. Check out the `app/lib/analytics.tsx` file to see how you can use [track, page and identify](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#basic-tracking-methods) events throughout your code to send events from this app to Segment.

## TODO: Add Knock

### Practice implementing the Knock on this branch

This branch of the Knock example app doesn't have Knock added yet. Throughout the files, you'll see the logical spaces to add calls marked with the comment `TODO: ADD KNOCK`. When added, this application will be able to do the following:

1. Trigger workflows on Knock
2. Identify users on Knock
3. Set user preferences on Knock
4. Set a recipient object with channel data to use Slack notifications
5. Render a notification feed

### Recommended order of steps

Setup: make sure you go through the steps in `Using the example app` above to make sure you have a Knock account with the required workflows and you have your environment variables available here.

Remember that whenever using a knock call, you'll have to instantiate Knock in that file to use. You can use [`"@knocklabs/client"`](https://github.com/knocklabs/knock-node) in `.tsx` files and [`"@knocklabs/node"`](https://github.com/knocklabs/knock-client-js) in `.ts` files.

**Level 1: Identify users and trigger notifications**

1. Add the Knock node SDK (`"@knocklabs/node"`)
2. Add the Knock client (`"@knocklabs/client"`)
3. Identify users on sign-in & sign-up (`/login.ts` & `/signup.ts`; `ADD KNOCK - IDENTIFY`)
4. Trigger workflows (`ADD KNOCK - NOTIFY`)
   - a. Trigger the `welcome` workflow for new users who sign up (`/signup.ts`)
   - b. Trigger the `new-asset` workflow when an asset is added (`/createAsset.ts`)
   - c. Trigger the `new-comment` workflow when a comment is added (`/createComment.ts`)

**Level 2: Handle user preferences and add the React notification feed**

1. Handle user preferences (`ADD KNOCK - PREFERENCES`)
   - a. Add the knock client into the `/NotificationPreferencesModal.tsx`. You'll want to initialize and authenticated it in the component itself.
   - b. Make a call to get preferences with the knock client, and then set those preferences in state
   - c. In the `onSubmit` handler, make a call to set preferences, and then set those updated preferences in state.
2. Add the notification feed (`ADD KNOCK - NOTIFICATION FEED`)
   - a. Make sure you have an in-app feed channel added to your Knock dashboard and the `BLITZ_PUBLIC_KNOCK_FEED_ID` set in your `.env` file with its ID.
   - b. Add `"@knocklabs/react-notification-feed"` to the project
   - c. In `/Layout.tsx`, add the `<KnockFeedProvider>`, which will also contain the `<NotificationIconButton>` and the `<NotificationFeedPopover>`. There are commented out pieces of state and refs you'll want to use in these components.

**Level 3: Add Slack notifications**
You'll see where Slack is added in `/AddSlackBtn.tsx` and where the request is handled in `/slack-cb.ts`. Follow along in the [Knock Slack documentation](https://docs.knock.app/integrations/chat/slack/slack-examples) on how to set this up for your own test workspace.

You'll see where you need to set an object and channel data in the `/slack-cb.ts` code (`ADD KNOCK - SET OBJECT; SET CHANNEL DATA`).
