import { resolver, Ctx, AuthenticationError } from "blitz"
import db from "db"
import { z } from "zod"

import { NEW_ASSET } from "app/lib/workflows"

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
    const recipients = asset.project.members
      .filter((m) => m.userId !== userId)
      .map((m) => `${m.userId}`)

    const notify = { success: false, workflow: NEW_ASSET }

    /*
    TODO: ADD KNOCK - TRIGGER WORKFLOW

    Add a Knock call to trigger the "new-asset" workflow and inline-identify the recipients.
    Check the return value for a "workflow_run_id" and if it's present, set notify.success to true
    */

    return { asset, notify }
  }
)
