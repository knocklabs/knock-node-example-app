import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetAsset = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetAsset), resolver.authorize(), async ({ id }) => {
  const asset = await db.asset.findFirst({
    where: {
      id,
    },
    include: {
      author: true,
      project: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  })

  if (!asset) throw new NotFoundError()

  return asset
})
