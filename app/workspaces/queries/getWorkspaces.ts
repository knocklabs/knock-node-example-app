import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetWorkspaceInput
  extends Pick<Prisma.WorkspaceFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetWorkspaceInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: workspaces,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.workspace.count({ where }),
      query: (paginateArgs) =>
        db.workspace.findMany({ ...paginateArgs, where, orderBy, include: { projects: true } }),
    })

    return {
      workspaces,
      nextPage,
      hasMore,
      count,
    }
  }
)
