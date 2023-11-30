# **Knock + Node.js example app**

This example app uses [Knock](https://knock.app) to power cross channel notifications via email and an in-app feed inside of a full-stack Node application, written in [Blitz.js](https://blitzjs.com/). It uses the [Knock Node SDK](https://github.com/knocklabs/knock-node) and [React in-app feed components](https://github.com/knocklabs/react-notification-feed).

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

### Practice implementing the Knock on this branch

This branch of the Knock example app doesn't have Knock added yet. Throughout the files, you'll see the logical spaces to add calls marked with the comment `TODO: ADD KNOCK`. When added, this application will be able to do the following:

1. [Identify users on Knock](https://docs.knock.app/managing-recipients/identifying-recipients)
2. [Trigger workflows on Knock](https://docs.knock.app/send-notifications/triggering-workflows)
3. [Inline identify users](https://docs.knock.app/reference#trigger-workflow-inline-identify)
4. [Set user preferences on Knock](https://docs.knock.app/managing-recipients/setting-preferences)
5. [Render a notification feed](https://docs.knock.app/in-app-ui/react/feed)

### Recommended order of steps

Setup: make sure you go through the steps in `Using the example app` above to make sure you have a Knock account with the required workflows and you have your environment variables available here.

1. Identify users as they log in
2. Trigger the following workflows and inline-identify the recipients:
   - `welcome` workflow for new users who sign up (`/signup.ts`)
   - `new-asset` workflow when an asset is added (`/createAsset.ts`)
   - `new-comment` workflow when a comment is added (`/createComment.ts`)
3. Let users set preferences for their notifications
4. Add the notification feed
