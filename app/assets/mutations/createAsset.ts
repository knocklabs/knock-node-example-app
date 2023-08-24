import { resolver, Ctx, AuthenticationError } from "blitz"
import db from "db"
import { z } from "zod"

import { Knock, Recipient } from "@knocklabs/node"
import { NEW_ASSET } from "app/lib/workflows"

const knockClient = new Knock(process.env.KNOCK_API_KEY)

const CreateAsset = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string(),
  projectId: z.number(),
  workspaceSlug: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateAsset),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const { name, description, url, workspaceSlug, projectId } = input
    const userId = session.userId

    if (!userId) {
      return new AuthenticationError()
    }

    const asset = await db.asset.create({
      data: {
        author: {
          connect: {
            id: userId!,
          },
        },
        workspace: {
          connect: {
            slug: workspaceSlug,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
        name,
        description,
        url,
      },
      include: {
        author: true,
        project: {
          select: {
            id: true,
            name: true,
            members: true,
          },
        },
        workspace: true,
      },
    })

    // Get all project members from the project except for the author of the asset
    const recipients: Recipient[] = asset.project.members
      .filter((m) => m.userId !== userId)
      .map((m) => `${m.userId}`)

    // Add the project as a recipient for the case we are sending Slack notifications
    recipients.push({ id: `${projectId}`, collection: "projects" })

    const notify = { success: false, workflow: NEW_ASSET }
    // Notify recipients on Knock. This should be done asynchronously
    // (for example using background jobs, or other similar pattern)
    try {
      await knockClient.notify(NEW_ASSET, {
        actor: `${userId}`,
        recipients,
        data: {
          asset_url: asset.url,
          project_name: asset.project.name,
          projectId: asset.project.id,
        },
      })
    } catch (error) {
      console.error("Create asset notification error:", error)
    }

    return { asset, notify }
  }
)
