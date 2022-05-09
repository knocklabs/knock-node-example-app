[![Blitz.js](https://raw.githubusercontent.com/blitz-js/art/master/github-cover-photo.png)](https://blitzjs.com)

This is a [Blitz.js](https://github.com/blitz-js/blitz) app.

# **Example collaboration app**

## Introduction

The goal of this example is app is to showcase how can Knock be integrated in your app.

## Getting Started

First, configure the environment variables properly.

The run:

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

You can take a look at the dummy users credentials on the seed file in order to log in.

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
BLITZ_PUBLIC_SLACK_CLIENT_ID=<Slack client id>
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

## Commands

Blitz comes with a powerful CLI that is designed to make development easy and fast. You can install it with `npm i -g blitz`

```
  blitz [COMMAND]

  dev       Start a development server
  build     Create a production build
  start     Start a production server
  export    Export your Blitz app as a static application
  prisma    Run prisma commands
  generate  Generate new files for your Blitz project
  console   Run the Blitz console REPL
  install   Install a recipe
  help      Display help for blitz
  test      Run project tests
```
