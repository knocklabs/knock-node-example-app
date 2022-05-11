import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

import { Knock } from "@knocklabs/node"

const knockClient = new Knock(process.env.KNOCK_API_KEY)

const ToggleMuted = z.object({
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(ToggleMuted),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const userId = session.userId
    const projectId = input.projectId

    const userProjectMember = await db.project_member.findFirst({
      where: {
        userId,
        projectId,
      },
    })

    await db.project_member.update({
      where: {
        id: userProjectMember.id,
      },
      data: {
        muted: !userProjectMember.muted,
      },
    })

    const user = await db.user.findFirst({
      where: { id: userId },
      include: {
        projectMemberships: true,
      },
    })

    // get all project memberships that are muted
    const mutedProjectIds = user.projectMemberships
      .filter((pm) => pm.muted)
      .map((pm) => pm.projectId)

    // store the muted projects as a variable within Knock's user
    await knockClient.users.identify(`${userId}`, {
      muted_projects: mutedProjectIds,
    })

    return {}
  }
)
