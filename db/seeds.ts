import db from "./index"
import { SecurePassword } from "blitz"

import { Knock } from "@knocklabs/node"
import { NEW_ASSET, NEW_COMMENT } from "app/lib/workflows"

const knockClient = new Knock(process.env.KNOCK_API_KEY, {
  host: process.env.KNOCK_API_URL,
})

const seed = async () => {
  const hashedPassword = await SecurePassword.hash("password")

  const users = await Promise.all([
    db.user.create({
      data: {
        name: "John Hammond",
        email: "jhammond@ingen.net",
        hashedPassword,
        role: "USER",
      },
    }),

    db.user.create({
      data: {
        name: "Dennys Nedry",
        email: "dnedry@ingen.net",
        hashedPassword,
        role: "USER",
      },
    }),

    db.user.create({
      data: {
        name: "Alan Grant",
        email: "agrant@ingen.net",
        hashedPassword,
        role: "USER",
      },
    }),

    db.user.create({
      data: {
        name: "Ian Malcolm",
        email: "imalcolm@ingen.net",
        hashedPassword,
        role: "USER",
      },
    }),

    db.user.create({
      data: {
        name: "Ellie Sattler",
        email: "esattler@ingen.net",
        hashedPassword,
        role: "USER",
      },
    }),
  ])

  const [jhammond, dnedry, agrant, imalcolm, esattler] = users

  const ingen = await db.workspace.create({
    data: { name: "Ingen", slug: "ingen" },
  })

  const jurassicPark = await db.project.create({
    data: {
      name: "Jurassic Park",
      workspaceId: ingen.id,
    },
  })

  await Promise.all(
    users.map((u) => {
      return db.project_member.create({
        data: {
          workspaceId: ingen.id,
          projectId: jurassicPark.id,
          userId: u.id,
          muted: false,
        },
      })
    })
  )

  // If you ever need to identify all your users on Knock, you can use the bulkIdentify api
  await knockClient.users.bulkIdentify(
    users.map((u) => {
      return {
        id: `${u.id}`,
        name: u.name,
        email: u.email,
        muted_projects: [],
      }
    })
  )

  // In order to allow users to mute notifications for certain projects, we have to
  // store a condition on their preferences. In this case, we weill keep a list of muted
  // channels on the "muted_projects" property of the user's object on Knock.

  // Later, when a trigger call happens, we will send a projectId param that identifies on which
  // project the comment happened.

  await knockClient.users.bulkSetPreferences(
    users.map((u) => `${u.id}`),
    {
      workflows: {
        [NEW_COMMENT]: {
          conditions: [
            {
              variable: "recipient.muted_projects",
              operator: "not_contains",
              argument: "data.projectId",
            },
          ],
        },
        [NEW_ASSET]: {
          conditions: [
            {
              variable: "recipient.muted_projects",
              operator: "not_contains",
              argument: "data.projectId",
            },
          ],
        },
      },
    }
  )

  const trexAsset = await db.asset.create({
    data: {
      name: "Tyrannosaurus",
      description: "By far the largest carnivore in its environment, apex predator.",
      url: "https://i.ytimg.com/vi/Rc_i5TKdmhs/maxresdefault.jpg",
      projectId: jurassicPark.id,
      workspaceId: ingen.id,
      authorId: jhammond.id,
    },
  })

  const commentData = [
    {
      text: "Welcome... To Jurassic Park.",
      author: jhammond,
    },
    {
      text: "Dinosaurs and man, two species separated by sixty-five million years of evolution have just been suddenly thrown back into the mix together. How can we possibly have the slightest idea what to expect?",
      author: agrant,
    },
    {
      text: "God creates dinosaurs. God destroys dinosaurs. God creates man. Man destroys God. Man creates dinosaurs...",
      author: imalcolm,
    },
    {
      text: "Dinosaurs eat man. Woman inherits the earth...",
      author: esattler,
    },
    {
      text: "Uh uh uh! You didn't say the magic word! Uh uh uh! Uh uh uh!",
      author: dnedry,
    },
  ]

  for (const comment of commentData) {
    await db.comment.create({
      data: {
        text: comment.text,
        projectId: jurassicPark.id,
        workspaceId: ingen.id,
        assetId: trexAsset.id,
        authorId: comment.author.id,
      },
    })
  }
}

export default seed
