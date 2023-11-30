import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

import { Knock, Recipient } from "@knocklabs/node"
import { NEW_COMMENT } from "app/lib/workflows"

const knockClient = new Knock(process.env.KNOCK_API_KEY, {
  host: process.env.KNOCK_API_URL,
})

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
      const recipients: Recipient[] = project.members
        .filter((m) => m.userId !== userId)
        .map((m) => `${m.userId}`)

      // Add the project as a recipient for the case we are sending Slack notifications
      recipients.push({ id: "slack_chann_test", collection: "projects2" })

      // Notify recipients on Knock. This should be done asynchronously
      // (for example using background jobs, or other similar pattern).
      const notify = {
        workflow: NEW_COMMENT,
        success: false,
      }

      try {
        await knockClient.notify(NEW_COMMENT, {
          actor: `${userId}`,
          recipients,
          data: {
            comment_content: comment.text,
            asset_name: asset.name,
            asset_url: asset.url,
            project_name: project.name,
            projectId: project.id,
          },
        })

        notify.success = true
      } catch (error) {
        console.error("Error creating comment:", error)
      }

      return { comment, notify, recipients }
    }
  }
)
