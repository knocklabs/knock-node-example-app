import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetProject = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetProject), resolver.authorize(), async ({ id }) => {
  const project = await db.project.findFirst({
    where: {
      id,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      assets: {
        include: {
          author: true,
        },
      },
    },
  })

  if (!project) throw new NotFoundError()

  return project
})
