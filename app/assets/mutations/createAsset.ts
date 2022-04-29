import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const CreateAsset = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string(),
  project: z.object({
    connect: z.object({
      id: z.number(),
    }),
  }),
  workspace: z.object({
    connect: z.object({
      slug: z.string(),
    }),
  }),
})

export default resolver.pipe(
  resolver.zod(CreateAsset),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const asset = await db.asset.create({
      data: {
        author: {
          connect: {
            id: session.userId,
          },
        },
        ...input,
      },
      include: {
        author: true,
        project: true,
        workspace: true,
      },
    })

    return asset
  }
)
