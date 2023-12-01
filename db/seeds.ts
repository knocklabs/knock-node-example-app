import db from "./index"
import { SecurePassword } from "blitz"

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
