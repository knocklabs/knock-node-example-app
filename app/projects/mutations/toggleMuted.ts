import { resolver, Ctx, AuthenticationError } from "blitz"
import db from "db"
import { z } from "zod"

const ToggleMuted = z.object({
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(ToggleMuted),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const userId = session.userId
    const projectId = input.projectId

    if (!userId) {
      return new AuthenticationError()
    }

    const userProjectMember = await db.project_member.findFirst({
      where: {
        userId,
        projectId,
      },
    })

    if (userProjectMember) {
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

      if (user) {
        // get all project memberships that are muted
        const mutedProjectIds = user.projectMemberships
          .filter((pm) => pm.muted)
          .map((pm) => pm.projectId)

        /*
        TODO: ADD KNOCK - IDENTIFY

        store the muted projects as a variable within Knock's user by calling `identify` with these project IDs
        */
      }

      return {}
    }
  }
)
