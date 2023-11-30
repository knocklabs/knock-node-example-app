import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const CreateComment = z.object({
  text: z.string(),
  assetId: z.number(),
  projectId: z.number(),
  workspaceSlug: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateComment),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const userId = session.userId

    const projectId = input.projectId
    const assetId = input.assetId

    const [asset, project] = await Promise.all([
      db.asset.findFirst({
        where: {
          id: assetId,
        },
      }),
      db.project.findFirst({
        where: {
          id: projectId,
        },
        include: {
          members: true,
        },
      }),
    ])

    if (asset && project && userId) {
      const comment = await db.comment.create({
        data: {
          text: input.text,
          asset: {
            connect: {
              id: assetId,
            },
          },
          author: {
            connect: {
              id: userId,
            },
          },
          project: {
            connect: {
              id: projectId,
            },
          },
          workspace: {
            connect: {
              slug: input.workspaceSlug,
            },
          },
        },
        include: {
          asset: true,
          author: true,
          project: true,
          workspace: true,
        },
      })

      // Get all project members from the project except for the author of the comment
      const recipients = project.members
        .filter((m) => m.userId !== userId)
        .map((m) => `${m.userId}`)

      /*
      TODO: ADD KNOCK - NOTIFY
      Trigger the "new-comment" workflow and inline-identify the recipients
      */

      return { comment, recipients }
    }
  }
)
