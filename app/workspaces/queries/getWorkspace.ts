import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetWorkspace = z.object({
  // This accepts type of undefined, but is required at runtime
  slug: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetWorkspace), resolver.authorize(), async ({ slug }) => {
  const workspace = await db.workspace.findFirst({ where: { slug }, include: { projects: true } })

  if (!workspace) throw new NotFoundError()

  return workspace
})
