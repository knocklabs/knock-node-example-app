import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateComment = z.object({
  text: z.string(),
  asset: z.object({
    connect: z.object({
      id: z.number(),
    }),
  }),
  author: z.object({
    connect: z
      .object({
        id: z.number(),
      })
      .optional(),
  }),
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

export default resolver.pipe(resolver.zod(CreateComment), resolver.authorize(), async (input) => {
  const comment = await db.comment.create({
    data: input,
    include: {
      asset: true,
      author: true,
      project: true,
      workspace: true,
    },
  })

  return comment
})
